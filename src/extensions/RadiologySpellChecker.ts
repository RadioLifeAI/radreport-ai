import SpellcheckerExtension from '@farscrl/tiptap-extension-spellchecker'
import type { IProofreaderInterface, ITextWithPosition } from '@farscrl/tiptap-extension-spellchecker/lib/i-proofreader-interface'
import { dict } from './radiology-dict'
import phonetic from './phonetic-rules'
import morphology from './morphology-rules'

function tokenizeIndices(text: string) {
  const regex = /[\p{L}\p{N}_]+/gu
  const matches: Array<{ word: string; index: number }> = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    matches.push({ word: m[0], index: m.index })
  }
  return matches
}

function levenshtein(a: string, b: string) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

const baseWords: Set<string> = (() => {
  const set = new Set<string>()
  Object.keys(dict).forEach((k) => {
    if (k === 'sinonimos') return
    const arr = (dict as any)[k] as string[]
    if (Array.isArray(arr)) arr.forEach((w) => set.add(w.toLowerCase()))
  })
  const syn = (dict as any).sinonimos || {}
  Object.keys(syn).forEach((k) => {
    set.add(k.toLowerCase())
    const arr = syn[k]
    if (Array.isArray(arr)) arr.forEach((w: string) => set.add(w.toLowerCase()))
  })
  return set
})()

const proofreader: IProofreaderInterface = {
  async proofreadText(_sentence: string): Promise<ITextWithPosition[]> {
    return []
  },
  async getSuggestions(word: string): Promise<string[]> {
    const candidates: string[] = Array.from(baseWords)
    const scored = candidates
      .map((c) => ({ c, d: levenshtein(word, c) }))
      .filter((x) => x.d <= 2)
      .sort((a, b) => a.d - b.d)
      .slice(0, 8)
      .map((x) => x.c)
    return scored
  },
  normalizeTextForLanguage(text: string): string {
    return text
  }
}

const RadiologySpellChecker = SpellcheckerExtension.extend({
  addOptions() {
    return {
      proofreader,
      uiStrings: { noSuggestions: 'Sem sugestões' }
    }
  },
  addProseMirrorPlugins() {
    // Evita plugin de decorações do Spellchecker que pode causar erros de DecorationGroup
    return [phonetic(), morphology()]
  }
})

export default RadiologySpellChecker
