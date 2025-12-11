/**
 * Voice Command Engine - System Commands
 * Comandos fixos do sistema (pontuação, navegação, formatação, ações)
 */

import type { VoiceCommand } from './types';

/**
 * Comandos de pontuação
 */
export const PUNCTUATION_COMMANDS: VoiceCommand[] = [
  {
    id: 'punct_period',
    name: 'ponto',
    phrases: ['ponto final', 'ponto.'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '.',
    priority: 100,
  },
  {
    id: 'punct_comma',
    name: 'vírgula',
    phrases: ['virgula'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ',',
    priority: 100,
  },
  {
    id: 'punct_question',
    name: 'ponto de interrogação',
    phrases: ['interrogação', 'pergunta'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '?',
    priority: 100,
  },
  {
    id: 'punct_exclamation',
    name: 'ponto de exclamação',
    phrases: ['exclamação'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '!',
    priority: 100,
  },
  {
    id: 'punct_colon',
    name: 'dois pontos',
    phrases: ['dois-pontos'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ':',
    priority: 100,
  },
  {
    id: 'punct_semicolon',
    name: 'ponto e vírgula',
    phrases: ['ponto-e-vírgula', 'ponto virgula'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ';',
    priority: 100,
  },
  {
    id: 'punct_open_paren',
    name: 'abrir parênteses',
    phrases: ['abre parênteses', 'parênteses'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '(',
    priority: 100,
  },
  {
    id: 'punct_close_paren',
    name: 'fechar parênteses',
    phrases: ['fecha parênteses', 'fim parênteses'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ')',
    priority: 100,
  },
  {
    id: 'punct_hyphen',
    name: 'hífen',
    phrases: ['traço', 'travessão'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '-',
    priority: 100,
  },
  {
    id: 'punct_slash',
    name: 'barra',
    phrases: ['barra normal'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '/',
    priority: 100,
  },
];

/**
 * Comandos estruturais (linhas, parágrafos)
 */
export const STRUCTURAL_COMMANDS: VoiceCommand[] = [
  {
    id: 'struct_newline',
    name: 'nova linha',
    phrases: ['próxima linha', 'linha', 'enter', 'quebra de linha'],
    category: 'structural',
    actionType: 'structural',
    payload: 'newline',
    priority: 95,
  },
  {
    id: 'struct_paragraph',
    name: 'novo parágrafo',
    phrases: ['parágrafo', 'próximo parágrafo', 'pular parágrafo'],
    category: 'structural',
    actionType: 'structural',
    payload: 'paragraph',
    priority: 95,
  },
  {
    id: 'struct_tab',
    name: 'tabulação',
    phrases: ['tab', 'recuo'],
    category: 'structural',
    actionType: 'structural',
    payload: 'tab',
    priority: 90,
  },
];

/**
 * Comandos de edição
 */
export const EDITING_COMMANDS: VoiceCommand[] = [
  {
    id: 'edit_delete_word',
    name: 'apagar palavra',
    phrases: ['deletar palavra', 'remover palavra', 'apagar isso'],
    category: 'system',
    actionType: 'system',
    payload: 'delete_word',
    priority: 90,
  },
  {
    id: 'edit_delete_line',
    name: 'apagar linha',
    phrases: ['deletar linha', 'remover linha'],
    category: 'system',
    actionType: 'system',
    payload: 'delete_line',
    priority: 90,
  },
  {
    id: 'edit_undo',
    name: 'desfazer',
    phrases: ['undo', 'voltar', 'ctrl z'],
    category: 'system',
    actionType: 'system',
    payload: 'undo',
    priority: 90,
  },
  {
    id: 'edit_redo',
    name: 'refazer',
    phrases: ['redo', 'avançar'],
    category: 'system',
    actionType: 'system',
    payload: 'redo',
    priority: 90,
  },
  {
    id: 'edit_select_all',
    name: 'selecionar tudo',
    phrases: ['selecionar todo', 'ctrl a'],
    category: 'system',
    actionType: 'system',
    payload: 'select_all',
    priority: 85,
  },
];

/**
 * Comandos de formatação
 */
export const FORMATTING_COMMANDS: VoiceCommand[] = [
  {
    id: 'format_bold',
    name: 'negrito',
    phrases: ['bold', 'texto negrito'],
    category: 'formatting',
    actionType: 'format',
    payload: 'bold',
    priority: 85,
  },
  {
    id: 'format_italic',
    name: 'itálico',
    phrases: ['italic', 'texto itálico'],
    category: 'formatting',
    actionType: 'format',
    payload: 'italic',
    priority: 85,
  },
  {
    id: 'format_underline',
    name: 'sublinhado',
    phrases: ['underline', 'sublinhar'],
    category: 'formatting',
    actionType: 'format',
    payload: 'underline',
    priority: 85,
  },
  {
    id: 'format_uppercase',
    name: 'maiúsculas',
    phrases: ['caixa alta', 'uppercase', 'letras maiúsculas'],
    category: 'formatting',
    actionType: 'format',
    payload: 'uppercase',
    priority: 85,
  },
  {
    id: 'format_lowercase',
    name: 'minúsculas',
    phrases: ['caixa baixa', 'lowercase', 'letras minúsculas'],
    category: 'formatting',
    actionType: 'format',
    payload: 'lowercase',
    priority: 85,
  },
];

/**
 * Comandos de navegação
 */
export const NAVIGATION_COMMANDS: VoiceCommand[] = [
  {
    id: 'nav_next_field',
    name: 'próximo campo',
    phrases: ['campo seguinte', 'avançar campo', 'pular campo'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'next_field',
    priority: 80,
  },
  {
    id: 'nav_prev_field',
    name: 'campo anterior',
    phrases: ['voltar campo'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'prev_field',
    priority: 80,
  },
  {
    id: 'nav_start',
    name: 'início do documento',
    phrases: ['ir para início', 'começo'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'start',
    priority: 80,
  },
  {
    id: 'nav_end',
    name: 'fim do documento',
    phrases: ['ir para fim', 'final'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'end',
    priority: 80,
  },
  {
    id: 'nav_impressao',
    name: 'ir para impressão',
    phrases: ['seção impressão', 'conclusão', 'ir para conclusão'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_impressao',
    priority: 85,
  },
  {
    id: 'nav_tecnica',
    name: 'ir para técnica',
    phrases: ['seção técnica'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_tecnica',
    priority: 85,
  },
  {
    id: 'nav_relatorio',
    name: 'ir para relatório',
    phrases: ['seção relatório', 'achados'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_relatorio',
    priority: 85,
  },
];

/**
 * Comandos de ação do sistema
 */
export const SYSTEM_ACTION_COMMANDS: VoiceCommand[] = [
  {
    id: 'sys_clear_editor',
    name: 'limpar editor',
    phrases: ['apagar tudo', 'novo documento', 'limpar tudo'],
    category: 'system',
    actionType: 'system',
    payload: 'clear_editor',
    priority: 70,
  },
  {
    id: 'sys_new_report',
    name: 'novo laudo',
    phrases: ['criar laudo', 'laudo novo', 'iniciar laudo'],
    category: 'system',
    actionType: 'system',
    payload: 'new_report',
    priority: 75,
  },
  {
    id: 'sys_insert_date',
    name: 'inserir data',
    phrases: ['data atual', 'hoje', 'data de hoje'],
    category: 'system',
    actionType: 'system',
    payload: 'insert_date',
    priority: 80,
  },
  {
    id: 'sys_insert_time',
    name: 'inserir hora',
    phrases: ['hora atual', 'horário'],
    category: 'system',
    actionType: 'system',
    payload: 'insert_time',
    priority: 80,
  },
  {
    id: 'sys_help',
    name: 'ajuda',
    phrases: ['comandos', 'o que posso dizer', 'listar comandos', 'mostrar ajuda'],
    category: 'system',
    actionType: 'system',
    payload: 'help',
    priority: 60,
  },
  {
    id: 'sys_stop_dictation',
    name: 'parar ditado',
    phrases: ['pausar ditado', 'parar', 'stop'],
    category: 'system',
    actionType: 'system',
    payload: 'stop_dictation',
    priority: 100,
  },
];

/**
 * Comandos especiais médicos
 */
export const MEDICAL_SPECIAL_COMMANDS: VoiceCommand[] = [
  {
    id: 'med_normal',
    name: 'exame normal',
    phrases: ['sem alterações', 'dentro da normalidade', 'normal'],
    category: 'frase',
    actionType: 'insert_content',
    payload: 'Exame sem alterações significativas.',
    priority: 70,
  },
  {
    id: 'med_comparison',
    name: 'comparado ao exame anterior',
    phrases: ['comparativo', 'em relação ao exame anterior'],
    category: 'frase',
    actionType: 'insert_content',
    payload: 'Comparado ao exame anterior, ',
    priority: 70,
  },
  {
    id: 'med_stable',
    name: 'aspecto estável',
    phrases: ['sem alteração evolutiva', 'inalterado'],
    category: 'frase',
    actionType: 'insert_content',
    payload: 'Aspecto estável em relação ao exame prévio.',
    priority: 70,
  },
  {
    id: 'med_suggest_correlation',
    name: 'correlação clínica',
    phrases: ['sugere-se correlação', 'correlacionar clinicamente'],
    category: 'frase',
    actionType: 'insert_content',
    payload: 'Sugere-se correlação clínico-laboratorial.',
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
 * Mapa de comandos por ID para acesso rápido
 */
export const SYSTEM_COMMANDS_MAP = new Map<string, VoiceCommand>(
  ALL_SYSTEM_COMMANDS.map(cmd => [cmd.id, cmd])
);

/**
 * Obter total de comandos do sistema
 */
export function getSystemCommandsCount(): number {
  return ALL_SYSTEM_COMMANDS.length;
}
