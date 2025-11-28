import { useCallback } from 'react'
import { VariableValues } from '@/types/fraseVariables'

export function useVariableProcessor() {
  // Função para extrair variáveis do texto
  const extractVariables = useCallback((texto: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g
    const matches = [...texto.matchAll(regex)]
    return matches.map(m => m[1])
  }, [])
  
  // Função para verificar se texto tem variáveis
  const hasVariables = useCallback((texto: string): boolean => {
    return /\{\{.+?\}\}/.test(texto)
  }, [])
  
  // Função para substituir variáveis pelos valores
  const processText = useCallback((texto: string, values: VariableValues): string => {
    return texto.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const value = values[varName]
      return value !== undefined && value !== null ? value.toString() : match
    })
  }, [])
  
  return { extractVariables, hasVariables, processText }
}
