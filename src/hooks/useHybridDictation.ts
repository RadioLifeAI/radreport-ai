import { useState, useEffect, useCallback, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { useDictation } from './useDictation'
import { useSpeechCorrectionBuffer } from './useSpeechCorrectionBuffer'
import { supabase } from '@/integrations/supabase/client'
import { calculateDiff, filterSignificantDiffs, sortDiffsByPosition, mergeDiffs } from '@/utils/diffUtils'
import { applyDiffToEditor } from '@/utils/applyDiffToTipTap'
import { prepareForLLM } from '@/utils/radiologyPostProcessor'
import { toast } from 'sonner'

export interface UseHybridDictationReturn {
  // Passthrough do useDictation original
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => void
  
  // Novos do sistema híbrido
  isCorrectionEnabled: boolean
  toggleCorrection: () => void
  pendingCorrections: number
  lastCorrectionTime: Date | null
  correctionStats: {
    total: number
    applied: number
    rejected: number
  }
  manualCorrection: () => Promise<void>
}

/**
 * Hook orquestrador do sistema híbrido de ditado médico
 * 
 * Camada 1: Web Speech API → useDictation → TipTap (tempo real)
 * Camada 2: Buffer → Groq LLM → Diffs → TipTap (correção paralela)
 */
export function useHybridDictation(editor: Editor | null): UseHybridDictationReturn {
  // 🎤 Camada 1: Ditado em tempo real (passthrough completo)
  const dictation = useDictation(editor)

  // 📦 Buffer inteligente
  const buffer = useSpeechCorrectionBuffer()

  // 🤖 Estado da correção IA
  const [isCorrectionEnabled, setIsCorrectionEnabled] = useState(true)
  const [pendingCorrections, setPendingCorrections] = useState(0)
  const [lastCorrectionTime, setLastCorrectionTime] = useState<Date | null>(null)
  const [correctionStats, setCorrectionStats] = useState({
    total: 0,
    applied: 0,
    rejected: 0,
  })

  const editorRef = useRef<Editor | null>(null)
  const lastProcessedText = useRef<string>('')
  const isProcessing = useRef(false)

  // Sincronizar ref do editor
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * Intercepta transcrições finais e adiciona ao buffer
   */
  useEffect(() => {
    if (!editor || !dictation.isActive) return

    // Observar mudanças no editor
    const handleUpdate = () => {
      if (!isCorrectionEnabled || !dictation.isActive) return

      const currentText = editor.state.doc.textContent
      const newText = currentText.slice(lastProcessedText.current.length)

      if (newText.trim().length > 0) {
        const { from } = editor.state.selection
        buffer.addChunk(newText, { from: from - newText.length, to: from })
        lastProcessedText.current = currentText
      }
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor, dictation.isActive, isCorrectionEnabled, buffer])

  /**
   * Chama Edge Function de correção de texto
   */
  const callTextCorrection = useCallback(async (text: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('text-correction', {
        body: { text }
      })

      if (error) {
        console.error('❌ Text correction error:', error)
        throw error
      }

      if (!data || !data.corrected) {
        console.warn('⚠️ No correction returned')
        return text
      }

      console.log('✅ Text corrected by Groq LLM')
      return data.corrected
    } catch (error) {
      console.error('❌ Text correction failed:', error)
      throw error
    }
  }, [])

  /**
   * Processa buffer e aplica correções
   */
  const processBuffer = useCallback(async () => {
    const currentEditor = editorRef.current
    if (!currentEditor || isProcessing.current || !isCorrectionEnabled) return

    const unsentText = buffer.getUnsentText()
    
    // Threshold mínimo de 20 caracteres para enviar
    if (unsentText.length < 20) return

    isProcessing.current = true
    setPendingCorrections(prev => prev + 1)

    try {
      console.log('🔄 Processing buffer:', unsentText.substring(0, 50) + '...')

      // 1. Preparar texto para LLM (correções locais completas)
      const postProcessed = prepareForLLM(unsentText)

      // 2. Enviar para correção IA via Groq LLM
      const corrected = await callTextCorrection(postProcessed)

      // 3. Calcular diffs
      let diffs = calculateDiff(unsentText, corrected)
      diffs = filterSignificantDiffs(diffs)
      diffs = mergeDiffs(diffs)
      diffs = sortDiffsByPosition(diffs)

      if (diffs.length > 0) {
        console.log('📊 Found', diffs.length, 'corrections to apply')

        // 4. Aplicar diffs no editor
        const success = applyDiffToEditor(currentEditor, diffs)

        if (success) {
          setCorrectionStats(prev => ({
            total: prev.total + diffs.length,
            applied: prev.applied + diffs.length,
            rejected: prev.rejected,
          }))
          setLastCorrectionTime(new Date())
        } else {
          setCorrectionStats(prev => ({
            ...prev,
            rejected: prev.rejected + diffs.length,
          }))
        }
      }

      // Marcar chunks como enviados
      const unsent = buffer.getUnsent()
      buffer.markAsSent(unsent.map(c => c.id))

    } catch (error) {
      console.error('❌ Buffer processing error:', error)
      toast.error('Erro ao corrigir texto com IA')
    } finally {
      isProcessing.current = false
      setPendingCorrections(prev => Math.max(0, prev - 1))
    }
  }, [buffer, isCorrectionEnabled, callTextCorrection])

  /**
   * Correção manual (força processamento imediato)
   */
  const manualCorrection = useCallback(async () => {
    await processBuffer()
    toast.success('Correções aplicadas manualmente')
  }, [processBuffer])

  /**
   * Cron job: processa buffer a cada 4 segundos
   */
  useEffect(() => {
    if (!isCorrectionEnabled || !dictation.isActive) return

    const interval = setInterval(() => {
      processBuffer()
    }, 4000) // 4 segundos

    return () => clearInterval(interval)
  }, [isCorrectionEnabled, dictation.isActive, processBuffer])

  /**
   * Limpar chunks antigos periodicamente
   */
  useEffect(() => {
    const interval = setInterval(() => {
      buffer.cleanOldChunks()
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [buffer])

  /**
   * Toggle de correção IA
   */
  const toggleCorrection = useCallback(() => {
    setIsCorrectionEnabled(prev => {
      const newState = !prev
      toast.info(newState ? 'Correção IA ativada' : 'Correção IA desativada')
      return newState
    })
  }, [])

  return {
    // Passthrough completo do useDictation
    ...dictation,
    
    // Novos do sistema híbrido
    isCorrectionEnabled,
    toggleCorrection,
    pendingCorrections,
    lastCorrectionTime,
    correctionStats,
    manualCorrection,
  }
}
