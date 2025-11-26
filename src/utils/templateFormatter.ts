/**
 * Template Formatter Utilities
 * Funções puras para formatação de templates médicos em HTML
 */

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
  
  // Se for apenas um texto simples, retornar como parágrafo único
  return `<p>${textoLimpo}</p>`
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
 * Aceita tanto string quanto objeto { texto: string }
 */
export function formatarTecnica(tecnica: any): string {
  if (!tecnica) return ''
  
  // Se for string direta
  if (typeof tecnica === 'string') {
    const textoLimpo = tecnica.trim()
    if (!textoLimpo) return ''
    return `<h3>Técnica</h3>${formatarAchadosParagrafos(textoLimpo)}`
  }
  
  // Se for objeto com propriedade texto
  if (typeof tecnica === 'object' && tecnica.texto) {
    const textoLimpo = tecnica.texto.trim()
    if (!textoLimpo) return ''
    return `<h3>Técnica</h3>${formatarAchadosParagrafos(textoLimpo)}`
  }
  
  return ''
}
