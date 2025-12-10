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
  | { type: 'heartbeat'; timestamp: number }
  | { type: 'disconnect' };

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MobileSession {
  id: string;
  sessionToken: string;
  status: string;
  mode: 'webspeech' | 'whisper' | 'corrector';
  expiresAt: Date;
  tempJwt?: string;
  userEmail?: string;
  sameNetwork?: boolean;
}

export interface SessionValidationResult {
  valid: boolean;
  session_id?: string;
  user_id?: string;
  user_email?: string;
  mode?: 'webspeech' | 'whisper' | 'corrector';
  status?: string;
  expires_at?: string;
  same_network?: boolean;
  reason?: string;
  message?: string;
  blocked_until?: string;
}

// Generate unique session token
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Calculate remaining time
export function getRemainingTime(expiresAt: Date): { minutes: number; seconds: number; totalSeconds: number } {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) return { minutes: 0, seconds: 0, totalSeconds: 0 };
  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    totalSeconds: Math.floor(diff / 1000),
  };
}

// Format remaining time
export function formatRemainingTime(expiresAt: Date): string {
  const { minutes, seconds } = getRemainingTime(expiresAt);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Get progress percentage (0-100)
export function getExpirationProgress(expiresAt: Date, totalMinutes: number = 60): number {
  const { totalSeconds } = getRemainingTime(expiresAt);
  const totalSecondsMax = totalMinutes * 60;
  return Math.min(100, Math.max(0, (totalSeconds / totalSecondsMax) * 100));
}

// HEARTBEAT_INTERVAL in ms
export const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// Session expiration warning threshold in seconds
export const EXPIRATION_WARNING_THRESHOLD = 300; // 5 minutes
