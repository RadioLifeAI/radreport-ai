import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Sparkles, Lock, Crown } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { useSubscription } from '@/hooks/useSubscription';
import { PricingToggle } from './PricingToggle';
import { PricingCard } from './PricingCard';
import { useState } from 'react';
import { planFeatures } from '@/lib/planFeatures';

interface PlansSelectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (priceId: string) => void;
  isLoading?: boolean;
}

export const PlansSelectionSheet = ({
  open,
  onOpenChange,
  onSelectPlan,
  isLoading = false,
}: PlansSelectionSheetProps) => {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { planCode: currentPlanCode } = useSubscription();
  const [interval, setInterval] = useState<'month' | 'year'>('year');
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const getPriceForInterval = (plan: any) => {
    const prices = plan.subscription_prices || [];
    const monthlyPrice = prices.find((p: any) => p.interval === 'month' && p.is_active);
    const annualPrice = prices.find((p: any) => p.interval === 'year' && p.is_active);
    
    return {
      monthly: monthlyPrice?.amount_cents || 0,
      annual: annualPrice?.amount_cents || null,
      // Pass UUID of the record, NOT stripe_price_id - Edge Function handles environment selection
      monthlyPriceId: monthlyPrice?.id || null,
      annualPriceId: annualPrice?.id || null,
    };
  };

  const handleSelectPlan = (planCode: string, priceId: string | null) => {
    if (planCode === 'free' || !priceId) return;
    setSelectedPriceId(priceId);
    onSelectPlan(priceId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] overflow-hidden p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl">
        {/* Header with gradient background */}
        <div className="relative px-6 py-6 border-b border-border/30 bg-gradient-to-r from-cyan-500/10 via-indigo-500/5 to-cyan-500/10">
          <div className="absolute inset-0 login-hero-glow opacity-20" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-primary" />
              <DialogTitle className="text-2xl font-bold gradient-text-medical">
                Escolha seu Plano
              </DialogTitle>
            </div>
            <p className="text-center text-muted-foreground text-sm">
              Potencialize seus laudos com recursos avançados de IA
            </p>
          </DialogHeader>
          
          {/* Pricing Toggle */}
          <div className="flex justify-center mt-4">
            <PricingToggle interval={interval} onChange={setInterval} />
          </div>
        </div>
        
        {/* Scrollable content area */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
          {plansLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans?.map((plan, index) => {
                const prices = getPriceForInterval(plan);
                const priceId = interval === 'year' ? prices.annualPriceId : prices.monthlyPriceId;
                const features = planFeatures[plan.code] || planFeatures.free;
                const isCurrentPlan = plan.code === currentPlanCode;
                const isFree = plan.code === 'free';

                return (
                  <div
                    key={plan.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PricingCard
                      name={plan.name}
                      description={plan.description}
                      monthlyPrice={prices.monthly}
                      annualPrice={prices.annual}
                      interval={interval}
                      features={features}
                      isHighlighted={plan.is_highlighted}
                      isCurrentPlan={isCurrentPlan}
                      badge={plan.badge}
                      onSelect={() => handleSelectPlan(plan.code, priceId)}
                      isLoading={isLoading && selectedPriceId === priceId}
                      isFree={isFree}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with trust badge */}
        <div className="px-6 py-4 border-t border-border/30 bg-muted/30">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Pagamento seguro via</span>
            <span className="font-semibold text-foreground">Stripe</span>
            <span className="mx-2">•</span>
            <span>Cancele a qualquer momento</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
