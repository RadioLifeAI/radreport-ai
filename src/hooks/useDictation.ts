import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { SpeechRecognitionService } from '@/services/SpeechRecognitionService'
import { parseCommand } from '@/lib/commands'

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => void
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
   * Ex: "ponto final" → ".", "vírgula" → ","
   */
  const replaceVoiceCommands = (text: string): { text: string; hasCommand: boolean } => {
    const commandMap: Record<string, string> = {
      'ponto final': '.',
      'ponto': '.',
      'vírgula': ',',
      'virgula': ',',
      'ponto e vírgula': ';',
      'ponto e virgula': ';',
      'dois pontos': ':',
      'ponto de interrogação': '?',
      'interrogação': '?',
      'ponto de exclamação': '!',
      'exclamação': '!',
      'abre parênteses': '(',
      'abre parenteses': '(',
      'fecha parênteses': ')',
      'fecha parenteses': ')',
      'travessão': '—',
      'travessao': '—',
      'hífen': '-',
      'hifen': '-',
      'reticências': '...',
      'reticencias': '...',
      'nova linha': '\n',
      'novo parágrafo': '\n\n',
      'novo paragrafo': '\n\n',
    }

    let replaced = text
    let hasCommand = false

    for (const [command, symbol] of Object.entries(commandMap)) {
      const regex = new RegExp(`\\b${command}\\b`, 'gi')
      if (regex.test(replaced)) {
        replaced = replaced.replace(regex, symbol)
        hasCommand = true
      }
    }

    // Normalizar espaços: remover antes de pontuação, adicionar depois
    replaced = replaced.replace(/\s+([.,;:!?])/g, '$1') // Remove espaços antes
    replaced = replaced.replace(/([.,;:!?])(?=\S)/g, '$1 ') // Adiciona espaço depois se necessário

    return { text: replaced, hasCommand }
  }

  /**
   * Processa transcrição provisória (interim)
   * Mostra texto em tempo real enquanto o usuário fala
   */
  const handleInterimTranscript = (transcript: string) => {
    if (!editor || !transcript.trim()) return

    const currentPos = editor.state.selection.from

    // Estabelecer âncora na primeira transcrição provisória
    if (dictAnchorRef.current === null) {
      dictAnchorRef.current = currentPos
      dictConfirmedLengthRef.current = 0
      dictCapitalizedRef.current = false
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
    editor.commands.insertContentAt(anchor, finalText, { updateSelection: false })
    dictInterimLengthRef.current = finalText.length
  }

  /**
   * Processa transcrição final confirmada
   * Confirma apenas o delta (texto novo) para evitar duplicação
   */
  const handleFinalTranscript = (transcript: string) => {
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

    // Verificar comandos especiais
    if (delta.toLowerCase().includes('apagar isso')) {
      deleteLastWord(editor)
      dictAnchorRef.current = editor.state.selection.from
      dictConfirmedLengthRef.current = 0
      dictInterimLengthRef.current = 0
      dictCapitalizedRef.current = false
      return
    }

    if (delta.toLowerCase().includes('desfaz') || delta.toLowerCase().includes('desfazer')) {
      editor.commands.undo()
      dictAnchorRef.current = null
      dictConfirmedLengthRef.current = 0
      dictInterimLengthRef.current = 0
      dictCapitalizedRef.current = false
      return
    }

    if (delta.toLowerCase().includes('refazer')) {
      editor.commands.redo()
      dictAnchorRef.current = null
      dictConfirmedLengthRef.current = 0
      dictInterimLengthRef.current = 0
      dictCapitalizedRef.current = false
      return
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
   * Inicia o ditado por voz
   */
  const startDictation = () => {
    if (!editor || !speechServiceRef.current) return

    const started = speechServiceRef.current.startListening()
    if (started) {
      setIsActive(true)
      // Resetar âncoras
      dictAnchorRef.current = null
      dictConfirmedLengthRef.current = 0
      dictInterimLengthRef.current = 0
      dictCapitalizedRef.current = false
    }
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

    const speechService = new SpeechRecognitionService()
    speechServiceRef.current = speechService

    // Configurar callback de status
    speechService.setOnStatus(setStatus)

    // Configurar callback de resultado detalhado
    speechService.setOnResultDetailed((result) => {
      if (result.isFinal) {
        handleFinalTranscript(result.transcript)
      } else {
        handleInterimTranscript(result.transcript)
      }
    })

    return () => {
      speechService.stopListening()
      speechService.destroy()
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
