import { supabase } from "@/integrations/supabase/client";

export interface Report {
  id: string;
  title: string;
  content: string;
  exam_type: string;
  report_number: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  exam_date?: string;
}

export interface ReportVersion {
  id: string;
  report_id: string;
  version_number: number;
  content: string;
  created_at?: string;
  created_by?: string;
}

export interface FraseModelo {
  id: string;
  codigo: string;
  texto: string;
  categoria?: string;
  modalidade_codigo?: string;
  tags?: string[];
  ativa?: boolean;
}

export interface Template {
  id: string;
  codigo: string;
  titulo: string;
  modalidade_codigo: string;
  regiao_codigo: string;
  tecnica: any;
  achados: string;
  impressao: string;
  tags?: string[];
  ativo?: boolean;
}

class SupabaseService {
  // Reports
  async createReport(title: string, content: string): Promise<Report | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const reportNumber = `RPT-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title,
          content,
          exam_type: 'General',
          report_number: reportNumber,
          status: 'draft',
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      return null;
    }
  }

  async updateReport(reportId: string, updates: Partial<Report>): Promise<Report | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating report:', error);
      return null;
    }
  }

  async getReport(reportId: string): Promise<Report | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting report:', error);
      return null;
    }
  }

  async getReports(limit = 50, offset = 0): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  }

  async autosaveReport(reportId: string, content: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', reportId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error autosaving report:', error);
      return false;
    }
  }

  async getReportVersions(reportId: string): Promise<ReportVersion[]> {
    try {
      const { data, error } = await supabase
        .from('report_versions')
        .select('*')
        .eq('report_id', reportId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting report versions:', error);
      return [];
    }
  }

  subscribeToReportChanges(reportId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`report-${reportId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
          filter: `id=eq.${reportId}`
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Frases Modelo
  async getFrasesModelo(): Promise<FraseModelo[]> {
    try {
      const { data, error } = await supabase
        .from('frases_modelo')
        .select('*')
        .eq('ativa', true)
        .order('codigo');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting frases modelo:', error);
      return [];
    }
  }

  async searchFrasesModelo(searchTerm: string): Promise<FraseModelo[]> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('frases_modelo')
        .select('*')
        .eq('ativa', true)
        .or(`codigo.ilike.%${searchTerm}%,texto.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching frases modelo:', error);
      return [];
    }
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    try {
      const { data, error } = await supabase
        .from('system_templates')
        .select('*')
        .eq('ativo', true)
        .order('titulo');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  async searchTemplates(searchTerm: string): Promise<Template[]> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('system_templates')
        .select('*')
        .eq('ativo', true)
        .or(`titulo.ilike.%${searchTerm}%,codigo.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching templates:', error);
      return [];
    }
  }

  // Macros (usando frases_modelo como fallback)
  async getMacros() {
    return this.getFrasesModelo();
  }

  async searchMacros(searchTerm: string) {
    return this.searchFrasesModelo(searchTerm);
  }

  // Voice Commands
  async logVoiceCommand(command: string, transcription: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('voice_commands')
        .insert({
          original_text: command,
          transcribed_text: transcription,
          user_id: user?.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging voice command:', error);
      return false;
    }
  }

  // AI Logs
  async logAIConclusion(input: string, output: string, modality?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('ai_conclusion_logs')
        .insert({
          input_size: input.length,
          output_size: output.length,
          raw_model_output: output,
          modality,
          status: 'success',
          user_id: user?.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging AI conclusion:', error);
      return false;
    }
  }

  async logAIReview(content: string, response: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('ai_review_log')
        .insert({
          size: content.length,
          response_size: response.length,
          model: 'gpt-4o-mini',
          status: 'success',
          user_id: user?.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging AI review:', error);
      return false;
    }
  }

  // User Favorites - Templates
  async getUserFavoriteTemplates(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_favorite_templates')
        .select('template_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.template_id) || [];
    } catch (error) {
      console.error('Error getting favorite templates:', error);
      return [];
    }
  }

  async addFavoriteTemplate(templateId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorite_templates')
        .insert({
          user_id: user.id,
          template_id: templateId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding favorite template:', error);
      return false;
    }
  }

  async removeFavoriteTemplate(templateId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorite_templates')
        .delete()
        .eq('user_id', user.id)
        .eq('template_id', templateId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing favorite template:', error);
      return false;
    }
  }

  // User Favorites - Frases
  async getUserFavoriteFrases(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_favorite_frases')
        .select('frase_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.frase_id) || [];
    } catch (error) {
      console.error('Error getting favorite frases:', error);
      return [];
    }
  }

  async addFavoriteFrase(fraseId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorite_frases')
        .insert({
          user_id: user.id,
          frase_id: fraseId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding favorite frase:', error);
      return false;
    }
  }

  async removeFavoriteFrase(fraseId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorite_frases')
        .delete()
        .eq('user_id', user.id)
        .eq('frase_id', fraseId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing favorite frase:', error);
      return false;
    }
  }

  // Template Usage History
  async recordTemplateUsage(templateId: string, reportId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if usage exists
      const { data: existing } = await supabase
        .from('user_template_usage')
        .select('id, usage_count')
        .eq('user_id', user.id)
        .eq('template_id', templateId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_template_usage')
          .update({
            used_at: new Date().toISOString(),
            usage_count: existing.usage_count + 1,
            report_id: reportId
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_template_usage')
          .insert({
            user_id: user.id,
            template_id: templateId,
            report_id: reportId,
            usage_count: 1
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error recording template usage:', error);
      return false;
    }
  }

  async getRecentTemplates(limit = 10): Promise<Array<{template_id: string, used_at: string, usage_count: number}>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_template_usage')
        .select('template_id, used_at, usage_count')
        .eq('user_id', user.id)
        .order('used_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting recent templates:', error);
      return [];
    }
  }

  // Frase Usage History
  async recordFraseUsage(fraseId: string, reportId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if usage exists
      const { data: existing } = await supabase
        .from('user_frase_usage')
        .select('id, usage_count')
        .eq('user_id', user.id)
        .eq('frase_id', fraseId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_frase_usage')
          .update({
            used_at: new Date().toISOString(),
            usage_count: existing.usage_count + 1,
            report_id: reportId
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_frase_usage')
          .insert({
            user_id: user.id,
            frase_id: fraseId,
            report_id: reportId,
            usage_count: 1
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error recording frase usage:', error);
      return false;
    }
  }

  async getRecentFrases(limit = 10): Promise<Array<{frase_id: string, used_at: string, usage_count: number}>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_frase_usage')
        .select('frase_id, used_at, usage_count')
        .eq('user_id', user.id)
        .order('used_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting recent frases:', error);
      return [];
    }
  }
}

export const supabaseService = new SupabaseService();
