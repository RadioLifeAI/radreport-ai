import { cn } from '@/lib/utils';

interface PricingToggleProps {
  interval: 'month' | 'year';
  onChange: (interval: 'month' | 'year') => void;
}

export const PricingToggle = ({ interval, onChange }: PricingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-muted/50 backdrop-blur-sm border border-border/30">
      <button
        onClick={() => onChange('month')}
        className={cn(
          "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
          interval === 'month'
            ? "bg-primary text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Mensal
      </button>
      <button
        onClick={() => onChange('year')}
        className={cn(
          "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
          interval === 'year'
            ? "bg-primary text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Anual
        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500/20 text-green-400 animate-pulse">
          -20%
        </span>
      </button>
    </div>
  );
};
