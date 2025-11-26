/**
 * Configuração Centralizada de Comandos de Voz em Português
 * RadReport Editor - Sistema Híbrido de Ditado e Comando
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
  // COMANDOS DE PONTUAÇÃO BÁSICA
  // ==========================================
  {
    command: 'vírgula',
    action: 'insert_text',
    parameters: { text: ', ', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere vírgula com espaço',
    examples: ['teste vírgula espaço']
  },
  {
    command: 'ponto',
    action: 'insert_text',
    parameters: { text: '. ', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere ponto final com espaço',
    examples: ['frase completa ponto']
  },
  {
    command: 'ponto e vírgula',
    action: 'insert_text',
    parameters: { text: '; ', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere ponto e vírgula com espaço'
  },
  {
    command: 'dois pontos',
    action: 'insert_text',
    parameters: { text: ': ', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere dois pontos com espaço'
  },
  {
    command: 'ponto de interrogação',
    action: 'insert_text',
    parameters: { text: '? ', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere ponto de interrogação com espaço'
  },
  {
    command: 'interrogação',
    action: 'insert_text',
    parameters: { text: '? ', spaceAfter: false },
    category: 'pontuação',
    description: 'Alternativa para ponto de interrogação'
  },
  {
    command: 'ponto de exclamação',
    action: 'insert_text',
    parameters: { text: '! ', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere ponto de exclamação com espaço'
  },
  {
    command: 'exclamação',
    action: 'insert_text',
    parameters: { text: '! ', spaceAfter: false },
    category: 'pontuação',
    description: 'Alternativa para ponto de exclamação'
  },
  {
    command: 'aspas',
    action: 'insert_text',
    parameters: { text: '""', cursorOffset: -1, spaceAfter: false },
    category: 'pontuação',
    description: 'Insere aspas duplas com cursor no meio'
  },
  {
    command: 'parênteses',
    action: 'insert_text',
    parameters: { text: '()', cursorOffset: -1, spaceAfter: false },
    category: 'pontuação',
    description: 'Insere parênteses com cursor no meio'
  },
  {
    command: 'travessão',
    action: 'insert_text',
    parameters: { text: '—', spaceAfter: false },
    category: 'pontuação',
    description: 'Insere travessão'
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
    command: 'próxima linha',
    action: 'newline',
    category: 'edição',
    description: 'Alternativa para quebra de linha'
  },
  {
    command: 'novo parágrafo',
    action: 'new_paragraph',
    category: 'edição',
    description: 'Cria novo parágrafo',
    examples: ['tópico novo parágrafo continuação']
  },
  {
    command: 'apagar tudo',
    action: 'clear_all',
    category: 'edição',
    description: 'Apaga todo o conteúdo do editor'
  },
  {
    command: 'apagar palavra',
    action: 'delete_word',
    category: 'edição',
    description: 'Apaga a palavra anterior ao cursor'
  },
  {
    command: 'apagar linha',
    action: 'delete_line',
    category: 'edição',
    description: 'Apaga a linha atual onde está o cursor'
  },
  {
    command: 'selecionar tudo',
    action: 'select_all',
    category: 'edição',
    description: 'Seleciona todo o texto do editor'
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
  },
  {
    command: 'centralizar',
    action: 'align_center',
    category: 'formatação',
    description: 'Centraliza o parágrafo atual'
  },
  {
    command: 'alinhado esquerda',
    action: 'align_left',
    category: 'formatação',
    description: 'Alinha o parágrafo à esquerda'
  },
  {
    command: 'alinhado direita',
    action: 'align_right',
    category: 'formatação',
    description: 'Alinha o parágrafo à direita'
  },
  {
    command: 'justificar',
    action: 'align_justify',
    category: 'formatação',
    description: 'Justifica o parágrafo atual'
  },

  // ==========================================
  // COMANDOS DE SEÇÕES MÉDICAS
  // ==========================================
  {
    command: 'inserir achados',
    action: 'insert_section',
    parameters: { section: 'achados' },
    category: 'seções médicas',
    description: 'Insere seção de achados',
    examples: ['inserir achados espaço ocupado']
  },
  {
    command: 'inserir conclusão',
    action: 'insert_section',
    parameters: { section: 'conclusao' },
    category: 'seções médicas',
    description: 'Insere seção de conclusão'
  },
  {
    command: 'inserir impressão',
    action: 'insert_section',
    parameters: { section: 'impressao' },
    category: 'seções médicas',
    description: 'Insere seção de impressão'
  },
  {
    command: 'inserir técnica',
    action: 'insert_section',
    parameters: { section: 'tecnica' },
    category: 'seções médicas',
    description: 'Insere seção de técnica'
  },
  {
    command: 'inserir indicações',
    action: 'insert_section',
    parameters: { section: 'indicacoes' },
    category: 'seções médicas',
    description: 'Insere seção de indicações'
  },

  // ==========================================
  // COMANDOS DE TEMPLATES
  // ==========================================
  {
    command: 'template mamografia',
    action: 'apply_template',
    parameters: { template: 'mamografia' },
    category: 'templates',
    description: 'Aplica template de mamografia'
  },
  {
    command: 'template tomografia',
    action: 'apply_template',
    parameters: { template: 'tomografia' },
    category: 'templates',
    description: 'Aplica template de tomografia'
  },
  {
    command: 'template ressonância',
    action: 'apply_template',
    parameters: { template: 'ressonancia' },
    category: 'templates',
    description: 'Aplica template de ressonância magnética'
  },
  {
    command: 'template raio x',
    action: 'apply_template',
    parameters: { template: 'raiox' },
    category: 'templates',
    description: 'Aplica template de raio X'
  },
  {
    command: 'template ultrassom',
    action: 'apply_template',
    parameters: { template: 'ultrassom' },
    category: 'templates',
    description: 'Aplica template de ultrassom'
  },

  // ==========================================
  // FRASES MÉDICAS COMUNS
  // ==========================================
  {
    command: 'sem alterações',
    action: 'insert_phrase',
    parameters: { phrase: 'Sem alterações significativas.' },
    category: 'frases médicas',
    description: 'Insere frase padrão de normalidade'
  },
  {
    command: 'sem achados',
    action: 'insert_phrase',
    parameters: { phrase: 'Sem achados patológicos significativos.' },
    category: 'frases médicas',
    description: 'Insere frase padrão de ausência de patologias'
  },
  {
    command: 'estudo normal',
    action: 'insert_phrase',
    parameters: { phrase: 'Estudo dentro dos limites da normalidade.' },
    category: 'frases médicas',
    description: 'Insere frase de estudo normal'
  },
  {
    command: 'correlacionar clínico',
    action: 'insert_phrase',
    parameters: { phrase: 'Correlacionar com dados clínicos.' },
    category: 'frases médicas',
    description: 'Insere sugestão de correlação clínica'
  },
  {
    command: 'comparar anterior',
    action: 'insert_phrase',
    parameters: { phrase: 'Comparar com estudo anterior.' },
    category: 'frases médicas',
    description: 'Insere sugestão de comparação'
  },

  // ==========================================
  // COMANDOS DE IA
  // ==========================================
  {
    command: 'gerar sugestão',
    action: 'ai_suggest',
    category: 'inteligência artificial',
    description: 'Solicita sugestão de texto à IA'
  },
  {
    command: 'completar texto',
    action: 'ai_complete',
    category: 'inteligência artificial',
    description: 'Solicita completamento de texto à IA'
  },
  {
    command: 'gerar conclusão',
    action: 'ai_conclusion',
    category: 'inteligência artificial',
    description: 'Solicita geração de conclusão à IA'
  },

  // ==========================================
  // COMANDOS DE CONTROLE DO SISTEMA
  // ==========================================
  {
    command: 'novo laudo',
    action: 'new_report',
    category: 'sistema',
    description: 'Cria novo laudo'
  },
  {
    command: 'salvar laudo',
    action: 'save_report',
    category: 'sistema',
    description: 'Salva o laudo atual'
  },
  {
    command: 'copiar laudo',
    action: 'copy_report',
    category: 'sistema',
    description: 'Copia o laudo para área de transferência'
  },
  {
    command: 'imprimir laudo',
    action: 'print_report',
    category: 'sistema',
    description: 'Imprime o laudo'
  },

  // ==========================================
  // COMANDOS DE CONTROLE DO DITADO
  // ==========================================
  {
    command: 'parar ditado',
    action: 'stop_listening',
    category: 'controle ditado',
    description: 'Para o reconhecimento de voz'
  },
  {
    command: 'pausar ditado',
    action: 'stop_listening',
    category: 'controle ditado',
    description: 'Alternativa para parar ditado'
  },
  {
    command: 'continuar ditado',
    action: 'start_listening',
    category: 'controle ditado',
    description: 'Continua o reconhecimento de voz'
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