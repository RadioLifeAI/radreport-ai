import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabaseService } from '../services/SupabaseService'

export interface FraseModelo {
  id: string
  codigo: string
  titulo: string
  frase: string
  conclusao: string
  categoria: string
  tags: string[]
  sinônimos: string[]
  ativa: boolean
  modalidade_id?: string
  regiao_anatomica_id?: string
  estrutura_anatomica_id?: string
  tipo_template_id?: string
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
  const [recentFrases, setRecentFrases] = useState<FraseModelo[]>([])
  const [favoriteFrases, setFavoriteFrases] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedModality, setSelectedModality] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [modalities, setModalities] = useState<string[]>([])

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('radreport.frases_modelo.favorites')
      if (saved) {
        setFavoriteFrases(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading frases_modelo favorites:', error)
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = useCallback((favorites: string[]) => {
    try {
      localStorage.setItem('radreport.frases_modelo.favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving frases_modelo favorites:', error)
    }
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
        modalidade_id: item.modalidade_codigo || '', // Usar modalidade_codigo
        regiao_anatomica_id: item.regiao_anatomica_id || null,
        estrutura_anatomica_id: item.estrutura_anatomica_id || null,
        tipo_template_id: item.tipo_template_id || null,
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

  // Add to favorites
  const addToFavorites = useCallback((fraseId: string) => {
    const newFavorites = [...favoriteFrases, fraseId]
    setFavoriteFrases(newFavorites)
    saveFavorites(newFavorites)
  }, [favoriteFrases, saveFavorites])

  // Remove from favorites
  const removeFromFavorites = useCallback((fraseId: string) => {
    const newFavorites = favoriteFrases.filter(id => id !== fraseId)
    setFavoriteFrases(newFavorites)
    saveFavorites(newFavorites)
  }, [favoriteFrases, saveFavorites])

  // Apply frase (add to recent)
  const applyFrase = useCallback((frase: FraseModelo) => {
    // Add to recent (move to front)
    const newRecent = [frase, ...recentFrases.filter(f => f.id !== frase.id)].slice(0, 5)
    setRecentFrases(newRecent)
    
    // Return the frase text to be inserted
    return frase.frase
  }, [recentFrases])

  // Load frases on mount
  useEffect(() => {
    fetchFrases()
  }, [fetchFrases])

  return {
    frases,
    filteredFrases,
    recentFrases,
    favoriteFrases,
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
    filteredFrasesForDisplay: serverResults.length || searchTerm.trim() ? serverResults : filteredFrases
  }
}
