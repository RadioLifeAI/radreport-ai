/**
 * Voice Engine - Singleton Instance
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
      fuzzyThreshold: 0.35,
      minMatchScore: 0.5,
      autoReload: false,
    });
  }
  return engineInstance;
}

/**
 * Inicializar o engine (carregar comandos do Supabase)
 */
export async function initVoiceEngine(): Promise<VoiceCommandEngine> {
  const engine = getVoiceEngine();
  await engine.loadSupabaseCommands();
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
