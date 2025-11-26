import { Star, ChevronLeft } from 'lucide-react'

interface EditorLeftSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  recentTemplates: any[]
  recentFrases: any[]
  onTemplateSelect: (template: any) => void
  onFraseSelect: (frase: any) => void
}

export function EditorLeftSidebar({
  collapsed,
  onToggleCollapse,
  recentTemplates,
  recentFrases,
  onTemplateSelect,
  onFraseSelect,
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
      <aside className="w-64 border-r border-border/40 bg-card/50 backdrop-blur-sm overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Templates Recentes */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Templates Recentes</h3>
            <div className="space-y-1">
              {recentTemplates.slice(0, 5).map(template => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{template.titulo}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      template.modalidade_codigo === 'RM' ? 'bg-purple-500/20 text-purple-300' :
                      template.modalidade_codigo === 'TC' ? 'bg-blue-500/20 text-blue-300' :
                      template.modalidade_codigo === 'USG' ? 'bg-green-500/20 text-green-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {template.modalidade_codigo}
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
              {recentFrases.slice(0, 5).map(frase => (
                <button
                  key={frase.id}
                  onClick={() => onFraseSelect(frase)}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{frase.codigo}</span>
                    {frase.modalidade_codigo && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        frase.modalidade_codigo === 'RM' ? 'bg-purple-500/20 text-purple-300' :
                        frase.modalidade_codigo === 'TC' ? 'bg-blue-500/20 text-blue-300' :
                        frase.modalidade_codigo === 'USG' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {frase.modalidade_codigo}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <button
        onClick={onToggleCollapse}
        className="absolute left-64 top-20 z-40 bg-card border border-border/40 rounded-r-lg p-1 hover:bg-muted transition-colors"
        title="Colapsar sidebar"
      >
        <ChevronLeft size={16} />
      </button>
    </>
  )
}
