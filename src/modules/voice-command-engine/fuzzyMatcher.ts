/**
 * Voice Command Engine - Fuzzy Matcher (Optimized)
 * Motor de matching com Fuse.js otimizado para reconhecimento de voz médica
 * FASE 4: Matching contextual por modalidade e região
 */

import Fuse, { IFuseOptions, FuseResult } from 'fuse.js';
import type { VoiceCommand, CommandMatchResult } from './types';

// ✨ FASE 4: Interface de contexto para matching
export interface MatchContext {
  modalidade?: string | null;
  regiao?: string | null;
  combinedBoost?: number;      // Boost quando ambos combinam (default 0.6 = 60%)
  modalidadeBoost?: number;    // Boost apenas modalidade (default 0.3 = 30%)
  regiaoBoost?: number;        // Boost apenas região (default 0.15 = 15%)
}

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
  // FASE 1 FIX: Relaxado de 0.25 → 0.35 para melhor matching de templates/frases
  threshold: 0.35,
  
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
   * ✨ FASE 4: Buscar melhor match para uma transcrição com contexto
   */
  findBestMatch(transcript: string, context?: MatchContext): CommandMatchResult | null {
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

    // ✨ FASE 4: Se temos contexto, aplicar boost contextual
    if (context?.modalidade || context?.regiao) {
      return this.applyContextBoost(results, normalizedTranscript, context);
    }

    // Pegar o melhor resultado (sem contexto)
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
   * ✨ FASE 4: Aplicar boost contextual baseado em modalidade e região
   * TC+Tórax = 60% boost, TC-only = 30% boost, Tórax-only = 15% boost
   */
  private applyContextBoost(
    results: FuseResult<VoiceCommand>[],
    transcript: string,
    context: MatchContext
  ): CommandMatchResult | null {
    const combinedBoost = context.combinedBoost ?? 0.6;     // 60% boost
    const modalidadeBoost = context.modalidadeBoost ?? 0.3; // 30% boost
    const regiaoBoost = context.regiaoBoost ?? 0.15;        // 15% boost

    // Normalizar contexto para comparação
    const ctxMod = context.modalidade?.toUpperCase() || '';
    const ctxReg = context.regiao?.toLowerCase() || '';

    // Recalcular scores com boost contextual
    const boostedResults = results.map(result => {
      const cmd = result.item;
      const cmdMod = (cmd.modalidade || '').toUpperCase();
      const cmdReg = (cmd.regiaoAnatomica || '').toLowerCase();
      
      const matchMod = ctxMod && cmdMod && cmdMod === ctxMod;
      const matchReg = ctxReg && cmdReg && cmdReg === ctxReg;
      
      let multiplier = 1.0;
      
      if (matchMod && matchReg) {
        // Ambos combinam: boost máximo (score menor = melhor)
        multiplier = 1.0 - combinedBoost;  // 0.4
      } else if (matchMod) {
        // Apenas modalidade
        multiplier = 1.0 - modalidadeBoost; // 0.7
      } else if (matchReg) {
        // Apenas região
        multiplier = 1.0 - regiaoBoost;     // 0.85
      }
      
      return {
        item: result.item,
        originalScore: result.score ?? 1,
        boostedScore: (result.score ?? 1) * multiplier,
        matchMod,
        matchReg,
        multiplier,
      };
    });

    // Ordenar por score ajustado (menor = melhor)
    boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
    
    const best = boostedResults[0];
    const matchedPhrase = this.findMatchedPhrase(best.item, transcript);

    if (this.debug) {
      console.log(`[FuzzyMatcher] 🎯 Contexto: mod=${ctxMod}, reg=${ctxReg}`);
      console.log(`[FuzzyMatcher] ✅ Best: "${best.item.name}" (original: ${best.originalScore.toFixed(3)}, boosted: ${best.boostedScore.toFixed(3)}, mult: ${best.multiplier.toFixed(2)})`);
      if (boostedResults.length > 1) {
        console.log(`[FuzzyMatcher] Alternativas: ${boostedResults.slice(1, 4).map(r => 
          `${r.item.name}(${r.boostedScore.toFixed(3)} mod:${r.matchMod} reg:${r.matchReg})`
        ).join(', ')}`);
      }
    }

    return {
      command: best.item,
      score: best.boostedScore,
      matchedPhrase,
      isExact: false,
    };
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
