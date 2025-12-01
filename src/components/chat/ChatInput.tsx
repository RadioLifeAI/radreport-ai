import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { ChatVoice } from './ChatVoice';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleVoiceTranscript = (transcript: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + transcript);
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre BI-RADS, laudos, diagnósticos..."
          disabled={disabled}
          className="min-h-[44px] max-h-[200px] resize-none pr-10 rounded-2xl border-border/50 focus-visible:ring-cyan-500/50"
          rows={1}
        />
      </div>
      
      <ChatVoice
        onTranscript={handleVoiceTranscript}
        disabled={disabled}
      />

      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || disabled}
        size="icon"
        className="h-11 w-11 shrink-0 bg-gradient-to-br from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-200"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
