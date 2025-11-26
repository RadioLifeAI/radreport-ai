import { useState, useEffect, useCallback, useMemo } from 'react'
import { dataService } from '../services/DataService'
import { supabaseService } from '../services/SupabaseService'

export interface Macro {
  id: string
  titulo: string
  frase: string
  categoria: string
  ativo: boolean
}

export function useMacros() {
  const [macros, setMacros] = useState<Macro[]>([])
  const [filteredMacros, setFilteredMacros] = useState<Macro[]>([])
  const [recentMacros, setRecentMacros] = useState<Macro[]>([])
  const [favoriteMacros, setFavoriteMacros] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('radreport.macro.favorites')
      if (saved) {
        setFavoriteMacros(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading macro favorites:', error)
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = useCallback((favorites: string[]) => {
    try {
      localStorage.setItem('radreport.macro.favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving macro favorites:', error)
    }
  }, [])

  // Fetch macros from Supabase
  const fetchMacros = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Try to get macros from Supabase
      const { data, error: supabaseError } = await supabaseService.getMacros()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (data && data.length > 0) {
        const activeMacros = data.filter(macro => macro.ativo !== false)
        setMacros(activeMacros)
        setFilteredMacros(activeMacros)
        
        // Set recent macros (last 5)
        setRecentMacros(activeMacros.slice(0, 5))
        
        // Extract unique categories
        const uniqueCategories = [...new Set(activeMacros.map(macro => macro.categoria))].filter(Boolean)
        setCategories(uniqueCategories)
      } else {
        // Fallback: create some default macros if none exist
        const defaultMacros: Macro[] = [
          {
            id: '1',
            titulo: 'Exame realizado sem intercorrências',
            frase: 'Exame realizado sem intercorrências, com boa tolerância ao contraste.', 
            categoria: 'Geral',
            ativo: true
          },
          {
            id: '2',
            titulo: 'Ausência de alterações significativas',
            frase: 'Não foram observadas alterações significativas em relação ao exame anterior.',
            categoria: 'Geral',
            ativo: true
          },
          {
            id: '3',
            titulo: 'Contraste administrado',
            frase: 'Contraste iodado não-iônico administrado por via endovenosa sem complicações.',
            categoria: 'Contraste',
            ativo: true
          },
          {
            id: '4',
            titulo: 'Qualidade técnica adequada',
            frase: 'Qualidade técnica do exame considerada adequada para análise diagnóstica.',
            categoria: 'Técnica',
            ativo: true
          }
        ]
        
        setMacros(defaultMacros)
        setFilteredMacros(defaultMacros)
        setRecentMacros(defaultMacros.slice(0, 5))
        setCategories(['Geral', 'Contraste', 'Técnica'])
      }
    } catch (error) {
      console.error('Error fetching macros:', error)
      setError('Erro ao carregar frases')
      
      // Fallback on error
      const defaultMacros: Macro[] = [
        {
          id: '1',
          titulo: 'Exame realizado sem intercorrências',
          frase: 'Exame realizado sem intercorrências, com boa tolerância ao contraste.', 
          categoria: 'Geral',
          ativo: true
        },
        {
          id: '2',
          titulo: 'Ausência de alterações significativas',
          frase: 'Não foram observadas alterações significativas em relação ao exame anterior.',
          categoria: 'Geral',
          ativo: true
        }
      ]
      
      setMacros(defaultMacros)
      setFilteredMacros(defaultMacros)
      setRecentMacros(defaultMacros.slice(0, 5))
      setCategories(['Geral'])
    } finally {
      setLoading(false)
    }
  }, [])

  // Filter macros based on search term and category
  useEffect(() => {
    let filtered = macros
    
    if (searchTerm) {
      filtered = filtered.filter(macro =>
        macro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        macro.frase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        macro.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(macro => macro.categoria === selectedCategory)
    }
    
    setFilteredMacros(filtered)
  }, [macros, searchTerm, selectedCategory])

  // Add to favorites
  const addToFavorites = useCallback((macroId: string) => {
    const newFavorites = [...favoriteMacros, macroId]
    setFavoriteMacros(newFavorites)
    saveFavorites(newFavorites)
  }, [favoriteMacros, saveFavorites])

  // Remove from favorites
  const removeFromFavorites = useCallback((macroId: string) => {
    const newFavorites = favoriteMacros.filter(id => id !== macroId)
    setFavoriteMacros(newFavorites)
    saveFavorites(newFavorites)
  }, [favoriteMacros, saveFavorites])

  // Check if macro is favorite
  const isFavorite = useCallback((macroId: string) => {
    return favoriteMacros.includes(macroId)
  }, [favoriteMacros])

  // Apply macro to editor
  const applyMacro = useCallback((macro: Macro) => {
    // Add to recent (move to front)
    const newRecent = [macro, ...recentMacros.filter(m => m.id !== macro.id)].slice(0, 5)
    setRecentMacros(newRecent)
    
    // Return the macro phrase to be inserted
    return macro.frase
  }, [recentMacros])

  // Load macros on mount
  useEffect(() => {
    fetchMacros()
  }, [fetchMacros])

  return {
    macros,
    filteredMacros,
    recentMacros,
    favoriteMacros,
    loading,
    error,
    searchTerm,
    selectedCategory,
    categories,
    setSearchTerm,
    setSelectedCategory,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    applyMacro,
    fetchMacros
  }
}