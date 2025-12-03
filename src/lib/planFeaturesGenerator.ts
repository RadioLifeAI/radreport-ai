import type { PlatformMetrics, PlanData } from '@/hooks/usePlatformMetrics';

export interface FeatureItem {
  text: string;
  included: boolean;
  highlight?: boolean;
}

// Format large numbers for display
const formatNumber = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}.000`;
  return n.toString();
};

/**
 * Generates a list of features for a subscription plan based on database data
 * @param plan Plan data from database
 * @param metrics Platform metrics from database (templates count, etc.)
 * @returns Array of FeatureItem with text, included status, and optional highlight
 */
export function generatePlanFeatures(
  plan: PlanData,
  metrics: PlatformMetrics
): FeatureItem[] {
  const features: FeatureItem[] = [];

  // 1. AI Tokens - always show
  const tokensText = `${formatNumber(plan.ai_tokens_monthly)} tokens IA/mês`;
  features.push({ text: tokensText, included: true, highlight: true });

  // 2. Plan-specific features based on code (hierarchy)
  switch (plan.code) {
    case 'free':
      features.push({ text: `${metrics.templates_count} templates de laudo`, included: true });
      features.push({ text: `${metrics.frases_count} frases modelo`, included: true });
      features.push({ text: `${metrics.tables_count}+ tabelas de referência`, included: true });
      features.push({ text: `${metrics.calculators_count} calculadoras médicas`, included: true });
      features.push({ text: 'Ditado por voz (Web Speech)', included: true });
      features.push({ text: 'IA Sugestões', included: plan.feature_ai_suggestions });
      features.push({ text: 'IA Conclusão', included: plan.feature_ai_conclusion });
      features.push({ text: 'Classificação RADS', included: plan.feature_ai_rads });
      features.push({ text: 'Whisper Premium', included: plan.feature_whisper });
      break;

    case 'basico':
      features.push({ text: 'Tudo do Gratuito', included: true, highlight: true });
      features.push({ text: 'IA Conclusão (2 tokens/uso)', included: plan.feature_ai_conclusion });
      features.push({ text: 'IA Sugestões', included: plan.feature_ai_suggestions });
      features.push({ text: 'Classificação RADS', included: plan.feature_ai_rads });
      features.push({ text: 'Whisper Premium', included: plan.feature_whisper });
      features.push({ text: 'Suporte prioritário', included: plan.feature_priority_support });
      break;

    case 'profissional':
      features.push({ text: 'Tudo do Básico', included: true, highlight: true });
      features.push({
        text: `${plan.whisper_credits_monthly} créditos Whisper/mês`,
        included: plan.whisper_credits_monthly > 0,
      });
      features.push({ text: 'Chat IA Radiológico', included: true });
      features.push({ text: 'Corretor IA de Voz', included: true });
      features.push({ text: 'Classificação RADS', included: plan.feature_ai_rads });
      features.push({ text: 'Suporte prioritário', included: plan.feature_priority_support });
      break;

    case 'premium':
      features.push({ text: 'Tudo do Profissional', included: true, highlight: true });
      features.push({
        text: `${plan.whisper_credits_monthly} créditos Whisper/mês`,
        included: true,
      });
      features.push({ text: 'Onboarding dedicado', included: true });
      features.push({ text: 'Suporte VIP', included: true });
      break;

    default:
      // Fallback for unknown plan codes
      features.push({ text: `${metrics.templates_count} templates`, included: true });
      features.push({ text: `${metrics.frases_count} frases modelo`, included: true });
      break;
  }

  return features;
}

// Re-export faqs for backward compatibility
export const faqs = [
  {
    question: 'Como funciona o período de teste?',
    answer:
      'Todos os planos começam com acesso imediato. O plano gratuito permite testar as funcionalidades básicas sem compromisso. Você pode fazer upgrade a qualquer momento.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer:
      'Sim! Não há multas ou taxas de cancelamento. Você mantém acesso até o final do período pago e pode cancelar diretamente pelo portal de assinatura.',
  },
  {
    question: 'O que são tokens de IA?',
    answer:
      'Tokens são unidades de consumo para funcionalidades de IA. Cada geração de conclusão ou sugestão consome aproximadamente 2 tokens. Os tokens são renovados mensalmente.',
  },
  {
    question: 'Os créditos Whisper são separados dos tokens?',
    answer:
      'Sim. Créditos Whisper são usados exclusivamente para transcrição de áudio de alta qualidade. 1 crédito = 1 minuto de áudio transcrito.',
  },
  {
    question: 'Como funciona o suporte prioritário?',
    answer:
      'Assinantes dos planos Profissional e Premium têm acesso a suporte via email com resposta em até 24h úteis, além de acesso direto ao WhatsApp da equipe.',
  },
  {
    question: 'Posso trocar de plano depois?',
    answer:
      'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença de valor é calculada proporcionalmente.',
  },
];
