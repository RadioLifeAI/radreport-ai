import { processMedicalText } from './medicalTextProcessor'

/**
 * Pós-processador radiológico avançado
 * Expande o medicalTextProcessor com correções adicionais
 */

/**
 * Remove ruídos de voz (ãh, hm, éh, etc.)
 */
export function removeVoiceNoise(text: string): string {
  let cleaned = text

  // Ruídos vocais comuns
  const noises = ['ãh', 'ah', 'hm', 'hmm', 'éh', 'eh', 'uhm', 'uh']
  
  for (const noise of noises) {
    const regex = new RegExp(`\\b${noise}\\b`, 'gi')
    cleaned = cleaned.replace(regex, '')
  }

  // Limpar espaços duplicados resultantes
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim()

  return cleaned
}

/**
 * Remove repetições consecutivas de palavras
 * Ex: "fígado fígado" → "fígado"
 */
export function removeRepetitions(text: string): string {
  // Regex para detectar palavra repetida consecutivamente
  const regex = /\b(\w+)\s+\1\b/gi
  return text.replace(regex, '$1')
}

/**
 * Aplica estilo telegráfico objetivo (remove verbos desnecessários)
 */
export function applyTelegraphicStyle(text: string): string {
  let processed = text

  // Lista de verbos comuns que podem ser removidos para estilo telegráfico
  const unnecessaryVerbs = [
    'observa-se',
    'observamos',
    'nota-se',
    'notamos',
    'visualiza-se',
    'visualizamos',
    'verifica-se',
    'verificamos',
    'identifica-se',
    'identificamos',
  ]

  for (const verb of unnecessaryVerbs) {
    const regex = new RegExp(`\\b${verb}\\s+`, 'gi')
    processed = processed.replace(regex, '')
  }

  return processed
}

/**
 * Normaliza acrônimos radiológicos (capitalização correta)
 */
export function normalizeAcronyms(text: string): string {
  const acronyms: Record<string, string> = {
    'birads': 'BI-RADS',
    'bi-rads': 'BI-RADS',
    'tirads': 'TI-RADS',
    'ti-rads': 'TI-RADS',
    'pirads': 'PI-RADS',
    'pi-rads': 'PI-RADS',
    'lirads': 'LI-RADS',
    'li-rads': 'LI-RADS',
    'orads': 'O-RADS',
    'o-rads': 'O-RADS',
    'acr': 'ACR',
    'inca': 'INCA',
    'cbr': 'CBR',
    'lca': 'LCA',
    'lcp': 'LCP',
    'tvp': 'TVP',
    'mav': 'MAV',
    'avc': 'AVC',
    'hiv': 'HIV',
    'dip': 'DIP',
  }

  let normalized = text

  for (const [wrong, right] of Object.entries(acronyms)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi')
    normalized = normalized.replace(regex, right)
  }

  return normalized
}

/**
 * Formata medidas médicas (padronização de unidades e espaçamento)
 */
export function formatMeasurements(text: string): string {
  let formatted = text

  // Normalizar dimensões: "5x3x2" → "5 x 3 x 2"
  formatted = formatted.replace(/(\d+)\s*x\s*(\d+)/gi, '$1 x $2')

  // Garantir espaço entre número e unidade
  formatted = formatted.replace(/(\d+)\s*(cm|mm|ml|mL|kg|g|Hz|kHz|MHz)\b/gi, '$1 $2')

  // Padronizar unidades para lowercase (exceto mL)
  formatted = formatted.replace(/(\d+)\s+CM\b/gi, '$1 cm')
  formatted = formatted.replace(/(\d+)\s+MM\b/gi, '$1 mm')
  formatted = formatted.replace(/(\d+)\s+ML\b/gi, '$1 mL')
  formatted = formatted.replace(/(\d+)\s+KG\b/gi, '$1 kg')
  formatted = formatted.replace(/(\d+)\s+G\b/gi, '$1 g')

  // Normalizar decimais: vírgula como separador brasileiro
  formatted = formatted.replace(/(\d+)\.(\d+)/g, '$1,$2')

  return formatted
}

/**
 * Pipeline completo de pós-processamento radiológico
 * Aplica todas as correções em sequência otimizada
 */
export function fullRadiologyProcess(text: string): string {
  let processed = text

  // 1. Remover ruídos de voz primeiro
  processed = removeVoiceNoise(processed)

  // 2. Correções médicas base (phonetic + morphology + voice fixes)
  processed = processMedicalText(processed)

  // 3. Remover repetições
  processed = removeRepetitions(processed)

  // 4. Normalizar acrônimos
  processed = normalizeAcronyms(processed)

  // 5. Aplicar estilo telegráfico (opcional - comentar se não desejado)
  // processed = applyTelegraphicStyle(processed)

  // 6. Formatar medidas
  processed = formatMeasurements(processed)

  // 7. Limpeza final de espaços
  processed = processed.replace(/\s{2,}/g, ' ').trim()

  return processed
}
