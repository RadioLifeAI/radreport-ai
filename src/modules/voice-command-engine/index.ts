/**
 * Voice Command Engine - Main Export
 * Sistema avançado de comandos de voz para RadReport
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
} from './types';

export { DEFAULT_ENGINE_CONFIG } from './types';

// Fuzzy Matcher
export { FuzzyMatcher, fuzzyMatcher } from './fuzzyMatcher';

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

// Command Loader (otimizado - sem queries duplicadas)
export {
  buildCommandsFromData,
  convertTemplatesToCommands,
  convertFrasesToCommands,
  getSystemCommands,
  loadCacheStats,
  clearCommandCache,
  filterCommandsByCategory,
  filterCommandsByModalidade,
  loadAllCommands, // Legacy - deprecado
  type CommandStats,
} from './commandLoader';

// Safety Guard (proteção anti-colisão)
export {
  validateCommandSafety,
  getRecommendedAction,
  hasSafeCommandPrefix,
  isProtectedMedicalPhrase,
  PROTECTED_MEDICAL_WORDS,
  SAFE_COMMAND_PREFIXES,
} from './safetyGuard';
