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

/**
 * Termos Médicos Radiológicos para Contextual Biasing (Web Speech API 2025)
 * Lista de termos frequentes em radiologia para melhorar reconhecimento
 */
export interface MedicalPhrase {
  phrase: string;
  boost: number; // 0.0 a 10.0, onde 10.0 é extremamente provável
  category: string;
}

export const MEDICAL_TERMS_FOR_BIASING: MedicalPhrase[] = [
  // Termos gerais de anatomia (boost moderado)
  { phrase: 'hepatomegalia', boost: 5.0, category: 'anatomia' },
  { phrase: 'esplenomegalia', boost: 5.0, category: 'anatomia' },
  { phrase: 'linfonodomegalia', boost: 5.0, category: 'anatomia' },
  { phrase: 'colecistolitíase', boost: 5.0, category: 'anatomia' },
  { phrase: 'nefrolitíase', boost: 5.0, category: 'anatomia' },
  
  // Termos de ultrassom (boost alto)
  { phrase: 'hipoecogênico', boost: 7.0, category: 'ultrassom' },
  { phrase: 'hiperecogênico', boost: 7.0, category: 'ultrassom' },
  { phrase: 'isoecogênico', boost: 7.0, category: 'ultrassom' },
  { phrase: 'anecogênico', boost: 7.0, category: 'ultrassom' },
  { phrase: 'anecóico', boost: 7.0, category: 'ultrassom' },
  
  // Classificações RADS (boost muito alto)
  { phrase: 'birads', boost: 8.0, category: 'classificacao' },
  { phrase: 'tirads', boost: 8.0, category: 'classificacao' },
  { phrase: 'pirads', boost: 8.0, category: 'classificacao' },
  { phrase: 'lirads', boost: 8.0, category: 'classificacao' },
  
  // Patologias comuns (boost moderado-alto)
  { phrase: 'esteatose', boost: 6.0, category: 'patologia' },
  { phrase: 'cirrose', boost: 6.0, category: 'patologia' },
  { phrase: 'hepatopatia', boost: 6.0, category: 'patologia' },
  { phrase: 'nefropatia', boost: 6.0, category: 'patologia' },
  { phrase: 'pneumonia', boost: 6.0, category: 'patologia' },
  { phrase: 'derrame', boost: 6.0, category: 'patologia' },
  { phrase: 'atelectasia', boost: 6.0, category: 'patologia' },
  
  // Modalidades (boost moderado)
  { phrase: 'tomografia', boost: 5.0, category: 'modalidade' },
  { phrase: 'ressonância', boost: 5.0, category: 'modalidade' },
  { phrase: 'ultrassonografia', boost: 5.0, category: 'modalidade' },
  { phrase: 'mamografia', boost: 5.0, category: 'modalidade' },
  
  // Técnica (boost baixo-moderado)
  { phrase: 'contraste', boost: 4.0, category: 'tecnica' },
  { phrase: 'intravenoso', boost: 4.0, category: 'tecnica' },
  { phrase: 'endovenoso', boost: 4.0, category: 'tecnica' },
  
  // Medidas (boost baixo)
  { phrase: 'centímetros', boost: 3.0, category: 'medida' },
  { phrase: 'milímetros', boost: 3.0, category: 'medida' }
];

/**
 * Converte termos médicos para o formato SpeechRecognitionPhrase
 */
export const getMedicalPhrasesForBiasing = () => {
  return MEDICAL_TERMS_FOR_BIASING.map(term => ({
    phrase: term.phrase,
    boost: term.boost
  }));
};
