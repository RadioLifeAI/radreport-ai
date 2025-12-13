/**
 * useVoiceEngine - React Hook (Intent Detection)
 * Hook para integrar o VoiceCommandEngine com componentes React
 * 
 * ARQUITETURA: Intent Detection + Dynamic Search
 * - Comandos de sistema pré-carregados
 * - Templates/frases buscados dinamicamente via callbacks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { getVoiceEngine, initVoiceEngine } from '@/lib/voiceEngine';
import { useReportStore } from '@/store';
import type { 
  VoiceEngineState, 
  CommandMatchResult, 
  CommandExecutionResult,
  VoiceCommand,
  CommandStats,
  SearchContext,
} from '@/modules/voice-command-engine';

export interface UseVoiceEngineOptions {
  autoInit?: boolean;
  debug?: boolean;
  editor?: Editor | null;
  templates?: any[];
  frases?: any[];
  // Callbacks legado
  onTemplateDetected?: (templateId: string) => void;
  onFraseDetected?: (fraseId: string) => void;
  // Callbacks Intent Detection
  onSearchTemplate?: (query: string, context: SearchContext) => void;
  onSearchFrase?: (query: string, context: SearchContext) => void;
  // Callback para parar ditado
  onStopDictation?: () => void;
}

export interface UseVoiceEngineReturn {
  // Estado
  isReady: boolean;
  isActive: boolean;
  totalCommands: number;
  lastMatch: CommandMatchResult | null;
  lastExecution: CommandExecutionResult | null;
  
  // Stats precisas
  stats: CommandStats;
  
  // Controle
  start: () => void;
  stop: () => void;
  
  // Comandos
  buildFromData: (templates: any[], frases: any[]) => void;
  processTranscript: (text: string) => Promise<CommandMatchResult | null>;
  getCommands: () => VoiceCommand[];
  filterByModalidade: (modalidade: string) => VoiceCommand[];
  
  // Configuração
  setDebug: (enabled: boolean) => void;
  attachEditor: (editor: Editor) => void;
  detachEditor: () => void;
}

export function useVoiceEngine(options: UseVoiceEngineOptions = {}): UseVoiceEngineReturn {
  const { autoInit = true, debug = false, editor, templates, frases, onTemplateDetected, onFraseDetected, onSearchTemplate, onSearchFrase, onStopDictation } = options;
  
  // ✨ FASE 6: Obter modalidade e região do store
  const { modalidade, regiao } = useReportStore();
  
  const [state, setState] = useState<VoiceEngineState>({
    isReady: false,
    isActive: false,
    totalCommands: 0,
    lastMatch: null,
    lastExecution: null,
    loadedAt: null,
  });
  
  const [stats, setStats] = useState<CommandStats>({
    system: 0,
    frases: 0,
    templates: 0,
    total: 0,
  });
  
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const isInitializedRef = useRef(false);

  // Atualizar estado do engine
  const updateState = useCallback(() => {
    const engine = getVoiceEngine();
    setState(engine.getState());
    setStats(engine.getStats());
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
          
          // Configurar callbacks
          engine.setCallbacks({
            onCommandMatch: () => updateState(),
            onCommandExecute: () => updateState(),
            onCommandReject: () => updateState(),
            onTemplateDetected,
            onFraseDetected,
            onSearchTemplate,
            onSearchFrase,
            onStopDictation,
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
  }, [autoInit, debug, updateState, onTemplateDetected, onFraseDetected, onSearchTemplate, onSearchFrase]);

  // Atualizar callbacks quando mudam
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const engine = getVoiceEngine();
    engine.setCallbacks({
      onCommandMatch: () => updateState(),
      onCommandExecute: () => updateState(),
      onCommandReject: () => updateState(),
      onTemplateDetected,
      onFraseDetected,
      onSearchTemplate,
      onSearchFrase,
      onStopDictation,
    });
  }, [onTemplateDetected, onFraseDetected, onSearchTemplate, onSearchFrase, onStopDictation, updateState]);

  // Atualizar contagens quando templates/frases mudam (inclui user content)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const engine = getVoiceEngine();
    // Templates e frases já incluem user content quando passados via props
    engine.updateDataCounts(templates?.length || 0, frases?.length || 0);
  }, [templates?.length, frases?.length]);

  // ✨ FASE 6: Sincronizar contexto (modalidade + região) quando mudam
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const engine = getVoiceEngine();
    engine.setCurrentContext(modalidade || null, regiao || null);
    
    console.log(`[useVoiceEngine] 📍 Contexto sincronizado: mod=${modalidade}, reg=${regiao}`);
  }, [modalidade, regiao]);

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

  // Construir comandos manualmente
  const buildFromData = useCallback((templates: any[], frases: any[]) => {
    const engine = getVoiceEngine();
    engine.buildFromExistingData(templates, frases);
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
    
    // Stats precisas
    stats,
    
    // Controle
    start,
    stop,
    
    // Comandos
    buildFromData,
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
export type { VoiceCommand, CommandMatchResult, CommandExecutionResult, CommandStats };
