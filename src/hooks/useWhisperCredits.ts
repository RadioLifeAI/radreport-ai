import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface UseWhisperCreditsReturn {
  balance: number
  isLoading: boolean
  error: string | null
  hasEnoughCredits: boolean
  checkQuota: (creditsNeeded: number) => boolean
  refreshBalance: () => Promise<void>
}

export function useWhisperCredits(): UseWhisperCreditsReturn {
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Usuário não autenticado')
        setBalance(0)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('user_whisper_balance')
        .select('balance')
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No balance record exists, create one with 0 credits
          const { error: insertError } = await supabase
            .from('user_whisper_balance')
            .insert({ user_id: user.id, balance: 0 })

          if (insertError) {
            console.error('Error creating balance record:', insertError)
            setError('Erro ao criar registro de saldo')
          }
          setBalance(0)
        } else {
          console.error('Error fetching balance:', fetchError)
          setError('Erro ao buscar saldo de créditos')
          setBalance(0)
        }
        return
      }

      setBalance(data?.balance ?? 0)
    } catch (err) {
      console.error('Error in fetchBalance:', err)
      setError('Erro ao buscar saldo de créditos')
      setBalance(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshBalance = useCallback(async () => {
    await fetchBalance()
  }, [fetchBalance])

  const checkQuota = useCallback((creditsNeeded: number): boolean => {
    return balance >= creditsNeeded
  }, [balance])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balance,
    isLoading,
    error,
    hasEnoughCredits: balance > 0,
    checkQuota,
    refreshBalance,
  }
}
