import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabaseService } from '../services/SupabaseService'
import { useReportStore } from '../store'
import { formatarAchadosParagrafos, formatarAchadosMedicos, formatarTecnica, dividirEmSentencas } from '@/utils/templateFormatter'
import { normalizeTemplateVariables, hasTemplateVariables, hasMultipleTechniques } from '@/utils/templateVariableProcessor'

export interface Template {
  id: string
  titulo: string
  modalidade: string
  regiao: string
  categoria?: string  // 'normal' | 'alterado'
  conteudo: {
    tecnica: Record<string, string>
    achados: string
    impressao: string
    adicionais?: string
  }
  tags: string[]
  ativo: boolean
  variaveis?: any[]  // Dynamic variables from database
  condicoes_logicas?: any[]  // Conditional logic rules
  isFavorite?: boolean
  lastUsed?: string
  usageCount?: number
}

// Filter for templates with/without variables
export type VariableFilter = 'all' | 'with' | 'without'

interface UseTemplatesReturn {
  templates: Template[]
  filteredTemplates: Template[]
  recentTemplates: Template[]
  favoriteTemplates: Template[]
  filteredTemplatesForDisplay: Template[]
  loading: boolean
  error: string | null
  searchTerm: string
  selectedModality: string | null
  selectedCategoria: string | null
  selectedVariableFilter: VariableFilter
  setSearchTerm: (term: string) => void
  setSelectedModality: (modality: string | null) => void
  setSelectedCategoria: (categoria: string | null) => void
  setSelectedVariableFilter: (filter: VariableFilter) => void
  loadTemplates: () => Promise<void>
  applyTemplate: (template: Template) => void
  applyTemplateWithVariables: (template: Template, selectedTechniques: string[], variableValues: Record<string, any>, removedSections?: string[]) => void
  needsVariableInput: (template: Template) => boolean
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
  const [selectedModality, setSelectedModality] = useState<string | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedVariableFilter, setSelectedVariableFilter] = useState<VariableFilter>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentUsageData, setRecentUsageData] = useState<Array<{template_id: string, used_at: string, usage_count: number}>>([])
  
  // Report store integration
  const { setContent, setModalidade, currentReportId } = useReportStore()

  // Carregar favoritos do Supabase
  useEffect(() => {
    const loadFavorites = async () => {
      const favoriteIds = await supabaseService.getUserFavoriteTemplates()
      setFavorites(favoriteIds)
    }
    loadFavorites()
  }, [])

  // Carregar histórico de uso recente
  useEffect(() => {
    const loadRecentUsage = async () => {
      const usageData = await supabaseService.getRecentTemplates(10)
      setRecentUsageData(usageData)
    }
    loadRecentUsage()
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
        categoria: template.categoria || 'normal',
        conteudo: {
          tecnica: template.tecnica || {},
          achados: template.achados || 'Achados normais',
          impressao: template.impressao || 'Impressão padrão',
          adicionais: template.adicionais || ''
        },
        tags: template.tags || [],
        ativo: template.ativo,
        variaveis: normalizeTemplateVariables(template.variaveis),
        condicoes_logicas: template.condicoes_logicas || [],
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
    
    // Filtrar por categoria (filtro geral - primeiro na hierarquia)
    if (selectedCategoria) {
      filtered = filtered.filter(template => template.categoria === selectedCategoria)
    }
    
    // Filtrar por variáveis (segundo na hierarquia)
    if (selectedVariableFilter !== 'all') {
      filtered = filtered.filter(template => {
        const hasVars = hasTemplateVariables(template) || hasMultipleTechniques(template)
        return selectedVariableFilter === 'with' ? hasVars : !hasVars
      })
    }
    
    // Filtrar por modalidade (filtro específico - terceiro na hierarquia)
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
  }, [templates, selectedCategoria, selectedVariableFilter, selectedModality, searchTerm])

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
  
  
  // Funções de formatação movidas para src/utils/templateFormatter.ts

  // _fuzzyMatch movida para cima para evitar TDZ

  // Templates recentes com ordenação baseada em histórico do Supabase
  const recentTemplates = useMemo(() => {
    if (recentUsageData.length === 0) return []

    // Mapear dados de uso para templates
    const usageMap = new Map(recentUsageData.map(u => [u.template_id, u]))
    
    // Filtrar templates que têm histórico de uso
    const templatesWithUsage = templates
      .filter(t => usageMap.has(t.id))
      .map(t => {
        const usage = usageMap.get(t.id)!
        return {
          ...t,
          usageCount: usage.usage_count,
          lastUsed: usage.used_at
        }
      })

    // Ordenar: favoritos primeiro, depois por data de uso mais recente
    return templatesWithUsage.sort((a, b) => {
      if (isFavorite(a.id) && !isFavorite(b.id)) return -1
      if (!isFavorite(a.id) && isFavorite(b.id)) return 1
      
      const aLastUsed = a.lastUsed || new Date(0).toISOString()
      const bLastUsed = b.lastUsed || new Date(0).toISOString()
      return new Date(bLastUsed).getTime() - new Date(aLastUsed).getTime()
    }).slice(0, 10)
  }, [templates, favorites, recentUsageData, isFavorite])

  // Templates favoritos
  const favoriteTemplates = useMemo(() => {
    return templates.filter(template => isFavorite(template.id))
  }, [templates, favorites])

  // Check if template needs variable input
  const needsVariableInput = useCallback((template: Template): boolean => {
    return hasTemplateVariables(template) || hasMultipleTechniques(template)
  }, [])

  // Aplicar template no editor e registrar uso
  const applyTemplate = useCallback(async (template: Template) => {
    setModalidade(template.modalidade)
    
    // Título centralizado e em maiúsculas
    const tituloHtml = `<h2 style="text-align: center; text-transform: uppercase;">${template.titulo}</h2>`
    
    // Técnica - formatarTecnica já retorna HTML completo com <h3>TÉCNICA</h3> (não re-processar!)
    const tecnicaHtml = formatarTecnica(template.conteudo.tecnica)
    
    // Achados - dividir sentenças em parágrafos
    const achadosHtml = dividirEmSentencas(template.conteudo.achados)
    
    // Impressão - dividir sentenças em parágrafos
    const impressaoHtml = dividirEmSentencas(template.conteudo.impressao)
    
    // Adicionais
    const adicionaisHtml = template.conteudo.adicionais 
      ? dividirEmSentencas(template.conteudo.adicionais) 
      : ''
    
    const html = [
      tituloHtml,
      tecnicaHtml, // Já inclui <h3>TÉCNICA</h3>
      `<h3 style="text-transform: uppercase;">ACHADOS</h3>`,
      achadosHtml,
      `<h3 style="text-transform: uppercase;">IMPRESSÃO</h3>`,
      impressaoHtml,
      adicionaisHtml ? `<h3 style="text-transform: uppercase;">ADICIONAIS</h3>${adicionaisHtml}` : ''
    ].filter(Boolean).join('')
    
    setContent(html)
    
    // Registrar uso no Supabase
    await supabaseService.recordTemplateUsage(template.id, currentReportId)
    
    // Recarregar histórico de uso
    const usageData = await supabaseService.getRecentTemplates(10)
    setRecentUsageData(usageData)
  }, [setContent, setModalidade, currentReportId])

  // Apply template with variables and technique selection
  const applyTemplateWithVariables = useCallback(async (
    template: Template,
    selectedTechniques: string[],
    variableValues: Record<string, any>,
    removedSections?: string[]
  ) => {
    setModalidade(template.modalidade)
    
    // Process variable substitution
    const processText = (text: string) => {
      return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const value = variableValues[varName]
        if (value !== undefined && value !== null) {
          if (typeof value === 'number') {
            return value.toLocaleString('pt-BR', { 
              minimumFractionDigits: 1,
              maximumFractionDigits: 1 
            })
          }
          return value.toString()
        }
        return match
      })
    }
    
    const removed = removedSections || []
    
    // Título centralizado e em maiúsculas
    const tituloHtml = removed.includes('titulo') 
      ? '' 
      : `<h2 style="text-align: center; text-transform: uppercase;">${template.titulo}</h2>`
    
    // Técnica - combine selected techniques
    let tecnicaHtml = ''
    if (!removed.includes('tecnica')) {
      if (selectedTechniques.length > 0) {
        const combinedTecnica = selectedTechniques
          .map(tech => template.conteudo.tecnica[tech])
          .filter(Boolean)
          .map(text => processText(text))
          .join(' ')
        if (combinedTecnica) {
          tecnicaHtml = `<h3 style="text-transform: uppercase;">TÉCNICA</h3>${dividirEmSentencas(combinedTecnica)}`
        }
      } else {
        tecnicaHtml = formatarTecnica(template.conteudo.tecnica)
      }
    }
    
    // Achados - process variables
    let achadosHtml = ''
    if (!removed.includes('achados')) {
      const achadosProcessed = processText(template.conteudo.achados)
      achadosHtml = `<h3 style="text-transform: uppercase;">ACHADOS</h3>${dividirEmSentencas(achadosProcessed)}`
    }
    
    // Impressão - process variables
    let impressaoHtml = ''
    if (!removed.includes('impressao')) {
      const impressaoProcessed = processText(template.conteudo.impressao)
      impressaoHtml = `<h3 style="text-transform: uppercase;">IMPRESSÃO</h3>${dividirEmSentencas(impressaoProcessed)}`
    }
    
    // Adicionais - process variables
    let adicionaisHtml = ''
    if (!removed.includes('adicionais') && template.conteudo.adicionais) {
      adicionaisHtml = `<h3 style="text-transform: uppercase;">ADICIONAIS</h3>${dividirEmSentencas(processText(template.conteudo.adicionais))}`
    }
    
    const html = [
      tituloHtml,
      tecnicaHtml,
      achadosHtml,
      impressaoHtml,
      adicionaisHtml
    ].filter(Boolean).join('')
    
    setContent(html)
    
    // Registrar uso no Supabase
    await supabaseService.recordTemplateUsage(template.id, currentReportId)
    
    // Recarregar histórico de uso
    const usageData = await supabaseService.getRecentTemplates(10)
    setRecentUsageData(usageData)
  }, [setContent, setModalidade, currentReportId])

  // Gerenciar favoritos no Supabase
  const addToFavorites = useCallback(async (templateId: string) => {
    const success = await supabaseService.addFavoriteTemplate(templateId)
    if (success) {
      setFavorites(prev => [...prev, templateId])
    }
  }, [])

  const removeFromFavorites = useCallback(async (templateId: string) => {
    const success = await supabaseService.removeFavoriteTemplate(templateId)
    if (success) {
      setFavorites(prev => prev.filter(id => id !== templateId))
    }
  }, [])

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
    selectedCategoria,
    selectedVariableFilter,
    setSearchTerm,
    setSelectedModality,
    setSelectedCategoria,
    setSelectedVariableFilter,
    loadTemplates,
    applyTemplate,
    applyTemplateWithVariables,
    needsVariableInput,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }
}
