import { X, MessageSquarePlus } from 'lucide-react';
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Chat IA Radiológica</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewConversation}
            title="Nova conversa"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages messages={messages} onInsertToReport={onInsertToReport} />
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
