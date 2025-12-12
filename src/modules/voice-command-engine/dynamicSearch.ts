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
  // Abdome
  'abdome': 'abdome',
  'abdominal': 'abdome',
  'abd': 'abdome',
  
  // Tórax
  'torax': 'torax',
  'tórax': 'torax',
  'toracico': 'torax',
  
  // Pelve
  'pelve': 'pelve',
  'pelvico': 'pelve',
  'pélvico': 'pelve',
  
  // Crânio
  'cranio': 'cranio',
  'crânio': 'cranio',
  'cabeca': 'cranio',
  'cabeça': 'cranio',
  'cerebro': 'cranio',
  'encefalo': 'cranio',
  
  // Coluna
  'coluna': 'coluna',
  'lombar': 'coluna',
  'lombossacra': 'coluna',
  'toracica': 'coluna',
  'dorsal': 'coluna',
  'sacro': 'coluna',
  'sacroiliaca': 'coluna',
  'coccix': 'coluna',
  
  // Cervical (pescoço/tireoide)
  'cervical': 'cervical',
  'pescoco': 'cervical',
  'pescoço': 'cervical',
  'tireoide': 'cervical',
  'tireóide': 'cervical',
  
  // Mama
  'mama': 'mama',
  'mamas': 'mama',
  'mamario': 'mama',
  'mamária': 'mama',
  
  // Obstétrico
  'obstetrico': 'obstetrico',
  'obstetríco': 'obstetrico',
  'gestacao': 'obstetrico',
  'fetal': 'obstetrico',
  
  // Escroto
  'escroto': 'escroto',
  'testicular': 'escroto',
  
  // Vascular
  'vascular': 'vascular',
  'doppler': 'vascular',
  
  // ✨ EXTREMIDADES SUPERIORES
  'mao': 'ext_superior',
  'mão': 'ext_superior',
  'punho': 'ext_superior',
  'antebraco': 'ext_superior',
  'antebraço': 'ext_superior',
  'cotovelo': 'ext_superior',
  'braco': 'ext_superior',
  'braço': 'ext_superior',
  'ombro': 'ext_superior',
  'clavicula': 'ext_superior',
  'clavícula': 'ext_superior',
  'escapula': 'ext_superior',
  'escápula': 'ext_superior',
  'umero': 'ext_superior',
  'úmero': 'ext_superior',
  'radio': 'ext_superior',
  'rádio': 'ext_superior',
  'ulna': 'ext_superior',
  'dedos mao': 'ext_superior',
  'carpo': 'ext_superior',
  'metacarpo': 'ext_superior',
  
  // ✨ EXTREMIDADES INFERIORES
  'pe': 'ext_inferior',
  'pé': 'ext_inferior',
  'tornozelo': 'ext_inferior',
  'perna': 'ext_inferior',
  'joelho': 'ext_inferior',
  'coxa': 'ext_inferior',
  'femur': 'ext_inferior',
  'fêmur': 'ext_inferior',
  'quadril': 'ext_inferior',
  'bacia': 'ext_inferior',
  'patela': 'ext_inferior',
  'tibia': 'ext_inferior',
  'tíbia': 'ext_inferior',
  'fibula': 'ext_inferior',
  'fíbula': 'ext_inferior',
  'dedos pe': 'ext_inferior',
  'calcaneo': 'ext_inferior',
  'calcâneo': 'ext_inferior',
  'tarso': 'ext_inferior',
  'metatarso': 'ext_inferior',
};

/**
 * Mapa de expansão de abreviações para busca no título
 */
const MODALITY_FULL_NAMES: Record<string, string[]> = {
  'rx': ['radiografia', 'raio', 'raios'],
  'tc': ['tomografia', 'computadorizada'],
  'rm': ['ressonancia', 'magnetica'],
  'usg': ['ultrassonografia', 'ultrassom', 'ecografia'],
  'us': ['ultrassonografia', 'ultrassom'],
  'mg': ['mamografia'],
};

/**
 * Normaliza título para comparação (remove preposições e sufixos)
 */
function normalizeTitle(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+da\s+/g, ' ')
    .replace(/\s+do\s+/g, ' ')
    .replace(/\s+de\s+/g, ' ')
    .replace(/\s+das\s+/g, ' ')
    .replace(/\s+dos\s+/g, ' ')
    .replace(/\s+—\s+.*$/g, '')      // Remove "— Direita (Normal)"
    .replace(/\s*\(.*?\)\s*/g, ' ')  // Remove "(Normal)", "(Alterado)"
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Expande abreviações da query para match no título
 * "rx mao" → ["radiografia", "mao"]
 */
function expandQueryWords(query: string): string[] {
  const words = query.split(' ').filter(w => w.length >= 2);
  const expanded: string[] = [];
  
  for (const word of words) {
    const expansion = MODALITY_FULL_NAMES[word];
    if (expansion) {
      // Adicionar apenas a primeira expansão (a mais comum)
      expanded.push(expansion[0]);
    } else {
      expanded.push(word);
    }
  }
  
  return expanded;
}

/**
 * ✨ BUSCA DIRETA NO TÍTULO - Prioridade máxima
 * Antes do Fuse.js, busca por substring no título normalizado
 */
function searchDirectInTitle(
  query: string,
  templates: TemplateSearchItem[]
): TemplateSearchItem | null {
  const normalizedQuery = normalizeTitle(query);
  const queryWords = expandQueryWords(normalizedQuery);
  
  console.log(`[DirectSearch] 🔤 Query words: [${queryWords.join(', ')}]`);
  
  if (queryWords.length === 0) return null;
  
  // FASE 1: Busca EXATA - todas as palavras no título
  for (const template of templates) {
    const tituloNorm = normalizeTitle(template.titulo || '');
    
    const allMatch = queryWords.every(word => tituloNorm.includes(word));
    
    if (allMatch) {
      console.log(`[DirectSearch] ✅ Match EXATO: "${template.titulo}" (titulo norm: "${tituloNorm}")`);
      return template;
    }
  }
  
  // FASE 2: Busca PARCIAL - pelo menos 60% das palavras (mínimo 1)
  const minMatches = Math.max(1, Math.ceil(queryWords.length * 0.6));
  let bestMatch: TemplateSearchItem | null = null;
  let bestScore = 0;
  
  for (const template of templates) {
    const tituloNorm = normalizeTitle(template.titulo || '');
    
    const matchCount = queryWords.filter(word => tituloNorm.includes(word)).length;
    
    // Deve ter pelo menos 2 palavras ou 60% de match
    if (matchCount >= minMatches && matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = template;
    }
  }
  
  if (bestMatch) {
    console.log(`[DirectSearch] ✅ Match PARCIAL (${bestScore}/${queryWords.length}): "${bestMatch.titulo}"`);
  }
  
  return bestMatch;
}

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
    { name: 'categoria', weight: 0.40 },       // ↑ DOMINANTE - equivalente ao titulo
    { name: 'texto', weight: 0.20 },           // ↑ Aumentado - conteúdo descritivo
    { name: 'codigo', weight: 0.15 },          // ↓ Reduzido
    { name: 'sinônimos', weight: 0.15 },
    { name: 'modalidade_codigo', weight: 0.05 },
    { name: 'tags', weight: 0.05 },
  ],
  threshold: 0.50,  // Mais restritivo
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
 * 0. ✨ BUSCA DIRETA NO TÍTULO (PRIORIDADE MÁXIMA)
 * 1. Normal + Sem variáveis (Fuse.js)
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
  console.log(`[DynamicSearch] 📝 Normalizada: "${normalizedQuery}"`);
  console.log(`[DynamicSearch] 🔤 Expandida Fuse: "${expandedQuery}"`);
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
  // ✨ FASE 0: BUSCA DIRETA NO TÍTULO (PRIORIDADE MÁXIMA)
  // =============================================
  
  // Definir candidatos baseado no modo
  const candidatosDiretos = wantsAltered 
    ? alterados 
    : [...normaisSemVars, ...normaisComVars];
  
  console.log(`[DynamicSearch] 🔍 FASE 0: Busca DIRETA no título...`);
  const directMatch = searchDirectInTitle(normalizedQuery, candidatosDiretos);
  if (directMatch) {
    console.log(`[DynamicSearch] ✅ FASE 0: Match DIRETO no título: "${directMatch.titulo}"`);
    return directMatch;
  }
  
  // =============================================
  // CASCADE DE BUSCA COM FUSE.JS
  // =============================================
  
  if (wantsAltered) {
    // Modo ALTERADO: buscar em alterados primeiro, depois normais
    console.log(`[DynamicSearch] 🔍 FASE 1: Fuse.js em alterados...`);
    
    // 1º Alterados
    let match = searchWithFuse(alterados, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado ALTERADO: "${match.titulo}"`);
      return match;
    }
    
    // 2º Fallback para normais sem vars
    console.log(`[DynamicSearch] 🔍 FASE 2: Fuse.js normais sem variáveis...`);
    match = searchWithFuse(normaisSemVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL sem vars: "${match.titulo}"`);
      return match;
    }
    
    // 3º Fallback para normais com vars
    console.log(`[DynamicSearch] 🔍 FASE 3: Fuse.js normais com variáveis...`);
    match = searchWithFuse(normaisComVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL com vars: "${match.titulo}"`);
      return match;
    }
    
  } else {
    // Modo NORMAL: buscar APENAS em normais, priorizar sem variáveis
    
    // 1º Normais sem variáveis
    console.log(`[DynamicSearch] 🔍 FASE 1: Fuse.js normais SEM variáveis...`);
    let match = searchWithFuse(normaisSemVars, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS);
    if (match) {
      console.log(`[DynamicSearch] ✅ Encontrado NORMAL sem vars: "${match.titulo}"`);
      return match;
    }
    
    // 2º Normais com variáveis (fallback)
    console.log(`[DynamicSearch] 🔍 FASE 2: Fuse.js normais COM variáveis...`);
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
// BUSCA DIRETA - Categoria (para Frases)
// ============================================

/**
 * Busca DIRETA no campo categoria das frases (PRIORIDADE MÁXIMA)
 * Similar a searchDirectInTitle para templates
 */
function searchDirectInCategoria(
  query: string,
  frases: FraseSearchItem[]
): FraseSearchItem | null {
  if (!query || frases.length === 0) return null;
  
  // Normalizar query
  const normalizedQuery = normalizeTitle(query);
  const queryWords = expandQueryWords(query);
  
  console.log(`[DirectSearch-Frase] 🔍 Query: "${query}"`);
  console.log(`[DirectSearch-Frase] 📝 Normalizada: "${normalizedQuery}"`);
  console.log(`[DirectSearch-Frase] 🔤 Palavras expandidas: [${queryWords.join(', ')}]`);
  
  // FASE 1: Busca EXATA na categoria - todas as palavras devem estar presentes
  for (const frase of frases) {
    const categoriaNorm = normalizeTitle(frase.categoria || '');
    
    if (!categoriaNorm) continue;
    
    // Verificar se TODAS as palavras da query estão na categoria
    const allMatch = queryWords.length > 0 && queryWords.every(word => 
      categoriaNorm.includes(word)
    );
    
    if (allMatch) {
      console.log(`[DirectSearch-Frase] ✅ Match EXATO categoria: "${frase.categoria}" (código: ${frase.codigo})`);
      return frase;
    }
  }
  
  // FASE 2: Busca PARCIAL na categoria (60% das palavras)
  const minMatches = Math.max(1, Math.ceil(queryWords.length * 0.6));
  let bestMatch: FraseSearchItem | null = null;
  let bestScore = 0;
  
  for (const frase of frases) {
    const categoriaNorm = normalizeTitle(frase.categoria || '');
    
    if (!categoriaNorm) continue;
    
    const matchCount = queryWords.filter(word => 
      categoriaNorm.includes(word)
    ).length;
    
    if (matchCount >= minMatches && matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = frase;
    }
  }
  
  if (bestMatch) {
    console.log(`[DirectSearch-Frase] ✅ Match PARCIAL categoria (${bestScore}/${queryWords.length}): "${bestMatch.categoria}" (código: ${bestMatch.codigo})`);
    return bestMatch;
  }
  
  // FASE 3: Busca no texto (conteúdo da frase) como fallback
  for (const frase of frases) {
    const textoNorm = normalizeTitle(frase.texto || '');
    
    // Buscar palavras-chave no início do texto
    const textWords = textoNorm.split(' ').slice(0, 10); // Primeiras 10 palavras
    
    const matchCount = queryWords.filter(word => 
      textWords.some(tw => tw.includes(word) || word.includes(tw))
    ).length;
    
    if (matchCount >= minMatches) {
      console.log(`[DirectSearch-Frase] ✅ Match no TEXTO: "${frase.categoria || frase.codigo}"`);
      return frase;
    }
  }
  
  console.log(`[DirectSearch-Frase] ❌ Nenhum match direto encontrado`);
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
  
  console.log(`[DynamicSearch] ========================================`);
  console.log(`[DynamicSearch] 📥 Frase query original: "${query}"`);
  console.log(`[DynamicSearch] 📝 Frase query normalizada: "${normalizedQuery}"`);
  console.log(`[DynamicSearch] 📊 Total frases disponíveis: ${frases.length}`);
  
  // ✨ FASE 0: Busca DIRETA na categoria (PRIORIDADE MÁXIMA)
  const directMatch = searchDirectInCategoria(normalizedQuery, frases);
  if (directMatch) {
    console.log(`[DynamicSearch] ✅ Frase encontrada via BUSCA DIRETA: "${directMatch.categoria}" (${directMatch.codigo})`);
    return directMatch;
  }
  
  // FASE 1: Buscar com Fuse.js (fallback)
  console.log(`[DynamicSearch] 🔄 Tentando Fuse.js como fallback...`);
  const match = searchWithFuse(frases, normalizedQuery, context, FRASE_FUSE_OPTIONS);
  
  if (match) {
    console.log(`[DynamicSearch] ✅ Frase encontrada via Fuse.js: "${match.categoria}" (${match.codigo})`);
    return match;
  }
  
  // FASE 2: Fallback final - busca parcial no código
  const fallbackMatch = frases.find(f => 
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, '_')) ||
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, ''))
  );
  
  if (fallbackMatch) {
    console.log(`[DynamicSearch] ✅ Fallback frase (código): "${fallbackMatch.codigo}"`);
    return fallbackMatch;
  }
  
  console.log(`[DynamicSearch] ❌ Nenhuma frase encontrada para: "${query}"`);
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
