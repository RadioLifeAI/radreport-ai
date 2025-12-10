import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RTC_CONFIG, 
  AUDIO_CONSTRAINTS,
  HEARTBEAT_INTERVAL,
  type ConnectionState,
  type SignalingMessage,
  type SessionValidationResult 
} from '@/utils/webrtcConfig';
import { useToast } from '@/hooks/use-toast';

interface UseMobileAudioCaptureReturn {
  connectionState: ConnectionState;
  isCapturing: boolean;
  isPaused: boolean;
  audioLevel: number;
  currentMode: 'webspeech' | 'whisper' | 'corrector';
  sessionValid: boolean;
  userEmail: string | null;
  sameNetwork: boolean;
  remainingSeconds: number;
  aiCredits: number;
  whisperCredits: number;
  isWhisperEnabled: boolean;
  isCorrectorEnabled: boolean;
  validateSession: (token: string, authToken?: string) => Promise<boolean>;
  startCapture: (token: string) => Promise<void>;
  stopCapture: () => void;
  pauseCapture: () => void;
  resumeCapture: () => void;
  renewSession: () => Promise<boolean>;
  toggleWhisper: () => void;
  toggleCorrector: () => void;
}

export function useMobileAudioCapture(): UseMobileAudioCaptureReturn {
  const { toast } = useToast();
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentMode, setCurrentMode] = useState<'webspeech' | 'whisper' | 'corrector'>('webspeech');
  const [sessionValid, setSessionValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sameNetwork, setSameNetwork] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [aiCredits, setAiCredits] = useState(0);
  const [whisperCredits, setWhisperCredits] = useState(0);
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(false);
  const [isCorrectorEnabled, setIsCorrectorEnabled] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sessionTokenRef = useRef<string>('');
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>('');

  // Cleanup function
  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsCapturing(false);
    setIsPaused(false);
    setAudioLevel(0);
    setConnectionState('disconnected');
  }, []);

  // Fetch credits after session validation
  const fetchCredits = useCallback(async () => {
    try {
      // Fetch AI credits
      const { data: aiData } = await supabase.rpc('check_ai_credits', {
        p_user_id: sessionIdRef.current
      });
      if (aiData?.[0]?.balance !== undefined) {
        setAiCredits(aiData[0].balance);
      }

      // Fetch Whisper credits
      const { data: whisperData } = await supabase
        .from('user_whisper_balance')
        .select('balance')
        .single();
      if (whisperData?.balance !== undefined) {
        setWhisperCredits(whisperData.balance);
      }
    } catch (error) {
      console.warn('[MobileCapture] Error fetching credits:', error);
    }
  }, []);

  // Validate session token with secure auth
  const validateSession = useCallback(async (token: string, authToken?: string): Promise<boolean> => {
    try {
      console.log('[MobileCapture] Validating session with auth:', !!authToken);
      
      // Call secure validation RPC
      const { data, error } = await supabase.rpc('validate_mobile_session_secure', {
        p_session_token: token,
        p_temp_jwt: authToken || null,
        p_mobile_ip: null,
      });

      if (error) throw error;

      const sessionInfo = data as unknown as SessionValidationResult;
      
      if (sessionInfo.valid) {
        setSessionValid(true);
        setCurrentMode(sessionInfo.mode || 'webspeech');
        setUserEmail(sessionInfo.user_email || null);
        setSameNetwork(sessionInfo.same_network || false);
        sessionTokenRef.current = token;
        sessionIdRef.current = sessionInfo.user_id || '';
        
        // Calculate remaining time
        if (sessionInfo.expires_at) {
          const expiresAt = new Date(sessionInfo.expires_at);
          const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
          setRemainingSeconds(remaining);
        }
        
        // Fetch credits after successful validation
        await fetchCredits();
        
        console.log('[MobileCapture] Session validated:', {
          email: sessionInfo.user_email,
          sameNetwork: sessionInfo.same_network,
        });
        
        return true;
      } else {
        if (sessionInfo.reason === 'rate_limited') {
          toast({
            title: 'Muitas tentativas',
            description: sessionInfo.message || 'Aguarde alguns minutos antes de tentar novamente.',
            variant: 'destructive',
          });
        } else if (sessionInfo.reason === 'pairing_expired') {
          toast({
            title: 'Tempo expirado',
            description: 'O QR Code expirou. Gere um novo no desktop.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sessão inválida',
            description: sessionInfo.message || 'Token de sessão inválido ou expirado.',
            variant: 'destructive',
          });
        }
        return false;
      }
    } catch (error) {
      console.error('[MobileCapture] Validation error:', error);
      toast({
        title: 'Erro de validação',
        description: 'Não foi possível validar a sessão.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, fetchCredits]);

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    if (channelRef.current && sessionTokenRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'signaling',
        payload: { type: 'heartbeat', timestamp: Date.now() } as SignalingMessage,
      });
      
      supabase.rpc('update_mobile_heartbeat', {
        p_session_token: sessionTokenRef.current,
      }).then(({ data }) => {
        const result = data as { success?: boolean; remaining_seconds?: number } | null;
        if (result?.remaining_seconds) {
          setRemainingSeconds(result.remaining_seconds);
        }
      });
    }
  }, []);

  // Analyze audio level
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalized = Math.min(100, (average / 128) * 100);
    setAudioLevel(normalized);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  // Pause capture
  const pauseCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.enabled = false;
      });
      setIsPaused(true);
      setAudioLevel(0);
      
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'signaling',
          payload: { type: 'pause' } as SignalingMessage,
        });
      }
      
      toast({ title: 'Pausado', description: 'Captura de áudio pausada' });
    }
  }, [toast]);

  // Resume capture
  const resumeCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.enabled = true;
      });
      setIsPaused(false);
      
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'signaling',
          payload: { type: 'resume' } as SignalingMessage,
        });
      }
      
      toast({ title: 'Retomado', description: 'Captura de áudio retomada' });
    }
  }, [toast]);

  // Renew session
  const renewSession = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('mobile_audio_sessions')
        .update({ 
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() 
        })
        .eq('session_token', sessionTokenRef.current)
        .select('expires_at')
        .single();

      if (error) throw error;

      if (data?.expires_at) {
        const expiresAt = new Date(data.expires_at);
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
        setRemainingSeconds(remaining);
        
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'signaling',
            payload: { type: 'renew', newExpiresAt: data.expires_at } as SignalingMessage,
          });
        }
        
        toast({ title: 'Sessão renovada', description: '+60 minutos adicionados' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('[MobileCapture] Renew error:', error);
      toast({
        title: 'Erro ao renovar',
        description: 'Não foi possível renovar a sessão.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Toggle Whisper
  const toggleWhisper = useCallback(() => {
    const newValue = !isWhisperEnabled;
    setIsWhisperEnabled(newValue);
    
    if (newValue && whisperCredits < 1) {
      toast({
        title: 'Créditos insuficientes',
        description: 'Você não tem créditos Whisper suficientes.',
        variant: 'destructive',
      });
      setIsWhisperEnabled(false);
      return;
    }
    
    // Update mode based on toggles
    const newMode = newValue ? 'whisper' : (isCorrectorEnabled ? 'corrector' : 'webspeech');
    setCurrentMode(newMode);
    
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'signaling',
        payload: { type: 'mode-change', mode: newMode } as SignalingMessage,
      });
    }
  }, [isWhisperEnabled, isCorrectorEnabled, whisperCredits, toast]);

  // Toggle Corretor AI
  const toggleCorrector = useCallback(() => {
    const newValue = !isCorrectorEnabled;
    setIsCorrectorEnabled(newValue);
    
    if (newValue && aiCredits < 1) {
      toast({
        title: 'Créditos insuficientes',
        description: 'Você não tem créditos AI suficientes.',
        variant: 'destructive',
      });
      setIsCorrectorEnabled(false);
      return;
    }
    
    // Whisper takes priority over corrector
    const newMode = isWhisperEnabled ? 'whisper' : (newValue ? 'corrector' : 'webspeech');
    setCurrentMode(newMode);
    
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'signaling',
        payload: { type: 'mode-change', mode: newMode } as SignalingMessage,
      });
    }
  }, [isCorrectorEnabled, isWhisperEnabled, aiCredits, toast]);

  // Start audio capture
  const startCapture = useCallback(async (token: string) => {
    try {
      setConnectionState('connecting');

      const stream = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);
      streamRef.current = stream;

      // Setup audio level analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      analyzeAudio();

      // Setup WebRTC peer connection
      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'signaling',
            payload: { 
              type: 'ice-candidate', 
              candidate: event.candidate.toJSON() 
            } as SignalingMessage,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('[MobileCapture] Connection state:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          setConnectionState('connected');
          setIsCapturing(true);
          heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
          toast({ title: 'Conectado!', description: 'Áudio sendo enviado para o desktop.' });
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setConnectionState('error');
          toast({
            title: 'Conexão perdida',
            description: 'A conexão com o desktop foi perdida.',
            variant: 'destructive',
          });
        }
      };

      const channel = supabase.channel(`mobile-audio-${token}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on('broadcast', { event: 'signaling' }, async ({ payload }) => {
          const message = payload as SignalingMessage;
          console.log('[MobileCapture] Received signaling:', message.type);

          try {
            if (message.type === 'answer') {
              await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: message.sdp }));
            } else if (message.type === 'ice-candidate' && message.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
            } else if (message.type === 'disconnect') {
              cleanup();
              toast({ title: 'Sessão encerrada', description: 'O desktop encerrou a sessão.' });
            }
          } catch (err) {
            console.error('[MobileCapture] Signaling error:', err);
          }
        })
        .subscribe(async (status) => {
          console.log('[MobileCapture] Channel status:', status);
          if (status === 'SUBSCRIBED') {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            channel.send({
              type: 'broadcast',
              event: 'signaling',
              payload: { type: 'offer', sdp: offer.sdp } as SignalingMessage,
            });
          }
        });

      channelRef.current = channel;

      await supabase.rpc('update_mobile_session_status', {
        p_session_token: token,
        p_status: 'connecting',
        p_device_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      });

    } catch (error) {
      console.error('[MobileCapture] Error starting capture:', error);
      setConnectionState('error');
      toast({
        title: 'Erro ao iniciar captura',
        description: 'Não foi possível acessar o microfone. Verifique as permissões.',
        variant: 'destructive',
      });
    }
  }, [toast, cleanup, analyzeAudio, sendHeartbeat]);

  // Stop capture
  const stopCapture = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'signaling',
        payload: { type: 'disconnect' } as SignalingMessage,
      });
    }
    cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    connectionState,
    isCapturing,
    isPaused,
    audioLevel,
    currentMode,
    sessionValid,
    userEmail,
    sameNetwork,
    remainingSeconds,
    aiCredits,
    whisperCredits,
    isWhisperEnabled,
    isCorrectorEnabled,
    validateSession,
    startCapture,
    stopCapture,
    pauseCapture,
    resumeCapture,
    renewSession,
    toggleWhisper,
    toggleCorrector,
  };
}
