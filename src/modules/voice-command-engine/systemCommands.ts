/**
 * Voice Command Engine - System Commands
 * FASE 3: Fonte única de verdade - Unificado com voiceCommandsConfig.ts
 */

import type { VoiceCommand } from './types';

/**
 * Comandos de pontuação - incluindo todos sinônimos do voiceCommandsConfig
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
    phrases: ['dois pontos', 'dois-pontos', '2 pontos'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: ':',
    priority: 100,
  },
  {
    id: 'punct_interrogacao',
    name: 'ponto de interrogação',
    phrases: ['ponto de interrogação', 'ponto de interrogacao', 'interrogação', 'interrogacao', 'ponto interrogação'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '?',
    priority: 100,
  },
  {
    id: 'punct_exclamacao',
    name: 'ponto de exclamação',
    phrases: ['ponto de exclamação', 'ponto de exclamacao', 'exclamação', 'exclamacao'],
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
    phrases: ['hífen', 'hifen', 'traço'],
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
    phrases: ['barra', 'barra normal'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '/',
    priority: 100,
  },
  {
    id: 'punct_aspas',
    name: 'aspas',
    phrases: ['aspas', 'abre aspas', 'fecha aspas'],
    category: 'punctuation',
    actionType: 'punctuation',
    payload: '"',
    priority: 100,
  },
  {
    id: 'punct_crase',
    name: 'crase',
    phrases: ['a crase', 'crase'],
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
 * Comandos de edição - incluindo sinônimos do voiceCommandsConfig
 */
export const EDITING_COMMANDS: VoiceCommand[] = [
  {
    id: 'edit_delete_word',
    name: 'apagar isso',
    phrases: ['apagar palavra', 'deletar palavra', 'remover palavra', 'apagar'],
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
    id: 'edit_delete_all',
    name: 'apagar tudo',
    phrases: ['deletar tudo', 'remover tudo', 'limpar tudo'],
    category: 'system',
    actionType: 'system',
    payload: 'delete_all',
    priority: 90,
  },
  {
    id: 'edit_undo',
    name: 'desfazer',
    phrases: ['desfaz', 'undo', 'voltar', 'ctrl z'],
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
    id: 'edit_cancel',
    name: 'cancelar',
    phrases: ['cancelar ditado', 'parar'],
    category: 'system',
    actionType: 'system',
    payload: 'cancel',
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
 * Comandos de formatação - incluindo sinônimos do voiceCommandsConfig
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
    phrases: ['italic', 'texto itálico', 'italico'],
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
    id: 'format_clear',
    name: 'remover formatação',
    phrases: ['limpar formatação', 'limpar formato'],
    category: 'formatting',
    actionType: 'format',
    payload: 'clear_format',
    priority: 85,
  },
  {
    id: 'format_align_left',
    name: 'alinhar esquerda',
    phrases: ['alinhar à esquerda', 'esquerda'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_left',
    priority: 85,
  },
  {
    id: 'format_align_center',
    name: 'alinhar centro',
    phrases: ['centralizar', 'centro'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_center',
    priority: 85,
  },
  {
    id: 'format_align_right',
    name: 'alinhar direita',
    phrases: ['alinhar à direita', 'direita'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_right',
    priority: 85,
  },
  {
    id: 'format_align_justify',
    name: 'alinhar justificado',
    phrases: ['justificar', 'justificado'],
    category: 'formatting',
    actionType: 'format',
    payload: 'align_justify',
    priority: 85,
  },
  {
    id: 'format_uppercase',
    name: 'tudo maiúsculo',
    phrases: ['maiúsculas', 'maiusculas', 'caixa alta', 'uppercase', 'letras maiúsculas'],
    category: 'formatting',
    actionType: 'format',
    payload: 'uppercase',
    priority: 85,
  },
  {
    id: 'format_lowercase',
    name: 'tudo minúsculo',
    phrases: ['minúsculas', 'minusculas', 'caixa baixa', 'lowercase', 'letras minúsculas'],
    category: 'formatting',
    actionType: 'format',
    payload: 'lowercase',
    priority: 85,
  },
  {
    id: 'format_list',
    name: 'lista',
    phrases: ['lista com marcadores', 'bullet list'],
    category: 'formatting',
    actionType: 'format',
    payload: 'bullet_list',
    priority: 85,
  },
  {
    id: 'format_list_numbered',
    name: 'lista numerada',
    phrases: ['lista ordenada', 'numbered list'],
    category: 'formatting',
    actionType: 'format',
    payload: 'ordered_list',
    priority: 85,
  },
];

/**
 * Comandos de navegação - incluindo sinônimos do voiceCommandsConfig
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
    name: 'ir para início',
    phrases: ['início do documento', 'começo', 'início'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'start',
    priority: 80,
  },
  {
    id: 'nav_end',
    name: 'ir para fim',
    phrases: ['fim do documento', 'final', 'fim'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'end',
    priority: 80,
  },
  {
    id: 'nav_impressao',
    name: 'ir para impressão',
    phrases: ['seção impressão', 'conclusão', 'ir para conclusão', 'impressão'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_impressao',
    priority: 85,
  },
  {
    id: 'nav_tecnica',
    name: 'ir para técnica',
    phrases: ['seção técnica', 'técnica'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_tecnica',
    priority: 85,
  },
  {
    id: 'nav_relatorio',
    name: 'ir para relatório',
    phrases: ['seção relatório', 'achados', 'relatório'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'section_relatorio',
    priority: 85,
  },
  {
    id: 'nav_procurar',
    name: 'procurar',
    phrases: ['buscar', 'encontrar'],
    category: 'navigation',
    actionType: 'navigate',
    payload: 'search',
    priority: 80,
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
