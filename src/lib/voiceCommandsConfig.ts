/**
 * Configuração Centralizada de Comandos de Voz em Português
 * RadReport Editor - 47 Comandos Implementados e Funcionais
 */

export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, any>;
  category: string;
  description: string;
  examples?: string[];
  followedBy?: string;
  synonyms?: string[];
}

export const VOICE_COMMANDS_CONFIG: VoiceCommand[] = [
  // ==========================================
  // COMANDOS DE PONTUAÇÃO
  // ==========================================
  {
    command: 'vírgula',
    action: 'insert_text',
    parameters: { text: ',' },
    category: 'pontuação',
    description: 'Insere vírgula',
    examples: ['teste vírgula espaço']
  },
  {
    command: 'ponto',
    action: 'insert_text',
    parameters: { text: '.' },
    category: 'pontuação',
    description: 'Insere ponto final',
    examples: ['frase completa ponto']
  },
  {
    command: 'ponto e vírgula',
    action: 'insert_text',
    parameters: { text: ';' },
    category: 'pontuação',
    description: 'Insere ponto e vírgula'
  },
  {
    command: 'dois pontos',
    action: 'insert_text',
    parameters: { text: ':' },
    category: 'pontuação',
    description: 'Insere dois pontos'
  },
  {
    command: 'ponto de interrogação',
    action: 'insert_text',
    parameters: { text: '?' },
    category: 'pontuação',
    description: 'Insere ponto de interrogação',
    synonyms: ['interrogação']
  },
  {
    command: 'ponto de exclamação',
    action: 'insert_text',
    parameters: { text: '!' },
    category: 'pontuação',
    description: 'Insere ponto de exclamação',
    synonyms: ['exclamação']
  },
  {
    command: 'reticências',
    action: 'insert_text',
    parameters: { text: '...' },
    category: 'pontuação',
    description: 'Insere reticências'
  },
  {
    command: 'abre parênteses',
    action: 'insert_text',
    parameters: { text: '(' },
    category: 'pontuação',
    description: 'Abre parênteses',
    synonyms: ['abrir parênteses', 'parênteses abre']
  },
  {
    command: 'fecha parênteses',
    action: 'insert_text',
    parameters: { text: ')' },
    category: 'pontuação',
    description: 'Fecha parênteses',
    synonyms: ['fechar parênteses', 'parênteses fecha']
  },
  {
    command: 'hífen',
    action: 'insert_text',
    parameters: { text: '-' },
    category: 'pontuação',
    description: 'Insere hífen'
  },
  {
    command: 'travessão',
    action: 'insert_text',
    parameters: { text: '—' },
    category: 'pontuação',
    description: 'Insere travessão'
  },
  {
    command: 'a crase',
    action: 'insert_text',
    parameters: { text: 'à' },
    category: 'pontuação',
    description: 'Insere crase (à)',
    synonyms: ['crase']
  },
  {
    command: 'barra',
    action: 'insert_text',
    parameters: { text: '/' },
    category: 'pontuação',
    description: 'Insere barra'
  },
  {
    command: 'aspas',
    action: 'insert_text',
    parameters: { text: '"' },
    category: 'pontuação',
    description: 'Insere aspas'
  },
  {
    command: 'ponto parágrafo',
    action: 'insert_text',
    parameters: { text: '.' },
    followedBy: 'split_block',
    category: 'pontuação',
    description: 'Insere ponto e cria novo parágrafo'
  },
  {
    command: 'ponto final',
    action: 'insert_text',
    parameters: { text: '.' },
    category: 'pontuação',
    description: 'Insere ponto final'
  },

  // ==========================================
  // COMANDOS ESTRUTURAIS / NAVEGAÇÃO
  // ==========================================
  {
    command: 'nova linha',
    action: 'hard_break',
    category: 'navegação',
    description: 'Insere quebra de linha',
    examples: ['texto nova linha continuação'],
    synonyms: ['próxima linha', 'linha']
  },
  {
    command: 'novo parágrafo',
    action: 'split_block',
    category: 'navegação',
    description: 'Cria novo parágrafo',
    examples: ['tópico novo parágrafo continuação'],
    synonyms: ['próximo parágrafo', 'parágrafo']
  },
  {
    command: 'próximo campo',
    action: 'next_field',
    category: 'navegação',
    description: 'Pula para o próximo campo/marcador <>',
    examples: ['próximo campo']
  },
  {
    command: 'ir para início',
    action: 'go_start',
    category: 'navegação',
    description: 'Move cursor para início do documento',
    synonyms: ['início']
  },
  {
    command: 'ir para fim',
    action: 'go_end',
    category: 'navegação',
    description: 'Move cursor para fim do documento',
    synonyms: ['fim']
  },
  {
    command: 'selecionar tudo',
    action: 'select_all',
    category: 'navegação',
    description: 'Seleciona todo o texto'
  },
  {
    command: 'procurar',
    action: 'search_text',
    category: 'navegação',
    description: 'Busca texto no documento',
    examples: ['procurar hepatomegalia']
  },

  // ==========================================
  // COMANDOS DE EDIÇÃO
  // ==========================================
  {
    command: 'apagar isso',
    action: 'delete_word',
    category: 'edição',
    description: 'Apaga a última palavra ditada',
    synonyms: ['apagar palavra', 'apagar']
  },
  {
    command: 'apagar linha',
    action: 'delete_line',
    category: 'edição',
    description: 'Apaga a linha atual'
  },
  {
    command: 'apagar tudo',
    action: 'delete_all',
    category: 'edição',
    description: 'Apaga todo o conteúdo'
  },
  {
    command: 'desfazer',
    action: 'undo',
    category: 'edição',
    description: 'Desfaz a última ação',
    synonyms: ['desfaz']
  },
  {
    command: 'refazer',
    action: 'redo',
    category: 'edição',
    description: 'Refaz a última ação desfeita'
  },
  {
    command: 'cancelar',
    action: 'cancel_dictation',
    category: 'edição',
    description: 'Cancela o ditado atual sem salvar'
  },

  // ==========================================
  // COMANDOS DE FORMATAÇÃO
  // ==========================================
  {
    command: 'negrito',
    action: 'toggle_bold',
    category: 'formatação',
    description: 'Ativa/desativa negrito no texto selecionado'
  },
  {
    command: 'itálico',
    action: 'toggle_italic',
    category: 'formatação',
    description: 'Ativa/desativa itálico no texto selecionado'
  },
  {
    command: 'sublinhado',
    action: 'toggle_underline',
    category: 'formatação',
    description: 'Ativa/desativa sublinhado no texto selecionado'
  },
  {
    command: 'remover formatação',
    action: 'clear_formatting',
    category: 'formatação',
    description: 'Remove toda formatação do texto selecionado',
    synonyms: ['limpar formatação']
  },
  {
    command: 'alinhar esquerda',
    action: 'align_left',
    category: 'formatação',
    description: 'Alinha texto à esquerda'
  },
  {
    command: 'alinhar centro',
    action: 'align_center',
    category: 'formatação',
    description: 'Centraliza texto',
    synonyms: ['centralizar']
  },
  {
    command: 'alinhar direita',
    action: 'align_right',
    category: 'formatação',
    description: 'Alinha texto à direita'
  },
  {
    command: 'alinhar justificado',
    action: 'align_justify',
    category: 'formatação',
    description: 'Justifica texto',
    synonyms: ['justificar']
  },
  {
    command: 'tudo maiúsculo',
    action: 'uppercase',
    category: 'formatação',
    description: 'Converte seleção para maiúsculas',
    synonyms: ['maiúsculas', 'caixa alta']
  },
  {
    command: 'tudo minúsculo',
    action: 'lowercase',
    category: 'formatação',
    description: 'Converte seleção para minúsculas',
    synonyms: ['minúsculas', 'caixa baixa']
  },
  {
    command: 'lista',
    action: 'toggle_bullet_list',
    category: 'formatação',
    description: 'Cria/remove lista com marcadores'
  },
  {
    command: 'lista numerada',
    action: 'toggle_ordered_list',
    category: 'formatação',
    description: 'Cria/remove lista numerada'
  },

  // ==========================================
  // COMANDOS ESPECIAIS
  // ==========================================
  {
    command: 'inserir data',
    action: 'insert_date',
    category: 'especiais',
    description: 'Insere data atual no formato brasileiro',
    synonyms: ['data atual', 'hoje']
  },
  {
    command: 'inserir hora',
    action: 'insert_time',
    category: 'especiais',
    description: 'Insere hora atual'
  }
];

/**
 * Agrupa comandos por categoria para exibição organizada
 */
export const getCommandsByCategory = (): Record<string, VoiceCommand[]> => {
  const grouped: Record<string, VoiceCommand[]> = {};
  
  VOICE_COMMANDS_CONFIG.forEach(cmd => {
    if (!grouped[cmd.category]) {
      grouped[cmd.category] = [];
    }
    grouped[cmd.category].push(cmd);
  });
  
  return grouped;
};

/**
 * Busca comandos por palavra-chave
 */
export const searchCommands = (query: string): VoiceCommand[] => {
  const lowerQuery = query.toLowerCase();
  return VOICE_COMMANDS_CONFIG.filter(cmd => 
    cmd.command.toLowerCase().includes(lowerQuery) ||
    cmd.description.toLowerCase().includes(lowerQuery) ||
    cmd.category.toLowerCase().includes(lowerQuery) ||
    cmd.synonyms?.some(s => s.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Verifica se um comando existe (inclui sinônimos)
 */
export const commandExists = (commandText: string): boolean => {
  const lower = commandText.toLowerCase();
  return VOICE_COMMANDS_CONFIG.some(cmd => 
    cmd.command.toLowerCase() === lower ||
    cmd.synonyms?.some(s => s.toLowerCase() === lower)
  );
};

/**
 * Obtém comando por texto (inclui sinônimos)
 */
export const getCommand = (commandText: string): VoiceCommand | undefined => {
  const lower = commandText.toLowerCase();
  return VOICE_COMMANDS_CONFIG.find(cmd => 
    cmd.command.toLowerCase() === lower ||
    cmd.synonyms?.some(s => s.toLowerCase() === lower)
  );
};

/**
 * Total de comandos disponíveis
 */
export const getTotalCommands = (): number => {
  return VOICE_COMMANDS_CONFIG.length;
};

/**
 * Estatísticas por categoria
 */
export const getCommandStats = (): Record<string, number> => {
  const stats: Record<string, number> = {};
  VOICE_COMMANDS_CONFIG.forEach(cmd => {
    stats[cmd.category] = (stats[cmd.category] || 0) + 1;
  });
  return stats;
};

/**
 * Lista de todos os padrões de comando para detecção
 */
export const getAllCommandPatterns = (): string[] => {
  const patterns: string[] = [];
  VOICE_COMMANDS_CONFIG.forEach(cmd => {
    patterns.push(cmd.command);
    if (cmd.synonyms) {
      patterns.push(...cmd.synonyms);
    }
  });
  // Ordenar por tamanho decrescente para evitar conflitos (ex: "ponto e vírgula" antes de "ponto")
  return patterns.sort((a, b) => b.length - a.length);
};
