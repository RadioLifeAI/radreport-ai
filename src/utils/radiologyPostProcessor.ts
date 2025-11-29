import { processMedicalText } from './medicalTextProcessor'

/**
 * Pós-processador radiológico avançado
 * Funções de contexto médico para preparação antes do LLM
 */

/**
 * Aplica estilo telegráfico objetivo (remove verbos desnecessários)
 */
export function applyTelegraphicStyle(text: string): string {
  let processed = text

  // Lista de verbos comuns que podem ser removidos para estilo telegráfico
  const unnecessaryVerbs = [
    'observa-se',
    'observamos',
    'nota-se',
    'notamos',
    'visualiza-se',
    'visualizamos',
    'verifica-se',
    'verificamos',
    'identifica-se',
    'identificamos',
  ]

  for (const verb of unnecessaryVerbs) {
    const regex = new RegExp(`\\b${verb}\\s+`, 'gi')
    processed = processed.replace(regex, '')
  }

  return processed
}

/**
 * Prepara texto para envio ao LLM Groq
 * Aplica todas as correções locais antes da correção contextual IA
 */
export function prepareForLLM(text: string): string {
  let processed = text
  
  // 1. Aplicar correções base (já inclui: ruído, voice fixes, phonetic, morphology, acronyms, repetitions, measurements)
  processed = processMedicalText(processed)
  
  // 2. Estilo telegráfico (opcional - descomentar se necessário)
  // processed = applyTelegraphicStyle(processed)
  
  // 3. Limpeza final
  processed = processed.replace(/\s{2,}/g, ' ').trim()
  
  return processed
}
