import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export interface UserTemplate {
  id: string;
  user_id: string;
  titulo: string;
  texto: string;
  modalidade_codigo: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFrase {
  id: string;
  user_id: string;
  titulo: string;
  texto: string;
  conclusao?: string;
  modalidade_codigo: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserContentLimits {
  templates: number;
  frases: number;
}

export function useUserContent() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const queryClient = useQueryClient();

  // Buscar templates do usuário
  const { data: userTemplates = [], isLoading: loadingTemplates, refetch: refetchTemplates } = useQuery({
    queryKey: ['user-templates', user?.id],
    queryFn: async (): Promise<UserTemplate[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user templates:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  // Buscar frases do usuário
  const { data: userFrases = [], isLoading: loadingFrases, refetch: refetchFrases } = useQuery({
    queryKey: ['user-frases', user?.id],
    queryFn: async (): Promise<UserFrase[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_frases')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user frases:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  // Limites do plano
  const limits: UserContentLimits = {
    templates: (subscription?.features as any)?.max_user_templates || 5,
    frases: (subscription?.features as any)?.max_user_frases || 10,
  };

  const canAddTemplate = userTemplates.length < limits.templates;
  const canAddFrase = userFrases.length < limits.frases;

  // Mutation: Adicionar template
  const addTemplateMutation = useMutation({
    mutationFn: async (data: { titulo: string; texto: string; modalidade_codigo: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      if (!canAddTemplate) throw new Error(`Limite de ${limits.templates} templates atingido`);
      
      const { data: result, error } = await supabase
        .from('user_templates')
        .insert({
          user_id: user.id,
          titulo: data.titulo,
          texto: data.texto,
          modalidade_codigo: data.modalidade_codigo,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-templates'] });
      toast.success('Template criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar template');
    },
  });

  // Mutation: Adicionar frase
  const addFraseMutation = useMutation({
    mutationFn: async (data: { titulo: string; texto: string; conclusao?: string; modalidade_codigo: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      if (!canAddFrase) throw new Error(`Limite de ${limits.frases} frases atingido`);
      
      const { data: result, error } = await supabase
        .from('user_frases')
        .insert({
          user_id: user.id,
          titulo: data.titulo,
          texto: data.texto,
          conclusao: data.conclusao || null,
          modalidade_codigo: data.modalidade_codigo,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-frases'] });
      toast.success('Frase criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar frase');
    },
  });

  // Mutation: Atualizar template
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; titulo?: string; texto?: string; modalidade_codigo?: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data: result, error } = await supabase
        .from('user_templates')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-templates'] });
      toast.success('Template atualizado!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar template');
    },
  });

  // Mutation: Atualizar frase
  const updateFraseMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; titulo?: string; texto?: string; conclusao?: string; modalidade_codigo?: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data: result, error } = await supabase
        .from('user_frases')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-frases'] });
      toast.success('Frase atualizada!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar frase');
    },
  });

  // Mutation: Deletar template (soft delete)
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('user_templates')
        .update({ ativo: false })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-templates'] });
      toast.success('Template removido');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover template');
    },
  });

  // Mutation: Deletar frase (soft delete)
  const deleteFraseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('user_frases')
        .update({ ativo: false })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-frases'] });
      toast.success('Frase removida');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover frase');
    },
  });

  return {
    // Data
    userTemplates,
    userFrases,
    limits,
    
    // Loading states
    loadingTemplates,
    loadingFrases,
    
    // Permissions
    canAddTemplate,
    canAddFrase,
    
    // Actions
    addTemplate: addTemplateMutation.mutate,
    addFrase: addFraseMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    updateFrase: updateFraseMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    deleteFrase: deleteFraseMutation.mutate,
    
    // Loading states for mutations
    isAddingTemplate: addTemplateMutation.isPending,
    isAddingFrase: addFraseMutation.isPending,
    
    // Refetch
    refetchTemplates,
    refetchFrases,
  };
}
