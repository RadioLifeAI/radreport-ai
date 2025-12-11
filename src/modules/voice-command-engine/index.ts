/**
 * Voice Command Engine - Main Export
 * Sistema de comandos de voz com Intent Detection para RadReport
 */

// Classe principal
export { VoiceCommandEngine } from './VoiceCommandEngine';

// Tipos
export type {
  VoiceCommand,
  CommandMatchResult,
  CommandExecutionResult,
  VoiceEngineConfig,
  VoiceEngineState,
  VoiceEngineCallbacks,
  IVoiceCommandEngine,
  CommandActionType,
  CommandCategory,
  SupabaseFrase,
  SupabaseTemplate,
  SearchContext,
} from './types';

export { DEFAULT_ENGINE_CONFIG } from './types';

// Fuzzy Matcher
export { FuzzyMatcher, fuzzyMatcher } from './fuzzyMatcher';

// Intent Detector (nova arquitetura)
export {
  detectIntent,
  hasCommandPrefix,
  getIntentType,
  TEMPLATE_PREFIXES,
  FRASE_PREFIXES,
  type DetectedIntent,
  type IntentType,
} from './intentDetector';

// Dynamic Search (nova arquitetura)
export {
  searchTemplates,
  searchFrases,
  searchTemplatesMultiple,
  searchFrasesMultiple,
  type TemplateSearchItem,
  type FraseSearchItem,
  type SearchResult,
} from './dynamicSearch';

// System Commands
export {
  PUNCTUATION_COMMANDS,
  STRUCTURAL_COMMANDS,
  EDITING_COMMANDS,
  FORMATTING_COMMANDS,
  NAVIGATION_COMMANDS,
  SYSTEM_ACTION_COMMANDS,
  MEDICAL_SPECIAL_COMMANDS,
  ALL_SYSTEM_COMMANDS,
  SYSTEM_COMMANDS_MAP,
  getSystemCommandsCount,
} from './systemCommands';

// Command Loader (simplificado)
export {
  getSystemCommands,
  buildStatsFromData,
  loadCacheStats,
  clearCommandCache,
  filterCommandsByCategory,
  type CommandStats,
  // Legacy exports (deprecados)
  buildCommandsFromData,
  convertTemplatesToCommands,
  convertFrasesToCommands,
  loadAllCommands,
  filterCommandsByModalidade,
} from './commandLoader';

// Safety Guard (simplificado)
export {
  validateSystemCommand,
  validateCommandSafety, // deprecated alias
  getRecommendedAction,
  hasSafeCommandPrefix,
  isProtectedMedicalPhrase,
  PROTECTED_MEDICAL_WORDS,
  SAFE_COMMAND_PREFIXES,
} from './safetyGuard';
