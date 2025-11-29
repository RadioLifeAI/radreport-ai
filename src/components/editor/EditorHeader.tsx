import { LogOut, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import TemplateSelector from '@/components/selectors/TemplateSelector'
import MacroSelector, { Macro } from '@/components/selectors/MacroSelector'
import { TemplateVariablesModal } from './TemplateVariablesModal'
import { TemplateWithVariables, TemplateVariableValues } from '@/types/templateVariables'
import { useState } from 'react'

interface EditorHeaderProps {
  selectedTemplate: string
  searchTerm: string
  onTemplateSearch: (term: string) => void
  onTemplateSelect: (template: any) => void
  onModalityClick: (modality: string) => void
  onFavoriteToggle: (id: string) => void
  dropdownVisible: boolean
  setDropdownVisible: (visible: boolean) => void
  templates: any[]
  filteredTemplates: any[]
  recentTemplates: any[]
  favoriteTemplates: any[]
  loading: boolean
  error: string | null
  selectedModality: string | null
  isFavorite: (id: string) => boolean
  modalities: string[]
  
  selectedMacro: string
  fraseSearchTerm: string
  onMacroSearch: (term: string) => void
  onMacroSelect: (macro: Macro) => void
  onCategoryClick: (category: string | null) => void
  onMacroModalityClick: (modality: string | null) => void
  onMacroFavoriteToggle: (id: string) => void
  macros: Macro[]
  filteredMacros: Macro[]
  recentMacros: Macro[]
  favoriteMacros: Macro[]
  macrosLoading: boolean
  macrosError: string | null
  selectedCategory: string | null
  macroSelectedModality: string | null
  isMacroFavorite: (id: string) => boolean
  macroDropdownVisible: boolean
  setMacroDropdownVisible: (visible: boolean) => void
  categories: string[]
  macroModalities: string[]
  
  onLogout: () => void
  
  // Template variables support
  needsVariableInput: (template: any) => boolean
  applyTemplateWithVariables: (template: any, selectedTechnique: string | null, variableValues: TemplateVariableValues) => void
}

export function EditorHeader({
  selectedTemplate,
  searchTerm,
  onTemplateSearch,
  onTemplateSelect,
  onModalityClick,
  onFavoriteToggle,
  dropdownVisible,
  setDropdownVisible,
  templates,
  filteredTemplates,
  recentTemplates,
  favoriteTemplates,
  loading,
  error,
  selectedModality,
  isFavorite,
  modalities,
  selectedMacro,
  fraseSearchTerm,
  onMacroSearch,
  onMacroSelect,
  onCategoryClick,
  onMacroModalityClick,
  onMacroFavoriteToggle,
  macros,
  filteredMacros,
  recentMacros,
  favoriteMacros,
  macrosLoading,
  macrosError,
  selectedCategory,
  macroSelectedModality,
  isMacroFavorite,
  macroDropdownVisible,
  setMacroDropdownVisible,
  categories,
  macroModalities,
  onLogout,
  needsVariableInput,
  applyTemplateWithVariables,
}: EditorHeaderProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  
  // Template variables modal state
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<TemplateWithVariables | null>(null)
  
  // Handle template selection with variable check
  const handleTemplateSelect = (template: any) => {
    if (needsVariableInput(template)) {
      // Open modal for variable input
      setSelectedTemplateForModal(template as TemplateWithVariables)
      setTemplateModalOpen(true)
    } else {
      // Apply directly
      onTemplateSelect(template)
    }
  }
  
  // Handle template submission with variables
  const handleTemplateVariablesSubmit = (
    selectedTechnique: string | null,
    variableValues: TemplateVariableValues
  ) => {
    if (selectedTemplateForModal) {
      applyTemplateWithVariables(selectedTemplateForModal, selectedTechnique, variableValues)
      setTemplateModalOpen(false)
      setSelectedTemplateForModal(null)
    }
  }

  return (
    <>
      <header className="h-14 border-b border-border/40 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-indigo-500/60 shadow-glow" />
            <span className="font-bold text-xl gradient-text-medical">RadReport</span>
          </div>

          <div className="relative">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              searchTerm={searchTerm}
              onTemplateSearch={onTemplateSearch}
              onTemplateSelect={handleTemplateSelect}
              onModalityClick={onModalityClick}
              onFavoriteToggle={onFavoriteToggle}
              dropdownVisible={dropdownVisible}
              setDropdownVisible={setDropdownVisible}
              templates={templates}
              filteredTemplates={filteredTemplates}
              recentTemplates={recentTemplates}
              favoriteTemplates={favoriteTemplates}
              loading={loading}
              error={error}
              selectedModality={selectedModality}
              isFavorite={isFavorite}
              modalities={modalities}
            />
          </div>

        <div className="relative">
          <MacroSelector
            selectedMacro={selectedMacro}
            searchTerm={fraseSearchTerm}
            onMacroSearch={onMacroSearch}
            onMacroSelect={onMacroSelect}
            onCategoryClick={onCategoryClick}
            onModalityClick={onMacroModalityClick}
            onFavoriteToggle={onMacroFavoriteToggle}
            macros={macros}
            filteredMacros={filteredMacros}
            recentMacros={recentMacros}
            favoriteMacros={favoriteMacros}
            loading={macrosLoading}
            error={macrosError}
            selectedCategory={selectedCategory}
            selectedModality={macroSelectedModality}
            isFavorite={isMacroFavorite}
            dropdownVisible={macroDropdownVisible}
            setDropdownVisible={setMacroDropdownVisible}
            categories={categories}
            modalities={macroModalities}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Template Variables Modal */}
      <TemplateVariablesModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        template={selectedTemplateForModal}
        onSubmit={handleTemplateVariablesSubmit}
      />
    </>
  )
}
