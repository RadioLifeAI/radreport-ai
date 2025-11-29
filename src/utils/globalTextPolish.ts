import { processMedicalText } from './medicalTextProcessor'
import { normalizeSpacing } from './textFormatter'

/**
 * Correção global final aplicada quando ditado é parado
 * Analisa o trecho completo para correções semânticas e estruturais
 */
export function applyGlobalPolish(text: string): string {
  let result = text
  
  // 1. Correções médicas já aplicadas incrementalmente, mas reaplicar para garantir
  result = processMedicalText(result)
  
  // 2. Capitalização inteligente após pontuação
  result = capitalizeAfterPunctuation(result)
  
  // 3. Estruturação de parágrafos
  result = structureParagraphs(result)
  
  // 4. Correções de formatação final
  result = finalFormattingFixes(result)
  
  // 5. Normalizar espaços
  result = normalizeSpacing(result)
  
  return result
}

/**
 * Capitaliza após pontuação final (. ! ?)
 */
function capitalizeAfterPunctuation(text: string): string {
  return text.replace(/([.!?])\s+([a-záàâãéèêíïóôõöúç])/gi, (match, punct, char) => {
    return punct + ' ' + char.toUpperCase()
  })
}

/**
 * Estrutura parágrafos baseado em contexto médico
 * - Adiciona quebra após seções (ACHADOS:, IMPRESSÃO:, etc.)
 * - Agrupa frases relacionadas
 */
function structureParagraphs(text: string): string {
  let result = text
  
  // Seções médicas que devem começar novo parágrafo
  const sections = ['ACHADOS', 'IMPRESSÃO', 'TÉCNICA', 'CONCLUSÃO', 'OPINIÃO']
  
  for (const section of sections) {
    const regex = new RegExp(`(${section}:?)`, 'gi')
    result = result.replace(regex, '\n\n$1')
  }
  
  // Limpar quebras múltiplas
  result = result.replace(/\n{3,}/g, '\n\n')
  
  return result.trim()
}

/**
 * Correções de formatação final
 */
function finalFormattingFixes(text: string): string {
  let result = text
  
  // Remover espaços antes de pontuação
  result = result.replace(/\s+([.,;:!?])/g, '$1')
  
  // Garantir espaço após pontuação
  result = result.replace(/([.,;:!?])([A-Za-záàâãéèêíïóôõöúç])/g, '$1 $2')
  
  // Remover espaços múltiplos
  result = result.replace(/\s{2,}/g, ' ')
  
  return result
}
