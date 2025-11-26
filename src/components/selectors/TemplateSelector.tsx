import React from 'react'
import { ChevronDown, Star } from 'lucide-react'
import { useTheme } from 'next-themes'

export interface Template {
  id: string
  titulo: string
  modalidade: string
  isDefault?: boolean
  conteudo?: any
}

export interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSearch: (value: string) => void
  onTemplateSelect: (template: Template) => void
  onModalityClick: (modality: string) => void
  onFavoriteToggle: (templateId: string) => void
  templates: Template[]
  filteredTemplates: Template[]
  recentTemplates: Template[]
  favoriteTemplates: Template[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedModality: string
  isFavorite: (templateId: string) => boolean
  dropdownVisible: boolean
  setDropdownVisible: (visible: boolean) => void
  modalities: string[]
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSearch,
  onTemplateSelect,
  onModalityClick,
  onFavoriteToggle,
  templates,
  filteredTemplates,
  recentTemplates,
  favoriteTemplates,
  loading,
  error,
  searchTerm,
  selectedModality,
  isFavorite,
  dropdownVisible,
  setDropdownVisible,
  modalities
}) => {
  const { theme } = useTheme()

  const TemplateItem = ({ template, isRecent = false, isFavoriteTemplate = false }: { 
    template: Template
    isRecent?: boolean
    isFavoriteTemplate?: boolean
  }) => (
    <div 
      className="template-item"
      onClick={() => {
        onTemplateSelect(template)
        setDropdownVisible(false)
      }}
    >
      <div className="template-modality-badge">{template.modalidade}</div>
      <div className="template-title">{template.titulo}</div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onFavoriteToggle(template.id)
        }}
        className={`template-star ${isFavorite(template.id) ? 'favorited' : ''}`}
      >
        <Star size={14} />
      </button>
    </div>
  )

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
    <div className={`template-selector-integrated ${theme}`}>
      <div className="template-input-container">
        <input
          type="text"
          placeholder="Buscar modelos"
          value={searchTerm}
          onChange={(e) => onTemplateSearch(e.target.value)}
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
          {/* Modality Filter Chips */}
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

          {/* Content based on loading/error states */}
          {loading && (
            <div className="template-loading">Carregando templates...</div>
          )}

          {error && (
            <div className="template-error">Erro ao carregar templates: {error}</div>
          )}

          {!loading && !error && filteredTemplates.length === 0 && searchTerm && (
            <div className="template-empty">Nenhum template encontrado para "{searchTerm}"</div>
          )}

          {!loading && !error && filteredTemplates.length > 0 && (
            <>
              {/* Search Results */}
              {searchTerm && (
                <TemplateSection 
                  title="Resultados da Busca" 
                  templates={filteredTemplates} 
                />
              )}

              {/* Favorites Section */}
              {!searchTerm && filteredTemplates.filter(t => isFavorite(t.id)).length > 0 && (
                <TemplateSection 
                  title="Favoritos" 
                  templates={filteredTemplates.filter(t => isFavorite(t.id))}
                  isFavoriteTemplate={true}
                />
              )}

              {/* Recent Section */}
              {!searchTerm && filteredTemplates.filter(t => recentTemplates.some(rt => rt.id === t.id)).length > 0 && (
                <TemplateSection 
                  title="Recentes" 
                  templates={filteredTemplates.filter(t => recentTemplates.some(rt => rt.id === t.id))}
                  isRecent={true}
                />
              )}

              {/* All Templates */}
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

export default TemplateSelector
