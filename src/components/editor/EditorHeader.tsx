import { Moon, Sun, MessageSquare, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import TemplateSelector from '@/components/selectors/TemplateSelector'
import MacroSelector, { Macro } from '@/components/selectors/MacroSelector'
import { TemplateVariablesModal } from './TemplateVariablesModal'
import { UserProfileDropdown } from '@/components/user/UserProfileDropdown'
import { UserSettingsModal } from '@/components/user/UserSettingsModal'
import { TemplateWithVariables, TemplateVariableValues } from '@/types/templateVariables'
import { useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin'

interface EditorHeaderProps {
  selectedTemplate: string
  searchTerm: string
  onTemplateSearch: (term: string) => void
  onTemplateSelect: (template: any) => void
  onModalityClick: (modality: string) => void
  onCategoriaClick: (categoria: string | null) => void
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
  selectedCategoria: string | null
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
  
  onChatToggle: () => void
  
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
  onCategoriaClick,
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
  selectedCategoria,
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
  onChatToggle,
  needsVariableInput,
  applyTemplateWithVariables,
}: EditorHeaderProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { isAdmin, loading: adminLoading } = useAdmin()
  
  // Template variables modal state
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<TemplateWithVariables | null>(null)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [settingsDefaultTab, setSettingsDefaultTab] = useState('profile')
  
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
      <header className="h-12 md:h-14 border-b border-border/40 bg-card/95 backdrop-blur-sm flex items-center justify-between px-3 md:px-6 z-50">
        <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-indigo-500/60 shadow-glow" />
            <span className="font-bold text-lg md:text-xl gradient-text-medical hidden sm:inline">RadReport</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
            <div className="relative">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                searchTerm={searchTerm}
                onTemplateSearch={onTemplateSearch}
                onTemplateSelect={handleTemplateSelect}
                onModalityClick={onModalityClick}
                onCategoriaClick={onCategoriaClick}
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
                selectedCategoria={selectedCategoria}
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
        </div>

      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <button 
          onClick={onChatToggle}
          className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
          title="Chat IA"
        >
          <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} className="md:w-[18px] md:h-[18px]" /> : <Moon size={16} className="md:w-[18px] md:h-[18px]" />}
        </button>
        
        {/* Admin Button - only visible for admins */}
        {!adminLoading && isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors"
            title="Painel Admin"
          >
            <Shield size={16} className="md:w-[18px] md:h-[18px] text-amber-500" />
          </button>
        )}
        
        <UserProfileDropdown 
          onOpenSettings={(tab = 'profile') => {
            setSettingsDefaultTab(tab)
            setSettingsModalOpen(true)
          }} 
        />
        </div>
      </header>

      {/* Template Variables Modal */}
      <TemplateVariablesModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        template={selectedTemplateForModal}
        onSubmit={handleTemplateVariablesSubmit}
      />

      {/* User Settings Modal */}
      <UserSettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        defaultTab={settingsDefaultTab}
      />
    </>
  )
}