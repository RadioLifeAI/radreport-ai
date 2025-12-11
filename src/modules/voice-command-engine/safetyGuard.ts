/**
 * Voice Command Engine - Safety Guard (Simplificado)
 * 
 * ARQUITETURA INTENT DETECTION:
 * Com detecção por prefixo, colisões são praticamente impossíveis.
 * Este módulo agora apenas valida comandos de SISTEMA.
 */

import type { CommandMatchResult } from './types';

/**
 * Palavras médicas protegidas - NUNCA podem ser comandos de sistema sozinhas
 * Usadas apenas para validar comandos de sistema (pontuação, navegação, etc.)
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
  
  // Modalidades
  'ultrassonografia', 'tomografia', 'ressonância',
]);

/**
 * Prefixos seguros para comandos (referência - Intent Detection usa lista própria)
 */
export const SAFE_COMMAND_PREFIXES = [
  'modelo',
  'template', 
  'frase',
  'inserir',
  'aplicar',
  'usar',
];

/**
 * Verifica se texto contém apenas palavras médicas protegidas
 */
export function isProtectedMedicalPhrase(text: string): boolean {
  const words = text.toLowerCase().trim().split(/\s+/);
  return words.every(word => PROTECTED_MEDICAL_WORDS.has(word));
}

/**
 * Verifica se texto tem prefixo seguro de comando
 */
export function hasSafeCommandPrefix(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return SAFE_COMMAND_PREFIXES.some(prefix => lower.startsWith(prefix));
}

/**
 * Validação de segurança SIMPLIFICADA para comandos de SISTEMA
 * 
 * Com Intent Detection:
 * - Templates/Frases são validados pelo prefixo (intentDetector.ts)
 * - Este guard valida apenas comandos de sistema (pontuação, navegação, etc.)
 */
export function validateSystemCommand(
  result: CommandMatchResult,
  originalText: string
): { safe: boolean; reason?: string } {
  const { command, score } = result;
  
  // Pontuação sempre segura (alta prioridade, baixo risco)
  if (command.category === 'punctuation') {
    return { safe: true };
  }
  
  // Estrutural sempre seguro
  if (command.category === 'structural') {
    return { safe: true };
  }
  
  // Match exato sempre seguro
  if (score === 0) {
    return { safe: true };
  }
  
  // Verificar se não é palavra médica protegida tentando ser comando
  const wordCount = originalText.trim().split(/\s+/).length;
  if (wordCount <= 2 && isProtectedMedicalPhrase(originalText)) {
    return { 
      safe: false, 
      reason: 'Palavra médica protegida não pode ser comando de sistema' 
    };
  }
  
  // Score razoável para aceitar
  if (score < 0.35) {
    return { safe: true };
  }
  
  return { 
    safe: false, 
    reason: `Score ${score.toFixed(2)} muito alto para comando de sistema` 
  };
}

/**
 * @deprecated Use validateSystemCommand - templates/frases usam Intent Detection
 */
export function validateCommandSafety(
  result: CommandMatchResult,
  originalText: string
): { safe: boolean; reason?: string } {
  return validateSystemCommand(result, originalText);
}

/**
 * Ação recomendada para comandos de sistema
 */
export type SafetyAction = 'execute' | 'insert_text';

export function getRecommendedAction(
  result: CommandMatchResult | null,
  originalText: string
): SafetyAction {
  if (!result) {
    return 'insert_text';
  }
  
  const validation = validateSystemCommand(result, originalText);
  return validation.safe ? 'execute' : 'insert_text';
}
