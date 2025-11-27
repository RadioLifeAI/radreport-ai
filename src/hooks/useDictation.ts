import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { getSpeechRecognitionService, SpeechRecognitionService } from '@/services/SpeechRecognitionService'
import { VOICE_COMMANDS_CONFIG } from '@/lib/voiceCommandsConfig'
import { processMedicalText } from '@/utils/medicalTextProcessor'

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
  const selectionEndRef = useRef<number | null>(null) // Posição final da seleção (se houver)
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
   * Divide texto por comandos estruturais (linha/parágrafo)
   * Retorna array de segmentos para processamento separado
   */
  interface VoiceSegment {
    type: 'text' | 'hard_break' | 'split_block';
    content?: string;
  }

  const splitByStructuralCommands = (text: string): VoiceSegment[] => {
    const segments: VoiceSegment[] = []
    
    // Comandos estruturais ordenados por tamanho (maior primeiro)
    const structuralCommands = VOICE_COMMANDS_CONFIG
      .filter(cmd => cmd.action === 'hard_break' || cmd.action === 'split_block')
      .sort((a, b) => b.command.length - a.command.length)
    
    let remaining = text
    
    while (remaining.length > 0) {
      let foundCommand = false
      
      for (const cmd of structuralCommands) {
        const regex = new RegExp(`(^|\\s)(${escapeRegex(cmd.command)})(\\s|$)`, 'i')
        const match = remaining.match(regex)
        
        if (match && match.index !== undefined) {
          // Texto antes do comando
          const beforeText = remaining.substring(0, match.index + match[1].length)
          if (beforeText.trim()) {
            segments.push({ type: 'text', content: beforeText.trim() })
          }
          
          // Comando estrutural
          segments.push({ 
            type: cmd.action as 'hard_break' | 'split_block'
          })
          
          // Continuar processando o restante
          remaining = remaining.substring(match.index + match[0].length)
          foundCommand = true
          break
        }
      }
      
      if (!foundCommand) {
        // Não encontrou mais comandos, adicionar texto restante
        if (remaining.trim()) {
          segments.push({ type: 'text', content: remaining.trim() })
        }
        break
      }
    }
    
    return segments
  }

  /**
   * Substitui comandos de pontuação (não estruturais) no texto
   */
  const replacePunctuationCommands = (text: string): string => {
    let replaced = text
    
    // Comandos de pontuação ordenados por tamanho
    const punctuationCommands = VOICE_COMMANDS_CONFIG
      .filter(cmd => cmd.action === 'insert_text' && !cmd.followedBy)
      .sort((a, b) => b.command.length - a.command.length)
    
    for (const cmd of punctuationCommands) {
      const regex = new RegExp(escapeRegex(cmd.command), 'gi')
      
      if (regex.test(replaced)) {
        regex.lastIndex = 0
        
        if (cmd.parameters?.text) {
          replaced = replaced.replace(regex, cmd.parameters.text)
        }
      }
    }

    // Normalizar espaços
    replaced = replaced.replace(/\s+([.,;:!?])/g, '$1')
    replaced = replaced.replace(/([.,;:!?])(?=[^\s])/g, '$1 ')
    replaced = replaced.replace(/  +/g, ' ')

    return replaced
  }

  /**
   * Processa entrada de voz usando comandos nativos do TipTap
   */
  const processVoiceInput = (transcript: string, currentEditor: Editor) => {
    const segments = splitByStructuralCommands(transcript)
    
    for (const segment of segments) {
      if (segment.type === 'text' && segment.content) {
        // Processar pontuação
        let processedText = replacePunctuationCommands(segment.content)
        
        // 🆕 APLICAR CORREÇÕES MÉDICAS EM TEMPO REAL
        processedText = processMedicalText(processedText)
        
        // Verificar capitalização baseado na posição atual do cursor
        const shouldCapitalize = shouldCapitalizeNext(currentEditor, currentEditor.state.selection.from)
        processedText = applyCapitalization(processedText, shouldCapitalize)
        
        // Inserir texto
        currentEditor.chain().focus().insertContent(processedText + ' ').run()
        
      } else if (segment.type === 'hard_break') {
        // Comando nativo TipTap para quebra de linha
        currentEditor.chain().focus().setHardBreak().run()
        
      } else if (segment.type === 'split_block') {
        // Comando nativo TipTap para novo parágrafo
        currentEditor.chain().focus().splitBlock().run()
      }
    }
    
    // Processar comandos compostos (ex: "ponto parágrafo")
    const compositeCmd = VOICE_COMMANDS_CONFIG.find(
      cmd => cmd.followedBy && transcript.toLowerCase().includes(cmd.command.toLowerCase())
    )
    
    if (compositeCmd?.followedBy === 'split_block') {
      currentEditor.chain().focus().splitBlock().run()
    }
  }

  /**
   * Handler para transcrições provisórias (em tempo real)
   * Mostra preview com marcadores visuais para comandos estruturais
   */
  const handleInterimTranscript = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    if (!currentEditor || !transcript.trim()) return

    // Se não tem âncora ainda, verificar se há seleção
    if (anchorRef.current === null) {
      const { from, to } = currentEditor.state.selection
      anchorRef.current = from
      
      // Se há texto selecionado (from ≠ to), deletar primeiro
      if (from !== to) {
        selectionEndRef.current = to
        currentEditor.commands.deleteRange({ from, to })
        console.log('🗑️ Selection deleted:', { from, to })
      }
    }

    const anchor = anchorRef.current
    const currentInterimLength = interimLengthRef.current

    // Processar texto para preview (com marcadores visuais)
    let previewText = transcript
    
    // 🆕 APLICAR CORREÇÕES MÉDICAS NO PREVIEW TAMBÉM (tempo real)
    previewText = processMedicalText(previewText)
    
    // Substituir comandos estruturais por marcadores visuais
    previewText = previewText.replace(/nova linha|próxima linha|linha/gi, ' [↵] ')
    previewText = previewText.replace(/novo parágrafo|próximo parágrafo|parágrafo/gi, ' [¶] ')
    
    // Processar pontuação
    previewText = replacePunctuationCommands(previewText)
    
    // Verificar se deve capitalizar
    const shouldCapitalize = shouldCapitalizeNext(currentEditor, anchor)
    const capitalizedText = applyCapitalization(previewText, shouldCapitalize)

    // Substituir texto provisório anterior pelo novo
    if (currentInterimLength > 0) {
      currentEditor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + currentInterimLength 
      })
    }
    
    currentEditor.commands.insertContentAt(anchor, capitalizedText, {
      updateSelection: true,
    })

    // Atualizar comprimento do texto provisório
    interimLengthRef.current = capitalizedText.length

    console.log('📝 Interim with markers:', capitalizedText)
  }, [])

  /**
   * Handler para transcrições finais (confirmadas)
   * Usa comandos nativos TipTap (setHardBreak, splitBlock)
   */
  const handleFinalTranscript = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    console.log('✅ Final transcript:', transcript)
    
    if (!currentEditor || !transcript.trim()) return

    // Se não tem âncora ainda, verificar se há seleção
    if (anchorRef.current === null) {
      const { from, to } = currentEditor.state.selection
      anchorRef.current = from
      
      // Se há texto selecionado, deletar primeiro
      if (from !== to) {
        selectionEndRef.current = to
        currentEditor.commands.deleteRange({ from, to })
        console.log('🗑️ Selection deleted on final:', { from, to })
      }
    }

    const anchor = anchorRef.current ?? currentEditor.state.selection.from
    const currentInterimLength = interimLengthRef.current

    const lowerTranscript = transcript.toLowerCase().trim()
    
    // Verificar comandos especiais primeiro (ações, não inserção de texto)
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      if (lowerTranscript === cmd.command && 
          !['insert_text', 'hard_break', 'split_block'].includes(cmd.action)) {
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
        }
      }
    }

    // Remover texto provisório se existir
    if (currentInterimLength > 0) {
      currentEditor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + currentInterimLength 
      })
    }

    // Posicionar cursor na âncora antes de processar
    currentEditor.commands.setTextSelection(anchor)
    
    // Processar usando comandos nativos do TipTap
    processVoiceInput(transcript, currentEditor)

    // Resetar estado para próxima frase
    anchorRef.current = null
    selectionEndRef.current = null
    interimLengthRef.current = 0

    console.log('✏️ Final processed with native TipTap commands')
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
    selectionEndRef.current = null
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
