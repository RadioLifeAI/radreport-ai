import { ChevronLeft, Calculator, Table2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { RadiologyCalculator } from '@/lib/radiologyCalculators'
import { RadiologyTable } from '@/lib/radiologyTables'

interface EditorLeftSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  recentTemplates: any[]
  recentFrases: any[]
  onTemplateSelect: (template: any) => void
  onFraseSelect: (frase: any) => void
  isMobile?: boolean
  topFavoriteCalculators?: RadiologyCalculator[]
  topFavoriteTables?: RadiologyTable[]
  onCalculatorSelect?: (calculator: RadiologyCalculator) => void
  onTableSelect?: (table: RadiologyTable) => void
}

export function EditorLeftSidebar({
  collapsed,
  onToggleCollapse,
  recentTemplates,
  recentFrases,
  onTemplateSelect,
  onFraseSelect,
  isMobile = false,
  topFavoriteCalculators = [],
  topFavoriteTables = [],
  onCalculatorSelect,
  onTableSelect,
}: EditorLeftSidebarProps) {
  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="absolute left-0 top-20 z-40 bg-card border border-border/40 rounded-r-lg p-1 hover:bg-muted transition-colors"
        title="Expandir sidebar"
      >
        <ChevronLeft size={16} className="rotate-180" />
      </button>
    )
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggleCollapse}
        />
      )}
      
      <aside className={cn(
        "border-r border-border/40 bg-card/50 backdrop-blur-sm overflow-y-auto transition-all duration-300",
        "fixed md:relative inset-y-0 left-0 z-50 md:z-auto",
        "w-[280px] md:w-64"
      )}>
        <div className="p-4 space-y-6">
          {/* Templates Recentes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Templates Recentes</h3>
            <div className="space-y-1">
              {recentTemplates.slice(0, 4).map(template => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{template.titulo}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      template.modalidade === 'RM' ? 'bg-purple-500/20 text-purple-300' :
                      template.modalidade === 'TC' ? 'bg-blue-500/20 text-blue-300' :
                      template.modalidade === 'USG' ? 'bg-green-500/20 text-green-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {template.modalidade}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frases Recentes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Frases Recentes</h3>
            <div className="space-y-1">
              {recentFrases.slice(0, 4).map(frase => (
                <button
                  key={frase.id}
                  onClick={() => onFraseSelect(frase)}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{frase.codigo}</span>
              {frase.modalidade_id && (() => {
                const modalityMap = { 'US': 'USG', 'TC': 'TC', 'RM': 'RM', 'RX': 'RX', 'MM': 'MG' };
                const modality = modalityMap[frase.modalidade_id as keyof typeof modalityMap] || frase.modalidade_id;
                return (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    modality === 'RM' ? 'bg-purple-500/20 text-purple-300' :
                    modality === 'TC' ? 'bg-blue-500/20 text-blue-300' :
                    modality === 'USG' ? 'bg-green-500/20 text-green-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {modality}
                  </span>
                );
              })()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculadoras Favoritas */}
          {topFavoriteCalculators.length > 0 && onCalculatorSelect && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1">
                <Calculator size={12} />
                <Star size={10} className="fill-amber-400 text-amber-400" />
                Calculadoras
              </h3>
              <div className="space-y-1">
                {topFavoriteCalculators.slice(0, 4).map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => onCalculatorSelect(calc)}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm truncate flex-1">{calc.name}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                        {calc.category}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tabelas Favoritas */}
          {topFavoriteTables.length > 0 && onTableSelect && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1">
                <Table2 size={12} />
                <Star size={10} className="fill-amber-400 text-amber-400" />
                Tabelas
              </h3>
              <div className="space-y-1">
                {topFavoriteTables.slice(0, 4).map(table => (
                  <button
                    key={table.id}
                    onClick={() => onTableSelect(table)}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <span className="text-sm truncate block">{table.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <button
        onClick={onToggleCollapse}
        className={cn(
          "absolute top-20 z-40 bg-card border border-border/40 rounded-r-lg p-1 hover:bg-muted transition-colors",
          isMobile ? "left-[280px]" : "left-64 md:left-64"
        )}
        title="Colapsar sidebar"
      >
        <ChevronLeft size={16} />
      </button>
    </>
  )
}
