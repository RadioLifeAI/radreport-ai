import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { invokeEdgeFunctionStream } from '@/services/edgeFunctionClient';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  achado?: string;
  explicacao?: string;
  tipo?: 'achado' | 'conclusao' | 'classificacao' | 'pergunta';
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface StructuredContent {
  achado: string;
  explicacao?: string;
  tipo: 'achado' | 'conclusao' | 'classificacao' | 'pergunta';
}

const CURRENT_CONVERSATION_KEY = 'radreport-current-conversation';

// Helper to parse stored message content (could be JSON structured or plain text)
const parseMessageContent = (content: string): { content: string; achado?: string; explicacao?: string; tipo?: string } => {
  try {
    const parsed = JSON.parse(content) as StructuredContent;
    if (parsed.achado && parsed.tipo) {
      return {
        content: parsed.achado,
        achado: parsed.achado,
        explicacao: parsed.explicacao || '',
        tipo: parsed.tipo
      };
    }
  } catch {
    // Not JSON, return as plain content
  }
  return { content };
};

export const useChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    setConversations(data || []);
    
    // Auto-selecionar última conversa se não houver uma selecionada
    if (!currentConversation && data && data.length > 0) {
      const savedId = localStorage.getItem(CURRENT_CONVERSATION_KEY);
      const targetConv = savedId 
        ? data.find(c => c.id === savedId) || data[0]
        : data[0];
      
      if (targetConv) {
        setCurrentConversation(targetConv);
        loadMessages(targetConv.id);
      }
    }
  }, [user, currentConversation]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      toast.error('Erro ao carregar mensagens');
      setIsLoading(false);
      return;
    }

    setMessages(data.map(msg => {
      const parsed = parseMessageContent(msg.content);
      return {
        ...msg,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: parsed.content,
        achado: parsed.achado,
        explicacao: parsed.explicacao,
        tipo: parsed.tipo as Message['tipo']
      };
    }) || []);
    setIsLoading(false);
  }, []);

  const startNewConversation = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: user.id,
        title: 'Nova conversa'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      toast.error('Erro ao criar conversa');
      return;
    }

    setCurrentConversation(data);
    localStorage.setItem(CURRENT_CONVERSATION_KEY, data.id);
    setMessages([]);
    await loadConversations();
  }, [user, loadConversations]);

  const selectConversation = useCallback(async (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;

    setCurrentConversation(conv);
    localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
    await loadMessages(id);
  }, [conversations, loadMessages]);

  const deleteConversation = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Erro ao deletar conversa');
      return;
    }

    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
      localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    }

    await loadConversations();
    toast.success('Conversa deletada');
  }, [currentConversation, loadConversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    // Auto-criar conversa se não existir
    let conversationId = currentConversation?.id;
    if (!conversationId) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: content.slice(0, 50) || 'Nova conversa'
        })
        .select()
        .single();
      
      if (error || !data) {
        console.error('Error creating conversation:', error);
        toast.error('Erro ao criar conversa');
        return;
      }
      
      conversationId = data.id;
      setCurrentConversation(data);
      localStorage.setItem(CURRENT_CONVERSATION_KEY, data.id);
      await loadConversations();
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      // Salvar mensagem do usuário no banco
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content
      });

      const response = await invokeEdgeFunctionStream(
        'radreport-chat',
        {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          conversation_id: conversationId
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const assistantMessageId = crypto.randomUUID();
      
      // Track structured response data
      let currentAchado = '';
      let currentExplicacao = '';
      let currentTipo: Message['tipo'] = 'pergunta';

      if (reader) {
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith(':')) continue;
            if (!line.startsWith('data: ')) continue;

            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              
              // Handle structured response
              if (parsed.achado !== undefined) {
                currentAchado = parsed.achado;
                currentExplicacao = parsed.explicacao || '';
                currentTipo = parsed.tipo || 'pergunta';
                
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant' && last.id === assistantMessageId) {
                    return prev.map(m => 
                      m.id === assistantMessageId 
                        ? { 
                            ...m, 
                            content: currentAchado,
                            achado: currentAchado,
                            explicacao: currentExplicacao,
                            tipo: currentTipo
                          }
                        : m
                    );
                  }
                  return [...prev, {
                    id: assistantMessageId,
                    role: 'assistant' as const,
                    content: currentAchado,
                    achado: currentAchado,
                    explicacao: currentExplicacao,
                    tipo: currentTipo,
                    created_at: new Date().toISOString()
                  }];
                });
              } else if (parsed.content) {
                // Fallback for legacy/plain content
                currentAchado += parsed.content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant' && last.id === assistantMessageId) {
                    return prev.map(m => 
                      m.id === assistantMessageId 
                        ? { ...m, content: currentAchado, achado: currentAchado }
                        : m
                    );
                  }
                  return [...prev, {
                    id: assistantMessageId,
                    role: 'assistant' as const,
                    content: currentAchado,
                    achado: currentAchado,
                    created_at: new Date().toISOString()
                  }];
                });
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }

      setIsStreaming(false);
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
      setIsStreaming(false);
    }
  }, [user, currentConversation, messages, loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    isStreaming,
    isLoading,
    loadConversations,
    loadMessages,
    startNewConversation,
    selectConversation,
    deleteConversation,
    sendMessage
  };
};
