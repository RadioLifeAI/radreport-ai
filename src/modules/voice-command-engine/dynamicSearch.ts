/**
 * Voice Command Engine - Dynamic Search
 * Busca lazy de templates e frases sob demanda
 * 
 * Criado apenas quando há intent detectada (não pré-carregado)
 * Usa Fuse.js com boost contextual por modalidade/região
 * 
 * v2.0 - Ajuste fino de precisão:
 * - Normalização de query com sinônimos de modalidade
 * - Campos corrigidos para match real (modalidade/regiao vs modalidade_codigo/regiao_codigo)
 * - Threshold mais tolerante para voz
 * - Fallback inteligente por modalidade+região
 */

import Fuse from 'fuse.js';

// ============================================
// INTERFACES - Campos reais dos hooks
// ============================================

export interface TemplateSearchItem {
  id: string;
  titulo: string;
  modalidade?: string;        // Campo real do useTemplates
  regiao?: string;            // Campo real do useTemplates
  tags?: string[];
  categoria?: string;
  conteudo_template?: string;
}

export interface FraseSearchItem {
  id: string;
  codigo: string;
  texto?: string;
  frase?: string;
  categoria?: string;
  modalidade_id?: string;
  modalidade_codigo?: string;  // Código normalizado (USG, TC, RM, RX, MG)
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

// ============================================
// SINÔNIMOS E NORMALIZAÇÃO
// ============================================

// Mapeamento de sinônimos de modalidade (voz → banco)
const MODALITY_MAP: Record<string, string> = {
  'ultrassom': 'USG',
  'ultrassonografia': 'USG',
  'us': 'USG',
  'eco': 'USG',
  'ecografia': 'USG',
  'tomografia': 'TC',
  'ct': 'TC',
  'ressonancia': 'RM',
  'ressonância': 'RM',
  'rm': 'RM',
  'raio x': 'RX',
  'radiografia': 'RX',
  'rx': 'RX',
  'mamografia': 'MG',
  'mg': 'MG',
  'medicina nuclear': 'MN',
  'mn': 'MN',
  'cintilografia': 'MN',
};

// Regiões anatômicas normalizadas
const REGION_MAP: Record<string, string> = {
  'abdome': 'abdome',
  'abdominal': 'abdome',
  'abd': 'abdome',
  'torax': 'torax',
  'tórax': 'torax',
  'toracico': 'torax',
  'pelve': 'pelve',
  'pelvico': 'pelve',
  'pélvico': 'pelve',
  'cranio': 'cranio',
  'crânio': 'cranio',
  'cabeca': 'cranio',
  'cabeça': 'cranio',
  'cerebro': 'cranio',
  'encefalo': 'cranio',
  'coluna': 'coluna',
  'cervical': 'cervical',
  'pescoco': 'cervical',
  'pescoço': 'cervical',
  'mama': 'mama',
  'mamas': 'mama',
  'mamario': 'mama',
  'mamária': 'mama',
  'tireoide': 'cervical',
  'tireóide': 'cervical',
  'obstetrico': 'obstetrico',
  'obstetríco': 'obstetrico',
  'gestacao': 'obstetrico',
  'fetal': 'obstetrico',
  'escroto': 'escroto',
  'testicular': 'escroto',
  'vascular': 'vascular',
  'doppler': 'vascular',
};

/**
 * Normaliza query removendo acentos, preposições e expandindo abreviações
 */
function normalizeQuery(query: string): string {
  let normalized = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
    .replace(/\bmodelo\b/g, '')        // Remove prefixo "modelo"
    .replace(/\bfrase\b/g, '')         // Remove prefixo "frase"
    .replace(/\binserir\b/g, '')       // Remove prefixo "inserir"
    .replace(/\baplicar\b/g, '')       // Remove prefixo "aplicar"
    .replace(/\s+de\s+/g, ' ')         // Remove "de"
    .replace(/\s+do\s+/g, ' ')         // Remove "do"
    .replace(/\s+da\s+/g, ' ')         // Remove "da"
    .replace(/\s+total\b/g, '')        // Remove "total" (comum em "abdome total")
    .replace(/\s+completo\b/g, '')     // Remove "completo"
    .replace(/\s+normal\b/g, '')       // Remove "normal"
    .replace(/\s+/g, ' ')              // Normaliza espaços
    .trim();
  
  return normalized;
}

/**
 * Extrai modalidade e região da query normalizada
 */
function extractModalityAndRegion(query: string): { modality?: string; region?: string } {
  let modality: string | undefined;
  let region: string | undefined;
  
  const words = query.split(' ');
  
  // Detectar modalidade (primeira palavra geralmente)
  for (const word of words) {
    if (MODALITY_MAP[word]) {
      modality = MODALITY_MAP[word];
      break;
    }
  }
  
  // Detectar região
  for (const word of words) {
    if (REGION_MAP[word]) {
      region = REGION_MAP[word];
      break;
    }
  }
  
  return { modality, region };
}

/**
 * Expande query com sinônimos de modalidade para melhor match
 */
function expandQueryWithSynonyms(query: string): string {
  let expanded = query;
  
  // Substituir termos por versões padronizadas
  for (const [synonym, standard] of Object.entries(MODALITY_MAP)) {
    const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
    if (regex.test(expanded)) {
      expanded = expanded.replace(regex, standard.toLowerCase());
      break; // Só uma substituição de modalidade
    }
  }
  
  return expanded;
}

// ============================================
// CONFIGURAÇÃO FUSE.JS - Keys corrigidas
// ============================================

// Configuração Fuse.js para templates - campos reais
const TEMPLATE_FUSE_OPTIONS = {
  keys: [
    { name: 'titulo', weight: 0.35 },
    { name: 'modalidade', weight: 0.25 },    // ✅ Campo real
    { name: 'regiao', weight: 0.20 },        // ✅ Campo real
    { name: 'tags', weight: 0.15 },
    { name: 'categoria', weight: 0.05 },
  ],
  threshold: 0.5,           // Mais tolerante para voz
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  findAllMatches: true,
};

// Configuração Fuse.js para frases - campos reais
const FRASE_FUSE_OPTIONS = {
  keys: [
    { name: 'codigo', weight: 0.25 },
    { name: 'categoria', weight: 0.20 },
    { name: 'sinônimos', weight: 0.20 },
    { name: 'modalidade_codigo', weight: 0.15 },  // ✅ Código normalizado
    { name: 'tags', weight: 0.10 },
    { name: 'texto', weight: 0.05 },
    { name: 'conclusao', weight: 0.05 },
  ],
  threshold: 0.5,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  findAllMatches: true,
};

// ============================================
// CONTEXT BOOST - Campos corrigidos
// ============================================

/**
 * Aplica boost contextual ao score baseado em modalidade/região atuais
 * Menor score = melhor match no Fuse.js
 */
function applyContextBoost<T extends { modalidade?: string; regiao?: string; modalidade_id?: string; modalidade_codigo?: string; regiao_codigo?: string }>(
  item: T,
  baseScore: number,
  context: SearchContext
): number {
  let boostedScore = baseScore;
  
  // Priorizar modalidade_codigo para frases (já normalizado)
  // Templates usam 'modalidade', frases usam 'modalidade_codigo'
  const itemMod = (item.modalidade_codigo || item.modalidade || '').toUpperCase();
  const itemReg = (item.regiao || item.regiao_codigo || '').toLowerCase();
  const contextMod = context.modalidade?.toUpperCase();
  const contextReg = context.regiao?.toLowerCase();
  
  // Debug log para verificar matching
  if (contextMod || contextReg) {
    console.log(`[ContextBoost] Item mod="${itemMod}", reg="${itemReg}" | Context mod="${contextMod}", reg="${contextReg}"`);
  }
  
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

// ============================================
// BUSCA PRINCIPAL - Templates
// ============================================

/**
 * Busca templates dinamicamente com normalização e fallback inteligente
 */
export function searchTemplates(
  query: string,
  templates: TemplateSearchItem[],
  context: SearchContext = {}
): TemplateSearchItem | null {
  if (!query.trim() || templates.length === 0) {
    return null;
  }
  
  // Normalizar query
  const normalizedQuery = normalizeQuery(query);
  const expandedQuery = expandQueryWithSynonyms(normalizedQuery);
  
  console.log(`[DynamicSearch] Query original: "${query}" → normalizada: "${expandedQuery}"`);
  
  // 1. Tentar Fuse.js primeiro
  const fuse = new Fuse(templates, TEMPLATE_FUSE_OPTIONS);
  const results = fuse.search(expandedQuery);
  
  if (results.length > 0) {
    // Aplicar boost contextual e ordenar
    const boostedResults = results.map(result => ({
      item: result.item,
      score: result.score ?? 1,
      boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
    }));
    
    boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
    
    const best = boostedResults[0];
    
    // Threshold de aceitação mais tolerante
    if (best.boostedScore <= 0.65) {
      console.log(`[DynamicSearch] Template encontrado: "${best.item.titulo}" (score: ${best.boostedScore.toFixed(3)})`);
      return best.item;
    }
    
    console.log(`[DynamicSearch] Template rejeitado por score: "${best.item.titulo}" (${best.boostedScore.toFixed(3)} > 0.65)`);
  }
  
  // 2. Fallback: busca por modalidade + região extraídas
  const { modality, region } = extractModalityAndRegion(normalizedQuery);
  
  if (modality || region) {
    console.log(`[DynamicSearch] Tentando fallback: modalidade=${modality}, região=${region}`);
    
    // Buscar templates que correspondem
    const fallbackMatches = templates.filter(t => {
      const modMatch = !modality || t.modalidade?.toUpperCase() === modality.toUpperCase();
      const regMatch = !region || t.regiao?.toLowerCase().includes(region);
      return modMatch && regMatch;
    });
    
    if (fallbackMatches.length > 0) {
      // Se múltiplos matches, preferir o mais curto (mais genérico)
      fallbackMatches.sort((a, b) => (a.titulo?.length || 0) - (b.titulo?.length || 0));
      
      const fallbackMatch = fallbackMatches[0];
      console.log(`[DynamicSearch] Fallback match: "${fallbackMatch.titulo}"`);
      return fallbackMatch;
    }
  }
  
  console.log(`[DynamicSearch] Nenhum template encontrado para: "${query}"`);
  return null;
}

// ============================================
// BUSCA PRINCIPAL - Frases
// ============================================

/**
 * Busca frases dinamicamente com normalização e fallback
 */
export function searchFrases(
  query: string,
  frases: FraseSearchItem[],
  context: SearchContext = {}
): FraseSearchItem | null {
  if (!query.trim() || frases.length === 0) {
    return null;
  }
  
  // Normalizar query
  const normalizedQuery = normalizeQuery(query);
  
  console.log(`[DynamicSearch] Frase query: "${query}" → normalizada: "${normalizedQuery}"`);
  
  // 1. Tentar Fuse.js primeiro
  const fuse = new Fuse(frases, FRASE_FUSE_OPTIONS);
  const results = fuse.search(normalizedQuery);
  
  if (results.length > 0) {
    // Aplicar boost contextual e ordenar
    const boostedResults = results.map(result => ({
      item: result.item,
      score: result.score ?? 1,
      boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
    }));
    
    boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
    
    const best = boostedResults[0];
    
    // Threshold de aceitação mais tolerante
    if (best.boostedScore <= 0.65) {
      console.log(`[DynamicSearch] Frase encontrada: "${best.item.codigo}" (score: ${best.boostedScore.toFixed(3)})`);
      return best.item;
    }
    
    console.log(`[DynamicSearch] Frase rejeitada por score: "${best.item.codigo}" (${best.boostedScore.toFixed(3)} > 0.65)`);
  }
  
  // 2. Fallback: busca parcial no código
  const fallbackMatch = frases.find(f => 
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, '_')) ||
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, ''))
  );
  
  if (fallbackMatch) {
    console.log(`[DynamicSearch] Fallback frase: "${fallbackMatch.codigo}"`);
    return fallbackMatch;
  }
  
  console.log(`[DynamicSearch] Nenhuma frase encontrada para: "${query}"`);
  return null;
}

// ============================================
// BUSCA MÚLTIPLA - Para sugestões
// ============================================

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
  
  const normalizedQuery = normalizeQuery(query);
  const expandedQuery = expandQueryWithSynonyms(normalizedQuery);
  
  const fuse = new Fuse(templates, TEMPLATE_FUSE_OPTIONS);
  const results = fuse.search(expandedQuery, { limit: limit * 2 });
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  return boostedResults
    .filter(r => r.boostedScore <= 0.7)
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
  
  const normalizedQuery = normalizeQuery(query);
  
  const fuse = new Fuse(frases, FRASE_FUSE_OPTIONS);
  const results = fuse.search(normalizedQuery, { limit: limit * 2 });
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  return boostedResults
    .filter(r => r.boostedScore <= 0.7)
    .slice(0, limit)
    .map(r => r.item);
}
