// CORS headers to allow requests from both localhost and production
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Will restrict to specific origins in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Email validation regex
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get allowed origins based on environment
export function getAllowedOrigins(): string[] {
  const origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]
  
  // Add production domain if available
  const productionDomain = Deno.env.get('PRODUCTION_DOMAIN')
  if (productionDomain) {
    origins.push(`https://${productionDomain}`)
    origins.push(`https://www.${productionDomain}`)
  }
  
  return origins
}

// Check if origin is allowed
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  const allowedOrigins = getAllowedOrigins()
  return allowedOrigins.includes(origin)
}

// Get CORS headers with specific origin
export function getCorsHeaders(origin: string | null): Record<string, string> {
  if (isOriginAllowed(origin)) {
    return {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin,
    }
  }
  return corsHeaders
} 