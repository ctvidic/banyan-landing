import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting (replace with Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getClientIdentifier(request: NextRequest): string {
  // Use IP address as identifier (in production, combine with user ID if authenticated)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const limit = 10; // 10 requests per minute
  const window = 60 * 1000; // 1 minute

  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + window });
    return true;
  }

  if (clientData.count >= limit) {
    return false;
  }

  clientData.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for static assets
  if (request.nextUrl.pathname.startsWith('/api/_next/')) {
    return NextResponse.next();
  }

  // Check rate limit
  const clientId = getClientIdentifier(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Create response with security headers
  const response = NextResponse.next();

  // CORS headers (adjust origin for production)
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com; media-src 'self' blob:; worker-src 'self' blob:;"
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(self), geolocation=(), payment=()'
  );

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '10');
  response.headers.set('X-RateLimit-Window', '60s');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    // Exclude static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 