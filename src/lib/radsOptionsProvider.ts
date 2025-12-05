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
    map[key] = (options as BIRADSOption[]).map(opt => ({
      value: opt.value,
      label: opt.label,
      texto: opt.texto,
      suspeicao: opt.suspeicao,
    }))
  }
  
  return map
}

function convertBIRADSMGToMap(): RADSOptionsMap {
  const map: RADSOptionsMap = {}
  
  for (const [key, options] of Object.entries(biradsMGOptions)) {
    map[key] = (options as BIRADSOption[]).map(opt => ({
      value: opt.value,
      label: opt.label,
      texto: opt.texto,
      suspeicao: opt.suspeicao,
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
 * Get texto for a specific value in a category
 */
export function getOptionTexto(
  sistemaCodigo: 'BIRADS_USG' | 'BIRADS_MG' | 'TIRADS',
  categoria: string,
  value: string,
  dbOptions: RADSOptionsMap | undefined
): string {
  const options = getRADSOptionsWithFallback(sistemaCodigo, dbOptions, false, false)
  const categoryOptions = options[categoria] || []
  const option = categoryOptions.find(o => o.value === value)
  return option?.texto ?? ''
}

/**
 * Get points for TI-RADS option
 */
export function getTIRADSPoints(
  categoria: string,
  value: string,
  dbOptions: RADSOptionsMap | undefined
): number {
  const options = getRADSOptionsWithFallback('TIRADS', dbOptions, false, false)
  const categoryOptions = options[categoria] || []
  const option = categoryOptions.find(o => o.value === value)
  return option?.pontos ?? 0
}
