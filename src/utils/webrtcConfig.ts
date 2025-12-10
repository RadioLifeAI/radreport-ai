// WebRTC configuration for mobile audio streaming

export const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export const RTC_CONFIG: RTCConfiguration = {
  iceServers: STUN_SERVERS,
  iceCandidatePoolSize: 10,
};

export const AUDIO_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 1,
  },
  video: false,
};

export type SignalingMessage = 
  | { type: 'offer'; sdp: string }
  | { type: 'answer'; sdp: string }
  | { type: 'ice-candidate'; candidate: RTCIceCandidateInit }
  | { type: 'mode-change'; mode: 'webspeech' | 'whisper' | 'corrector' }
  | { type: 'status'; status: string }
  | { type: 'disconnect' };

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MobileSession {
  id: string;
  sessionToken: string;
  status: string;
  mode: 'webspeech' | 'whisper' | 'corrector';
  expiresAt: Date;
}

// Generate unique session token
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Calculate remaining time
export function getRemainingTime(expiresAt: Date): { minutes: number; seconds: number } {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) return { minutes: 0, seconds: 0 };
  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// Format remaining time
export function formatRemainingTime(expiresAt: Date): string {
  const { minutes, seconds } = getRemainingTime(expiresAt);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
