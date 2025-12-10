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
  audioLevel: number;
  currentMode: 'webspeech' | 'whisper' | 'corrector';
  sessionValid: boolean;
  userEmail: string | null;
  sameNetwork: boolean;
  remainingSeconds: number;
  validateSession: (token: string, authToken?: string) => Promise<boolean>;
  startCapture: (token: string) => Promise<void>;
  stopCapture: () => void;
  changeMode: (mode: 'webspeech' | 'whisper' | 'corrector') => void;
}

export function useMobileAudioCapture(): UseMobileAudioCaptureReturn {
  const { toast } = useToast();
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentMode, setCurrentMode] = useState<'webspeech' | 'whisper' | 'corrector'>('webspeech');
  const [sessionValid, setSessionValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sameNetwork, setSameNetwork] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sessionTokenRef = useRef<string>('');
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    setAudioLevel(0);
    setConnectionState('disconnected');
  }, []);

  // Validate session token with secure auth
  const validateSession = useCallback(async (token: string, authToken?: string): Promise<boolean> => {
    try {
      console.log('[MobileCapture] Validating session with auth:', !!authToken);
      
      // Call secure validation RPC
      const { data, error } = await supabase.rpc('validate_mobile_session_secure', {
        p_session_token: token,
        p_temp_jwt: authToken || null,
        p_mobile_ip: null, // IP is captured server-side
      });

      if (error) throw error;

      const sessionInfo = data as unknown as SessionValidationResult;
      
      if (sessionInfo.valid) {
        setSessionValid(true);
        setCurrentMode(sessionInfo.mode || 'webspeech');
        setUserEmail(sessionInfo.user_email || null);
        setSameNetwork(sessionInfo.same_network || false);
        sessionTokenRef.current = token;
        
        // Calculate remaining time
        if (sessionInfo.expires_at) {
          const expiresAt = new Date(sessionInfo.expires_at);
          const remaining = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
          setRemainingSeconds(remaining);
        }
        
        console.log('[MobileCapture] Session validated:', {
          email: sessionInfo.user_email,
          sameNetwork: sessionInfo.same_network,
        });
        
        return true;
      } else {
        // Handle specific error cases
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
  }, [toast]);

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    if (channelRef.current && sessionTokenRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'signaling',
        payload: { type: 'heartbeat', timestamp: Date.now() } as SignalingMessage,
      });
      
      // Also update heartbeat in database
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

  // Start audio capture
  const startCapture = useCallback(async (token: string) => {
    try {
      setConnectionState('connecting');

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);
      streamRef.current = stream;

      // Setup audio level analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      analyzeAudio();

      // Setup WebRTC peer connection (as offerer - mobile sends)
      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      // Add audio track
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
          
          // Start heartbeat
          heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
          
          toast({
            title: 'Conectado!',
            description: 'Áudio sendo enviado para o desktop.',
          });
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setConnectionState('error');
          toast({
            title: 'Conexão perdida',
            description: 'A conexão com o desktop foi perdida.',
            variant: 'destructive',
          });
        }
      };

      // Setup Supabase Realtime channel for signaling
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
              toast({
                title: 'Sessão encerrada',
                description: 'O desktop encerrou a sessão.',
              });
            }
          } catch (err) {
            console.error('[MobileCapture] Signaling error:', err);
          }
        })
        .subscribe(async (status) => {
          console.log('[MobileCapture] Channel status:', status);
          if (status === 'SUBSCRIBED') {
            // Create and send offer
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

      // Update session status
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

  // Change transcription mode
  const changeMode = useCallback((mode: 'webspeech' | 'whisper' | 'corrector') => {
    setCurrentMode(mode);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'signaling',
        payload: { type: 'mode-change', mode } as SignalingMessage,
      });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    connectionState,
    isCapturing,
    audioLevel,
    currentMode,
    sessionValid,
    userEmail,
    sameNetwork,
    remainingSeconds,
    validateSession,
    startCapture,
    stopCapture,
    changeMode,
  };
}
