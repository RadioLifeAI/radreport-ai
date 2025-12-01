// Shared Authentication Module
// Centralizes JWT validation and unauthorized response handling

import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClient } from './supabaseClient.ts';
import { getAllHeaders } from './cors.ts';

export interface AuthResult {
  user: { id: string; email?: string } | null;
  error: string | null;
  supabaseClient: SupabaseClient | null;
}

/**
 * Validates JWT token from request Authorization header
 * @param req - HTTP request object
 * @returns Authentication result with user, error, and client
 */
export async function validateAuth(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    return { 
      user: null, 
      error: 'No authorization header provided', 
      supabaseClient: null 
    };
  }

  try {
    const supabaseClient = createSupabaseClient(authHeader);
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    
    if (error || !user) {
      return { 
        user: null, 
        error: error?.message || 'Invalid or expired token', 
        supabaseClient: null 
      };
    }

    return { user, error: null, supabaseClient };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return { 
      user: null, 
      error: `Authentication failed: ${errorMessage}`, 
      supabaseClient: null 
    };
  }
}

/**
 * Creates standardized 401 Unauthorized response
 * @param req - HTTP request object (for CORS headers)
 * @param message - Optional custom error message
 * @returns 401 Response with proper headers
 */
export function unauthorizedResponse(req: Request, message = 'Unauthorized'): Response {
  return new Response(
    JSON.stringify({ error: message }), 
    { 
      status: 401, 
      headers: { 
        ...getAllHeaders(req), 
        'Content-Type': 'application/json' 
      }
    }
  );
}
