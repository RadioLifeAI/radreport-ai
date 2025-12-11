/**
 * Voice Engine - Singleton Instance (Optimized)
 * Instância global do VoiceCommandEngine para uso em todo o app
 */

import { VoiceCommandEngine } from '@/modules/voice-command-engine';

// Singleton instance
let engineInstance: VoiceCommandEngine | null = null;

/**
 * Obter instância singleton do Voice Command Engine
 */
export function getVoiceEngine(): VoiceCommandEngine {
  if (!engineInstance) {
    engineInstance = new VoiceCommandEngine({
      debug: import.meta.env.DEV, // Debug ativo em desenvolvimento
      fuzzyThreshold: 0.25,       // Otimizado: mais estrito
      minMatchScore: 0.4,         // Otimizado: mais estrito
      autoReload: false,
    });
  }
  return engineInstance;
}

/**
 * Inicializar o engine (comandos do sistema apenas - frases/templates vêm dos hooks)
 */
export async function initVoiceEngine(): Promise<VoiceCommandEngine> {
  const engine = getVoiceEngine();
  // Não carrega do Supabase - usa dados dos hooks
  engine.start();
  return engine;
}

/**
 * Destruir instância (para cleanup)
 */
export function destroyVoiceEngine(): void {
  if (engineInstance) {
    engineInstance.stop();
    engineInstance.detachFromTipTap();
    engineInstance = null;
  }
}

// Export default instance getter
export { engineInstance };
