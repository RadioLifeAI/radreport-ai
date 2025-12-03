import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Bot, Lightbulb, Stethoscope, ClipboardList, HelpCircle, AlertCircle, TrendingUp } from 'lucide-react';
import type { Message } from '@/hooks/useChat';

interface ChatMessagesProps {
  messages: Message[];
  onInsertToReport: (text: string) => void;
  isStreaming?: boolean;
  onUpgrade?: () => void;
}

// Icon based on response type
const getTipoIcon = (tipo?: Message['tipo']) => {
  switch (tipo) {
    case 'achado':
      return <Stethoscope className="h-3 w-3" />;
    case 'conclusao':
      return <ClipboardList className="h-3 w-3" />;
    case 'classificacao':
      return <FileText className="h-3 w-3" />;
    case 'pergunta':
      return <HelpCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

// Label based on response type
const getTipoLabel = (tipo?: Message['tipo']) => {
  switch (tipo) {
    case 'achado':
      return 'Achado';
    case 'conclusao':
      return 'Conclusão';
    case 'classificacao':
      return 'Classificação';
    case 'pergunta':
      return 'Resposta';
    default:
      return null;
  }
};

export const ChatMessages = ({ messages, onInsertToReport, isStreaming = false, onUpgrade }: ChatMessagesProps) => {
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
        {messages.map((message) => {
          // Special system upgrade message
          if ((message as any).tipo === 'system_upgrade') {
            return (
              <div key={message.id} className="flex justify-start items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <div className="max-w-[85%] p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Créditos Insuficientes</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
                  {onUpgrade && (
                    <Button 
                      onClick={onUpgrade}
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Fazer Upgrade
                    </Button>
                  )}
                </div>
              </div>
            );
          }

          return (
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
                {/* Type badge for assistant messages */}
                {message.role === 'assistant' && message.tipo && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      {getTipoIcon(message.tipo)}
                      {getTipoLabel(message.tipo)}
                    </span>
                  </div>
                )}

                {/* Main content - achado (insertable text) */}
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.achado || message.content}
                  {message.role === 'assistant' && isStreaming && messages[messages.length - 1]?.id === message.id && (
                    <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                  )}
                </div>
                
                {/* Explicação (additional context, NOT for insertion) */}
                {message.role === 'assistant' && message.explicacao && message.explicacao.trim() !== '' && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="italic leading-relaxed">{message.explicacao}</p>
                    </div>
                  </div>
                )}
                
                {/* Insert button - inserts ONLY achado, not explicacao */}
                {message.role === 'assistant' && (message.achado || message.content) && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInsertToReport(message.achado || message.content)}
                      className="text-xs hover:bg-cyan-500/10 hover:text-cyan-600"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Inserir no laudo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
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
