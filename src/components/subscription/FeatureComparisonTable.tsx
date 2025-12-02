import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  name: string;
  category: string;
  values: (boolean | string | number)[];
}

interface FeatureComparisonTableProps {
  plans: string[];
  highlightedIndex?: number;
}

const features: Feature[] = [
  // IA Features
  { name: 'Tokens IA/mês', category: 'Inteligência Artificial', values: [20, 500, 4000, 8000] },
  { name: 'Conclusão IA', category: 'Inteligência Artificial', values: [true, true, true, true] },
  { name: 'Sugestões IA', category: 'Inteligência Artificial', values: [true, true, true, true] },
  { name: 'Classificação RADS', category: 'Inteligência Artificial', values: [false, true, true, true] },
  { name: 'Chat IA Radiológico', category: 'Inteligência Artificial', values: [false, false, true, true] },
  
  // Transcrição
  { name: 'Ditado por Voz', category: 'Transcrição', values: [true, true, true, true] },
  { name: 'Créditos Whisper/mês', category: 'Transcrição', values: [0, 0, 50, 200] },
  { name: 'Corretor IA de Voz', category: 'Transcrição', values: [false, false, true, true] },
  
  // Templates
  { name: 'Templates de Laudos', category: 'Templates & Frases', values: [true, true, true, true] },
  { name: 'Frases Modelo', category: 'Templates & Frases', values: [true, true, true, true] },
  { name: 'Tabelas de Referência', category: 'Templates & Frases', values: [true, true, true, true] },
  { name: 'Calculadoras Médicas', category: 'Templates & Frases', values: [true, true, true, true] },
  
  // Suporte
  { name: 'Suporte Email', category: 'Suporte', values: [true, true, true, true] },
  { name: 'Suporte Prioritário', category: 'Suporte', values: [false, false, true, true] },
  { name: 'Onboarding Dedicado', category: 'Suporte', values: [false, false, false, true] },
];

const renderValue = (value: boolean | string | number, isHighlighted: boolean) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={cn("w-5 h-5", isHighlighted ? "text-cyan-400" : "text-green-500")} />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/50" />
    );
  }
  if (typeof value === 'number') {
    if (value === 0) {
      return <Minus className="w-5 h-5 text-muted-foreground/50" />;
    }
    return (
      <span className={cn(
        "font-semibold",
        isHighlighted ? "text-cyan-400" : "text-foreground"
      )}>
        {value.toLocaleString('pt-BR')}
      </span>
    );
  }
  return <span className="text-foreground">{value}</span>;
};

export const FeatureComparisonTable = ({ plans, highlightedIndex = 2 }: FeatureComparisonTableProps) => {
  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-background/95 backdrop-blur-sm z-10">
              Recursos
            </th>
            {plans.map((plan, index) => (
              <th
                key={plan}
                className={cn(
                  "p-4 text-center text-sm font-semibold min-w-[120px]",
                  index === highlightedIndex
                    ? "gradient-text-medical"
                    : "text-foreground"
                )}
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <>
              <tr key={`category-${category}`}>
                <td
                  colSpan={plans.length + 1}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary/80 bg-muted/30 sticky left-0"
                >
                  {category}
                </td>
              </tr>
              {features
                .filter(f => f.category === category)
                .map((feature, featureIndex) => (
                  <tr
                    key={feature.name}
                    className={cn(
                      "border-b border-border/30 transition-colors",
                      "hover:bg-muted/20"
                    )}
                  >
                    <td className="p-4 text-sm text-foreground/80 sticky left-0 bg-background/95 backdrop-blur-sm">
                      {feature.name}
                    </td>
                    {feature.values.map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className={cn(
                          "p-4 text-center",
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
