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
  private currentStream: MediaStream | null = null;
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
    // 🆕 FASE 6: Aumentar maxAlternatives para 3 alternativas de correção
    this.recognition.maxAlternatives = (this.config as any).maxAlternatives ?? 3;
    
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
        const isFinal = res.isFinal;
        
        const alternatives = Array.from(res).map((alt: SpeechRecognitionAlternative) => alt.transcript);
        
        console.log('🎙️ SpeechService onresult:', { 
          transcript, 
          isFinal,
          resultIndex: i,
          callbackCount: this.onResultDetailedCallbacks.length 
        })

        // Enviar apenas o texto deste resultado, não acumulado
        this.onResultDetailedCallbacks.forEach(cb => cb({
          transcript,
          isFinal,
          alternatives
        }));
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.onErrorCallbacks.forEach(cb => cb(event.error));
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        this.keepAlive = false;
        this.userStopped = true;
        this.isListening = false;
        this.onStatusCallbacks.forEach(cb => cb('idle'));
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

  public setOnResult(callback: (result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => void) {
    this.onResultDetailedCallbacks.push(callback);
  }

  public removeOnResult(callback: (result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => void) {
    this.onResultDetailedCallbacks = this.onResultDetailedCallbacks.filter(cb => cb !== callback);
  }

  public setOnError(callback: (error: string) => void) {
    this.onErrorCallbacks.push(callback);
  }

  public removeOnError(callback: (error: string) => void) {
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

  public updateConfig(config: { lang?: string; [key: string]: any }) {
    this.config = { ...this.config, ...config };
    if (this.recognition && config.lang) {
      this.recognition.lang = config.lang;
    }
    if (this.recognition && typeof (config as any).maxAlternatives === 'number') {
      try {
        this.recognition.maxAlternatives = (config as any).maxAlternatives;
      } catch {}
    }
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
