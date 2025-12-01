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
