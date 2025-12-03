import { useEffect, useState, useCallback, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { Portal } from '@/components/ui/portal'
import { proofreader } from '@/extensions/RadiologySpellChecker'

interface SpellcheckSuggestionsPopoverProps {
  editor: Editor | null
}

interface ErrorInfo {
  docFrom: number
  docTo: number
  word: string
}

export function SpellcheckSuggestionsPopover({ editor }: SpellcheckSuggestionsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleSelectSuggestion = useCallback((suggestion: string) => {
    if (editor && errorInfo) {
      // Substituir o texto com erro pela sugestão
      editor
        .chain()
        .focus()
        .setTextSelection({ from: errorInfo.docFrom, to: errorInfo.docTo })
        .insertContent(suggestion)
        .run()
    }
    setIsOpen(false)
  }, [editor, errorInfo])

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Verificar se não está clicando em outro spell-error
        const target = e.target as HTMLElement
        if (!target.classList.contains('spell-error')) {
          setIsOpen(false)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Fechar com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Listener para cliques em .spell-error
  useEffect(() => {
    if (!editor) return

    const editorElement = editor.view.dom

    const handleSpellErrorClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (target.classList.contains('spell-error')) {
        e.preventDefault()
        e.stopPropagation()
        
        // Extrair dados do atributo word
        const wordAttr = target.getAttribute('word')
        if (!wordAttr) return
        
        try {
          const wordData = JSON.parse(wordAttr)
          const word = wordData.match?.word || target.textContent || ''
          const docFrom = wordData.docFrom
          const docTo = wordData.docTo
          
          if (docFrom === undefined || docTo === undefined) return
          
          // Posicionar o popover logo abaixo da palavra
          const rect = target.getBoundingClientRect()
          
          setPosition({
            top: rect.bottom + 4,
            left: rect.left
          })
          
          setErrorInfo({ docFrom, docTo, word })
          setIsLoading(true)
          setIsOpen(true)
          
          // Obter sugestões
          const suggs = await proofreader.getSuggestions(word)
          setSuggestions(suggs)
          setIsLoading(false)
        } catch (err) {
          console.error('Erro ao processar spell-error:', err)
          setIsOpen(false)
        }
      }
    }

    editorElement.addEventListener('click', handleSpellErrorClick)
    
    return () => {
      editorElement.removeEventListener('click', handleSpellErrorClick)
    }
  }, [editor])

  if (!isOpen) return null

  return (
    <Portal>
      <div
        ref={popoverRef}
        className="spellcheck-popover"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 9999,
        }}
      >
        {isLoading ? (
          <div className="spellcheck-loading">Buscando...</div>
        ) : suggestions.length > 0 ? (
          <div className="spellcheck-suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="spellcheck-suggestion-item"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : (
          <div className="spellcheck-no-suggestions">
            Sem sugestões
          </div>
        )}
        
        {errorInfo && (
          <div className="spellcheck-word-info">
            Palavra: <strong>{errorInfo.word}</strong>
          </div>
        )}
      </div>
    </Portal>
  )
}
