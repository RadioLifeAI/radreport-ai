import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FeatureItem } from '@/lib/planFeaturesGenerator';

interface PricingCardProps {
  name: string;
  description: string | null;
  monthlyPrice: number;
  annualPrice: number | null;
  interval: 'month' | 'year';
  features: FeatureItem[] | string[];
  isHighlighted?: boolean;
  isCurrentPlan?: boolean;
  badge?: string | null;
  onSelect: () => void;
  isLoading?: boolean;
  isFree?: boolean;
}

export const PricingCard = ({
  name,
  description,
  monthlyPrice,
  annualPrice,
  interval,
  features,
  isHighlighted = false,
  isCurrentPlan = false,
  badge,
  onSelect,
  isLoading = false,
  isFree = false,
}: PricingCardProps) => {
  const displayPrice = interval === 'year' && annualPrice ? annualPrice : monthlyPrice;
  const monthlySavings = annualPrice ? (monthlyPrice * 12 - annualPrice) / 12 : 0;
  
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Normalize feature to FeatureItem
  const normalizeFeature = (feature: FeatureItem | string): FeatureItem => {
    if (typeof feature === 'string') {
      return { text: feature, included: true };
    }
    return feature;
  };

  return (
    <div
      className={cn(
        "relative flex flex-col p-6 rounded-2xl transition-all duration-500 h-full",
        "glass-card hover-scale",
        isHighlighted && "border-primary/50 shadow-glow scale-[1.02] lg:scale-105",
        isCurrentPlan && "ring-2 ring-green-500/50"
      )}
    >
      {/* Badges */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
        {isHighlighted && (
          <Badge className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-0 px-3 py-1 shadow-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            Mais Popular
          </Badge>
        )}
        {isCurrentPlan && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
            Seu Plano
          </Badge>
        )}
        {badge && !isHighlighted && (
          <Badge variant="secondary" className="px-3 py-1">
            {badge}
          </Badge>
        )}
      </div>

      {/* Plan Name */}
      <h3 className={cn(
        "text-xl font-bold mt-4 mb-2",
        isHighlighted ? "gradient-text-medical" : "text-foreground"
      )}>
        {name}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-4xl font-bold",
            isHighlighted ? "gradient-text-medical" : "text-foreground"
          )}>
            {isFree ? 'Grátis' : formatPrice(displayPrice)}
          </span>
          {!isFree && (
            <span className="text-muted-foreground text-sm">
              /{interval === 'year' ? 'ano' : 'mês'}
            </span>
          )}
        </div>
        
        {interval === 'year' && annualPrice && monthlySavings > 0 && (
          <div className="mt-2 text-sm">
            <span className="text-green-400 font-medium">
              Economize {formatPrice(monthlySavings * 12)}/ano
            </span>
            <span className="text-muted-foreground ml-2">
              ({formatPrice(annualPrice / 12)}/mês)
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => {
          const item = normalizeFeature(feature);
          
          return (
            <li 
              key={index} 
              className={cn(
                "flex items-start gap-3",
                !item.included && "text-muted-foreground/60"
              )}
            >
              {item.included ? (
                <Check className={cn(
                  "w-5 h-5 flex-shrink-0 mt-0.5",
                  isHighlighted ? "text-cyan-400" : "text-green-500"
                )} />
              ) : (
                <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400/60" />
              )}
              <span className={cn(
                "text-sm",
                item.included ? "text-foreground/80" : "text-muted-foreground/60 line-through",
                item.highlight && item.included && "font-semibold text-foreground"
              )}>
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA Button */}
      <Button
        onClick={onSelect}
        disabled={isLoading || isCurrentPlan}
        className={cn(
          "w-full py-6 text-base font-semibold transition-all duration-300",
          isHighlighted
            ? "btn-premium"
            : "bg-secondary hover:bg-secondary/80"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : isCurrentPlan ? (
          'Plano Atual'
        ) : isFree ? (
          'Começar Grátis'
        ) : (
          'Assinar Agora'
        )}
      </Button>
    </div>
  );
};
