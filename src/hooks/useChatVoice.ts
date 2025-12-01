import { useState, useCallback, useRef } from 'react';
import { invokeEdgeFunction } from '@/services/edgeFunctionClient';
import { toast } from 'sonner';

export const useChatVoice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Gravação iniciada');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Erro ao acessar microfone');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve(new Blob());
        return;
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    setIsTranscribing(true);
    
    try {
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
        reader.readAsDataURL(audioBlob);
      });

      const data = await invokeEdgeFunction<{ text: string; language?: string }>(
        'transcribe-audio',
        { audio: base64Audio }
      );

      const transcribedText = data.text || '';
      setTranscript(transcribedText);
      setIsTranscribing(false);
      toast.success('Áudio transcrito');
      return transcribedText;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Erro ao transcrever áudio');
      setIsTranscribing(false);
      return '';
    }
  }, []);

  const recordAndTranscribe = useCallback(async (): Promise<string> => {
    const blob = await stopRecording();
    if (blob.size === 0) return '';
    return await transcribeAudio(blob);
  }, [stopRecording, transcribeAudio]);

  return {
    isRecording,
    isTranscribing,
    transcript,
    startRecording,
    stopRecording,
    transcribeAudio,
    recordAndTranscribe
  };
};
