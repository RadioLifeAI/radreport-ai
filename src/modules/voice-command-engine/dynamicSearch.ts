/**
 * Voice Command Engine - Dynamic Search
 * Busca lazy de templates e frases sob demanda
 * 
 * v3.0 - Sistema robusto de priorização:
 * - Prioriza templates NORMAIS sem variáveis (~100% dos casos)
 * - Detecção de intent "alterado" via keywords de patologias/procedimentos
 * - Cascade de fallback: normal+sem vars → normal+com vars → alterado
 * - Boost contextual por modalidade/região/categoria
 */

import Fuse from 'fuse.js';

// ============================================
// INTERFACES - Expandidas com categoria e variáveis
// ============================================

export interface TemplateSearchItem {
  id: string;
  titulo: string;
  modalidade?: string;
  regiao?: string;
  tags?: string[];
  categoria?: string;           // 'normal' | 'alterado'
  conteudo_template?: string;
  variaveis?: any[];            // Para filtrar sem/com variáveis
}

export interface FraseSearchItem {
  id: string;
  codigo: string;
  texto?: string;
  frase?: string;
  categoria?: string;
  modalidade_id?: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  tags?: string[];
  sinônimos?: string[];
  conclusao?: string;
  variaveis?: any[];
}

export interface SearchContext {
  modalidade?: string | null;
  regiao?: string | null;
  // ✨ NOVOS FILTROS
  preferCategoria?: 'normal' | 'alterado' | 'any';
  preferSemVariaveis?: boolean;
  wantsAltered?: boolean;       // Detectado automaticamente por keywords
}

export interface SearchResult<T> {
  item: T;
  score: number;
  boostedScore: number;
}

// ============================================
// KEYWORDS PARA DETECÇÃO DE INTENT "ALTERADO"
// ============================================

const ALTERED_KEYWORDS = [
  // Procedimentos cirúrgicos (~35)
  'gastrectomia', 'colecistectomia', 'nefrectomia', 'histerectomia',
  'mastectomia', 'prostatectomia', 'hepatectomia', 'esplenectomia',
  'pancreatectomia', 'lobectomia', 'pneumonectomia', 'cistectomia',
  'orquiectomia', 'salpingectomia', 'ooforectomia', 'apendicectomia',
  'pos operatorio', 'posoperatorio', 'pós-operatório', 'cirurgia',
  'protese', 'prótese', 'stent', 'transplante', 'enxerto',
  'bypass', 'derivacao', 'anastomose', 'resseccao', 'amputacao',
  'shunt', 'cateter', 'dreno', 'ostomia', 'colostomia', 'ileostomia',
  
  // Patologias oncológicas (~25)
  'tumor', 'neoplasia', 'carcinoma', 'adenocarcinoma', 'linfoma',
  'sarcoma', 'melanoma', 'metastase', 'metástase', 'metastatico',
  'maligno', 'malignidade', 'cancer', 'câncer', 'oncologico',
  'adenoma', 'lipoma', 'hemangioma', 'papiloma', 'polipose',
  'displasia', 'hiperplasia', 'atipia', 'lesao', 'lesão',
  
  // Patologias hepáticas (~12)
  'cirrose', 'hepatopatia', 'esteatose', 'hepatomegalia',
  'hepatocarcinoma', 'hcc', 'colangiocarcinoma', 'hepatite',
  'fibrose', 'hipertensao portal', 'ascite', 'varizes',
  
  // Patologias renais (~10)
  'hidronefrose', 'litiase', 'litíase', 'calculo', 'cálculo',
  'nefrolitiase', 'ureterolitiase', 'insuficiencia renal',
  'nefropatia', 'rim policistico', 'doenca renal',
  
  // Patologias pulmonares (~12)
  'pneumotorax', 'pneumotórax', 'derrame', 'consolidacao', 'consolidação',
  'atelectasia', 'enfisema', 'fibrose pulmonar', 'bronquiectasia',
  'tuberculose', 'pneumonia', 'covid', 'sars',
  
  // Patologias vasculares (~10)
  'aneurisma', 'disseccao', 'trombose', 'embolia', 'estenose',
  'oclusao', 'oclusão', 'ateromatose', 'calcificacao', 'varizes',
  
  // Patologias ginecológicas (~10)
  'mioma', 'miomatose', 'endometriose', 'adenomiose',
  'cisto ovariano', 'teratoma', 'endometrial', 'polipose',
  'malformacao', 'malformação',
  
  // Patologias mamárias (~8)
  'nodulo', 'nódulo', 'massa', 'calcificacao', 'calcificação',
  'birads', 'bi-rads', 'fibroadenoma',
  
  // Patologias tireoidianas (~6)
  'tirads', 'ti-rads', 'bocio', 'bócio', 'tireoidite', 'hashimoto',
  
  // Outros (~8)
  'fratura', 'luxacao', 'luxação', 'hernia', 'hérnia',
  'abcesso', 'absesso', 'fistula', 'fístula',
];

/**
 * Detecta se a query indica busca por template ALTERADO
 */
function detectAlteredIntent(query: string): boolean {
  const normalized = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  return ALTERED_KEYWORDS.some(keyword => {
    const normalizedKeyword = keyword
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return normalized.includes(normalizedKeyword);
  });
}

// ============================================
// SINÔNIMOS E NORMALIZAÇÃO
// ============================================

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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bmodelo\b/g, '')
    .replace(/\bfrase\b/g, '')
    .replace(/\binserir\b/g, '')
    .replace(/\baplicar\b/g, '')
    .replace(/\s+de\s+/g, ' ')
    .replace(/\s+do\s+/g, ' ')
    .replace(/\s+da\s+/g, ' ')
    .replace(/\s+total\b/g, '')
    .replace(/\s+completo\b/g, '')
    .replace(/\s+normal\b/g, '')
    .replace(/\s+/g, ' ')
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
  
  for (const word of words) {
    if (MODALITY_MAP[word]) {
      modality = MODALITY_MAP[word];
      break;
    }
  }
  
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
  
  for (const [synonym, standard] of Object.entries(MODALITY_MAP)) {
    const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
    if (regex.test(expanded)) {
      expanded = expanded.replace(regex, standard.toLowerCase());
      break;
    }
  }
  
  return expanded;
}

// ============================================
// CONFIGURAÇÃO FUSE.JS - Otimizada
// ============================================

const TEMPLATE_FUSE_OPTIONS = {
  keys: [
    { name: 'titulo', weight: 0.40 },      // ↑ Título mais importante
    { name: 'modalidade', weight: 0.25 },
    { name: 'regiao', weight: 0.20 },
    { name: 'tags', weight: 0.10 },
    { name: 'categoria', weight: 0.05 },
  ],
  threshold: 0.55,          // ↓ Mais restritivo
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  findAllMatches: true,
  useExtendedSearch: true,
};

const FRASE_FUSE_OPTIONS = {
  keys: [
    { name: 'codigo', weight: 0.25 },
    { name: 'categoria', weight: 0.20 },
    { name: 'sinônimos', weight: 0.20 },
    { name: 'modalidade_codigo', weight: 0.15 },
    { name: 'tags', weight: 0.10 },
    { name: 'texto', weight: 0.05 },
    { name: 'conclusao', weight: 0.05 },
  ],
  threshold: 0.55,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  findAllMatches: true,
  useExtendedSearch: true,
};

// ============================================
// CONTEXT BOOST - Com categoria
// ============================================

interface BoostableItem {
  modalidade?: string;
  regiao?: string;
  modalidade_id?: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  categoria?: string;
  variaveis?: any[];
}

/**
 * Aplica boost contextual ao score baseado em modalidade/região/categoria
 */
function applyContextBoost<T extends BoostableItem>(
  item: T,
  baseScore: number,
  context: SearchContext
): number {
  let boostedScore = baseScore;
  
  const itemMod = (item.modalidade_codigo || item.modalidade || '').toUpperCase();
  const itemReg = (item.regiao || item.regiao_codigo || '').toLowerCase();
  const itemCat = (item.categoria || 'normal').toLowerCase();
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
  
  // ✨ Boost de categoria (quando não busca alterado)
  if (!context.wantsAltered && itemCat === 'normal') {
    boostedScore *= 0.8; // 20% boost para normais
  }
  
  // ✨ Boost para templates sem variáveis
  if (context.preferSemVariaveis !== false) {
    const hasVars = item.variaveis && item.variaveis.length > 0;
    if (!hasVars) {
      boostedScore *= 0.85; // 15% boost para sem variáveis
    }
  }
  
  return boostedScore;
}

// ============================================
// BUSCA COM FUSE.JS - Função auxiliar
// ============================================

function searchWithFuse<T extends BoostableItem>(
  items: T[],
  query: string,
  context: SearchContext,
  options: any,
  acceptThreshold: number = 0.65
): T | null {
  if (items.length === 0) return null;
  
  const fuse = new Fuse(items, options);
  const results = fuse.search(query);
  
  if (results.length === 0) return null;
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  const best = boostedResults[0];
  
  if (best.boostedScore <= acceptThreshold) {
    return best.item;
  }
  
  return null;
}

// ============================================
// BUSCA PRINCIPAL - Templates com Priorização
// ============================================

/**
 * Busca templates com priorização:
 * 1. Normal + Sem variáveis (prioritário)
 * 2. Normal + Com variáveis (fallback)
 * 3. Alterado (apenas se keyword detectado)
 */
export function searchTemplates(
  query: string,
  templates: TemplateSearchItem[],
  context: SearchContext = {}
): TemplateSearchItem | null {
  if (!query.trim() || templates.length === 0) {
    return null;
  }
  
  // Detectar se quer template alterado
  const wantsAltered = detectAlteredIntent(query);
  const enhancedContext: SearchContext = { ...context, wantsAltered };
  
  // Normalizar query
  const normalizedQuery = normalizeQuery(query);
  const expandedQuery = expandQueryWithSynonyms(normalizedQuery);
  
  console.log(`[DynamicSearch] ========================================`);
  console.log(`[DynamicSearch] 📥 Query: "${query}"`);
  console.log(`[DynamicSearch] 📝 Normalizada: "${expandedQuery}"`);
  console.log(`[DynamicSearch] 🎯 Modo: ${wantsAltered ? '🔴 ALTERADO' : '🟢 NORMAL'}`);
  console.log(`[DynamicSearch] 📊 Total templates: ${templates.length}`);
  
  // Estatísticas de templates
  const normaisSemVars = templates.filter(t => 
    (t.categoria === 'normal' || !t.categoria) && (!t.variaveis || t.variaveis.length === 0)
  );
  const normaisComVars = templates.filter(t => 
    (t.categoria === 'normal' || !t.categoria) && (t.variaveis && t.variaveis.length > 0)
  );
  const alterados = templates.filter(t => t.categoria === 'alterado');
  
  console.log(`[DynamicSearch] 📄 Normais sem vars: ${normaisSemVars.length}`);
  console.log(`[DynamicSearch] 📋 Normais com vars: ${normaisComVars.length}`);
  console.log(`[DynamicSearch] 🔴 Alterados: ${alterados.length}`);
  
  // =============================================
  // CASCADE DE BUSCA COM PRIORIZAÇÃO
  // =============================================
  
  if (wantsAltered) {
    // Modo ALTERADO: buscar em alterados primeiro, depois normais
    console.log(`[DynamicSearch] 🔍 Buscando em alterados primeiro...`);
    
    // 1º Alterados
    let match = searchWithFuse(alterados, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado ALTERADO: "${match.titulo}"`);
      return match;
    }
    
    // 2º Fallback para normais sem vars
    console.log(`[DynamicSearch] 🔍 Fallback: normais sem variáveis...`);
    match = searchWithFuse(normaisSemVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL sem vars: "${match.titulo}"`);
      return match;
    }
    
    // 3º Fallback para normais com vars
    console.log(`[DynamicSearch] 🔍 Fallback: normais com variáveis...`);
    match = searchWithFuse(normaisComVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL com vars: "${match.titulo}"`);
      return match;
    }
    
  } else {
    // Modo NORMAL: buscar APENAS em normais, priorizar sem variáveis
    
    // 1º Normais sem variáveis (PRIORIDADE MÁXIMA)
    console.log(`[DynamicSearch] 🔍 Buscando em normais SEM variáveis...`);
    let match = searchWithFuse(normaisSemVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL sem vars: "${match.titulo}"`);
      return match;
    }
    
    // 2º Normais com variáveis (fallback)
    console.log(`[DynamicSearch] 🔍 Fallback: normais COM variáveis...`);
    match = searchWithFuse(normaisComVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL com vars: "${match.titulo}"`);
      return match;
    }
    
    // NÃO buscar em alterados no modo normal!
  }
  
  // =============================================
  // FALLBACK FINAL: Busca por modalidade + região
  // =============================================
  
  const { modality, region } = extractModalityAndRegion(normalizedQuery);
  
  if (modality || region) {
    console.log(`[DynamicSearch] 🔍 Fallback modalidade/região: mod=${modality}, reg=${region}`);
    
    // Candidatos por modalidade/região
    const candidatos = wantsAltered ? alterados : [...normaisSemVars, ...normaisComVars];
    
    const fallbackMatches = candidatos.filter(t => {
      const modMatch = !modality || t.modalidade?.toUpperCase() === modality.toUpperCase();
      const regMatch = !region || t.regiao?.toLowerCase().includes(region);
      return modMatch && regMatch;
    });
    
    if (fallbackMatches.length > 0) {
      // Priorizar sem variáveis no fallback também
      const semVars = fallbackMatches.filter(t => !t.variaveis || t.variaveis.length === 0);
      const prioritized = semVars.length > 0 ? semVars : fallbackMatches;
      
      // Se múltiplos matches, preferir título mais curto (mais genérico)
      prioritized.sort((a, b) => (a.titulo?.length || 0) - (b.titulo?.length || 0));
      
      const fallbackMatch = prioritized[0];
      console.log(`[DynamicSearch] ✅ Fallback match: "${fallbackMatch.titulo}"`);
      return fallbackMatch;
    }
  }
  
  console.log(`[DynamicSearch] ❌ Nenhum template encontrado`);
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
  
  const normalizedQuery = normalizeQuery(query);
  
  console.log(`[DynamicSearch] 📥 Frase query: "${query}" → "${normalizedQuery}"`);
  
  // Buscar com Fuse.js
  const match = searchWithFuse(frases, normalizedQuery, context, FRASE_FUSE_OPTIONS);
  
  if (match) {
    console.log(`[DynamicSearch] ✅ Frase encontrada: "${match.codigo}"`);
    return match;
  }
  
  // Fallback: busca parcial no código
  const fallbackMatch = frases.find(f => 
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, '_')) ||
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, ''))
  );
  
  if (fallbackMatch) {
    console.log(`[DynamicSearch] ✅ Fallback frase: "${fallbackMatch.codigo}"`);
    return fallbackMatch;
  }
  
  console.log(`[DynamicSearch] ❌ Nenhuma frase encontrada`);
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
  
  const wantsAltered = detectAlteredIntent(query);
  const enhancedContext: SearchContext = { ...context, wantsAltered };
  
  const normalizedQuery = normalizeQuery(query);
  const expandedQuery = expandQueryWithSynonyms(normalizedQuery);
  
  // Filtrar candidatos baseado no modo
  let candidatos: TemplateSearchItem[];
  
  if (wantsAltered) {
    candidatos = templates.filter(t => t.categoria === 'alterado');
    // Incluir normais também se poucos alterados
    if (candidatos.length < limit) {
      const normais = templates.filter(t => t.categoria !== 'alterado');
      candidatos = [...candidatos, ...normais];
    }
  } else {
    // Modo normal: apenas normais, priorizar sem variáveis
    candidatos = templates.filter(t => t.categoria === 'normal' || !t.categoria);
  }
  
  const fuse = new Fuse(candidatos, TEMPLATE_FUSE_OPTIONS);
  const results = fuse.search(expandedQuery, { limit: limit * 2 });
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, enhancedContext),
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

// ============================================
// EXPORTS AUXILIARES
// ============================================

export { detectAlteredIntent, ALTERED_KEYWORDS };
