// Shared CORS and Security Headers Module
// Provides dynamic origin validation and standard security headers

const ALLOWED_ORIGINS = [
  'https://radreport.com.br',
  'https://www.radreport.com.br',
];

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/.*\.lovable\.app$/,   // Lovable previews
  /^https:\/\/.*\.lovable\.dev$/,   // Lovable dev
];

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || '';
  
  // Check exact match
  let isAllowed = ALLOWED_ORIGINS.includes(origin);
  
  // Check regex patterns
  if (!isAllowed) {
    isAllowed = ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
  }
  
  // Allow localhost for dev
  if (!isAllowed && origin.startsWith('http://localhost:')) {
    isAllowed = true;
  }
  
  const allowedOrigin = isAllowed ? origin : 'null';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-client-info, apikey',
    'Access-Control-Max-Age': '86400', // 24 hours preflight cache
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin', // Ensures correct caching with CDN/proxies
  };
}

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate', // Prevent API response caching
};

export function getAllHeaders(request: Request): Record<string, string> {
  return {
    ...getCorsHeaders(request),
    ...securityHeaders,
  };
}
