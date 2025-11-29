import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import type { Message } from '@/hooks/useChat';

interface ChatMessagesProps {
  messages: Message[];
  onInsertToReport: (text: string) => void;
  isStreaming?: boolean;
}

export const ChatMessages = ({ messages, onInsertToReport, isStreaming = false }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
        <div>
          <p className="text-lg font-medium mb-2">Bem-vindo ao Chat IA Radiológica</p>
          <p className="text-sm">
            Faça perguntas sobre radiologia, peça sugestões de diagnóstico ou ajuda com laudos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="flex flex-col gap-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-border'
              }`}
            >
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
                {message.role === 'assistant' && isStreaming && messages[messages.length - 1]?.id === message.id && (
                  <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                )}
              </div>
              
              {message.role === 'assistant' && message.content && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onInsertToReport(message.content)}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Inserir no laudo
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-muted border border-border rounded-lg px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
