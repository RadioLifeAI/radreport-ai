// Shared Supabase Client Module
// Creates Supabase client with ANON KEY for RLS-enabled operations

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with user authentication context
 * @param authHeader - Optional Authorization header from request
 * @returns Configured Supabase client instance
 */
export function createSupabaseClient(authHeader?: string | null): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    authHeader 
      ? { 
          global: { 
            headers: { Authorization: authHeader } 
          } 
        }
      : undefined
  );
}
