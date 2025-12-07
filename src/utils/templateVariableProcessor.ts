// Template variable processing utilities
// Handles extraction and substitution of {{variable}} placeholders in templates

import { TemplateVariable, TemplateVariableValues, TemplateWithVariables, ConditionalLogic, VolumeMeasurement, TecnicaConfig } from '@/types/templateVariables'

// Keys that indicate alternative options (choose one or multiple)
const ALTERNATIVE_TECHNIQUE_KEYS = [
  'EV', 'SEM', 'COM', 'Primovist', 'TOMOSSINTESE', 'CONVENCIONAL',
  'Metodologia COM', 'Metodologia SEM', 'Técnica EV', 'Técnica SEM',
  'EV_VO', 'arterial', 'venoso', 'tardio', 'COM_CONTRASTE', 'SEM_CONTRASTE'
]

// Keys that indicate complementary fields (all should be concatenated)
const COMPLEMENTARY_TECHNIQUE_KEYS = [
  'posição', 'projeção', 'técnica', 'método', 'metodo', 'incidência', 'incidencias',
  'Posição', 'Projeção', 'Técnica', 'Método', 'Incidência', 'Incidências'
]

/**
 * Detect the type of technique structure based on keys
 * Returns a TecnicaConfig object with detected settings
 */
export function getTechniquePattern(tecnica: Record<string, string>): TecnicaConfig {
  const keys = Object.keys(tecnica)
  
  // Single key = no selection needed
  if (keys.length <= 1) {
    return { tipo: 'unico', concatenar: false }
  }
  
  // Check if any key matches alternative patterns (contrast, etc.)
  const hasAlternativeKeys = keys.some(k => 
    ALTERNATIVE_TECHNIQUE_KEYS.some(ak => 
      k.toLowerCase() === ak.toLowerCase() || k.includes(ak)
    )
  )
  
  // Check if all keys match complementary patterns
  const allComplementary = keys.every(k => 
    COMPLEMENTARY_TECHNIQUE_KEYS.some(ck => 
      k.toLowerCase() === ck.toLowerCase()
    )
  )
  
  if (allComplementary) {
    return {
      tipo: 'complementar',
      concatenar: true,
      separador: '. ',
      prefixo_label: true,
      ordem_exibicao: keys
    }
  }
  
  if (hasAlternativeKeys) {
    return {
      tipo: 'alternativo',
      concatenar: false,
      separador: ' '
    }
  }
  
  // Default to alternative for unknown patterns
  return {
    tipo: 'alternativo',
    concatenar: false,
    separador: ' '
  }
}

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
  if (tipo === 'volume') tipo = 'volume' // Preserve volume type
  if (tipo === 'date') tipo = 'data' // English to Portuguese
  
  return {
    nome: v.nome || v.name || 'unnamed',
    tipo: tipo as 'texto' | 'numero' | 'select' | 'boolean' | 'volume' | 'data',
    descricao: v.descricao || v.description || v.nome,
    opcoes: v.opcoes || v.options || v.valores || [],
    valor_padrao: v.valor_padrao || v.default || v.defaultValue,
    obrigatorio: v.obrigatorio !== undefined ? v.obrigatorio : v.required || false,
    unidade: v.unidade || v.unit,
    minimo: v.minimo !== undefined ? v.minimo : v.min || v.valor_min,
    maximo: v.maximo !== undefined ? v.maximo : v.max || v.valor_max,
    calculado: v.calculado !== undefined ? v.calculado : v.calculated || false,
    grupo: v.grupo || v.group
  }
}

/**
 * Calculate volume using ellipsoid formula: L × W × H × 0.52
 */
export function calculateEllipsoidVolume(x: number, y: number, z: number): number {
  return x * y * z * 0.52
}

/**
 * Get final volume value from VolumeMeasurement
 */
export function getVolumeValue(measurement: VolumeMeasurement): number {
  if (measurement.useCalculated) {
    return calculateEllipsoidVolume(measurement.x, measurement.y, measurement.z)
  }
  return measurement.directVolume
}

/**
 * Create default VolumeMeasurement
 */
export function createDefaultVolumeMeasurement(): VolumeMeasurement {
  return {
    useCalculated: true,
    x: 0,
    y: 0,
    z: 0,
    directVolume: 0
  }
}

/**
 * Check if a variable should be treated as volume type
 * Based on unit (cm³, ml) or name pattern (vol_, volume)
 */
export function isVolumeVariable(variable: TemplateVariable): boolean {
  // Explicit volume type
  if (variable.tipo === 'volume') return true
  
  // Check by unit
  const volumeUnits = ['cm³', 'cm3', 'ml', 'mL', 'cc']
  if (variable.unidade && volumeUnits.includes(variable.unidade)) return true
  
  // Check by name pattern
  const nome = variable.nome.toLowerCase()
  if (nome.includes('volume') || nome.startsWith('vol_')) return true
  
  return false
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
 * Supports multiple operators:
 * - "igual": exact match (string, number, boolean)
 * - "menor_que": less than (numeric comparison)
 * - "maior_que": greater than (numeric comparison)
 * - "menor_igual": less than or equal
 * - "maior_igual": greater than or equal
 * 
 * Example structure:
 * {
 *   "quando": "ila",
 *   "menor_que": 5,
 *   "derivar": {
 *     "alerta_la": "- Oligoâmnio. Recomenda-se correlação clínica."
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
    const sourceValue = values[condicao.quando]
    if (sourceValue === undefined || sourceValue === null) return
    
    let conditionMet = false
    
    // Exact match (igual)
    if (condicao.igual !== undefined) {
      conditionMet = sourceValue === condicao.igual
    }
    
    // Numeric comparisons
    const numericValue = typeof sourceValue === 'number' ? sourceValue : parseFloat(String(sourceValue))
    
    if (!isNaN(numericValue)) {
      // Less than (menor_que)
      if (condicao.menor_que !== undefined && numericValue < condicao.menor_que) {
        conditionMet = true
      }
      
      // Greater than (maior_que)
      if (condicao.maior_que !== undefined && numericValue > condicao.maior_que) {
        conditionMet = true
      }
      
      // Less than or equal (menor_igual)
      if (condicao.menor_igual !== undefined && numericValue <= condicao.menor_igual) {
        conditionMet = true
      }
      
      // Greater than or equal (maior_igual)
      if (condicao.maior_igual !== undefined && numericValue >= condicao.maior_igual) {
        conditionMet = true
      }
    }
    
    // Apply derived variables if condition is met
    if (conditionMet && condicao.derivar && typeof condicao.derivar === 'object') {
      Object.entries(condicao.derivar).forEach(([key, value]) => {
        // Process placeholders in derived values (e.g., "FCF {{fcf}} bpm")
        let processedValue = value as string | number | boolean
        if (typeof processedValue === 'string') {
          processedValue = processedValue.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
            const varValue = values[varName]
            return varValue !== undefined && varValue !== null 
              ? formatVariableValue(varValue) 
              : match
          })
        }
        derivedValues[key] = processedValue
      })
    }
  })

  return derivedValues
}
