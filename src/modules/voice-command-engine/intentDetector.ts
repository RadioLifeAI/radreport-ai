/**
 * Voice Command Engine - Intent Detector
 * Detecta intenção do usuário via prefixos de comando
 * 
 * Arquitetura: Prefixo explícito indica ação
 * - "modelo tc tórax" → TEMPLATE intent
 * - "frase esteatose" → FRASE intent
 * - "vírgula" → SYSTEM intent (matching tradicional)
 * - Texto sem prefixo → TEXT (inserir como ditado)
 */

export type IntentType = 'TEMPLATE' | 'FRASE' | 'SYSTEM' | 'TEXT';

export interface DetectedIntent {
  type: IntentType;
  query: string;           // Parte após o prefixo (busca dinâmica)
  confidence: number;      // 0-1
  prefix?: string;         // Prefixo detectado
  originalText: string;    // Texto original completo
}

/**
 * Prefixos que indicam intenção de buscar TEMPLATE
 * Ordenados por especificidade (maior primeiro)
 */
const TEMPLATE_PREFIXES = [
  'aplicar modelos',
  'aplicar modelo',
  'usar modelos',
  'usar modelo',
  'laudo de',
  'modelos de',
  'modelo de',
  'templates',
  'template',
  'modelos',
  'modelo',
  'laudo',
];

/**
 * Prefixos que indicam intenção de buscar FRASE
 * Ordenados por especificidade (maior primeiro)
 * Inclui plurais e variações semânticas
 */
const FRASE_PREFIXES = [
  'inserir frases',
  'inserir frase',
  'adicionar frases',
  'adicionar frase',
  'colocar frases',
  'colocar frase',
  'frases de',
  'frase de',
  'inserir',
  'adicionar',
  'colocar',
  'frases',
  'frase',
];

/**
 * Normaliza texto removendo acentos e espaços extras
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Detecta intenção baseado em prefixos
 * 
 * @param transcript - Texto transcrito do ditado
 * @returns Intent detectada com query para busca
 */
export function detectIntent(transcript: string): DetectedIntent {
  const normalized = normalizeText(transcript);
  const original = transcript.trim();
  
  // 1. Checar prefixos de TEMPLATE (mais específicos primeiro)
  for (const prefix of TEMPLATE_PREFIXES) {
    const normalizedPrefix = normalizeText(prefix);
    
    if (normalized.startsWith(normalizedPrefix + ' ')) {
      const query = original.slice(prefix.length).trim();
      
      // Query deve ter conteúdo mínimo
      if (query.length >= 2) {
        return {
          type: 'TEMPLATE',
          query,
          confidence: 0.95,
          prefix,
          originalText: original,
        };
      }
    }
    
    // Match exato do prefixo (sem query adicional)
    if (normalized === normalizedPrefix) {
      return {
        type: 'TEMPLATE',
        query: '',
        confidence: 0.7, // Menor confiança sem query
        prefix,
        originalText: original,
      };
    }
  }
  
  // 2. Checar prefixos de FRASE
  for (const prefix of FRASE_PREFIXES) {
    const normalizedPrefix = normalizeText(prefix);
    
    if (normalized.startsWith(normalizedPrefix + ' ')) {
      const query = original.slice(prefix.length).trim();
      
      if (query.length >= 2) {
        return {
          type: 'FRASE',
          query,
          confidence: 0.95,
          prefix,
          originalText: original,
        };
      }
    }
    
    if (normalized === normalizedPrefix) {
      return {
        type: 'FRASE',
        query: '',
        confidence: 0.7,
        prefix,
        originalText: original,
      };
    }
  }
  
  // 3. Sem prefixo detectado = SYSTEM ou TEXT
  // Retornar TEXT - o Engine tentará matching de sistema primeiro
  return {
    type: 'TEXT',
    query: original,
    confidence: 1.0,
    originalText: original,
  };
}

/**
 * Verifica se texto tem prefixo de comando
 */
export function hasCommandPrefix(text: string): boolean {
  const normalized = normalizeText(text);
  
  const allPrefixes = [...TEMPLATE_PREFIXES, ...FRASE_PREFIXES];
  
  return allPrefixes.some(prefix => {
    const normalizedPrefix = normalizeText(prefix);
    return normalized.startsWith(normalizedPrefix + ' ') || normalized === normalizedPrefix;
  });
}

/**
 * Extrai tipo de intent sem query completa (para UI)
 */
export function getIntentType(text: string): IntentType {
  return detectIntent(text).type;
}

// Re-export prefixes for reference
export { TEMPLATE_PREFIXES, FRASE_PREFIXES };
