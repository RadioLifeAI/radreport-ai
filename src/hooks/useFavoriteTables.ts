import { useState, useEffect, useCallback } from 'react'
import { supabaseService } from '@/services/SupabaseService'
import { useAuth } from './useAuth'

export function useFavoriteTables() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      return
    }
    
    setIsLoading(true)
    try {
      const data = await supabaseService.getUserFavoriteTables()
      setFavorites(data)
    } catch (error) {
      console.error('Error loading favorite tables:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorite = useCallback((tableId: string) => {
    return favorites.includes(tableId)
  }, [favorites])

  const toggleFavorite = useCallback(async (tableId: string) => {
    if (!user) return false

    const isCurrentlyFavorite = favorites.includes(tableId)
    
    // Optimistic update
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(id => id !== tableId))
    } else {
      setFavorites(prev => [...prev, tableId])
    }

    try {
      const success = isCurrentlyFavorite
        ? await supabaseService.removeFavoriteTable(tableId)
        : await supabaseService.addFavoriteTable(tableId)

      if (!success) {
        // Revert on failure
        if (isCurrentlyFavorite) {
          setFavorites(prev => [...prev, tableId])
        } else {
          setFavorites(prev => prev.filter(id => id !== tableId))
        }
      }
      
      return success
    } catch (error) {
      // Revert on error
      if (isCurrentlyFavorite) {
        setFavorites(prev => [...prev, tableId])
      } else {
        setFavorites(prev => prev.filter(id => id !== tableId))
      }
      return false
    }
  }, [user, favorites])

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites
  }
}
