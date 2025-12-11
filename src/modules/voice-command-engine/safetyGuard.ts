/**
 * Voice Command Engine - Safety Guard
 * FASE 4: Proteção contextual contra colisões com ditado médico
 * 
 * Palavras médicas comuns NUNCA devem ser interpretadas como comandos
 */

import type { CommandMatchResult, VoiceCommand } from './types';

/**
 * Palavras médicas protegidas - NUNCA podem ser comandos sozinhas
 * Estas aparecem frequentemente em laudos radiológicos
 */
export const PROTECTED_MEDICAL_WORDS = new Set([
  // Anatomia/Lateralidade
  'direita', 'esquerda', 'direito', 'esquerdo',
  'superior', 'inferior', 'anterior', 'posterior',
  'lateral', 'medial', 'proximal', 'distal',
  'central', 'periférico', 'superficial', 'profundo',
  
  // Estruturas comuns
  'fígado', 'baço', 'rim', 'rins', 'pâncreas', 'vesícula',
  'mama', 'mamas', 'tireoide', 'próstata', 'útero', 'ovário',
  'pulmão', 'pulmões', 'coração', 'aorta', 'veia', 'artéria',
  
  // Achados comuns
  'nódulo', 'cisto', 'massa', 'lesão', 'calcificação',
  'normal', 'alterado', 'aumentado', 'reduzido',
  
  // Seções do laudo (mas não como comandos de navegação)
  'técnica', 'relatório', 'achados', 'conclusão', 'impressão',
  
  // Modalidades
  'ultrassonografia', 'tomografia', 'ressonância',
  
  // Palavras de ligação frequentes
  'aspecto', 'padrão', 'textura', 'contorno', 'dimensões',
]);

/**
 * Prefixos SEGUROS que indicam intenção de comando
 */
export const SAFE_COMMAND_PREFIXES = [
  'modelo',
  'template', 
  'frase',
  'inserir',
  'aplicar',
  'usar',
  'comando',
  'ir para',
  'alinhar',
  'formatação',
];

/**
 * Verifica se transcript contém apenas palavras médicas protegidas
 */
export function isProtectedMedicalPhrase(text: string): boolean {
  const words = text.toLowerCase().trim().split(/\s+/);
  
  // Se todas as palavras são protegidas, não é comando
  return words.every(word => PROTECTED_MEDICAL_WORDS.has(word));
}

/**
 * Verifica se transcript tem prefixo seguro de comando
 */
export function hasSafeCommandPrefix(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return SAFE_COMMAND_PREFIXES.some(prefix => lower.startsWith(prefix));
}

/**
 * Validação de segurança para comandos de frase/template
 * Retorna true se é SEGURO executar, false se deve inserir como texto
 */
export function validateCommandSafety(
  result: CommandMatchResult,
  originalText: string
): { safe: boolean; reason?: string } {
  const { command, score } = result;
  
  // Pontuação e estrutural sempre seguros (alta prioridade)
  if (command.category === 'punctuation' || command.category === 'structural') {
    return { safe: true };
  }
  
  // Se é frase/template, exigir prefixo OU score muito alto
  if (command.category === 'frase' || command.category === 'template') {
    const hasPrefix = hasSafeCommandPrefix(originalText);
    
    // FASE 2 FIX: Match exato (score = 0) sempre seguro
    if (score === 0) {
      return { safe: true };
    }
    
    // Com prefixo: aceitar com score razoável (relaxado de 0.35 → 0.45)
    if (hasPrefix && score < 0.45) {
      return { safe: true };
    }
    
    // FASE 2 FIX: Sem prefixo mas com score muito bom (< 0.25), aceitar
    // Isso permite matches naturais como "esteatose hepática" → frase esteatose
    if (!hasPrefix && score < 0.25) {
      // Verificar se não é apenas palavras médicas protegidas
      if (isProtectedMedicalPhrase(originalText)) {
        return { 
          safe: false, 
          reason: 'Frase médica protegida' 
        };
      }
      return { safe: true };
    }
    
    // Sem prefixo e score > 0.25: rejeitar
    if (!hasPrefix && score >= 0.25) {
      return { 
        safe: false, 
        reason: `Sem prefixo seguro e score ${score.toFixed(2)} >= 0.25` 
      };
    }
    
    return { safe: false, reason: 'Não passou validação de segurança' };
  }
  
  // Comandos de sistema: verificar se não é palavra protegida
  if (command.category === 'system' || command.category === 'formatting' || command.category === 'navigation') {
    // Se o texto original é muito curto (1-2 palavras) e é palavra protegida, não executar
    const wordCount = originalText.trim().split(/\s+/).length;
    if (wordCount <= 2 && isProtectedMedicalPhrase(originalText)) {
      return { 
        safe: false, 
        reason: 'Palavra médica protegida não pode ser comando' 
      };
    }
    
    // Score razoável para comandos de sistema
    if (score < 0.4) {
      return { safe: true };
    }
    
    return { safe: false, reason: `Score ${score.toFixed(2)} muito alto` };
  }
  
  // Default: aceitar com score baixo
  return score < 0.35 ? { safe: true } : { safe: false, reason: 'Score alto demais' };
}

/**
 * Determina a ação recomendada baseada no resultado do matching
 */
export type SafetyAction = 'execute' | 'insert_text' | 'confirm';

export function getRecommendedAction(
  result: CommandMatchResult | null,
  originalText: string
): SafetyAction {
  // Sem match = inserir como texto
  if (!result) {
    return 'insert_text';
  }
  
  // Validar segurança
  const validation = validateCommandSafety(result, originalText);
  
  if (validation.safe) {
    return 'execute';
  }
  
  // Se score está na zona de dúvida (0.2-0.4), poderia pedir confirmação
  // Por ora, inserir como texto para segurança
  if (result.score >= 0.2 && result.score <= 0.4) {
    console.log(`⚠️ Zona de dúvida: "${originalText}" → ${result.command.name} (score: ${result.score.toFixed(2)}). Inserindo como texto.`);
  }
  
  return 'insert_text';
}
