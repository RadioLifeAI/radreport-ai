import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { getSpeechRecognitionService, SpeechRecognitionService } from '@/services/SpeechRecognitionService'
import { VOICE_COMMANDS_CONFIG } from '@/lib/voiceCommandsConfig'

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => void
}

/**
 * Hook simplificado para ditado por voz contínuo
 * Padrão baseado na documentação oficial do Web Speech API
 */
export function useDictation(editor: Editor | null): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')

  // Refs para sistema de âncora dinâmica
  const editorRef = useRef<Editor | null>(null)
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null)
  const anchorRef = useRef<number | null>(null)      // Posição inicial do ditado
  const interimLengthRef = useRef<number>(0)          // Tamanho do texto provisório

  // Sincronizar ref do editor sempre que mudar
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * Escapa caracteres especiais para uso em regex
   */
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * Apaga a última palavra digitada (comando de voz "apagar isso")
   */
  const deleteLastWord = (editor: Editor) => {
    const { state } = editor
    const { from, to } = state.selection
    const textBefore = state.doc.textBetween(0, from, ' ', ' ')
    
    // Encontrar início da última palavra
    const match = textBefore.match(/\s*(\S+)\s*$/)
    if (match) {
      const wordLength = match[0].length
      const deleteFrom = from - wordLength
      editor.commands.deleteRange({ from: deleteFrom, to })
    }
  }

  /**
   * Verifica se a próxima palavra deve começar com maiúscula
   * baseado no contexto do editor
   */
  const shouldCapitalizeNext = (editor: Editor, position: number): boolean => {
    // Se posição é 0 ou 1, é início do documento
    if (position <= 1) return true
    
    // Pegar texto antes da posição atual
    const textBefore = editor.state.doc.textBetween(0, position, ' ', ' ')
    if (!textBefore.trim()) return true
    
    // Verificar se termina com pontuação de fim de frase
    const trimmed = textBefore.trim()
    const lastChar = trimmed.charAt(trimmed.length - 1)
    
    return ['.', '!', '?', '\n'].includes(lastChar)
  }

  /**
   * Aplica capitalização inteligente ao texto
   * - Primeira letra maiúscula no início
   * - Primeira letra maiúscula após . ! ?
   */
  const applyCapitalization = (text: string, isStartOfDocument: boolean): string => {
    if (!text.trim()) return text
    
    let result = text
    
    // Capitalizar primeira letra se início de documento ou parágrafo
    if (isStartOfDocument) {
      result = result.charAt(0).toUpperCase() + result.slice(1)
    }
    
    // Capitalizar após pontuação de fim de frase (. ! ?)
    result = result.replace(/([.!?]\s+)([a-záàâãéèêíìîóòôõúùûç])/gi, (match, punct, letter) => {
      return punct + letter.toUpperCase()
    })
    
    // Capitalizar após quebra de linha
    result = result.replace(/(\n\s*)([a-záàâãéèêíìîóòôõúùûç])/gi, (match, newline, letter) => {
      return newline + letter.toUpperCase()
    })
    
    return result
  }

  /**
   * Substitui comandos de voz por pontuação/símbolos correspondentes
   * Usa regex compatível com acentos portugueses
   */
  const replaceVoiceCommands = (text: string): { text: string; hasCommand: boolean } => {
    let replaced = text
    let hasCommand = false
    
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      const escapedCommand = escapeRegex(cmd.command)
      // Usar (^|\\s) e ($|\\s|[.,;:!?]) em vez de \\b para suportar acentos
      const regex = new RegExp(`(^|\\s)${escapedCommand}($|\\s|[.,;:!?])`, 'gi')
      
      if (cmd.action === 'insert_text' && cmd.parameters?.text) {
        if (regex.test(replaced)) {
          replaced = replaced.replace(regex, (match, before, after) => {
            return (before || '') + cmd.parameters!.text + (after && !['.', ',', ';', ':', '!', '?'].includes(after) ? after : '')
          })
          hasCommand = true
        }
      } else if (cmd.action === 'newline') {
        if (regex.test(replaced)) {
          replaced = replaced.replace(regex, () => '\n')
          hasCommand = true
        }
      } else if (cmd.action === 'new_paragraph') {
        if (regex.test(replaced)) {
          replaced = replaced.replace(regex, () => '\n\n')
          hasCommand = true
        }
      }
    }

    // Normalizar espaços: remover antes de pontuação, adicionar depois
    replaced = replaced.replace(/\s+([.,;:!?])/g, '$1')
    replaced = replaced.replace(/([.,;:!?])(?=\S)/g, '$1 ')
    
    // Remover espaços múltiplos
    replaced = replaced.replace(/  +/g, ' ')

    return { text: replaced, hasCommand }
  }

  /**
   * Processa transcrição provisória (interim)
   * Insere/substitui texto provisório no editor em tempo real
   */
  const handleInterimTranscript = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    if (!currentEditor || !transcript.trim()) return

    // Se não tem âncora ainda, salvar posição atual do cursor
    if (anchorRef.current === null) {
      anchorRef.current = currentEditor.state.selection.from
    }

    const anchor = anchorRef.current
    const currentInterimLength = interimLengthRef.current

    // Verificar se deve capitalizar
    const shouldCapitalize = shouldCapitalizeNext(currentEditor, anchor)

    // Processar comandos de voz para exibição provisória
    const { text: processedText } = replaceVoiceCommands(transcript)
    let newText = processedText.trim()
    
    // Aplicar capitalização inteligente
    newText = applyCapitalization(newText, shouldCapitalize)

    // Substituir texto provisório anterior pelo novo
    if (currentInterimLength > 0) {
      currentEditor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + currentInterimLength 
      })
    }
    
    currentEditor.commands.insertContentAt(anchor, newText, {
      updateSelection: true,
    })

    // Atualizar comprimento do texto provisório
    interimLengthRef.current = newText.length

    console.log('📝 Interim inserted:', newText, 'at anchor:', anchor)
  }, [])

  /**
   * Processa transcrição final confirmada
   * Substitui texto provisório pelo texto final confirmado
   */
  const handleFinalTranscript = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    console.log('✅ Final transcript:', transcript, 'hasEditor:', !!currentEditor)
    
    if (!currentEditor || !transcript.trim()) return

    const anchor = anchorRef.current ?? currentEditor.state.selection.from
    const currentInterimLength = interimLengthRef.current

    const lowerTranscript = transcript.toLowerCase().trim()
    
    // Verificar comandos especiais primeiro (ações, não inserção de texto)
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      if (lowerTranscript === cmd.command && 
          !['insert_text', 'newline', 'new_paragraph'].includes(cmd.action)) {
        // Limpar texto interim antes de executar comando
        if (currentInterimLength > 0) {
          currentEditor.commands.deleteRange({ 
            from: anchor, 
            to: anchor + currentInterimLength 
          })
        }
        // Resetar estado
        anchorRef.current = null
        interimLengthRef.current = 0
        
        switch (cmd.action) {
          case 'delete_word':
            deleteLastWord(currentEditor)
            return
          case 'undo':
            currentEditor.commands.undo()
            return
          case 'redo':
            currentEditor.commands.redo()
            return
          case 'toggle_bold':
            currentEditor.commands.toggleBold()
            return
          case 'toggle_italic':
            currentEditor.commands.toggleItalic()
            return
          case 'toggle_underline':
            currentEditor.commands.toggleUnderline()
            return
          case 'clear_all':
            currentEditor.commands.clearContent()
            return
          case 'select_all':
            currentEditor.commands.selectAll()
            return
        }
      }
    }

    // Verificar se deve capitalizar baseado no contexto
    const shouldCapitalize = shouldCapitalizeNext(currentEditor, anchor)

    // Processar texto final com comandos de voz
    const { text: processedText } = replaceVoiceCommands(transcript)
    let finalText = processedText.trim()
    if (!finalText) return

    // Aplicar capitalização inteligente
    finalText = applyCapitalization(finalText, shouldCapitalize)

    // Adicionar espaço no final para próxima palavra (se não termina com quebra de linha)
    const needsSpace = !/[.!?,;:\s\n]$/.test(finalText)
    const content = finalText + (needsSpace ? ' ' : '')

    // Substituir texto provisório pelo final
    if (currentInterimLength > 0) {
      currentEditor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + currentInterimLength 
      })
    }
    
    currentEditor.chain()
      .focus()
      .insertContentAt(anchor, content, { updateSelection: true })
      .run()

    // Resetar estado para próximo ditado
    anchorRef.current = null
    interimLengthRef.current = 0

    console.log('✏️ Final inserted:', content, 'at anchor:', anchor)
  }, [])

  /**
   * Inicia o ditado por voz com captura de audio stream
   */
  const startDictation = useCallback(async (): Promise<MediaStream | null> => {
    const currentEditor = editorRef.current
    if (!currentEditor || !speechServiceRef.current) {
      console.error('❌ Cannot start dictation: editor or speechService not ready')
      return null
    }

    console.log('🎤 Starting dictation with audio capture...')
    
    const result = await speechServiceRef.current.startListeningWithAudio()
    if (result.started) {
      setIsActive(true)
      console.log('✓ Dictation started successfully, stream:', !!result.stream)
      return result.stream || null
    }
    
    console.error('✗ Failed to start dictation')
    return null
  }, [])

  /**
   * Para o ditado por voz
   */
  const stopDictation = useCallback(() => {
    if (!speechServiceRef.current) return

    speechServiceRef.current.stopListening()
    setIsActive(false)
    setStatus('idle')
    
    // Resetar estado de âncora
    anchorRef.current = null
    interimLengthRef.current = 0
    
    console.log('🛑 Dictation stopped')
  }, [])

  /**
   * Inicializa serviço de reconhecimento de voz e configura callbacks
   */
  useEffect(() => {
    const speechService = getSpeechRecognitionService()
    speechServiceRef.current = speechService

    // Configurar callbacks
    const statusCallback = (status: 'idle' | 'waiting' | 'listening') => {
      console.log('🔊 Status changed:', status)
      setStatus(status)
    }
    
    const resultCallback = (result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => {
      console.log('🎯 Result received:', { 
        transcript: result.transcript, 
        isFinal: result.isFinal,
        hasEditor: !!editorRef.current 
      })
      if (result.isFinal) {
        handleFinalTranscript(result.transcript)
      } else {
        handleInterimTranscript(result.transcript)
      }
    }

    speechService.setOnStatus(statusCallback)
    speechService.setOnResult(resultCallback)
    
    console.log('✓ Voice callbacks configured for useDictation')

    return () => {
      // Remover apenas callbacks deste hook
      speechService.removeOnStatus(statusCallback)
      speechService.removeOnResult(resultCallback)
      speechService.stopListening()
    }
  }, [handleInterimTranscript, handleFinalTranscript])

  return {
    isActive,
    status,
    startDictation,
    stopDictation,
  }
}
