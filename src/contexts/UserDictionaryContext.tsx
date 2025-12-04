import { createContext, useContext, ReactNode } from 'react'
import { useUserDictionary } from '@/hooks/useUserDictionary'

interface UserDictionaryContextType {
  words: Set<string>
  addWord: (word: string) => Promise<boolean>
  removeWord: (word: string) => Promise<boolean>
  hasWord: (word: string) => boolean
  loading: boolean
}

const UserDictionaryContext = createContext<UserDictionaryContextType | null>(null)

export function UserDictionaryProvider({ children }: { children: ReactNode }) {
  const dictionary = useUserDictionary()
  
  return (
    <UserDictionaryContext.Provider value={dictionary}>
      {children}
    </UserDictionaryContext.Provider>
  )
}

export function useUserDictionaryContext() {
  const context = useContext(UserDictionaryContext)
  if (!context) {
    // Return a default context for non-authenticated or outside provider usage
    return {
      words: new Set<string>(),
      addWord: async () => false,
      removeWord: async () => false,
      hasWord: () => false,
      loading: false
    }
  }
  return context
}
