import React, { useRef, useEffect, useState } from 'react'
import { Star, FileText, Edit3, Plus, Trash2, User, Copy, RotateCcw, Trash, Clock } from 'lucide-react'
import { Portal } from '@/components/ui/portal'
import { useUserContent, UserFrase } from '@/hooks/useUserContent'
import { UserContentModal } from '@/components/editor/UserContentModal'

export interface Macro {
  id: string
  codigo: string
  titulo: string
  frase: string
  conclusao?: string
  categoria: string
  modalidade_id?: string
  ativo: boolean
  isUserContent?: boolean
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

type SourceFilter = 'all' | 'system' | 'user' | 'trash';

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
  const { 
    userFrases, 
    limits, 
    deleteFrase,
    deletedFrases,
    restoreFrase,
    permanentDeleteFrase,
    recentUserFrases,
    trackUserFraseUsage
  } = useUserContent();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingFrase, setEditingFrase] = useState<UserFrase | null>(null);
  const [duplicateFromFrase, setDuplicateFromFrase] = useState<any>(null);
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
  const handleOpenModal = (editing: UserFrase | null, duplicateFrom: any) => {
    setDropdownVisible(false); // Fechar dropdown primeiro
    setEditingFrase(editing);
    setDuplicateFromFrase(duplicateFrom);
    setShowUserModal(true);
  };

  // Convert user frases to Macro format
  const userFrasesAsMacros: Macro[] = userFrases.map(uf => ({
    id: uf.id,
    codigo: `USER_${uf.modalidade_codigo}_${uf.id.slice(0, 8)}`,
    titulo: uf.titulo,
    frase: uf.texto,
    conclusao: uf.conclusao,
    categoria: uf.categoria || 'normal',
    modalidade_id: uf.modalidade_codigo,
    ativo: true,
    isUserContent: true,
  }));

  // Convert deleted frases to Macro format
  const deletedFrasesAsMacros: Macro[] = deletedFrases.map(uf => ({
    id: uf.id,
    codigo: `USER_${uf.modalidade_codigo}_${uf.id.slice(0, 8)}`,
    titulo: uf.titulo,
    frase: uf.texto,
    conclusao: uf.conclusao,
    categoria: uf.categoria || 'normal',
    modalidade_id: uf.modalidade_codigo,
    ativo: false,
    isUserContent: true,
  }));

  // Convert recent user frases to Macro format
  const recentUserFrasesAsMacros: Macro[] = recentUserFrases.map(uf => ({
    id: uf.id,
    codigo: `USER_${uf.modalidade_codigo}_${uf.id.slice(0, 8)}`,
    titulo: uf.titulo,
    frase: uf.texto,
    conclusao: uf.conclusao,
    categoria: uf.categoria || 'normal',
    modalidade_id: uf.modalidade_codigo,
    ativo: true,
    isUserContent: true,
  }));

  // Filter user frases based on modality and search term
  const getFilteredUserFrases = () => {
    let filtered = userFrasesAsMacros;
    if (selectedModality && selectedModality !== 'TODOS') {
      filtered = filtered.filter(f => f.modalidade_id === selectedModality);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        f.titulo.toLowerCase().includes(term) ||
        f.frase.toLowerCase().includes(term) ||
        f.codigo.toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const MacroItem = ({ macro, isRecent = false, isFavoriteMacro = false, isTrash = false }: { 
    macro: Macro
    isRecent?: boolean
    isFavoriteMacro?: boolean
    isTrash?: boolean
  }) => {
    const hasVariables = needsVariableInput?.(macro) ?? false
    const isUserMacro = macro.isUserContent === true;
    
    // Get modality from codigo prefix
    const getModalityFromCode = (codigo?: string): string => {
      if (!codigo) return ''
      const prefix = codigo.split('_')[0]?.toUpperCase() || ''
      const modalityMap: Record<string, string> = {
        'US': 'USG', 'USG': 'USG',
        'TC': 'TC', 'CT': 'TC',
        'RM': 'RM', 'MR': 'RM',
        'RX': 'RX', 'CR': 'RX',
        'MM': 'MG', 'MG': 'MG',
        'USER': macro.modalidade_id || 'GERAL'
      }
      return modalityMap[prefix] || ''
    }
    
    const modality = getModalityFromCode(macro.codigo)
    
    return (
      <div 
        className={`template-item group ${isTrash ? 'opacity-60' : ''}`}
        onClick={() => {
          if (!isTrash) {
            if (isUserMacro) {
              trackUserFraseUsage(macro.id);
            }
            onMacroSelect(macro)
            setDropdownVisible(false)
          }
        }}
      >
        {/* Badge MEUS ou modalidade */}
        {isUserMacro ? (
          <div className={`template-modality-badge ${isTrash ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
            {isTrash ? '🗑️' : 'MEUS'}
          </div>
        ) : (
          <div className="template-modality-badge">{modality || 'GERAL'}</div>
        )}
        <div className="template-title flex-1">{macro.titulo || macro.codigo}</div>
        
        <div className="flex items-center gap-1">
          {/* Ações para lixeira */}
          {isTrash && isUserMacro && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  restoreFrase(macro.id);
                }}
                className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded transition-colors"
                title="Restaurar"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Excluir permanentemente? Esta ação não pode ser desfeita.')) {
                    permanentDeleteFrase(macro.id);
                  }
                }}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                title="Excluir permanentemente"
              >
                <Trash size={14} />
              </button>
            </>
          )}

          {/* Ações normais (não lixeira) */}
          {!isTrash && (
            <>
              {hasVariables && !isUserMacro && (
                <>
                  <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded font-medium">
                    VAR
                  </span>
                  
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

              {/* Ações para frases do usuário */}
              {isUserMacro && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const userFrase = userFrases.find(uf => uf.id === macro.id);
                      if (userFrase) {
                        handleOpenModal(userFrase, null);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Mover para lixeira?')) {
                        deleteFrase(macro.id);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Mover para lixeira"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}

              {/* Botão duplicar (para sistema) */}
              {!isUserMacro && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenModal(null, macro);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Criar minha versão"
                >
                  <Copy size={14} />
                </button>
              )}
              
              {/* Botão favorito (para todos) */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const favoriteId = isUserMacro ? `user_${macro.id}` : macro.id
                  onFavoriteToggle(favoriteId)
                }}
                className={`template-star ${isFavorite(isUserMacro ? `user_${macro.id}` : macro.id) ? 'favorited' : ''}`}
              >
                <Star size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const MacroSection = ({ title, macros, isRecent = false, isFavoriteMacro = false, isTrash = false, icon }: {
    title: string
    macros: Macro[]
    isRecent?: boolean
    isFavoriteMacro?: boolean
    isTrash?: boolean
    icon?: React.ReactNode
  }) => {
    if (macros.length === 0) return null

    return (
      <div className="template-section">
        <div className="template-section-title flex items-center gap-1.5">
          {icon}
          {title}
        </div>
        <div className="template-list">
          {macros.map(macro => (
            <MacroItem 
              key={macro.id} 
              macro={macro} 
              isRecent={isRecent}
              isFavoriteMacro={isFavoriteMacro}
              isTrash={isTrash}
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
            {/* Header com botão + */}
            <div className="flex items-center justify-between p-2 border-b border-border/40 bg-muted/50">
              <span className="text-sm font-medium text-foreground">Frases</span>
              <button
                onClick={() => handleOpenModal(null, null)}
                className="p-1.5 text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors"
                title="Criar nova frase"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Source Filter Row */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/40 bg-muted/30">
              <span className="text-xs text-muted-foreground mr-1">Fonte:</span>
              <button
                onClick={() => setSourceFilter('all')}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${
                  sourceFilter === 'all' 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSourceFilter('system')}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-all ${
                  sourceFilter === 'system' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Sistema
              </button>
              <button
                onClick={() => setSourceFilter('user')}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                  sourceFilter === 'user' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <User size={12} />
                Minhas ({userFrases.length}/{limits.frases})
              </button>
              {deletedFrases.length > 0 && (
                <button
                  onClick={() => setSourceFilter('trash')}
                  className={`px-2 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                    sourceFilter === 'trash' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Trash size={12} />
                  Lixeira ({deletedFrases.length})
                </button>
              )}
            </div>

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

              {!loading && !error && filteredMacros.length === 0 && searchTerm && sourceFilter !== 'trash' && (
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma frase encontrada</div>
              )}

              {/* Lixeira */}
              {sourceFilter === 'trash' && (
                <>
                  {deletedFrasesAsMacros.length > 0 ? (
                    <>
                      <MacroSection 
                        title="Lixeira"
                        macros={deletedFrasesAsMacros}
                        isTrash={true}
                        icon={<Trash size={14} className="text-red-400" />}
                      />
                      <div className="p-3 text-xs text-muted-foreground text-center border-t border-border/40 bg-muted/20">
                        💡 Itens na lixeira podem ser restaurados ou excluídos permanentemente.
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Lixeira vazia
                    </div>
                  )}
                </>
              )}

              {/* Minhas Recentes (quando filtro user ou all) */}
              {sourceFilter !== 'system' && sourceFilter !== 'trash' && recentUserFrasesAsMacros.length > 0 && (
                <MacroSection 
                  title="Minhas Recentes"
                  macros={recentUserFrasesAsMacros.slice(0, 5)}
                  isRecent={true}
                  icon={<Clock size={14} className="text-amber-400" />}
                />
              )}

              {/* Minhas Frases (quando filtro user ou all) */}
              {sourceFilter !== 'system' && sourceFilter !== 'trash' && getFilteredUserFrases().length > 0 && (
                <MacroSection 
                  title={`Minhas Frases (${userFrases.length}/${limits.frases})`}
                  macros={getFilteredUserFrases()} 
                  icon={<User size={14} className="text-emerald-400" />}
                />
              )}

              {/* Frases do Sistema */}
              {sourceFilter !== 'user' && sourceFilter !== 'trash' && !loading && !error && filteredMacros.length > 0 && (
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
                      icon={<Star size={14} className="text-yellow-400" />}
                    />
                  )}

                  {!searchTerm && filteredMacros.filter(m => recentMacros.some(rm => rm.id === m.id)).length > 0 && (
                    <MacroSection 
                      title="Recentes" 
                      macros={filteredMacros.filter(m => recentMacros.some(rm => rm.id === m.id))}
                      isRecent={true}
                      icon={<Clock size={14} className="text-blue-400" />}
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

              {/* Mensagem quando só tem user filter e está vazio */}
              {sourceFilter === 'user' && getFilteredUserFrases().length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <p>Você ainda não criou frases.</p>
                  <button 
                    onClick={() => handleOpenModal(null, null)}
                    className="mt-2 text-indigo-400 hover:underline"
                  >
                    Criar primeira frase
                  </button>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}

      {/* Modal de criação/edição */}
      <UserContentModal
        open={showUserModal}
        onOpenChange={setShowUserModal}
        type="frase"
        editItem={editingFrase}
        duplicateFrom={duplicateFromFrase}
      />
    </div>
  )
}

export default MacroSelector
