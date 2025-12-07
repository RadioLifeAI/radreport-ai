import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabaseService } from '../services/SupabaseService'
import { FraseVariable } from '@/types/fraseVariables'

export interface FraseModelo {
  id: string
  codigo: string
  titulo: string
  frase: string
  conclusao: string
  observacao?: string
  categoria: string
  tags: string[]
  sinônimos: string[]
  ativa: boolean
  modalidade_id?: string
  regiao_anatomica_id?: string
  estrutura_anatomica_id?: string
  tipo_template_id?: string
  variaveis?: FraseVariable[]
  condicoes_logicas?: any[]
}

// Opções padrão para variáveis de seleção comuns
const defaultSelectOptions: Record<string, string[]> = {
  'lado': ['direito', 'esquerdo', 'bilateral'],
  'posicao': ['superior', 'inferior', 'medial', 'lateral', 'central'],
  'grau': ['leve', 'moderado', 'acentuado', 'grave'],
  'segmento': ['I', 'II', 'III', 'IVa', 'IVb', 'V', 'VI', 'VII', 'VIII'],
  'morfologia': ['fusiforme', 'sacular', 'irregular'],
  'calcificacao': ['leves', 'moderadas', 'grosseiras'],
  'lobo': ['direito', 'esquerdo', 'caudado'],
  'localizacao': ['proximal', 'medial', 'distal'],
  'aspecto': ['homogêneo', 'heterogêneo'],
  'contorno': ['regular', 'irregular', 'lobulado'],
}

// Formatar nome da variável para exibição
function formatarNomeVariavel(nome: string): string {
  return nome
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/ Cm$/i, ' (cm)')
    .replace(/ Mm$/i, ' (mm)')
    .replace(/ Percent$/i, ' (%)')
    .replace(/ Hu$/i, ' (HU)')
    .replace(/ Ml$/i, ' (ml)')
}

// Inferir unidade pelo nome
function inferirUnidade(nome: string): string | undefined {
  const nomeLC = nome.toLowerCase()
  if (nomeLC.includes('_cm') || nomeLC.endsWith('cm')) return 'cm'
  if (nomeLC.includes('_mm') || nomeLC.endsWith('mm')) return 'mm'
  if (nomeLC.includes('_percent') || nomeLC.includes('percentual')) return '%'
  if (nomeLC.includes('hu') || nomeLC.includes('hounsfield')) return 'HU'
  if (nomeLC.includes('_ml') || nomeLC.endsWith('ml')) return 'ml'
  if (nomeLC.includes('_g') || nomeLC.endsWith('_g')) return 'g'
  return undefined
}

// Inferir tipo pelo nome da variável
function inferirTipo(nome: string): 'texto' | 'numero' | 'select' | 'boolean' {
  const nomeLC = nome.toLowerCase()
  
  // Padrões numéricos
  if (nomeLC.includes('_cm') || nomeLC.includes('_mm') || 
      nomeLC.includes('medida') || nomeLC.includes('diametro') ||
      nomeLC.includes('tamanho') || nomeLC.includes('volume') ||
      nomeLC.includes('espessura') || nomeLC.includes('calibre') ||
      nomeLC.includes('_percent') || nomeLC.includes('quantidade') ||
      nomeLC.includes('extensao') || nomeLC.includes('comprimento') ||
      nomeLC.includes('largura') || nomeLC.includes('altura') ||
      /^(ap|t|ll|cc)$/i.test(nome)) {
    return 'numero'
  }
  
  // Padrões de seleção
  if (nomeLC.includes('lado') || nomeLC.includes('posicao') ||
      nomeLC.includes('grau') || nomeLC.includes('tipo') ||
      nomeLC.includes('segmento') || nomeLC.includes('morfologia') ||
      nomeLC.includes('calcificacao') || nomeLC.includes('lobo') ||
      nomeLC.includes('localizacao') || nomeLC.includes('aspecto') ||
      nomeLC.includes('contorno')) {
    return 'select'
  }
  
  return 'texto'
}

// Extrair variáveis do texto quando não há metadados
function extractVariablesFromText(texto: string, conclusao?: string): FraseVariable[] {
  const regex = /\{\{(\w+)\}\}/g
  const allText = texto + (conclusao || '')
  const matches = [...allText.matchAll(regex)]
  const uniqueNames = [...new Set(matches.map(m => m[1]))]
  
  return uniqueNames.map(nome => ({
    nome,
    tipo: inferirTipo(nome),
    descricao: formatarNomeVariavel(nome),
    obrigatorio: true,
    unidade: inferirUnidade(nome)
  }))
}

// Normalizar uma única variável
function normalizeVariable(v: any): FraseVariable {
  // Normalizar tipo (inglês → português)
  const tipoMap: Record<string, string> = {
    'number': 'numero',
    'text': 'texto',
    'string': 'texto',
    'numero': 'numero',
    'texto': 'texto',
    'select': 'select',
    'boolean': 'boolean'
  }
  
  const tipoNormalizado = tipoMap[v.tipo?.toLowerCase()] || v.tipo || inferirTipo(v.nome)
  
  // Normalizar min/max
  const minimo = v.minimo ?? v.valor_min ?? v.min ?? undefined
  const maximo = v.maximo ?? v.valor_max ?? v.max ?? undefined
  
  // Normalizar opções
  let opcoes = v.opcoes || []
  
  // Se for select e não tem opções, tentar pegar opções padrão
  if (tipoNormalizado === 'select' && opcoes.length === 0) {
    const nomeLC = v.nome.toLowerCase()
    for (const [key, defaultOpts] of Object.entries(defaultSelectOptions)) {
      if (nomeLC.includes(key)) {
        opcoes = defaultOpts
        break
      }
    }
  }
  
  return {
    nome: v.nome,
    tipo: tipoNormalizado as 'texto' | 'numero' | 'select' | 'boolean',
    descricao: v.descricao || formatarNomeVariavel(v.nome),
    opcoes,
    valor_padrao: v.valor_padrao ?? v.default ?? undefined,
    obrigatorio: v.obrigatorio ?? false,
    unidade: v.unidade || inferirUnidade(v.nome),
    minimo,
    maximo
  }
}

// Função principal para normalizar variáveis de diferentes formatos
function normalizeVariables(rawVariaveis: any, texto: string, conclusao?: string): FraseVariable[] {
  if (!rawVariaveis) {
    // Extrair variáveis do texto se não há metadados
    return extractVariablesFromText(texto, conclusao)
  }
  
  let variablesArray: any[] = []
  
  // Formato 1 e 3: Array
  if (Array.isArray(rawVariaveis)) {
    variablesArray = rawVariaveis
  }
  // Formato 2: Objeto com chaves como nomes
  else if (typeof rawVariaveis === 'object') {
    variablesArray = Object.entries(rawVariaveis).map(([nome, config]: [string, any]) => ({
      nome,
      ...(typeof config === 'object' ? config : { tipo: 'texto' })
    }))
  }
  
  // Normalizar cada variável
  return variablesArray
    .filter(v => v && v.nome) // Filtrar entradas inválidas
    .map(v => normalizeVariable(v))
}

// Helper function to extract title from codigo
function extractTituloFromCodigo(codigo: string): string {
  if (!codigo) return ''
  
  // USG_ABD_FIG_EST_LEVE_001 -> Esteatose Leve
  const parts = codigo.split('_')
  if (parts.length >= 4) {
    const tipo = parts[parts.length - 2] // EST
    const grau = parts[parts.length - 1] // LEVE
    
    if (tipo === 'EST' && grau === 'LEVE') return 'Esteatose Leve'
    if (tipo === 'EST' && grau === 'MOD') return 'Esteatose Moderada'
    if (tipo === 'EST' && grau === 'GRA') return 'Esteatose Grave'
    if (tipo === 'FIG' && grau === 'NORMAL') return 'Fígado Normal'
  }
  
  return ''
}

export function useFrasesModelo() {
  const [frases, setFrases] = useState<FraseModelo[]>([])
  const [serverResults, setServerResults] = useState<FraseModelo[]>([])
  const [filteredFrases, setFilteredFrases] = useState<FraseModelo[]>([])
  const [recentUsageData, setRecentUsageData] = useState<Array<{frase_id: string, used_at: string, usage_count: number}>>([])
  const [favoriteFrases, setFavoriteFrases] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedModality, setSelectedModality] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [modalities, setModalities] = useState<string[]>([])

  // Load favorites from Supabase
  useEffect(() => {
    const loadFavorites = async () => {
      const favoriteIds = await supabaseService.getUserFavoriteFrases()
      setFavoriteFrases(favoriteIds)
    }
    loadFavorites()
  }, [])

  // Load recent usage from Supabase
  useEffect(() => {
    const loadRecentUsage = async () => {
      const usageData = await supabaseService.getRecentFrases(10)
      setRecentUsageData(usageData)
    }
    loadRecentUsage()
  }, [])

  // Fetch frases from Supabase
  const fetchFrases = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await supabaseService.getFrasesModelo()
      
      // Transform data to match FraseModelo interface
      const transformedFrases: FraseModelo[] = data.map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        titulo: extractTituloFromCodigo(item.codigo) || item.categoria || '',
        frase: item.texto || '',
        conclusao: item.conclusao || '',
        categoria: item.categoria || '',
        tags: item.tags || [],
        sinônimos: item.sinônimos || [],
        ativa: item.ativa !== false,
        modalidade_id: item.modalidade_codigo || '',
        regiao_anatomica_id: item.regiao_anatomica_id || null,
        estrutura_anatomica_id: item.estrutura_anatomica_id || null,
        tipo_template_id: item.tipo_template_id || null,
        variaveis: normalizeVariables(item.variaveis, item.texto, item.conclusao),
        condicoes_logicas: item.condicoes_logicas || [],
      }))
      
      setFrases(transformedFrases)
      
      // Log para verificar os dados
      console.log('Frases carregadas:', transformedFrases.slice(0, 3))
      
      // Extract unique categories
      const uniqueCategories = [...new Set(transformedFrases.map(frase => frase.categoria))].sort()
      setCategories(uniqueCategories)
      
      // Extract unique modalities from modalidade_id
      const uniqueModalities = ['RM', 'TC', 'USG', 'RX', 'MG']
      setModalities(uniqueModalities)
      
    } catch (err) {
      console.error('Error fetching frases_modelo:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar frases')
    } finally {
      setLoading(false)
    }
  }, [])

  // Filter frases based on search term, category and modality
  useEffect(() => {
    let filtered = frases
    
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      filtered = filtered.filter(frase => {
        const titulo = (frase.titulo || '').toLowerCase()
        const texto = (frase.frase || '').toLowerCase()
        const categoria = (frase.categoria || '').toLowerCase()
        const tagsArr = Array.isArray(frase.tags) ? frase.tags : []
        const sinsArr = Array.isArray(frase.sinônimos) ? frase.sinônimos : []
        return (
          titulo.includes(s) ||
          texto.includes(s) ||
          categoria.includes(s) ||
          tagsArr.some(tag => (tag || '').toLowerCase().includes(s)) ||
          sinsArr.some(sin => (sin || '').toLowerCase().includes(s))
        )
      })
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(frase => (frase.categoria || '') === selectedCategory)
    }
    
    if (selectedModality) {
      filtered = filtered.filter(frase => {
        if (!frase.modalidade_id) return false
        // modalidade_id agora contém o código direto (US, TC, RM, RX, MM)
        const modalityMap = {
          'US': 'USG',
          'TC': 'TC', 
          'RM': 'RM',
          'RX': 'RX',
          'MM': 'MG'
        }
        const modalityCode = modalityMap[frase.modalidade_id as keyof typeof modalityMap] || ''
        return modalityCode === selectedModality
      })
    }
    
    setFilteredFrases(filtered)
  }, [searchTerm, selectedCategory, selectedModality, frases])

  // Server-side search with debounce (semantic-ready)
  useEffect(() => {
    const term = searchTerm.trim()
    if (!term) {
      setServerResults([])
      return
    }
    let cancelled = false
    const h = setTimeout(async () => {
      try {
        const raw = await supabaseService.searchFrasesModelo(term)
        const mapped: FraseModelo[] = raw.map((item: any) => ({
          id: item.id,
          codigo: item.codigo,
          titulo: extractTituloFromCodigo(item.codigo) || item.categoria || '',
          frase: item.texto || '',
          conclusao: item.conclusao || '',
          categoria: item.categoria || '',
          tags: item.tags || [],
          sinônimos: item.sinônimos || [],
          ativa: item.ativa !== false,
          modalidade_id: item.modalidade_codigo || '',
          regiao_anatomica_id: item.regiao_anatomica_id || null,
          estrutura_anatomica_id: item.estrutura_anatomica_id || null,
          tipo_template_id: item.tipo_template_id || null,
          variaveis: normalizeVariables(item.variaveis, item.texto, item.conclusao),
          condicoes_logicas: item.condicoes_logicas || [],
        }))
        // Simple ranking: título match > começa > contém
        const s = term.toLowerCase()
        const score = (f: FraseModelo) => {
          const titulo = (f.titulo || '').toLowerCase()
          const texto = (f.frase || '').toLowerCase()
          const cod = (f.codigo || '').toLowerCase()
          const cat = (f.categoria || '').toLowerCase()
          const concl = (f.conclusao || '').toLowerCase()
          const tagsArr = Array.isArray(f.tags) ? f.tags.map(t => (t || '').toLowerCase()) : []
          const sinsArr = Array.isArray(f.sinônimos) ? f.sinônimos.map(t => (t || '').toLowerCase()) : []
          let p = 0
          if (titulo === s) p += 3
          else if (titulo.startsWith(s)) p += 2
          else if (titulo.includes(s)) p += 1
          if (texto.includes(s)) p += 1.5
          if (cod.includes(s)) p += 1
          if (cat.includes(s)) p += 0.5
          if (concl.includes(s)) p += 1
          if (tagsArr.includes(s)) p += 2
          if (sinsArr.includes(s)) p += 2
          return p
        }
        const ranked = mapped.sort((a, b) => {
          const sa = score(a)
          const sb = score(b)
          if (sa !== sb) return sb - sa
          return (a.titulo || '').localeCompare(b.titulo || '')
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
  }, [searchTerm, selectedCategory, selectedModality])

  // Check if a frase is favorite
  const isFavorite = useCallback((fraseId: string) => {
    return favoriteFrases.includes(fraseId)
  }, [favoriteFrases])

  // Add to favorites via Supabase
  const addToFavorites = useCallback(async (fraseId: string) => {
    const success = await supabaseService.addFavoriteFrase(fraseId)
    if (success) {
      setFavoriteFrases(prev => [...prev, fraseId])
    }
  }, [])

  // Remove from favorites via Supabase
  const removeFromFavorites = useCallback(async (fraseId: string) => {
    const success = await supabaseService.removeFavoriteFrase(fraseId)
    if (success) {
      setFavoriteFrases(prev => prev.filter(id => id !== fraseId))
    }
  }, [])

  // Apply frase and record usage in Supabase
  const applyFrase = useCallback(async (frase: FraseModelo, reportId?: string) => {
    // Record usage in Supabase
    await supabaseService.recordFraseUsage(frase.id, reportId)
    
    // Reload recent usage data
    const usageData = await supabaseService.getRecentFrases(10)
    setRecentUsageData(usageData)
    
    // Return the frase text to be inserted
    return frase.frase
  }, [])

  // Compute recent frases based on usage data
  const recentFrases = useMemo(() => {
    if (recentUsageData.length === 0) return []

    const usageMap = new Map(recentUsageData.map(u => [u.frase_id, u]))
    
    return frases
      .filter(f => usageMap.has(f.id))
      .sort((a, b) => {
        const aUsage = usageMap.get(a.id)!
        const bUsage = usageMap.get(b.id)!
        return new Date(bUsage.used_at).getTime() - new Date(aUsage.used_at).getTime()
      })
      .slice(0, 10)
  }, [frases, recentUsageData])

  // Load frases on mount
  useEffect(() => {
    fetchFrases()
  }, [fetchFrases])

  // Check if frase needs variable input
  const needsFraseVariableInput = useCallback((frase: FraseModelo): boolean => {
    const hasVars = frase.variaveis && frase.variaveis.length > 0
    if (!hasVars) return false
    
    // Check if texto or conclusao contain {{placeholder}} patterns
    const placeholderRegex = /\{\{[\w_]+\}\}/
    const textoHasPlaceholders = placeholderRegex.test(frase.frase || '')
    const conclusaoHasPlaceholders = placeholderRegex.test(frase.conclusao || '')
    
    return textoHasPlaceholders || conclusaoHasPlaceholders
  }, [])

  return {
    frases,
    filteredFrases,
    recentFrases, // Now computed from recentUsageData
    favoriteFrases: frases.filter(f => favoriteFrases.includes(f.id)),
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedModality,
    setSearchTerm,
    setSelectedCategory,
    setSelectedModality,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    applyFrase,
    categories,
    modalities,
    refetch: fetchFrases,
    filteredFrasesForDisplay: serverResults.length || searchTerm.trim() ? serverResults : filteredFrases,
    needsFraseVariableInput
  }
}
