import { useState, useCallback, useRef, useEffect } from 'react'
import { useReportStore } from '@/store'
import { useTemplates } from '@/hooks/useTemplates'
import { useFrasesModelo } from '@/hooks/useFrasesModelo'
import { useAuth } from '@/hooks/useAuth'
import { Star, FileText, Settings, Sparkles, Copy, RotateCcw, ChevronLeft, Moon, Sun, History, X } from 'lucide-react'
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
import { useTheme } from 'next-themes'
import EditorAIButton from '@/components/editor/EditorAIButton'

interface ProfessionalEditorPageProps {
  onGenerateConclusion?: (conclusion?: string) => void
}

export function ProfessionalEditorPage({ onGenerateConclusion }: ProfessionalEditorPageProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { content, setContent, modalidade, setModalidade } = useReportStore()
  const { theme, setTheme } = useTheme()
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [macroDropdownVisible, setMacroDropdownVisible] = useState(false)
  const [frasesPopoverOpen, setFrasesPopoverOpen] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('Template do exame')
  const [selectedMacro, setSelectedMacro] = useState('Frases rápidas')
  const [speechAIActivated, setSpeechAIActivated] = useState(false)

  // Refs para gestão de ditado em tempo real com âncora dinâmica
  const dictAnchorRef = useRef<number | null>(null)
  const dictInterimLengthRef = useRef(0)
  const dictConfirmedLengthRef = useRef(0)
  const dictProgUpdateRef = useRef(false)
  const dictCapitalizedRef = useRef(false)

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

  // Função para verificar se deve capitalizar
  const shouldCapitalize = useCallback((editor: Editor, pos: number): boolean => {
    if (pos === 0) return true
    const textBefore = editor.state.doc.textBetween(Math.max(0, pos - 3), pos)
    return /[.!?]\s*$/.test(textBefore) || /^\s*$/.test(textBefore)
  }, [])

  // Função para deletar última palavra
  const deleteLastWord = useCallback(() => {
    if (!editorInstance) return
    const { state } = editorInstance
    const { selection } = state
    const { from } = selection
    const textBefore = state.doc.textBetween(0, from)
    const match = textBefore.match(/\S+\s*$/)
    if (match) {
      const deleteFrom = from - match[0].length
      editorInstance.commands.deleteRange({ from: deleteFrom, to: from })
    }
  }, [editorInstance])

  // Voice command mapping expandido
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
      'reticências': '...',
      'reticencias': '...',
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

    // Normalizar espaços em torno de pontuação
    processedText = processedText.replace(/\s+([.,;:!?])/g, '$1')
    processedText = processedText.replace(/([.,;:!?])(?!\s|$)/g, '$1 ')

    return processedText
  }

  // Handle interim transcript
  const handleInterimTranscript = useCallback((text: string) => {
    if (!editorInstance) return
    
    const { state } = editorInstance
    const { selection } = state
    
    // Inicializar âncora se primeira inserção
    if (dictAnchorRef.current === null) {
      dictAnchorRef.current = selection.from
      dictConfirmedLengthRef.current = 0
      dictCapitalizedRef.current = shouldCapitalize(editorInstance, selection.from)
      
      // Remover espaços iniciais na nova âncora
      const textBefore = state.doc.textBetween(Math.max(0, selection.from - 10), selection.from)
      if (/\s+$/.test(textBefore)) {
        const spacesLength = textBefore.match(/\s+$/)?.[0].length || 0
        editorInstance.commands.deleteRange({
          from: selection.from - spacesLength,
          to: selection.from
        })
        dictAnchorRef.current = selection.from - spacesLength
      }
    }
    
    const basePos = dictAnchorRef.current
    const processedText = replaceVoiceCommands(text)
    
    // Aplicar capitalização se necessário
    let finalText = processedText
    if (dictCapitalizedRef.current && finalText.length > 0) {
      finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1)
    }
    
    // Remover texto provisório anterior
    if (dictInterimLengthRef.current > 0) {
      dictProgUpdateRef.current = true
      editorInstance.commands.deleteRange({
        from: basePos,
        to: basePos + dictInterimLengthRef.current
      })
    }
    
    // Inserir novo texto provisório
    dictProgUpdateRef.current = true
    editorInstance.commands.insertContentAt(basePos, finalText)
    dictInterimLengthRef.current = finalText.length
  }, [editorInstance, shouldCapitalize])

  // Handle final transcript
  const handleFinalTranscript = useCallback((text: string) => {
    if (!editorInstance) return
    
    if (dictAnchorRef.current === null) {
      // Sem âncora ativa, inserir diretamente
      const processedText = replaceVoiceCommands(text)
      editorInstance.commands.insertContent(processedText + ' ')
      return
    }
    
    const basePos = dictAnchorRef.current
    const processedText = replaceVoiceCommands(text)
    
    // Aplicar capitalização se necessário
    let finalText = processedText
    if (dictCapitalizedRef.current && finalText.length > 0) {
      finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1)
      dictCapitalizedRef.current = false
    }
    
    // Remover provisório
    if (dictInterimLengthRef.current > 0) {
      dictProgUpdateRef.current = true
      editorInstance.commands.deleteRange({
        from: basePos,
        to: basePos + dictInterimLengthRef.current
      })
      dictInterimLengthRef.current = 0
    }
    
    // Calcular delta (novo texto - já confirmado)
    const delta = finalText.slice(dictConfirmedLengthRef.current)
    if (delta.length > 0) {
      dictProgUpdateRef.current = true
      const insertPos = basePos + dictConfirmedLengthRef.current
      editorInstance.commands.insertContentAt(insertPos, delta)
      dictConfirmedLengthRef.current = finalText.length
    }
    
    // Detectar pausa: se não termina com pontuação, inserir ponto + quebra
    const endsWithPunctuation = /[.!?,;:\s]$/.test(finalText)
    if (!endsWithPunctuation) {
      dictProgUpdateRef.current = true
      editorInstance.chain()
        .insertContentAt(basePos + dictConfirmedLengthRef.current, '.')
        .insertContent({ type: 'hardBreak' })
        .run()
      dictCapitalizedRef.current = true
      dictConfirmedLengthRef.current += 1
    }
  }, [editorInstance])

  // Configurar callbacks de voz no mount
  useEffect(() => {
    const speechService = getSpeechRecognitionService()
    
    speechService.setOnResult((result) => {
      if (result.isFinal) {
        handleFinalTranscript(result.transcript)
      } else {
        handleInterimTranscript(result.transcript)
      }
    })
    
    speechService.setOnEnd((reason) => {
      if (reason === 'user') {
        // Reset âncora ao parar manualmente
        dictAnchorRef.current = null
        dictInterimLengthRef.current = 0
        dictConfirmedLengthRef.current = 0
        dictCapitalizedRef.current = false
      }
    })
    
    return () => {
      speechService.stopListening()
    }
  }, [handleInterimTranscript, handleFinalTranscript])

  // Monitorar movimento de cursor para reset de âncora
  useEffect(() => {
    if (!editorInstance) return
    
    const handleSelectionUpdate = () => {
      if (dictProgUpdateRef.current) {
        dictProgUpdateRef.current = false
        return
      }
      
      // Usuário moveu cursor manualmente
      const { state } = editorInstance
      const { selection } = state
      const currentPos = selection.from
      
      if (dictAnchorRef.current !== null && 
          (currentPos < dictAnchorRef.current || 
           currentPos > dictAnchorRef.current + dictConfirmedLengthRef.current + dictInterimLengthRef.current)) {
        // Reset âncora
        dictAnchorRef.current = null
        dictInterimLengthRef.current = 0
        dictConfirmedLengthRef.current = 0
      }
    }
    
    editorInstance.on('selectionUpdate', handleSelectionUpdate)
    return () => {
      editorInstance.off('selectionUpdate', handleSelectionUpdate)
    }
  }, [editorInstance])

  // Handle voice text (fallback para compatibilidade)
  const onVoiceText = useCallback((text: string) => {
    if (!editorInstance) return
    const processedText = replaceVoiceCommands(text)
    editorInstance.commands.insertContent(processedText + ' ')
  }, [editorInstance])

  // Handle voice command
  const onVoiceCommand = useCallback((cmd: any) => {
    if (!editorInstance) return
    
    const action = cmd?.action?.toLowerCase() || ''
    
    if (action.includes('apagar') || action.includes('deletar')) {
      deleteLastWord()
    } else if (action.includes('desfaz')) {
      editorInstance.commands.undo()
    } else if (action.includes('refaz')) {
      editorInstance.commands.redo()
    } else {
      console.log('Voice command:', cmd)
    }
  }, [editorInstance, deleteLastWord])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-indigo-500/60 shadow-glow" />
            <span className="font-bold text-xl gradient-text-medical">RadReport</span>
          </div>

          {/* Template Selector in Header */}
          <div className="relative">
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
              modalities={['RM', 'TC', 'USG', 'RX', 'MG']}
            />
          </div>

          {/* Macro Selector in Header */}
          <div className="relative">
            <MacroSelector
              selectedMacro={selectedMacro}
              searchTerm={fraseSearchTerm}
              onMacroSearch={(term) => {
                setFraseSearchTerm(term)
                setSelectedMacro(term)
              }}
              onMacroSelect={handleFraseSelect}
              onCategoryClick={setFraseSelectedCategory}
              onModalityClick={setFraseSelectedModality}
              onFavoriteToggle={(id) => {
                if (isFraseFavorite(id)) {
                  removeFraseFromFavorites(id)
                } else {
                  addFraseToFavorites(id)
                }
              }}
              macros={frasesAsMacros}
              filteredMacros={filteredFrasesAsMacros}
              recentMacros={recentFrasesAsMacros}
              favoriteMacros={favoriteFrasesAsMacros}
              loading={frasesLoading}
              error={frasesError}
              selectedCategory={fraseSelectedCategory}
              selectedModality={fraseSelectedModality}
              isFavorite={isFraseFavorite}
              dropdownVisible={macroDropdownVisible}
              setDropdownVisible={setMacroDropdownVisible}
              categories={fraseCategories}
              modalities={['RM', 'TC', 'USG', 'RX', 'MG']}
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
            onClick={logout}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Sair"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Recent Lists */}
        {!sidebarCollapsed && (
          <aside className="w-64 border-r border-border/40 bg-card/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Templates Recentes */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Templates Recentes</h3>
                <div className="space-y-1">
                  {recentTemplates.slice(0, 5).map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                        {template.modalidade}
                      </span>
                      <span className="text-sm flex-1 truncate">{template.titulo}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isFavorite(template.id)) {
                            removeFromFavorites(template.id)
                          } else {
                            addToFavorites(template.id)
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star size={14} className={isFavorite(template.id) ? 'fill-yellow-400 text-yellow-400' : ''} />
                      </button>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frases Recentes */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Frases Recentes</h3>
                <div className="space-y-1">
                  {recentFrasesAsMacros.slice(0, 5).map(frase => (
                    <button
                      key={frase.id}
                      onClick={() => handleFraseSelect(frase)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                        {frase.modalidade_id || 'GERAL'}
                      </span>
                      <span className="text-sm flex-1 truncate">{frase.codigo}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isFraseFavorite(frase.id)) {
                            removeFraseFromFavorites(frase.id)
                          } else {
                            addFraseToFavorites(frase.id)
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star size={14} className={isFraseFavorite(frase.id) ? 'fill-yellow-400 text-yellow-400' : ''} />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`absolute left-0 top-20 z-40 bg-card border border-border/40 rounded-r-lg p-1 hover:bg-muted transition-colors ${sidebarCollapsed ? '' : 'left-64'}`}
          title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          <ChevronLeft size={16} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <SimpleEditor 
              content={content}
              onChange={(html) => setContent(html)}
              onEditorReady={setEditorInstance}
              onCharacterCount={setCharacterCount}
              placeholder="Digite ou dite seu laudo radiológico..."
            />
            
            {/* Character Count */}
            <div className="mt-4 text-right">
              <span className="text-xs text-muted-foreground">
                {characterCount} caracteres
              </span>
            </div>
          </div>

          {/* Right Floating Toolbar - REMOVED - Now part of right sidebar */}

          {/* Footer Action Bar */}
          <div className="h-16 border-t border-border/40 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6">
            <button
              onClick={() => {
                if (editorInstance) {
                  editorInstance.commands.setContent('')
                  toast.success('Laudo reiniciado')
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <RotateCcw size={18} />
              <span className="text-sm">Reiniciar laudo</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={copyFormattedReport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Copy size={18} />
                <span className="text-sm">Copiar laudo</span>
              </button>

              <button
                onClick={async () => {
                  const success = await copyFormattedReport()
                  if (success) {
                    toast.success('Laudo copiado e salvo!')
                  }
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 transition-all shadow-lg hover:scale-105"
              >
                <Sparkles size={18} />
                <span className="text-sm font-medium">Copiar e salvar</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right Collapse Button */}
        <button
          onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          className={`absolute right-0 top-20 z-40 bg-card border border-border/40 rounded-l-lg p-1 hover:bg-muted transition-colors ${rightSidebarCollapsed ? '' : 'right-64'}`}
          title={rightSidebarCollapsed ? "Expandir painel de controles" : "Colapsar painel de controles"}
        >
          <ChevronLeft size={16} className={`transition-transform ${rightSidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Right Sidebar - AI & Voice Controls */}
        {!rightSidebarCollapsed && (
          <aside className="w-64 border-l border-border/40 bg-card/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Frases Section */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Ações Rápidas</h3>
                <button
                  onClick={() => setFrasesPopoverOpen(!frasesPopoverOpen)}
                  className="w-full flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText size={18} />
                  <span className="text-sm">Frases rápidas</span>
                </button>
              </div>

              {/* Voice Controls Section */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Controles de Voz</h3>
                <div className="space-y-2">
                  <VoiceButton 
                    onText={onVoiceText}
                    onCommand={onVoiceCommand}
                    onAIActivate={() => setSpeechAIActivated(true)}
                  />
                  <SpeechStatusPanel />
                </div>
              </div>

              {/* AI Assistant Section */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Assistente IA</h3>
                <div className="space-y-2">
                  <EditorAIButton editor={editorInstance} />
                </div>
              </div>

              {/* History Section */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Histórico</h3>
                <button
                  className="w-full flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <History size={18} />
                  <span className="text-sm">Ver histórico</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}