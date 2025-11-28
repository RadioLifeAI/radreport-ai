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
  
  // Formata valor para exibição (números com vírgula decimal, sempre 1 casa)
  const formatValue = useCallback((value: string | number | boolean): string => {
    if (typeof value === 'number') {
      // Padrão brasileiro: vírgula como separador, sempre 1 casa decimal
      return value.toLocaleString('pt-BR', { 
        minimumFractionDigits: 1,
        maximumFractionDigits: 1 
      })
    }
    return value.toString()
  }, [])

  // Função para substituir variáveis pelos valores
  const processText = useCallback((texto: string, values: VariableValues): string => {
    return texto.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const value = values[varName]
      return value !== undefined && value !== null ? formatValue(value) : match
    })
  }, [formatValue])
  
  return { extractVariables, hasVariables, processText, formatValue }
}
