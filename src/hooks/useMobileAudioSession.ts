import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RTC_CONFIG, 
  generateSessionToken,
  type ConnectionState,
  type SignalingMessage,
  type MobileSession 
} from '@/utils/webrtcConfig';
import { useToast } from '@/hooks/use-toast';
import { getAppUrl } from '@/utils/appConfig';

interface TranscriptData {
  text: string;
  isFinal: boolean;
  confidence?: number;
}

interface UseMobileAudioSessionReturn {
  session: MobileSession | null;
  connectionState: ConnectionState;
  remoteStream: MediaStream | null;
  currentMode: 'webspeech' | 'whisper' | 'corrector';
  createSession: () => Promise<MobileSession | null>;
  endSession: () => Promise<void>;
  getConnectionUrl: () => string;
  isGeneratingToken: boolean;
  onRemoteTranscript: (callback: (data: TranscriptData) => void) => void;
  onRemoteStop: (callback: () => void) => void;
  onRemoteDisconnect: (callback: () => void) => void;
  onRemoteStart: (callback: (mode: string) => void) => void;
}

export function useMobileAudioSession(): UseMobileAudioSessionReturn {
  const { toast } = useToast();
  const [session, setSession] = useState<MobileSession | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [currentMode, setCurrentMode] = useState<'webspeech' | 'whisper' | 'corrector'>('webspeech');
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const transcriptCallbackRef = useRef<((data: TranscriptData) => void) | null>(null);
  const stopCallbackRef = useRef<(() => void) | null>(null);
  const disconnectCallbackRef = useRef<(() => void) | null>(null);
  const startCallbackRef = useRef<((mode: string) => void) | null>(null);

  // Register callback for remote transcripts
  const onRemoteTranscript = useCallback((callback: (data: TranscriptData) => void) => {
    transcriptCallbackRef.current = callback;
  }, []);

  // Register callback for remote stop (triggers Corretor AI, session continues)
  const onRemoteStop = useCallback((callback: () => void) => {
    stopCallbackRef.current = callback;
  }, []);

  // Register callback for remote disconnect (ends session)
  const onRemoteDisconnect = useCallback((callback: () => void) => {
    disconnectCallbackRef.current = callback;
  }, []);

  // Register callback for remote start (activates remote dictation)
  const onRemoteStart = useCallback((callback: (mode: string) => void) => {
    startCallbackRef.current = callback;
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setRemoteStream(null);
    setConnectionState('disconnected');
  }, []);

  // Create a new session with secure token
  const createSession = useCallback(async (): Promise<MobileSession | null> => {
    try {
      setIsGeneratingToken(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar logado para usar esta funcionalidade.',
          variant: 'destructive',
        });
        return null;
      }

      const sessionToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes
      const pairingExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes for pairing

      // Generate temp_jwt locally (simple base64 encoded token for pairing)
      const tokenData = {
        session_id: '', // Will be set after insert
        user_id: user.id,
        user_email: user.email,
        created_at: Date.now(),
        expires_at: pairingExpiresAt.getTime(),
      };

      // Create session in database with temp_jwt via RLS (owner can insert)
      const { data, error } = await supabase
        .from('mobile_audio_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          status: 'pending',
          mode: 'webspeech',
          expires_at: expiresAt.toISOString(),
          user_email: user.email,
          pairing_expires_at: pairingExpiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[MobileAudio] Session created:', data.id);

      // Now generate temp_jwt with actual session_id and update via RLS
      tokenData.session_id = data.id;
      const tempJwt = btoa(JSON.stringify(tokenData));

      // Update session with temp_jwt (RLS allows owner to update own sessions)
      const { error: updateError } = await supabase
        .from('mobile_audio_sessions')
        .update({ temp_jwt: tempJwt })
        .eq('id', data.id);

      if (updateError) {
        console.error('[MobileAudio] Failed to update temp_jwt:', updateError);
        throw updateError;
      }

      console.log('[MobileAudio] Secure token generated locally');

      const newSession: MobileSession = {
        id: data.id,
        sessionToken: data.session_token,
        status: data.status,
        mode: data.mode as 'webspeech' | 'whisper' | 'corrector',
        expiresAt: new Date(data.expires_at),
        tempJwt: tempJwt,
        userEmail: user.email || '',
      };

      setSession(newSession);
      setConnectionState('connecting');

      // Setup WebRTC peer connection (as answerer - desktop receives)
      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionRef.current = pc;

      pc.ontrack = (event) => {
        console.log('[MobileAudio] Received remote track:', event.track.kind);
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          setConnectionState('connected');
          toast({
            title: 'Celular conectado',
            description: 'Áudio do celular conectado com sucesso!',
          });
        }
      };

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
        console.log('[MobileAudio] Connection state:', pc.connectionState);
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setConnectionState('error');
        }
      };

      // Setup Supabase Realtime channel for signaling
      const channel = supabase.channel(`mobile-audio-${sessionToken}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on('broadcast', { event: 'signaling' }, async ({ payload }) => {
          const message = payload as SignalingMessage;
          console.log('[MobileAudio] Received signaling:', message.type);

          try {
            if (message.type === 'offer') {
              await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: message.sdp }));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              
              channel.send({
                type: 'broadcast',
                event: 'signaling',
                payload: { type: 'answer', sdp: answer.sdp } as SignalingMessage,
              });
            } else if (message.type === 'ice-candidate' && message.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
          } else if (message.type === 'mode-change') {
              setCurrentMode(message.mode);
            } else if (message.type === 'start-dictation') {
              // Mobile started dictation - activate remote dictation on desktop
              console.log('[MobileAudio] Start-dictation received, mode:', message.mode);
              setCurrentMode(message.mode);
              if (startCallbackRef.current) {
                startCallbackRef.current(message.mode);
              }
            } else if (message.type === 'heartbeat') {
              console.log('[MobileAudio] Heartbeat received from mobile');
            } else if (message.type === 'transcript') {
              // Forward transcript to registered callback
              console.log('[MobileAudio] Transcript received:', message.isFinal ? 'FINAL' : 'interim', message.text.substring(0, 50));
              if (transcriptCallbackRef.current) {
                transcriptCallbackRef.current({
                  text: message.text,
                  isFinal: message.isFinal,
                  confidence: message.confidence,
                });
              }
            } else if (message.type === 'stop-dictation') {
              // Mobile stopped dictation - trigger Corretor AI on desktop, session continues
              console.log('[MobileAudio] Stop-dictation received - triggering Corretor AI');
              if (stopCallbackRef.current) {
                stopCallbackRef.current();
              }
            } else if (message.type === 'disconnect') {
              // Mobile disconnected - end session completely
              console.log('[MobileAudio] Disconnect received - ending session');
              if (disconnectCallbackRef.current) {
                disconnectCallbackRef.current();
              }
              cleanup();
              setSession(null);
            }
          } catch (err) {
            console.error('[MobileAudio] Signaling error:', err);
          }
        })
        .subscribe((status) => {
          console.log('[MobileAudio] Channel status:', status);
        });

      channelRef.current = channel;

      return newSession;
    } catch (error) {
      console.error('[MobileAudio] Error creating session:', error);
      toast({
        title: 'Erro ao criar sessão',
        description: 'Não foi possível iniciar a sessão móvel.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGeneratingToken(false);
    }
  }, [toast, cleanup]);

  // End session
  const endSession = useCallback(async () => {
    if (session) {
      // Update session status in database
      await supabase
        .from('mobile_audio_sessions')
        .update({ status: 'completed', ended_at: new Date().toISOString() })
        .eq('id', session.id);

      // Notify mobile to disconnect
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'signaling',
          payload: { type: 'disconnect' } as SignalingMessage,
        });
      }
    }

    cleanup();
    setSession(null);

    toast({
      title: 'Sessão encerrada',
      description: 'A conexão com o celular foi encerrada.',
    });
  }, [session, cleanup, toast]);

  // Generate connection URL with auth token
  const getConnectionUrl = useCallback(() => {
    if (!session) return '';
    const baseUrl = getAppUrl();
    // Include auth token in URL for secure pairing
    const authParam = session.tempJwt ? `&auth=${encodeURIComponent(session.tempJwt)}` : '';
    return `${baseUrl}/mobile-mic?session=${session.sessionToken}${authParam}`;
  }, [session]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    session,
    connectionState,
    remoteStream,
    currentMode,
    createSession,
    endSession,
    getConnectionUrl,
    isGeneratingToken,
    onRemoteTranscript,
    onRemoteStop,
    onRemoteDisconnect,
    onRemoteStart,
  };
}
