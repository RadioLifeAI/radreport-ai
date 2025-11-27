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

export type SpeechErrorCode = 
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'language-not-supported'
  | 'phrases-not-supported';

export type AvailabilityStatus = 
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'available';

export interface SpeechRecognitionPhrase {
  phrase: string;
  boost: number;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private keepAlive = false;
  private userStopped = false;
  private useStopInsteadOfAbort = false;
  private currentStream: MediaStream | null = null;
  private lastConfidence = 0;
  private onStatusCallbacks: Array<(status: 'idle'|'waiting'|'listening') => void> = [];
  private onEndCallbacks: Array<(reason: 'auto'|'user') => void> = [];
  private onResultDetailedCallbacks: Array<(result: { transcript: string; isFinal: boolean; alternatives?: string[]; confidence?: number }) => void> = [];
  private onErrorCallbacks: Array<(error: SpeechErrorCode, message?: string) => void> = [];
  private config = { 
    lang: 'pt-BR',
    maxAlternatives: 3,
    processLocally: false,
    phrases: [] as SpeechRecognitionPhrase[]
  };

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
    this.recognition.lang = this.config.lang;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    
    // Web Speech API 2025 features (com feature detection)
    if ('processLocally' in this.recognition) {
      (this.recognition as any).processLocally = this.config.processLocally;
    }
    
    if ('phrases' in this.recognition && this.config.phrases.length > 0) {
      const phrases = (this.recognition as any).phrases as any[];
      this.config.phrases.forEach(p => {
        try {
          phrases.push(new (window as any).SpeechRecognitionPhrase(p.phrase, p.boost));
        } catch (e) {
          console.warn('Failed to add phrase:', p.phrase, e);
        }
      });
    }
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('✅ Recognition started successfully')
      this.isListening = true;
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onaudiostart = () => {
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onsoundstart = () => {
      this.onStatusCallbacks.forEach(cb => cb('listening'));
    };

    this.recognition.onsoundend = () => {
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onspeechstart = () => {
      this.onStatusCallbacks.forEach(cb => cb('listening'));
    };

    this.recognition.onspeechend = () => {
      this.onStatusCallbacks.forEach(cb => cb('waiting'));
    };

    this.recognition.onresult = (event) => {
      const results = event.results;
      
      // Processar apenas novos resultados (começando do resultIndex)
      for (let i = event.resultIndex; i < results.length; ++i) {
        const res = results[i];
        const transcript = res[0].transcript;
        const confidence = res[0].confidence || 0;
        const isFinal = res.isFinal;
        
        this.lastConfidence = confidence;
        
        const alternatives = Array.from(res).map((alt: SpeechRecognitionAlternative) => alt.transcript);
        
        console.log('🎙️ SpeechService onresult:', { 
          transcript, 
          isFinal,
          confidence,
          resultIndex: i,
          callbackCount: this.onResultDetailedCallbacks.length 
        })

        // Enviar resultado com confidence score
        this.onResultDetailedCallbacks.forEach(cb => cb({
          transcript,
          isFinal,
          alternatives,
          confidence
        }));
      }
    };

    this.recognition.onerror = (event) => {
      const errorCode = event.error as SpeechErrorCode;
      const errorMessage = this.getErrorMessage(errorCode);
      
      console.error('Speech recognition error:', errorCode, errorMessage);
      this.onErrorCallbacks.forEach(cb => cb(errorCode, errorMessage));
      
      // Erros críticos que param o reconhecimento
      const criticalErrors: SpeechErrorCode[] = ['not-allowed', 'audio-capture', 'service-not-allowed'];
      if (criticalErrors.includes(errorCode)) {
        this.keepAlive = false;
        this.userStopped = true;
        this.isListening = false;
        this.onStatusCallbacks.forEach(cb => cb('idle'));
      }
      
      // Retry logic para erros recuperáveis
      if (errorCode === 'network' || errorCode === 'no-speech') {
        console.log('🔄 Recoverable error, will retry...');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      const reason: 'auto'|'user' = (this.keepAlive && !this.userStopped) ? 'auto' : 'user'
      this.onEndCallbacks.forEach(cb => cb(reason));
      
      if (this.keepAlive && !this.userStopped) {
        setTimeout(() => this.startListening(), 300);
        this.onStatusCallbacks.forEach(cb => cb('waiting'));
      } else {
        this.onStatusCallbacks.forEach(cb => cb('idle'));
      }
    };
  }



  public async startListeningWithAudio(): Promise<{ started: boolean; stream?: MediaStream }> {
    try {
      // Capturar MediaStream para análise de áudio
      this.currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Iniciar recognition normalmente
      const started = this.startListening();
      
      return { started, stream: this.currentStream };
    } catch (error) {
      console.error('Failed to get audio stream:', error);
      return { started: false };
    }
  }

  public startListening(): boolean {
    console.log('🎤 SpeechService.startListening() called, isListening:', this.isListening)
    // Já está ouvindo: não trate como erro
    if (this.isListening) {
      console.log('⚠️ Already listening, returning true')
      return true
    }
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
      const docLang = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) ? document.documentElement.lang : undefined;
      const langToUse = this.config.lang || docLang || 'pt-BR';
      this.recognition!.lang = langToUse;
      console.log('🚀 Starting recognition with lang:', langToUse)
      this.recognition!.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  /**
   * Para o reconhecimento e retorna o último resultado (Web Speech API best practice)
   * Use quando o usuário clica em "Parar" e quer o resultado
   */
  public stopListening(): boolean {
    if (!this.recognition || !this.isListening) {
      return false;
    }

    try {
      this.keepAlive = false;
      this.userStopped = true;
      this.useStopInsteadOfAbort = true;
      
      // Usar stop() para retornar último resultado
      this.recognition.stop();
      
      // Parar MediaStream
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => track.stop());
        this.currentStream = null;
      }
      
      this.isListening = false;
      this.onStatusCallbacks.forEach(cb => cb('idle'));
      return true;
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      return false;
    }
  }

  /**
   * Aborta o reconhecimento imediatamente sem retornar resultado
   * Use apenas para cancelamentos forçados ou erros críticos
   */
  public abortListening(): boolean {
    if (!this.recognition || !this.isListening) {
      return false;
    }

    try {
      this.keepAlive = false;
      this.userStopped = true;
      this.useStopInsteadOfAbort = false;
      
      // Usar abort() para cancelamento forçado
      if (typeof this.recognition.abort === 'function') {
        this.recognition.abort();
      } else {
        this.recognition.stop();
      }
      
      // Parar MediaStream
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => track.stop());
        this.currentStream = null;
      }
      
      this.isListening = false;
      this.onStatusCallbacks.forEach(cb => cb('idle'));
      return true;
    } catch (error) {
      console.error('Failed to abort speech recognition:', error);
      return false;
    }
  }

  public isActive(): boolean {
    return this.isListening;
  }


  public setOnStatus(callback: (status: 'idle'|'waiting'|'listening') => void) {
    this.onStatusCallbacks.push(callback);
  }

  public removeOnStatus(callback: (status: 'idle'|'waiting'|'listening') => void) {
    this.onStatusCallbacks = this.onStatusCallbacks.filter(cb => cb !== callback);
  }

  public setOnEnd(callback: (reason: 'auto'|'user') => void) {
    this.onEndCallbacks.push(callback);
  }

  public removeOnEnd(callback: (reason: 'auto'|'user') => void) {
    this.onEndCallbacks = this.onEndCallbacks.filter(cb => cb !== callback);
  }

  public setOnResult(callback: (result: { transcript: string; isFinal: boolean; alternatives?: string[]; confidence?: number }) => void) {
    this.onResultDetailedCallbacks.push(callback);
  }

  public removeOnResult(callback: (result: { transcript: string; isFinal: boolean; alternatives?: string[]; confidence?: number }) => void) {
    this.onResultDetailedCallbacks = this.onResultDetailedCallbacks.filter(cb => cb !== callback);
  }

  public setOnError(callback: (error: SpeechErrorCode, message?: string) => void) {
    this.onErrorCallbacks.push(callback);
  }

  public removeOnError(callback: (error: SpeechErrorCode, message?: string) => void) {
    this.onErrorCallbacks = this.onErrorCallbacks.filter(cb => cb !== callback);
  }

  public clearAllCallbacks() {
    this.onStatusCallbacks = [];
    this.onEndCallbacks = [];
    this.onResultDetailedCallbacks = [];
    this.onErrorCallbacks = [];
  }

  public destroy() {
    this.stopListening();
    this.clearAllCallbacks();
    this.recognition = null;
  }
  
  public getCurrentStream(): MediaStream | null {
    return this.currentStream;
  }

  // Missing methods that components are expecting
  public isSpeechRecognitionSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public updateConfig(config: { 
    lang?: string; 
    maxAlternatives?: number;
    processLocally?: boolean;
    phrases?: SpeechRecognitionPhrase[];
  }) {
    this.config = { ...this.config, ...config };
    if (this.recognition && config.lang) {
      this.recognition.lang = config.lang;
    }
    if (this.recognition && typeof config.maxAlternatives === 'number') {
      try {
        this.recognition.maxAlternatives = config.maxAlternatives;
      } catch {}
    }
    if (this.recognition && typeof config.processLocally === 'boolean') {
      try {
        if ('processLocally' in this.recognition) {
          (this.recognition as any).processLocally = config.processLocally;
        }
      } catch {}
    }
  }

  /**
   * Obtém o último confidence score registrado
   */
  public getLastConfidence(): number {
    return this.lastConfidence;
  }

  /**
   * Verifica disponibilidade de reconhecimento (Web Speech API 2025)
   */
  public async checkAvailability(langs: string[], processLocally = false): Promise<AvailabilityStatus> {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return 'unavailable';
    }

    // Feature detection para available()
    if ('available' in SpeechRecognition) {
      try {
        const status = await (SpeechRecognition as any).available({ 
          langs, 
          processLocally 
        });
        return status as AvailabilityStatus;
      } catch (e) {
        console.warn('available() call failed:', e);
      }
    }

    // Fallback: se não tem available(), assumir disponível
    return 'available';
  }

  /**
   * Instala pacotes de idioma local (Web Speech API 2025)
   */
  public async installLanguagePacks(langs: string[]): Promise<boolean> {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return false;
    }

    // Feature detection para install()
    if ('install' in SpeechRecognition) {
      try {
        const result = await (SpeechRecognition as any).install({ 
          langs,
          processLocally: true
        });
        return result as boolean;
      } catch (e) {
        console.warn('install() call failed:', e);
        return false;
      }
    }

    // Fallback: se não tem install(), retornar true (assumir instalado)
    return true;
  }

  /**
   * Adiciona frases para contextual biasing (Web Speech API 2025)
   */
  public addPhrases(phrases: SpeechRecognitionPhrase[]) {
    this.config.phrases = [...this.config.phrases, ...phrases];
    
    if (this.recognition && 'phrases' in this.recognition) {
      const recognitionPhrases = (this.recognition as any).phrases as any[];
      phrases.forEach(p => {
        try {
          recognitionPhrases.push(new (window as any).SpeechRecognitionPhrase(p.phrase, p.boost));
        } catch (e) {
          console.warn('Failed to add phrase:', p.phrase, e);
        }
      });
    }
  }

  /**
   * Mensagens de erro localizadas
   */
  private getErrorMessage(code: SpeechErrorCode): string {
    const messages: Record<SpeechErrorCode, string> = {
      'no-speech': 'Nenhuma fala detectada. Tente falar mais alto ou verificar o microfone.',
      'aborted': 'Reconhecimento de voz cancelado.',
      'audio-capture': 'Falha ao capturar áudio. Verifique as permissões do microfone.',
      'network': 'Erro de rede. Verifique sua conexão com a internet.',
      'not-allowed': 'Permissão de microfone negada. Habilite o acesso ao microfone nas configurações.',
      'service-not-allowed': 'Serviço de reconhecimento não permitido. Verifique as configurações de privacidade.',
      'language-not-supported': 'Idioma não suportado pelo serviço de reconhecimento.',
      'phrases-not-supported': 'Suporte a frases contextuais não disponível neste navegador.'
    };
    
    return messages[code] || 'Erro desconhecido no reconhecimento de voz.';
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
  interface SpeechRecognitionAlternative { 
    readonly transcript: string
    readonly confidence: number 
  }
  interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> { 
    readonly isFinal: boolean 
  }
}
