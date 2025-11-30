import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface EditorSettings {
  id: string;
  user_id: string;
  theme: string | null;
  font_family: string | null;
  font_size: number | null;
  line_height: number | null;
  auto_save_enabled: boolean | null;
  auto_save_interval: number | null;
  ai_enabled: boolean | null;
  ai_auto_suggest: boolean | null;
  ai_confidence_threshold: number | null;
  preferred_ai_model: string | null;
  voice_enabled: boolean | null;
  voice_language: string | null;
  voice_sensitivity: number | null;
  voice_auto_punctuation: boolean | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useEditorSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<EditorSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('editor_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSettings(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching editor settings:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Omit<EditorSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('editor_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSettings();
      toast.success('Configurações salvas');
    } catch (err: any) {
      console.error('Error updating settings:', err);
      toast.error('Erro ao salvar configurações');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user?.id]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
  };
};
