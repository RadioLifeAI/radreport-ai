import { applyPhoneticCorrections } from '@/extensions/phonetic-rules'
import { normalizeMorphology } from '@/extensions/morphology-rules'

/**
 * Correções específicas de reconhecimento de voz
 * Erros comuns que o Web Speech API comete com termos médicos
 */
const voiceRecognitionFixes: Record<string, string> = {
  // Números falados → notação médica
  'zero vírgula': '0,',
  'um vírgula': '1,',
  'dois vírgula': '2,',
  'três vírgula': '3,',
  'quatro vírgula': '4,',
  'cinco vírgula': '5,',
  'seis vírgula': '6,',
  'sete vírgula': '7,',
  'oito vírgula': '8,',
  'nove vírgula': '9,',
  'zero ponto': '0.',
  'um ponto': '1.',
  
  // RADS pronunciados errado pelo Web Speech
  'bairads': 'BI-RADS',
  'bi rads': 'BI-RADS',
  'bay rads': 'BI-RADS',
  'tirads': 'TI-RADS',
  'ti rads': 'TI-RADS',
  'pirads': 'PI-RADS',
  'pi rads': 'PI-RADS',
  'lirads': 'LI-RADS',
  'li rads': 'LI-RADS',
  'orads': 'O-RADS',
  'o rads': 'O-RADS',
  
  // Separações incorretas comuns em voz
  'hipo ecogênico': 'hipoecogênico',
  'hiper ecogênico': 'hiperecogênico',
  'iso ecogênico': 'isoeicogênico',
  'hipo ecoico': 'hipoecóico',
  'hiper ecoico': 'hiperecóico',
  'hipo denso': 'hipodenso',
  'hiper denso': 'hiperdenso',
  'iso denso': 'isodenso',
  'hipo intenso': 'hipointenso',
  'hiper intenso': 'hiperintenso',
  'iso intenso': 'isointenso',
  'hepato megalia': 'hepatomegalia',
  'espleno megalia': 'esplenomegalia',
  'cardio megalia': 'cardiomegalia',
  
  // Unidades médicas pronunciadas por extenso
  'centímetro': 'cm',
  'centímetros': 'cm',
  'milímetro': 'mm',
  'milímetros': 'mm',
  'mililitro': 'ml',
  'mililitros': 'ml',
  
  // Abreviações comuns
  'lesão de lca': 'lesão do LCA',
  'lesão de lcp': 'lesão do LCP',
  'tvp': 'TVP',
  'mav': 'MAV',
}

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
 * Corrige formatação de medidas médicas
 * Ex: "0 , 5 cm" → "0,5 cm"
 */
function fixMeasurements(text: string): string {
  let fixed = text
  
  // Corrigir espaços em dimensões: "5 x 3" → "5 x 3" (manter espaços)
  fixed = fixed.replace(/(\d)\s*x\s*(\d)/gi, '$1 x $2')
  
  // Corrigir espaço entre número e unidade: "5cm" → "5 cm"
  fixed = fixed.replace(/(\d)\s*(cm|mm|ml|kg|g)\b/gi, '$1 $2')
  
  // Remover espaço em decimais: "0 , 5" → "0,5"
  fixed = fixed.replace(/(\d)\s*,\s*(\d)/g, '$1,$2')
  fixed = fixed.replace(/(\d)\s*\.\s*(\d)/g, '$1.$2')
  
  // Remover espaço antes de pontuação
  fixed = fixed.replace(/\s+([.,;:!?])/g, '$1')
  
  // Adicionar espaço após pontuação (se não houver)
  fixed = fixed.replace(/([.,;:!?])(?=[^\s])/g, '$1 ')
  
  // Normalizar múltiplos espaços
  fixed = fixed.replace(/\s{2,}/g, ' ')
  
  return fixed
}

/**
 * Calcula similaridade entre dois textos (algoritmo de Levenshtein simplificado)
 * Retorna percentual de diferença (0 = idêntico, 1 = completamente diferente)
 */
function calculateTextDifference(text1: string, text2: string): number {
  const len1 = text1.length
  const len2 = text2.length
  
  if (len1 === 0) return len2 === 0 ? 0 : 1
  if (len2 === 0) return 1
  
  // Levenshtein distance simplificado
  const matrix: number[][] = []
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substituição
          matrix[i][j - 1] + 1,     // inserção
          matrix[i - 1][j] + 1      // deleção
        )
      }
    }
  }
  
  const distance = matrix[len1][len2]
  const maxLen = Math.max(len1, len2)
  return distance / maxLen
}

/**
 * 🆕 FASE 1: Reconciliador inteligente para Whisper
 * Decide se deve aplicar texto do Whisper baseado em edições manuais do usuário
 * 
 * @param webSpeechText - Texto original do Web Speech API
 * @param currentEditorText - Texto atualmente no editor (pode ter sido editado)
 * @param whisperText - Texto refinado do Whisper
 * @returns true se deve aplicar Whisper, false se usuário editou manualmente
 */
export function shouldApplyWhisperRefinement(
  webSpeechText: string,
  currentEditorText: string,
  whisperText: string
): boolean {
  // Se texto atual é exatamente igual ao Web Speech → sem edição manual
  if (currentEditorText === webSpeechText) {
    return true
  }
  
  // Calcular diferença entre texto atual e Web Speech original
  const difference = calculateTextDifference(
    webSpeechText.toLowerCase().trim(),
    currentEditorText.toLowerCase().trim()
  )
  
  // Se diferença > 30%, usuário provavelmente editou manualmente
  // NÃO substituir para preservar edição do radiologista
  if (difference > 0.3) {
    console.log('🚫 Whisper BLOQUEADO: usuário editou texto manualmente (diff:', Math.round(difference * 100) + '%)')
    return false
  }
  
  // Se diferença < 30%, aplicar merge inteligente (Whisper é mais preciso)
  console.log('✅ Whisper APLICADO: texto não foi editado significativamente (diff:', Math.round(difference * 100) + '%)')
  return true
}

/**
 * 🆕 FASE 5: Extrai comandos de voz do texto para proteção
 * Remove comandos estruturais para evitar que Whisper os "corrija"
 * 
 * @param text - Texto com possíveis comandos de voz
 * @returns { cleanText, commands } - Texto limpo e array de comandos encontrados
 */
export function extractVoiceCommands(text: string): { 
  cleanText: string
  commands: Array<{ position: number; command: string }> 
} {
  const commands: Array<{ position: number; command: string }> = []
  
  // Lista de comandos estruturais conhecidos
  const structuralCommands = [
    'nova linha',
    'próxima linha', 
    'linha',
    'novo parágrafo',
    'próximo parágrafo',
    'parágrafo',
    'ponto parágrafo',
    'ponto final',
    'vírgula',
    'ponto e vírgula',
    'dois pontos',
    'ponto de exclamação',
    'ponto de interrogação'
  ]
  
  let cleanText = text
  
  for (const cmd of structuralCommands.sort((a, b) => b.length - a.length)) {
    const regex = new RegExp(`(^|\\s)(${cmd})(\\s|$)`, 'gi')
    let match
    
    while ((match = regex.exec(cleanText)) !== null) {
      commands.push({
        position: match.index + match[1].length,
        command: match[2]
      })
      
      // Substituir comando por placeholder único
      cleanText = cleanText.slice(0, match.index + match[1].length) +
                  `[CMD_${commands.length - 1}]` +
                  cleanText.slice(match.index + match[0].length)
    }
  }
  
  return { cleanText, commands }
}

/**
 * 🆕 FASE 5: Reinsere comandos de voz após processamento Whisper
 * 
 * @param text - Texto processado pelo Whisper
 * @param commands - Array de comandos extraídos anteriormente
 * @returns Texto com comandos reinseridos
 */
export function reinsertVoiceCommands(
  text: string,
  commands: Array<{ position: number; command: string }>
): string {
  let result = text
  
  // Reinserir comandos nas posições originais (inverter ordem para manter posições)
  for (let i = commands.length - 1; i >= 0; i--) {
    const placeholder = `[CMD_${i}]`
    result = result.replace(placeholder, commands[i].command)
  }
  
  return result
}

/**
 * Processador unificado de texto médico para ditado
 * Aplica todas as correções ANTES de inserir no editor
 * 
 * @param text - Texto transcrito pelo Web Speech API
 * @returns Texto corrigido com terminologia médica padronizada
 */
export function processMedicalText(text: string): string {
  let processed = text
  
  // 1. Remover ruídos de voz primeiro
  processed = removeVoiceNoise(processed)
  
  // 2. Correções específicas de voz
  for (const [wrong, right] of Object.entries(voiceRecognitionFixes)) {
    const regex = new RegExp(wrong, 'gi')
    processed = processed.replace(regex, right)
  }
  
  // 3. Correções fonéticas do dicionário (hipoecogenico → hipoecogênico)
  processed = applyPhoneticCorrections(processed)
  
  // 4. Normalização morfológica (hepato megalia → hepatomegalia)
  processed = normalizeMorphology(processed)
  
  // 5. Normalizar acrônimos (consolidado)
  processed = normalizeAcronyms(processed)
  
  // 6. Remover repetições consecutivas
  processed = removeRepetitions(processed)
  
  // 7. Correções de medidas e formatação
  processed = fixMeasurements(processed)
  
  return processed
}
