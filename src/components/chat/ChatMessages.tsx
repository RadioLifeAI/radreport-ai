import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Bot } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 mb-4 animate-in fade-in duration-500">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2 animate-in fade-in duration-500 delay-100">
          Assistente RadReport
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm animate-in fade-in duration-500 delay-200">
          Faça perguntas sobre radiologia, peça sugestões de diagnóstico ou ajuda com laudos médicos.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="flex flex-col gap-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-cyan-500/20'
                  : 'bg-muted/50 text-foreground border border-border/50 rounded-tl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
                {message.role === 'assistant' && isStreaming && messages[messages.length - 1]?.id === message.id && (
                  <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                )}
              </div>
              
              {message.role === 'assistant' && message.content && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onInsertToReport(message.content)}
                    className="text-xs hover:bg-cyan-500/10 hover:text-cyan-600"
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
          <div className="flex justify-start items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
