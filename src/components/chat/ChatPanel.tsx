import { X, MessageSquarePlus, Bot, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Badge } from '@/components/ui/badge';
import { useAICredits } from '@/hooks/useAICredits';
import { useSubscription } from '@/hooks/useSubscription';
import type { Message } from '@/hooks/useChat';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onInsertToReport: (text: string) => void;
  onNewConversation: () => void;
  onUpgrade?: () => void;
}

export const ChatPanel = ({
  isOpen,
  onClose,
  messages,
  isStreaming,
  onSendMessage,
  onInsertToReport,
  onNewConversation,
  onUpgrade
}: ChatPanelProps) => {
  const { balance } = useAICredits();
  const { features } = useSubscription();
  
  const canUseChat = features?.feature_ai_chat === true;
  const hasCredits = balance >= 1;
  const isDisabled = !canUseChat || !hasCredits;

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border/50 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assistente RadReport</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Sempre pronto para ajudar</p>
              <Badge variant={balance > 5 ? 'default' : balance > 0 ? 'secondary' : 'destructive'} className="text-xs">
                {balance} créditos
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewConversation}
            title="Nova conversa"
            className="hover:bg-cyan-500/10"
            disabled={isDisabled}
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

      {/* Feature/Credits Banner */}
      {!canUseChat && (
        <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-500">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Chat AI disponível no plano Básico ou superior</span>
          </div>
          {onUpgrade && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
              onClick={onUpgrade}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          )}
        </div>
      )}

      {canUseChat && !hasCredits && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20">
          <div className="flex items-center gap-2 text-red-500">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">Seus créditos AI acabaram</span>
          </div>
          {onUpgrade && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={onUpgrade}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Obter mais créditos
            </Button>
          )}
        </div>
      )}

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
          disabled={isStreaming || isDisabled}
          placeholder={isDisabled ? (canUseChat ? 'Sem créditos disponíveis' : 'Chat disponível no plano Básico+') : undefined}
        />
      </div>
    </div>
  );
};