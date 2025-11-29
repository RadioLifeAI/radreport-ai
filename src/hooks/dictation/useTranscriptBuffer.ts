import { useCallback, useRef } from 'react'
import { Editor } from '@tiptap/react'

interface BufferSnapshot {
  text: string
  startPos: number
  endPos: number
  duration: number
}

interface UseTranscriptBufferReturn {
  append: (processedText: string, editor: Editor) => void
  snapshot: (editor: Editor) => BufferSnapshot
  reset: () => void
  getText: () => string
  getStartPos: () => number | null
}

/**
 * Hook para gerenciar buffer de texto acumulado durante período de ditado
 */
export function useTranscriptBuffer(): UseTranscriptBufferReturn {
  const accumulatedTextRef = useRef<string>('')
  const periodStartPosRef = useRef<number | null>(null)
  const bufferStartTimeRef = useRef<number>(Date.now())

  /**
   * Adiciona texto processado ao buffer
   */
  const append = useCallback((processedText: string, editor: Editor): void => {
    // Capturar posição inicial do período na primeira adição
    if (periodStartPosRef.current === null) {
      periodStartPosRef.current = editor.state.selection.from
    }

    // Acumular texto processado
    if (accumulatedTextRef.current) {
      accumulatedTextRef.current += ' ' + processedText
    } else {
      accumulatedTextRef.current = processedText
    }
  }, [])

  /**
   * Retorna snapshot do buffer para processamento Whisper
   */
  const snapshot = useCallback((editor: Editor): BufferSnapshot => {
    const endPos = editor.state.selection.from
    const startPos = periodStartPosRef.current ?? Math.max(0, endPos - accumulatedTextRef.current.length - 10)
    const duration = Date.now() - bufferStartTimeRef.current

    return {
      text: accumulatedTextRef.current || '',
      startPos,
      endPos,
      duration,
    }
  }, [])

  /**
   * Reseta buffer para novo período
   */
  const reset = useCallback((): void => {
    accumulatedTextRef.current = ''
    periodStartPosRef.current = null
    bufferStartTimeRef.current = Date.now()
  }, [])

  /**
   * Retorna texto acumulado
   */
  const getText = useCallback((): string => {
    return accumulatedTextRef.current
  }, [])

  /**
   * Retorna posição inicial do período
   */
  const getStartPos = useCallback((): number | null => {
    return periodStartPosRef.current
  }, [])

  return {
    append,
    snapshot,
    reset,
    getText,
    getStartPos,
  }
}
