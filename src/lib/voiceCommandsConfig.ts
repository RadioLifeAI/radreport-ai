/**
 * Configuração Centralizada de Comandos de Voz em Português
 * RadReport Editor - Comandos Implementados e Funcionais
 */

export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, any>;
  category: string;
  description: string;
  examples?: string[];
}

export const VOICE_COMMANDS_CONFIG: VoiceCommand[] = [
  // ==========================================
  // COMANDOS DE PONTUAÇÃO (processados via replaceVoiceCommands)
  // ==========================================
  {
    command: 'vírgula',
    action: 'insert_text',
    parameters: { text: ', ' },
    category: 'pontuação',
    description: 'Insere vírgula com espaço',
    examples: ['teste vírgula espaço']
  },
  {
    command: 'ponto',
    action: 'insert_text',
    parameters: { text: '. ' },
    category: 'pontuação',
    description: 'Insere ponto final com espaço',
    examples: ['frase completa ponto']
  },
  {
    command: 'ponto e vírgula',
    action: 'insert_text',
    parameters: { text: '; ' },
    category: 'pontuação',
    description: 'Insere ponto e vírgula com espaço'
  },
  {
    command: 'dois pontos',
    action: 'insert_text',
    parameters: { text: ': ' },
    category: 'pontuação',
    description: 'Insere dois pontos com espaço'
  },
  {
    command: 'interrogação',
    action: 'insert_text',
    parameters: { text: '? ' },
    category: 'pontuação',
    description: 'Insere ponto de interrogação com espaço'
  },
  {
    command: 'exclamação',
    action: 'insert_text',
    parameters: { text: '! ' },
    category: 'pontuação',
    description: 'Insere ponto de exclamação com espaço'
  },

  // ==========================================
  // COMANDOS DE NAVEGAÇÃO E EDIÇÃO
  // ==========================================
  {
    command: 'nova linha',
    action: 'newline',
    category: 'edição',
    description: 'Insere quebra de linha',
    examples: ['texto nova linha continuação']
  },
  {
    command: 'novo parágrafo',
    action: 'new_paragraph',
    category: 'edição',
    description: 'Cria novo parágrafo',
    examples: ['tópico novo parágrafo continuação']
  },
  {
    command: 'apagar palavra',
    action: 'delete_word',
    category: 'edição',
    description: 'Apaga a última palavra ditada'
  },
  {
    command: 'desfazer',
    action: 'undo',
    category: 'edição',
    description: 'Desfaz a última ação'
  },
  {
    command: 'refazer',
    action: 'redo',
    category: 'edição',
    description: 'Refaz a última ação desfeita'
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
    cmd.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Verifica se um comando existe
 */
export const commandExists = (commandText: string): boolean => {
  return VOICE_COMMANDS_CONFIG.some(cmd => cmd.command === commandText);
};

/**
 * Obtém comando por texto exato
 */
export const getCommand = (commandText: string): VoiceCommand | undefined => {
  return VOICE_COMMANDS_CONFIG.find(cmd => cmd.command === commandText);
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
