import React, { useRef, useEffect, useState } from 'react'
import { ChevronDown, Star, FileText, Edit3 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Portal } from '@/components/ui/portal'

export interface Template {
  id: string
  titulo: string
  modalidade: string
  categoria?: string
  isDefault?: boolean
  conteudo?: any
  variaveis?: any[]
}

export interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSearch: (value: string) => void
  onTemplateSelect: (template: Template) => void
  onTemplateSelectDirect?: (template: Template) => void
  onTemplateSelectWithVariables?: (template: Template) => void
  onModalityClick: (modality: string) => void
  onCategoriaClick: (categoria: string | null) => void
  onFavoriteToggle: (templateId: string) => void
  templates: Template[]
  filteredTemplates: Template[]
  recentTemplates: Template[]
  favoriteTemplates: Template[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedModality: string | null
  selectedCategoria: string | null
  isFavorite: (templateId: string) => boolean
  dropdownVisible: boolean
  setDropdownVisible: (visible: boolean) => void
  modalities: string[]
  needsVariableInput?: (template: Template) => boolean
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSearch,
  onTemplateSelect,
  onTemplateSelectDirect,
  onTemplateSelectWithVariables,
  onModalityClick,
  onCategoriaClick,
  onFavoriteToggle,
  templates,
  filteredTemplates,
  recentTemplates,
  favoriteTemplates,
  loading,
  error,
  searchTerm,
  selectedModality,
  selectedCategoria,
  isFavorite,
  dropdownVisible,
  setDropdownVisible,
  modalities,
  needsVariableInput
}) => {
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (dropdownVisible && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [dropdownVisible])

  const TemplateItem = ({ template, isRecent = false, isFavoriteTemplate = false }: { 
    template: Template
    isRecent?: boolean
    isFavoriteTemplate?: boolean
  }) => {
    const hasVariables = needsVariableInput?.(template) ?? false
    
    return (
      <div 
        className="template-item group"
        onClick={() => {
          // Default click: auto-detect (will open modal if has variables)
          onTemplateSelect(template)
          setDropdownVisible(false)
        }}
      >
        <div className="template-modality-badge">{template.modalidade}</div>
        <div className="template-title flex-1">{template.titulo}</div>
        
        {hasVariables ? (
          <div className="flex items-center gap-1">
            {/* Badge indicator */}
            <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-medium">
              VAR
            </span>
            
            {/* Completo button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTemplateSelectDirect?.(template)
                setDropdownVisible(false)
              }}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Inserir completo (com placeholders)"
            >
              <FileText size={14} />
            </button>
            
            {/* Variáveis button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTemplateSelectWithVariables?.(template)
                setDropdownVisible(false)
              }}
              className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded transition-colors"
              title="Preencher variáveis"
            >
              <Edit3 size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle(template.id)
            }}
            className={`template-star ${isFavorite(template.id) ? 'favorited' : ''}`}
          >
            <Star size={14} />
          </button>
        )}
      </div>
    )
  }

  const TemplateSection = ({ title, templates, isRecent = false, isFavoriteTemplate = false }: {
    title: string
    templates: Template[]
    isRecent?: boolean
    isFavoriteTemplate?: boolean
  }) => {
    if (templates.length === 0) return null

    return (
      <div className="template-section">
        <div className="template-section-title">{title}</div>
        <div className="template-list">
          {templates.map(template => (
            <TemplateItem 
              key={template.id} 
              template={template} 
              isRecent={isRecent}
              isFavoriteTemplate={isFavoriteTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar modelos..."
        value={searchTerm}
        onChange={(e) => onTemplateSearch(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        className="w-40 sm:w-64 md:w-80 lg:w-96 px-2 md:px-3 py-1.5 bg-background/50 border border-border/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
      />

      {dropdownVisible && (
        <Portal>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={() => setDropdownVisible(false)}
          />
          <div 
            className="fixed w-[calc(100vw-24px)] sm:w-[440px] md:w-[520px] lg:w-[640px] max-h-[70vh] md:max-h-[600px] bg-card border border-border/40 rounded-xl shadow-2xl overflow-hidden z-[70]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              minWidth: `${dropdownPosition.width}px`
            }}
          >
            {/* Category Tabs - Filtro Geral (Hierárquico) */}
            <div className="flex items-center gap-1 p-2 border-b border-border/40 bg-muted/50">
              <span className="text-xs text-muted-foreground mr-2">Categoria:</span>
              <button
                onClick={() => onCategoriaClick(null)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedCategoria === null 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => onCategoriaClick('normal')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedCategoria === 'normal' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                📗 Normal
              </button>
              <button
                onClick={() => onCategoriaClick('alterado')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedCategoria === 'alterado' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                📕 Alterado
              </button>
            </div>

            {/* Modality Tabs - Filtro Específico */}
            <div className="flex items-center gap-1 p-2 border-b border-border/40 bg-muted/30">
              <span className="text-xs text-muted-foreground mr-2">Modalidade:</span>
              {modalities.map(modality => (
                <button
                  key={modality}
                  onClick={() => onModalityClick(modality)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedModality === modality 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {modality}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto max-h-[520px] scrollbar-thin">

              {/* Content based on loading/error states */}
              {loading && (
                <div className="p-4 text-center text-sm text-muted-foreground">Carregando templates...</div>
              )}

              {error && (
                <div className="p-4 text-center text-sm text-destructive">Erro: {error}</div>
              )}

              {!loading && !error && filteredTemplates.length === 0 && searchTerm && (
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhum template encontrado</div>
              )}

              {!loading && !error && filteredTemplates.length > 0 && (
                <>
                  {searchTerm && (
                    <TemplateSection 
                      title="Resultados da Busca" 
                      templates={filteredTemplates} 
                    />
                  )}

                  {!searchTerm && filteredTemplates.filter(t => isFavorite(t.id)).length > 0 && (
                    <TemplateSection 
                      title="Favoritos" 
                      templates={filteredTemplates.filter(t => isFavorite(t.id))}
                      isFavoriteTemplate={true}
                    />
                  )}

                  {!searchTerm && filteredTemplates.filter(t => recentTemplates.some(rt => rt.id === t.id)).length > 0 && (
                    <TemplateSection 
                      title="Recentes" 
                      templates={filteredTemplates.filter(t => recentTemplates.some(rt => rt.id === t.id))}
                      isRecent={true}
                    />
                  )}

                  {!searchTerm && (
                    <TemplateSection 
                      title="Todos os Templates" 
                      templates={filteredTemplates.filter(t => 
                        !recentTemplates.some(rt => rt.id === t.id) && 
                        !isFavorite(t.id)
                      )} 
                    />
                  )}
                </>
              )}

              <div className="p-2 border-t border-border/40">
                <button className="w-full px-3 py-2 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                  Busca Avançada
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

export default TemplateSelector
