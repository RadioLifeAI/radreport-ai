import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, Check, Crown, Sparkles, Mic } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { useSubscription } from '@/hooks/useSubscription';
import { PricingToggle } from './PricingToggle';
import { useState } from 'react';

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
  const { planCode } = useSubscription();
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  const getPriceForInterval = (plan: any) => {
    const prices = plan.subscription_prices || [];
    return prices.find((p: any) => p.interval === interval && p.is_active);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl md:max-w-2xl p-0 overflow-hidden"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/30">
          <SheetTitle className="text-xl font-bold gradient-text-medical flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Escolha seu Plano
          </SheetTitle>
        </SheetHeader>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Interval Toggle */}
          <div className="flex justify-center">
            <PricingToggle interval={interval} onChange={setInterval} />
          </div>

          {plansLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              {plans?.map((plan) => {
                const price = getPriceForInterval(plan);
                const isCurrentPlan = plan.code === planCode;
                const isFree = plan.code === 'free';

                return (
                  <Card 
                    key={plan.id}
                    className={`p-4 relative transition-all ${
                      isCurrentPlan 
                        ? 'border-primary/50 bg-primary/5' 
                        : plan.is_highlighted 
                          ? 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5' 
                          : 'border-border/40 hover:border-border/60'
                    }`}
                  >
                    {/* Current Plan Badge */}
                    {isCurrentPlan && (
                      <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                        Seu Plano
                      </Badge>
                    )}

                    {/* Popular Badge */}
                    {plan.is_highlighted && !isCurrentPlan && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs">
                        Popular
                      </Badge>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                        
                        {/* Features Summary */}
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Sparkles size={12} className="text-cyan-400" />
                            {plan.ai_tokens_monthly} tokens/mês
                          </span>
                          {plan.whisper_credits_monthly > 0 && (
                            <span className="flex items-center gap-1">
                              <Mic size={12} className="text-indigo-400" />
                              {plan.whisper_credits_monthly} Whisper/mês
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        {isFree ? (
                          <div className="text-2xl font-bold text-foreground">Grátis</div>
                        ) : price ? (
                          <>
                            <div className="text-2xl font-bold text-foreground">
                              {formatPrice(price.amount_cents)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              /{interval === 'month' ? 'mês' : 'ano'}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">—</div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      {isCurrentPlan ? (
                        <Button disabled className="w-full" variant="outline">
                          <Check size={16} className="mr-2" />
                          Plano Atual
                        </Button>
                      ) : isFree ? (
                        <Button disabled variant="ghost" className="w-full text-muted-foreground">
                          Plano Básico
                        </Button>
                      ) : price?.stripe_price_id ? (
                        <Button 
                          onClick={() => onSelectPlan(price.stripe_price_id)}
                          className={`w-full ${
                            plan.is_highlighted 
                              ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600' 
                              : ''
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            'Assinar'
                          )}
                        </Button>
                      ) : (
                        <Button disabled variant="outline" className="w-full">
                          Indisponível
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
