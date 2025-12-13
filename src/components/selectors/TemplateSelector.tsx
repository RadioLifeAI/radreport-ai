import React, { useRef, useEffect, useState } from 'react'
import { ChevronDown, Star, FileText, Edit3, Plus, Trash2, User, Copy, RotateCcw, Trash, Clock } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Portal } from '@/components/ui/portal'
import { Badge } from '@/components/ui/badge'
import type { VariableFilter } from '@/hooks/useTemplates'
import { useUserContent, UserTemplate } from '@/hooks/useUserContent'
import { UserContentModal } from '@/components/editor/UserContentModal'

export interface Template {
  id: string
  titulo: string
  modalidade: string
  categoria?: string
  isDefault?: boolean
  conteudo?: any
  variaveis?: any[]
  isUserContent?: boolean
}

export interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSearch: (value: string) => void
  onTemplateSelect: (template: Template) => void
  onTemplateSelectDirect?: (template: Template) => void
  onTemplateSelectWithVariables?: (template: Template) => void
  onModalityClick: (modality: string) => void
  onCategoriaClick: (categoria: string | null) => void
  onVariableFilterClick: (filter: VariableFilter) => void
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
  selectedVariableFilter: VariableFilter
  isFavorite: (templateId: string) => boolean
  dropdownVisible: boolean
  setDropdownVisible: (visible: boolean) => void
  modalities: string[]
  needsVariableInput?: (template: Template) => boolean
}

type SourceFilter = 'all' | 'system' | 'user' | 'trash';

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSearch,
  onTemplateSelect,
  onTemplateSelectDirect,
  onTemplateSelectWithVariables,
  onModalityClick,
  onCategoriaClick,
  onVariableFilterClick,
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
  selectedVariableFilter,
  isFavorite,
  dropdownVisible,
  setDropdownVisible,
  modalities,
  needsVariableInput
}) => {
  const { 
    userTemplates, 
    limits, 
    deleteTemplate, 
    deletedTemplates,
    restoreTemplate,
    permanentDeleteTemplate,
    recentUserTemplates,
    trackUserTemplateUsage,
    toggleFavoriteUserTemplate,
    isUserTemplateFavorite,
    favoriteUserTemplates
  } = useUserContent();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UserTemplate | null>(null);
  const [duplicateFromTemplate, setDuplicateFromTemplate] = useState<any>(null);
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

  // Fechar dropdown ao abrir modal (fix z-index overlap)
  const handleOpenModal = (editing: UserTemplate | null, duplicateFrom: any) => {
    setDropdownVisible(false);
    setEditingTemplate(editing);
    setDuplicateFromTemplate(duplicateFrom);
    setShowUserModal(true);
  };

  // Convert user templates to Template format
  const userTemplatesAsTemplates: Template[] = userTemplates.map(ut => ({
    id: ut.id,
    titulo: ut.titulo,
    modalidade: ut.modalidade_codigo,
    categoria: ut.categoria || 'normal',
    isDefault: false,
    conteudo: ut.modo === 'profissional' ? ut.conteudo_template : ut.texto,
    variaveis: [],
    isUserContent: true,
  }));

  const deletedTemplatesAsTemplates: Template[] = deletedTemplates.map(ut => ({
    id: ut.id,
    titulo: ut.titulo,
    modalidade: ut.modalidade_codigo,
    categoria: ut.categoria || 'normal',
    isDefault: false,
    conteudo: ut.modo === 'profissional' ? ut.conteudo_template : ut.texto,
    variaveis: [],
    isUserContent: true,
  }));

  const recentUserTemplatesAsTemplates: Template[] = recentUserTemplates.map(ut => ({
    id: ut.id,
    titulo: ut.titulo,
    modalidade: ut.modalidade_codigo,
    categoria: ut.categoria || 'normal',
    isDefault: false,
    conteudo: ut.modo === 'profissional' ? ut.conteudo_template : ut.texto,
    variaveis: [],
    isUserContent: true,
  }));

  const favoriteUserTemplatesAsTemplates: Template[] = favoriteUserTemplates.map(ut => ({
    id: ut.id,
    titulo: ut.titulo,
    modalidade: ut.modalidade_codigo,
    categoria: ut.categoria || 'normal',
    isDefault: false,
    conteudo: ut.modo === 'profissional' ? ut.conteudo_template : ut.texto,
    variaveis: [],
    isUserContent: true,
  }));

  const getFilteredUserTemplates = () => {
    let filtered = userTemplatesAsTemplates;
    if (selectedModality) {
      filtered = filtered.filter(t => t.modalidade === selectedModality);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.titulo.toLowerCase().includes(term) ||
        t.modalidade?.toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const TemplateItem = ({ template, isRecent = false, isFavoriteTemplate = false, isTrash = false }: { 
    template: Template
    isRecent?: boolean
    isFavoriteTemplate?: boolean
    isTrash?: boolean
  }) => {
    const hasVariables = needsVariableInput?.(template) ?? false
    const isUserTemplate = template.isUserContent === true;
    
    return (
      <div 
        className={`template-item group ${isTrash ? 'opacity-60' : ''}`}
        onClick={() => {
          if (!isTrash) {
            if (isUserTemplate) trackUserTemplateUsage(template.id);
            onTemplateSelect(template)
            setDropdownVisible(false)
          }
        }}
      >
        {isUserTemplate ? (
          <div className={`template-modality-badge ${isTrash ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
            {isTrash ? '🗑️' : 'MEUS'}
          </div>
        ) : (
          <div className="template-modality-badge">{template.modalidade}</div>
        )}
        <div className="template-title flex-1">{template.titulo}</div>
        
        <div className="flex items-center gap-1">
          {isTrash && isUserTemplate && (
            <>
              <button onClick={(e) => { e.stopPropagation(); restoreTemplate(template.id); }} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded transition-colors" title="Restaurar"><RotateCcw size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm('Excluir permanentemente?')) permanentDeleteTemplate(template.id); }} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors" title="Excluir permanentemente"><Trash size={14} /></button>
            </>
          )}

          {!isTrash && (
            <>
              {hasVariables && !isUserTemplate && (
                <>
                  <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded font-medium">VAR</span>
                  <button onClick={(e) => { e.stopPropagation(); onTemplateSelectDirect?.(template); setDropdownVisible(false); }} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100" title="Inserir completo"><FileText size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onTemplateSelectWithVariables?.(template); setDropdownVisible(false); }} className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded transition-colors" title="Preencher variáveis"><Edit3 size={14} /></button>
                </>
              )}

              {isUserTemplate && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); const ut = userTemplates.find(u => u.id === template.id); if (ut) handleOpenModal(ut, null); }} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100" title="Editar"><Edit3 size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm('Mover para lixeira?')) deleteTemplate(template.id); }} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100" title="Mover para lixeira"><Trash2 size={14} /></button>
                </>
              )}

              {!isUserTemplate && (
                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(null, template); }} className="p-1.5 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors opacity-0 group-hover:opacity-100" title="Criar minha versão"><Copy size={14} /></button>
              )}
              
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (isUserTemplate) {
                    toggleFavoriteUserTemplate(template.id);
                  } else {
                    onFavoriteToggle(template.id); 
                  }
                }} 
                className={`template-star ${isUserTemplate ? (isUserTemplateFavorite(template.id) ? 'favorited' : '') : (isFavorite(template.id) ? 'favorited' : '')}`}
              >
                <Star size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const TemplateSection = ({ title, templates, isRecent = false, isFavoriteTemplate = false, isTrash = false, icon }: { title: string; templates: Template[]; isRecent?: boolean; isFavoriteTemplate?: boolean; isTrash?: boolean; icon?: React.ReactNode }) => {
    if (templates.length === 0) return null
    return (
      <div className="template-section">
        <div className="template-section-title flex items-center gap-1.5">{icon}{title}</div>
        <div className="template-list">
          {templates.map(template => <TemplateItem key={template.id} template={template} isRecent={isRecent} isFavoriteTemplate={isFavoriteTemplate} isTrash={isTrash} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <input ref={inputRef} type="text" placeholder="Buscar modelos..." value={searchTerm} onChange={(e) => onTemplateSearch(e.target.value)} onFocus={() => setDropdownVisible(true)} className="w-40 sm:w-64 md:w-80 lg:w-96 px-2 md:px-3 py-1.5 bg-background/50 border border-border/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />

      {dropdownVisible && (
        <Portal>
          <div className="fixed inset-0 z-[60]" onClick={() => setDropdownVisible(false)} />
          <div className="fixed w-[calc(100vw-24px)] sm:w-[440px] md:w-[520px] lg:w-[640px] max-h-[70vh] md:max-h-[600px] bg-card border border-border/40 rounded-xl shadow-2xl overflow-hidden z-[70]" style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, minWidth: `${dropdownPosition.width}px` }}>
            <div className="flex items-center justify-between p-2 border-b border-border/40 bg-muted/50">
              <span className="text-sm font-medium text-foreground">Templates</span>
              <button onClick={() => handleOpenModal(null, null)} className="p-1.5 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors" title="Criar novo template"><Plus size={16} /></button>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/40 bg-muted/30">
              <span className="text-xs text-muted-foreground mr-1">Fonte:</span>
              <button onClick={() => setSourceFilter('all')} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${sourceFilter === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'hover:bg-muted text-muted-foreground'}`}>Todos</button>
              <button onClick={() => setSourceFilter('system')} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${sourceFilter === 'system' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'hover:bg-muted text-muted-foreground'}`}>Sistema</button>
              <button onClick={() => setSourceFilter('user')} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${sourceFilter === 'user' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'hover:bg-muted text-muted-foreground'}`}><User size={12} />Meus ({userTemplates.length}/{limits.templates})</button>
              {deletedTemplates.length > 0 && <button onClick={() => setSourceFilter('trash')} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${sourceFilter === 'trash' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'hover:bg-muted text-muted-foreground'}`}><Trash size={12} />Lixeira ({deletedTemplates.length})</button>}
              <div className="w-px h-4 bg-border/60 mx-1" />
              <span className="text-xs text-muted-foreground mr-1">Categoria:</span>
              <button onClick={() => onCategoriaClick(null)} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${selectedCategoria === null ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'hover:bg-muted text-muted-foreground'}`}>Todos</button>
              <button onClick={() => onCategoriaClick('normal')} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${selectedCategoria === 'normal' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'hover:bg-muted text-muted-foreground'}`}>📗 Normal</button>
              <button onClick={() => onCategoriaClick('alterado')} className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${selectedCategoria === 'alterado' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'hover:bg-muted text-muted-foreground'}`}>📕 Alterado</button>
            </div>

            <div className="flex items-center gap-1 p-2 border-b border-border/40 bg-muted/30">
              <span className="text-xs text-muted-foreground mr-2">Modalidade:</span>
              {modalities.map(modality => <button key={modality} onClick={() => onModalityClick(modality)} className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${selectedModality === modality ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'hover:bg-muted text-muted-foreground'}`}>{modality}</button>)}
            </div>

            <div className="overflow-y-auto max-h-[520px] scrollbar-thin">
              {loading && <div className="p-4 text-center text-sm text-muted-foreground">Carregando templates...</div>}
              {error && <div className="p-4 text-center text-sm text-destructive">Erro: {error}</div>}
              {!loading && !error && filteredTemplates.length === 0 && searchTerm && sourceFilter !== 'trash' && <div className="p-4 text-center text-sm text-muted-foreground">Nenhum template encontrado</div>}

              {sourceFilter === 'trash' && (deletedTemplatesAsTemplates.length > 0 ? (<><TemplateSection title="Lixeira" templates={deletedTemplatesAsTemplates} isTrash={true} icon={<Trash size={14} className="text-red-400" />} /><div className="p-3 text-xs text-muted-foreground text-center border-t border-border/40 bg-muted/20">💡 Itens podem ser restaurados ou excluídos permanentemente.</div></>) : <div className="p-4 text-center text-sm text-muted-foreground">Lixeira vazia</div>)}

              {sourceFilter !== 'system' && sourceFilter !== 'trash' && favoriteUserTemplatesAsTemplates.length > 0 && <TemplateSection title="Meus Favoritos" templates={favoriteUserTemplatesAsTemplates} isFavoriteTemplate={true} icon={<Star size={14} className="text-yellow-400" />} />}
              {sourceFilter !== 'system' && sourceFilter !== 'trash' && recentUserTemplatesAsTemplates.length > 0 && <TemplateSection title="Meus Recentes" templates={recentUserTemplatesAsTemplates.slice(0, 5)} isRecent={true} icon={<Clock size={14} className="text-amber-400" />} />}
              {sourceFilter !== 'system' && sourceFilter !== 'trash' && getFilteredUserTemplates().length > 0 && <TemplateSection title={`Meus Templates (${userTemplates.length}/${limits.templates})`} templates={getFilteredUserTemplates()} icon={<User size={14} className="text-emerald-400" />} />}

              {sourceFilter !== 'user' && sourceFilter !== 'trash' && !loading && !error && filteredTemplates.length > 0 && (
                <>
                  {searchTerm && <TemplateSection title="Resultados da Busca" templates={filteredTemplates} />}
                  {!searchTerm && filteredTemplates.filter(t => isFavorite(t.id)).length > 0 && <TemplateSection title="Favoritos" templates={filteredTemplates.filter(t => isFavorite(t.id))} isFavoriteTemplate={true} icon={<Star size={14} className="text-yellow-400" />} />}
                  {!searchTerm && filteredTemplates.filter(t => recentTemplates.some(rt => rt.id === t.id)).length > 0 && <TemplateSection title="Recentes" templates={filteredTemplates.filter(t => recentTemplates.some(rt => rt.id === t.id))} isRecent={true} icon={<Clock size={14} className="text-blue-400" />} />}
                  {!searchTerm && <TemplateSection title="Todos os Templates" templates={filteredTemplates.filter(t => !recentTemplates.some(rt => rt.id === t.id) && !isFavorite(t.id))} />}
                </>
              )}

              {sourceFilter === 'user' && getFilteredUserTemplates().length === 0 && <div className="p-4 text-center text-sm text-muted-foreground"><p>Você ainda não criou templates.</p><button onClick={() => handleOpenModal(null, null)} className="mt-2 text-cyan-400 hover:underline">Criar primeiro template</button></div>}
            </div>
          </div>
        </Portal>
      )}

      <UserContentModal open={showUserModal} onOpenChange={setShowUserModal} type="template" editItem={editingTemplate} duplicateFrom={duplicateFromTemplate} />
    </div>
  )
}

export default TemplateSelector