/**
 * Voice Command Engine - System Commands
 * FASE 1: Comandos seguros anti-colisão com ditado médico
 * 
 * PRINCÍPIO: Palavras únicas comuns em laudos (direita, esquerda, etc.)
 * NUNCA podem ser comandos. Exigir 2+ palavras para comandos.
 */

import type { VoiceCommand } from './types';

/**
 * Comandos de pontuação - SEGUROS (nunca aparecem em laudos)
 */
export const PUNCTUATION_COMMANDS: VoiceCommand[] = [
  {
    id: 'punct_virgula',
    name: 'vírgula',
    phrases: ['virgula', 'vírgula'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ',',
    priority: 100,
  },
  {
    id: 'punct_ponto',
    name: 'ponto',
    phrases: ['ponto final', 'ponto'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '.',
    priority: 100,
  },
  {
    id: 'punct_ponto_virgula',
    name: 'ponto e vírgula',
    phrases: ['ponto e vírgula', 'ponto e virgula', 'ponto vírgula', 'ponto-e-vírgula'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ';',
    priority: 100,
  },
  {
    id: 'punct_dois_pontos',
    name: 'dois pontos',
    phrases: ['dois pontos', 'dois-pontos'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ':',
    priority: 100,
  },
  {
    id: 'punct_interrogacao',
    name: 'ponto de interrogação',
    phrases: ['ponto de interrogação', 'ponto de interrogacao', 'ponto interrogação'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '?',
    priority: 100,
  },
  {
    id: 'punct_exclamacao',
    name: 'ponto de exclamação',
    phrases: ['ponto de exclamação', 'ponto de exclamacao'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '!',
    priority: 100,
  },
  {
    id: 'punct_reticencias',
    name: 'reticências',
    phrases: ['reticências', 'reticencias', 'tres pontos'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '...',
    priority: 100,
  },
  {
    id: 'punct_open_paren',
    name: 'abre parênteses',
    phrases: ['abre parênteses', 'abrir parênteses', 'parênteses abre', 'abre parenteses'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '(',
    priority: 100,
  },
  {
    id: 'punct_close_paren',
    name: 'fecha parênteses',
    phrases: ['fecha parênteses', 'fechar parênteses', 'parênteses fecha', 'fecha parenteses'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ')',
    priority: 100,
  },
  {
    id: 'punct_hyphen',
    name: 'hífen',
    phrases: ['hífen', 'hifen'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '-',
    priority: 100,
  },
  {
    id: 'punct_travessao',
    name: 'travessão',
    phrases: ['travessão', 'travessao'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '—',
    priority: 100,
  },
  {
    id: 'punct_barra',
    name: 'barra',
    phrases: ['barra normal'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '/',
    priority: 100,
  },
  {
    id: 'punct_aspas',
    name: 'aspas',
    phrases: ['abre aspas', 'fecha aspas'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '"',
    priority: 100,
  },
  {
    id: 'punct_crase',
    name: 'crase',
    phrases: ['a crase'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: 'à',
    priority: 100,
  },
  {
    id: 'punct_ponto_paragrafo',
    name: 'ponto parágrafo',
    phrases: ['ponto parágrafo', 'ponto paragrafo'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '.\n\n',
    priority: 100,
  },
];

/**
 * Comandos estruturais - SEGUROS (2+ palavras)
 */
export const STRUCTURAL_COMMANDS: VoiceCommand[] = [
  {
    id: 'struct_newline',
    name: 'nova linha',
    phrases: ['nova linha', 'próxima linha', 'quebra de linha'],
    category: 'structural',
    actionType: 'structural',
    payload: 'newline',
    priority: 95,
  },
  {
    id: 'struct_paragraph',
    name: 'novo parágrafo',
    phrases: ['novo parágrafo', 'próximo parágrafo', 'pular parágrafo'],
    category: 'structural',
    actionType: 'structural',
    payload: 'paragraph',
    priority: 95,
  },
  {
    id: 'struct_tab',
    name: 'tabulação',
    phrases: ['inserir tab', 'inserir recuo'],
    category: 'structural',
    actionType: 'structural',
    payload: 'tab',
    priority: 90,
  },
];

/**
 * Comandos de edição - SEGUROS (2+ palavras)
 */
export const EDITING_COMMANDS: VoiceCommand[] = [
  {
    id: 'edit_delete_word',
    name: 'apagar isso',
    phrases: ['apagar isso', 'apagar palavra', 'deletar palavra', 'remover palavra'],
    category: 'system',
    actionType: 'system',
    payload: 'delete_word',
    priority: 90,
  },
  {
    id: 'edit_delete_line',
    name: 'apagar linha',
    phrases: ['apagar linha', 'deletar linha', 'remover linha'],
    category: 'system',
    actionType: 'system',
    payload: 'delete_line',
    priority: 90,
  },
  {
    id: 'edit_delete_all',
    name: 'apagar tudo',
    phrases: ['apagar tudo', 'deletar tudo', 'remover tudo', 'limpar tudo'],
    category: 'system',
    actionType: 'system',
    payload: 'delete_all',
    priority: 90,
  },
  {
    id: 'edit_undo',
    name: 'desfazer',
    phrases: ['desfazer', 'desfaz', 'comando desfazer'],
    category: 'system',
    actionType: 'system',
    payload: 'undo',
    priority: 90,
  },
  {
    id: 'edit_redo',
    name: 'refazer',
    phrases: ['refazer', 'comando refazer'],
    category: 'system',
    actionType: 'system',
    payload: 'redo',
    priority: 90,
  },
  {
    id: 'edit_cancel',
    name: 'cancelar ditado',
    phrases: ['cancelar ditado', 'parar ditado'],
    category: 'system',
    actionType: 'system',
    payload: 'cancel',
    priority: 90,
  },
  {
    id: 'edit_select_all',
    name: 'selecionar tudo',
    phrases: ['selecionar tudo', 'selecionar todo'],
    category: 'system',
    actionType: 'system',
    payload: 'select_all',
    priority: 85,
  },
];

/**
 * Comandos de formatação - SEGUROS (exigir prefixo "formatação" ou 2+ palavras)
 * REMOVIDOS: palavras únicas como "direita", "esquerda", "centro"
 */
export const FORMATTING_COMMANDS: VoiceCommand[] = [
  {
    id: 'format_bold',
    name: 'texto negrito',
    phrases: ['texto negrito', 'formatação negrito', 'aplicar negrito'],
    category: 'formatting',
    actionType: 'format',
    payload: 'bold',
    priority: 85,
  },
  {
    id: 'format_italic',
    name: 'texto itálico',
    phrases: ['texto itálico', 'formatação itálico', 'aplicar itálico'],
    category: 'formatting',
    actionType: 'format',
    payload: 'italic',
    priority: 85,
  },
  {
    id: 'format_underline',
    name: 'texto sublinhado',
    phrases: ['texto sublinhado', 'sublinhar texto', 'aplicar sublinhado'],
    category: 'formatting',
    actionType: 'format',
    payload: 'underline',
    priority: 85,
  },
  {
    id: 'format_clear',
    name: 'remover formatação',
    phrases: ['remover formatação', 'limpar formatação', 'limpar formato'],
    category: 'formatting',
    actionType: 'format',
    payload: 'clear_format',
    priority: 85,
  },
  {
    id: 'format_align_left',
    name: 'alinhar à esquerda',
    phrases: ['alinhar à esquerda', 'alinhar esquerda', 'texto à esquerda'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_left',
    priority: 85,
  },
  {
    id: 'format_align_center',
    name: 'centralizar texto',
    phrases: ['centralizar texto', 'alinhar centro', 'texto centralizado'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_center',
    priority: 85,
  },
  {
    id: 'format_align_right',
    name: 'alinhar à direita',
    phrases: ['alinhar à direita', 'alinhar direita', 'texto à direita'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_right',
    priority: 85,
  },
  {
    id: 'format_align_justify',
    name: 'texto justificado',
    phrases: ['texto justificado', 'justificar texto', 'alinhar justificado'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_justify',
    priority: 85,
  },
  {
    id: 'format_uppercase',
    name: 'tudo maiúsculo',
    phrases: ['tudo maiúsculo', 'letras maiúsculas', 'caixa alta'],
    category: 'formatting',
    actionType: 'format',
    payload: 'uppercase',
    priority: 85,
  },
  {
    id: 'format_lowercase',
    name: 'tudo minúsculo',
    phrases: ['tudo minúsculo', 'letras minúsculas', 'caixa baixa'],
    category: 'formatting',
    actionType: 'format',
    payload: 'lowercase',
    priority: 85,
  },
  {
    id: 'format_list',
    name: 'criar lista',
    phrases: ['criar lista', 'lista com marcadores', 'inserir lista'],
    category: 'formatting',
    actionType: 'format',
    payload: 'bullet_list',
    priority: 85,
  },
  {
    id: 'format_list_numbered',
    name: 'lista numerada',
    phrases: ['lista numerada', 'lista ordenada', 'criar lista numerada'],
    category: 'formatting',
    actionType: 'format',
    payload: 'ordered_list',
    priority: 85,
  },
];

/**
 * Comandos de navegação - SEGUROS (exigir prefixo "ir para" ou 2+ palavras)
 * REMOVIDOS: "início", "fim", "conclusão" sozinhos
 */
export const NAVIGATION_COMMANDS: VoiceCommand[] = [
  {
    id: 'nav_next_field',
    name: 'próximo campo',
    phrases: ['próximo campo', 'campo seguinte', 'avançar campo', 'pular campo'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'next_field',
    priority: 80,
  },
  {
    id: 'nav_prev_field',
    name: 'campo anterior',
    phrases: ['campo anterior', 'voltar campo'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'prev_field',
    priority: 80,
  },
  {
    id: 'nav_start',
    name: 'ir para início',
    phrases: ['ir para início', 'ir para o início', 'início do documento'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'start',
    priority: 80,
  },
  {
    id: 'nav_end',
    name: 'ir para fim',
    phrases: ['ir para fim', 'ir para o fim', 'fim do documento', 'ir para final'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'end',
    priority: 80,
  },
  {
    id: 'nav_impressao',
    name: 'ir para impressão',
    phrases: ['ir para impressão', 'ir para conclusão', 'seção impressão', 'seção conclusão'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_impressao',
    priority: 85,
  },
  {
    id: 'nav_tecnica',
    name: 'ir para técnica',
    phrases: ['ir para técnica', 'seção técnica'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_tecnica',
    priority: 85,
  },
  {
    id: 'nav_relatorio',
    name: 'ir para relatório',
    phrases: ['ir para relatório', 'ir para achados', 'seção relatório', 'seção achados'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_relatorio',
    priority: 85,
  },
];

/**
 * Comandos de ação do sistema - SEGUROS (2+ palavras)
 */
export const SYSTEM_ACTION_COMMANDS: VoiceCommand[] = [
  {
    id: 'sys_clear_editor',
    name: 'limpar editor',
    phrases: ['limpar editor', 'novo documento'],
    category: 'system',
    actionType: 'system',
    payload: 'clear_editor',
    priority: 70,
  },
  {
    id: 'sys_new_report',
    name: 'novo laudo',
    phrases: ['novo laudo', 'criar laudo', 'laudo novo', 'iniciar laudo'],
    category: 'system',
    actionType: 'system',
    payload: 'new_report',
    priority: 75,
  },
  {
    id: 'sys_insert_date',
    name: 'inserir data',
    phrases: ['inserir data', 'data atual', 'data de hoje'],
    category: 'system',
    actionType: 'system',
    payload: 'insert_date',
    priority: 80,
  },
  {
    id: 'sys_insert_time',
    name: 'inserir hora',
    phrases: ['inserir hora', 'hora atual'],
    category: 'system',
    actionType: 'system',
    payload: 'insert_time',
    priority: 80,
  },
  {
    id: 'sys_help',
    name: 'mostrar ajuda',
    phrases: ['mostrar ajuda', 'listar comandos', 'comandos de voz'],
    category: 'system',
    actionType: 'system',
    payload: 'help',
    priority: 60,
  },
  {
    id: 'sys_stop_dictation',
    name: 'parar ditado',
    phrases: ['parar ditado', 'pausar ditado', 'stop ditado'],
    category: 'system',
    actionType: 'system',
    payload: 'stop_dictation',
    priority: 100,
  },
];

/**
 * Comandos médicos especiais - SEGUROS (frases específicas)
 */
export const MEDICAL_SPECIAL_COMMANDS: VoiceCommand[] = [
  {
    id: 'med_dentro_normalidade',
    name: 'dentro da normalidade',
    phrases: ['dentro da normalidade', 'dentro dos limites da normalidade', 'aspecto normal'],
    category: 'system',
    actionType: 'insert_content',
    payload: 'dentro dos limites da normalidade',
    priority: 70,
  },
  {
    id: 'med_sem_alteracoes',
    name: 'sem alterações',
    phrases: ['sem alterações significativas', 'sem alterações relevantes', 'sem alterações focais'],
    category: 'system',
    actionType: 'insert_content',
    payload: 'sem alterações significativas',
    priority: 70,
  },
  {
    id: 'med_exame_normal',
    name: 'exame normal',
    phrases: ['exame dentro da normalidade', 'estudo normal', 'exame sem alterações'],
    category: 'system',
    actionType: 'insert_content',
    payload: 'Exame dentro dos limites da normalidade.',
    priority: 70,
  },
];

/**
 * Todos os comandos do sistema combinados
 */
export const ALL_SYSTEM_COMMANDS: VoiceCommand[] = [
  ...PUNCTUATION_COMMANDS,
  ...STRUCTURAL_COMMANDS,
  ...EDITING_COMMANDS,
  ...FORMATTING_COMMANDS,
  ...NAVIGATION_COMMANDS,
  ...SYSTEM_ACTION_COMMANDS,
  ...MEDICAL_SPECIAL_COMMANDS,
];

/**
 * Mapa de comandos para lookup rápido
 */
export const SYSTEM_COMMANDS_MAP: Map<string, VoiceCommand> = new Map(
  ALL_SYSTEM_COMMANDS.map(cmd => [cmd.id, cmd])
);

/**
 * Conta total de comandos do sistema
 */
export function getSystemCommandsCount(): number {
  return ALL_SYSTEM_COMMANDS.length;
}
