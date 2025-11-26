import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabaseService } from '../services/SupabaseService'
import { useReportStore } from '../store'

export interface Template {
  id: string
  titulo: string
  modalidade: string
  regiao: string
  conteudo: {
    tecnica: Record<string, string>
    achados: string
    impressao: string
    adicionais?: string
  }
  tags: string[]
  ativo: boolean
  isFavorite?: boolean
  lastUsed?: string
  usageCount?: number
}

interface UseTemplatesReturn {
  templates: Template[]
  filteredTemplates: Template[]
  recentTemplates: Template[]
  favoriteTemplates: Template[]
  filteredTemplatesForDisplay: Template[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedModality: string
  setSearchTerm: (term: string) => void
  setSelectedModality: (modality: string) => void
  loadTemplates: () => Promise<void>
  applyTemplate: (template: Template) => void
  addToFavorites: (templateId: string) => void
  removeFromFavorites: (templateId: string) => void
  isFavorite: (templateId: string) => boolean
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([])
  const [serverResults, setServerResults] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModality, setSelectedModality] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Report store integration - to be implemented
  const setContent = (content: string) => console.log('setContent:', content)
  const setModalidade = (mod: string) => console.log('setModalidade:', mod)

  // Carregar favoritos do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('radreport.favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
      }
    }
  }, [])

  // Função para verificar se é favorito
  const isFavorite = useCallback((templateId: string) => {
    return favorites.includes(templateId)
  }, [favorites])

  // Carregar templates do Supabase
  const loadTemplates = useCallback(async () => {
    console.log('loadTemplates: Iniciando execução...')
    setLoading(true)
    setError(null)
    
    try {
      console.log('Iniciando carregamento de templates do system_templates...')
      console.log('SupabaseService disponível:', !!supabaseService)
      
      // Buscar todos os templates
      const allTemplates = await supabaseService.getTemplates()
      
      console.log(`Total de templates encontrados: ${allTemplates.length}`)
      
      // Mapear para o formato esperado
      const mappedTemplates = allTemplates.map((template: any) => ({
        id: template.id,
        titulo: template.titulo,
        modalidade: template.modalidade_codigo,
        regiao: template.regiao_codigo,
        conteudo: {
          tecnica: template.tecnica || {},
          achados: template.achados || 'Achados normais',
          impressao: template.impressao || 'Impressão padrão',
          adicionais: template.adicionais || ''
        },
        tags: template.tags || [],
        ativo: template.ativo,
        isFavorite: favorites.includes(template.id),
        lastUsed: new Date().toISOString(),
        usageCount: 0
      }))
      
      console.log('Templates mapeados:', mappedTemplates.slice(0, 3)) // Mostrar os 3 primeiros
      console.log('Exemplo de template completo:', mappedTemplates[0]) // Mostrar o primeiro template completo
      
      // Remover duplicatas por título
      const uniqueTemplates = mappedTemplates.filter((template, index, self) =>
        index === self.findIndex(t => t.titulo === template.titulo)
      )
      
      // Ordenar por modalidade e título
      const sortedTemplates = uniqueTemplates.sort((a, b) => {
        if (a.modalidade !== b.modalidade) {
          return a.modalidade.localeCompare(b.modalidade)
        }
        return a.titulo.localeCompare(b.titulo)
      })
      
      console.log(`Templates após processamento: ${sortedTemplates.length}`)
      
      // Usar apenas templates do Supabase
      setTemplates(sortedTemplates)
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
      setError('Erro ao carregar templates do banco de dados')
    } finally {
      setLoading(false)
    }
  }, [favorites])

  // Função de correspondência fuzzy simples (declarada antes do uso)
  function _fuzzyMatch(str: string, pattern: string): number {
    const patternLength = pattern.length
    const strLength = str.length
    if (patternLength === 0) return 0
    if (patternLength > strLength) return 0
    let matches = 0
    let patternIndex = 0
    for (let i = 0; i < strLength && patternIndex < patternLength; i++) {
      if (str[i] === pattern[patternIndex]) {
        matches++
        patternIndex++
      }
    }
    return matches / patternLength
  }

  // Filtrar templates com busca inteligente
  const filteredTemplates = useMemo(() => {
    let filtered = templates
    
    // Filtrar por modalidade
    if (selectedModality) {
      filtered = filtered.filter(template => template.modalidade === selectedModality)
    }
    
    // Filtrar por termo de busca com algoritmo inteligente
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      const searchWords = searchLower.split(/\s+/).filter(word => word.length > 2)
      
      filtered = filtered.filter(template => {
        const templateText = [
          template.titulo,
          template.modalidade,
          template.regiao,
          template.conteudo.achados,
          template.conteudo.impressao,
          template.conteudo.adicionais,
          ...template.tags
        ].join(' ').toLowerCase()
        
        // Busca exata primeiro
        if (templateText.includes(searchLower)) {
          return true
        }
        
        // Busca por palavras individuais
        if (searchWords.length > 0) {
          const matches = searchWords.filter(word => 
            templateText.includes(word) ||
            _fuzzyMatch(template.titulo.toLowerCase(), word) > 0.6 ||
            _fuzzyMatch(template.modalidade.toLowerCase(), word) > 0.6 ||
            _fuzzyMatch(template.regiao.toLowerCase(), word) > 0.6
          )
          return matches.length >= Math.ceil(searchWords.length * 0.5) // Pelo menos 50% das palavras devem corresponder
        }
        
        return false
      })
    }
    
    return filtered
  }, [templates, selectedModality, searchTerm])

  // Busca no servidor com debounce quando há termo de busca
  useEffect(() => {
    const term = searchTerm.trim()
    if (!term) {
      setServerResults([])
      return
    }

    let cancelled = false
    const h = setTimeout(async () => {
      try {
        const raw = await supabaseService.searchTemplates(term)
        const mapped = raw.map((template: any) => ({
          id: template.id,
          titulo: template.titulo,
          modalidade: template.modalidade_codigo,
          regiao: template.regiao_codigo,
          conteudo: {
            tecnica: template.tecnica || {},
            achados: template.achados || 'Achados normais',
            impressao: template.impressao || 'Impressão padrão',
            adicionais: template.adicionais || ''
          },
          tags: template.tags || [],
          ativo: template.ativo,
          isFavorite: favorites.includes(template.id),
          lastUsed: new Date().toISOString(),
          usageCount: 0
        }))

        // Ordenar por relevância simples: match no título primeiro
        const s = term.toLowerCase()
        const ranked = mapped.sort((a, b) => {
          const at = a.titulo.toLowerCase()
          const bt = b.titulo.toLowerCase()
          const aScore = (at === s ? 3 : at.startsWith(s) ? 2 : at.includes(s) ? 1 : 0)
          const bScore = (bt === s ? 3 : bt.startsWith(s) ? 2 : bt.includes(s) ? 1 : 0)
          if (aScore !== bScore) return bScore - aScore
          return at.localeCompare(bt)
        })

        if (!cancelled) setServerResults(ranked)
      } catch (e) {
        if (!cancelled) setServerResults([])
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(h)
    }
  }, [searchTerm, selectedModality, favorites])
  
  // Função de correspondência fuzzy simples
  // Função para formatar achados médicos em parágrafos separados
  const formatarAchadosParagrafos = (texto: string): string => {
    if (!texto || texto.trim() === '') {
      return '<p>Achados normais</p>'
    }
    
    // Processar texto com quebras de linha do Supabase
    let textoProcessado = texto
    
    // Se encontrar \n (escape de quebra de linha do Supabase)
    if (texto.includes('\\n')) {
      textoProcessado = texto.replace(/\\n/g, '\n')
    }
    
    // Se encontrar \n no meio do texto (formato corrido)
    if (texto.includes('\\n')) {
      textoProcessado = texto.replace(/\\n/g, '\n')
    }
    
    // Limpar o texto - remover múltiplos espaços e tabs
    textoProcessado = textoProcessado
      .replace(/\t/g, ' ') // Substituir tabs por espaços
      .replace(/\s+/g, ' ') // Remover múltiplos espaços
      .trim()
    
    // Verificar se tem quebras de linha reais
    if (textoProcessado.includes('\n')) {
      // Dividir por quebras de linha e processar cada linha
      const linhas = textoProcessado
        .split(/\n+/)
        .map(linha => linha.trim())
        .filter(linha => linha.length > 0)
      
      // Se tiver múltiplas linhas, criar parágrafos
      if (linhas.length > 0) {
        // Detectar se é um texto com estrutura médica complexa
        const temEstruturaMedica = linhas.some(linha => 
          linha.includes('Artéria') || 
          linha.includes('coronária') || 
          linha.includes('Ramo') ||
          linha.includes('Tronco') ||
          linha.includes('Ventricular') ||
          linha.includes('sem lesões') ||
          linha.includes('origem') ||
          linha.match(/^\d+\./) ||
          linha.includes(':')
        )
        
        if (temEstruturaMedica) {
          // Para achados médicos complexos, manter cada linha como parágrafo separado
          return linhas.map(linha => {
            // Limpar e formatar a linha
            const linhaLimpa = linha
              .replace(/\s*:\s*/g, ': ') // Normalizar espaços ao redor dos dois pontos
              .replace(/\s*\(\s*/g, ' (') // Normalizar espaços antes de parênteses
              .replace(/\s*\)\s*/g, ') ') // Normalizar espaços depois de parênteses
              .trim()
            
            // Se a linha já termina com ponto, manter assim
            if (linhaLimpa.endsWith('.')) {
              return `<p>${linhaLimpa}</p>`
            }
            // Se não terminar com ponto, adicionar ponto final
            return `<p>${linhaLimpa}.</p>`
          }).join('\n')
        } else {
          // Para textos simples, juntar linhas relacionadas
          const paragrafos = []
          let paragrafoAtual = ''
          
          for (const linha of linhas) {
            // Se a linha for curta e não terminar com ponto, pode ser continuação
            if (linha.length < 80 && !linha.endsWith('.') && !linha.includes('.')) {
              paragrafoAtual += (paragrafoAtual ? ' ' : '') + linha
            } else {
              // Se já temos um parágrafo acumulado, adicionar
              if (paragrafoAtual) {
                paragrafos.push(paragrafoAtual + ' ' + linha)
                paragrafoAtual = ''
              } else {
                paragrafos.push(linha)
              }
            }
          }
          
          // Adicionar último parágrafo se houver
          if (paragrafoAtual) {
            paragrafos.push(paragrafoAtual)
          }
          
          return paragrafos.map(paragrafo => `<p>${paragrafo}</p>`).join('\n')
        }
      }
    }
    
    // Se não tem quebras de linha, tentar dividir por sentenças
    const sentencas = textoProcessado
      .split(/(?<=[.!?])\s+/) // Dividir por pontos finais, exclamações ou interrogações
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    // Se tiver múltiplas sentenças, criar parágrafos
    if (sentencas.length > 1) {
      return sentencas.map(sentenca => `<p>${sentenca}</p>`).join('\n')
    }
    
    // Se for apenas um texto simples, retornar como parágrafo único
    return `<p>${textoProcessado}</p>`
  }

  // Função específica para formatar achados médicos complexos
  const formatarAchadosMedicos = (texto: string): string => {
    if (!texto || texto.trim() === '') {
      return '<p>Achados normais</p>'
    }
    
    // Processar texto com quebras de linha do Supabase
    let textoProcessado = texto
    
    // Substituir \n por quebras de linha reais
    if (textoProcessado.includes('\\n')) {
      textoProcessado = textoProcessado.replace(/\\n/g, '\n')
    }
    
    // Limpar o texto
    textoProcessado = textoProcessado
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Se tem quebras de linha, processar linha por linha
    if (textoProcessado.includes('\n')) {
      const linhas = textoProcessado
        .split(/\n+/)
        .map(linha => linha.trim())
        .filter(linha => linha.length > 0)
      
      // Formatar cada linha como parágrafo separado
      return linhas.map(linha => {
        // Limpar espaços extras
        const linhaLimpa = linha
          .replace(/\s*:\s*/g, ': ')
          .replace(/\s*\(\s*/g, ' (')
          .replace(/\s*\)\s*/g, ') ')
          .trim()
        
        // Se já termina com ponto, usar assim
        if (linhaLimpa.endsWith('.')) {
          return `<p>${linhaLimpa}</p>`
        }
        // Se não termina com ponto, adicionar
        return `<p>${linhaLimpa}.</p>`
      }).join('\n')
    }
    
    // Se não tem quebras de linha, usar a função geral
    return formatarAchadosParagrafos(texto)
  }

  // Função para formatar técnica - extrair texto do JSON do Supabase
  const formatarTecnica = (tecnica: any): string => {
    if (!tecnica) return ''

    const limparPrefixo = (s: string) =>
      s
        .replace(/^\s*(t[ée]cnica)\s*[:\-]\s*/i, '')
        .replace(/^\s*(procedimento)\s*[:\-]\s*/i, '')
        .trim()

    if (typeof tecnica === 'string') {
      return limparPrefixo(tecnica)
    }

    if (typeof tecnica === 'object') {
      const ignorarChaves = new Set(['procedimento'])
      const partes: string[] = []

      for (const [key, value] of Object.entries(tecnica)) {
        const k = String(key).toLowerCase()
        if (ignorarChaves.has(k)) continue
        const v = limparPrefixo(String(value || '').trim())
        if (v) partes.push(v)
      }

      return partes.join('. ')
    }

    return String(tecnica)
  }

  // _fuzzyMatch movida para cima para evitar TDZ

  // Templates recentes com ordenação inteligente
  const recentTemplates = useMemo(() => {
    // Priorizar favoritos e templates mais usados
    const favoriteTemplates = templates.filter(t => isFavorite(t.id))
    const otherTemplates = templates.filter(t => !isFavorite(t.id))
    
    // Ordenar por relevância: favoritos primeiro, depois por uso recente
    const sortedTemplates = [...favoriteTemplates, ...otherTemplates].sort((a, b) => {
      // Favoritos sempre primeiro
      if (isFavorite(a.id) && !isFavorite(b.id)) return -1
      if (!isFavorite(a.id) && isFavorite(b.id)) return 1
      
      // Depois por contagem de uso (mais usados primeiro)
      const aUsage = a.usageCount || 0
      const bUsage = b.usageCount || 0
      if (aUsage !== bUsage) {
        return bUsage - aUsage
      }
      
      // Por último, por data de uso mais recente
      const aLastUsed = a.lastUsed || new Date(0).toISOString()
      const bLastUsed = b.lastUsed || new Date(0).toISOString()
      return new Date(bLastUsed).getTime() - new Date(aLastUsed).getTime()
    })
    
    return sortedTemplates.slice(0, 10)
  }, [templates, favorites])

  // Templates favoritos
  const favoriteTemplates = useMemo(() => {
    return templates.filter(template => isFavorite(template.id))
  }, [templates, favorites])

  // Aplicar template no editor e registrar uso
  const applyTemplate = useCallback((template: Template) => {
    setModalidade(template.modalidade)
    
    // Formatar técnica usando a função específica
    const tecnicaTexto = formatarTecnica(template.conteudo.tecnica)
    const tecnicaHtml = tecnicaTexto ? `<h3>Técnica</h3>${formatarAchadosParagrafos(tecnicaTexto)}` : ''
    
    // Detectar se são achados médicos complexos e usar formatação apropriada
    const achadosTexto = template.conteudo.achados
    const achadosHtml = achadosTexto.includes('\\n') || achadosTexto.includes('\n') 
      ? formatarAchadosMedicos(achadosTexto)
      : formatarAchadosParagrafos(achadosTexto)
    
    // Formatar impressão com parágrafos separados
    const impressaoHtml = formatarAchadosParagrafos(template.conteudo.impressao)
    
    // Formatar adicionais com parágrafos separados
    const adicionaisHtml = template.conteudo.adicionais ? formatarAchadosParagrafos(template.conteudo.adicionais) : ''
    
    const html = `
      <h2>${template.titulo}</h2>
      ${tecnicaHtml}
      <h3>Achados</h3>
      ${achadosHtml}
      <h3>Impressão</h3>
      ${impressaoHtml}
      ${adicionaisHtml ? `<h3>Adicionais</h3>${adicionaisHtml}` : ''}`
    
    setContent(html)
    
    // Atualizar estatísticas de uso
    setTemplates(prev => prev.map(t => 
      t.id === template.id 
        ? { ...t, usageCount: (t.usageCount || 0) + 1, lastUsed: new Date().toISOString() }
        : t
    ))
  }, [setContent, setModalidade, formatarTecnica, formatarAchadosParagrafos, formatarAchadosMedicos])

  // Gerenciar favoritos
  const addToFavorites = useCallback((templateId: string) => {
    const newFavorites = [...favorites, templateId]
    setFavorites(newFavorites)
    localStorage.setItem('radreport.favorites', JSON.stringify(newFavorites))
  }, [favorites])

  const removeFromFavorites = useCallback((templateId: string) => {
    const newFavorites = favorites.filter(id => id !== templateId)
    setFavorites(newFavorites)
    localStorage.setItem('radreport.favorites', JSON.stringify(newFavorites))
  }, [favorites])

  // Carregar templates na montagem
  useEffect(() => {
    console.log('useTemplates: Iniciando carregamento de templates...')
    loadTemplates()
  }, [loadTemplates])

  return {
    templates,
    filteredTemplates,
    recentTemplates,
    favoriteTemplates,
    filteredTemplatesForDisplay: serverResults.length || searchTerm.trim() ? serverResults : filteredTemplates,
    loading,
    error,
    searchTerm,
    selectedModality,
    setSearchTerm,
    setSelectedModality,
    loadTemplates,
    applyTemplate,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }
}
