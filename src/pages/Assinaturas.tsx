import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Stethoscope, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  PricingToggle,
  PricingCard,
  TrustBadges,
  FeatureComparisonTable,
  EmbeddedCheckoutSheet,
  CheckoutReturn,
} from '@/components/subscription';
import { usePlans } from '@/hooks/usePlans';
import { useSubscription } from '@/hooks/useSubscription';
import { useEmbeddedCheckout } from '@/hooks/useEmbeddedCheckout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const faqs = [
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

const planFeatures: Record<string, string[]> = {
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

export default function Assinaturas() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { subscription, planCode: currentPlanCode } = useSubscription();
  const { clientSecret, isLoading: checkoutLoading, initializeCheckout, clearCheckout } = useEmbeddedCheckout();
  
  const [interval, setInterval] = useState<'month' | 'year'>('year');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  // Check if returning from checkout
  const sessionId = searchParams.get('session_id');
  if (sessionId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <CheckoutReturn />
        </main>
        <Footer />
      </div>
    );
  }

  const handleSelectPlan = async (planCode: string, priceId: string | null) => {
    if (!user) {
      toast.info('Faça login para assinar um plano');
      navigate('/login?redirect=/assinaturas');
      return;
    }

    if (planCode === 'free') {
      navigate('/editor');
      return;
    }

    if (!priceId) {
      toast.error('Preço não configurado para este plano');
      return;
    }

    setSelectedPriceId(priceId);
    
    // Use hosted checkout (more reliable) - open in new tab
    const result = await initializeCheckout(priceId, false);
    
    if (result?.clientSecret) {
      setShowCheckout(true);
    }
  };

  const getPriceForInterval = (plan: any) => {
    const prices = plan.subscription_prices || [];
    const monthlyPrice = prices.find((p: any) => p.interval === 'month' && p.is_active);
    const annualPrice = prices.find((p: any) => p.interval === 'year' && p.is_active);
    
    return {
      monthly: monthlyPrice?.amount_cents || 0,
      annual: annualPrice?.amount_cents || null,
      monthlyPriceId: monthlyPrice?.id || null,
      annualPriceId: annualPrice?.id || null,
    };
  };

  const planNames = useMemo(() => {
    if (!plans) return ['Gratuito', 'Básico', 'Profissional', 'Premium'];
    return plans.map(p => p.name);
  }, [plans]);

  return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="relative pt-24 pb-12 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50" />
            <div className="absolute inset-0 login-hero-glow opacity-30" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-in">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Potencialize seus Laudos</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                  <span className="gradient-text-medical">Planos</span> para cada
                  <br />necessidade
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
                  Escolha o plano ideal para sua prática. Upgrade ou downgrade a qualquer momento.
                </p>

                {/* Pricing Toggle */}
                <div className="animate-fade-in">
                  <PricingToggle interval={interval} onChange={setInterval} />
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-12 relative">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-7xl mx-auto">
                {plansLoading ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[500px] rounded-2xl bg-muted/30 animate-pulse" />
                  ))
                ) : (
                  plans?.map((plan, index) => {
                    const prices = getPriceForInterval(plan);
                    const priceId = interval === 'year' ? prices.annualPriceId : prices.monthlyPriceId;
                    const features = planFeatures[plan.code] || planFeatures.free;
                    
                    return (
                      <div
                        key={plan.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <PricingCard
                          name={plan.name}
                          description={plan.description}
                          monthlyPrice={prices.monthly}
                          annualPrice={prices.annual}
                          interval={interval}
                          features={features}
                          isHighlighted={plan.is_highlighted}
                          isCurrentPlan={currentPlanCode === plan.code}
                          badge={plan.badge}
                          onSelect={() => handleSelectPlan(plan.code, priceId)}
                          isLoading={checkoutLoading && selectedPriceId === priceId}
                          isFree={plan.code === 'free'}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* Trust Badges */}
          <section className="py-8 border-y border-border/30">
            <div className="container mx-auto px-4">
              <TrustBadges />
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Compare os <span className="gradient-text-medical">Recursos</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Veja em detalhes o que cada plano oferece para sua prática radiológica
                </p>
              </div>
              
              <div className="glass-card rounded-2xl p-6 overflow-hidden">
                <FeatureComparisonTable plans={planNames} highlightedIndex={2} />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Perguntas <span className="gradient-text-medical">Frequentes</span>
                </h2>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="glass-card rounded-xl px-6 border-none"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-5">
                        <span className="font-medium text-foreground">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-cyan-500/10" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-2xl mx-auto">
                <Brain className="w-16 h-16 mx-auto mb-6 text-primary animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Pronto para <span className="gradient-text-medical">transformar</span> seus laudos?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Comece gratuitamente e descubra como a IA pode acelerar sua produtividade.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="btn-premium px-8 py-6 text-lg"
                    onClick={() => {
                      if (!user) {
                        navigate('/signup');
                      } else {
                        navigate('/editor');
                      }
                    }}
                  >
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Começar Gratuitamente
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Embedded Checkout Sheet */}
        <EmbeddedCheckoutSheet
          open={showCheckout}
          onOpenChange={(open) => {
            setShowCheckout(open);
            if (!open) clearCheckout();
          }}
          clientSecret={clientSecret}
          onComplete={() => {
            setShowCheckout(false);
            navigate('/assinaturas?session_id=completed');
          }}
        />
      </div>
  );
}
