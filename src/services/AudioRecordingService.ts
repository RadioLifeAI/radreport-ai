export interface RecordingOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  maxDuration?: number; // Maximum recording duration in seconds
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  blobSize: number;
  mimeType: string;
}

export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime = 0;
  private recordingTimer: NodeJS.Timeout | null = null;
  private durationTimer: NodeJS.Timeout | null = null;
  private currentDuration = 0;
  
  private options: RecordingOptions;
  private stream: MediaStream | null = null;

  constructor(options: RecordingOptions = {}) {
    this.options = {
      mimeType: this.getSupportedMimeType(),
      audioBitsPerSecond: 128000, // 128 kbps
      maxDuration: 60, // 60 seconds max
      ...options
    };
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav',
      'audio/ogg;codecs=opus'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback to empty string (browser will choose)
    return '';
  }

  async startRecording(): Promise<void> {
    if (this.isRecording()) {
      throw new Error('Recording already in progress');
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });

      // Create MediaRecorder with specified options
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType,
        audioBitsPerSecond: this.options.audioBitsPerSecond
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();
      this.currentDuration = 0;

      // Set up event handlers
      this.setupEventHandlers();

      // Start recording with data collection every second
      this.mediaRecorder.start(1000);

      // Set up duration tracking
      this.startDurationTracking();

      // Set up maximum duration timeout
      if (this.options.maxDuration) {
        this.recordingTimer = setTimeout(() => {
          this.stopRecording();
        }, this.options.maxDuration * 1000);
      }

      if (this.options.onStart) {
        this.options.onStart();
      }

    } catch (error) {
      this.cleanup();
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording()) {
        reject(new Error('No active recording to stop'));
        return;
      }

      // Set up onstop handler
      this.mediaRecorder.onstop = () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { 
            type: this.mediaRecorder!.mimeType 
          });
          
          this.cleanup();
          
          if (this.options.onStop) {
            this.options.onStop(audioBlob);
          }
          
          resolve(audioBlob);
        } catch (error) {
          reject(new Error(`Failed to create audio blob: ${error}`));
        }
      };

      // Stop the recording
      this.mediaRecorder.stop();
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.isRecording() && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }

  isPaused(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'paused';
  }

  getRecordingState(): RecordingState {
    return {
      isRecording: this.isRecording(),
      duration: this.currentDuration,
      blobSize: this.audioChunks.reduce((total, chunk) => total + chunk.size, 0),
      mimeType: this.mediaRecorder?.mimeType || this.options.mimeType || 'unknown'
    };
  }

  getCurrentDuration(): number {
    return this.currentDuration;
  }

  private setupEventHandlers(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
        
        if (this.options.onDataAvailable) {
          this.options.onDataAvailable(event.data);
        }
      }
    };

    this.mediaRecorder.onerror = (event) => {
      const errorMessage = `MediaRecorder error: ${event.error}`;
      console.error(errorMessage);
      
      if (this.options.onError) {
        this.options.onError(errorMessage);
      }
      
      this.cleanup();
    };
  }

  private startDurationTracking(): void {
    this.durationTimer = setInterval(() => {
      this.currentDuration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
    }, 1000);
  }

  private cleanup(): void {
    // Stop timers
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }
    
    if (this.durationTimer) {
      clearInterval(this.durationTimer);
      this.durationTimer = null;
    }

    // Stop media recorder
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder = null;
    }

    // Stop media stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }

    // Reset state
    this.audioChunks = [];
    this.currentDuration = 0;
  }

  public destroy(): void {
    this.cleanup();
  }

  // Static utility methods
  static async checkMicrophonePermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state === 'granted';
    } catch (error) {
      // Fallback: try to get user media
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch {
        return false;
      }
    }
  }

  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  static getSupportedMimeTypes(): string[] {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav',
      'audio/ogg;codecs=opus'
    ];

    return types.filter(type => MediaRecorder.isTypeSupported(type));
  }

  static isRecordingSupported(): boolean {
    return typeof MediaRecorder !== 'undefined' && 
           typeof navigator !== 'undefined' && 
           typeof navigator.mediaDevices !== 'undefined' &&
           typeof navigator.mediaDevices.getUserMedia !== 'undefined';
  }

  static getBrowserInfo(): { supported: boolean; mimeTypes: string[] } {
    return {
      supported: this.isRecordingSupported(),
      mimeTypes: this.getSupportedMimeTypes()
    };
  }
}

// Voice command recording service for speech AI
export class VoiceCommandRecordingService extends AudioRecordingService {
  private commandTimeout: NodeJS.Timeout | null = null;
  private onCommandComplete: ((audioBlob: Blob, duration: number) => void) | null = null;
  private silenceThreshold = 1000; // 1 second of silence to stop
  private lastSoundTime = 0;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  constructor(options: RecordingOptions = {}) {
    super({
      maxDuration: 10, // 10 seconds max for voice commands
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 64000, // Lower bitrate for voice commands
      ...options
    });
  }

  async startCommandRecording(onComplete: (audioBlob: Blob, duration: number) => void): Promise<void> {
    this.onCommandComplete = onComplete;
    
    // Set up audio analysis for silence detection
    await this.setupAudioAnalysis();
    
    // Start recording with silence detection
    await this.startRecording();
    
    // Set up initial silence timeout
    this.resetSilenceTimeout();
  }

  private async setupAudioAnalysis(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      source.connect(this.analyser);
      
      // Start monitoring for silence
      this.monitorAudioLevel();
      
    } catch (error) {
      console.warn('Could not set up audio analysis for silence detection:', error);
      // Continue without silence detection
    }
  }

  private monitorAudioLevel(): void {
    if (!this.analyser || !this.dataArray) return;

    const checkAudioLevel = () => {
      if (!this.isRecording()) return;

      this.analyser!.getByteFrequencyData(this.dataArray!);
      
      // Calculate average volume
      const average = this.dataArray!.reduce((sum, value) => sum + value, 0) / this.dataArray!.length;
      
      // If there's sound, reset the silence timeout
      if (average > 10) { // Threshold for detecting sound
        this.lastSoundTime = Date.now();
        this.resetSilenceTimeout();
      }
      
      // Continue monitoring
      requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();
  }

  private resetSilenceTimeout(): void {
    if (this.commandTimeout) {
      clearTimeout(this.commandTimeout);
    }
    
    this.commandTimeout = setTimeout(() => {
      this.stopCommandRecording();
    }, this.silenceThreshold);
  }

  private async stopCommandRecording(): Promise<void> {
    if (!this.isRecording()) return;

    try {
      const audioBlob = await this.stopRecording();
      const duration = this.getCurrentDuration();
      
      if (this.onCommandComplete && duration > 0.5) { // Minimum 0.5 seconds
        this.onCommandComplete(audioBlob, duration);
      }
      
    } catch (error) {
      console.error('Error stopping command recording:', error);
    } finally {
      this.cleanupCommandRecording();
    }
  }

  private cleanupCommandRecording(): void {
    if (this.commandTimeout) {
      clearTimeout(this.commandTimeout);
      this.commandTimeout = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.dataArray = null;
    this.onCommandComplete = null;
  }

  public destroy(): void {
    this.cleanupCommandRecording();
    super.destroy();
  }
}