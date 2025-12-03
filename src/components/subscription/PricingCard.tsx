import { Check, X, Sparkles, Loader2, BarChart3, Mic } from 'lucide-react';
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

  // Separate primary features (tokens, credits) from other features
  const normalizedFeatures = features.map(normalizeFeature);
  const primaryFeatures = normalizedFeatures.filter(f => f.isPrimary);
  const otherFeatures = normalizedFeatures.filter(f => !f.isPrimary);

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 rounded-2xl transition-all duration-500 h-full",
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
        "text-lg font-bold mt-3 mb-1",
        isHighlighted ? "gradient-text-medical" : "text-foreground"
      )}>
        {name}
      </h3>
      
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-3xl font-bold",
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
          <div className="mt-1 text-xs">
            <span className="text-green-400 font-medium">
              Economize {formatPrice(monthlySavings * 12)}/ano
            </span>
          </div>
        )}
      </div>

      {/* Primary Features - Tokens & Credits */}
      {primaryFeatures.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
          {primaryFeatures.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.text.toLowerCase().includes('token') ? (
                <BarChart3 className={cn(
                  "w-4 h-4 flex-shrink-0",
                  item.included ? "text-cyan-400" : "text-muted-foreground/50"
                )} />
              ) : (
                <Mic className={cn(
                  "w-4 h-4 flex-shrink-0",
                  item.included ? "text-cyan-400" : "text-muted-foreground/50"
                )} />
              )}
              <span className={cn(
                "text-sm font-medium",
                item.included ? "text-foreground" : "text-muted-foreground/60"
              )}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Other Features */}
      <ul className="space-y-2 mb-6 flex-1">
        {otherFeatures.map((item, index) => (
          <li 
            key={index} 
            className={cn(
              "flex items-start gap-2",
              !item.included && "opacity-50"
            )}
          >
            {item.included ? (
              <Check className={cn(
                "w-4 h-4 flex-shrink-0 mt-0.5",
                isHighlighted ? "text-cyan-400" : "text-green-500"
              )} />
            ) : (
              <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground/50" />
            )}
            <span className={cn(
              "text-sm",
              item.included ? "text-foreground/80" : "text-muted-foreground/50"
            )}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        onClick={onSelect}
        disabled={isLoading || isCurrentPlan}
        className={cn(
          "w-full py-5 text-sm font-semibold transition-all duration-300",
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
