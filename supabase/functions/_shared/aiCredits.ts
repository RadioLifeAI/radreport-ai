// AI Credits System - Shared Module
// Handles credit verification and consumption for all AI Edge Functions

import { SupabaseClient } from "npm:@supabase/supabase-js@2";

// Cost mapping per AI function (in credits)
export const AI_CREDIT_COSTS: Record<string, number> = {
  'ai-generate-conclusion': 1,
  'ai-suggestion-review': 2,
  'ai-rads-classification': 1,
  'ai-dictation-polish': 1,
  'ai-inline-edit': 1,
  'ai-voice-inline-edit': 1,
  'radreport-chat': 1,
};

export interface CreditCheckResult {
  hasCredits: boolean;
  balance: number;
  required: number;
}

export interface CreditConsumeResult {
  success: boolean;
  balanceAfter: number;
  message: string;
}

/**
 * Check if user has enough AI credits
 */
export async function checkAICredits(
  supabaseAdmin: SupabaseClient,
  userId: string,
  creditsNeeded: number
): Promise<CreditCheckResult> {
  const { data, error } = await supabaseAdmin.rpc('check_ai_credits', {
    p_user_id: userId
  });

  if (error) {
    console.error('[aiCredits] check_ai_credits RPC error:', error);
    return { hasCredits: false, balance: 0, required: creditsNeeded };
  }

  const balance = data?.[0]?.balance ?? 0;
  return {
    hasCredits: balance >= creditsNeeded,
    balance,
    required: creditsNeeded
  };
}

/**
 * Consume AI credits after successful operation
 */
export async function consumeAICredits(
  supabaseAdmin: SupabaseClient,
  userId: string,
  credits: number,
  featureUsed: string,
  description: string = 'AI operation'
): Promise<CreditConsumeResult> {
  const { data, error } = await supabaseAdmin.rpc('consume_ai_credits', {
    p_user_id: userId,
    p_credits_to_consume: credits,
    p_feature_used: featureUsed,
    p_description: description,
    p_metadata: {}
  });

  if (error) {
    console.error('[aiCredits] consume_ai_credits RPC error:', error);
    return { success: false, balanceAfter: 0, message: error.message };
  }

  const result = data?.[0];
  return {
    success: result?.success ?? false,
    balanceAfter: result?.balance_after ?? 0,
    message: result?.message ?? 'Unknown error'
  };
}

/**
 * Standard 402 response for insufficient credits
 */
export function insufficientCreditsResponse(
  corsHeaders: Record<string, string>,
  balance: number,
  required: number
): Response {
  return new Response(
    JSON.stringify({
      error: 'INSUFFICIENT_CREDITS',
      message: 'Créditos AI insuficientes',
      balance,
      required,
      upgrade_required: true
    }),
    {
      status: 402,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
