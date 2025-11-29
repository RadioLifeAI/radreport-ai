/**
 * Utilitários para cálculo de diferenças textuais
 * Usado para aplicar correções incrementais no editor
 */

export interface TextDiff {
  type: 'replace' | 'insert' | 'delete'
  from: number
  to: number
  original: string
  replacement: string
}

/**
 * Calcula diferenças entre texto original e corrigido
 * Retorna array de diffs estruturados
 */
export function calculateDiff(original: string, corrected: string): TextDiff[] {
  const diffs: TextDiff[] = []

  // Se textos são idênticos, retornar vazio
  if (original === corrected) {
    return diffs
  }

  // Se muito diferentes, substituir tudo
  const similarity = calculateSimilarity(original, corrected)
  if (similarity < 0.5) {
    return [{
      type: 'replace',
      from: 0,
      to: original.length,
      original,
      replacement: corrected,
    }]
  }

  // Algoritmo de diff palavra por palavra
  const originalWords = original.split(/(\s+)/)
  const correctedWords = corrected.split(/(\s+)/)

  let originalPos = 0
  let i = 0
  let j = 0

  while (i < originalWords.length || j < correctedWords.length) {
    const origWord = originalWords[i] || ''
    const corrWord = correctedWords[j] || ''

    if (origWord === corrWord) {
      // Palavras idênticas, avançar
      originalPos += origWord.length
      i++
      j++
    } else if (!origWord) {
      // Inserção no final
      diffs.push({
        type: 'insert',
        from: originalPos,
        to: originalPos,
        original: '',
        replacement: corrWord,
      })
      j++
    } else if (!corrWord) {
      // Deleção no final
      diffs.push({
        type: 'delete',
        from: originalPos,
        to: originalPos + origWord.length,
        original: origWord,
        replacement: '',
      })
      originalPos += origWord.length
      i++
    } else {
      // Substituição
      diffs.push({
        type: 'replace',
        from: originalPos,
        to: originalPos + origWord.length,
        original: origWord,
        replacement: corrWord,
      })
      originalPos += origWord.length
      i++
      j++
    }
  }

  return diffs
}

/**
 * Filtra diffs para remover mudanças triviais (apenas espaços, capitalização insignificante)
 */
export function filterSignificantDiffs(diffs: TextDiff[]): TextDiff[] {
  return diffs.filter(diff => {
    // Manter se é inserção ou deleção não vazia
    if (diff.type === 'insert' || diff.type === 'delete') {
      return diff.original.trim().length > 0 || diff.replacement.trim().length > 0
    }

    // Para substituições, verificar se há mudança real (não apenas case)
    if (diff.type === 'replace') {
      const origLower = diff.original.toLowerCase().trim()
      const replLower = diff.replacement.toLowerCase().trim()
      
      // Manter se são diferentes (não apenas capitalização)
      if (origLower !== replLower) return true
      
      // Manter se capitalização é significativa (ex: BI-RADS vs birads)
      if (diff.original !== diff.replacement && diff.original.length > 2) return true
      
      return false
    }

    return true
  })
}

/**
 * Ordena diffs por posição (da última para primeira para evitar shift de posições)
 */
export function sortDiffsByPosition(diffs: TextDiff[]): TextDiff[] {
  return [...diffs].sort((a, b) => b.from - a.from)
}

/**
 * Mescla diffs adjacentes para reduzir número de operações
 */
export function mergeDiffs(diffs: TextDiff[]): TextDiff[] {
  if (diffs.length === 0) return []

  const sorted = [...diffs].sort((a, b) => a.from - b.from)
  const merged: TextDiff[] = []
  let current = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i]

    // Se diffs são adjacentes ou sobrepostos, mesclar
    if (next.from <= current.to + 1) {
      current = {
        type: 'replace',
        from: current.from,
        to: Math.max(current.to, next.to),
        original: current.original + next.original,
        replacement: current.replacement + next.replacement,
      }
    } else {
      merged.push(current)
      current = next
    }
  }

  merged.push(current)
  return merged
}

/**
 * Calcula similaridade entre dois textos (0-1)
 * Baseado em Levenshtein distance simplificado
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

/**
 * Calcula distância de Levenshtein entre duas strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
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

  return matrix[str2.length][str1.length]
}
