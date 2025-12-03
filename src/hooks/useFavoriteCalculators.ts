import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabaseService } from '@/services/SupabaseService'
import { useAuth } from './useAuth'
import { radiologyCalculators, RadiologyCalculator } from '@/lib/radiologyCalculators'

export function useFavoriteCalculators() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [usageData, setUsageData] = useState<Array<{calculator_id: string, usage_count: number}>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setUsageData([])
      return
    }
    
    setIsLoading(true)
    try {
      const data = await supabaseService.getUserFavoriteCalculators()
      setFavorites(data)
      
      // Load usage data for favorites
      if (data.length > 0) {
        const usage = await supabaseService.getMostUsedFavoriteCalculators(data)
        setUsageData(usage)
      }
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

  const recordUsage = useCallback(async (calculatorId: string) => {
    if (!user) return
    await supabaseService.recordCalculatorUsage(calculatorId)
    
    // Update local usage data
    setUsageData(prev => {
      const existing = prev.find(u => u.calculator_id === calculatorId)
      if (existing) {
        return prev.map(u => 
          u.calculator_id === calculatorId 
            ? { ...u, usage_count: u.usage_count + 1 }
            : u
        ).sort((a, b) => b.usage_count - a.usage_count)
      } else {
        return [...prev, { calculator_id: calculatorId, usage_count: 1 }]
      }
    })
  }, [user])

  // Get favorite calculators sorted by usage
  const favoriteCalculators = useMemo((): RadiologyCalculator[] => {
    const favCalcs = radiologyCalculators.filter(calc => favorites.includes(calc.id))
    
    // Sort by usage count
    return favCalcs.sort((a, b) => {
      const usageA = usageData.find(u => u.calculator_id === a.id)?.usage_count || 0
      const usageB = usageData.find(u => u.calculator_id === b.id)?.usage_count || 0
      return usageB - usageA
    })
  }, [favorites, usageData])

  // Top 5 most used favorites for sidebar
  const topFavoriteCalculators = useMemo((): RadiologyCalculator[] => {
    return favoriteCalculators.slice(0, 5)
  }, [favoriteCalculators])

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites,
    recordUsage,
    favoriteCalculators,
    topFavoriteCalculators
  }
}
