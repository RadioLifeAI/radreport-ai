import React, { useRef, useEffect, useState } from 'react'
import { Star, FileText, Edit3 } from 'lucide-react'
import { Portal } from '@/components/ui/portal'

export interface Macro {
  id: string
  codigo: string
  titulo: string
  frase: string
  conclusao?: string
  categoria: string
  modalidade_id?: string
  ativo: boolean
}

export interface MacroSelectorProps {
  selectedMacro: string
  onMacroSearch: (value: string) => void
  onMacroSelect: (macro: Macro) => void
  onMacroSelectDirect?: (macro: Macro) => void
  onMacroSelectWithVariables?: (macro: Macro) => void
  onCategoryClick: (category: string) => void
  onModalityClick: (modality: string) => void
  onFavoriteToggle: (macroId: string) => void
  macros: Macro[]
  filteredMacros: Macro[]
  recentMacros: Macro[]
  favoriteMacros: Macro[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedCategory: string
  selectedModality: string
  isFavorite: (macroId: string) => boolean
  dropdownVisible: boolean
  setDropdownVisible: (visible: boolean) => void
  categories: string[]
  modalities: string[]
  needsVariableInput?: (macro: Macro) => boolean
}

export const MacroSelector: React.FC<MacroSelectorProps> = ({
  selectedMacro,
  onMacroSearch,
  onMacroSelect,
  onMacroSelectDirect,
  onMacroSelectWithVariables,
  onCategoryClick,
  onModalityClick,
  onFavoriteToggle,
  macros,
  filteredMacros,
  recentMacros,
  favoriteMacros,
  loading,
  error,
  searchTerm,
  selectedCategory,
  selectedModality,
  isFavorite,
  dropdownVisible,
  setDropdownVisible,
  categories,
  modalities,
  needsVariableInput
}) => {
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

  const MacroItem = ({ macro, isRecent = false, isFavoriteMacro = false }: { 
    macro: Macro
    isRecent?: boolean
    isFavoriteMacro?: boolean
  }) => {
    const hasVariables = needsVariableInput?.(macro) ?? false
    
    // Get modality from modalidade_id
    const getModality = (modalidadeId?: string) => {
      if (!modalidadeId) return ''
      const modalityMap = {
        'US': 'USG',
        'TC': 'TC', 
        'RM': 'RM',
        'RX': 'RX',
        'MM': 'MG'
      }
      return modalityMap[modalidadeId as keyof typeof modalityMap] || ''
    }
    
    const modality = getModality(macro.modalidade_id)
    
    return (
      <div 
        className="template-item group"
        onClick={() => {
          // Default click: auto-detect (will open modal if has variables)
          onMacroSelect(macro)
          setDropdownVisible(false)
        }}
      >
        <div className="template-modality-badge">{modality || 'GERAL'}</div>
        <div className="template-title flex-1">{macro.codigo}</div>
        
        <div className="flex items-center gap-1">
          {hasVariables && (
            <>
              {/* Badge indicator */}
              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded font-medium">
                VAR
              </span>
              
              {/* Completo button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMacroSelectDirect?.(macro)
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
                  onMacroSelectWithVariables?.(macro)
                  setDropdownVisible(false)
                }}
                className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded transition-colors"
                title="Preencher variáveis"
              >
                <Edit3 size={14} />
              </button>
            </>
          )}
          
          {/* Botão favorito SEMPRE visível */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle(macro.id)
            }}
            className={`template-star ${isFavorite(macro.id) ? 'favorited' : ''}`}
          >
            <Star size={14} />
          </button>
        </div>
      </div>
    )
  }

  const MacroSection = ({ title, macros, isRecent = false, isFavoriteMacro = false }: {
    title: string
    macros: Macro[]
    isRecent?: boolean
    isFavoriteMacro?: boolean
  }) => {
    if (macros.length === 0) return null

    return (
      <div className="template-section">
        <div className="template-section-title">{title}</div>
        <div className="template-list">
          {macros.map(macro => (
            <MacroItem 
              key={macro.id} 
              macro={macro} 
              isRecent={isRecent}
              isFavoriteMacro={isFavoriteMacro}
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
        placeholder="Buscar frases..."
        value={searchTerm}
        onChange={(e) => onMacroSearch(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        className="w-40 sm:w-64 md:w-80 lg:w-96 px-2 md:px-3 py-1.5 bg-background/50 border border-border/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
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
            {/* Modality Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-border/40 bg-muted/30">
              {modalities.map(modality => (
                <button
                  key={modality}
                  onClick={() => onModalityClick(modality)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedModality === modality 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' 
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
                <div className="p-4 text-center text-sm text-muted-foreground">Carregando frases...</div>
              )}

              {error && (
                <div className="p-4 text-center text-sm text-destructive">Erro: {error}</div>
              )}

              {!loading && !error && filteredMacros.length === 0 && searchTerm && (
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma frase encontrada</div>
              )}

              {!loading && !error && filteredMacros.length > 0 && (
                <>
                  {searchTerm && (
                    <MacroSection 
                      title="Resultados da Busca" 
                      macros={filteredMacros} 
                    />
                  )}

                  {!searchTerm && filteredMacros.filter(m => isFavorite(m.id)).length > 0 && (
                    <MacroSection 
                      title="Favoritos" 
                      macros={filteredMacros.filter(m => isFavorite(m.id))}
                      isFavoriteMacro={true}
                    />
                  )}

                  {!searchTerm && filteredMacros.filter(m => recentMacros.some(rm => rm.id === m.id)).length > 0 && (
                    <MacroSection 
                      title="Recentes" 
                      macros={filteredMacros.filter(m => recentMacros.some(rm => rm.id === m.id))}
                      isRecent={true}
                    />
                  )}
                  
                  {!searchTerm && (
                    <MacroSection 
                      title="Todas as Frases" 
                      macros={filteredMacros.filter(m => 
                        !recentMacros.some(rm => rm.id === m.id) && 
                        !isFavorite(m.id)
                      )} 
                    />
                  )}
                </>
              )}

              <div className="p-2 border-t border-border/40">
                <button className="w-full px-3 py-2 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
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

export default MacroSelector
