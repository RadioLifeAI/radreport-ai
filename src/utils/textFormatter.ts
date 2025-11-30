/**
 * Utilitários puros de formatação de texto para ditado médico
 */

/**
 * Verifica se deve capitalizar o próximo caractere
 */
export function shouldCapitalizeNext(text: string, pos: number): boolean {
  if (pos === 0) return true
  
  const before = text.substring(0, pos).trimEnd()
  if (before.length === 0) return true
  
  const lastChar = before[before.length - 1]
  const sentenceEnders = ['.', '!', '?']
  
  return sentenceEnders.includes(lastChar)
}

/**
 * Aplica capitalização ao texto
 */
export function applyCapitalization(text: string): string {
  if (!text || text.length === 0) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Normaliza espaçamento após pontuação
 */
export function normalizeSpacing(text: string): string {
  return text
    .replace(/\s+([.,;:!?])/g, '$1') // Remove espaços antes de pontuação
    .replace(/([.,;:!?])(?=[^\s])/g, '$1 ') // Adiciona espaço após pontuação
    .replace(/\s+/g, ' ') // Normaliza múltiplos espaços
    .trim()
}

/**
 * Converte newlines do texto da IA em HTML estruturado
 * - \n\n → novo parágrafo <p>
 * - \n → quebra de linha <br/>
 */
export function convertNewlinesToHTML(text: string): string {
  // Dividir por parágrafos duplos
  return text
    .split('\n\n')
    .filter(para => para.trim())
    .map(para => {
      // Converter quebras simples em <br/>
      const withBreaks = para.replace(/\n/g, '<br/>')
      return `<p>${withBreaks}</p>`
    })
    .join('')
}

/**
 * Converte Blob de áudio para base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      const base64Data = base64.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
