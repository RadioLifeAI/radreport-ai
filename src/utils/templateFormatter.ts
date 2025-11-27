/**
 * Template Formatter Utilities
 * Funções puras para formatação de templates médicos em HTML
 */

/**
 * Divide texto em sentenças baseado em pontos finais
 * Ex: "Fígado normal. Baço normal." → "<p>Fígado normal.</p><p>Baço normal.</p>"
 */
export function dividirEmSentencas(texto: string): string {
  if (!texto || !texto.trim()) {
    return '<p></p>'
  }
  
  // Regex para dividir sentenças: ponto seguido de espaço e maiúscula
  // Preserva pontuação médica como "0.5 cm" ou "T1 e T2"
  const sentencas = texto
    .replace(/\.\s+(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕ])/g, '.|SPLIT|')
    .split('|SPLIT|')
    .filter(s => s.trim())
    .map(s => s.trim())
  
  if (sentencas.length === 0) {
    return '<p></p>'
  }
  
  return sentencas.map(s => `<p>${s}</p>`).join('')
}

/**
 * Formata texto de achados médicos em parágrafos HTML
 * Trata múltiplos formatos: listas, parágrafos, sentenças
 */
export function formatarAchadosParagrafos(texto: string): string {
  if (!texto || !texto.trim()) {
    return '<p>Sem achados relevantes.</p>'
  }

  const textoLimpo = texto.trim()

  // Se tem quebras de linha marcadas com "-", tratar como lista
  if (textoLimpo.includes('\n-') || textoLimpo.startsWith('-')) {
    const linhas = textoLimpo.split('\n').filter(l => l.trim())
    
    if (linhas.every(linha => linha.trim().startsWith('-'))) {
      // É uma lista com marcadores: transformar em parágrafos
      return linhas.map(linha => {
        const linhaLimpa = linha.replace(/^-\s*/, '').trim()
        if (!linhaLimpa) return ''
        // Se já termina com ponto, manter
        if (linhaLimpa.endsWith('.') || linhaLimpa.endsWith('?') || linhaLimpa.endsWith('!')) {
          return `<p>${linhaLimpa}</p>`
        }
        // Se não terminar com ponto, adicionar ponto final
        return `<p>${linhaLimpa}.</p>`
      }).join('')
    } else {
      // Para textos simples, juntar linhas relacionadas
      const paragrafos = []
      let paragrafoAtual = ''
      
      for (const linha of linhas) {
        const linhaLimpa = linha.trim()
        if (!linhaLimpa) continue
        
        // Se começar com -, iniciar novo parágrafo
        if (linhaLimpa.startsWith('-')) {
          if (paragrafoAtual) {
            paragrafos.push(paragrafoAtual)
          }
          paragrafoAtual = linhaLimpa.replace(/^-\s*/, '')
        } else {
          paragrafoAtual += (paragrafoAtual ? ' ' : '') + linhaLimpa
        }
      }
      
      if (paragrafoAtual) {
        paragrafos.push(paragrafoAtual)
      }
      
      return paragrafos.map(paragrafo => `<p>${paragrafo}</p>`).join('')
    }
  }
  
  // Se tem quebras de linha naturais, separar em sentenças
  const sentencas = textoLimpo.split(/\n+/).filter(s => s.trim()).map(s => s.trim())
  
  // Se tiver múltiplas sentenças, criar parágrafos
  if (sentencas.length > 1) {
    return sentencas.map(sentenca => `<p>${sentenca}</p>`).join('')
  }
  
  // Se não tem quebras de linha, dividir por sentenças (ponto + maiúscula)
  return dividirEmSentencas(textoLimpo)
}

/**
 * Formata achados médicos complexos com tratamento especial para listas
 * Garante que cada linha vire um parágrafo separado
 */
export function formatarAchadosMedicos(texto: string): string {
  if (!texto || !texto.trim()) {
    return '<p>Sem achados relevantes.</p>'
  }

  const textoLimpo = texto.trim()

  // Se tem quebras de linha explícitas, cada linha vira um parágrafo
  if (textoLimpo.includes('\n')) {
    const linhas = textoLimpo.split('\n').filter(l => l.trim())
    
    // Cada linha se torna um parágrafo
    return linhas.map(linha => {
      const linhaLimpa = linha.replace(/^-\s*/, '').trim()
      if (!linhaLimpa) return ''
      
      // Se já termina com pontuação, manter
      if (linhaLimpa.endsWith('.') || linhaLimpa.endsWith('?') || linhaLimpa.endsWith('!') || linhaLimpa.endsWith(':')) {
        return `<p>${linhaLimpa}</p>`
      }
      // Se não termina com ponto, adicionar
      return `<p>${linhaLimpa}.</p>`
    }).join('')
  }
  
  // Se não tem quebras de linha, usar a função geral
  return formatarAchadosParagrafos(textoLimpo)
}

/**
 * Extrai e formata a técnica do template
 * Aceita string, objeto { texto: string }, ou objeto com múltiplas variantes { EV: "...", SEM: "..." }
 */
export function formatarTecnica(tecnica: any, variantKey?: string): string {
  if (!tecnica) return ''
  
  // Se for string direta
  if (typeof tecnica === 'string') {
    const textoLimpo = tecnica.trim()
    if (!textoLimpo) return ''
    return `<h3 style="text-transform: uppercase;">TÉCNICA</h3><p>${textoLimpo}</p>`
  }
  
  // Se for objeto com múltiplas variantes (EV, SEM, Primovist, etc.)
  if (typeof tecnica === 'object') {
    // Se uma variante específica foi solicitada
    if (variantKey && tecnica[variantKey]) {
      return `<h3 style="text-transform: uppercase;">TÉCNICA</h3><p>${tecnica[variantKey]}</p>`
    }
    
    // Se tem propriedade "texto" (formato antigo)
    if (tecnica.texto) {
      const textoLimpo = tecnica.texto.trim()
      if (!textoLimpo) return ''
      return `<h3 style="text-transform: uppercase;">TÉCNICA</h3><p>${textoLimpo}</p>`
    }
    
    // Usar a primeira variante disponível (ou 'SEM' como padrão)
    const defaultKey = tecnica.SEM ? 'SEM' : Object.keys(tecnica)[0]
    if (defaultKey && tecnica[defaultKey]) {
      return `<h3 style="text-transform: uppercase;">TÉCNICA</h3><p>${tecnica[defaultKey]}</p>`
    }
  }
  
  return ''
}
