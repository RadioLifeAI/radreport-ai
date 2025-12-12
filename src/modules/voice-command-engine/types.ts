/**
 * Voice Command Engine - Type Definitions
 * Sistema avançado de comandos de voz para RadReport
 */

import type { Editor } from '@tiptap/react';

// Tipos de ação de comando
export type CommandActionType = 
  | 'insert_content'      // Inserir conteúdo no editor
  | 'apply_template'      // Aplicar template completo
  | 'replace_selection'   // Substituir seleção atual
  | 'navigate'            // Navegar para seção
  | 'format'              // Aplicar formatação
  | 'system'              // Ação do sistema (limpar, novo laudo, etc.)
  | 'punctuation'         // Inserir pontuação
  | 'structural';         // Ação estrutural (nova linha, parágrafo)

// Categorias de comando
export type CommandCategory = 
  | 'template'            // Templates de laudo
  | 'frase'               // Frases modelo
  | 'system'              // Comandos do sistema
  | 'navigation'          // Navegação no editor
  | 'punctuation'         // Pontuação
  | 'formatting'          // Formatação de texto
  | 'structural';         // Estrutura (linhas, parágrafos)

// Interface principal do comando
export interface VoiceCommand {
  id: string;
  name: string;                       // Nome principal do comando
  phrases: string[];                  // Sinônimos e variações para matching
  category: CommandCategory;
  actionType: CommandActionType;
  payload?: string | Record<string, any>;  // Conteúdo ou dados da ação
  priority: number;                   // Peso para desempate (maior = mais prioritário)
  modalidade?: string;                // Modalidade médica (US, TC, RM, etc.)
  regiaoAnatomica?: string;           // Região anatômica
}

// Resultado do matching
export interface CommandMatchResult {
  command: VoiceCommand;
  score: number;                      // 0 = match perfeito, 1 = sem match
  matchedPhrase: string;              // Frase que deu match
  isExact: boolean;                   // Se foi match exato
}

// Resultado da execução
export interface CommandExecutionResult {
  success: boolean;
  command: VoiceCommand;
  message?: string;
  insertedContent?: string;
}

// Configuração do engine
export interface VoiceEngineConfig {
  fuzzyThreshold: number;             // Threshold do Fuse.js (0-1)
  minMatchScore: number;              // Score mínimo para aceitar (0-1)
  debug: boolean;                     // Modo debug
  autoReload: boolean;                // Recarregar comandos automaticamente
  reloadInterval: number;             // Intervalo de reload em ms
}

// Estado do engine
export interface VoiceEngineState {
  isReady: boolean;
  isActive: boolean;
  totalCommands: number;
  lastMatch: CommandMatchResult | null;
  lastExecution: CommandExecutionResult | null;
  loadedAt: Date | null;
}

// Dados de histórico de uso para boost inteligente
export interface UsageDataItem {
  usageCount: number;
  lastUsed: Date;
}

export interface UserUsageData {
  templateUsage?: Map<string, UsageDataItem>;
  fraseUsage?: Map<string, UsageDataItem>;
  favoriteTemplates?: Set<string>;
  favoriteFrases?: Set<string>;
}

// Contexto para busca dinâmica
export interface SearchContext {
  modalidade?: string | null;
  regiao?: string | null;
  userUsageData?: UserUsageData;
}

// Callbacks do engine
export interface VoiceEngineCallbacks {
  onCommandMatch?: (result: CommandMatchResult) => void;
  onCommandExecute?: (result: CommandExecutionResult) => void;
  onCommandReject?: (transcript: string, bestMatch: CommandMatchResult | null) => void;
  onError?: (error: Error) => void;
  
  // Callbacks de delegação para UI (legado)
  onTemplateDetected?: (templateId: string) => void;
  onFraseDetected?: (fraseId: string) => void;
  
  // Callbacks Intent Detection - busca dinâmica
  onSearchTemplate?: (query: string, context: SearchContext) => void;
  onSearchFrase?: (query: string, context: SearchContext) => void;
}

// Interface do Engine completo
export interface IVoiceCommandEngine {
  // Controle
  start(): void;
  stop(): void;
  
  // Configuração
  attachToTipTap(editor: Editor): void;
  detachFromTipTap(): void;
  setDebug(enabled: boolean): void;
  setConfig(config: Partial<VoiceEngineConfig>): void;
  
  // Comandos
  reloadCommands(): Promise<void>;
  loadSupabaseCommands(): Promise<void>;
  addCommand(command: VoiceCommand): void;
  removeCommand(id: string): void;
  getCommands(): VoiceCommand[];
  
  // Execução
  processTranscript(transcript: string): Promise<CommandMatchResult | null>;
  executeCommand(command: VoiceCommand): Promise<CommandExecutionResult>;
  
  // Estado
  getState(): VoiceEngineState;
  getConfig(): VoiceEngineConfig;
  
  // Callbacks
  setCallbacks(callbacks: VoiceEngineCallbacks): void;
}

// Dados do Supabase (campos reais da database)
export interface SupabaseFrase {
  id: string;
  codigo: string;
  texto: string;
  categoria?: string;
  modalidade_codigo?: string;
  sinônimos?: string[];
  tags?: string[];
  conclusao?: string;
  indicacao_clinica?: string;
  tecnica?: string;
  observacao?: string;
}

export interface SupabaseTemplate {
  id: string;
  titulo: string;
  conteudo_template: string;  // Campo real do banco
  modalidade_codigo?: string;
  regiao_codigo?: string;     // Campo real do banco
  tags?: string[];
  categoria?: string;
}

// Default config
export const DEFAULT_ENGINE_CONFIG: VoiceEngineConfig = {
  fuzzyThreshold: 0.35,
  minMatchScore: 0.5,
  debug: false,
  autoReload: false,
  reloadInterval: 300000, // 5 minutos
};
