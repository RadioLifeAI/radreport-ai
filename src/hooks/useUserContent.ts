import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

export interface UserTemplate {
  id: string;
  user_id: string;
  titulo: string;
  texto?: string;
  modalidade_codigo: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Campos expandidos
  indicacao_clinica?: string;
  tecnica?: Record<string, string> | null;
  achados?: string;
  impressao?: string;
  adicionais?: string;
  regiao_codigo?: string;
  categoria?: 'normal' | 'alterado';
  tags?: string[];
  conteudo_template?: string;
  modo?: 'simples' | 'profissional';
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
  // Campos expandidos
  categoria?: 'normal' | 'alterado';
  regiao_codigo?: string;
  tags?: string[];
  indicacao_clinica?: string;
  tecnica?: string;
}

export interface UserContentLimits {
  templates: number;
  frases: number;
}

export interface AddTemplateData {
  titulo: string;
  texto?: string;
  modalidade_codigo: string;
  indicacao_clinica?: string;
  tecnica?: Record<string, string> | null;
  achados?: string;
  impressao?: string;
  adicionais?: string;
  regiao_codigo?: string;
  categoria?: 'normal' | 'alterado';
  tags?: string[];
  conteudo_template?: string;
  modo?: 'simples' | 'profissional';
}

export interface AddFraseData {
  titulo: string;
  texto: string;
  conclusao?: string;
  modalidade_codigo: string;
  categoria?: 'normal' | 'alterado';
  regiao_codigo?: string;
  tags?: string[];
  indicacao_clinica?: string;
  tecnica?: string;
}

// LocalStorage keys for usage history and favorites
const RECENT_USER_TEMPLATES_KEY = 'recent-user-templates';
const RECENT_USER_FRASES_KEY = 'recent-user-frases';
const FAV_USER_TEMPLATES_KEY = 'fav-user-templates';
const FAV_USER_FRASES_KEY = 'fav-user-frases';
const MAX_RECENT_ITEMS = 10;

export function useUserContent() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const queryClient = useQueryClient();

  // Recent usage tracking (localStorage)
  const [recentUserTemplateIds, setRecentUserTemplateIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_USER_TEMPLATES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [recentUserFraseIds, setRecentUserFraseIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_USER_FRASES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Favorites (localStorage)
  const [favoriteUserTemplateIds, setFavoriteUserTemplateIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_USER_TEMPLATES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [favoriteUserFraseIds, setFavoriteUserFraseIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_USER_FRASES_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Persist recent to localStorage
  useEffect(() => {
    localStorage.setItem(RECENT_USER_TEMPLATES_KEY, JSON.stringify(recentUserTemplateIds));
  }, [recentUserTemplateIds]);

  useEffect(() => {
    localStorage.setItem(RECENT_USER_FRASES_KEY, JSON.stringify(recentUserFraseIds));
  }, [recentUserFraseIds]);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAV_USER_TEMPLATES_KEY, JSON.stringify(favoriteUserTemplateIds));
  }, [favoriteUserTemplateIds]);

  useEffect(() => {
    localStorage.setItem(FAV_USER_FRASES_KEY, JSON.stringify(favoriteUserFraseIds));
  }, [favoriteUserFraseIds]);

  // Track usage functions
  const trackUserTemplateUsage = useCallback((templateId: string) => {
    setRecentUserTemplateIds(prev => 
      [templateId, ...prev.filter(id => id !== templateId)].slice(0, MAX_RECENT_ITEMS)
    );
  }, []);

  const trackUserFraseUsage = useCallback((fraseId: string) => {
    setRecentUserFraseIds(prev => 
      [fraseId, ...prev.filter(id => id !== fraseId)].slice(0, MAX_RECENT_ITEMS)
    );
  }, []);

  // Favorite toggle functions
  const toggleFavoriteUserTemplate = useCallback((templateId: string) => {
    setFavoriteUserTemplateIds(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  }, []);

  const toggleFavoriteUserFrase = useCallback((fraseId: string) => {
    setFavoriteUserFraseIds(prev => 
      prev.includes(fraseId) 
        ? prev.filter(id => id !== fraseId)
        : [...prev, fraseId]
    );
  }, []);

  const isUserTemplateFavorite = useCallback((templateId: string) => {
    return favoriteUserTemplateIds.includes(templateId);
  }, [favoriteUserTemplateIds]);

  const isUserFraseFavorite = useCallback((fraseId: string) => {
    return favoriteUserFraseIds.includes(fraseId);
  }, [favoriteUserFraseIds]);

  // Buscar templates do usuário (ativos)
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
      
      return (data || []) as UserTemplate[];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  // Buscar templates deletados (lixeira)
  const { data: deletedTemplates = [], isLoading: loadingDeletedTemplates, refetch: refetchDeletedTemplates } = useQuery({
    queryKey: ['user-templates-deleted', user?.id],
    queryFn: async (): Promise<UserTemplate[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', false)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching deleted templates:', error);
        return [];
      }
      
      return (data || []) as UserTemplate[];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  // Buscar frases do usuário (ativas)
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
      
      return (data || []) as UserFrase[];
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  // Buscar frases deletadas (lixeira)
  const { data: deletedFrases = [], isLoading: loadingDeletedFrases, refetch: refetchDeletedFrases } = useQuery({
    queryKey: ['user-frases-deleted', user?.id],
    queryFn: async (): Promise<UserFrase[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_frases')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', false)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching deleted frases:', error);
        return [];
      }
      
      return (data || []) as UserFrase[];
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
    mutationFn: async (data: AddTemplateData) => {
      if (!user) throw new Error('Usuário não autenticado');
      if (!canAddTemplate) throw new Error(`Limite de ${limits.templates} templates atingido`);
      
      const { data: result, error } = await supabase
        .from('user_templates')
        .insert({
          user_id: user.id,
          titulo: data.titulo,
          texto: data.texto,
          modalidade_codigo: data.modalidade_codigo,
          indicacao_clinica: data.indicacao_clinica,
          tecnica: data.tecnica,
          achados: data.achados,
          impressao: data.impressao,
          adicionais: data.adicionais,
          regiao_codigo: data.regiao_codigo,
          categoria: data.categoria || 'normal',
          tags: data.tags || [],
          conteudo_template: data.conteudo_template,
          modo: data.modo || 'simples',
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
    mutationFn: async (data: AddFraseData) => {
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
          categoria: data.categoria || 'normal',
          regiao_codigo: data.regiao_codigo,
          tags: data.tags || [],
          indicacao_clinica: data.indicacao_clinica,
          tecnica: data.tecnica,
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
    mutationFn: async ({ id, ...data }: Partial<UserTemplate> & { id: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['user-templates-deleted'] });
      toast.success('Template atualizado!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar template');
    },
  });

  // Mutation: Atualizar frase
  const updateFraseMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<UserFrase> & { id: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['user-frases-deleted'] });
      toast.success('Frase atualizada!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar frase');
    },
  });

  // Mutation: Deletar template (soft delete - mover para lixeira)
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
      queryClient.invalidateQueries({ queryKey: ['user-templates-deleted'] });
      toast.success('Template movido para lixeira');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover template');
    },
  });

  // Mutation: Deletar frase (soft delete - mover para lixeira)
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
      queryClient.invalidateQueries({ queryKey: ['user-frases-deleted'] });
      toast.success('Frase movida para lixeira');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover frase');
    },
  });

  // Mutation: Restaurar template
  const restoreTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      if (!canAddTemplate) throw new Error(`Limite de ${limits.templates} templates atingido. Exclua um template antes de restaurar.`);
      
      const { error } = await supabase
        .from('user_templates')
        .update({ ativo: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-templates'] });
      queryClient.invalidateQueries({ queryKey: ['user-templates-deleted'] });
      toast.success('Template restaurado!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao restaurar template');
    },
  });

  // Mutation: Restaurar frase
  const restoreFraseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      if (!canAddFrase) throw new Error(`Limite de ${limits.frases} frases atingido. Exclua uma frase antes de restaurar.`);
      
      const { error } = await supabase
        .from('user_frases')
        .update({ ativo: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-frases'] });
      queryClient.invalidateQueries({ queryKey: ['user-frases-deleted'] });
      toast.success('Frase restaurada!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao restaurar frase');
    },
  });

  // Mutation: Excluir permanentemente template
  const permanentDeleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('user_templates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-templates-deleted'] });
      toast.success('Template excluído permanentemente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir template');
    },
  });

  // Mutation: Excluir permanentemente frase
  const permanentDeleteFraseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('user_frases')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-frases-deleted'] });
      toast.success('Frase excluída permanentemente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir frase');
    },
  });

  // Get recent user templates (filtered by existing ids)
  const recentUserTemplates = userTemplates.filter(t => recentUserTemplateIds.includes(t.id));
  const recentUserFrases = userFrases.filter(f => recentUserFraseIds.includes(f.id));

  // Get favorite user templates (filtered by existing ids)
  const favoriteUserTemplates = userTemplates.filter(t => favoriteUserTemplateIds.includes(t.id));
  const favoriteUserFrases = userFrases.filter(f => favoriteUserFraseIds.includes(f.id));

  return {
    // Data
    userTemplates,
    userFrases,
    deletedTemplates,
    deletedFrases,
    recentUserTemplates,
    recentUserFrases,
    favoriteUserTemplates,
    favoriteUserFrases,
    limits,
    
    // Loading states
    loadingTemplates,
    loadingFrases,
    loadingDeletedTemplates,
    loadingDeletedFrases,
    
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
    restoreTemplate: restoreTemplateMutation.mutate,
    restoreFrase: restoreFraseMutation.mutate,
    permanentDeleteTemplate: permanentDeleteTemplateMutation.mutate,
    permanentDeleteFrase: permanentDeleteFraseMutation.mutate,
    
    // Usage tracking
    trackUserTemplateUsage,
    trackUserFraseUsage,
    
    // Favorites
    toggleFavoriteUserTemplate,
    toggleFavoriteUserFrase,
    isUserTemplateFavorite,
    isUserFraseFavorite,
    
    // Loading states for mutations
    isAddingTemplate: addTemplateMutation.isPending,
    isAddingFrase: addFraseMutation.isPending,
    isRestoringTemplate: restoreTemplateMutation.isPending,
    isRestoringFrase: restoreFraseMutation.isPending,
    
    // Refetch
    refetchTemplates,
    refetchFrases,
    refetchDeletedTemplates,
    refetchDeletedFrases,
  };
}
