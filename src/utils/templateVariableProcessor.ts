// Template variable processing utilities
// Handles extraction and substitution of {{variable}} placeholders in templates

import { TemplateVariable, TemplateVariableValues, TemplateWithVariables, ConditionalLogic } from '@/types/templateVariables'

/**
 * Extract variable names from text with {{variable}} placeholders
 */
export function extractTemplateVariables(text: string): string[] {
  const regex = /\{\{(\w+)\}\}/g
  const matches = [...text.matchAll(regex)]
  return Array.from(new Set(matches.map(m => m[1]))) // Remove duplicates
}

/**
 * Check if text contains any {{variable}} placeholders
 */
export function hasVariablePlaceholders(text: string): boolean {
  return /\{\{.+?\}\}/.test(text)
}

/**
 * Check if template has variables defined or contains placeholders
 */
export function hasTemplateVariables(template: TemplateWithVariables): boolean {
  // Check if variaveis array exists and has items
  if (template.variaveis && template.variaveis.length > 0) {
    return true
  }
  
  // Fallback: check if any content has placeholders
  const contents = [
    template.conteudo.achados,
    template.conteudo.impressao,
    template.conteudo.adicionais || ''
  ]
  
  return contents.some(text => hasVariablePlaceholders(text))
}

/**
 * Check if template has multiple techniques available
 */
export function hasMultipleTechniques(template: TemplateWithVariables): boolean {
  return Object.keys(template.conteudo.tecnica || {}).length > 1
}

/**
 * Format value for display (Brazilian decimal format for numbers)
 */
export function formatVariableValue(value: string | number | boolean): string {
  if (typeof value === 'number') {
    // Brazilian standard: comma as decimal separator, 1 decimal place
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 1,
      maximumFractionDigits: 1 
    })
  }
  return value.toString()
}

/**
 * Process text by replacing {{variable}} placeholders with actual values
 */
export function processTemplateText(
  text: string, 
  values: TemplateVariableValues
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    const value = values[varName]
    return value !== undefined && value !== null 
      ? formatVariableValue(value) 
      : match
  })
}

/**
 * Normalize template variables from database format
 * Handles inconsistencies similar to frases_modelo normalization
 */
export function normalizeTemplateVariables(
  variaveis: any[] | Record<string, any> | null | undefined
): TemplateVariable[] {
  if (!variaveis) return []
  
  // If already array format, normalize each variable
  if (Array.isArray(variaveis)) {
    return variaveis.map(normalizeVariable)
  }
  
  // If object format {variableName: {...config}}, convert to array
  if (typeof variaveis === 'object') {
    return Object.entries(variaveis).map(([nome, config]: [string, any]) => {
      return normalizeVariable({ nome, ...(config || {}) })
    })
  }
  
  return []
}

/**
 * Normalize individual variable object
 */
function normalizeVariable(v: any): TemplateVariable {
  // Normalize type: 'number' → 'numero', 'text'/'string' → 'texto'
  let tipo = v.tipo || v.type || 'texto'
  if (tipo === 'number') tipo = 'numero'
  if (tipo === 'text' || tipo === 'string') tipo = 'texto'
  
  return {
    nome: v.nome || v.name || 'unnamed',
    tipo: tipo as 'texto' | 'numero' | 'select' | 'boolean',
    descricao: v.descricao || v.description || v.nome,
    opcoes: v.opcoes || v.options || v.valores || [],
    valor_padrao: v.valor_padrao || v.default || v.defaultValue,
    obrigatorio: v.obrigatorio !== undefined ? v.obrigatorio : v.required || false,
    unidade: v.unidade || v.unit,
    minimo: v.minimo !== undefined ? v.minimo : v.min || v.valor_min,
    maximo: v.maximo !== undefined ? v.maximo : v.max || v.valor_max
  }
}

/**
 * Get available technique keys from template
 */
export function getAvailableTechniques(template: TemplateWithVariables): string[] {
  return Object.keys(template.conteudo.tecnica || {})
}

/**
 * Select default technique (prioritize 'SEM', then first available)
 */
export function getDefaultTechnique(template: TemplateWithVariables): string | null {
  const techniques = getAvailableTechniques(template)
  if (techniques.length === 0) return null
  
  // Prioritize 'SEM' technique if available
  if (techniques.includes('SEM')) return 'SEM'
  
  // Otherwise return first available
  return techniques[0]
}

/**
 * Process conditional logic to derive variables based on selected values
 * 
 * Example structure:
 * {
 *   "quando": "grau_esteatose",
 *   "igual": "I",
 *   "derivar": {
 *     "achados_figado": "text...",
 *     "impressao_grau": "leve (grau I)"
 *   }
 * }
 */
export function processConditionalLogic(
  condicoes: any[] | undefined,
  values: TemplateVariableValues
): TemplateVariableValues {
  if (!condicoes || condicoes.length === 0) return values

  const derivedValues = { ...values }

  condicoes.forEach(condicao => {
    // Check if condition is met
    const sourceValue = values[condicao.quando]
    if (sourceValue !== undefined && sourceValue === condicao.igual) {
      // Add derived variables
      if (condicao.derivar && typeof condicao.derivar === 'object') {
        Object.entries(condicao.derivar).forEach(([key, value]) => {
          derivedValues[key] = value as string | number | boolean
        })
      }
    }
  })

  return derivedValues
}
