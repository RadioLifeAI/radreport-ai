import { useState, useCallback, useRef, useEffect } from 'react'
import { useReportStore } from '@/store'
import { useTemplates } from '@/hooks/useTemplates'
import { useFrasesModelo } from '@/hooks/useFrasesModelo'
import { useAuth } from '@/hooks/useAuth'
import { Star, FileText, Settings, Mic, Sparkles, LogOut, Copy, RotateCcw, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import VoiceButton from '@/components/voice/VoiceButton'
import { getSpeechRecognitionService } from '@/services/SpeechRecognitionService'
import SpeechStatusPanel from '@/components/voice/SpeechStatusPanel'
import TemplateSelector from '@/components/selectors/TemplateSelector'
import MacroSelector, { Macro } from '@/components/selectors/MacroSelector'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { supabaseService } from '@/services/SupabaseService'
import { toast } from 'sonner'
import { Editor } from '@tiptap/react'

interface ProfessionalEditorPageProps {
  onGenerateConclusion?: (conclusion?: string) => void
}

export function ProfessionalEditorPage({ onGenerateConclusion }: ProfessionalEditorPageProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { content, setContent, modalidade, setModalidade } = useReportStore()
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [macroDropdownVisible, setMacroDropdownVisible] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('Template do exame')
  const [selectedMacro, setSelectedMacro] = useState('Frases rápidas')
  const [speechAIActivated, setSpeechAIActivated] = useState(false)

  // Template hook
  const {
    templates,
    filteredTemplatesForDisplay,
    recentTemplates,
    favoriteTemplates,
    loading,
    error,
    searchTerm,
    selectedModality: hookSelectedModality,
    setSearchTerm,
    setSelectedModality,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    applyTemplate: hookApplyTemplate,
  } = useTemplates()

  // Frases modelo hook
  const {
    frases,
    filteredFrasesForDisplay,
    recentFrases,
    favoriteFrases,
    loading: frasesLoading,
    error: frasesError,
    searchTerm: fraseSearchTerm,
    selectedCategory: fraseSelectedCategory,
    selectedModality: fraseSelectedModality,
    setSearchTerm: setFraseSearchTerm,
    setSelectedCategory: setFraseSelectedCategory,
    setSelectedModality: setFraseSelectedModality,
    isFavorite: isFraseFavorite,
    addToFavorites: addFraseToFavorites,
    removeFromFavorites: removeFraseFromFavorites,
    applyFrase: hookApplyFrase,
    categories: fraseCategories,
    modalities: fraseModalities,
  } = useFrasesModelo()

  // Converter FraseModelo para Macro
  const convertFraseToMacro = (frase: any): Macro => ({
    id: frase.id,
    codigo: frase.codigo,
    titulo: frase.titulo || frase.codigo,
    frase: frase.frase || frase.texto,
    conclusao: frase.conclusao,
    categoria: frase.categoria,
    modalidade_id: frase.modalidade_id,
    ativo: frase.ativa
  })

  const frasesAsMacros = frases.map(convertFraseToMacro)
  const filteredFrasesAsMacros = filteredFrasesForDisplay.map(convertFraseToMacro)
  const recentFrasesAsMacros = recentFrases.map(convertFraseToMacro)
  const favoriteFrasesAsMacros = favoriteFrases.map(convertFraseToMacro)

  // Função para copiar laudo formatado para Word
  const copyFormattedReport = async () => {
    try {
      const container = document.createElement('div')
      container.innerHTML = content
      
      const title = container.querySelector('h1, h2')
      if (title) {
        title.textContent = title.textContent?.toUpperCase() || ''
        title.setAttribute('style', 'font-family: Arial, Helvetica, sans-serif; font-size:12pt; font-weight:700; text-align:center; margin-bottom:20pt; margin-top:8pt; display:block; width:100%;')
      }
      
      container.querySelectorAll('h3,h4,h5,h6').forEach(el => {
        el.setAttribute('style', 'font-size:12pt; font-weight:600; margin-bottom:12pt; margin-top:16pt;')
      })
      
      container.querySelectorAll('p, li, blockquote, code, pre, table').forEach(el => {
        const prev = el.getAttribute('style') || ''
        const next = prev
          .split(';')
          .filter(s => s.trim() && !/^font-size\s*:/i.test(s))
          .join(';')
        el.setAttribute('style', `${next}${next ? ';' : ''}font-size:12pt; margin-bottom:8.4pt; margin-top:8.4pt; text-align:left; line-height:1.15;`)
      })
      
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family: Arial, Helvetica, sans-serif; font-size:12pt; line-height:1.4; margin:20pt; padding:0;">${container.innerHTML}</body></html>`
      const plain = container.textContent || ''
      const ClipboardItemAny = (window as any).ClipboardItem
      if (ClipboardItemAny) {
        const item = new ClipboardItemAny({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        })
        await navigator.clipboard.write([item])
      } else {
        await navigator.clipboard.writeText(plain)
      }
      toast.success('Laudo copiado com formatação')
      return true
    } catch (error) {
      console.error('Erro ao copiar laudo:', error)
      toast.error('Erro ao copiar laudo')
      return false
    }
  }

  // Função para encontrar seções do documento
  const findDocumentSections = useCallback((editor: Editor) => {
    const { state } = editor
    const { doc } = state
    const sections = {
      achados: { start: -1, end: -1, headingPos: -1 },
      conclusao: { start: -1, end: -1, headingPos: -1 },
      tecnica: { start: -1, end: -1, headingPos: -1 },
      documentEnd: doc.nodeSize - 2
    }
    
    let currentSection: string | null = null
    
    doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent.toLowerCase()
        const nodeEnd = pos + node.nodeSize
        
        if (currentSection) {
          const section = sections[currentSection as keyof Omit<typeof sections, 'documentEnd'>]
          if (typeof section === 'object' && section.start !== -1) {
            section.end = pos
          }
        }
        
        if (text.includes('achado') || text.includes('findings')) {
          currentSection = 'achados'
          sections.achados.headingPos = pos
          sections.achados.start = nodeEnd
        } else if (text.includes('conclusão') || text.includes('conclusion') || text.includes('impressão') || text.includes('impressao')) {
          currentSection = 'conclusao'
          sections.conclusao.headingPos = pos
          sections.conclusao.start = nodeEnd
        } else if (text.includes('técnica') || text.includes('tecnica') || text.includes('technique')) {
          currentSection = 'tecnica'
          sections.tecnica.headingPos = pos
          sections.tecnica.start = nodeEnd
        } else {
          currentSection = null
        }
      }
    })
    
    if (currentSection) {
      const section = sections[currentSection as keyof Omit<typeof sections, 'documentEnd'>]
      if (typeof section === 'object' && section.end === -1) {
        section.end = sections.documentEnd
      }
    }
    
    return sections
  }, [])

  // Função para substituir texto de conclusão
  const replaceConclusionText = useCallback((editor: Editor, newConclusion: string) => {
    if (!newConclusion) return
    
    const { state } = editor
    const { doc } = state
    let impressaoHeadingPos = -1
    let primeiroParagrafoImpressao = -1
    let ultimoParagrafoImpressao = -1
    
    doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const texto = node.textContent.toLowerCase()
        if (texto.includes('impressão') || texto.includes('impressao') || texto.includes('conclusão') || texto.includes('conclusion')) {
          impressaoHeadingPos = pos
        }
      }
      
      if (impressaoHeadingPos >= 0 && node.type.name === 'paragraph' && node.textContent) {
        if (pos > impressaoHeadingPos) {
          if (primeiroParagrafoImpressao === -1) {
            primeiroParagrafoImpressao = pos
          }
          ultimoParagrafoImpressao = pos
        }
      }
    })
    
    if (impressaoHeadingPos >= 0 && ultimoParagrafoImpressao >= 0) {
      const paragrafoNode = doc.nodeAt(ultimoParagrafoImpressao)
      if (paragrafoNode && paragrafoNode.textContent) {
        const texto = paragrafoNode.textContent.trim()
        
        if (texto.includes('Exame sem alterações dignas de nota') || 
            texto.includes('sem alterações') || 
            texto.includes('dentro dos limites da normalidade')) {
          editor.chain()
            .focus()
            .insertContentAt({ 
              from: ultimoParagrafoImpressao, 
              to: ultimoParagrafoImpressao + paragrafoNode.nodeSize 
            }, newConclusion)
            .run()
        } else {
          editor.chain()
            .focus()
            .insertContentAt(ultimoParagrafoImpressao + paragrafoNode.nodeSize, '\n' + newConclusion)
            .run()
        }
      }
    } else if (impressaoHeadingPos >= 0 && primeiroParagrafoImpressao === -1) {
      const headingNode = doc.nodeAt(impressaoHeadingPos)
      if (headingNode) {
        editor.chain()
          .focus()
          .insertContentAt(impressaoHeadingPos + headingNode.nodeSize, '\n' + newConclusion)
          .run()
      }
    } else {
      editor.chain()
        .focus()
        .insertContentAt(doc.nodeSize - 2, '\n' + newConclusion)
        .run()
    }
  }, [])

  // Handle template selection
  const handleTemplateSelect = useCallback((template: any) => {
    if (template?.id && template?.titulo && template?.modalidade) {
      setSelectedTemplate(template.titulo)
      setModalidade(template.modalidade)
      hookApplyTemplate(template)
    }
    setDropdownVisible(false)
  }, [setModalidade, hookApplyTemplate])

  // Handle modality chip click
  const handleModalityClick = useCallback((modality: string) => {
    const newModality = hookSelectedModality === modality ? '' : modality
    setModalidade(newModality)
    setSelectedModality(newModality)
  }, [hookSelectedModality, setModalidade, setSelectedModality])

  // Handle frase selection
  const handleFraseSelect = useCallback((frase: any) => {
    if (frase?.frase && editorInstance) {
      setSelectedMacro(frase.codigo)
      setFraseSearchTerm('')
      hookApplyFrase(frase)
      
      const sections = findDocumentSections(editorInstance)
      const { state } = editorInstance
      const { selection } = state
      const { from, to } = selection
      
      const hasSelection = from !== to
      const currentPos = from
      
      if (hasSelection) {
        editorInstance.commands.insertContentAt({ from, to }, frase.frase + ' ')
        
        if (frase.conclusao) {
          replaceConclusionText(editorInstance, frase.conclusao)
        }
      } else {
        const conclusaoSection = sections.conclusao as { start: number; end: number; headingPos: number }
        const achadosSection = sections.achados as { start: number; end: number; headingPos: number }
        
        if (conclusaoSection.start > 0 && currentPos >= conclusaoSection.start && currentPos <= conclusaoSection.end) {
          editorInstance.commands.insertContentAt(currentPos, frase.frase + ' ')
          
          if (frase.conclusao) {
            editorInstance.commands.insertContentAt(currentPos + frase.frase.length + 1, '\n' + frase.conclusao)
          }
        } else if (achadosSection.start > 0 && currentPos >= achadosSection.start && currentPos <= achadosSection.end) {
          editorInstance.commands.insertContentAt(currentPos, frase.frase + ' ')
          
          if (frase.conclusao) {
            replaceConclusionText(editorInstance, frase.conclusao)
          }
        } else if (achadosSection.start > 0 && currentPos < achadosSection.start) {
          editorInstance.commands.insertContentAt(achadosSection.start, frase.frase + ' ')
          
          if (frase.conclusao) {
            replaceConclusionText(editorInstance, frase.conclusao)
          }
        } else {
          editorInstance.commands.insertContent(frase.frase + ' ')
          
          if (frase.conclusao) {
            replaceConclusionText(editorInstance, frase.conclusao)
          }
        }
      }
    }
    setMacroDropdownVisible(false)
  }, [editorInstance, hookApplyFrase, findDocumentSections, replaceConclusionText, setFraseSearchTerm])

  // Voice command mapping
  const replaceVoiceCommands = (text: string): string => {
    const commands: { [key: string]: string } = {
      'ponto final': '.',
      'ponto': '.',
      'vírgula': ',',
      'virgula': ',',
      'dois pontos': ':',
      'ponto e vírgula': ';',
      'ponto e virgula': ';',
      'interrogação': '?',
      'exclamação': '!',
      'nova linha': '\n',
      'parágrafo': '\n\n',
      'paragrafo': '\n\n',
      'abre parênteses': ' (',
      'fecha parênteses': ') ',
      'abre aspas': ' "',
      'fecha aspas': '" ',
      'hífen': '-',
      'traço': '—',
    }

    let processedText = text
    for (const [command, symbol] of Object.entries(commands)) {
      const regex = new RegExp(`\\b${command}\\b`, 'gi')
      processedText = processedText.replace(regex, symbol)
    }

    return processedText
  }

  // Handle voice text
  const onVoiceText = useCallback((text: string) => {
    if (!editorInstance) return

    const processedText = replaceVoiceCommands(text)
    editorInstance.commands.insertContent(processedText + ' ')
  }, [editorInstance])

  // Handle voice command
  const onVoiceCommand = useCallback((cmd: any) => {
    console.log('Voice command:', cmd)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border/40 bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-indigo-500/60 shadow-glow" />
            <span className="font-bold text-xl">RadReport</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={logout}
            className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <aside className="w-80 border-r border-border/40 bg-card p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Template Selector */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Templates</label>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  searchTerm={searchTerm}
                  onTemplateSearch={(term) => {
                    setSearchTerm(term)
                    setSelectedTemplate(term)
                  }}
                  onTemplateSelect={handleTemplateSelect}
                  onModalityClick={handleModalityClick}
                  onFavoriteToggle={(id) => {
                    if (isFavorite(id)) {
                      removeFromFavorites(id)
                    } else {
                      addToFavorites(id)
                    }
                  }}
                  dropdownVisible={dropdownVisible}
                  setDropdownVisible={setDropdownVisible}
                  templates={templates}
                  filteredTemplates={filteredTemplatesForDisplay}
                  recentTemplates={recentTemplates}
                  favoriteTemplates={favoriteTemplates}
                  loading={loading}
                  error={error}
                  selectedModality={hookSelectedModality}
                  isFavorite={isFavorite}
                  modalities={[]}
                />
              </div>

              {/* Macro Selector */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Frases Rápidas</label>
                <MacroSelector
                  selectedMacro={selectedMacro}
                  searchTerm={fraseSearchTerm}
                  onMacroSearch={(term) => {
                    setFraseSearchTerm(term)
                    setSelectedMacro(term)
                  }}
                  onMacroSelect={handleFraseSelect}
                  onCategoryClick={(cat) => setFraseSelectedCategory(cat === fraseSelectedCategory ? '' : cat)}
                  onModalityClick={(mod) => setFraseSelectedModality(mod === fraseSelectedModality ? '' : mod)}
                  onFavoriteToggle={(id) => {
                    if (isFraseFavorite(id)) {
                      removeFraseFromFavorites(id)
                    } else {
                      addFraseToFavorites(id)
                    }
                  }}
                  dropdownVisible={macroDropdownVisible}
                  setDropdownVisible={setMacroDropdownVisible}
                  macros={frasesAsMacros}
                  filteredMacros={filteredFrasesAsMacros}
                  recentMacros={recentFrasesAsMacros}
                  favoriteMacros={favoriteFrasesAsMacros}
                  loading={frasesLoading}
                  error={frasesError}
                  selectedCategory={fraseSelectedCategory}
                  selectedModality={fraseSelectedModality}
                  isFavorite={isFraseFavorite}
                  categories={fraseCategories}
                  modalities={fraseModalities}
                />
              </div>
            </div>
          </aside>
        )}

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="h-14 border-b border-border/40 bg-card flex items-center gap-2 px-4">
            <VoiceButton
              onText={onVoiceText}
              onCommand={onVoiceCommand}
              onAIActivate={() => setSpeechAIActivated(true)}
            />
            <SpeechStatusPanel />
            
            <div className="flex-1" />
            
            <button 
              onClick={copyFormattedReport}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <Copy size={18} />
              <span className="hidden sm:inline">Copiar</span>
            </button>
            
            <button 
              onClick={() => setContent('')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto">
              <SimpleEditor
                content={content}
                onChange={setContent}
                onEditorReady={setEditorInstance}
                onCharacterCount={setCharacterCount}
                placeholder="Digite ou dite seu laudo..."
              />
              
              <div className="mt-4 text-sm text-muted-foreground text-right">
                {characterCount} caracteres
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}