import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  getClientIdentifier, 
  checkEnhancedRateLimit, 
  isSuspiciousRequest 
} from '@/lib/security';

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for static assets
  if (request.nextUrl.pathname.startsWith('/api/_next/')) {
    return NextResponse.next();
  }

  // Check for suspicious requests
  if (isSuspiciousRequest(request)) {
    return NextResponse.json(
      { error: 'Request blocked' },
      { status: 403 }
    );
  }

  // Determine operation type for enhanced rate limiting
  const pathname = request.nextUrl.pathname;
  let operation = 'general';
  
  if (pathname.includes('/openai/chat')) {
    operation = 'openai_chat';
  } else if (pathname.includes('/session') || pathname.includes('realtime')) {
    operation = 'openai_realtime';
  } else if (pathname.includes('/bill-negotiator/')) {
    operation = 'bill_negotiator';
  }

  // Check enhanced rate limit
  const clientId = getClientIdentifier(request);
  if (!checkEnhancedRateLimit(clientId, operation)) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        operation,
        retryAfter: operation === 'openai_realtime' ? '24 hours' : '1 hour'
      },
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

  // Enhanced security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://*.supabase.co; media-src 'self' blob:; worker-src 'self' blob:;"
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(self), geolocation=(), payment=()'
  );

  // Add enhanced rate limit headers
  response.headers.set('X-RateLimit-Operation', operation);
  response.headers.set('X-Client-ID', clientId.slice(0, 10) + '***'); // Partial client ID for debugging

  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 