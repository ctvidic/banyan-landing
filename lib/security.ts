import { NextRequest } from 'next/server';
import { z } from 'zod';

// Enhanced rate limiting with different limits for different operations
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  openai_chat: { windowMs: 60 * 60 * 1000, maxRequests: 100 }, // 100 per hour
  openai_realtime: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 50 }, // 50 per day
  bill_negotiator: { windowMs: 60 * 60 * 1000, maxRequests: 200 }, // 200 per hour
  general: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute (existing)
};

// In-memory storage for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Get client identifier for rate limiting
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
  const userAgent = request.headers.get('user-agent')?.slice(0, 100) || 'unknown';
  return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 20)}`;
}

// Enhanced rate limiting with operation-specific limits
export function checkEnhancedRateLimit(clientId: string, operation: string): boolean {
  const config = RATE_LIMITS[operation] || RATE_LIMITS.general;
  const key = `${operation}-${clientId}`;
  const now = Date.now();
  
  const clientData = rateLimitStore.get(key);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return true;
  }
  
  if (clientData.count >= config.maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
}

// API Authentication for OpenAI routes
export function validateApiRequest(request: NextRequest): boolean {
  // Check if request is from our own domain
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  // Allow requests from same origin
  if (origin && host) {
    const originUrl = new URL(origin);
    if (originUrl.host === host) {
      return true;
    }
  }
  
  // Allow requests with proper referer
  if (referer && host) {
    const refererUrl = new URL(referer);
    if (refererUrl.host === host) {
      return true;
    }
  }
  
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    const allowedDev = ['localhost:3000', '127.0.0.1:3000'];
    if (origin) {
      const originUrl = new URL(origin);
      if (allowedDev.includes(originUrl.host)) {
        return true;
      }
    }
  }
  
  return false;
}

// Generate simple request signature for additional security
export function generateRequestSignature(body: string, timestamp: string): string {
  const secret = process.env.API_SECRET || 'default-dev-secret';
  const data = `${body}${timestamp}${secret}`;
  
  // Simple hash (use crypto.createHmac in production)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Validation schemas for bill negotiator
export const reportSchema = z.object({
  strengths: z.array(z.string().max(200)).max(10).optional().default([]),
  improvements: z.array(z.string().max(200)).max(10).optional().default([]),
  outcome: z.string().max(1000).optional().default(''),
  rating: z.string().max(20).optional().default(''),
  starCount: z.number().min(0).max(5).optional().default(0),
  confettiWorthy: z.boolean().optional().default(false),
  offerType: z.enum(['credit', 'monthlyDiscount', 'none']).optional().default('none'),
  creditAmount: z.number().min(0).max(1000).optional().default(0),
  discountPerMonth: z.number().min(0).max(100).optional().default(0),
  finalBill: z.number().min(0).max(200).optional().default(89),
  reduction: z.number().min(0).max(100).optional().default(0),
});

export const saveScoreSchema = z.object({
  report: reportSchema,
  sessionDuration: z.number().min(0).max(600).optional(), // Max 10 minutes
  email: z.string().email().max(254).optional(),
  username: z.string().max(50).optional(),
});

export const chatRequestSchema = z.object({
  prompt: z.string().max(15000).optional(),
  sysPrompt: z.string().max(2000).optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000)
  })).max(20).optional(),
});

// Sanitize strings to prevent injection
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .trim()
    .slice(0, 10000); // Increased from 1000 to 10000 to allow for transcripts
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Check if request is potentially malicious
export function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const origin = request.headers.get('origin') || '';
  
  // Flag suspicious user agents
  const suspiciousPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 
    'python', 'curl', 'wget', 'postman'
  ];
  
  const isSuspiciousUA = suspiciousPatterns.some(pattern => 
    userAgent.toLowerCase().includes(pattern)
  );
  
  // Allow common browsers and dev tools
  const allowedPatterns = [
    'chrome', 'firefox', 'safari', 'edge', 'opera',
    'postman', // Allow Postman for development
  ];
  
  const isAllowedUA = allowedPatterns.some(pattern =>
    userAgent.toLowerCase().includes(pattern)
  );
  
  // In development, be more permissive
  if (process.env.NODE_ENV === 'development') {
    return false;
  }
  
  return isSuspiciousUA && !isAllowedUA;
} 