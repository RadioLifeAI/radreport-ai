/**
 * useVoiceEngine - React Hook
 * Hook para integrar o VoiceCommandEngine com componentes React
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { getVoiceEngine, initVoiceEngine, destroyVoiceEngine } from '@/lib/voiceEngine';
import type { 
  VoiceEngineState, 
  CommandMatchResult, 
  CommandExecutionResult,
  VoiceCommand,
} from '@/modules/voice-command-engine';

export interface UseVoiceEngineOptions {
  autoInit?: boolean;        // Inicializar automaticamente
  debug?: boolean;           // Modo debug
  editor?: Editor | null;    // Editor TipTap para vincular
}

export interface UseVoiceEngineReturn {
  // Estado
  isReady: boolean;
  isActive: boolean;
  totalCommands: number;
  lastMatch: CommandMatchResult | null;
  lastExecution: CommandExecutionResult | null;
  
  // Stats
  stats: { system: number; frases: number; templates: number };
  
  // Controle
  start: () => void;
  stop: () => void;
  
  // Comandos
  reloadCommands: () => Promise<void>;
  processTranscript: (text: string) => Promise<CommandMatchResult | null>;
  getCommands: () => VoiceCommand[];
  filterByModalidade: (modalidade: string) => VoiceCommand[];
  
  // Configuração
  setDebug: (enabled: boolean) => void;
  attachEditor: (editor: Editor) => void;
  detachEditor: () => void;
}

export function useVoiceEngine(options: UseVoiceEngineOptions = {}): UseVoiceEngineReturn {
  const { autoInit = true, debug = false, editor } = options;
  
  const [state, setState] = useState<VoiceEngineState>({
    isReady: false,
    isActive: false,
    totalCommands: 0,
    lastMatch: null,
    lastExecution: null,
    loadedAt: null,
  });
  
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const isInitializedRef = useRef(false);

  // Atualizar estado do engine
  const updateState = useCallback(() => {
    const engine = getVoiceEngine();
    setState(engine.getState());
  }, []);

  // Inicialização
  useEffect(() => {
    if (!autoInit || isInitializedRef.current) return;
    
    const init = async () => {
      if (initPromiseRef.current) {
        await initPromiseRef.current;
        return;
      }
      
      initPromiseRef.current = (async () => {
        try {
          const engine = await initVoiceEngine();
          
          // Configurar debug
          engine.setDebug(debug);
          
          // Configurar callbacks para atualizar estado
          engine.setCallbacks({
            onCommandMatch: () => updateState(),
            onCommandExecute: () => updateState(),
            onCommandReject: () => updateState(),
          });
          
          isInitializedRef.current = true;
          updateState();
        } catch (error) {
          console.error('[useVoiceEngine] Erro na inicialização:', error);
        }
      })();
      
      await initPromiseRef.current;
    };
    
    init();
    
    return () => {
      // Cleanup apenas se necessário
    };
  }, [autoInit, debug, updateState]);

  // Vincular editor quando disponível
  useEffect(() => {
    if (!editor || !state.isReady) return;
    
    const engine = getVoiceEngine();
    engine.attachToTipTap(editor);
    
    return () => {
      engine.detachFromTipTap();
    };
  }, [editor, state.isReady]);

  // Controles
  const start = useCallback(() => {
    const engine = getVoiceEngine();
    engine.start();
    updateState();
  }, [updateState]);

  const stop = useCallback(() => {
    const engine = getVoiceEngine();
    engine.stop();
    updateState();
  }, [updateState]);

  const reloadCommands = useCallback(async () => {
    const engine = getVoiceEngine();
    await engine.reloadCommands();
    updateState();
  }, [updateState]);

  const processTranscript = useCallback(async (text: string) => {
    const engine = getVoiceEngine();
    const result = await engine.processTranscript(text);
    updateState();
    return result;
  }, [updateState]);

  const getCommands = useCallback(() => {
    const engine = getVoiceEngine();
    return engine.getCommands();
  }, []);

  const setDebug = useCallback((enabled: boolean) => {
    const engine = getVoiceEngine();
    engine.setDebug(enabled);
  }, []);

  const attachEditor = useCallback((ed: Editor) => {
    const engine = getVoiceEngine();
    engine.attachToTipTap(ed);
  }, []);

  const detachEditor = useCallback(() => {
    const engine = getVoiceEngine();
    engine.detachFromTipTap();
  }, []);

  // Filtrar comandos por modalidade
  const filterByModalidade = useCallback((mod: string) => {
    const engine = getVoiceEngine();
    return engine.getCommands().filter(c => 
      !c.modalidade || c.modalidade.toUpperCase() === mod.toUpperCase()
    );
  }, []);

  return {
    // Estado
    isReady: state.isReady,
    isActive: state.isActive,
    totalCommands: state.totalCommands,
    lastMatch: state.lastMatch,
    lastExecution: state.lastExecution,
    
    // Stats
    stats: {
      system: state.totalCommands - (state.lastMatch ? 1 : 0), // Aproximado
      frases: 0,
      templates: 0,
    },
    
    // Controle
    start,
    stop,
    
    // Comandos
    reloadCommands,
    processTranscript,
    getCommands,
    filterByModalidade,
    
    // Configuração
    setDebug,
    attachEditor,
    detachEditor,
  };
}

// Re-export types
export type { VoiceCommand, CommandMatchResult, CommandExecutionResult };
