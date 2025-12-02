// Shared plan features for both public pricing page and internal modal

export const planFeatures: Record<string, string[]> = {
  free: [
    '20 tokens IA/mês',
    'Ditado por voz nativo',
    'Templates e frases modelo',
    'Tabelas de referência',
    'Calculadoras médicas',
    'Suporte por email',
  ],
  basico: [
    '500 tokens IA/mês',
    'Ditado por voz nativo',
    'Classificação RADS',
    'Templates e frases modelo',
    'Tabelas de referência',
    'Calculadoras médicas',
    'Suporte por email',
  ],
  profissional: [
    '4.000 tokens IA/mês',
    '50 créditos Whisper/mês',
    'Chat IA Radiológico',
    'Corretor IA de Voz',
    'Classificação RADS',
    'Suporte Prioritário',
    'Todas funcionalidades',
  ],
  premium: [
    '8.000 tokens IA/mês',
    '200 créditos Whisper/mês',
    'Chat IA Radiológico',
    'Corretor IA de Voz',
    'Onboarding dedicado',
    'Suporte VIP',
    'Todas funcionalidades',
  ],
};

export const faqs = [
  {
    question: "Como funciona o período de teste?",
    answer: "Todos os planos começam com acesso imediato. O plano gratuito permite testar as funcionalidades básicas sem compromisso. Você pode fazer upgrade a qualquer momento."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Não há multas ou taxas de cancelamento. Você mantém acesso até o final do período pago e pode cancelar diretamente pelo portal de assinatura."
  },
  {
    question: "O que são tokens de IA?",
    answer: "Tokens são unidades de consumo para funcionalidades de IA. Cada geração de conclusão ou sugestão consome aproximadamente 2 tokens. Os tokens são renovados mensalmente."
  },
  {
    question: "Os créditos Whisper são separados dos tokens?",
    answer: "Sim. Créditos Whisper são usados exclusivamente para transcrição de áudio de alta qualidade. 1 crédito = 1 minuto de áudio transcrito."
  },
  {
    question: "Como funciona o suporte prioritário?",
    answer: "Assinantes dos planos Profissional e Premium têm acesso a suporte via email com resposta em até 24h úteis, além de acesso direto ao WhatsApp da equipe."
  },
  {
    question: "Posso trocar de plano depois?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença de valor é calculada proporcionalmente."
  }
];
