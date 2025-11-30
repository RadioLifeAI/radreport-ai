import React from 'react'
import { ChevronDown, Star } from 'lucide-react'
import { useTheme } from 'next-themes'

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
}

export const MacroSelector: React.FC<MacroSelectorProps> = ({
  selectedMacro,
  onMacroSearch,
  onMacroSelect,
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
}) => {
  const { theme } = useTheme()

  const MacroItem = ({ macro, isRecent = false, isFavoriteMacro = false }: { 
    macro: Macro
    isRecent?: boolean
    isFavoriteMacro?: boolean
  }) => {
    // Get modality from modalidade_id (que agora contém o código direto)
    const getModality = (modalidadeId?: string) => {
      if (!modalidadeId) return ''
      // Mapeamento dos códigos da tabela para os badges
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
        className="template-item"
        onClick={() => {
          onMacroSelect(macro)
          setDropdownVisible(false)
        }}
      >
        <div className="template-modality-badge">{modality || 'GERAL'}</div>
        <div className="template-title">{macro.codigo}</div>
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
        type="text"
        placeholder="Buscar frases..."
        value={searchTerm}
        onChange={(e) => onMacroSearch(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        className="w-40 sm:w-64 md:w-80 lg:w-96 px-2 md:px-3 py-1.5 bg-background/50 border border-border/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
      />

      {dropdownVisible && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={() => setDropdownVisible(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-[calc(100vw-24px)] sm:w-[440px] md:w-[520px] lg:w-[640px] max-h-[70vh] md:max-h-[600px] bg-card border border-border/40 rounded-xl shadow-2xl overflow-hidden z-[70]">
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
        </>
      )}
    </div>
  )
}

export default MacroSelector
