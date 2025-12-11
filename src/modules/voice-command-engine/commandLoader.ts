/**
 * Voice Command Engine - Command Loader (Simplificado)
 * 
 * ARQUITETURA INTENT DETECTION:
 * - Apenas comandos de SISTEMA são pré-carregados (~47)
 * - Templates e Frases são buscados DINAMICAMENTE via dynamicSearch.ts
 * - Zero comandos estáticos para templates/frases
 */

import type { VoiceCommand } from './types';
import { ALL_SYSTEM_COMMANDS } from './systemCommands';

// Cache config
const CACHE_KEY = 'voiceEngine_stats_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

export interface CommandStats {
  system: number;
  frases: number;      // Contagem para referência (não são comandos)
  templates: number;   // Contagem para referência (não são comandos)
  total: number;       // Total = apenas sistema
}

interface CacheData {
  stats: CommandStats;
  timestamp: number;
  version: string;
}

/**
 * Retorna comandos do sistema (sempre disponíveis)
 * Únicos comandos pré-carregados na nova arquitetura
 */
export function getSystemCommands(): VoiceCommand[] {
  return [...ALL_SYSTEM_COMMANDS];
}

/**
 * Construir stats a partir de dados já carregados
 * NÃO cria comandos para templates/frases (busca dinâmica)
 */
export function buildStatsFromData(
  templatesCount: number,
  frasesCount: number
): CommandStats {
  const stats: CommandStats = {
    system: ALL_SYSTEM_COMMANDS.length,
    frases: frasesCount,       // Apenas contagem
    templates: templatesCount, // Apenas contagem
    total: ALL_SYSTEM_COMMANDS.length, // Apenas sistema são comandos reais
  };

  console.log(`[CommandLoader] Stats: ${stats.system} comandos sistema, ${frasesCount} frases (dinâmico), ${templatesCount} templates (dinâmico)`);
  
  saveCacheStats(stats);
  return stats;
}

/**
 * Salvar stats no localStorage
 */
function saveCacheStats(stats: CommandStats): void {
  try {
    const cacheData: CacheData = {
      stats,
      timestamp: Date.now(),
      version: '3.0', // Nova versão para Intent Detection
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (err) {
    console.warn('[CommandLoader] Erro ao salvar cache:', err);
  }
}

/**
 * Carregar stats do cache (para exibir enquanto carrega)
 */
export function loadCacheStats(): CommandStats | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CacheData = JSON.parse(cached);
    
    // Verificar se cache expirou ou versão antiga
    if (Date.now() - data.timestamp > CACHE_TTL_MS || data.version !== '3.0') {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data.stats;
  } catch {
    return null;
  }
}

/**
 * Limpar cache
 */
export function clearCommandCache(): void {
  localStorage.removeItem(CACHE_KEY);
  console.log('[CommandLoader] Cache limpo');
}

/**
 * Filtrar comandos por categoria
 */
export function filterCommandsByCategory(
  commands: VoiceCommand[],
  category: VoiceCommand['category']
): VoiceCommand[] {
  return commands.filter(cmd => cmd.category === category);
}

// ========== LEGACY FUNCTIONS (mantidas para compatibilidade, mas deprecadas) ==========

/**
 * @deprecated Use getSystemCommands() - templates/frases são buscados dinamicamente
 */
export function buildCommandsFromData(
  templates: any[],
  frases: any[]
): { commands: VoiceCommand[]; stats: CommandStats } {
  console.warn('[CommandLoader] buildCommandsFromData() deprecado. Use getSystemCommands() + busca dinâmica.');
  
  const stats = buildStatsFromData(templates.length, frases.length);
  
  return {
    commands: getSystemCommands(),
    stats,
  };
}

/**
 * @deprecated Não mais usado - busca dinâmica
 */
export function convertTemplatesToCommands(): VoiceCommand[] {
  console.warn('[CommandLoader] convertTemplatesToCommands() deprecado - busca dinâmica.');
  return [];
}

/**
 * @deprecated Não mais usado - busca dinâmica
 */
export function convertFrasesToCommands(): VoiceCommand[] {
  console.warn('[CommandLoader] convertFrasesToCommands() deprecado - busca dinâmica.');
  return [];
}

/**
 * @deprecated Use getSystemCommands()
 */
export async function loadAllCommands(): Promise<VoiceCommand[]> {
  console.warn('[CommandLoader] loadAllCommands() deprecado. Use getSystemCommands().');
  return getSystemCommands();
}

/**
 * @deprecated Não mais usado
 */
export function filterCommandsByModalidade(
  commands: VoiceCommand[],
  modalidade: string
): VoiceCommand[] {
  console.warn('[CommandLoader] filterCommandsByModalidade() deprecado - busca dinâmica usa contexto.');
  return commands.filter(cmd => 
    !cmd.modalidade || cmd.modalidade.toUpperCase() === modalidade.toUpperCase()
  );
}
