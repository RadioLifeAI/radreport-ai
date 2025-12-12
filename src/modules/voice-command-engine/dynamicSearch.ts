/**
 * Voice Command Engine - Dynamic Search
 * Busca lazy de templates e frases sob demanda
 * 
 * v5.0 - BUSCA DINÂMICA 100% BASEADA NO TÍTULO COM CASCATA:
 * - Extrai palavras-chave do comando do usuário
 * - Busca primeiro por 100% das palavras no título
 * - Cascata: reduz palavras progressivamente (100% → 90% → 80%...)
 * - Prioriza match exato no título antes de qualquer fuzzy
 * - Zero dependência de MAPs estáticos para busca primária
 * - Fuse.js apenas como fallback final
 */

import Fuse from 'fuse.js';

// ============================================
// STOP WORDS - Palavras ignoradas na extração
// ============================================

const STOP_WORDS = new Set([
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  'e', 'ou', 'com', 'para', 'por', 'que', 'se',
  'modelo', 'modelos', 'template', 'templates',
  'frase', 'frases', 'inserir', 'aplicar', 'adicionar', 'colocar', 'usar',
]);

// ============================================
// INTERFACES
// ============================================

export interface TemplateSearchItem {
  id: string;
  titulo: string;
  modalidade?: string;
  regiao?: string;
  tags?: string[];
  categoria?: string;           // 'normal' | 'alterado'
  conteudo_template?: string;
  variaveis?: any[];
}

export interface FraseSearchItem {
  id: string;
  codigo: string;
  titulo?: string;
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
  preferCategoria?: 'normal' | 'alterado' | 'any';
  preferSemVariaveis?: boolean;
  wantsAltered?: boolean;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  boostedScore: number;
}

// ============================================
// QUALIFICADORES DE INTENSIDADE
// ============================================

/**
 * Qualificadores para diferenciar frases similares
 * Ex: "esteatose leve" vs "esteatose moderada" vs "esteatose acentuada"
 */
const INTENSITY_QUALIFIERS: Record<string, string[]> = {
  'leve': ['leve', 'discreta', 'pequena', 'minima', 'mínima', 'inicial', 'incipiente'],
  'moderada': ['moderada', 'media', 'média', 'moderado'],
  'acentuada': ['acentuada', 'grave', 'severa', 'intensa', 'importante', 'avancada', 'avançada', 'marcada'],
  'difusa': ['difusa', 'difuso', 'generalizada', 'generalizado', 'extensa', 'extenso'],
  'focal': ['focal', 'localizada', 'localizado', 'segmentar', 'parcial'],
  'bilateral': ['bilateral', 'bilaterais', 'ambos', 'ambas'],
  'unilateral': ['unilateral', 'direita', 'esquerda', 'direito', 'esquerdo'],
  'aguda': ['aguda', 'agudo', 'recente', 'nova', 'novo'],
  'cronica': ['cronica', 'crônica', 'cronico', 'crônico', 'antiga', 'antigo'],
};

/**
 * Verifica se a query tem qualificador que o título deve ter
 */
function matchIntensityQualifier(query: string, titulo: string): boolean {
  const queryNorm = normalizeTitle(query);
  const tituloNorm = normalizeTitle(titulo);
  
  for (const [key, synonyms] of Object.entries(INTENSITY_QUALIFIERS)) {
    // Query pede esse qualificador?
    const queryHasQualifier = synonyms.some(s => queryNorm.includes(s)) || queryNorm.includes(key);
    
    // Título tem esse qualificador?
    const tituloHasQualifier = synonyms.some(s => tituloNorm.includes(s)) || tituloNorm.includes(key);
    
    // Se query pede mas título não tem → rejeitar
    if (queryHasQualifier && !tituloHasQualifier) {
      return false;
    }
    
    // Se query pede e título tem → match perfeito
    if (queryHasQualifier && tituloHasQualifier) {
      return true;
    }
  }
  
  // Sem qualificador na query → aceitar qualquer título
  return true;
}

/**
 * Extrai qualificadores da query para scoring
 */
function extractQualifiers(text: string): string[] {
  const normalized = normalizeTitle(text);
  const found: string[] = [];
  
  for (const [key, synonyms] of Object.entries(INTENSITY_QUALIFIERS)) {
    if (synonyms.some(s => normalized.includes(s)) || normalized.includes(key)) {
      found.push(key);
    }
  }
  
  return found;
}

// ============================================
// KEYWORDS PARA DETECÇÃO DE INTENT "ALTERADO"
// ============================================

const ALTERED_KEYWORDS = [
  // Procedimentos cirúrgicos
  'gastrectomia', 'colecistectomia', 'nefrectomia', 'histerectomia',
  'mastectomia', 'prostatectomia', 'hepatectomia', 'esplenectomia',
  'pancreatectomia', 'lobectomia', 'pneumonectomia', 'cistectomia',
  'orquiectomia', 'salpingectomia', 'ooforectomia', 'apendicectomia',
  'pos operatorio', 'posoperatorio', 'pós-operatório', 'cirurgia',
  'protese', 'prótese', 'stent', 'transplante', 'enxerto',
  'bypass', 'derivacao', 'anastomose', 'resseccao', 'amputacao',
  'shunt', 'cateter', 'dreno', 'ostomia', 'colostomia', 'ileostomia',
  
  // Patologias oncológicas
  'tumor', 'neoplasia', 'carcinoma', 'adenocarcinoma', 'linfoma',
  'sarcoma', 'melanoma', 'metastase', 'metástase', 'metastatico',
  'maligno', 'malignidade', 'cancer', 'câncer', 'oncologico',
  'adenoma', 'lipoma', 'hemangioma', 'papiloma', 'polipose',
  'displasia', 'hiperplasia', 'atipia', 'lesao', 'lesão',
  
  // Patologias hepáticas
  'cirrose', 'hepatopatia', 'esteatose', 'hepatomegalia',
  'hepatocarcinoma', 'hcc', 'colangiocarcinoma', 'hepatite',
  'fibrose', 'hipertensao portal', 'ascite', 'varizes',
  
  // Patologias renais
  'hidronefrose', 'litiase', 'litíase', 'calculo', 'cálculo',
  'nefrolitiase', 'ureterolitiase', 'insuficiencia renal',
  'nefropatia', 'rim policistico', 'doenca renal',
  
  // Patologias pulmonares
  'pneumotorax', 'pneumotórax', 'derrame', 'consolidacao', 'consolidação',
  'atelectasia', 'enfisema', 'fibrose pulmonar', 'bronquiectasia',
  'tuberculose', 'pneumonia', 'covid', 'sars',
  
  // Patologias vasculares
  'aneurisma', 'disseccao', 'trombose', 'embolia', 'estenose',
  'oclusao', 'oclusão', 'ateromatose', 'calcificacao', 'varizes',
  
  // Patologias ginecológicas
  'mioma', 'miomatose', 'endometriose', 'adenomiose',
  'cisto ovariano', 'teratoma', 'endometrial', 'polipose',
  'malformacao', 'malformação',
  
  // Patologias mamárias
  'nodulo', 'nódulo', 'massa', 'calcificacao', 'calcificação',
  'birads', 'bi-rads', 'fibroadenoma',
  
  // Patologias tireoidianas
  'tirads', 'ti-rads', 'bocio', 'bócio', 'tireoidite', 'hashimoto',
  
  // Outros
  'fratura', 'luxacao', 'luxação', 'hernia', 'hérnia',
  'abcesso', 'absesso', 'fistula', 'fístula',
];

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
// MAPAS DE SINÔNIMOS
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
  'figado': 'abdome',
  'fígado': 'abdome',
  'hepatico': 'abdome',
  'hepático': 'abdome',
  'vesicula': 'abdome',
  'vesícula': 'abdome',
  'baco': 'abdome',
  'baço': 'abdome',
  'pancreas': 'abdome',
  'pâncreas': 'abdome',
  'rim': 'abdome',
  'renal': 'abdome',
  
  // Tórax
  'torax': 'torax',
  'tórax': 'torax',
  'toracico': 'torax',
  'pulmao': 'torax',
  'pulmão': 'torax',
  'pulmonar': 'torax',
  
  // Pelve
  'pelve': 'pelve',
  'pelvico': 'pelve',
  'pélvico': 'pelve',
  'utero': 'pelve',
  'útero': 'pelve',
  'ovario': 'pelve',
  'ovário': 'pelve',
  'prostata': 'pelve',
  'próstata': 'pelve',
  'bexiga': 'pelve',
  
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
  
  // Cervical
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
  
  // Extremidades superiores
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
  'carpo': 'ext_superior',
  'metacarpo': 'ext_superior',
  
  // Extremidades inferiores
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
  'calcaneo': 'ext_inferior',
  'calcâneo': 'ext_inferior',
  'tarso': 'ext_inferior',
  'metatarso': 'ext_inferior',
};

const MODALITY_FULL_NAMES: Record<string, string[]> = {
  'rx': ['radiografia', 'raio', 'raios'],
  'tc': ['tomografia', 'computadorizada'],
  'rm': ['ressonancia', 'magnetica'],
  'usg': ['ultrassonografia', 'ultrassom', 'ecografia'],
  'us': ['ultrassonografia', 'ultrassom'],
  'mg': ['mamografia'],
};

// ============================================
// FUNÇÕES DE NORMALIZAÇÃO
// ============================================

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
    .replace(/\s+—\s+.*$/g, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bmodelos?\b/g, '')
    .replace(/\bfrases?\b/g, '')
    .replace(/\binserir\b/g, '')
    .replace(/\baplicar\b/g, '')
    .replace(/\badicionar\b/g, '')
    .replace(/\bcolocar\b/g, '')
    .replace(/\busar\b/g, '')
    // Preposições - remover para normalização
    .replace(/\bde\b/g, ' ')
    .replace(/\bdo\b/g, ' ')
    .replace(/\bda\b/g, ' ')
    .replace(/\bdos\b/g, ' ')
    .replace(/\bdas\b/g, ' ')
    // ❌ NÃO REMOVER: total, completo, superior, inferior - são DIFERENCIADORES CRÍTICOS!
    // .replace(/\s+total\b/g, '')     // REMOVIDO - diferenciador
    // .replace(/\s+completo\b/g, '')  // REMOVIDO - diferenciador
    // .replace(/\s+normal\b/g, '')    // REMOVIDO - diferenciador
    .replace(/\s+/g, ' ')
    .trim();
}

function expandQueryWords(query: string): string[] {
  const normalized = normalizeTitle(query);
  const words = normalized.split(' ').filter(w => w.length >= 2);
  const expanded: string[] = [];
  
  for (const word of words) {
    const expansion = MODALITY_FULL_NAMES[word];
    if (expansion) {
      expanded.push(expansion[0]);
    } else {
      expanded.push(word);
    }
  }
  
  return expanded;
}

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
// PRÉ-FILTRAGEM POR MODALIDADE/REGIÃO
// ============================================

interface PreFilterResult<T> {
  filtered: T[];
  all: T[];
}

/**
 * PRÉ-FILTRA frases por modalidade e região ANTES da busca fuzzy
 * Reduz 400+ frases para ~30-80 candidatos relevantes
 */
function preFilterFrases(
  frases: FraseSearchItem[],
  context: SearchContext
): PreFilterResult<FraseSearchItem> {
  const { modalidade, regiao } = context;
  
  if (!modalidade && !regiao) {
    return { filtered: frases, all: frases };
  }
  
  // FASE 1: Filtrar por modalidade
  let filtered = modalidade 
    ? frases.filter(f => {
        const mod = (f.modalidade_codigo || '').toUpperCase();
        // Aceita match exato OU frases sem modalidade específica
        return mod === modalidade.toUpperCase() || mod === '' || !mod;
      })
    : frases;
  
  // FASE 2: Filtrar por região (se aplicável e ainda tiver candidatos suficientes)
  if (regiao && filtered.length > 15) {
    const byRegion = filtered.filter(f => {
      const reg = (f.regiao_codigo || '').toLowerCase();
      return reg.includes(regiao.toLowerCase()) || reg === '' || !reg;
    });
    
    // Só aplicar filtro de região se sobrar candidatos suficientes
    if (byRegion.length >= 5) {
      filtered = byRegion;
    }
  }
  
  console.log(`[PreFilter] ${frases.length} → ${filtered.length} frases (mod: ${modalidade || 'any'}, reg: ${regiao || 'any'})`);
  
  return { filtered, all: frases };
}

/**
 * PRÉ-FILTRA templates por modalidade e região
 */
function preFilterTemplates(
  templates: TemplateSearchItem[],
  context: SearchContext
): PreFilterResult<TemplateSearchItem> {
  const { modalidade, regiao } = context;
  
  if (!modalidade && !regiao) {
    return { filtered: templates, all: templates };
  }
  
  let filtered = modalidade 
    ? templates.filter(t => {
        const mod = (t.modalidade || '').toUpperCase();
        return mod === modalidade.toUpperCase() || mod === '' || !mod;
      })
    : templates;
  
  if (regiao && filtered.length > 10) {
    const byRegion = filtered.filter(t => {
      const reg = (t.regiao || '').toLowerCase();
      return reg.includes(regiao.toLowerCase()) || reg === '' || !reg;
    });
    
    if (byRegion.length >= 3) {
      filtered = byRegion;
    }
  }
  
  console.log(`[PreFilter] ${templates.length} → ${filtered.length} templates (mod: ${modalidade || 'any'}, reg: ${regiao || 'any'})`);
  
  return { filtered, all: templates };
}

// ============================================
// SUB-REGIÕES DIFERENCIADORES
// ============================================

/**
 * Mapa de sub-regiões que diferenciam templates similares
 * Ex: "abdome total" vs "abdome superior"
 */
const SUBREGION_KEYWORDS = [
  'total', 'completo', 'completa',
  'superior', 'inferior',
  'direito', 'direita', 'esquerdo', 'esquerda',
  'bilateral', 'bilaterais',
  'anterior', 'posterior',
  'proximal', 'distal',
  'medial', 'lateral',
];

/**
 * Extrai sub-região da query (ex: "total", "superior")
 */
function extractSubregion(text: string): string | null {
  const normalized = normalizeTitle(text);
  for (const keyword of SUBREGION_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return keyword;
    }
  }
  return null;
}

/**
 * Valida se a modalidade do item corresponde à modalidade exigida
 * Se query tem modalidade explícita, EXCLUI resultados de outras modalidades
 */
function validateModalityMatch(
  queryModality: string | undefined,
  itemModality: string | undefined
): boolean {
  if (!queryModality) return true; // Sem modalidade na query = aceita qualquer
  if (!itemModality) return true;  // Item sem modalidade = aceita
  
  const queryMod = queryModality.toUpperCase();
  const itemMod = itemModality.toUpperCase();
  
  return queryMod === itemMod;
}

// ============================================
// BUSCA EM CASCATA POR PALAVRAS-CHAVE (FASE 0)
// ============================================

/**
 * Extrai palavras-chave do texto (3+ caracteres, sem stop words)
 */
function extractKeywords(text: string): string[] {
  const normalized = normalizeTitle(text);
  return normalized
    .split(' ')
    .filter(word => word.length >= 3 && !STOP_WORDS.has(word));
}

/**
 * Gera todas as combinações de tamanho 'size' de um array
 */
function getCombinations<T>(arr: T[], size: number): T[][] {
  if (size === arr.length) return [arr];
  if (size === 0) return [[]];
  if (size > arr.length) return [];
  
  const result: T[][] = [];
  for (let i = 0; i <= arr.length - size; i++) {
    const head = arr[i];
    const tailCombos = getCombinations(arr.slice(i + 1), size - 1);
    for (const tail of tailCombos) {
      result.push([head, ...tail]);
    }
  }
  return result;
}

/**
 * BUSCA EM CASCATA DINÂMICA 100% BASEADA EM PALAVRAS-CHAVE
 * 
 * Algoritmo:
 * 1. Extrai todas palavras-chave do comando (3+ chars, sem stop words)
 * 2. Busca templates onde título contém 100% das palavras
 * 3. Se não achar → tenta com N-1 palavras (cascata)
 * 4. Continua até 50% das palavras ou mínimo 2 palavras
 * 5. Usa scoring para desempate (sub-região correta, mais palavras)
 */
function searchByKeywordCascade<T extends { titulo?: string; modalidade?: string; categoria?: string }>(
  query: string,
  items: T[]
): T | null {
  const queryKeywords = extractKeywords(query);
  
  if (queryKeywords.length === 0) {
    console.log(`[Cascade] ⚠️ Nenhuma palavra-chave extraída`);
    return null;
  }
  
  console.log(`[Cascade] ========================================`);
  console.log(`[Cascade] 🎯 Query: "${query}"`);
  console.log(`[Cascade] 🔤 Palavras-chave: [${queryKeywords.join(', ')}] (${queryKeywords.length} palavras)`);
  
  // Detectar sub-região na query (total, superior, inferior, etc.)
  const querySubregion = extractSubregion(normalizeTitle(query));
  if (querySubregion) {
    console.log(`[Cascade] 📍 Sub-região detectada: "${querySubregion}"`);
  }
  
  // Mínimo de palavras para match (50% ou no mínimo 1)
  const minRequired = Math.max(1, Math.ceil(queryKeywords.length * 0.5));
  
  // CASCATA: De 100% até minRequired
  for (let required = queryKeywords.length; required >= minRequired; required--) {
    const percentage = Math.round((required / queryKeywords.length) * 100);
    console.log(`[Cascade] 🔍 Tentando ${required}/${queryKeywords.length} palavras (${percentage}%)...`);
    
    // Gerar combinações apenas se não for 100%
    const wordCombinations = required === queryKeywords.length 
      ? [queryKeywords]
      : getCombinations(queryKeywords, required);
    
    // Para cada combinação, buscar matches
    interface ScoredMatch { item: T; score: number; matchedWords: number }
    const matches: ScoredMatch[] = [];
    
    for (const combo of wordCombinations) {
      for (const item of items) {
        const titulo = item.titulo || '';
        const tituloNorm = normalizeTitle(titulo);
        
        if (!tituloNorm) continue;
        
        // Verificar se TODAS as palavras da combinação estão no título
        const allMatch = combo.every(word => tituloNorm.includes(word));
        
        if (allMatch) {
          // Calcular score para desempate
          let score = combo.length * 10; // Base: mais palavras = melhor
          
          // BOOST: Sub-região correta
          if (querySubregion) {
            const tituloSubregion = extractSubregion(tituloNorm);
            if (tituloSubregion === querySubregion) {
              score += 50; // Boost significativo para sub-região correta
            } else if (tituloSubregion && tituloSubregion !== querySubregion) {
              score -= 100; // Penalização severa para sub-região ERRADA
            }
          }
          
          // BOOST: Título mais curto = mais específico
          score -= tituloNorm.length * 0.1;
          
          // BOOST: Categoria 'normal' preferida (se não for busca de alterado)
          if (item.categoria === 'normal' || !item.categoria) {
            score += 5;
          }
          
          matches.push({ item, score, matchedWords: combo.length });
        }
      }
    }
    
    // Se encontrou matches nesta fase, retornar o melhor
    if (matches.length > 0) {
      // Ordenar por score (maior = melhor)
      matches.sort((a, b) => b.score - a.score);
      
      const best = matches[0];
      console.log(`[Cascade] ✅ Match ${required}/${queryKeywords.length} (${percentage}%): "${best.item.titulo}" (score: ${best.score.toFixed(1)})`);
      
      // Log de alternativas se houver
      if (matches.length > 1) {
        console.log(`[Cascade] 📊 Alternativas: ${matches.slice(1, 4).map(m => `"${m.item.titulo}" (${m.score.toFixed(1)})`).join(', ')}`);
      }
      
      return best.item;
    }
  }
  
  console.log(`[Cascade] ❌ Nenhum match encontrado com cascata`);
  return null;
}

/**
 * BUSCA ESTRITA com prioridade ABSOLUTA para modalidade + sub-região
 * Usa cascata de palavras-chave internamente
 */
function searchStrictTitleMatch<T extends { titulo?: string; modalidade?: string; categoria?: string }>(
  query: string,
  items: T[],
  requiredModality?: string
): T | null {
  console.log(`[StrictMatch] 🎯 Modalidade requerida: ${requiredModality || 'any'}`);
  
  // PASSO 1: Filtrar por modalidade OBRIGATÓRIA se especificada
  const validModalityItems = requiredModality
    ? items.filter(t => validateModalityMatch(requiredModality, t.modalidade))
    : items;
  
  console.log(`[StrictMatch] 📋 Após filtro modalidade: ${validModalityItems.length}/${items.length} items`);
  
  if (validModalityItems.length === 0) {
    console.log(`[StrictMatch] ⚠️ Nenhum item com modalidade ${requiredModality}`);
    return null;
  }
  
  // PASSO 2: Usar busca em cascata nos items filtrados
  const cascadeResult = searchByKeywordCascade(query, validModalityItems);
  
  if (cascadeResult) {
    return cascadeResult;
  }
  
  console.log(`[StrictMatch] ❌ Nenhum match estrito encontrado`);
  return null;
}

// ============================================
// BUSCA EXATA NO TÍTULO (Legacy - usado por frases)
// ============================================

/**
 * BUSCA EXATA no título - Prioridade máxima
 * Verifica qualificadores de intensidade para diferenciação
 */
function searchExactInTitle<T extends { titulo?: string; categoria?: string; codigo?: string }>(
  query: string,
  items: T[]
): T | null {
  const normalizedQuery = normalizeTitle(query);
  const queryWords = expandQueryWords(normalizedQuery);
  
  if (queryWords.length === 0) return null;
  
  console.log(`[ExactSearch] 🔤 Query words: [${queryWords.join(', ')}]`);
  
  // PRIORIDADE 1: Match COMPLETO + qualificadores corretos
  for (const item of items) {
    const titulo = item.titulo || item.categoria || '';
    const tituloNorm = normalizeTitle(titulo);
    
    if (!tituloNorm) continue;
    
    const allMatch = queryWords.every(word => tituloNorm.includes(word));
    
    if (allMatch && matchIntensityQualifier(query, titulo)) {
      console.log(`[ExactSearch] ✅ Match EXATO + qualificador: "${titulo}"`);
      return item;
    }
  }
  
  // PRIORIDADE 2: Match COMPLETO sem verificar qualificadores
  for (const item of items) {
    const titulo = item.titulo || item.categoria || '';
    const tituloNorm = normalizeTitle(titulo);
    
    if (!tituloNorm) continue;
    
    const allMatch = queryWords.every(word => tituloNorm.includes(word));
    
    if (allMatch) {
      console.log(`[ExactSearch] ✅ Match EXATO: "${titulo}"`);
      return item;
    }
  }
  
  // PRIORIDADE 3: Match por SEQUÊNCIA (palavras na ordem)
  const querySequence = queryWords.join('.*');
  const sequenceRegex = new RegExp(querySequence, 'i');
  
  for (const item of items) {
    const titulo = item.titulo || item.categoria || '';
    const tituloNorm = normalizeTitle(titulo);
    
    if (!tituloNorm) continue;
    
    if (sequenceRegex.test(tituloNorm) && matchIntensityQualifier(query, titulo)) {
      console.log(`[ExactSearch] ✅ Match SEQUÊNCIA: "${titulo}"`);
      return item;
    }
  }
  
  // PRIORIDADE 4: Match PARCIAL (60% das palavras)
  const minMatches = Math.max(1, Math.ceil(queryWords.length * 0.6));
  let bestMatch: T | null = null;
  let bestScore = 0;
  
  for (const item of items) {
    const titulo = item.titulo || item.categoria || '';
    const tituloNorm = normalizeTitle(titulo);
    
    if (!tituloNorm) continue;
    
    const matchCount = queryWords.filter(word => tituloNorm.includes(word)).length;
    
    // Verificar qualificadores para desempate
    const hasCorrectQualifier = matchIntensityQualifier(query, titulo);
    const adjustedScore = hasCorrectQualifier ? matchCount + 0.5 : matchCount;
    
    if (matchCount >= minMatches && adjustedScore > bestScore) {
      bestScore = adjustedScore;
      bestMatch = item;
    }
  }
  
  if (bestMatch) {
    const titulo = bestMatch.titulo || (bestMatch as any).categoria || '';
    console.log(`[ExactSearch] ✅ Match PARCIAL (${Math.floor(bestScore)}/${queryWords.length}): "${titulo}"`);
  }
  
  return bestMatch;
}

// ============================================
// CONFIGURAÇÃO FUSE.JS - Threshold Restritivo
// ============================================

const TEMPLATE_FUSE_OPTIONS = {
  keys: [
    { name: 'titulo', weight: 0.50 },
    { name: 'modalidade', weight: 0.20 },
    { name: 'regiao', weight: 0.15 },
    { name: 'tags', weight: 0.10 },
    { name: 'categoria', weight: 0.05 },
  ],
  threshold: 0.40,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 3,
  findAllMatches: false,
  shouldSort: true,
};

const FRASE_FUSE_OPTIONS = {
  keys: [
    { name: 'titulo', weight: 0.55 },
    { name: 'categoria', weight: 0.15 },
    { name: 'conclusao', weight: 0.10 },
    { name: 'texto', weight: 0.10 },
    { name: 'codigo', weight: 0.05 },
    { name: 'sinônimos', weight: 0.05 },
  ],
  threshold: 0.35,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 3,
  findAllMatches: false,
  shouldSort: true,
};

// ============================================
// CONTEXT BOOST
// ============================================

interface BoostableItem {
  modalidade?: string;
  regiao?: string;
  modalidade_id?: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  categoria?: string;
  variaveis?: any[];
  titulo?: string;
}

function applyContextBoost<T extends BoostableItem>(
  item: T,
  baseScore: number,
  context: SearchContext,
  query?: string
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
  
  // Boost de categoria
  if (!context.wantsAltered && itemCat === 'normal') {
    boostedScore *= 0.8;
  }
  
  // Boost para sem variáveis
  if (context.preferSemVariaveis !== false) {
    const hasVars = item.variaveis && item.variaveis.length > 0;
    if (!hasVars) {
      boostedScore *= 0.85;
    }
  }
  
  // ✨ Boost para qualificadores corretos
  if (query && item.titulo) {
    if (matchIntensityQualifier(query, item.titulo)) {
      boostedScore *= 0.75; // 25% boost
    }
  }
  
  return boostedScore;
}

// ============================================
// BUSCA COM FUSE.JS
// ============================================

function searchWithFuse<T extends BoostableItem>(
  items: T[],
  query: string,
  context: SearchContext,
  options: any,
  acceptThreshold: number = 0.55
): T | null {
  if (items.length === 0) return null;
  
  const fuse = new Fuse(items, options);
  const results = fuse.search(query);
  
  if (results.length === 0) return null;
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, context, query),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  const best = boostedResults[0];
  
  console.log(`[Fuse] Top result: "${(best.item as any).titulo || (best.item as any).categoria}" (score: ${best.score.toFixed(3)}, boosted: ${best.boostedScore.toFixed(3)})`);
  
  if (best.boostedScore <= acceptThreshold) {
    return best.item;
  }
  
  console.log(`[Fuse] Rejected: score ${best.boostedScore.toFixed(3)} > threshold ${acceptThreshold}`);
  return null;
}

// ============================================
// BUSCA PRINCIPAL - Templates
// ============================================

export function searchTemplates(
  query: string,
  templates: TemplateSearchItem[],
  context: SearchContext = {}
): TemplateSearchItem | null {
  if (!query.trim() || templates.length === 0) {
    return null;
  }
  
  const wantsAltered = detectAlteredIntent(query);
  const normalizedQuery = normalizeQuery(query);
  const expandedQuery = expandQueryWithSynonyms(normalizedQuery);
  const { modality: queryModality, region } = extractModalityAndRegion(normalizedQuery);
  
  // Enriquecer contexto
  const enhancedContext: SearchContext = { 
    ...context, 
    wantsAltered,
    modalidade: context.modalidade || queryModality,
    regiao: context.regiao || region,
  };
  
  console.log(`[SearchTemplates] ========================================`);
  console.log(`[SearchTemplates] 📥 Query: "${query}" → "${normalizedQuery}"`);
  console.log(`[SearchTemplates] 🎯 Modalidade da query: ${queryModality || 'não detectada'}`);
  console.log(`[SearchTemplates] 🎯 Modo: ${wantsAltered ? '🔴 ALTERADO' : '🟢 NORMAL'}`);
  console.log(`[SearchTemplates] 📊 Total: ${templates.length}, Context: mod=${enhancedContext.modalidade}, reg=${enhancedContext.regiao}`);
  
  // Separar por categoria
  const normaisSemVars = templates.filter(t => 
    (t.categoria === 'normal' || !t.categoria) && (!t.variaveis || t.variaveis.length === 0)
  );
  const normaisComVars = templates.filter(t => 
    (t.categoria === 'normal' || !t.categoria) && (t.variaveis && t.variaveis.length > 0)
  );
  const alterados = templates.filter(t => t.categoria === 'alterado');
  
  // PRÉ-FILTRAR por modalidade/região
  const candidatosDiretos = wantsAltered 
    ? alterados 
    : [...normaisSemVars, ...normaisComVars];
  
  // =============================================
  // FASE 0: BUSCA ESTRITA COM MODALIDADE OBRIGATÓRIA
  // =============================================
  console.log(`[SearchTemplates] 🔍 FASE 0: Busca ESTRITA (modalidade: ${queryModality || 'any'})...`);
  let match = searchStrictTitleMatch(normalizedQuery, candidatosDiretos, queryModality);
  if (match) {
    console.log(`[SearchTemplates] ✅ FASE 0: Match ESTRITO: "${match.titulo}"`);
    return match;
  }
  
  // =============================================
  // FASE 0b: BUSCA ESTRITA SEM FILTRO DE MODALIDADE
  // =============================================
  if (queryModality) {
    console.log(`[SearchTemplates] 🔍 FASE 0b: Busca ESTRITA sem filtro modalidade...`);
    match = searchStrictTitleMatch(normalizedQuery, candidatosDiretos, undefined);
    if (match) {
      // Verificar se a modalidade pelo menos é compatível
      if (validateModalityMatch(queryModality, match.modalidade)) {
        console.log(`[SearchTemplates] ✅ FASE 0b: Match ESTRITO (sem filtro): "${match.titulo}"`);
        return match;
      }
    }
  }
  
  // PRÉ-FILTRAR por contexto (menos restritivo que busca estrita)
  const { filtered: candidatosFiltrados } = preFilterTemplates(candidatosDiretos, enhancedContext);
  
  // =============================================
  // FASE 1: BUSCA EXATA (legacy) NOS CANDIDATOS FILTRADOS
  // =============================================
  console.log(`[SearchTemplates] 🔍 FASE 1: Busca EXATA em ${candidatosFiltrados.length} candidatos filtrados...`);
  match = searchExactInTitle(normalizedQuery, candidatosFiltrados);
  if (match) {
    // Validar modalidade antes de aceitar
    if (validateModalityMatch(queryModality, match.modalidade)) {
      console.log(`[SearchTemplates] ✅ FASE 1: Match EXATO: "${match.titulo}"`);
      return match;
    } else {
      console.log(`[SearchTemplates] ⚠️ FASE 1: Match rejeitado por modalidade incorreta: "${match.titulo}" (${match.modalidade} != ${queryModality})`);
    }
  }
  
  // =============================================
  // FASE 2: FUSE.JS NOS CANDIDATOS FILTRADOS
  // =============================================
  console.log(`[SearchTemplates] 🔍 FASE 2: Fuse.js em ${candidatosFiltrados.length} candidatos filtrados...`);
  
  // Se há modalidade na query, filtrar resultados do Fuse também
  const fuseCandidates = queryModality
    ? candidatosFiltrados.filter(t => validateModalityMatch(queryModality, t.modalidade))
    : candidatosFiltrados;
  
  match = searchWithFuse(fuseCandidates, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS, 0.50);
  if (match) {
    console.log(`[SearchTemplates] ✅ FASE 2: Fuse match: "${match.titulo}"`);
    return match;
  }
  
  // =============================================
  // FASE 3: FUSE.JS EM TODOS OS CANDIDATOS
  // =============================================
  if (fuseCandidates.length < candidatosDiretos.length) {
    console.log(`[SearchTemplates] 🔍 FASE 3: Fuse.js em TODOS ${candidatosDiretos.length} candidatos...`);
    
    const allFuseCandidates = queryModality
      ? candidatosDiretos.filter(t => validateModalityMatch(queryModality, t.modalidade))
      : candidatosDiretos;
    
    match = searchWithFuse(allFuseCandidates, expandedQuery, enhancedContext, TEMPLATE_FUSE_OPTIONS, 0.55);
    if (match) {
      console.log(`[SearchTemplates] ✅ FASE 3: Fuse match (todos): "${match.titulo}"`);
      return match;
    }
  }
  
  // =============================================
  // FASE 4: FALLBACK POR MODALIDADE/REGIÃO
  // =============================================
  if (queryModality || region) {
    console.log(`[SearchTemplates] 🔍 FASE 4: Fallback modalidade/região...`);
    
    const fallbackMatches = candidatosDiretos.filter(t => {
      const modMatch = !queryModality || validateModalityMatch(queryModality, t.modalidade);
      const regMatch = !region || t.regiao?.toLowerCase().includes(region);
      return modMatch && regMatch;
    });
    
    if (fallbackMatches.length > 0) {
      const semVars = fallbackMatches.filter(t => !t.variaveis || t.variaveis.length === 0);
      const prioritized = semVars.length > 0 ? semVars : fallbackMatches;
      prioritized.sort((a, b) => (a.titulo?.length || 0) - (b.titulo?.length || 0));
      
      const fallbackMatch = prioritized[0];
      console.log(`[SearchTemplates] ✅ FASE 4: Fallback match: "${fallbackMatch.titulo}"`);
      return fallbackMatch;
    }
  }
  
  console.log(`[SearchTemplates] ❌ Nenhum template encontrado`);
  return null;
}

// ============================================
// BUSCA PRINCIPAL - Frases (com Pipeline Robusto)
// ============================================

export function searchFrases(
  query: string,
  frases: FraseSearchItem[],
  context: SearchContext = {}
): FraseSearchItem | null {
  if (!query.trim() || frases.length === 0) {
    return null;
  }
  
  const normalizedQuery = normalizeQuery(query);
  const { modality, region } = extractModalityAndRegion(normalizedQuery);
  
  // Enriquecer contexto
  const enhancedContext: SearchContext = {
    ...context,
    modalidade: context.modalidade || modality,
    regiao: context.regiao || region,
  };
  
  console.log(`[SearchFrases] ========================================`);
  console.log(`[SearchFrases] 📥 Query: "${query}" → "${normalizedQuery}"`);
  console.log(`[SearchFrases] 📊 Total: ${frases.length}, Context: mod=${enhancedContext.modalidade}, reg=${enhancedContext.regiao}`);
  console.log(`[SearchFrases] 🏷️ Qualificadores detectados: [${extractQualifiers(query).join(', ')}]`);
  
  // ========================================
  // FASE 0: BUSCA EM CASCATA (NOVA - PRIORIDADE MÁXIMA)
  // ========================================
  console.log(`[SearchFrases] 🔍 FASE 0: Busca em CASCATA por palavras-chave...`);
  
  // Adaptar frases para interface compatível
  const frasesAdaptadas = frases.map(f => ({
    ...f,
    titulo: f.titulo || f.categoria || f.conclusao || '',
  }));
  
  let match = searchByKeywordCascade(normalizedQuery, frasesAdaptadas) as FraseSearchItem | null;
  if (match) {
    console.log(`[SearchFrases] ✅ FASE 0: Match CASCATA: "${match.titulo || match.categoria}" (${match.codigo})`);
    return match;
  }
  
  // ========================================
  // FASE 1: PRÉ-FILTRO POR MODALIDADE/REGIÃO
  // ========================================
  const { filtered: candidatos, all: todasFrases } = preFilterFrases(frases, enhancedContext);
  console.log(`[SearchFrases] 📋 Candidatos pré-filtrados: ${candidatos.length}/${frases.length}`);
  
  // ========================================
  // FASE 2: BUSCA EXATA NO TÍTULO (Legacy)
  // ========================================
  console.log(`[SearchFrases] 🔍 FASE 2: Busca EXATA em ${candidatos.length} candidatos...`);
  match = searchExactInTitle(normalizedQuery, candidatos);
  if (match) {
    console.log(`[SearchFrases] ✅ FASE 2: Match EXATO em candidatos: "${match.titulo || match.categoria}" (${match.codigo})`);
    return match;
  }
  
  // ========================================
  // FASE 3: FUSE.JS NOS CANDIDATOS PRÉ-FILTRADOS
  // ========================================
  console.log(`[SearchFrases] 🔍 FASE 3: Fuse.js em ${candidatos.length} candidatos...`);
  match = searchWithFuse(candidatos, normalizedQuery, enhancedContext, FRASE_FUSE_OPTIONS, 0.45);
  if (match) {
    console.log(`[SearchFrases] ✅ FASE 3: Fuse match candidatos: "${match.titulo || match.categoria}" (${match.codigo})`);
    return match;
  }
  
  // ========================================
  // FASE 4: FALLBACK - BUSCA EM TODAS AS FRASES
  // ========================================
  if (candidatos.length < todasFrases.length) {
    console.log(`[SearchFrases] 🔄 FASE 4: Fallback em TODAS ${todasFrases.length} frases...`);
    
    // 4a: Busca exata em todas
    match = searchExactInTitle(normalizedQuery, todasFrases);
    if (match) {
      console.log(`[SearchFrases] ✅ FASE 4a: Match EXATO (todas): "${match.titulo || match.categoria}" (${match.codigo})`);
      return match;
    }
    
    // 4b: Fuse.js em todas
    match = searchWithFuse(todasFrases, normalizedQuery, enhancedContext, FRASE_FUSE_OPTIONS, 0.50);
    if (match) {
      console.log(`[SearchFrases] ✅ FASE 4b: Fuse match (todas): "${match.titulo || match.categoria}" (${match.codigo})`);
      return match;
    }
  }
  
  // ========================================
  // FASE 5: FALLBACK FINAL - BUSCA NO CÓDIGO
  // ========================================
  const codeQuery = normalizedQuery.replace(/\s+/g, '_');
  const fallbackMatch = frases.find(f => 
    f.codigo?.toLowerCase().includes(codeQuery) ||
    f.codigo?.toLowerCase().includes(normalizedQuery.replace(/\s+/g, ''))
  );
  
  if (fallbackMatch) {
    console.log(`[SearchFrases] ✅ FASE 5: Fallback código: "${fallbackMatch.codigo}"`);
    return fallbackMatch;
  }
  
  console.log(`[SearchFrases] ❌ Nenhuma frase encontrada para: "${query}"`);
  return null;
}

// ============================================
// BUSCA MÚLTIPLA - Para sugestões
// ============================================

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
  
  let candidatos: TemplateSearchItem[];
  
  if (wantsAltered) {
    candidatos = templates.filter(t => t.categoria === 'alterado');
    if (candidatos.length < limit) {
      const normais = templates.filter(t => t.categoria !== 'alterado');
      candidatos = [...candidatos, ...normais];
    }
  } else {
    candidatos = templates.filter(t => t.categoria === 'normal' || !t.categoria);
  }
  
  // Pré-filtrar
  const { filtered } = preFilterTemplates(candidatos, enhancedContext);
  const searchSet = filtered.length >= limit ? filtered : candidatos;
  
  const fuse = new Fuse(searchSet, TEMPLATE_FUSE_OPTIONS);
  const results = fuse.search(expandedQuery, { limit: limit * 2 });
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, enhancedContext, query),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  return boostedResults
    .filter(r => r.boostedScore <= 0.60)
    .slice(0, limit)
    .map(r => r.item);
}

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
  const { modality, region } = extractModalityAndRegion(normalizedQuery);
  
  const enhancedContext: SearchContext = {
    ...context,
    modalidade: context.modalidade || modality,
    regiao: context.regiao || region,
  };
  
  // Pré-filtrar
  const { filtered } = preFilterFrases(frases, enhancedContext);
  const searchSet = filtered.length >= limit ? filtered : frases;
  
  const fuse = new Fuse(searchSet, FRASE_FUSE_OPTIONS);
  const results = fuse.search(normalizedQuery, { limit: limit * 2 });
  
  const boostedResults = results.map(result => ({
    item: result.item,
    score: result.score ?? 1,
    boostedScore: applyContextBoost(result.item, result.score ?? 1, enhancedContext, query),
  }));
  
  boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);
  
  return boostedResults
    .filter(r => r.boostedScore <= 0.55)
    .slice(0, limit)
    .map(r => r.item);
}

// ============================================
// EXPORTS
// ============================================

export { 
  detectAlteredIntent, 
  ALTERED_KEYWORDS,
  INTENSITY_QUALIFIERS,
  matchIntensityQualifier,
  extractQualifiers,
};
