/**
 * Voice Command Engine - Fuzzy Matcher
 * Motor de matching com Fuse.js otimizado para reconhecimento de voz
 */

import Fuse, { IFuseOptions } from 'fuse.js';
import type { VoiceCommand, CommandMatchResult } from './types';

// Configuração otimizada do Fuse.js para voz em português
const FUSE_OPTIONS: IFuseOptions<VoiceCommand> = {
  // Threshold: 0 = match exato, 1 = aceita qualquer coisa
  threshold: 0.35,
  
  // Distância máxima entre caracteres para considerar match
  distance: 100,
  
  // Incluir score para validação posterior
  includeScore: true,
  
  // Ignorar posição - buscar em qualquer lugar da string
  ignoreLocation: true,
  
  // Mínimo de caracteres para considerar match
  minMatchCharLength: 3,
  
  // Usar operador OR estendido para múltiplas palavras
  useExtendedSearch: false,
  
  // Campos para busca com pesos
  keys: [
    { name: 'name', weight: 2.0 },           // Nome principal tem peso maior
    { name: 'phrases', weight: 1.5 },        // Sinônimos
    { name: 'modalidade', weight: 0.8 },     // Modalidade
    { name: 'category', weight: 0.5 },       // Categoria
  ],
};

export class FuzzyMatcher {
  private fuse: Fuse<VoiceCommand> | null = null;
  private commands: VoiceCommand[] = [];
  private threshold: number;
  private debug: boolean = false;

  constructor(threshold: number = 0.35) {
    this.threshold = threshold;
  }

  /**
   * Atualizar lista de comandos e recriar índice Fuse
   */
  updateCommands(commands: VoiceCommand[]): void {
    this.commands = commands;
    this.fuse = new Fuse(commands, {
      ...FUSE_OPTIONS,
      threshold: this.threshold,
    });
    
    if (this.debug) {
      console.log(`[FuzzyMatcher] Índice atualizado com ${commands.length} comandos`);
    }
  }

  /**
   * Buscar melhor match para uma transcrição
   */
  findBestMatch(transcript: string): CommandMatchResult | null {
    if (!this.fuse || !transcript.trim()) {
      return null;
    }

    const normalizedTranscript = this.normalizeText(transcript);
    
    // 1. Tentar match exato primeiro
    const exactMatch = this.findExactMatch(normalizedTranscript);
    if (exactMatch) {
      if (this.debug) {
        console.log(`[FuzzyMatcher] ✅ Match exato: "${exactMatch.command.name}"`);
      }
      return exactMatch;
    }

    // 2. Fuzzy match com Fuse.js
    const results = this.fuse.search(normalizedTranscript);
    
    if (results.length === 0) {
      if (this.debug) {
        console.log(`[FuzzyMatcher] ❌ Nenhum match para: "${transcript}"`);
      }
      return null;
    }

    // Pegar o melhor resultado
    const best = results[0];
    const score = best.score ?? 1;
    
    // Encontrar qual frase deu match
    const matchedPhrase = this.findMatchedPhrase(best.item, normalizedTranscript);

    const result: CommandMatchResult = {
      command: best.item,
      score: score,
      matchedPhrase: matchedPhrase,
      isExact: false,
    };

    if (this.debug) {
      console.log(`[FuzzyMatcher] 🔍 Fuzzy match: "${best.item.name}" (score: ${score.toFixed(3)})`);
      if (results.length > 1) {
        console.log(`[FuzzyMatcher] Alternativas: ${results.slice(1, 4).map(r => `${r.item.name}(${r.score?.toFixed(3)})`).join(', ')}`);
      }
    }

    return result;
  }

  /**
   * Buscar match exato (score = 0)
   */
  private findExactMatch(normalizedTranscript: string): CommandMatchResult | null {
    for (const command of this.commands) {
      // Checar nome
      if (this.normalizeText(command.name) === normalizedTranscript) {
        return {
          command,
          score: 0,
          matchedPhrase: command.name,
          isExact: true,
        };
      }
      
      // Checar frases/sinônimos
      for (const phrase of command.phrases) {
        if (this.normalizeText(phrase) === normalizedTranscript) {
          return {
            command,
            score: 0,
            matchedPhrase: phrase,
            isExact: true,
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Encontrar qual frase deu match
   */
  private findMatchedPhrase(command: VoiceCommand, transcript: string): string {
    // Checar nome primeiro
    if (this.calculateSimilarity(command.name, transcript) > 0.5) {
      return command.name;
    }
    
    // Checar frases
    let bestPhrase = command.name;
    let bestSimilarity = 0;
    
    for (const phrase of command.phrases) {
      const similarity = this.calculateSimilarity(phrase, transcript);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestPhrase = phrase;
      }
    }
    
    return bestPhrase;
  }

  /**
   * Calcular similaridade simples entre duas strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = this.normalizeText(str1);
    const s2 = this.normalizeText(str2);
    
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Contar palavras em comum
    const words1 = new Set(s1.split(/\s+/));
    const words2 = new Set(s2.split(/\s+/));
    const intersection = [...words1].filter(w => words2.has(w));
    
    return intersection.length / Math.max(words1.size, words2.size);
  }

  /**
   * Normalizar texto para comparação
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, ' ')        // Remove pontuação
      .replace(/\s+/g, ' ')            // Normaliza espaços
      .trim();
  }

  /**
   * Configurar threshold
   */
  setThreshold(threshold: number): void {
    this.threshold = threshold;
    if (this.commands.length > 0) {
      this.updateCommands(this.commands);
    }
  }

  /**
   * Ativar/desativar debug
   */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  /**
   * Obter estatísticas
   */
  getStats(): { totalCommands: number; threshold: number } {
    return {
      totalCommands: this.commands.length,
      threshold: this.threshold,
    };
  }
}

// Instância singleton
export const fuzzyMatcher = new FuzzyMatcher();
