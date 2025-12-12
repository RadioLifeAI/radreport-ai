/**
 * Utilitários para extração e manipulação de seções de laudo radiológico
 * Seções padrão: TÉCNICA, ACHADOS, IMPRESSÃO, ADICIONAIS
 */

export interface ReportSections {
  titulo: string
  tecnica: string
  achados: string
  impressao: string
  adicionais: string
}

// Variações aceitas para seção de impressão/conclusão
export const IMPRESSION_SECTION_VARIATIONS = [
  'IMPRESSÃO',
  'IMPRESSAO',
  'IMPRESSÃO DIAGNÓSTICA',
  'IMPRESSAO DIAGNOSTICA',
  'OPINIÃO',
  'OPINIAO',
  'CONCLUSÃO',
  'CONCLUSAO'
]

// Padrões que indicam conclusão "normal/padrão" (deve substituir)
export const NORMAL_CONCLUSION_PATTERNS = [
  /dentro\s+dos?\s+limites?\s+d[ae]\s+normalidade/i,
  /sem\s+alter(a[çc][oõ]es?|ações)\s+significativas?/i,
  /estudo\s+normal/i,
  /exame\s+(sem\s+alterações|normal)/i,
  /sem\s+anormalidades/i,
  /aspectos?\s+(ecogr[aá]ficos?|tomogr[aá]ficos?|radiogr[aá]ficos?)\s+normais?/i,
  /sem\s+particularidades/i,
  /sem\s+evid[eê]ncias?\s+de\s+altera[çc][oõ]es?/i,
  /estudo\s+sem\s+altera[çc][oõ]es/i,
  /estudo\s+ecogr[aá]fico\s+normal/i,
  /estudo\s+tomogr[aá]fico\s+normal/i,
  /a\s+crit[eé]rio\s+cl[ií]nico/i,
  /controle\s+de\s+rotina/i
]

export interface ImpressionSectionInfo {
  found: boolean
  headerMatch: string | null
  headerStartIndex: number
  headerEndIndex: number
  contentStartIndex: number
  contentEndIndex: number
  currentContent: string
  isNormal: boolean
}

/**
 * Verifica se um texto de header corresponde a uma seção de impressão
 */
export function isImpressionHeader(headerText: string): boolean {
  const normalized = headerText.trim().toUpperCase()
  return IMPRESSION_SECTION_VARIATIONS.some(variation => 
    normalized.includes(variation)
  )
}

/**
 * Verifica se o conteúdo da impressão é "normal/padrão"
 */
export function isNormalConclusion(content: string): boolean {
  if (!content || content.trim().length < 5) return true // Vazio = normal
  const normalizedContent = content.trim()
  return NORMAL_CONCLUSION_PATTERNS.some(pattern => pattern.test(normalizedContent))
}

/**
 * Encontra a seção de IMPRESSÃO no HTML com todas as variações
 */
export function findImpressionSection(html: string): ImpressionSectionInfo {
  const result: ImpressionSectionInfo = {
    found: false,
    headerMatch: null,
    headerStartIndex: -1,
    headerEndIndex: -1,
    contentStartIndex: -1,
    contentEndIndex: -1,
    currentContent: '',
    isNormal: true
  }

  if (!html) return result

  // Regex para encontrar headers de impressão (h1-h6 ou strong em p)
  const headerRegex = /<(h[1-6]|p)[^>]*>(?:<[^>]+>)*\s*(IMPRESSÃO|IMPRESSAO|IMPRESSÃO\s+DIAGNÓSTICA|IMPRESSAO\s+DIAGNOSTICA|OPINIÃO|OPINIAO|CONCLUSÃO|CONCLUSAO)\s*(?:<\/[^>]+>)*<\/\1>/gi

  const match = headerRegex.exec(html)
  if (!match) return result

  result.found = true
  result.headerMatch = match[2]
  result.headerStartIndex = match.index
  result.headerEndIndex = match.index + match[0].length
  result.contentStartIndex = result.headerEndIndex

  // Encontrar onde termina o conteúdo (próximo header ou fim do documento)
  const nextHeaderRegex = /<h[1-6][^>]*>/gi
  nextHeaderRegex.lastIndex = result.headerEndIndex
  const nextHeaderMatch = nextHeaderRegex.exec(html)
  
  result.contentEndIndex = nextHeaderMatch 
    ? nextHeaderMatch.index 
    : html.length

  // Extrair conteúdo atual
  result.currentContent = html
    .substring(result.contentStartIndex, result.contentEndIndex)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  result.isNormal = isNormalConclusion(result.currentContent)

  return result
}

/**
 * Insere conclusão de forma inteligente na seção IMPRESSÃO
 * - Se impressão atual é "normal" → SUBSTITUI
 * - Se já tem alteração → ADICIONA abaixo
 * - Se não existe seção → CRIA no final
 */
export function smartInsertConclusion(html: string, newConclusion: string): string {
  if (!newConclusion || !newConclusion.trim()) return html
  
  const impression = findImpressionSection(html)
  const formattedConclusion = `<p>- ${newConclusion}</p>`

  if (!impression.found) {
    // Fallback: criar seção IMPRESSÃO no final
    return html + `\n<h3 style="text-transform: uppercase; text-align: center; margin-top: 18pt; margin-bottom: 8pt;">IMPRESSÃO</h3>\n${formattedConclusion}`
  }

  if (impression.isNormal) {
    // Conclusão atual é "normal" → SUBSTITUIR completamente
    const before = html.substring(0, impression.contentStartIndex)
    const after = html.substring(impression.contentEndIndex)
    return `${before}\n${formattedConclusion}\n${after}`
  }

  // Já tem alteração → ADICIONAR no final do conteúdo da impressão
  const before = html.substring(0, impression.contentEndIndex)
  const after = html.substring(impression.contentEndIndex)
  return `${before}\n${formattedConclusion}${after}`
}

/**
 * Extrai o conteúdo de uma seção específica do laudo
 * @param html - HTML completo do laudo
 * @param sectionName - Nome da seção (ex: 'ACHADOS', 'IMPRESSÃO')
 * @returns HTML da seção ou string vazia se não encontrada
 */
export function extractSection(html: string, sectionName: string): string {
  if (!html) return ''
  
  const normalizedName = sectionName.toUpperCase().trim()
  
  // Variações comuns de seções
  const variations = [normalizedName]
  if (normalizedName === 'ACHADOS') {
    variations.push('ACHADOS ULTRASSONOGRÁFICOS', 'ACHADOS TOMOGRÁFICOS', 'ACHADOS DE RESSONÂNCIA')
  }
  
  // Tentar todas as variações
  for (const variant of variations) {
    // Regex flexível - aceita tags internas (<strong>, <em>) e estilos
    const sectionRegex = new RegExp(
      `<h[2-6][^>]*>(?:<[^>]+>)*\\s*${variant}\\s*(?:<\\/[^>]+>)*<\\/h[2-6]>([\\s\\S]*?)(?=<h[2-6][^>]*>|$)`,
      'i'
    )
    
    const match = html.match(sectionRegex)
    if (match) return match[1].trim()
  }
  
  return ''
}

/**
 * Substitui o conteúdo de uma seção específica do laudo
 * @param html - HTML completo do laudo
 * @param sectionName - Nome da seção a substituir
 * @param newContent - Novo conteúdo HTML para a seção
 * @returns HTML completo com seção substituída
 */
export function replaceSection(html: string, sectionName: string, newContent: string): string {
  if (!html) return html
  
  const normalizedName = sectionName.toUpperCase().trim()
  
  // Regex para encontrar a seção completa (incluindo header)
  const sectionRegex = new RegExp(
    `(<h[2-6][^>]*>\\s*${normalizedName}\\s*<\\/h[2-6]>)([\\s\\S]*?)(?=<h[2-6][^>]*>|$)`,
    'i'
  )
  
  const match = html.match(sectionRegex)
  if (!match) {
    // Se a seção não existe, tentar criar antes de ADICIONAIS ou no final
    return ensureSection(html, normalizedName, newContent)
  }
  
  // Substituir apenas o conteúdo, mantendo o header
  const replacement = `${match[1]}\n${newContent}\n`
  return html.replace(sectionRegex, replacement)
}

/**
 * Verifica se uma seção existe no laudo
 * @param html - HTML completo do laudo
 * @param sectionName - Nome da seção
 * @returns true se a seção existe
 */
export function hasSection(html: string, sectionName: string): boolean {
  if (!html) return false
  
  const normalizedName = sectionName.toUpperCase().trim()
  const sectionRegex = new RegExp(
    `<h[2-6][^>]*>\\s*${normalizedName}\\s*<\\/h[2-6]>`,
    'i'
  )
  
  return sectionRegex.test(html)
}

/**
 * Cria uma seção se ela não existir
 * @param html - HTML completo do laudo
 * @param sectionName - Nome da seção a criar
 * @param content - Conteúdo inicial da seção
 * @returns HTML com seção criada
 */
function ensureSection(html: string, sectionName: string, content: string): string {
  const normalizedName = sectionName.toUpperCase().trim()
  const sectionHeader = `<h3 style="text-transform: uppercase; text-align: center; margin-top: 18pt; margin-bottom: 8pt;">${normalizedName}</h3>`
  
  // Se tem ADICIONAIS, inserir antes
  if (hasSection(html, 'ADICIONAIS')) {
    return html.replace(
      /<h[2-6][^>]*>\s*ADICIONAIS\s*<\/h[2-6]>/i,
      `${sectionHeader}\n${content}\n$&`
    )
  }
  
  // Senão, adicionar no final
  return html + `\n${sectionHeader}\n${content}\n`
}

/**
 * Extrai todas as seções do laudo em objeto estruturado
 * @param html - HTML completo do laudo
 * @returns Objeto com todas as seções
 */
export function parseReportSections(html: string): ReportSections {
  if (!html) {
    return {
      titulo: '',
      tecnica: '',
      achados: '',
      impressao: '',
      adicionais: ''
    }
  }
  
  // Extrair título (primeiro h1 ou h2)
  const titleMatch = html.match(/<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/i)
  const titulo = titleMatch ? titleMatch[1].trim() : ''
  
  return {
    titulo,
    tecnica: extractSection(html, 'TÉCNICA'),
    achados: extractSection(html, 'ACHADOS'),
    impressao: extractSection(html, 'IMPRESSÃO'),
    adicionais: extractSection(html, 'ADICIONAIS')
  }
}
