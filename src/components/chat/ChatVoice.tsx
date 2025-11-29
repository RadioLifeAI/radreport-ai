import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatVoice } from '@/hooks/useChatVoice';

interface ChatVoiceProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const ChatVoice = ({ onTranscript, disabled }: ChatVoiceProps) => {
  const { isRecording, isTranscribing, startRecording, recordAndTranscribe } = useChatVoice();

  const handleVoiceClick = async () => {
    if (isRecording) {
      const transcript = await recordAndTranscribe();
      if (transcript) {
        onTranscript(transcript);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <Button
      variant={isRecording ? 'destructive' : 'outline'}
      size="icon"
      onClick={handleVoiceClick}
      disabled={disabled || isTranscribing}
      className={`h-11 w-11 shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
      title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
    >
      {isRecording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
