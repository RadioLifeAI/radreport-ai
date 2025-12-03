import type { PlanData, PlanFeature } from '@/hooks/usePlatformMetrics';

export interface FeatureItem {
  text: string;
  included: boolean;
  highlight?: boolean;
  isPrimary?: boolean;
}

// Format large numbers for display
const formatNumber = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}.000`;
  return n.toString();
};

/**
 * Generates a list of features for a subscription plan based on database data
 * Filters by show_in_card and formats dynamic values
 */
export function generatePlanFeatures(plan: PlanData): FeatureItem[] {
  if (!plan.features || plan.features.length === 0) {
    // Fallback for plans without features
    return [
      { text: `${formatNumber(plan.ai_tokens_monthly)} tokens IA/mês`, included: true, highlight: true, isPrimary: true },
      { text: 'Ditado por voz nativo', included: true },
      { text: 'Templates e frases modelo', included: true },
      { text: 'Tabelas de referência', included: true },
    ];
  }

  // Filter only features that should show in card
  return plan.features
    .filter(f => f.show_in_card !== false)
    .map((f: PlanFeature) => {
      let text = f.display_name;
      
      // For dynamic features, format the value
      if (f.is_dynamic && f.dynamic_value !== null && f.dynamic_value > 0) {
        text = `${formatNumber(f.dynamic_value)} ${f.dynamic_suffix || f.display_name}`;
      } else if (f.is_dynamic && (f.dynamic_value === null || f.dynamic_value === 0)) {
        // Dynamic feature with no value - show as "Sem X"
        const suffix = f.dynamic_suffix || f.display_name;
        text = `Sem ${suffix.toLowerCase().replace('/mês', '').trim()}`;
      }
      
      return {
        text,
        included: f.is_included,
        highlight: f.is_dynamic && f.is_included,
        isPrimary: f.is_primary
      };
    });
}

/**
 * Get all features for comparison table (includes features hidden from cards)
 */
export function getAllPlanFeatures(plan: PlanData): FeatureItem[] {
  if (!plan.features || plan.features.length === 0) {
    return [];
  }

  return plan.features.map((f: PlanFeature) => {
    let text = f.display_name;
    
    if (f.is_dynamic && f.dynamic_value !== null && f.dynamic_value > 0) {
      text = `${formatNumber(f.dynamic_value)} ${f.dynamic_suffix || f.display_name}`;
    } else if (f.is_dynamic && (f.dynamic_value === null || f.dynamic_value === 0)) {
      text = '-';
    }
    
    return {
      text,
      included: f.is_included,
      highlight: f.is_dynamic && f.is_included,
      isPrimary: f.is_primary
    };
  });
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
