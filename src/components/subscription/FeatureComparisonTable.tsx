import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanData } from '@/hooks/usePlatformMetrics';

interface FeatureComparisonTableProps {
  plans: PlanData[] | string[];
  highlightedIndex?: number;
}

// Format number for display
const formatNumber = (n: number): string => {
  if (n >= 1000) return n.toLocaleString('pt-BR');
  return n.toString();
};

// Fallback static features for when plans is string[]
const staticFeatures = [
  { name: 'Tokens IA/mês', category: 'Inteligência Artificial', values: [20, 1500, 4000, 8000] },
  { name: 'Sugestões IA', category: 'Inteligência Artificial', values: [true, true, true, true] },
  { name: 'Conclusão IA', category: 'Inteligência Artificial', values: [false, true, true, true] },
  { name: 'Classificação RADS', category: 'Inteligência Artificial', values: [false, true, true, true] },
  { name: 'Chat IA Radiológico', category: 'Inteligência Artificial', values: [false, false, true, true] },
  { name: 'Ditado por Voz', category: 'Transcrição', values: [true, true, true, true] },
  { name: 'Créditos Whisper/mês', category: 'Transcrição', values: [0, 0, 50, 200] },
  { name: 'Corretor IA de Voz', category: 'Transcrição', values: [false, false, true, true] },
  { name: 'Templates de Laudos', category: 'Conteúdo', values: [true, true, true, true] },
  { name: 'Tabelas de Referência', category: 'Conteúdo', values: [true, true, true, true] },
  { name: 'Calculadoras Médicas', category: 'Conteúdo', values: [true, true, true, true] },
  { name: 'Suporte Email', category: 'Suporte', values: [true, true, true, true] },
  { name: 'Suporte Prioritário', category: 'Suporte', values: [false, false, true, true] },
  { name: 'Onboarding Dedicado', category: 'Suporte', values: [false, false, false, true] },
];

const renderValue = (value: boolean | string | number, isHighlighted: boolean) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={cn("w-5 h-5 mx-auto", isHighlighted ? "text-cyan-400" : "text-green-500")} />
    ) : (
      <X className="w-5 h-5 mx-auto text-muted-foreground/50" />
    );
  }
  if (typeof value === 'number') {
    if (value === 0) {
      return <Minus className="w-5 h-5 mx-auto text-muted-foreground/50" />;
    }
    return (
      <span className={cn(
        "font-semibold text-sm",
        isHighlighted ? "text-cyan-400" : "text-foreground"
      )}>
        {formatNumber(value)}
      </span>
    );
  }
  if (value === '-') {
    return <Minus className="w-5 h-5 mx-auto text-muted-foreground/50" />;
  }
  return <span className="text-foreground text-sm">{value}</span>;
};

export const FeatureComparisonTable = ({ plans, highlightedIndex = 2 }: FeatureComparisonTableProps) => {
  // Check if plans is PlanData[] or string[]
  const isDataPlans = plans.length > 0 && typeof plans[0] !== 'string';
  
  // Get plan names
  const planNames = isDataPlans 
    ? (plans as PlanData[]).map(p => p.name)
    : plans as string[];

  // Build features from database or use static
  let features: { name: string; category: string; values: (boolean | string | number)[] }[];
  
  if (isDataPlans) {
    const dataPlans = plans as PlanData[];
    
    // Get unique categories in order
    const categoryOrder = ['Inteligência Artificial', 'Transcrição', 'Conteúdo', 'Suporte'];
    const categories = new Set<string>();
    dataPlans.forEach(p => p.features?.forEach(f => categories.add(f.category || 'Geral')));
    const orderedCategories = categoryOrder.filter(c => categories.has(c));
    
    // Get unique feature keys
    const featureKeys = new Map<string, { name: string; category: string; isDynamic: boolean }>();
    dataPlans.forEach(plan => {
      plan.features?.forEach(f => {
        if (!featureKeys.has(f.feature_key)) {
          // Clean up display name for table
          let displayName = f.display_name;
          if (displayName.includes('Templates, tabelas')) {
            displayName = 'Templates de Laudos';
          }
          displayName = displayName.replace('/mês', '');
          
          featureKeys.set(f.feature_key, {
            name: displayName,
            category: f.category || 'Geral',
            isDynamic: f.is_dynamic
          });
        }
      });
    });
    
    // Build feature rows
    features = [];
    orderedCategories.forEach(category => {
      Array.from(featureKeys.entries())
        .filter(([_, meta]) => meta.category === category)
        .forEach(([key, meta]) => {
          const values = dataPlans.map(plan => {
            const feature = plan.features?.find(f => f.feature_key === key);
            if (!feature) return false;
            
            if (feature.is_dynamic) {
              return feature.dynamic_value && feature.dynamic_value > 0 
                ? feature.dynamic_value 
                : 0;
            }
            return feature.is_included;
          });
          
          features.push({
            name: meta.name,
            category: meta.category,
            values
          });
        });
    });
  } else {
    features = staticFeatures;
  }

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left p-3 text-sm font-medium text-muted-foreground sticky left-0 bg-background/95 backdrop-blur-sm z-10 min-w-[160px]">
              Recursos
            </th>
            {planNames.map((name, index) => (
              <th
                key={name}
                className={cn(
                  "p-3 text-center text-sm font-semibold min-w-[100px]",
                  index === highlightedIndex
                    ? "text-cyan-400 bg-primary/5"
                    : "text-foreground"
                )}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <>
              <tr key={`category-${category}`}>
                <td
                  colSpan={planNames.length + 1}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary/80 bg-muted/30 sticky left-0"
                >
                  {category}
                </td>
              </tr>
              {features
                .filter(f => f.category === category)
                .map((feature) => (
                  <tr
                    key={feature.name}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-3 text-sm text-foreground/80 sticky left-0 bg-background/95 backdrop-blur-sm">
                      {feature.name}
                    </td>
                    {feature.values.map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className={cn(
                          "p-3 text-center",
                          valueIndex === highlightedIndex && "bg-primary/5"
                        )}
                      >
                        {renderValue(value, valueIndex === highlightedIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};
