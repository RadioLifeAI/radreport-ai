/**
 * Voice Command Engine - Command Loader
 * Carrega comandos dinamicamente do Supabase (templates e frases)
 */

import { supabase } from '@/integrations/supabase/client';
import type { VoiceCommand, SupabaseFrase, SupabaseTemplate } from './types';
import { ALL_SYSTEM_COMMANDS } from './systemCommands';

// Tipos internos para queries
interface FraseRow {
  id: string;
  codigo: string;
  texto: string;
  categoria: string | null;
  modalidade_codigo: string | null;
  tags: string[] | null;
}

/**
 * Gerar variações de um nome para melhorar matching
 */
function generatePhraseVariations(name: string, tags?: string[], synonyms?: string[]): string[] {
  const variations: string[] = [];
  
  // Adicionar sinônimos se existirem
  if (synonyms && Array.isArray(synonyms)) {
    variations.push(...synonyms);
  }
  
  // Adicionar tags se existirem
  if (tags && Array.isArray(tags)) {
    variations.push(...tags);
  }
  
  // Gerar variações do nome
  const normalizedName = name.toLowerCase();
  
  // Variação sem artigos
  const withoutArticles = normalizedName.replace(/\b(o|a|os|as|um|uma|uns|umas|de|do|da|dos|das)\b/g, '').replace(/\s+/g, ' ').trim();
  if (withoutArticles !== normalizedName && withoutArticles.length > 3) {
    variations.push(withoutArticles);
  }
  
  // Variação com prefixos comuns
  const prefixes = ['modelo', 'template', 'inserir', 'adicionar', 'frase'];
  for (const prefix of prefixes) {
    if (!normalizedName.startsWith(prefix)) {
      variations.push(`${prefix} ${normalizedName}`);
    }
  }
  
  return [...new Set(variations)]; // Remove duplicados
}

/**
 * Carregar frases modelo do Supabase
 */
export async function loadFrasesFromSupabase(): Promise<VoiceCommand[]> {
  try {
    const { data, error } = await supabase
      .from('frases_modelo')
      .select('id, codigo, texto, categoria, modalidade_codigo, tags, sinônimos, conclusao')
      .eq('ativa', true)
      .limit(1000);

    if (error) {
      console.error('[CommandLoader] Erro ao carregar frases:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[CommandLoader] Nenhuma frase encontrada');
      return [];
    }

    const commands: VoiceCommand[] = (data as any[]).map((frase) => {
      // Nome base é o código ou categoria
      const baseName = frase.codigo || frase.categoria || 'frase';
      
      // Gerar variações para matching - incluir sinônimos do banco
      const phrases = generatePhraseVariations(
        baseName,
        frase.tags || undefined,
        frase.sinônimos || undefined  // Sinônimos do Supabase
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
        priority: 50,
        modalidade: frase.modalidade_codigo || undefined,
      };
    });

    console.log(`[CommandLoader] ${commands.length} frases carregadas`);
    return commands;
  } catch (err) {
    console.error('[CommandLoader] Exceção ao carregar frases:', err);
    return [];
  }
}

/**
 * Carregar templates do Supabase
 */
export async function loadTemplatesFromSupabase(): Promise<VoiceCommand[]> {
  try {
    const { data, error } = await supabase
      .from('system_templates')
      .select('id, titulo, conteudo_template, modalidade_codigo, regiao_codigo, tags, categoria')
      .eq('ativo', true)
      .limit(500);

    if (error) {
      console.error('[CommandLoader] Erro ao carregar templates:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[CommandLoader] Nenhum template encontrado');
      return [];
    }

    const commands: VoiceCommand[] = (data as any[]).map((template) => {
      const baseName = template.titulo || 'template';
      
      // Gerar variações
      const phrases = generatePhraseVariations(
        baseName,
        template.tags as string[] | undefined
      );
      
      // Adicionar modalidade e região como variações
      if (template.modalidade_codigo) {
        phrases.push(`${template.modalidade_codigo} ${baseName}`.toLowerCase());
        phrases.push(template.modalidade_codigo.toLowerCase());
      }
      if (template.regiao_codigo) {
        phrases.push(template.regiao_codigo.toLowerCase());
      }
      if (template.categoria) {
        phrases.push(template.categoria.toLowerCase());
      }

      return {
        id: `template_${template.id}`,
        name: baseName,
        phrases,
        category: 'template' as const,
        actionType: 'apply_template' as const,
        payload: template.conteudo_template || '',  // Campo correto
        priority: 60,
        modalidade: template.modalidade_codigo || undefined,
        regiaoAnatomica: template.regiao_codigo || undefined,  // Campo correto
      };
    });

    console.log(`[CommandLoader] ${commands.length} templates carregados`);
    return commands;
  } catch (err) {
    console.error('[CommandLoader] Exceção ao carregar templates:', err);
    return [];
  }
}

/**
 * Carregar todos os comandos (sistema + Supabase)
 */
export async function loadAllCommands(): Promise<VoiceCommand[]> {
  console.log('[CommandLoader] Iniciando carregamento de todos os comandos...');
  
  // Carregar em paralelo
  const [frases, templates] = await Promise.all([
    loadFrasesFromSupabase(),
    loadTemplatesFromSupabase(),
  ]);

  // Combinar todos os comandos
  const allCommands = [
    ...ALL_SYSTEM_COMMANDS,
    ...frases,
    ...templates,
  ];

  // Ordenar por prioridade (maior primeiro)
  allCommands.sort((a, b) => b.priority - a.priority);

  console.log(`[CommandLoader] Total de comandos carregados: ${allCommands.length}`);
  console.log(`[CommandLoader] - Sistema: ${ALL_SYSTEM_COMMANDS.length}`);
  console.log(`[CommandLoader] - Frases: ${frases.length}`);
  console.log(`[CommandLoader] - Templates: ${templates.length}`);

  return allCommands;
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
