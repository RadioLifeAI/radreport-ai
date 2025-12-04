import { useState, useCallback, useEffect } from 'react'
import { useReportStore } from '@/store'
import { useTemplates } from '@/hooks/useTemplates'
import { useFrasesModelo, FraseModelo } from '@/hooks/useFrasesModelo'
import { useDictation } from '@/hooks/useDictation'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { supabaseService } from '@/services/SupabaseService'
import { toast } from 'sonner'
import { Editor } from '@tiptap/react'
import { EditorHeader } from '@/components/editor/EditorHeader'
import { EditorLeftSidebar } from '@/components/editor/EditorLeftSidebar'
import { EditorRightSidebar } from '@/components/editor/EditorRightSidebar'
import { EditorFooter } from '@/components/editor/EditorFooter'
import { Macro } from '@/components/selectors/MacroSelector'
import { VariablesModal } from '@/components/editor/VariablesModal'
import { TemplateVariablesModal } from '@/components/editor/TemplateVariablesModal'
import { useVariableProcessor } from '@/hooks/useVariableProcessor'
import { useChat } from '@/hooks/useChat'
import { ChatPanel } from '@/components/chat'
import { insertContent } from '@/editor/commands'
import { useInternalCheckout } from '@/hooks/useInternalCheckout'
import { PlansSelectionSheet } from '@/components/subscription'
import { useFavoriteCalculators } from '@/hooks/useFavoriteCalculators'
import { useFavoriteTables } from '@/hooks/useFavoriteTables'
import { CalculatorModal } from '@/components/editor/CalculatorModal'
import { TableViewerModal } from '@/components/editor/TableViewerModal'
import { RadiologyCalculator } from '@/lib/radiologyCalculators'
import { RadiologyTable } from '@/lib/radiologyTables'
import { UserDictionaryProvider } from '@/contexts/UserDictionaryContext'
import { TemplateWithVariables, TemplateVariableValues } from '@/types/templateVariables'

interface ProfessionalEditorPageProps {
  onGenerateConclusion?: (conclusion?: string) => void
}

export function ProfessionalEditorPage({ onGenerateConclusion }: ProfessionalEditorPageProps) {
  const { content, setContent, modalidade, setModalidade } = useReportStore()
  const isMobile = useIsMobile()
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [macroDropdownVisible, setMacroDropdownVisible] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('Template do exame')
  const [selectedMacro, setSelectedMacro] = useState('Frases rápidas')
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  
  // Variables modal state (for frases)
  const [variablesModalOpen, setVariablesModalOpen] = useState(false)
  const [selectedFraseForVariables, setSelectedFraseForVariables] = useState<FraseModelo | null>(null)
  
  // Template variables modal state
  const [templateVariablesModalOpen, setTemplateVariablesModalOpen] = useState(false)
  const [selectedTemplateForVariables, setSelectedTemplateForVariables] = useState<TemplateWithVariables | null>(null)
  
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  const { hasVariables } = useVariableProcessor()
  
  // Chat hook
  const {
    messages: chatMessages,
    isStreaming,
    sendMessage,
    startNewConversation
  } = useChat()

  // Internal checkout hook for upgrade modal
  const {
    showPlansSheet,
    isLoading: checkoutLoading,
    openPlansSheet,
    closePlansSheet,
    handleSelectPlan,
  } = useInternalCheckout()

  // Favorites hooks for sidebar
  const { topFavoriteCalculators, recordUsage: recordCalculatorUsage } = useFavoriteCalculators()
  const { topFavoriteTables, recordUsage: recordTableUsage } = useFavoriteTables()
  
  // Calculator/Table modal state for sidebar
  const [sidebarCalculator, setSidebarCalculator] = useState<RadiologyCalculator | null>(null)
  const [sidebarCalculatorOpen, setSidebarCalculatorOpen] = useState(false)
  const [sidebarTable, setSidebarTable] = useState<RadiologyTable | null>(null)
  const [sidebarTableOpen, setSidebarTableOpen] = useState(false)

  // Voice dictation hook - unified system (Web Speech + Whisper chunking)
  const { 
    isActive: isVoiceActive, 
    status: voiceStatus, 
    startDictation, 
    stopDictation,
    isWhisperEnabled,
    toggleWhisper,
    isTranscribing,
    whisperStats,
    isAICorrectorEnabled,
    toggleAICorrector
  } = useDictation(editorInstance)

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
    selectedCategoria,
    setSearchTerm,
    setSelectedModality,
    setSelectedCategoria,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    applyTemplate: hookApplyTemplate,
    applyTemplateWithVariables,
    needsVariableInput,
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

  // Convert FraseModelo to Macro
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

  // Auto-collapse sidebars on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
      setRightSidebarCollapsed(true)
    }
  }, [isMobile])

  // Copy formatted report function
  const copyFormattedReport = useCallback(async () => {
    try {
      const container = document.createElement('div')
      container.innerHTML = content
      
      // TÍTULO PRINCIPAL - Centralizado, maiúsculas, 24pt após
      const title = container.querySelector('h1, h2')
      if (title) {
        title.textContent = title.textContent?.toUpperCase() || ''
        title.setAttribute('style', `
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12pt;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 24pt;
          line-height: 1.15;
        `.replace(/\s+/g, ' ').trim())
      }
      
      // SUBTÍTULOS - 18pt antes, 8pt após (TÉCNICA, ACHADOS, IMPRESSÃO)
      container.querySelectorAll('h3, h4, h5, h6').forEach(el => {
        el.setAttribute('style', `
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12pt;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 18pt;
          margin-bottom: 8pt;
          line-height: 1.15;
        `.replace(/\s+/g, ' ').trim())
      })
      
      // Primeiro subtítulo após título (TÉCNICA) - sem margin-top extra
      const firstH3 = container.querySelector('h2 + h3, h1 + h3')
      if (firstH3) {
        firstH3.setAttribute('style', `
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12pt;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 8pt;
          line-height: 1.15;
        `.replace(/\s+/g, ' ').trim())
      }
      
      // PARÁGRAFOS - 6pt entre parágrafos, texto justificado
      container.querySelectorAll('p, li, blockquote').forEach(el => {
        el.setAttribute('style', `
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12pt;
          font-weight: 400;
          margin-top: 6pt;
          margin-bottom: 6pt;
          text-align: justify;
          line-height: 1.15;
        `.replace(/\s+/g, ' ').trim())
      })
      
      // Último parágrafo antes de subtítulo - margin-bottom maior (12pt)
      container.querySelectorAll('p + h3, p + h4, p + h5, p + h6').forEach(subtitle => {
        const prevParagraph = subtitle.previousElementSibling
        if (prevParagraph && (prevParagraph.tagName === 'P' || prevParagraph.tagName === 'LI')) {
          const currentStyle = prevParagraph.getAttribute('style') || ''
          prevParagraph.setAttribute('style', 
            currentStyle.replace(/margin-bottom:\s*[\d.]+pt/i, 'margin-bottom: 12pt')
          )
        }
      })
      
      // TABELAS INFORMATIVAS - decodificar Base64 e preservar formatação original
      container.querySelectorAll('.informative-table-block').forEach(block => {
        const encodedContent = block.getAttribute('data-html-content')
        
        if (encodedContent) {
          let htmlContent: string
          
          // Decodificar Base64
          try {
            htmlContent = decodeURIComponent(atob(encodedContent))
          } catch {
            // Fallback se não for Base64 (formato antigo)
            htmlContent = encodedContent
          }
          
          // Parser temporário para extrair tabela do HTML decodificado
          const temp = document.createElement('div')
          temp.innerHTML = htmlContent
          const table = temp.querySelector('table')
          
          if (table) {
            // PROPAGAÇÃO DE ESTILOS DO <tr> PARA <td>/<th> (compatibilidade Word)
            table.querySelectorAll('tr').forEach(tr => {
              const trStyle = tr.getAttribute('style') || ''
              
              // Extrair background e color do <tr>
              const bgMatch = trStyle.match(/background(?:-color)?:\s*([^;]+)/i)
              const colorMatch = trStyle.match(/(?:^|;)\s*color:\s*([^;]+)/i)
              
              if (bgMatch || colorMatch) {
                // Propagar para cada célula filho
                tr.querySelectorAll('td, th').forEach(cell => {
                  const cellStyle = cell.getAttribute('style') || ''
                  let newStyle = cellStyle
                  
                  // Adicionar background se não existir na célula
                  if (bgMatch && !cellStyle.includes('background')) {
                    newStyle += `; background-color: ${bgMatch[1].trim()}`
                  }
                  
                  // Adicionar color se não existir na célula
                  if (colorMatch && !cellStyle.includes('color:')) {
                    newStyle += `; color: ${colorMatch[1].trim()}`
                  }
                  
                  cell.setAttribute('style', newStyle.replace(/^;\s*/, ''))
                })
              }
            })
            
            // Ajustar margem profissional
            const currentStyle = table.getAttribute('style') || ''
            const cleanedStyle = currentStyle.replace(/margin:[^;]+;?/g, '').trim()
            table.setAttribute('style', cleanedStyle + '; margin: 12pt 0;')
            
            // Substituir bloco pela tabela com formatação propagada
            block.replaceWith(table)
          } else {
            block.remove()
          }
        } else {
          block.remove()
        }
      })
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12pt;
      line-height: 1.15;
      margin: 2.5cm;
      padding: 0;
    }
    
    h1, h2 {
      text-align: center;
      text-transform: uppercase;
      margin: 0 0 24pt 0;
      font-weight: bold;
    }
    
    h3, h4, h5, h6 {
      text-transform: uppercase;
      margin: 18pt 0 8pt 0;
      font-weight: bold;
    }
    
    p {
      margin: 6pt 0;
      text-align: justify;
    }
    
    ul, ol {
      margin: 6pt 0;
    }
    
    /* Tabelas usam apenas estilos inline originais - sem CSS genérico */
  </style>
</head>
<body>${container.innerHTML}</body>
</html>`
      
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
      toast.success('Laudo copiado com formatação profissional')
      return true
    } catch (error) {
      console.error('Erro ao copiar laudo:', error)
      toast.error('Erro ao copiar laudo')
      return false
    }
  }, [content])

  // Find document sections
  const findDocumentSections = useCallback((editor: Editor) => {
    const { state } = editor
    const { doc } = state
    const sections = {
      achados: { start: -1, end: -1, headingPos: -1 },
      conclusao: { start: -1, end: -1, headingPos: -1 },
      tecnica: { start: -1, end: -1, headingPos: -1 },
    }

    let pos = 0
    doc.descendants((node, nodePos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent.toLowerCase()
        if (/achados?|findings?/i.test(text)) {
          sections.achados.headingPos = nodePos
          sections.achados.start = nodePos + node.nodeSize
        } else if (/conclus[ãa]o|impress[ãa]o/i.test(text)) {
          sections.conclusao.headingPos = nodePos
          sections.conclusao.start = nodePos + node.nodeSize
          if (sections.achados.start !== -1 && sections.achados.end === -1) {
            sections.achados.end = nodePos - 1
          }
        } else if (/t[ée]cnica/i.test(text)) {
          sections.tecnica.headingPos = nodePos
          sections.tecnica.start = nodePos + node.nodeSize
        }
      }
      pos = nodePos + node.nodeSize
      return true
    })

    if (sections.conclusao.start !== -1) {
      sections.conclusao.end = doc.content.size - 1
    }
    if (sections.achados.start !== -1 && sections.achados.end === -1) {
      sections.achados.end = sections.conclusao.start !== -1 ? sections.conclusao.start - 1 : doc.content.size - 1
    }

    return sections
  }, [])

  // Replace conclusion text
  const replaceConclusionText = useCallback((editor: Editor, newConclusion: string) => {
    const sections = findDocumentSections(editor)
    
    if (sections.conclusao.start !== -1 && sections.conclusao.end !== -1) {
      editor.commands.deleteRange({
        from: sections.conclusao.start,
        to: sections.conclusao.end
      })
      editor.commands.insertContentAt(sections.conclusao.start, newConclusion)
    } else {
      editor.commands.insertContent('<h3>IMPRESSÃO</h3>')
      editor.commands.insertContent(`<p>${newConclusion}</p>`)
    }
  }, [findDocumentSections])

  // Template selection handler - direct (no modal)
  const handleTemplateSelectDirect = useCallback((template: any) => {
    setSelectedTemplate(template.titulo)
    setSelectedModality(template.modalidade_codigo)
    hookApplyTemplate(template)
    setFraseSearchTerm('')
    setDropdownVisible(false)
  }, [hookApplyTemplate, setSelectedModality, setFraseSearchTerm, setDropdownVisible])

  // Template selection handler - with variables modal
  const handleTemplateSelectWithVariables = useCallback((template: any) => {
    setSelectedTemplateForVariables(template as TemplateWithVariables)
    setTemplateVariablesModalOpen(true)
    setDropdownVisible(false)
  }, [])

  // Template selection handler - auto-detect
  const handleTemplateSelect = useCallback((template: any) => {
    if (needsVariableInput(template)) {
      handleTemplateSelectWithVariables(template)
    } else {
      handleTemplateSelectDirect(template)
    }
  }, [needsVariableInput, handleTemplateSelectDirect, handleTemplateSelectWithVariables])

  // Template variables modal submit handler
  const handleTemplateVariablesSubmit = useCallback((selectedTechnique: string | null, variableValues: TemplateVariableValues) => {
    if (selectedTemplateForVariables) {
      applyTemplateWithVariables(selectedTemplateForVariables as any, selectedTechnique, variableValues)
    }
    setTemplateVariablesModalOpen(false)
    setSelectedTemplateForVariables(null)
  }, [selectedTemplateForVariables, applyTemplateWithVariables])

  // Modality click handler
  const handleModalityClick = useCallback((modality: string) => {
    if (hookSelectedModality === modality) {
      setSelectedModality(null)
    } else {
      setSelectedModality(modality)
    }
  }, [hookSelectedModality, setSelectedModality])

  // Frase selection handler
  const handleFraseSelect = useCallback((frase: Macro) => {
    if (!editorInstance) return
    
    // Find original frase with variables
    const fraseOriginal = frases.find(f => f.id === frase.id)
    
    // Check if frase has variables that need to be filled
    const needsVariables = fraseOriginal?.variaveis && 
                          fraseOriginal.variaveis.length > 0 && 
                          (hasVariables(frase.frase) || (frase.conclusao && hasVariables(frase.conclusao)))
    
    if (needsVariables && fraseOriginal) {
      // Open modal for variable filling
      setSelectedFraseForVariables(fraseOriginal)
      setVariablesModalOpen(true)
      return
    }
    
    // Insert directly if no variables
    const sections = findDocumentSections(editorInstance)
    const { state } = editorInstance
    const { selection } = state
    const cursorPos = selection.from

    const isInConclusion = sections.conclusao.start !== -1 && 
                          cursorPos >= sections.conclusao.start && 
                          cursorPos <= sections.conclusao.end

    // Wrap text in paragraph tags to prevent uppercase from h3 styling
    const wrapInParagraph = (text: string) => {
      if (text.startsWith('<p>') || text.startsWith('<h')) return text
      return `<p>${text}</p>`
    }

    if (frase.frase && frase.conclusao) {
      if (isInConclusion && frase.conclusao) {
        editorInstance.commands.insertContent(wrapInParagraph(frase.conclusao))
      } else if (sections.achados.start !== -1) {
        editorInstance.commands.insertContent(wrapInParagraph(frase.frase))
        if (frase.conclusao) {
          replaceConclusionText(editorInstance, frase.conclusao)
        }
      } else {
        editorInstance.commands.insertContent(wrapInParagraph(frase.frase))
        if (frase.conclusao) {
          editorInstance.commands.insertContent('<p></p>')
          editorInstance.commands.insertContent(wrapInParagraph(frase.conclusao))
        }
      }
    } else if (frase.frase) {
      editorInstance.commands.insertContent(wrapInParagraph(frase.frase))
    } else if (frase.conclusao) {
      if (sections.conclusao.start !== -1) {
        replaceConclusionText(editorInstance, frase.conclusao)
      } else {
        editorInstance.commands.insertContent(wrapInParagraph(frase.conclusao))
      }
    }

    if (fraseOriginal) {
      hookApplyFrase(fraseOriginal)
    }
    setFraseSearchTerm('')
    setMacroDropdownVisible(false)
  }, [editorInstance, hookApplyFrase, frases, findDocumentSections, replaceConclusionText, setFraseSearchTerm, hasVariables])
  
  // Handle variables submission
  const handleVariablesSubmit = useCallback((processedTexto: string, processedConclusao?: string) => {
    if (!editorInstance) return
    
    const sections = findDocumentSections(editorInstance)
    const { state } = editorInstance
    const { selection } = state
    const cursorPos = selection.from

    const isInConclusion = sections.conclusao.start !== -1 && 
                          cursorPos >= sections.conclusao.start && 
                          cursorPos <= sections.conclusao.end

    // Wrap text in paragraph tags to prevent uppercase from h3 styling
    const wrapInParagraph = (text: string) => {
      if (text.startsWith('<p>') || text.startsWith('<h')) return text
      return `<p>${text}</p>`
    }

    if (processedTexto && processedConclusao) {
      if (isInConclusion && processedConclusao) {
        editorInstance.commands.insertContent(wrapInParagraph(processedConclusao))
      } else if (sections.achados.start !== -1) {
        editorInstance.commands.insertContent(wrapInParagraph(processedTexto))
        if (processedConclusao) {
          replaceConclusionText(editorInstance, processedConclusao)
        }
      } else {
        editorInstance.commands.insertContent(wrapInParagraph(processedTexto))
        if (processedConclusao) {
          editorInstance.commands.insertContent('<p></p>')
          editorInstance.commands.insertContent(wrapInParagraph(processedConclusao))
        }
      }
    } else if (processedTexto) {
      editorInstance.commands.insertContent(wrapInParagraph(processedTexto))
    } else if (processedConclusao) {
      if (sections.conclusao.start !== -1) {
        replaceConclusionText(editorInstance, processedConclusao)
      } else {
        editorInstance.commands.insertContent(wrapInParagraph(processedConclusao))
      }
    }
    
    // Apply frase to recent
    if (selectedFraseForVariables) {
      hookApplyFrase(selectedFraseForVariables)
    }
    
    setVariablesModalOpen(false)
    setSelectedFraseForVariables(null)
  }, [editorInstance, findDocumentSections, replaceConclusionText, selectedFraseForVariables, hookApplyFrase])

  return (
    <UserDictionaryProvider>
    <div className="h-screen flex flex-col bg-background">
      <EditorHeader
        selectedTemplate={selectedTemplate}
        searchTerm={searchTerm}
        onTemplateSearch={(term) => {
          setSearchTerm(term)
          setSelectedTemplate(term)
        }}
        onTemplateSelect={handleTemplateSelect}
        onModalityClick={handleModalityClick}
        onCategoriaClick={setSelectedCategoria}
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
        selectedCategoria={selectedCategoria}
        isFavorite={isFavorite}
        modalities={['RM', 'TC', 'USG', 'RX', 'MG']}
        selectedMacro={selectedMacro}
        fraseSearchTerm={fraseSearchTerm}
        onMacroSearch={(term) => {
          setFraseSearchTerm(term)
          setSelectedMacro(term)
        }}
        onMacroSelect={handleFraseSelect}
        onCategoryClick={setFraseSelectedCategory}
        onMacroModalityClick={setFraseSelectedModality}
        onMacroFavoriteToggle={(id) => {
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
        macrosLoading={frasesLoading}
        macrosError={frasesError}
        selectedCategory={fraseSelectedCategory}
        macroSelectedModality={fraseSelectedModality}
        isMacroFavorite={isFraseFavorite}
        macroDropdownVisible={macroDropdownVisible}
        setMacroDropdownVisible={setMacroDropdownVisible}
        categories={fraseCategories}
        macroModalities={['RM', 'TC', 'USG', 'RX', 'MG']}
        needsVariableInput={needsVariableInput}
        onTemplateSelectDirect={handleTemplateSelectDirect}
        onTemplateSelectWithVariables={handleTemplateSelectWithVariables}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorLeftSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          recentTemplates={recentTemplates}
          recentFrases={recentFrasesAsMacros}
          onTemplateSelect={handleTemplateSelect}
          onFraseSelect={handleFraseSelect}
          isMobile={isMobile}
          topFavoriteCalculators={topFavoriteCalculators}
          topFavoriteTables={topFavoriteTables}
          onCalculatorSelect={(calc) => {
            setSidebarCalculator(calc)
            setSidebarCalculatorOpen(true)
            recordCalculatorUsage(calc.id)
          }}
          onTableSelect={(table) => {
            setSidebarTable(table)
            setSidebarTableOpen(true)
            recordTableUsage(table.id)
          }}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-6">
            <SimpleEditor 
              content={content}
              onChange={(html) => setContent(html)}
              onEditorReady={setEditorInstance}
              onCharacterCount={setCharacterCount}
              placeholder="Digite ou dite seu laudo radiológico..."
            />
            
            <div className="mt-4 text-right">
              <span className="text-xs text-muted-foreground">
                {characterCount} caracteres
              </span>
            </div>
          </div>

          <EditorFooter
            editor={editorInstance}
            onRestart={() => {
              if (editorInstance) {
                editorInstance.commands.setContent('')
                toast.success('Laudo reiniciado')
              }
            }}
            onCopy={async () => {
              const success = await copyFormattedReport()
              if (success) {
                toast.success('Laudo copiado e salvo!')
              }
              return success
            }}
          />
        </main>

        <EditorRightSidebar
          collapsed={rightSidebarCollapsed}
          onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          editor={editorInstance}
          isVoiceActive={isVoiceActive}
          voiceStatus={voiceStatus}
          onVoiceStart={async () => {
            const stream = await startDictation()
            if (stream) {
              setMediaStream(stream)
            }
          }}
          onVoiceStop={() => {
            stopDictation()
            setMediaStream(null)
          }}
          mediaStream={mediaStream}
          onOpenVariablesModal={(frase) => {
            setSelectedFraseForVariables(frase)
            setVariablesModalOpen(true)
          }}
          isWhisperEnabled={isWhisperEnabled}
          toggleWhisper={toggleWhisper}
          isTranscribing={isTranscribing}
          whisperStats={whisperStats}
          isAICorrectorEnabled={isAICorrectorEnabled}
          toggleAICorrector={toggleAICorrector}
          isMobile={isMobile}
          onUpgrade={openPlansSheet}
        />
      </div>
      
      {/* Variables Modal (for Frases) */}
      {selectedFraseForVariables && (
        <VariablesModal
          open={variablesModalOpen}
          onOpenChange={setVariablesModalOpen}
          codigo={selectedFraseForVariables.codigo}
          texto={selectedFraseForVariables.frase}
          conclusao={selectedFraseForVariables.conclusao}
          variaveis={selectedFraseForVariables.variaveis || []}
          onSubmit={handleVariablesSubmit}
        />
      )}
      
      {/* Template Variables Modal */}
      <TemplateVariablesModal
        open={templateVariablesModalOpen}
        onOpenChange={setTemplateVariablesModalOpen}
        template={selectedTemplateForVariables}
        onSubmit={handleTemplateVariablesSubmit}
      />
      
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        isStreaming={isStreaming}
        onSendMessage={sendMessage}
        onInsertToReport={(text) => {
          if (editorInstance) {
            insertContent(editorInstance, text, true);
            toast.success('Texto inserido no laudo');
          }
        }}
        onNewConversation={startNewConversation}
        onUpgrade={openPlansSheet}
      />
      
      <PlansSelectionSheet
        open={showPlansSheet}
        onOpenChange={closePlansSheet}
        onSelectPlan={handleSelectPlan}
        isLoading={checkoutLoading}
      />
      
      {/* Sidebar Calculator Modal */}
      <CalculatorModal
        calculator={sidebarCalculator}
        isOpen={sidebarCalculatorOpen}
        onClose={() => setSidebarCalculatorOpen(false)}
        onInsert={(text) => {
          if (editorInstance) {
            editorInstance.chain().focus().insertContent(text).run()
          }
        }}
      />
      
      {/* Sidebar Table Modal */}
      <TableViewerModal
        open={sidebarTableOpen}
        onOpenChange={setSidebarTableOpen}
        table={sidebarTable}
        editor={editorInstance}
        onInsertTable={(html) => {
          if (editorInstance) {
            editorInstance.chain().focus().insertContent(html).run()
            toast.success('Tabela inserida')
          }
        }}
      />
    </div>
    </UserDictionaryProvider>
  )
}
