/**
 * Voice Command Engine - Fuzzy Matcher (Optimized)
 * Motor de matching com Fuse.js otimizado para reconhecimento de voz médica
 */

import Fuse, { IFuseOptions } from 'fuse.js';
import type { VoiceCommand, CommandMatchResult } from './types';

// Mapa de correções fonéticas comuns em radiologia PT-BR
const PHONETIC_CORRECTIONS: Record<string, string> = {
  // Erros comuns de pronúncia/transcrição
  'estiatose': 'esteatose',
  'esthetose': 'esteatose',
  'estiatose hepatica': 'esteatose hepática',
  'hepatomeglia': 'hepatomegalia',
  'hepatomegelia': 'hepatomegalia',
  'esplenomeglia': 'esplenomegalia',
  'colecistiti': 'colecistite',
  'colescistite': 'colecistite',
  'colicistite': 'colecistite',
  'hipoecogenico': 'hipoecogênico',
  'hipoecogenica': 'hipoecogênica',
  'hiperecogenico': 'hiperecogênico',
  'hiperecogenica': 'hiperecogênica',
  'birads': 'bi-rads',
  'bi rads': 'bi-rads',
  'tirads': 'ti-rads',
  'ti rads': 'ti-rads',
  'pirads': 'pi-rads',
  'pi rads': 'pi-rads',
  'lirads': 'li-rads',
  'li rads': 'li-rads',
  'orads': 'o-rads',
  'o rads': 'o-rads',
  'lung rads': 'lung-rads',
  'lungrads': 'lung-rads',
  // Comandos estruturais
  'virgula': 'vírgula',
  'paragrafo': 'parágrafo',
  'proxima linha': 'próxima linha',
  'proximo campo': 'próximo campo',
};

// Configuração otimizada do Fuse.js para voz médica em português
const FUSE_OPTIONS: IFuseOptions<VoiceCommand> = {
  // Threshold: 0 = match exato, 1 = aceita qualquer coisa
  // Mais estrito para voz médica (reduzir falsos positivos)
  threshold: 0.25,
  
  // Distância máxima entre caracteres para considerar match
  distance: 80,
  
  // Incluir score para validação posterior
  includeScore: true,
  
  // Ignorar posição - buscar em qualquer lugar da string
  ignoreLocation: true,
  
  // Mínimo de caracteres para considerar match (aceitar "TC", "RM")
  minMatchCharLength: 2,
  
  // Ordenar por score (melhor match primeiro)
  shouldSort: true,
  
  // Parar no primeiro match bom (performance)
  findAllMatches: false,
  
  // Campos para busca com pesos otimizados
  keys: [
    { name: 'name', weight: 3.0 },           // Nome principal tem peso muito maior
    { name: 'phrases', weight: 2.0 },        // Sinônimos
    { name: 'modalidade', weight: 1.0 },     // Modalidade médica
    { name: 'category', weight: 0.5 },       // Categoria
  ],
};

export class FuzzyMatcher {
  private fuse: Fuse<VoiceCommand> | null = null;
  private commands: VoiceCommand[] = [];
  private threshold: number;
  private debug: boolean = false;
  private exactMatchMap: Map<string, VoiceCommand> = new Map();

  constructor(threshold: number = 0.25) {
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
    
    // Construir mapa de match exato para performance
    this.exactMatchMap.clear();
    for (const command of commands) {
      const normalizedName = this.normalizeText(command.name);
      this.exactMatchMap.set(normalizedName, command);
      
      // Adicionar frases também
      for (const phrase of command.phrases) {
        const normalizedPhrase = this.normalizeText(phrase);
        if (!this.exactMatchMap.has(normalizedPhrase)) {
          this.exactMatchMap.set(normalizedPhrase, command);
        }
      }
    }
    
    if (this.debug) {
      console.log(`[FuzzyMatcher] Índice atualizado: ${commands.length} comandos, ${this.exactMatchMap.size} entradas de match exato`);
    }
  }

  /**
   * Buscar melhor match para uma transcrição
   */
  findBestMatch(transcript: string): CommandMatchResult | null {
    if (!this.fuse || !transcript.trim()) {
      return null;
    }

    // Aplicar correção fonética
    let normalizedTranscript = this.normalizeText(transcript);
    normalizedTranscript = this.applyPhoneticCorrections(normalizedTranscript);
    
    // 1. Tentar match exato primeiro (O(1) via Map)
    const exactMatch = this.exactMatchMap.get(normalizedTranscript);
    if (exactMatch) {
      if (this.debug) {
        console.log(`[FuzzyMatcher] ✅ Match exato (Map): "${exactMatch.name}"`);
      }
      return {
        command: exactMatch,
        score: 0,
        matchedPhrase: exactMatch.name,
        isExact: true,
      };
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
   * Aplicar correções fonéticas PT-BR
   */
  private applyPhoneticCorrections(text: string): string {
    let corrected = text;
    
    for (const [wrong, correct] of Object.entries(PHONETIC_CORRECTIONS)) {
      // Substituir palavras completas
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      corrected = corrected.replace(regex, correct);
    }
    
    return corrected;
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
  getStats(): { totalCommands: number; threshold: number; exactEntries: number } {
    return {
      totalCommands: this.commands.length,
      threshold: this.threshold,
      exactEntries: this.exactMatchMap.size,
    };
  }
}

// Instância singleton
export const fuzzyMatcher = new FuzzyMatcher();
