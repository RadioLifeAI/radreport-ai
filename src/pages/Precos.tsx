import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/subscription';
import { usePlatformMetrics } from '@/hooks/usePlatformMetrics';
import { generatePlanFeatures, faqs } from '@/lib/planFeaturesGenerator';

export default function Precos() {
  const navigate = useNavigate();
  const { data: platformData, isLoading: metricsLoading } = usePlatformMetrics();
  
  const [interval, setInterval] = useState<'month' | 'year'>('year');

  // Simple redirect to login/signup - no checkout logic
  const handleSelectPlan = (planCode: string) => {
    if (planCode === 'free') {
      navigate('/signup');
    } else {
      navigate(`/login?redirect=/editor&upgrade=${planCode}`);
    }
  };

  // Get price data from plan's prices array
  const getPriceForInterval = (plan: any) => {
    const prices = plan.prices || [];
    const price = prices[0]; // First active price
    
    if (!price) {
      return { monthly: 0, annual: null };
    }
    
    return {
      monthly: price.amount_cents || 0,
      annual: price.amount_cents_annual || null,
    };
  };

  const planNames = useMemo(() => {
    if (!platformData?.plans) return ['Gratuito', 'Básico', 'Profissional', 'Premium'];
    return platformData.plans.map(p => p.name);
  }, [platformData]);

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
              {metricsLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[500px] rounded-2xl bg-muted/30 animate-pulse" />
                ))
              ) : (
              platformData?.plans?.map((plan, index) => {
                  const prices = getPriceForInterval(plan);
                  const features = generatePlanFeatures(plan);
                  
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
                        badge={plan.badge}
                        onSelect={() => handleSelectPlan(plan.code)}
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
              <FeatureComparisonTable 
                plans={platformData?.plans || planNames} 
                highlightedIndex={2} 
              />
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
                  onClick={() => navigate('/signup')}
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
    </div>
  );
}
