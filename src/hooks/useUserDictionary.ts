import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useUserDictionary() {
  const { user } = useAuth()
  const [words, setWords] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const loadWords = useCallback(async () => {
    if (!user) {
      setWords(new Set())
      setLoading(false)
      return
    }
    
    const { data, error } = await supabase
      .from('user_dictionary')
      .select('word')
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Erro ao carregar dicionário:', error)
      setLoading(false)
      return
    }
    
    setWords(new Set(data.map(d => d.word.toLowerCase())))
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadWords()
  }, [loadWords])

  const addWord = useCallback(async (word: string): Promise<boolean> => {
    if (!user) {
      toast.error('Faça login para adicionar palavras ao dicionário')
      return false
    }
    
    const normalized = word.toLowerCase().trim()
    if (!normalized) return false
    
    const { error } = await supabase
      .from('user_dictionary')
      .insert({ user_id: user.id, word: normalized })
    
    if (error) {
      if (error.code === '23505') {
        toast.info('Palavra já existe no seu dicionário')
      } else {
        console.error('Erro ao adicionar palavra:', error)
        toast.error('Erro ao adicionar palavra')
      }
      return false
    }
    
    setWords(prev => new Set([...prev, normalized]))
    toast.success(`"${word}" adicionado ao dicionário`)
    return true
  }, [user])

  const removeWord = useCallback(async (word: string): Promise<boolean> => {
    if (!user) return false
    
    const normalized = word.toLowerCase().trim()
    
    const { error } = await supabase
      .from('user_dictionary')
      .delete()
      .eq('user_id', user.id)
      .eq('word', normalized)
    
    if (error) {
      console.error('Erro ao remover palavra:', error)
      toast.error('Erro ao remover palavra')
      return false
    }
    
    setWords(prev => {
      const next = new Set(prev)
      next.delete(normalized)
      return next
    })
    toast.success(`"${word}" removido do dicionário`)
    return true
  }, [user])

  const hasWord = useCallback((word: string): boolean => {
    return words.has(word.toLowerCase())
  }, [words])

  return {
    words,
    loading,
    addWord,
    removeWord,
    hasWord,
    reload: loadWords
  }
}
