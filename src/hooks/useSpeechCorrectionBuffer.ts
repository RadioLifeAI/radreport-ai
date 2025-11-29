import { useState, useCallback, useRef } from 'react'

/**
 * Chunk de texto no buffer com metadados de posição e status
 */
export interface BufferChunk {
  id: string
  text: string
  position: { from: number; to: number }
  timestamp: number
  sent: boolean
  corrected: boolean
}

/**
 * Hook de buffer inteligente para sistema híbrido de ditado
 * Armazena chunks de texto ditado para envio em batch para correção IA
 */
export function useSpeechCorrectionBuffer() {
  const [buffer, setBuffer] = useState<BufferChunk[]>([])
  const chunkIdCounter = useRef(0)

  /**
   * Adiciona novo chunk de texto ao buffer
   */
  const addChunk = useCallback((text: string, position: { from: number; to: number }) => {
    if (!text.trim()) return

    const chunk: BufferChunk = {
      id: `chunk_${++chunkIdCounter.current}`,
      text: text.trim(),
      position,
      timestamp: Date.now(),
      sent: false,
      corrected: false,
    }

    setBuffer(prev => [...prev, chunk])
    console.log('📦 Chunk added to buffer:', chunk.id, text.substring(0, 30))
  }, [])

  /**
   * Retorna chunks não enviados para correção
   */
  const getUnsent = useCallback((): BufferChunk[] => {
    return buffer.filter(chunk => !chunk.sent)
  }, [buffer])

  /**
   * Retorna texto completo concatenado de chunks não enviados
   */
  const getUnsentText = useCallback((): string => {
    const unsent = buffer.filter(chunk => !chunk.sent)
    return unsent.map(chunk => chunk.text).join(' ')
  }, [buffer])

  /**
   * Marca chunks específicos como enviados para correção
   */
  const markAsSent = useCallback((chunkIds: string[]) => {
    setBuffer(prev =>
      prev.map(chunk =>
        chunkIds.includes(chunk.id) ? { ...chunk, sent: true } : chunk
      )
    )
    console.log('📤 Chunks marked as sent:', chunkIds.length)
  }, [])

  /**
   * Marca chunk como corrigido
   */
  const markAsCorrected = useCallback((chunkId: string) => {
    setBuffer(prev =>
      prev.map(chunk =>
        chunk.id === chunkId ? { ...chunk, corrected: true } : chunk
      )
    )
  }, [])

  /**
   * Retorna o buffer completo
   */
  const getBuffer = useCallback((): BufferChunk[] => {
    return buffer
  }, [buffer])

  /**
   * Limpa todo o buffer
   */
  const resetBuffer = useCallback(() => {
    setBuffer([])
    chunkIdCounter.current = 0
    console.log('🗑️ Buffer reset')
  }, [])

  /**
   * Remove chunks antigos (mais de 30 minutos)
   */
  const cleanOldChunks = useCallback(() => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000
    setBuffer(prev => prev.filter(chunk => chunk.timestamp > thirtyMinutesAgo))
  }, [])

  return {
    addChunk,
    getUnsent,
    getUnsentText,
    markAsSent,
    markAsCorrected,
    getBuffer,
    resetBuffer,
    cleanOldChunks,
  }
}
