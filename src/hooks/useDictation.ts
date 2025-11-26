import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { getSpeechRecognitionService, SpeechRecognitionService } from '@/services/SpeechRecognitionService'

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => void
}

/**
 * Hook para gerenciar ditado por voz com âncora dinâmica
 * Encapsula toda a lógica de transcrição, capitalização e comandos de voz
 */
export function useDictation(editor: Editor | null): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')

  // Refs para gerenciamento de âncora dinâmica
  const dictAnchorRef = useRef<number | null>(null)
  const dictInterimLengthRef = useRef(0)
  const dictConfirmedLengthRef = useRef(0)
  const dictCapitalizedRef = useRef(false)
  const isUpdatingSelectionRef = useRef(false)

  // Ref para o serviço de reconhecimento de voz
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null)

  /**
   * Verifica se deve capitalizar o próximo caractere
   * Baseado em pontuação anterior ou início de parágrafo
   */
  const shouldCapitalize = (editor: Editor, insertPos: number): boolean => {
    if (!editor || insertPos <= 0) return true

    const textBefore = editor.state.doc.textBetween(Math.max(0, insertPos - 3), insertPos, ' ', ' ')
    
    // Capitalizar após pontuação de fim de sentença
    if (/[.!?]\s*$/.test(textBefore)) return true
    
    // Capitalizar no início do documento
    if (insertPos === 0) return true
    
    // Capitalizar após quebra de linha (parágrafo novo)
    const nodeBefore = editor.state.doc.resolve(insertPos).nodeBefore
    if (!nodeBefore || nodeBefore.type.name === 'paragraph') {
      const paraStart = editor.state.doc.resolve(insertPos).start()
      if (insertPos === paraStart) return true
    }

    return false
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
   * Substitui comandos de voz por pontuação/símbolos correspondentes
   * Agora usa voiceCommandsConfig.ts como fonte única
   */
  const replaceVoiceCommands = (text: string): { text: string; hasCommand: boolean } => {
    let replaced = text
    let hasCommand = false

    // Importar comandos de voz do config
    const { VOICE_COMMANDS_CONFIG } = require('@/lib/voiceCommandsConfig')
    
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      // Apenas comandos de inserção de texto
      if (cmd.action === 'insert_text' && cmd.parameters?.text) {
        const regex = new RegExp(`\\b${cmd.command}\\b`, 'gi')
        if (regex.test(replaced)) {
          replaced = replaced.replace(regex, cmd.parameters.text)
          hasCommand = true
        }
      } else if (cmd.action === 'newline' && replaced.includes(cmd.command)) {
        replaced = replaced.replace(new RegExp(`\\b${cmd.command}\\b`, 'gi'), '\n')
        hasCommand = true
      } else if (cmd.action === 'new_paragraph' && replaced.includes(cmd.command)) {
        replaced = replaced.replace(new RegExp(`\\b${cmd.command}\\b`, 'gi'), '\n\n')
        hasCommand = true
      }
    }

    // Normalizar espaços: remover antes de pontuação, adicionar depois
    replaced = replaced.replace(/\s+([.,;:!?])/g, '$1')
    replaced = replaced.replace(/([.,;:!?])(?=\S)/g, '$1 ')

    return { text: replaced, hasCommand }
  }

  /**
   * Processa transcrição provisória (interim)
   * Mostra texto em tempo real enquanto o usuário fala
   */
  const handleInterimTranscript = (transcript: string) => {
    console.log('📝 Interim transcript:', transcript)
    if (!editor || !transcript.trim()) return

    const currentPos = editor.state.selection.from

    // Estabelecer âncora na primeira transcrição provisória
    if (dictAnchorRef.current === null) {
      dictAnchorRef.current = currentPos
      dictConfirmedLengthRef.current = 0
      dictCapitalizedRef.current = false
      console.log('🎯 Anchor set at position:', currentPos)
    }

    const anchor = dictAnchorRef.current
    
    // Substituir comandos de voz
    const { text: processedText } = replaceVoiceCommands(transcript)
    
    // Aplicar capitalização no primeiro caractere se necessário
    let finalText = processedText
    if (!dictCapitalizedRef.current && processedText.length > 0) {
      if (shouldCapitalize(editor, anchor)) {
        finalText = processedText.charAt(0).toUpperCase() + processedText.slice(1)
        dictCapitalizedRef.current = true
      }
    }

    // Remover texto provisório anterior
    const provisionalLength = dictInterimLengthRef.current
    if (provisionalLength > 0) {
      editor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + provisionalLength 
      })
    }

    // Inserir novo texto provisório
    console.log('✏️ Inserting interim text:', finalText)
    editor.commands.insertContentAt(anchor, finalText, { updateSelection: false })
    dictInterimLengthRef.current = finalText.length
  }

  /**
   * Processa transcrição final confirmada
   * Confirma apenas o delta (texto novo) para evitar duplicação
   * Agora verifica comandos do voiceCommandsConfig
   */
  const handleFinalTranscript = (transcript: string) => {
    console.log('✅ Final transcript:', transcript)
    if (!editor || !transcript.trim()) return

    const currentPos = editor.state.selection.from

    // Se não há âncora, inserir normalmente
    if (dictAnchorRef.current === null) {
      dictAnchorRef.current = currentPos
      dictConfirmedLengthRef.current = 0
      dictCapitalizedRef.current = false
    }

    const anchor = dictAnchorRef.current
    
    // Calcular delta (apenas texto novo)
    const confirmedLength = dictConfirmedLengthRef.current
    const delta = transcript.slice(confirmedLength)
    
    if (!delta.trim()) {
      // Se não há delta, apenas resetar interim
      dictInterimLengthRef.current = 0
      return
    }

    // Verificar comandos especiais do voiceCommandsConfig
    const { VOICE_COMMANDS_CONFIG } = require('@/lib/voiceCommandsConfig')
    const lowerDelta = delta.toLowerCase().trim()
    
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      if (lowerDelta.includes(cmd.command)) {
        switch (cmd.action) {
          case 'delete_word':
            deleteLastWord(editor)
            dictAnchorRef.current = editor.state.selection.from
            dictConfirmedLengthRef.current = 0
            dictInterimLengthRef.current = 0
            dictCapitalizedRef.current = false
            return
          case 'undo':
            editor.commands.undo()
            dictAnchorRef.current = null
            dictConfirmedLengthRef.current = 0
            dictInterimLengthRef.current = 0
            dictCapitalizedRef.current = false
            return
          case 'redo':
            editor.commands.redo()
            dictAnchorRef.current = null
            dictConfirmedLengthRef.current = 0
            dictInterimLengthRef.current = 0
            dictCapitalizedRef.current = false
            return
          case 'toggle_bold':
            editor.commands.toggleBold()
            return
          case 'toggle_italic':
            editor.commands.toggleItalic()
            return
          case 'toggle_underline':
            editor.commands.toggleUnderline()
            return
          case 'clear_all':
            editor.commands.clearContent()
            return
          case 'select_all':
            editor.commands.selectAll()
            return
        }
      }
    }

    // Substituir comandos de voz
    const { text: processedText, hasCommand } = replaceVoiceCommands(delta)
    
    // Aplicar capitalização no primeiro caractere do delta se necessário
    let finalText = processedText
    if (!dictCapitalizedRef.current && processedText.length > 0) {
      const insertPos = anchor + confirmedLength
      if (shouldCapitalize(editor, insertPos)) {
        finalText = processedText.charAt(0).toUpperCase() + processedText.slice(1)
        dictCapitalizedRef.current = true
      }
    }

    // Remover texto provisório anterior
    const provisionalLength = dictInterimLengthRef.current
    if (provisionalLength > 0) {
      editor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + provisionalLength 
      })
    }

    // Inserir delta confirmado
    const insertPos = anchor + confirmedLength
    editor.commands.insertContentAt(insertPos, finalText, { updateSelection: false })
    
    // Atualizar contadores
    dictConfirmedLengthRef.current += finalText.length
    dictInterimLengthRef.current = 0

    // Se terminou com pontuação sem comando, auto-pause
    if (!hasCommand && /[.!?]\s*$/.test(finalText.trim())) {
      // Inserir quebra de linha e resetar âncora
      setTimeout(() => {
        editor.commands.insertContentAt(
          anchor + dictConfirmedLengthRef.current, 
          '\n', 
          { updateSelection: false }
        )
        dictAnchorRef.current = null
        dictConfirmedLengthRef.current = 0
        dictCapitalizedRef.current = false
      }, 100)
    }
  }

  /**
   * Inicia o ditado por voz com captura de audio stream
   */
  const startDictation = async (): Promise<MediaStream | null> => {
    if (!editor || !speechServiceRef.current) return null

    console.log('🎤 Starting dictation with audio capture...')
    
    const result = await speechServiceRef.current.startListeningWithAudio()
    if (result.started) {
      setIsActive(true)
      // Resetar âncoras
      dictAnchorRef.current = null
      dictConfirmedLengthRef.current = 0
      dictInterimLengthRef.current = 0
      dictCapitalizedRef.current = false
      
      console.log('✓ Dictation started successfully, stream:', !!result.stream)
      return result.stream || null
    }
    
    console.error('✗ Failed to start dictation')
    return null
  }

  /**
   * Para o ditado por voz
   */
  const stopDictation = () => {
    if (!speechServiceRef.current) return

    speechServiceRef.current.stopListening()
    setIsActive(false)
    setStatus('idle')
    
    // Resetar âncoras
    dictAnchorRef.current = null
    dictConfirmedLengthRef.current = 0
    dictInterimLengthRef.current = 0
    dictCapitalizedRef.current = false
  }

  /**
   * Inicializa serviço de reconhecimento de voz e configura callbacks
   */
  useEffect(() => {
    if (!editor) return

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
        hasEditor: !!editor 
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
      // Remover apenas callbacks deste hook, não destruir singleton
      speechService.removeOnStatus(statusCallback)
      speechService.removeOnResult(resultCallback)
      speechService.stopListening()
    }
  }, [editor])

  /**
   * Monitora mudanças de seleção para resetar âncora quando necessário
   */
  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      // Se seleção mudou por comando (não por ditado), resetar âncora
      if (!isUpdatingSelectionRef.current) {
        const { from, to } = editor.state.selection
        if (from !== to || (dictAnchorRef.current !== null && from !== dictAnchorRef.current + dictConfirmedLengthRef.current)) {
          dictAnchorRef.current = null
          dictConfirmedLengthRef.current = 0
          dictInterimLengthRef.current = 0
          dictCapitalizedRef.current = false
        }
      }
    }

    editor.on('selectionUpdate', handleSelectionUpdate)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
    }
  }, [editor])

  return {
    isActive,
    status,
    startDictation,
    stopDictation,
  }
}
