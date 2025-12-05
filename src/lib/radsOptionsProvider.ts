/**
 * RADS Options Provider with Fallback
 * 
 * Provides dynamic options from database with fallback to hardcoded values
 * if database is unavailable or loading.
 */

import { RADSOptionsMap, RADSOption } from '@/hooks/useRADSOptions'
import { 
  biradsUSGOptions, 
  biradsUSGExpandedOptions,
  biradsMGOptions,
  tiradOptions,
  TIRADSOption,
  BIRADSOption 
} from '@/lib/radsClassifications'

// Convert hardcoded options to RADSOptionsMap format
function convertBIRADSUSGToMap(): RADSOptionsMap {
  const map: RADSOptionsMap = {}
  
  // Basic options
  for (const [key, options] of Object.entries(biradsUSGOptions)) {
    map[key] = (options as BIRADSOption[]).map(opt => ({
      value: opt.value,
      label: opt.label,
      texto: opt.texto,
      suspeicao: opt.suspeicao,
    }))
  }
  
  // Expanded options
  for (const [key, options] of Object.entries(biradsUSGExpandedOptions)) {
    map[key] = (options as any[]).map(opt => ({
      value: opt.value,
      label: opt.label,
      texto: opt.texto,
      suspeicao: opt.suspeicao,
      birads_associado: opt.birads?.toString(),
    }))
  }
  
  return map
}

function convertBIRADSMGToMap(): RADSOptionsMap {
  const map: RADSOptionsMap = {}
  
  for (const [key, options] of Object.entries(biradsMGOptions)) {
    map[key] = (options as any[]).map(opt => ({
      value: opt.value,
      label: opt.label,
      texto: opt.texto,
      suspeicao: opt.suspeicao,
      usa_lado: opt.usaLado,
      usa_meses: opt.usaMeses,
    }))
  }
  
  return map
}

function convertTIRADSToMap(): RADSOptionsMap {
  const map: RADSOptionsMap = {}
  
  for (const [key, options] of Object.entries(tiradOptions)) {
    map[key] = (options as TIRADSOption[]).map(opt => ({
      value: opt.value,
      label: opt.label,
      texto: opt.texto,
      pontos: opt.points,
    }))
  }
  
  return map
}

// Cached hardcoded maps
const hardcodedMaps = {
  BIRADS_USG: convertBIRADSUSGToMap(),
  BIRADS_MG: convertBIRADSMGToMap(),
  TIRADS: convertTIRADSToMap(),
}

/**
 * Get RADS options with fallback to hardcoded values
 */
export function getRADSOptionsWithFallback(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG' | 'TIRADS',
  dbOptions: RADSOptionsMap | undefined,
  isLoading: boolean,
  isError: boolean
): RADSOptionsMap {
  // If DB data available and not error, use it
  if (dbOptions && !isError && Object.keys(dbOptions).length > 0) {
    return dbOptions
  }
  
  // Fallback to hardcoded
  return hardcodedMaps[sistemaCodigo]
}

/**
 * Get options for a specific category with fallback
 */
export function getCategoryOptions(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG' | 'TIRADS',
  categoria: string,
  dbOptions: RADSOptionsMap | undefined,
  isLoading: boolean,
  isError: boolean
): RADSOption[] {
  const options = getRADSOptionsWithFallback(sistemaCodigo, dbOptions, isLoading, isError)
  return options[categoria] || []
}

/**
 * Get a single option by value from a category
 */
export function getOptionByValue(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG' | 'TIRADS',
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): RADSOption | undefined {
  const options = getRADSOptionsWithFallback(sistemaCodigo, dbOptions, false, false)
  const categoryOptions = options[categoria] || []
  return categoryOptions.find(o => o.value === value)
}

/**
 * Get texto for a specific value in a category
 */
export function getOptionTexto(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG' | 'TIRADS',
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): string {
  const option = getOptionByValue(sistemaCodigo, categoria, value, dbOptions)
  return option?.texto ?? ''
}

/**
 * Get suspeicao level for BI-RADS options
 */
export function getSuspeicao(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG',
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): string | undefined {
  const option = getOptionByValue(sistemaCodigo, categoria, value, dbOptions)
  return option?.suspeicao
}

/**
 * Get BI-RADS associated with cisto tipo
 */
export function getBiradsFromCistoTipo(
  value: string,
  dbOptions?: RADSOptionsMap
): number | string | undefined {
  const option = getOptionByValue('BIRADS_USG', 'tipoCisto', value, dbOptions)
  if (option?.birads_associado) {
    const num = parseInt(option.birads_associado)
    return isNaN(num) ? option.birads_associado : num
  }
  return undefined
}

/**
 * Get points for TI-RADS option
 */
export function getTIRADSPoints(
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): number {
  const option = getOptionByValue('TIRADS', categoria, value, dbOptions)
  return option?.pontos ?? 0
}

/**
 * Helper to check if option has suspicious characteristics
 */
export function isSuspicious(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG',
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): boolean {
  const suspeicao = getSuspeicao(sistemaCodigo, categoria, value, dbOptions)
  return suspeicao === 'suspeito' || suspeicao === 'alto'
}

/**
 * Helper to check if option is high suspicion (alto)
 */
export function isHighSuspicion(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG',
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): boolean {
  const suspeicao = getSuspeicao(sistemaCodigo, categoria, value, dbOptions)
  return suspeicao === 'alto'
}

/**
 * Helper to check if option is benign
 */
export function isBenign(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG',
  categoria: string,
  value: string,
  dbOptions?: RADSOptionsMap
): boolean {
  const suspeicao = getSuspeicao(sistemaCodigo, categoria, value, dbOptions)
  return suspeicao === 'benigno' || suspeicao === 'benigno_definitivo'
}
