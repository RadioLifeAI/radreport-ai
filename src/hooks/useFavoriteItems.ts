import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useFavoriteCalculators() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setFavorites([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_favorite_calculators')
        .select('calculator_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error loading favorite calculators:', error)
        setFavorites([])
      } else {
        setFavorites(data?.map(item => item.calculator_id) || [])
      }
    } catch (error) {
      console.error('Error loading favorite calculators:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = useCallback((calculatorId: string) => {
    return favorites.includes(calculatorId)
  }, [favorites])

  const toggleFavorite = useCallback(async (calculatorId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (isFavorite(calculatorId)) {
        // Remove
        const { error } = await supabase
          .from('user_favorite_calculators')
          .delete()
          .eq('user_id', user.id)
          .eq('calculator_id', calculatorId)

        if (error) throw error
        setFavorites(prev => prev.filter(id => id !== calculatorId))
      } else {
        // Add
        const { error } = await supabase
          .from('user_favorite_calculators')
          .insert({ user_id: user.id, calculator_id: calculatorId })

        if (error) throw error
        setFavorites(prev => [...prev, calculatorId])
      }
    } catch (error) {
      console.error('Error toggling calculator favorite:', error)
    }
  }, [isFavorite])

  return { favorites, isFavorite, toggleFavorite, loading }
}

export function useFavoriteTables() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setFavorites([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_favorite_tables')
        .select('table_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error loading favorite tables:', error)
        setFavorites([])
      } else {
        setFavorites(data?.map(item => item.table_id) || [])
      }
    } catch (error) {
      console.error('Error loading favorite tables:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = useCallback((tableId: string) => {
    return favorites.includes(tableId)
  }, [favorites])

  const toggleFavorite = useCallback(async (tableId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (isFavorite(tableId)) {
        // Remove
        const { error } = await supabase
          .from('user_favorite_tables')
          .delete()
          .eq('user_id', user.id)
          .eq('table_id', tableId)

        if (error) throw error
        setFavorites(prev => prev.filter(id => id !== tableId))
      } else {
        // Add
        const { error } = await supabase
          .from('user_favorite_tables')
          .insert({ user_id: user.id, table_id: tableId })

        if (error) throw error
        setFavorites(prev => [...prev, tableId])
      }
    } catch (error) {
      console.error('Error toggling table favorite:', error)
    }
  }, [isFavorite])

  return { favorites, isFavorite, toggleFavorite, loading }
}
