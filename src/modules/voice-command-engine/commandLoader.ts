/**
 * Voice Command Engine - Command Loader (Optimized)
 * Converte dados já carregados em comandos de voz (zero queries adicionais)
 */

import type { VoiceCommand } from './types';
import { ALL_SYSTEM_COMMANDS } from './systemCommands';

// Cache config
const CACHE_KEY = 'voiceEngine_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

interface CacheData {
  systemCount: number;
  frasesCount: number;
  templatesCount: number;
  timestamp: number;
  version: string;
}

/**
 * Prefixos SEGUROS para comandos de voz (exigidos para frases/templates)
 */
const SAFE_PREFIXES = ['modelo', 'template', 'frase', 'inserir', 'aplicar', 'usar'];

/**
 * Gerar variações de um nome para melhorar matching
 * FASE 3: Incluir trigger phrases com prefixos seguros
 */
function generatePhraseVariations(name: string, tags?: string[], synonyms?: string[], conclusao?: string): string[] {
  const variations: string[] = [];
  
  // Adicionar sinônimos se existirem
  if (synonyms && Array.isArray(synonyms)) {
    variations.push(...synonyms);
  }
  
  // Adicionar tags se existirem
  if (tags && Array.isArray(tags)) {
    variations.push(...tags);
  }
  
  // Adicionar conclusão como trigger (comum falar a conclusão para inserir)
  if (conclusao && conclusao.length > 5 && conclusao.length < 100) {
    variations.push(conclusao.toLowerCase());
  }
  
  // Gerar variações do nome
  const normalizedName = name.toLowerCase();
  
  // Variação sem artigos
  const withoutArticles = normalizedName.replace(/\b(o|a|os|as|um|uma|uns|umas|de|do|da|dos|das)\b/g, '').replace(/\s+/g, ' ').trim();
  if (withoutArticles !== normalizedName && withoutArticles.length > 3) {
    variations.push(withoutArticles);
  }
  
  // IMPORTANTE: Adicionar variações COM prefixos seguros
  // Estas terão prioridade no matching
  for (const prefix of SAFE_PREFIXES) {
    if (!normalizedName.startsWith(prefix)) {
      variations.push(`${prefix} ${normalizedName}`);
      // Também sem artigos
      if (withoutArticles !== normalizedName && withoutArticles.length > 3) {
        variations.push(`${prefix} ${withoutArticles}`);
      }
    }
  }
  
  // Extrair palavras-chave do código (ex: US_CERV_TIREOIDE → tireoide)
  const keywords = normalizedName
    .replace(/_/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !['modelo', 'frase', 'normal', 'alterado'].includes(word));
  
  if (keywords.length > 0) {
    // Adicionar keywords como variações
    variations.push(...keywords);
    // E com prefixos
    for (const prefix of SAFE_PREFIXES) {
      variations.push(`${prefix} ${keywords.join(' ')}`);
    }
  }
  
  return [...new Set(variations)]; // Remove duplicados
}

/**
 * Interface para dados de template (do hook useTemplates)
 */
interface TemplateData {
  id: string;
  titulo: string;
  conteudo_template: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  tags?: string[];
  categoria?: string;
}

/**
 * Interface para dados de frase (do hook useFrasesModelo)
 */
interface FraseData {
  id: string;
  codigo: string;
  texto: string;
  categoria?: string;
  modalidade_codigo?: string;
  tags?: string[];
  sinônimos?: string[];
  conclusao?: string;
}

/**
 * Converter templates para comandos de voz
 * FASE 3: Prioridade baixa para templates (exigir prefixo ou match exato)
 */
export function convertTemplatesToCommands(templates: TemplateData[]): VoiceCommand[] {
  if (!templates || templates.length === 0) return [];

  return templates.map((template) => {
    const baseName = template.titulo || 'template';
    
    // Gerar variações com prefixos seguros
    const phrases = generatePhraseVariations(
      baseName,
      template.tags as string[] | undefined
    );
    
    // Adicionar modalidade + título como trigger comum
    // Ex: "modelo tc tórax", "template rm crânio"
    if (template.modalidade_codigo) {
      const mod = template.modalidade_codigo.toLowerCase();
      phrases.push(`modelo ${mod} ${baseName}`.toLowerCase());
      phrases.push(`template ${mod} ${baseName}`.toLowerCase());
      phrases.push(`${mod} ${baseName}`.toLowerCase());
    }
    
    // Adicionar região como parte do trigger
    if (template.regiao_codigo) {
      const reg = template.regiao_codigo.toLowerCase();
      phrases.push(`modelo ${reg}`.toLowerCase());
      phrases.push(`template ${reg}`.toLowerCase());
    }
    
    // Categoria como variação
    if (template.categoria) {
      phrases.push(`modelo ${template.categoria}`.toLowerCase());
    }

    return {
      id: `template_${template.id}`,
      name: baseName,
      phrases,
      category: 'template' as const,
      actionType: 'apply_template' as const,
      payload: template.conteudo_template || '',
      priority: 45,  // ← BAIXA: exige prefixo ou match muito alto
      modalidade: template.modalidade_codigo || undefined,
      regiaoAnatomica: template.regiao_codigo || undefined,
    };
  });
}

/**
 * Converter frases modelo para comandos de voz
 * FASE 3: Prioridade mais baixa para frases (exigir prefixo ou match exato)
 */
export function convertFrasesToCommands(frases: FraseData[]): VoiceCommand[] {
  if (!frases || frases.length === 0) return [];

  return frases.map((frase) => {
    // Nome base é o código ou categoria
    const baseName = frase.codigo || frase.categoria || 'frase';
    
    // Gerar variações para matching - incluir sinônimos e conclusão
    const phrases = generatePhraseVariations(
      baseName,
      frase.tags || undefined,
      frase.sinônimos || undefined,
      frase.conclusao || undefined  // ← NOVO: usar conclusão como trigger
    );
    
    // Adicionar categoria como variação
    if (frase.categoria) {
      phrases.push(frase.categoria.toLowerCase());
    }

    return {
      id: `frase_${frase.id}`,
      name: baseName,
      phrases,
      category: 'frase' as const,
      actionType: 'insert_content' as const,
      payload: frase.texto,
      priority: 40,  // ← BAIXA: exige prefixo ou match muito alto
      modalidade: frase.modalidade_codigo || undefined,
    };
  });
}

/**
 * Construir comandos a partir de dados já carregados (sem queries)
 */
export function buildCommandsFromData(
  templates: TemplateData[],
  frases: FraseData[]
): { commands: VoiceCommand[]; stats: CommandStats } {
  console.log('[CommandLoader] Construindo comandos a partir de dados existentes...');
  
  const templateCommands = convertTemplatesToCommands(templates);
  const fraseCommands = convertFrasesToCommands(frases);

  // Combinar todos os comandos
  const allCommands = [
    ...ALL_SYSTEM_COMMANDS,
    ...fraseCommands,
    ...templateCommands,
  ];

  // Ordenar por prioridade (maior primeiro)
  allCommands.sort((a, b) => b.priority - a.priority);

  const stats: CommandStats = {
    system: ALL_SYSTEM_COMMANDS.length,
    frases: fraseCommands.length,
    templates: templateCommands.length,
    total: allCommands.length,
  };

  console.log(`[CommandLoader] Comandos construídos: ${stats.total} (Sistema: ${stats.system}, Frases: ${stats.frases}, Templates: ${stats.templates})`);

  // Salvar stats no cache
  saveCacheStats(stats);

  return { commands: allCommands, stats };
}

export interface CommandStats {
  system: number;
  frases: number;
  templates: number;
  total: number;
}

/**
 * Salvar stats no localStorage
 */
function saveCacheStats(stats: CommandStats): void {
  try {
    const cacheData: CacheData = {
      systemCount: stats.system,
      frasesCount: stats.frases,
      templatesCount: stats.templates,
      timestamp: Date.now(),
      version: '2.0',
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
    
    // Verificar se cache expirou
    if (Date.now() - data.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return {
      system: data.systemCount,
      frases: data.frasesCount,
      templates: data.templatesCount,
      total: data.systemCount + data.frasesCount + data.templatesCount,
    };
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
 * Retorna os comandos do sistema (sempre disponíveis, sem query)
 */
export function getSystemCommands(): VoiceCommand[] {
  return [...ALL_SYSTEM_COMMANDS];
}

/**
 * Buscar comandos por categoria
 */
export function filterCommandsByCategory(
  commands: VoiceCommand[],
  category: VoiceCommand['category']
): VoiceCommand[] {
  return commands.filter(cmd => cmd.category === category);
}

/**
 * Buscar comandos por modalidade
 */
export function filterCommandsByModalidade(
  commands: VoiceCommand[],
  modalidade: string
): VoiceCommand[] {
  const normalizedMod = modalidade.toUpperCase();
  return commands.filter(cmd => 
    cmd.modalidade?.toUpperCase() === normalizedMod
  );
}

// ========== LEGACY (manter por compatibilidade) ==========
// Estas funções fazem queries diretas - DEPRECADAS
// Use buildCommandsFromData() com dados dos hooks existentes

import { supabase } from '@/integrations/supabase/client';

/**
 * @deprecated Use buildCommandsFromData() com dados dos hooks useTemplates/useFrasesModelo
 */
export async function loadAllCommands(): Promise<VoiceCommand[]> {
  console.warn('[CommandLoader] loadAllCommands() é deprecado. Use buildCommandsFromData() com dados dos hooks.');
  
  // Fallback: carregar diretamente (duplica queries)
  const [frases, templates] = await Promise.all([
    loadFrasesFromSupabase(),
    loadTemplatesFromSupabase(),
  ]);

  const allCommands = [
    ...ALL_SYSTEM_COMMANDS,
    ...frases,
    ...templates,
  ];

  allCommands.sort((a, b) => b.priority - a.priority);
  return allCommands;
}

async function loadFrasesFromSupabase(): Promise<VoiceCommand[]> {
  try {
    const { data, error } = await supabase
      .from('frases_modelo')
      .select('id, codigo, texto, categoria, modalidade_codigo, tags')
      .eq('ativa', true)
      .limit(1000);

    if (error || !data) return [];
    return convertFrasesToCommands(data as unknown as FraseData[]);
  } catch {
    return [];
  }
}

async function loadTemplatesFromSupabase(): Promise<VoiceCommand[]> {
  try {
    const { data, error } = await supabase
      .from('system_templates')
      .select('id, titulo, conteudo_template, modalidade_codigo, regiao_codigo, tags, categoria')
      .eq('ativo', true)
      .limit(500);

    if (error || !data) return [];
    return convertTemplatesToCommands(data as unknown as TemplateData[]);
  } catch {
    return [];
  }
}
