import SpellcheckerExtension from '@farscrl/tiptap-extension-spellchecker'
import type { IProofreaderInterface, ITextWithPosition } from '@farscrl/tiptap-extension-spellchecker/lib/i-proofreader-interface'
import { dict } from './radiology-dict'
import phonetic, { corrections } from './phonetic-rules'
import morphology from './morphology-rules'
import { stopwords } from './portuguese-stopwords'

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

// Extrair palavras únicas do dicionário
const baseWords: Set<string> = (() => {
  const set = new Set<string>()
  Object.keys(dict).forEach((k) => {
    if (k === 'sinonimos') return
    const arr = (dict as any)[k] as string[]
    if (Array.isArray(arr)) arr.forEach((w) => {
      // Adicionar palavras individuais (sem espaço)
      if (!w.includes(' ')) {
        set.add(w.toLowerCase())
      }
    })
  })
  const syn = (dict as any).sinonimos || {}
  Object.keys(syn).forEach((k) => {
    if (!k.includes(' ')) set.add(k.toLowerCase())
    const arr = syn[k]
    if (Array.isArray(arr)) arr.forEach((w: string) => {
      if (!w.includes(' ')) set.add(w.toLowerCase())
    })
  })
  return set
})()

// Extrair termos compostos (multi-palavra) do dicionário
const compoundTerms: Set<string> = (() => {
  const set = new Set<string>()
  Object.keys(dict).forEach((k) => {
    if (k === 'sinonimos') return
    const arr = (dict as any)[k] as string[]
    if (Array.isArray(arr)) {
      arr.forEach((term) => {
        if (term.includes(' ')) {
          set.add(term.toLowerCase())
        }
      })
    }
  })
  const syn = (dict as any).sinonimos || {}
  Object.keys(syn).forEach((k) => {
    if (k.includes(' ')) set.add(k.toLowerCase())
    const arr = syn[k]
    if (Array.isArray(arr)) arr.forEach((w: string) => {
      if (w.includes(' ')) set.add(w.toLowerCase())
    })
  })
  return set
})()

// Índice otimizado: primeira palavra → lista de termos compostos
const compoundIndex: Map<string, string[]> = (() => {
  const index = new Map<string, string[]>()
  compoundTerms.forEach(term => {
    const firstWord = term.split(' ')[0]
    if (!index.has(firstWord)) {
      index.set(firstWord, [])
    }
    index.get(firstWord)!.push(term)
  })
  // Ordenar cada lista por tamanho decrescente (greedy match)
  index.forEach((terms, key) => {
    index.set(key, terms.sort((a, b) => b.length - a.length))
  })
  return index
})()

// Função para encontrar termo composto no texto a partir de uma posição
function findCompoundTermMatch(
  text: string, 
  startIndex: number, 
  firstWord: string
): { term: string; endIndex: number } | null {
  const candidates = compoundIndex.get(firstWord.toLowerCase())
  if (!candidates || candidates.length === 0) return null
  
  const textFromStart = text.slice(startIndex).toLowerCase()
  
  for (const term of candidates) {
    // Verificar se o texto começa com o termo composto
    // Aceitar fim de string, espaço, pontuação ou quebra de linha após o termo
    const termLen = term.length
    if (textFromStart.length >= termLen) {
      const match = textFromStart.slice(0, termLen)
      if (match === term) {
        // Verificar se o próximo caractere é válido (não é letra/número)
        const nextChar = textFromStart[termLen]
        if (!nextChar || /[^a-záàâãéèêíìîóòôõúùûç0-9]/i.test(nextChar)) {
          return { term, endIndex: startIndex + termLen }
        }
      }
    }
  }
  
  return null
}

// Global user dictionary words - updated by UserDictionaryContext
let userDictionaryWords: Set<string> = new Set()

export function setUserDictionaryWords(words: Set<string>) {
  userDictionaryWords = words
}

export function getUserDictionaryWords(): Set<string> {
  return userDictionaryWords
}

export const proofreader: IProofreaderInterface = {
  async proofreadText(sentence: string): Promise<ITextWithPosition[]> {
    const errors: ITextWithPosition[] = []
    const tokens = tokenizeIndices(sentence)
    
    // PASSO 1: Identificar ranges cobertos por termos compostos válidos
    const coveredRanges: Array<{ start: number; end: number }> = []
    
    for (const { word, index } of tokens) {
      const match = findCompoundTermMatch(sentence, index, word)
      if (match) {
        coveredRanges.push({ start: index, end: match.endIndex })
      }
    }
    
    // PASSO 2: Verificar palavras individuais, pulando as cobertas por termos compostos
    for (const { word, index } of tokens) {
      const wordEnd = index + word.length
      const lowerWord = word.toLowerCase()
      
      // Verificar se esta palavra está coberta por um termo composto
      const isCovered = coveredRanges.some(
        range => index >= range.start && wordEnd <= range.end
      )
      if (isCovered) continue // Faz parte de termo composto válido
      
      // Ignorar palavras muito curtas (artigos, preposições de 1-2 letras)
      if (word.length < 2) continue
      
      // Ignorar números e medidas com unidades médicas (ex: "5,2", "10x8", "10cm", "5mm")
      if (/^[\d.,x×]+(cm|mm|ml|mL|mg|g|kg|Hz|kHz|MHz|s|ms|min|h|%)?$/i.test(word)) continue
      
      // Ignorar stopwords do português (palavras estruturais da língua)
      if (stopwords.has(lowerWord)) continue
      
      // Ignorar palavras do dicionário médico
      if (baseWords.has(lowerWord)) continue
      
      // Ignorar palavras do dicionário pessoal do usuário
      if (userDictionaryWords.has(lowerWord)) continue
      
      // Ignorar palavras com correção automática (serão corrigidas pelo plugin)
      if (corrections[lowerWord]) continue
      
      // Marcar como erro - usar offset/length (interface ITextWithPosition)
      errors.push({
        offset: index,
        length: word.length,
        word: word,
      })
    }
    
    return errors
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
    // Restaurar plugin pai para decorações visuais (sublinhados de erro)
    const parent = this.parent?.() || []
    
    return [
      ...parent,        // Decorações visuais do @farscrl/tiptap-extension-spellchecker
      phonetic(),       // Correção automática fonética
      morphology()      // Correção automática morfológica
    ]
  }
})

export default RadiologySpellChecker
