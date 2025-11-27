import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { getSpeechRecognitionService, SpeechRecognitionService } from '@/services/SpeechRecognitionService'

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

  // Refs simplificados - apenas 2!
  const editorRef = useRef<Editor | null>(null)
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null)

  // Sincronizar ref do editor sempre que mudar
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

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
   * Apenas log para feedback visual - não insere no editor
   */
  const handleInterimTranscript = useCallback((transcript: string) => {
    console.log('📝 Interim (visual only):', transcript)
  }, [])

  /**
   * Processa transcrição final confirmada
   * SOLUÇÃO SIMPLES: Apenas inserir no cursor atual com TipTap nativo!
   */
  const handleFinalTranscript = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    console.log('✅ Final transcript:', transcript, 'hasEditor:', !!currentEditor)
    
    if (!currentEditor || !transcript.trim()) return

    const { VOICE_COMMANDS_CONFIG } = require('@/lib/voiceCommandsConfig')
    const lowerTranscript = transcript.toLowerCase().trim()
    
    // Verificar comandos especiais (undo, redo, delete, etc)
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      if (lowerTranscript.includes(cmd.command)) {
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

    // Processar comandos de voz (pontuação, etc)
    const { text: processedText } = replaceVoiceCommands(transcript)
    if (!processedText.trim()) return

    // SOLUÇÃO SIMPLES: Apenas inserir no cursor atual!
    // TipTap cuida de tudo: capitalização, espaçamento, posição
    const needsSpace = !/[.!?,;:\s]$/.test(processedText.trim())
    const content = processedText.trim() + (needsSpace ? ' ' : '')
    
    currentEditor.chain().focus().insertContent(content).run()
    console.log('✏️ Inserted:', content)
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
