import { X, MessageSquarePlus, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import type { Message } from '@/hooks/useChat';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onInsertToReport: (text: string) => void;
  onNewConversation: () => void;
}

export const ChatPanel = ({
  isOpen,
  onClose,
  messages,
  isStreaming,
  onSendMessage,
  onInsertToReport,
  onNewConversation
}: ChatPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border/50 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Ícone do Assistente */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assistente RadReport</h2>
            <p className="text-xs text-muted-foreground">Sempre pronto para ajudar</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewConversation}
            title="Nova conversa"
            className="hover:bg-cyan-500/10"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Fechar"
            className="hover:bg-cyan-500/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          onInsertToReport={onInsertToReport}
          isStreaming={isStreaming}
        />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-muted/10 p-4">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
};
