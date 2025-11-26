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
    <div className={`template-selector-integrated ${theme}`}>
      <div className="template-input-container">
        <input
          type="text"
          placeholder="Buscar frases..."
          value={searchTerm}
          onChange={(e) => onMacroSearch(e.target.value)}
          onFocus={() => setDropdownVisible(true)}
          className="template-input"
        />
        <button 
          onClick={() => setDropdownVisible(!dropdownVisible)}
          className="template-dropdown-toggle"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {dropdownVisible && (
        <div className="template-dropdown-list">
          {/* Modality Filter Chips - Identico ao TemplateSelector */}
          <div className="modality-chips">
            {modalities.map(modality => (
              <button
                key={modality}
                onClick={() => onModalityClick(modality)}
                className={`modality-chip ${selectedModality === modality ? 'active' : ''}`}
              >
                {modality}
              </button>
            ))}
          </div>

          <div className="template-divider"></div>

          {/* Content based on loading/error states */}
          {loading && (
            <div className="template-loading">Carregando frases...</div>
          )}

          {error && (
            <div className="template-error">Erro ao carregar frases: {error}</div>
          )}

          {!loading && !error && filteredMacros.length === 0 && searchTerm && (
            <div className="template-empty">Nenhuma frase encontrada para "{searchTerm}"</div>
          )}

          {!loading && !error && filteredMacros.length > 0 && (
            <>
              {/* Search Results */}
              {searchTerm && (
                <MacroSection 
                  title="Resultados da Busca" 
                  macros={filteredMacros} 
                />
              )}

              {/* Favorites Section */}
              {!searchTerm && filteredMacros.filter(m => isFavorite(m.id)).length > 0 && (
                <MacroSection 
                  title="Favoritos" 
                  macros={filteredMacros.filter(m => isFavorite(m.id))}
                  isFavoriteMacro={true}
                />
              )}

              {/* Recent Section */}
              {!searchTerm && filteredMacros.filter(m => recentMacros.some(rm => rm.id === m.id)).length > 0 && (
                <MacroSection 
                  title="Recentes" 
                  macros={filteredMacros.filter(m => recentMacros.some(rm => rm.id === m.id))}
                  isRecent={true}
                />
              )}
              
              {/* All Macros */}
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

          {/* Advanced Search Button */}
          <div className="template-footer">
            <button className="advanced-search-button">
              Busca Avançada
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MacroSelector
