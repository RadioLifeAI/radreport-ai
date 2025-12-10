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

interface UseMobileAudioSessionReturn {
  session: MobileSession | null;
  connectionState: ConnectionState;
  remoteStream: MediaStream | null;
  currentMode: 'webspeech' | 'whisper' | 'corrector';
  createSession: () => Promise<MobileSession | null>;
  endSession: () => Promise<void>;
  getConnectionUrl: () => string;
}

export function useMobileAudioSession(): UseMobileAudioSessionReturn {
  const { toast } = useToast();
  const [session, setSession] = useState<MobileSession | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [currentMode, setCurrentMode] = useState<'webspeech' | 'whisper' | 'corrector'>('webspeech');
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

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

  // Create a new session
  const createSession = useCallback(async (): Promise<MobileSession | null> => {
    try {
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

      const { data, error } = await supabase
        .from('mobile_audio_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          status: 'pending',
          mode: 'webspeech',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: MobileSession = {
        id: data.id,
        sessionToken: data.session_token,
        status: data.status,
        mode: data.mode as 'webspeech' | 'whisper' | 'corrector',
        expiresAt: new Date(data.expires_at),
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
            } else if (message.type === 'disconnect') {
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

  // Generate connection URL - usa URL de produção quando disponível
  const getConnectionUrl = useCallback(() => {
    if (!session) return '';
    const baseUrl = getAppUrl();
    return `${baseUrl}/mobile-mic?session=${session.sessionToken}`;
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
  };
}
