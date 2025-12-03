import { useState, useEffect, useCallback } from 'react'
import { supabaseService } from '@/services/SupabaseService'
import { useAuth } from './useAuth'

export function useFavoriteCalculators() {
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
      const data = await supabaseService.getUserFavoriteCalculators()
      setFavorites(data)
    } catch (error) {
      console.error('Error loading favorite calculators:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorite = useCallback((calculatorId: string) => {
    return favorites.includes(calculatorId)
  }, [favorites])

  const toggleFavorite = useCallback(async (calculatorId: string) => {
    if (!user) return false

    const isCurrentlyFavorite = favorites.includes(calculatorId)
    
    // Optimistic update
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(id => id !== calculatorId))
    } else {
      setFavorites(prev => [...prev, calculatorId])
    }

    try {
      const success = isCurrentlyFavorite
        ? await supabaseService.removeFavoriteCalculator(calculatorId)
        : await supabaseService.addFavoriteCalculator(calculatorId)

      if (!success) {
        // Revert on failure
        if (isCurrentlyFavorite) {
          setFavorites(prev => [...prev, calculatorId])
        } else {
          setFavorites(prev => prev.filter(id => id !== calculatorId))
        }
      }
      
      return success
    } catch (error) {
      // Revert on error
      if (isCurrentlyFavorite) {
        setFavorites(prev => [...prev, calculatorId])
      } else {
        setFavorites(prev => prev.filter(id => id !== calculatorId))
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
