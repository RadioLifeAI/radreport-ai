export interface ParsedCommand {
  action: string;
  confidence: number;
  parameters: Record<string, string>;
}

export interface MedicalTranscription {
  text: string;
  confidence: number;
  segments: any[];
  medicalTerms: string[];
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private keepAlive = false;
  private userStopped = false;
  private finalTranscript = '';
  private onResultDetailedCallback: ((result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => void) | null = null;
  private commandCallbacks = new Map<string, (text: string) => void>();
  private onResultCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private aiCommandCallbacks = new Map<string, (transcript: string, context?: any) => Promise<void>>();
  private medicalCommandParser = new MedicalCommandParser();
  private audioLevelCallback: ((level: number) => void) | null = null;
  private onEndCallback: ((reason: 'auto'|'user') => void) | null = null;
  private onStatusCallback: ((status: 'idle'|'waiting'|'listening') => void) | null = null;
  private onStatusCallbacks: Array<(status: 'idle'|'waiting'|'listening') => void> = [];
  private onEndCallbacks: Array<(reason: 'auto'|'user') => void> = [];
  private onResultDetailedCallbacks: Array<(result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => void> = [];
  private onErrorCallbacks: Array<(error: string) => void> = [];
  private config = { lang: 'pt-BR' };

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'pt-BR';
    this.recognition.maxAlternatives = (this.config as any).maxAlternatives ?? 1;
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStatusCallback) this.onStatusCallback('waiting');
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onaudiostart = () => {
      if (this.onStatusCallback) this.onStatusCallback('waiting');
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onsoundstart = () => {
      if (this.onStatusCallback) this.onStatusCallback('listening');
      this.onStatusCallbacks.forEach(cb => cb('listening'));
    };

    this.recognition.onsoundend = () => {
      if (this.onStatusCallback) this.onStatusCallback('waiting');
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onspeechstart = () => {
      if (this.onStatusCallback) this.onStatusCallback('listening');
      this.onStatusCallbacks.forEach(cb => cb('listening'));
    };

    this.recognition.onspeechend = () => {
      if (this.onStatusCallback) this.onStatusCallback('waiting');
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onresult = (event) => {
      const results = event.results;
      let interimTranscript = '';
      for (let i = event.resultIndex; i < results.length; ++i) {
        const res = results[i];
        const text = res[0].transcript;
        if (res.isFinal) {
          this.finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      const lastIsFinal = results[results.length - 1]?.isFinal === true;

      const lastRes: SpeechRecognitionResult | undefined = results[results.length - 1];
      const alternatives = lastRes ? Array.from(lastRes).map(a => a.transcript) : undefined;

      if (this.onResultCallback) {
        if (lastIsFinal) {
          this.onResultCallback(this.finalTranscript, true);
        } else {
          this.onResultCallback(interimTranscript, false);
        }
      }

      if (this.onResultDetailedCallback) {
        this.onResultDetailedCallback({
          transcript: lastIsFinal ? this.finalTranscript : interimTranscript,
          isFinal: lastIsFinal,
          alternatives
        });
      }

      this.onResultDetailedCallbacks.forEach(cb => cb({
        transcript: lastIsFinal ? this.finalTranscript : interimTranscript,
        isFinal: lastIsFinal,
        alternatives
      }));

      if (lastIsFinal) {
        this.processCommand(this.finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
      this.onErrorCallbacks.forEach(cb => cb(event.error));
      this.handleError(event.error);
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        this.keepAlive = false;
        this.userStopped = true;
        this.isListening = false;
        if (this.onStatusCallback) this.onStatusCallback('idle');
        this.onStatusCallbacks.forEach(cb => cb('idle'));
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        const reason: 'auto'|'user' = (this.keepAlive && !this.userStopped) ? 'auto' : 'user'
        this.onEndCallback(reason);
      }
      {
        const reason: 'auto'|'user' = (this.keepAlive && !this.userStopped) ? 'auto' : 'user'
        this.onEndCallbacks.forEach(cb => cb(reason));
      }
      // Reiniciar automaticamente se desejado (longa pausa)
      if (this.keepAlive && !this.userStopped) {
        setTimeout(() => this.startListening(), 300);
        if (this.onStatusCallback) this.onStatusCallback('waiting');
        this.onStatusCallbacks.forEach(cb => cb('waiting'));
      } else {
        if (this.onStatusCallback) this.onStatusCallback('idle');
        this.onStatusCallbacks.forEach(cb => cb('idle'));
      }
    };
  }

  private processCommand(transcript: string) {
    // First, try to parse as a medical command using the advanced parser
    const parsedCommand = this.medicalCommandParser.parseCommand(transcript);
    
    if (parsedCommand.confidence > 0.7) {
      this.executeMedicalCommand(parsedCommand);
      return;
    }

    // Comprehensive command matching based on Editor original
    this.executeVoiceCommand(transcript);
  }

  private executeVoiceCommand(transcript: string) {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Editor commands from original Editor.tsx
    const commands = {
      // Basic editing commands
      'deletar linha': () => this.executeEditorCommand('delete-line'),
      'apagar linha': () => this.executeEditorCommand('delete-line'),
      'remover linha': () => this.executeEditorCommand('delete-line'),
      'selecionar tudo': () => this.executeEditorCommand('select-all'),
      'selecionar todo texto': () => this.executeEditorCommand('select-all'),
      'novo parágrafo': () => this.executeEditorCommand('newline'),
      'nova linha': () => this.executeEditorCommand('newline'),
      'limpar tudo': () => this.executeEditorCommand('clear_all'),
      'apagar tudo': () => this.executeEditorCommand('clear_all'),
      'desfazer': () => this.executeEditorCommand('undo'),
      'refazer': () => this.executeEditorCommand('redo'),
      
      // List commands
      'lista com marcadores': () => this.executeEditorCommand('toggle-bullet-list'),
      'lista de marcadores': () => this.executeEditorCommand('toggle-bullet-list'),
      'lista numerada': () => this.executeEditorCommand('toggle-ordered-list'),
      'lista ordenada': () => this.executeEditorCommand('toggle-ordered-list'),
      
      // Block commands
      'citação': () => this.executeEditorCommand('toggle-blockquote'),
      'bloco de citação': () => this.executeEditorCommand('toggle-blockquote'),
      'bloco de código': () => this.executeEditorCommand('toggle-code-block'),
      'código': () => this.executeEditorCommand('toggle-code-block'),
      
      // Heading commands
      'título 1': () => this.executeEditorCommand('set-heading', { level: 1 }),
      'título um': () => this.executeEditorCommand('set-heading', { level: 1 }),
      'título 2': () => this.executeEditorCommand('set-heading', { level: 2 }),
      'título dois': () => this.executeEditorCommand('set-heading', { level: 2 }),
      'título 3': () => this.executeEditorCommand('set-heading', { level: 3 }),
      'título três': () => this.executeEditorCommand('set-heading', { level: 3 }),
      'título 4': () => this.executeEditorCommand('set-heading', { level: 4 }),
      'título quatro': () => this.executeEditorCommand('set-heading', { level: 4 }),
      
      // Break commands
      'quebra de linha': () => this.executeEditorCommand('hard-break'),
      
      // Indent commands
      'aumentar recuo': () => this.executeEditorCommand('increase-indent'),
      'aumentar indentação': () => this.executeEditorCommand('increase-indent'),
      'diminuir recuo': () => this.executeEditorCommand('decrease-indent'),
      'diminuir indentação': () => this.executeEditorCommand('decrease-indent'),
      
      // Link commands
      'inserir link': () => this.executeEditorCommand('insert-link'),
      'adicionar link': () => this.executeEditorCommand('insert-link'),
      'remover link': () => this.executeEditorCommand('remove-link'),
      'tirar link': () => this.executeEditorCommand('remove-link'),
      
      // Table commands
      'inserir tabela': () => this.executeEditorCommand('table-insert-row'),
      'adicionar linha': () => this.executeEditorCommand('table-insert-row'),
      'adicionar coluna': () => this.executeEditorCommand('table-insert-column'),
      'deletar coluna': () => this.executeEditorCommand('table-delete-column'),
      'mesclar células': () => this.executeEditorCommand('table-merge-cells'),
      'juntar células': () => this.executeEditorCommand('table-merge-cells'),
      
      // AI commands
      'corrigir': () => this.executeAICorrection(transcript),
      'sugerir': () => this.executeAISuggestion(transcript),
      'melhorar': () => this.executeAIImprovement(transcript),
      'validar': () => this.executeAIValidation(transcript),
      'ajuda': () => this.showHelp(),
      'parar': () => this.stopListening(),
      'começar': () => this.startListening()
    };

    const matchedCommand = Object.keys(commands).find(cmd => 
      normalizedTranscript.includes(cmd)
    );

    if (matchedCommand) {
      commands[matchedCommand as keyof typeof commands]();
    }
  }

  private executeEditorCommand(command: string, payload?: any) {
    const callback = this.commandCallbacks.get(command);
    if (callback) {
      callback(payload ? JSON.stringify(payload) : '');
    }
  }

  private async executeMedicalCommand(parsedCommand: ParsedCommand) {
    const { action, parameters } = parsedCommand;
    
    // Execute AI-specific commands
    switch (action) {
      case 'correct_report':
      case 'correct_text':
      case 'correct_spelling':
      case 'correct_grammar':
      case 'fix_text':
      case 'fix_error':
        await this.executeAICorrectionAsync(parameters.context || parameters.fullText);
        break;
        
      case 'suggest_term':
      case 'suggest_diagnosis':
      case 'suggest_treatment':
      case 'complete_sentence':
      case 'give_suggestion':
      case 'propose_improvement':
        await this.executeAISuggestionAsync(parameters.context || parameters.fullText);
        break;
        
      case 'improve_text':
      case 'make_clearer':
      case 'add_details':
      case 'formalize':
      case 'make_formal':
      case 'make_technical':
        await this.executeAIImprovementAsync(parameters.context || parameters.fullText);
        break;
        
      case 'validate_term':
      case 'check_cid':
      case 'confirm_diagnosis':
      case 'check_medication':
      case 'validate_report':
      case 'check_medical_term':
        await this.executeAIValidationAsync(parameters.context || parameters.fullText);
        break;
        
      default:
        // Check if there's a custom AI callback registered
        const aiCallback = this.aiCommandCallbacks.get(action);
        if (aiCallback) {
          await aiCallback(parameters.fullText, parameters);
        }
        break;
    }
  }

  private async executeAICorrectionAsync(text: string) {
    const callback = this.aiCommandCallbacks.get('ai-correct');
    if (callback) {
      await callback(text);
    }
  }

  private async executeAISuggestionAsync(text: string) {
    const callback = this.aiCommandCallbacks.get('ai-suggest');
    if (callback) {
      await callback(text);
    }
  }

  private async executeAIImprovementAsync(text: string) {
    const callback = this.aiCommandCallbacks.get('ai-improve');
    if (callback) {
      await callback(text);
    }
  }

  private async executeAIValidationAsync(text: string) {
    const callback = this.aiCommandCallbacks.get('ai-validate');
    if (callback) {
      await callback(text);
    }
  }

  private executeAICorrection(transcript: string) {
    const callback = this.commandCallbacks.get('ai-correct');
    if (callback) {
      callback(transcript);
    }
  }

  private executeAISuggestion(transcript: string) {
    const callback = this.commandCallbacks.get('ai-suggest');
    if (callback) {
      callback(transcript);
    }
  }

  private executeAIImprovement(transcript: string) {
    const callback = this.commandCallbacks.get('ai-improve');
    if (callback) {
      callback(transcript);
    }
  }

  private executeAIValidation(transcript: string) {
    const callback = this.commandCallbacks.get('ai-validate');
    if (callback) {
      callback(transcript);
    }
  }

  private showHelp() {
    const callback = this.commandCallbacks.get('help');
    if (callback) {
      callback('Comandos disponíveis: corrigir, sugerir, melhorar, validar, ajuda, parar');
    }
  }

  private handleError(error: string) {
    const callback = this.commandCallbacks.get('error');
    if (callback) {
      callback(`Erro de reconhecimento: ${error}`);
    }
  }

  public startListening(): boolean {
    // Já está ouvindo: não trate como erro
    if (this.isListening) return true;
    if (!this.recognition) {
      try {
        this.initializeRecognition();
      } catch (e) {
        console.error('Failed to initialize speech recognition:', e);
        return false;
      }
    }
    try {
      this.keepAlive = true;
      this.userStopped = false;
      this.finalTranscript = '';
      const docLang = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) ? document.documentElement.lang : undefined;
      const langToUse = this.config.lang || docLang || 'pt-BR';
      this.recognition!.lang = langToUse;
      this.recognition!.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  public stopListening(): boolean {
    if (!this.recognition || !this.isListening) {
      return false;
    }

    try {
      this.keepAlive = false;
      this.userStopped = true;
      if (typeof this.recognition.abort === 'function') {
        this.recognition.abort();
      } else {
        this.recognition.stop();
      }
      this.isListening = false;
      if (this.onStatusCallback) this.onStatusCallback('idle');
      return true;
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      return false;
    }
  }

  public isActive(): boolean {
    return this.isListening;
  }

  public onCommand(command: string, callback: (text: string) => void) {
    this.commandCallbacks.set(command, callback);
  }

  public onAICommand(command: string, callback: (text: string, context?: any) => Promise<void>) {
    this.aiCommandCallbacks.set(command, callback);
  }

  public onResult(callback: (transcript: string, isFinal: boolean) => void) {
    this.onResultCallback = callback;
  }

  public onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  public removeCommandCallback(command: string) {
    this.commandCallbacks.delete(command);
  }

  public clearAllCallbacks() {
    this.commandCallbacks.clear();
    this.onResultCallback = null;
    this.onErrorCallback = null;
  }

  public destroy() {
    this.stopListening();
    this.clearAllCallbacks();
    this.recognition = null;
  }

  // Missing methods that components are expecting
  public isSpeechRecognitionSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public updateConfig(config: { lang?: string; [key: string]: any }) {
    this.config = { ...this.config, ...config };
    if (this.recognition && config.lang) {
      this.recognition.lang = config.lang;
    }
    if (this.recognition && typeof (config as any).maxAlternatives === 'number') {
      try {
        // @ts-expect-error: propriedade existe na API Web Speech
        this.recognition.maxAlternatives = (config as any).maxAlternatives;
      } catch {}
    }
  }

  public setOnAudioLevel(callback: (level: number) => void) {
    this.audioLevelCallback = callback;
  }

  public setOnEnd(callback: (reason: 'auto'|'user') => void) {
    this.onEndCallback = callback;
    this.onEndCallbacks.push(callback);
  }

  public setOnStatus(callback: (status: 'idle'|'waiting'|'listening') => void) {
    this.onStatusCallback = callback;
    this.onStatusCallbacks.push(callback);
  }

  public setOnResult(callback: (result: { transcript: string; isFinal: boolean }) => void) {
    this.onResultCallback = (transcript: string, isFinal: boolean) => {
      callback({ transcript, isFinal });
    };
  }

  public setOnResultDetailed(callback: (result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => void) {
    this.onResultDetailedCallback = callback;
    this.onResultDetailedCallbacks.push(callback);
  }

  public setOnError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
    this.onErrorCallbacks.push(callback);
  }

  public integrateWithEditor(editor: any) {
    // Integration logic for editor
    console.log('Speech recognition integrated with editor');
  }

  public speak(text: string, opts?: { lang?: string; rate?: number }) {
    try {
      const u = new SpeechSynthesisUtterance();
      u.text = text;
      u.lang = opts?.lang ?? this.config.lang ?? 'pt-BR';
      u.rate = opts?.rate ?? 1;
      speechSynthesis.speak(u);
    } catch {}
  }
}

// Singleton instance
let speechRecognitionService: SpeechRecognitionService | null = null;

export function getSpeechRecognitionService(): SpeechRecognitionService {
  if (!speechRecognitionService) {
    speechRecognitionService = new SpeechRecognitionService();
  }
  return speechRecognitionService;
}

export class MedicalCommandParser {
  private medicalCommands = {
    // Corrections
    'corrigir laudo': 'correct_report',
    'corrigir texto': 'correct_text',
    'corrigir ortografia': 'correct_spelling',
    'corrigir gramática': 'correct_grammar',
    'arrumar texto': 'fix_text',
    'consertar erro': 'fix_error',
    
    // Suggestions
    'sugerir termo': 'suggest_term',
    'sugerir diagnóstico': 'suggest_diagnosis',
    'sugerir tratamento': 'suggest_treatment',
    'completar frase': 'complete_sentence',
    'dar sugestão': 'give_suggestion',
    'propor melhoria': 'propose_improvement',
    
    // Improvements
    'melhorar texto': 'improve_text',
    'tornar mais claro': 'make_clearer',
    'adicionar detalhes': 'add_details',
    'formalizar': 'formalize',
    'tornar mais formal': 'make_formal',
    'tornar mais técnico': 'make_technical',
    
    // Validation
    'validar termo': 'validate_term',
    'verificar CID': 'check_cid',
    'confirmar diagnóstico': 'confirm_diagnosis',
    'verificar medicação': 'check_medication',
    'validar laudo': 'validate_report',
    'checar termo médico': 'check_medical_term',
    
    // Navigation and control
    'próximo campo': 'next_field',
    'campo anterior': 'previous_field',
    'salvar laudo': 'save_report',
    'enviar laudo': 'submit_report',
    'imprimir laudo': 'print_report',
    'exportar laudo': 'export_report',
    
    // AI-specific commands
    'ativar ai': 'activate_ai',
    'desativar ai': 'deactivate_ai',
    'usar inteligência artificial': 'use_ai',
    'ajuda médica': 'medical_help',
    'assistente médico': 'medical_assistant'
  };

  public parseCommand(transcript: string): ParsedCommand {
    const normalized = this.normalizeText(transcript);
    
    for (const [command, action] of Object.entries(this.medicalCommands)) {
      if (normalized.includes(command)) {
        return {
          action,
          confidence: this.calculateConfidence(command, normalized),
          parameters: this.extractParameters(normalized, command)
        };
      }
    }

    return { action: 'unknown', confidence: 0, parameters: {} };
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  private calculateConfidence(command: string, transcript: string): number {
    const commandWords = command.split(' ');
    const transcriptWords = transcript.split(' ');
    const matches = commandWords.filter(word => transcriptWords.includes(word));
    
    // Bonus for exact phrase match
    const phraseBonus = transcript.includes(command) ? 0.2 : 0;
    
    return Math.min(1, (matches.length / commandWords.length) + phraseBonus);
  }

  private extractParameters(transcript: string, command: string): Record<string, string> {
    // Extract parameters after command
    const commandIndex = transcript.indexOf(command);
    const afterCommand = transcript.slice(commandIndex + command.length).trim();
    
    // Extract context (words after command)
    const contextWords = afterCommand.split(' ').slice(0, 10).join(' ');
    
    return {
      context: contextWords,
      fullText: transcript,
      command: command,
      timestamp: new Date().toISOString()
    };
  }

  public addCustomCommand(spokenPhrase: string, action: string) {
    this.medicalCommands[spokenPhrase.toLowerCase()] = action;
  }

  public removeCustomCommand(spokenPhrase: string) {
    delete this.medicalCommands[spokenPhrase.toLowerCase()];
  }

  public getAvailableCommands(): string[] {
    return Object.keys(this.medicalCommands);
  }

  public getCommandsByCategory(): Record<string, string[]> {
    const categories = {
      'corrections': ['corrigir laudo', 'corrigir texto', 'corrigir ortografia', 'corrigir gramática', 'arrumar texto', 'consertar erro'],
      'suggestions': ['sugerir termo', 'sugerir diagnóstico', 'sugerir tratamento', 'completar frase', 'dar sugestão', 'propor melhoria'],
      'improvements': ['melhorar texto', 'tornar mais claro', 'adicionar detalhes', 'formalizar', 'tornar mais formal', 'tornar mais técnico'],
      'validation': ['validar termo', 'verificar CID', 'confirmar diagnóstico', 'verificar medicação', 'validar laudo', 'checar termo médico'],
      'navigation': ['próximo campo', 'campo anterior', 'salvar laudo', 'enviar laudo', 'imprimir laudo', 'exportar laudo'],
      'ai-control': ['ativar ai', 'desativar ai', 'usar inteligência artificial', 'ajuda médica', 'assistente médico']
    };

    return categories;
  }
}
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
  interface SpeechRecognition extends EventTarget {
    start(): void
    stop(): void
    abort(): void
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives?: number
    onstart?: (e: any) => void
    onaudiostart?: (e: any) => void
    onsoundstart?: (e: any) => void
    onsoundend?: (e: any) => void
    onspeechstart?: (e: any) => void
    onspeechend?: (e: any) => void
    onresult?: (e: any) => void
    onerror?: (e: any) => void
    onend?: (e: any) => void
  }
  interface SpeechRecognitionAlternative { transcript: string; confidence?: number }
  interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> { isFinal: boolean }
}
