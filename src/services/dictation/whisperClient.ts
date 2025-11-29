import { supabase } from '@/integrations/supabase/client'
import { blobToBase64 } from '@/utils/textFormatter'
import { processMedicalText } from '@/utils/medicalTextProcessor'

interface WhisperTranscriptionResult {
  text: string
  creditsRemaining?: number
}

const MIN_AUDIO_DURATION_SECONDS = 5
const MIN_AUDIO_SIZE = MIN_AUDIO_DURATION_SECONDS * 8000 // ~40KB para 5s de WebM Opus
const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25MB

/**
 * Valida tamanho do blob de áudio
 */
export function validateAudioBlob(blob: Blob): { valid: boolean; reason?: string } {
  if (blob.size < MIN_AUDIO_SIZE) {
    return {
      valid: false,
      reason: `Áudio muito curto (${Math.round(blob.size / 1024)}KB, necessário ${Math.round(MIN_AUDIO_SIZE / 1024)}KB)`
    }
  }

  if (blob.size > MAX_AUDIO_SIZE) {
    return {
      valid: false,
      reason: `Áudio muito grande (${Math.round(blob.size / 1024 / 1024)}MB, máximo 25MB)`
    }
  }

  return { valid: true }
}

/**
 * Detecta atividade de áudio usando análise RMS e picos
 */
export async function detectAudioActivity(blob: Blob): Promise<boolean> {
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const audioContext = new AudioContext()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    const channelData = audioBuffer.getChannelData(0)
    const rms = Math.sqrt(channelData.reduce((sum, val) => sum + val * val, 0) / channelData.length)
    const peak = Math.max(...Array.from(channelData).map(Math.abs))
    
    await audioContext.close()
    
    const RMS_THRESHOLD = 0.02
    const PEAK_THRESHOLD = 0.1
    const hasActivity = rms > RMS_THRESHOLD && peak > PEAK_THRESHOLD
    
    console.log(`🔊 VAD: RMS=${rms.toFixed(4)}, Peak=${peak.toFixed(4)}, Active=${hasActivity}`)
    
    return hasActivity
  } catch (error) {
    console.warn('⚠️ VAD check failed, assuming active:', error)
    return true
  }
}

/**
 * Transcreve áudio usando Whisper com retry automático
 */
export async function transcribeAudio(
  audioBlob: Blob,
  options: {
    maxRetries?: number
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<WhisperTranscriptionResult> {
  const { maxRetries = 3, onRetry } = options

  // Validação de tamanho
  const validation = validateAudioBlob(audioBlob)
  if (!validation.valid) {
    throw new Error(validation.reason)
  }

  // VAD - detecção de atividade de voz
  const hasActivity = await detectAudioActivity(audioBlob)
  if (!hasActivity) {
    throw new Error('Áudio silencioso detectado')
  }

  let attempt = 0
  let lastError: Error | null = null

  while (attempt < maxRetries) {
    try {
      const base64Audio = await blobToBase64(audioBlob)
      console.log(`🎤 Sending to Whisper (attempt ${attempt + 1}/${maxRetries}, ${Math.round(audioBlob.size / 1024)}KB)`)

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: base64Audio,
          language: 'pt'
        }
      })

      if (error) throw error

      if (data?.text) {
        const processedText = processMedicalText(data.text)
        console.log('✅ Whisper transcription successful')

        return {
          text: processedText,
          creditsRemaining: data.credits_remaining,
        }
      }

      throw new Error('Resposta vazia do Whisper')

    } catch (error) {
      attempt++
      lastError = error instanceof Error ? error : new Error(String(error))
      
      const errorMessage = lastError.message
      console.error(`❌ Whisper error (attempt ${attempt}/${maxRetries}):`, errorMessage)
      
      // Não fazer retry em erros de arquivo corrompido
      if (errorMessage.includes('corrompido') || errorMessage.includes('could not process file')) {
        console.error('❌ Audio file corrupted - stopping retries')
        throw lastError
      }
      
      // Callback de retry
      if (onRetry && attempt < maxRetries) {
        onRetry(attempt, lastError)
      }
      
      // Backoff exponencial
      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000
        console.log(`⏳ Retrying in ${backoffMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
      }
    }
  }

  throw lastError || new Error('Falha na transcrição após múltiplas tentativas')
}
