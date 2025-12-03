import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabaseService } from '@/services/SupabaseService'
import { useAuth } from './useAuth'
import { RADIOLOGY_TABLES, RadiologyTable } from '@/lib/radiologyTables'

export function useFavoriteTables() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [usageData, setUsageData] = useState<Array<{table_id: string, usage_count: number}>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Get all tables flat
  const allTables = useMemo(() => {
    return RADIOLOGY_TABLES.flatMap(category => category.tables)
  }, [])

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setUsageData([])
      return
    }
    
    setIsLoading(true)
    try {
      const data = await supabaseService.getUserFavoriteTables()
      setFavorites(data)
      
      // Load usage data for favorites
      if (data.length > 0) {
        const usage = await supabaseService.getMostUsedFavoriteTables(data)
        setUsageData(usage)
      }
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

  const recordUsage = useCallback(async (tableId: string) => {
    if (!user) return
    await supabaseService.recordTableUsage(tableId)
    
    // Update local usage data
    setUsageData(prev => {
      const existing = prev.find(u => u.table_id === tableId)
      if (existing) {
        return prev.map(u => 
          u.table_id === tableId 
            ? { ...u, usage_count: u.usage_count + 1 }
            : u
        ).sort((a, b) => b.usage_count - a.usage_count)
      } else {
        return [...prev, { table_id: tableId, usage_count: 1 }]
      }
    })
  }, [user])

  // Get favorite tables sorted by usage
  const favoriteTables = useMemo((): RadiologyTable[] => {
    const favTables = allTables.filter(table => favorites.includes(table.id))
    
    // Sort by usage count
    return favTables.sort((a, b) => {
      const usageA = usageData.find(u => u.table_id === a.id)?.usage_count || 0
      const usageB = usageData.find(u => u.table_id === b.id)?.usage_count || 0
      return usageB - usageA
    })
  }, [favorites, usageData, allTables])

  // Top 5 most used favorites for sidebar
  const topFavoriteTables = useMemo((): RadiologyTable[] => {
    return favoriteTables.slice(0, 5)
  }, [favoriteTables])

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites,
    recordUsage,
    favoriteTables,
    topFavoriteTables
  }
}
