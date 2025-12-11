/**
 * Voice Command Engine - Dynamic Search
 * Busca lazy de templates e frases sob demanda
 * 
 * Criado apenas quando há intent detectada (não pré-carregado)
 * Usa Fuse.js com boost contextual por modalidade/região
 */

import Fuse from 'fuse.js';

// Interfaces mínimas para busca
export interface TemplateSearchItem {
  id: string;
  titulo: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  tags?: string[];
  categoria?: string;
  conteudo_template: string;
}

export interface FraseSearchItem {
  id: string;
  codigo: string;
  texto: string;
  categoria?: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  tags?: string[];
  sinônimos?: string[];
  conclusao?: string;
}

export interface SearchContext {
  modalidade?: string | null;
  regiao?: string | null;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  boostedScore: number;
}

// Configuração Fuse.js para templates
const TEMPLATE_FUSE_OPTIONS = {
  keys: [
    { name: 'titulo', weight: 0.4 },
    { name: 'modalidade_codigo', weight: 0.25 },
    { name: 'regiao_codigo', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
    { name: 'categoria', weight: 0.05 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

// Configuração Fuse.js para frases
const FRASE_FUSE_OPTIONS = {
  keys: [
    { name: 'codigo', weight: 0.3 },
    { name: 'categoria', weight: 0.2 },
    { name: 'sinônimos', weight: 0.2 },
    { name: 'tags', weight: 0.15 },
    { name: 'conclusao', weight: 0.1 },
    { name: 'texto', weight: 0.05 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/**
 * Aplica boost contextual ao score
 * Menor score = melhor match no Fuse.js
 */
function applyContextBoost<T extends { modalidade_codigo?: string; regiao_codigo?: string }>(
  item: T,
  baseScore: number,
  context: SearchContext
): number {
  let boostedScore = baseScore;
  
  const itemMod = item.modalidade_codigo?.toUpperCase();
  const itemReg = item.regiao_codigo?.toLowerCase();
  const contextMod = context.modalidade?.toUpperCase();
  const contextReg = context.regiao?.toLowerCase();
  
  // Boost combinado (modalidade + região): 60% reduction
  if (contextMod && contextReg && itemMod === contextMod && itemReg === contextReg) {
    boostedScore *= 0.4;
  }
  // Boost só modalidade: 30% reduction
  else if (contextMod && itemMod === contextMod) {
    boostedScore *= 0.7;
  }
  // Boost só região: 15% reduction
  else if (contextReg && itemReg === contextReg) {
    boostedScore *= 0.85;
  }
  
  return boostedScore;
}

/**
 * Busca templates dinamicamente
 * Cria Fuse.js sob demanda - não mantém em memória
 */
export function searchTemplates(
  query: string,
  templates: TemplateSearchItem[],
  context: SearchContext = {}
): TemplateSearchItem | null {
  if (!query.trim() || templates.length === 0) {
    return null;
  }
  
  // Criar Fuse sob demanda
  const fuse = new Fuse(templates, TEMPLATE_FUSE_OPTIONS);
  const results = fuse.search(query);
  
  if (results.length === 0) {
    return null;
  }
  
  // Aplicar boost contextual e ordenar
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  // Ordenar por boostedScore (menor = melhor)
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  const best = boostedResults[0];
  
  // Threshold de aceitação após boost
  if (best.boostedScore > 0.5) {
    console.log(`[DynamicSearch] Template rejeitado: "${query}" → score ${best.boostedScore.toFixed(3)} > 0.5`);
    return null;
  }
  
  console.log(`[DynamicSearch] Template encontrado: "${query}" → "${best.item.titulo}" (score: ${best.boostedScore.toFixed(3)})`);
  return best.item;
}

/**
 * Busca frases dinamicamente
 * Cria Fuse.js sob demanda - não mantém em memória
 */
export function searchFrases(
  query: string,
  frases: FraseSearchItem[],
  context: SearchContext = {}
): FraseSearchItem | null {
  if (!query.trim() || frases.length === 0) {
    return null;
  }
  
  // Criar Fuse sob demanda
  const fuse = new Fuse(frases, FRASE_FUSE_OPTIONS);
  const results = fuse.search(query);
  
  if (results.length === 0) {
    return null;
  }
  
  // Aplicar boost contextual e ordenar
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  const best = boostedResults[0];
  
  if (best.boostedScore > 0.5) {
    console.log(`[DynamicSearch] Frase rejeitada: "${query}" → score ${best.boostedScore.toFixed(3)} > 0.5`);
    return null;
  }
  
  console.log(`[DynamicSearch] Frase encontrada: "${query}" → "${best.item.codigo}" (score: ${best.boostedScore.toFixed(3)})`);
  return best.item;
}

/**
 * Busca múltiplos resultados de templates (para sugestões)
 */
export function searchTemplatesMultiple(
  query: string,
  templates: TemplateSearchItem[],
  context: SearchContext = {},
  limit: number = 5
): TemplateSearchItem[] {
  if (!query.trim() || templates.length === 0) {
    return [];
  }
  
  const fuse = new Fuse(templates, TEMPLATE_FUSE_OPTIONS);
  const results = fuse.search(query, { limit: limit * 2 }); // Over-fetch para filtrar
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  return boostedResults
    .filter(r => r.boostedScore <= 0.6)
    .slice(0, limit)
    .map(r => r.item);
}

/**
 * Busca múltiplos resultados de frases (para sugestões)
 */
export function searchFrasesMultiple(
  query: string,
  frases: FraseSearchItem[],
  context: SearchContext = {},
  limit: number = 5
): FraseSearchItem[] {
  if (!query.trim() || frases.length === 0) {
    return [];
  }
  
  const fuse = new Fuse(frases, FRASE_FUSE_OPTIONS);
  const results = fuse.search(query, { limit: limit * 2 });
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  return boostedResults
    .filter(r => r.boostedScore <= 0.6)
    .slice(0, limit)
    .map(r => r.item);
}
