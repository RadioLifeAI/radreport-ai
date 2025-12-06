/**
 * Sistema de Mapeamento Anatômico Inteligente
 * Identifica automaticamente a linha do editor onde inserir frases baseado na estrutura anatômica
 */

// Mapeamento estrutura anatômica → padrões regex para identificar linhas
export const anatomicalPatterns: Record<string, RegExp[]> = {
  // Abdome - Fígado
  'Fígado': [
    /^Fígado\s/i,
    /^Parênquima hepático/i,
    /^O fígado/i,
  ],
  // Vesícula Biliar
  'Vesícula Biliar': [
    /^Vesícula biliar/i,
    /^Vesícula\s/i,
  ],
  // Vias Biliares
  'Vias Biliares': [
    /^Vias biliares/i,
    /^Via biliar/i,
    /^Árvore biliar/i,
  ],
  // Pâncreas
  'Pâncreas': [
    /^Pâncreas/i,
    /^O pâncreas/i,
  ],
  // Baço
  'Baço': [
    /^Baço/i,
    /^O baço/i,
  ],
  // Rins
  'Rim': [
    /^Rins?\s/i,
    /^Os rins/i,
  ],
  'Rim Direito': [
    /^Rim direito/i,
    /^O rim direito/i,
  ],
  'Rim Esquerdo': [
    /^Rim esquerdo/i,
    /^O rim esquerdo/i,
  ],
  // Bexiga
  'Bexiga': [
    /^Bexiga/i,
    /^A bexiga/i,
  ],
  // Próstata
  'Próstata': [
    /^Próstata/i,
    /^A próstata/i,
  ],
  // Útero
  'Útero': [
    /^Útero/i,
    /^O útero/i,
  ],
  // Ovários
  'Ovário': [
    /^Ovários?/i,
    /^Os ovários/i,
  ],
  'Ovário Direito': [
    /^Ovário direito/i,
  ],
  'Ovário Esquerdo': [
    /^Ovário esquerdo/i,
  ],
  // Tireoide
  'Tireoide': [
    /^Tireóide/i,
    /^Tireoide/i,
    /^Glândula tireoide/i,
  ],
  // Mama
  'Mama': [
    /^Mamas?/i,
    /^As mamas/i,
  ],
  'Mama Direita': [
    /^Mama direita/i,
  ],
  'Mama Esquerda': [
    /^Mama esquerda/i,
  ],
  // Veia Porta
  'Veia Porta': [
    /^Veia porta/i,
  ],
  // Aorta
  'Aorta': [
    /^Aorta/i,
    /^A aorta/i,
  ],
  'Aorta Abdominal': [
    /^Aorta abdominal/i,
    /^Aorta\s/i,
  ],
  // Testículos
  'Testículo': [
    /^Testículos?/i,
    /^Os testículos/i,
  ],
  'Testículo Direito': [
    /^Testículo direito/i,
  ],
  'Testículo Esquerdo': [
    /^Testículo esquerdo/i,
  ],
  // Epidídimo
  'Epidídimo': [
    /^Epidídimos?/i,
  ],
  // Adrenais
  'Adrenal': [
    /^Adrenais/i,
    /^Glândulas adrenais/i,
  ],
  // Linfonodos
  'Linfonodo': [
    /^Linfonodos?/i,
    /^Não há linfonodomegalias/i,
  ],
  // Líquido Livre
  'Líquido Livre': [
    /^Líquido livre/i,
    /^Ausência de líquido livre/i,
    /^Não há líquido livre/i,
  ],
}

export interface ParsedParagraph {
  html: string
  text: string
  isHeader: boolean
  headerLevel?: number
}

export interface AnatomicalMapping {
  found: boolean
  lineIndex: number
  lineHtml: string
  lineText: string
  estruturaNome: string
}

/**
 * Divide o HTML em parágrafos preservando as tags
 */
export function splitIntoParagraphs(html: string): ParsedParagraph[] {
  if (!html) return []
  
  // Regex para encontrar elementos block-level
  const blockRegex = /<(p|h[1-6]|div|li|blockquote)[^>]*>[\s\S]*?<\/\1>/gi
  const matches = html.match(blockRegex) || []
  
  return matches.map(match => {
    // Extrair texto puro removendo tags
    const text = match.replace(/<[^>]+>/g, '').trim()
    
    // Verificar se é header
    const headerMatch = match.match(/^<h([1-6])/i)
    const isHeader = !!headerMatch
    const headerLevel = headerMatch ? parseInt(headerMatch[1]) : undefined
    
    return {
      html: match,
      text,
      isHeader,
      headerLevel
    }
  })
}

/**
 * Encontra a linha correspondente à estrutura anatômica no HTML
 */
export function findAnatomicalLine(
  html: string, 
  estruturaNome: string
): AnatomicalMapping | null {
  if (!html || !estruturaNome) return null
  
  const paragraphs = splitIntoParagraphs(html)
  const patterns = anatomicalPatterns[estruturaNome] || []
  
  // Criar padrão genérico baseado no nome da estrutura
  const genericPattern = new RegExp(`^${estruturaNome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, 'i')
  const allPatterns = [...patterns, genericPattern]
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i]
    
    // Pular headers
    if (para.isHeader) continue
    
    // Testar cada padrão contra o texto do parágrafo
    for (const pattern of allPatterns) {
      if (pattern.test(para.text)) {
        return {
          found: true,
          lineIndex: i,
          lineHtml: para.html,
          lineText: para.text,
          estruturaNome
        }
      }
    }
  }
  
  return null
}

/**
 * Reconstrói o HTML com a linha substituída
 */
export function rebuildHtmlWithReplacement(
  paragraphs: ParsedParagraph[],
  targetIndex: number,
  newContent: string
): string {
  return paragraphs.map((para, idx) => {
    if (idx === targetIndex) {
      // Preservar a tag original mas substituir o conteúdo
      const tagMatch = para.html.match(/^<(\w+)([^>]*)>/)
      if (tagMatch) {
        const tag = tagMatch[1]
        const attrs = tagMatch[2]
        return `<${tag}${attrs}>${newContent}</${tag}>`
      }
      return `<p>${newContent}</p>`
    }
    return para.html
  }).join('\n')
}

/**
 * Encontra o índice da seção IMPRESSÃO
 */
export function findImpressaoSectionIndex(paragraphs: ParsedParagraph[]): number {
  return paragraphs.findIndex(p => 
    p.isHeader && /impressão|conclusão/i.test(p.text)
  )
}

/**
 * Adiciona conclusão na seção IMPRESSÃO
 */
export function addConclusionToImpressao(
  paragraphs: ParsedParagraph[],
  conclusao: string
): ParsedParagraph[] {
  const impressaoIdx = findImpressaoSectionIndex(paragraphs)
  const conclusaoHtml = `<p>- ${conclusao}</p>`
  const newPara: ParsedParagraph = {
    html: conclusaoHtml,
    text: `- ${conclusao}`,
    isHeader: false
  }
  
  if (impressaoIdx !== -1) {
    // Encontrar o último parágrafo da seção IMPRESSÃO (antes do próximo header)
    let insertIdx = impressaoIdx + 1
    for (let i = impressaoIdx + 1; i < paragraphs.length; i++) {
      if (paragraphs[i].isHeader) break
      insertIdx = i + 1
    }
    
    // Inserir a conclusão
    const result = [...paragraphs]
    result.splice(insertIdx, 0, newPara)
    return result
  }
  
  // Se não encontrar IMPRESSÃO, adicionar ao final
  return [...paragraphs, newPara]
}
