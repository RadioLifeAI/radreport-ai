// Shared Supabase Admin Client Module
// Creates singleton admin client with SERVICE_ROLE for RLS-bypassing operations

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * Gets or creates singleton Supabase admin client with service role
 * Used for operations that bypass RLS (e.g., logging, admin operations)
 * @returns Supabase admin client instance
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
  return adminClient;
}
