export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_conclusion_logs: {
        Row: {
          created_at: string
          id: string
          input_size: number
          modality: string | null
          output_size: number | null
          raw_model_output: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_size: number
          modality?: string | null
          output_size?: number | null
          raw_model_output?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_size?: number
          modality?: string | null
          output_size?: number | null
          raw_model_output?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_credits_ledger: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          feature_used: string | null
          id: string
          metadata: Json | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          feature_used?: string | null
          id?: string
          metadata?: Json | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          feature_used?: string | null
          id?: string
          metadata?: Json | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_inline_edits_log: {
        Row: {
          command: string
          created_at: string
          id: string
          metadata: Json | null
          response_size: number
          section: string | null
          selection_size: number
          status: string
          user_id: string | null
        }
        Insert: {
          command: string
          created_at?: string
          id?: string
          metadata?: Json | null
          response_size: number
          section?: string | null
          selection_size: number
          status?: string
          user_id?: string | null
        }
        Update: {
          command?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          response_size?: number
          section?: string | null
          selection_size?: number
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_model_rate_limits: {
        Row: {
          concurrent_requests: number | null
          created_at: string | null
          id: string
          model_id: string | null
          requests_per_minute: number | null
          tier: string
          tokens_per_day: number | null
          tokens_per_minute: number | null
          updated_at: string | null
        }
        Insert: {
          concurrent_requests?: number | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          requests_per_minute?: number | null
          tier?: string
          tokens_per_day?: number | null
          tokens_per_minute?: number | null
          updated_at?: string | null
        }
        Update: {
          concurrent_requests?: number | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          requests_per_minute?: number | null
          tier?: string
          tokens_per_day?: number | null
          tokens_per_minute?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_rate_limits_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_models: {
        Row: {
          api_base_url: string | null
          api_key_secret_name: string | null
          api_name: string | null
          api_version: string | null
          auth_header: string | null
          auth_prefix: string | null
          context_window: number | null
          created_at: string | null
          default_max_tokens: number | null
          deprecation_date: string | null
          description: string | null
          extra_headers: Json | null
          id: string
          input_cost_per_1m: number | null
          is_active: boolean | null
          is_legacy: boolean | null
          max_output_tokens: number | null
          modalities: string[] | null
          model_family: string | null
          name: string
          output_cost_per_1m: number | null
          provider: string
          provider_id: string | null
          release_date: string | null
          supports_code_execution: boolean | null
          supports_extended_thinking: boolean | null
          supports_file_upload: boolean | null
          supports_frequency_penalty: boolean | null
          supports_image_generation: boolean | null
          supports_json_mode: boolean | null
          supports_logprobs: boolean | null
          supports_presence_penalty: boolean | null
          supports_reasoning: boolean | null
          supports_seed: boolean | null
          supports_stop_sequences: boolean | null
          supports_streaming: boolean | null
          supports_temperature: boolean | null
          supports_thinking_budget: boolean | null
          supports_tools: boolean | null
          supports_top_k: boolean | null
          supports_top_p: boolean | null
          supports_vision: boolean | null
          supports_web_search: boolean | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          api_base_url?: string | null
          api_key_secret_name?: string | null
          api_name?: string | null
          api_version?: string | null
          auth_header?: string | null
          auth_prefix?: string | null
          context_window?: number | null
          created_at?: string | null
          default_max_tokens?: number | null
          deprecation_date?: string | null
          description?: string | null
          extra_headers?: Json | null
          id?: string
          input_cost_per_1m?: number | null
          is_active?: boolean | null
          is_legacy?: boolean | null
          max_output_tokens?: number | null
          modalities?: string[] | null
          model_family?: string | null
          name: string
          output_cost_per_1m?: number | null
          provider: string
          provider_id?: string | null
          release_date?: string | null
          supports_code_execution?: boolean | null
          supports_extended_thinking?: boolean | null
          supports_file_upload?: boolean | null
          supports_frequency_penalty?: boolean | null
          supports_image_generation?: boolean | null
          supports_json_mode?: boolean | null
          supports_logprobs?: boolean | null
          supports_presence_penalty?: boolean | null
          supports_reasoning?: boolean | null
          supports_seed?: boolean | null
          supports_stop_sequences?: boolean | null
          supports_streaming?: boolean | null
          supports_temperature?: boolean | null
          supports_thinking_budget?: boolean | null
          supports_tools?: boolean | null
          supports_top_k?: boolean | null
          supports_top_p?: boolean | null
          supports_vision?: boolean | null
          supports_web_search?: boolean | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          api_base_url?: string | null
          api_key_secret_name?: string | null
          api_name?: string | null
          api_version?: string | null
          auth_header?: string | null
          auth_prefix?: string | null
          context_window?: number | null
          created_at?: string | null
          default_max_tokens?: number | null
          deprecation_date?: string | null
          description?: string | null
          extra_headers?: Json | null
          id?: string
          input_cost_per_1m?: number | null
          is_active?: boolean | null
          is_legacy?: boolean | null
          max_output_tokens?: number | null
          modalities?: string[] | null
          model_family?: string | null
          name?: string
          output_cost_per_1m?: number | null
          provider?: string
          provider_id?: string | null
          release_date?: string | null
          supports_code_execution?: boolean | null
          supports_extended_thinking?: boolean | null
          supports_file_upload?: boolean | null
          supports_frequency_penalty?: boolean | null
          supports_image_generation?: boolean | null
          supports_json_mode?: boolean | null
          supports_logprobs?: boolean | null
          supports_presence_penalty?: boolean | null
          supports_reasoning?: boolean | null
          supports_seed?: boolean | null
          supports_stop_sequences?: boolean | null
          supports_streaming?: boolean | null
          supports_temperature?: boolean | null
          supports_thinking_budget?: boolean | null
          supports_tools?: boolean | null
          supports_top_k?: boolean | null
          supports_top_p?: boolean | null
          supports_vision?: boolean | null
          supports_web_search?: boolean | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_config_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          config_id: string | null
          function_name: string
          id: string
          new_model: string | null
          new_prompt: string
          previous_model: string | null
          previous_prompt: string | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          config_id?: string | null
          function_name: string
          id?: string
          new_model?: string | null
          new_prompt: string
          previous_model?: string | null
          previous_prompt?: string | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          config_id?: string | null
          function_name?: string
          id?: string
          new_model?: string | null
          new_prompt?: string
          previous_model?: string | null
          previous_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_config_history_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_configs: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          enable_streaming: boolean | null
          fallback_model_id: string | null
          frequency_penalty: number | null
          function_name: string
          id: string
          is_active: boolean | null
          json_schema: Json | null
          max_tokens: number | null
          model_id: string | null
          model_name: string | null
          presence_penalty: number | null
          provider_id: string | null
          reasoning_effort: string | null
          response_format: string | null
          retry_count: number | null
          seed: number | null
          stop_sequences: string[] | null
          system_prompt: string
          temperature: number | null
          thinking_budget: number | null
          timeout_ms: number | null
          tools_enabled: boolean | null
          top_k: number | null
          top_p: number | null
          updated_at: string | null
          updated_by: string | null
          user_prompt_template: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          enable_streaming?: boolean | null
          fallback_model_id?: string | null
          frequency_penalty?: number | null
          function_name: string
          id?: string
          is_active?: boolean | null
          json_schema?: Json | null
          max_tokens?: number | null
          model_id?: string | null
          model_name?: string | null
          presence_penalty?: number | null
          provider_id?: string | null
          reasoning_effort?: string | null
          response_format?: string | null
          retry_count?: number | null
          seed?: number | null
          stop_sequences?: string[] | null
          system_prompt: string
          temperature?: number | null
          thinking_budget?: number | null
          timeout_ms?: number | null
          tools_enabled?: boolean | null
          top_k?: number | null
          top_p?: number | null
          updated_at?: string | null
          updated_by?: string | null
          user_prompt_template?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          enable_streaming?: boolean | null
          fallback_model_id?: string | null
          frequency_penalty?: number | null
          function_name?: string
          id?: string
          is_active?: boolean | null
          json_schema?: Json | null
          max_tokens?: number | null
          model_id?: string | null
          model_name?: string | null
          presence_penalty?: number | null
          provider_id?: string | null
          reasoning_effort?: string | null
          response_format?: string | null
          retry_count?: number | null
          seed?: number | null
          stop_sequences?: string[] | null
          system_prompt?: string
          temperature?: number | null
          thinking_budget?: number | null
          timeout_ms?: number | null
          tools_enabled?: boolean | null
          top_k?: number | null
          top_p?: number | null
          updated_at?: string | null
          updated_by?: string | null
          user_prompt_template?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_configs_fallback_model_id_fkey"
            columns: ["fallback_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_prompt_configs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_prompt_configs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          api_base_url: string
          api_key_secret_name: string
          api_version: string | null
          auth_header: string | null
          auth_prefix: string | null
          created_at: string | null
          default_timeout_ms: number | null
          display_name: string
          documentation_url: string | null
          extra_headers: Json | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          rate_limit_rpm: number | null
          rate_limit_tpm: number | null
          supports_batch: boolean | null
          supports_streaming: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_base_url: string
          api_key_secret_name: string
          api_version?: string | null
          auth_header?: string | null
          auth_prefix?: string | null
          created_at?: string | null
          default_timeout_ms?: number | null
          display_name: string
          documentation_url?: string | null
          extra_headers?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rate_limit_rpm?: number | null
          rate_limit_tpm?: number | null
          supports_batch?: boolean | null
          supports_streaming?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_base_url?: string
          api_key_secret_name?: string
          api_version?: string | null
          auth_header?: string | null
          auth_prefix?: string | null
          created_at?: string | null
          default_timeout_ms?: number | null
          display_name?: string
          documentation_url?: string | null
          extra_headers?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate_limit_rpm?: number | null
          rate_limit_tpm?: number | null
          supports_batch?: boolean | null
          supports_streaming?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_rads_logs: {
        Row: {
          created_at: string | null
          exam_title: string | null
          id: string
          input_size: number | null
          modality: string | null
          output_size: number | null
          raw_model_output: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          exam_title?: string | null
          id?: string
          input_size?: number | null
          modality?: string | null
          output_size?: number | null
          raw_model_output?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          exam_title?: string | null
          id?: string
          input_size?: number | null
          modality?: string | null
          output_size?: number | null
          raw_model_output?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_review_log: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          model: string
          response_size: number | null
          size: number
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          model?: string
          response_size?: number | null
          size: number
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          model?: string
          response_size?: number | null
          size?: number
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          ai_confidence: number | null
          ai_model: string
          ai_prompt: string | null
          applied_at: string | null
          applied_by: string | null
          context_after: string | null
          context_before: string | null
          created_at: string | null
          feedback_notes: string | null
          id: string
          metadata: Json | null
          original_text: string | null
          position_end: number | null
          position_start: number | null
          report_id: string
          report_version_id: string | null
          status: string | null
          suggestion_text: string
          suggestion_type: string
          updated_at: string | null
          user_feedback: string | null
        }
        Insert: {
          ai_confidence?: number | null
          ai_model: string
          ai_prompt?: string | null
          applied_at?: string | null
          applied_by?: string | null
          context_after?: string | null
          context_before?: string | null
          created_at?: string | null
          feedback_notes?: string | null
          id?: string
          metadata?: Json | null
          original_text?: string | null
          position_end?: number | null
          position_start?: number | null
          report_id: string
          report_version_id?: string | null
          status?: string | null
          suggestion_text: string
          suggestion_type: string
          updated_at?: string | null
          user_feedback?: string | null
        }
        Update: {
          ai_confidence?: number | null
          ai_model?: string
          ai_prompt?: string | null
          applied_at?: string | null
          applied_by?: string | null
          context_after?: string | null
          context_before?: string | null
          created_at?: string | null
          feedback_notes?: string | null
          id?: string
          metadata?: Json | null
          original_text?: string | null
          position_end?: number | null
          position_start?: number | null
          report_id?: string
          report_version_id?: string | null
          status?: string | null
          suggestion_text?: string
          suggestion_type?: string
          updated_at?: string | null
          user_feedback?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_report_version_id_fkey"
            columns: ["report_version_id"]
            isOneToOne: false
            referencedRelation: "report_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_templates: {
        Row: {
          ai_model: string | null
          ai_parameters: Json | null
          ai_prompt: string
          average_processing_time: number | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          slug: string
          status: string | null
          success_rate: number | null
          tags: string[] | null
          template_content: string
          updated_at: string | null
          updated_by: string | null
          usage_count: number | null
          validation_rules: Json | null
          variables: Json | null
          version: number | null
        }
        Insert: {
          ai_model?: string | null
          ai_parameters?: Json | null
          ai_prompt: string
          average_processing_time?: number | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          slug: string
          status?: string | null
          success_rate?: number | null
          tags?: string[] | null
          template_content: string
          updated_at?: string | null
          updated_by?: string | null
          usage_count?: number | null
          validation_rules?: Json | null
          variables?: Json | null
          version?: number | null
        }
        Update: {
          ai_model?: string | null
          ai_parameters?: Json | null
          ai_prompt?: string
          average_processing_time?: number | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          slug?: string
          status?: string | null
          success_rate?: number | null
          tags?: string[] | null
          template_content?: string
          updated_at?: string | null
          updated_by?: string | null
          usage_count?: number | null
          validation_rules?: Json | null
          variables?: Json | null
          version?: number | null
        }
        Relationships: []
      }
      ai_voice_logs: {
        Row: {
          action: string
          created_at: string
          field: string
          id: string
          raw_voice: string
          replacement: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          field: string
          id?: string
          raw_voice: string
          replacement?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          field?: string
          id?: string
          raw_voice?: string
          replacement?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auditoria_log: {
        Row: {
          acao: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          endereco_ip: unknown
          id: string
          registro_id: string
          tabela_nome: string
          timestamp: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          endereco_ip?: unknown
          id?: string
          registro_id: string
          tabela_nome: string
          timestamp?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          endereco_ip?: unknown
          id?: string
          registro_id?: string
          tabela_nome?: string
          timestamp?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      campos_medicoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          estrutura_anatomica_id: string | null
          id: string
          modalidade_id: string | null
          multiplo: boolean | null
          nome: string
          obrigatorio: boolean | null
          ordem: number | null
          regiao_anatomica_id: string | null
          tipo_medicao_id: string | null
          unidade: string | null
          updated_at: string | null
          validacoes: Json | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          estrutura_anatomica_id?: string | null
          id?: string
          modalidade_id?: string | null
          multiplo?: boolean | null
          nome: string
          obrigatorio?: boolean | null
          ordem?: number | null
          regiao_anatomica_id?: string | null
          tipo_medicao_id?: string | null
          unidade?: string | null
          updated_at?: string | null
          validacoes?: Json | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          estrutura_anatomica_id?: string | null
          id?: string
          modalidade_id?: string | null
          multiplo?: boolean | null
          nome?: string
          obrigatorio?: boolean | null
          ordem?: number | null
          regiao_anatomica_id?: string | null
          tipo_medicao_id?: string | null
          unidade?: string | null
          updated_at?: string | null
          validacoes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campos_medicoes_estrutura_anatomica_id_fkey"
            columns: ["estrutura_anatomica_id"]
            isOneToOne: false
            referencedRelation: "estruturas_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campos_medicoes_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campos_medicoes_regiao_anatomica_id_fkey"
            columns: ["regiao_anatomica_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campos_medicoes_tipo_medicao_id_fkey"
            columns: ["tipo_medicao_id"]
            isOneToOne: false
            referencedRelation: "tipos_medicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      classificacao_categorias: {
        Row: {
          ativa: boolean | null
          codigo: string
          cor_hex: string | null
          descricao: string | null
          id: string
          intervalo_seguimento: number | null
          nome: string
          prioridade: number | null
          recomendacao: string | null
          sistema_classificacao_id: string | null
        }
        Insert: {
          ativa?: boolean | null
          codigo: string
          cor_hex?: string | null
          descricao?: string | null
          id?: string
          intervalo_seguimento?: number | null
          nome: string
          prioridade?: number | null
          recomendacao?: string | null
          sistema_classificacao_id?: string | null
        }
        Update: {
          ativa?: boolean | null
          codigo?: string
          cor_hex?: string | null
          descricao?: string | null
          id?: string
          intervalo_seguimento?: number | null
          nome?: string
          prioridade?: number | null
          recomendacao?: string | null
          sistema_classificacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classificacao_categorias_sistema_classificacao_id_fkey"
            columns: ["sistema_classificacao_id"]
            isOneToOne: false
            referencedRelation: "sistemas_classificacao"
            referencedColumns: ["id"]
          },
        ]
      }
      conformidade_medica: {
        Row: {
          auditado_em: string | null
          auditor_id: string | null
          checklist_item: string
          conforme: boolean
          id: string
          laudo_id: string | null
          observacao: string | null
        }
        Insert: {
          auditado_em?: string | null
          auditor_id?: string | null
          checklist_item: string
          conforme: boolean
          id?: string
          laudo_id?: string | null
          observacao?: string | null
        }
        Update: {
          auditado_em?: string | null
          auditor_id?: string | null
          checklist_item?: string
          conforme?: boolean
          id?: string
          laudo_id?: string | null
          observacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conformidade_medica_laudo_id_fkey"
            columns: ["laudo_id"]
            isOneToOne: false
            referencedRelation: "laudos"
            referencedColumns: ["id"]
          },
        ]
      }
      dispositivos_offline: {
        Row: {
          created_at: string | null
          dados_offline: Json | null
          dispositivo_id: string
          id: string
          nome_dispositivo: string | null
          ultima_sincronizacao: string | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          dados_offline?: Json | null
          dispositivo_id: string
          id?: string
          nome_dispositivo?: string | null
          ultima_sincronizacao?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          dados_offline?: Json | null
          dispositivo_id?: string
          id?: string
          nome_dispositivo?: string | null
          ultima_sincronizacao?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      editor_sessions: {
        Row: {
          ai_suggestions_used: number | null
          auto_saves: number | null
          content_end: string | null
          content_start: string | null
          created_at: string | null
          device_info: Json | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          report_id: string | null
          session_end: string | null
          session_start: string | null
          total_edits: number | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
          voice_commands_used: number | null
        }
        Insert: {
          ai_suggestions_used?: number | null
          auto_saves?: number | null
          content_end?: string | null
          content_start?: string | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          report_id?: string | null
          session_end?: string | null
          session_start?: string | null
          total_edits?: number | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          voice_commands_used?: number | null
        }
        Update: {
          ai_suggestions_used?: number | null
          auto_saves?: number | null
          content_end?: string | null
          content_start?: string | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          report_id?: string | null
          session_end?: string | null
          session_start?: string | null
          total_edits?: number | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          voice_commands_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "editor_sessions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      editor_settings: {
        Row: {
          ai_auto_suggest: boolean | null
          ai_confidence_threshold: number | null
          ai_enabled: boolean | null
          auto_save_enabled: boolean | null
          auto_save_interval: number | null
          created_at: string | null
          font_family: string | null
          font_size: number | null
          id: string
          line_height: number | null
          metadata: Json | null
          preferred_ai_model: string | null
          theme: string | null
          updated_at: string | null
          user_id: string
          voice_auto_punctuation: boolean | null
          voice_enabled: boolean | null
          voice_language: string | null
          voice_sensitivity: number | null
        }
        Insert: {
          ai_auto_suggest?: boolean | null
          ai_confidence_threshold?: number | null
          ai_enabled?: boolean | null
          auto_save_enabled?: boolean | null
          auto_save_interval?: number | null
          created_at?: string | null
          font_family?: string | null
          font_size?: number | null
          id?: string
          line_height?: number | null
          metadata?: Json | null
          preferred_ai_model?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          voice_auto_punctuation?: boolean | null
          voice_enabled?: boolean | null
          voice_language?: string | null
          voice_sensitivity?: number | null
        }
        Update: {
          ai_auto_suggest?: boolean | null
          ai_confidence_threshold?: number | null
          ai_enabled?: boolean | null
          auto_save_enabled?: boolean | null
          auto_save_interval?: number | null
          created_at?: string | null
          font_family?: string | null
          font_size?: number | null
          id?: string
          line_height?: number | null
          metadata?: Json | null
          preferred_ai_model?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          voice_auto_punctuation?: boolean | null
          voice_enabled?: boolean | null
          voice_language?: string | null
          voice_sensitivity?: number | null
        }
        Relationships: []
      }
      estruturas_anatomicas: {
        Row: {
          ativa: boolean | null
          codigo: string
          created_at: string | null
          fma: string | null
          id: string
          modalidade_id: string | null
          nivel: string
          nome: string
          nome_comum: string | null
          parent_id: string | null
          regiao_anatomica_id: string | null
          snomed_ct: string | null
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          codigo: string
          created_at?: string | null
          fma?: string | null
          id?: string
          modalidade_id?: string | null
          nivel: string
          nome: string
          nome_comum?: string | null
          parent_id?: string | null
          regiao_anatomica_id?: string | null
          snomed_ct?: string | null
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          codigo?: string
          created_at?: string | null
          fma?: string | null
          id?: string
          modalidade_id?: string | null
          nivel?: string
          nome?: string
          nome_comum?: string | null
          parent_id?: string | null
          regiao_anatomica_id?: string | null
          snomed_ct?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estruturas_anatomicas_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estruturas_anatomicas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "estruturas_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estruturas_anatomicas_regiao_anatomica_id_fkey"
            columns: ["regiao_anatomica_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
        ]
      }
      frases_modelo: {
        Row: {
          ativa: boolean | null
          categoria: string | null
          codigo: string
          conclusao: string | null
          condicoes_logicas: Json | null
          created_at: string | null
          created_by: string | null
          estrutura_anatomica_id: string | null
          id: string
          indicacao_clinica: string | null
          modalidade_codigo: string | null
          modalidade_id: string | null
          observacao: string | null
          regiao_anatomica_id: string | null
          sinônimos: string[] | null
          tags: string[] | null
          tecnica: string | null
          texto: string
          tipo_template_id: string | null
          updated_at: string | null
          variaveis: Json | null
        }
        Insert: {
          ativa?: boolean | null
          categoria?: string | null
          codigo: string
          conclusao?: string | null
          condicoes_logicas?: Json | null
          created_at?: string | null
          created_by?: string | null
          estrutura_anatomica_id?: string | null
          id?: string
          indicacao_clinica?: string | null
          modalidade_codigo?: string | null
          modalidade_id?: string | null
          observacao?: string | null
          regiao_anatomica_id?: string | null
          sinônimos?: string[] | null
          tags?: string[] | null
          tecnica?: string | null
          texto: string
          tipo_template_id?: string | null
          updated_at?: string | null
          variaveis?: Json | null
        }
        Update: {
          ativa?: boolean | null
          categoria?: string | null
          codigo?: string
          conclusao?: string | null
          condicoes_logicas?: Json | null
          created_at?: string | null
          created_by?: string | null
          estrutura_anatomica_id?: string | null
          id?: string
          indicacao_clinica?: string | null
          modalidade_codigo?: string | null
          modalidade_id?: string | null
          observacao?: string | null
          regiao_anatomica_id?: string | null
          sinônimos?: string[] | null
          tags?: string[] | null
          tecnica?: string | null
          texto?: string
          tipo_template_id?: string | null
          updated_at?: string | null
          variaveis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_frases_modelo_modalidade_codigo"
            columns: ["modalidade_codigo"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "frases_modelo_estrutura_anatomica_id_fkey"
            columns: ["estrutura_anatomica_id"]
            isOneToOne: false
            referencedRelation: "estruturas_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frases_modelo_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frases_modelo_regiao_anatomica_id_fkey"
            columns: ["regiao_anatomica_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frases_modelo_tipo_template_id_fkey"
            columns: ["tipo_template_id"]
            isOneToOne: false
            referencedRelation: "tipos_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      laudo_secoes: {
        Row: {
          codigo: string
          conteudo: string
          created_at: string | null
          id: string
          laudo_id: string | null
          multipla_instancia: number | null
          nivel: number | null
          ordem: number
          parent_id: string | null
          template_secao_id: string | null
          titulo: string
        }
        Insert: {
          codigo: string
          conteudo: string
          created_at?: string | null
          id?: string
          laudo_id?: string | null
          multipla_instancia?: number | null
          nivel?: number | null
          ordem: number
          parent_id?: string | null
          template_secao_id?: string | null
          titulo: string
        }
        Update: {
          codigo?: string
          conteudo?: string
          created_at?: string | null
          id?: string
          laudo_id?: string | null
          multipla_instancia?: number | null
          nivel?: number | null
          ordem?: number
          parent_id?: string | null
          template_secao_id?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "laudo_secoes_laudo_id_fkey"
            columns: ["laudo_id"]
            isOneToOne: false
            referencedRelation: "laudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laudo_secoes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "laudo_secoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laudo_secoes_template_secao_id_fkey"
            columns: ["template_secao_id"]
            isOneToOne: false
            referencedRelation: "template_secoes"
            referencedColumns: ["id"]
          },
        ]
      }
      laudos: {
        Row: {
          assinado_digitalmente: boolean | null
          conteudo: string
          conteudo_estruturado: Json | null
          created_at: string | null
          data_revisao: string | null
          exame_data: string
          exame_tipo: string
          hospital_nome: string | null
          hospital_setor: string | null
          id: string
          medico_laudador: string | null
          medico_solicitante: string | null
          modalidade_id: string | null
          numero_laudo: string
          paciente_idade: number | null
          paciente_nome: string
          paciente_sexo: string | null
          regiao_anatomica_id: string | null
          revisado_por: string | null
          status: string | null
          template_utilizado_id: string | null
          updated_at: string | null
        }
        Insert: {
          assinado_digitalmente?: boolean | null
          conteudo: string
          conteudo_estruturado?: Json | null
          created_at?: string | null
          data_revisao?: string | null
          exame_data: string
          exame_tipo: string
          hospital_nome?: string | null
          hospital_setor?: string | null
          id?: string
          medico_laudador?: string | null
          medico_solicitante?: string | null
          modalidade_id?: string | null
          numero_laudo: string
          paciente_idade?: number | null
          paciente_nome: string
          paciente_sexo?: string | null
          regiao_anatomica_id?: string | null
          revisado_por?: string | null
          status?: string | null
          template_utilizado_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assinado_digitalmente?: boolean | null
          conteudo?: string
          conteudo_estruturado?: Json | null
          created_at?: string | null
          data_revisao?: string | null
          exame_data?: string
          exame_tipo?: string
          hospital_nome?: string | null
          hospital_setor?: string | null
          id?: string
          medico_laudador?: string | null
          medico_solicitante?: string | null
          modalidade_id?: string | null
          numero_laudo?: string
          paciente_idade?: number | null
          paciente_nome?: string
          paciente_sexo?: string | null
          regiao_anatomica_id?: string | null
          revisado_por?: string | null
          status?: string | null
          template_utilizado_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laudos_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laudos_regiao_anatomica_id_fkey"
            columns: ["regiao_anatomica_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laudos_template_utilizado_id_fkey"
            columns: ["template_utilizado_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_audio_sessions: {
        Row: {
          bytes_transferred: number | null
          connected_at: string | null
          created_at: string | null
          desktop_ip: unknown
          device_fingerprint: string | null
          device_info: Json | null
          ended_at: string | null
          error_count: number | null
          expires_at: string | null
          id: string
          last_heartbeat: string | null
          mobile_ip: unknown
          mode: string | null
          paired_at: string | null
          pairing_expires_at: string | null
          session_token: string
          status: string | null
          temp_jwt: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          bytes_transferred?: number | null
          connected_at?: string | null
          created_at?: string | null
          desktop_ip?: unknown
          device_fingerprint?: string | null
          device_info?: Json | null
          ended_at?: string | null
          error_count?: number | null
          expires_at?: string | null
          id?: string
          last_heartbeat?: string | null
          mobile_ip?: unknown
          mode?: string | null
          paired_at?: string | null
          pairing_expires_at?: string | null
          session_token: string
          status?: string | null
          temp_jwt?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          bytes_transferred?: number | null
          connected_at?: string | null
          created_at?: string | null
          desktop_ip?: unknown
          device_fingerprint?: string | null
          device_info?: Json | null
          ended_at?: string | null
          error_count?: number | null
          expires_at?: string | null
          id?: string
          last_heartbeat?: string | null
          mobile_ip?: unknown
          mode?: string | null
          paired_at?: string | null
          pairing_expires_at?: string | null
          session_token?: string
          status?: string | null
          temp_jwt?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mobile_session_rate_limit: {
        Row: {
          attempts: number | null
          blocked_until: string | null
          ip: unknown
          last_attempt: string | null
        }
        Insert: {
          attempts?: number | null
          blocked_until?: string | null
          ip: unknown
          last_attempt?: string | null
        }
        Update: {
          attempts?: number | null
          blocked_until?: string | null
          ip?: unknown
          last_attempt?: string | null
        }
        Relationships: []
      }
      modalidades: {
        Row: {
          ativa: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      plan_feature_assignments: {
        Row: {
          created_at: string | null
          custom_text: string | null
          display_order: number | null
          feature_id: string
          id: string
          is_included: boolean | null
          plan_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_text?: string | null
          display_order?: number | null
          feature_id: string
          id?: string
          is_included?: boolean | null
          plan_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_text?: string | null
          display_order?: number | null
          feature_id?: string
          id?: string
          is_included?: boolean | null
          plan_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_feature_assignments_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "plan_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_feature_assignments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_name: string
          display_order: number | null
          dynamic_field: string | null
          dynamic_suffix: string | null
          feature_key: string
          icon: string | null
          id: string
          is_active: boolean | null
          is_dynamic: boolean | null
          is_primary: boolean | null
          show_in_card: boolean | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          display_order?: number | null
          dynamic_field?: string | null
          dynamic_suffix?: string | null
          feature_key: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_dynamic?: boolean | null
          is_primary?: boolean | null
          show_in_card?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          display_order?: number | null
          dynamic_field?: string | null
          dynamic_suffix?: string | null
          feature_key?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_dynamic?: boolean | null
          is_primary?: boolean | null
          show_in_card?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_metrics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          last_calculated_at: string | null
          metric_key: string
          metric_value: number
          source: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_calculated_at?: string | null
          metric_key: string
          metric_value?: number
          source?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          last_calculated_at?: string | null
          metric_key?: string
          metric_value?: number
          source?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          crm: string | null
          full_name: string | null
          id: string
          institution: string | null
          specialty: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          crm?: string | null
          full_name?: string | null
          id: string
          institution?: string | null
          specialty?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          crm?: string | null
          full_name?: string | null
          id?: string
          institution?: string | null
          specialty?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rads_text_options: {
        Row: {
          ativo: boolean | null
          birads_associado: string | null
          categoria: string
          created_at: string | null
          id: string
          label: string
          ordem: number | null
          pontos: number | null
          sistema_codigo: string
          suspeicao: string | null
          texto: string
          updated_at: string | null
          usa_lado: boolean | null
          usa_meses: boolean | null
          valor: string
          variaveis: Json | null
        }
        Insert: {
          ativo?: boolean | null
          birads_associado?: string | null
          categoria: string
          created_at?: string | null
          id?: string
          label: string
          ordem?: number | null
          pontos?: number | null
          sistema_codigo: string
          suspeicao?: string | null
          texto?: string
          updated_at?: string | null
          usa_lado?: boolean | null
          usa_meses?: boolean | null
          valor: string
          variaveis?: Json | null
        }
        Update: {
          ativo?: boolean | null
          birads_associado?: string | null
          categoria?: string
          created_at?: string | null
          id?: string
          label?: string
          ordem?: number | null
          pontos?: number | null
          sistema_codigo?: string
          suspeicao?: string | null
          texto?: string
          updated_at?: string | null
          usa_lado?: boolean | null
          usa_meses?: boolean | null
          valor?: string
          variaveis?: Json | null
        }
        Relationships: []
      }
      regioes_anatomicas: {
        Row: {
          ativa: boolean | null
          codigo: string
          created_at: string | null
          fma: string | null
          id: string
          modalidade_id: string | null
          nivel: number | null
          nome: string
          parent_id: string | null
          snomed_ct: string | null
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          codigo: string
          created_at?: string | null
          fma?: string | null
          id?: string
          modalidade_id?: string | null
          nivel?: number | null
          nome: string
          parent_id?: string | null
          snomed_ct?: string | null
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          codigo?: string
          created_at?: string | null
          fma?: string | null
          id?: string
          modalidade_id?: string | null
          nivel?: number | null
          nome?: string
          parent_id?: string | null
          snomed_ct?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regioes_anatomicas_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regioes_anatomicas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
        ]
      }
      report_versions: {
        Row: {
          ai_corrections: Json | null
          ai_suggestions: Json | null
          change_reason: string | null
          change_summary: string | null
          content: string
          content_diff: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          metadata: Json | null
          report_id: string
          structured_content: Json | null
          version_number: number
          version_type: string | null
          voice_transcription: Json | null
        }
        Insert: {
          ai_corrections?: Json | null
          ai_suggestions?: Json | null
          change_reason?: string | null
          change_summary?: string | null
          content: string
          content_diff?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          report_id: string
          structured_content?: Json | null
          version_number: number
          version_type?: string | null
          voice_transcription?: Json | null
        }
        Update: {
          ai_corrections?: Json | null
          ai_suggestions?: Json | null
          change_reason?: string | null
          change_summary?: string | null
          content?: string
          content_diff?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          report_id?: string
          structured_content?: Json | null
          version_number?: number
          version_type?: string | null
          voice_transcription?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "report_versions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          ai_assisted: boolean | null
          ai_suggestions_applied: Json | null
          auto_save_count: number | null
          completed_at: string | null
          content: string
          created_at: string | null
          created_by: string | null
          description: string | null
          editing_time: number | null
          exam_date: string | null
          exam_type: string
          id: string
          is_current_version: boolean | null
          metadata: Json | null
          parent_report_id: string | null
          priority: string | null
          report_number: string
          status: string | null
          structured_content: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version: number | null
          voice_transcribed: boolean | null
        }
        Insert: {
          ai_assisted?: boolean | null
          ai_suggestions_applied?: Json | null
          auto_save_count?: number | null
          completed_at?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          editing_time?: number | null
          exam_date?: string | null
          exam_type: string
          id?: string
          is_current_version?: boolean | null
          metadata?: Json | null
          parent_report_id?: string | null
          priority?: string | null
          report_number: string
          status?: string | null
          structured_content?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
          voice_transcribed?: boolean | null
        }
        Update: {
          ai_assisted?: boolean | null
          ai_suggestions_applied?: Json | null
          auto_save_count?: number | null
          completed_at?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          editing_time?: number | null
          exam_date?: string | null
          exam_type?: string
          id?: string
          is_current_version?: boolean | null
          metadata?: Json | null
          parent_report_id?: string | null
          priority?: string | null
          report_number?: string
          status?: string | null
          structured_content?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
          voice_transcribed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_parent_report_id_fkey"
            columns: ["parent_report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      sistemas_classificacao: {
        Row: {
          ano_publicacao: number | null
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: string
          modalidade_id: string | null
          nome: string
          regiao_anatomica_id: string | null
          versao: string | null
        }
        Insert: {
          ano_publicacao?: number | null
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          modalidade_id?: string | null
          nome: string
          regiao_anatomica_id?: string | null
          versao?: string | null
        }
        Update: {
          ano_publicacao?: number | null
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          modalidade_id?: string | null
          nome?: string
          regiao_anatomica_id?: string | null
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sistemas_classificacao_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sistemas_classificacao_regiao_anatomica_id_fkey"
            columns: ["regiao_anatomica_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          stripe_customer_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          stripe_customer_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          stripe_customer_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_events_log: {
        Row: {
          ai_tokens_granted: number | null
          credits_error: string | null
          credits_renewed: boolean | null
          event_data: Json | null
          event_type: string
          id: string
          processed_at: string | null
          stripe_event_id: string | null
          subscription_id: string | null
          user_id: string | null
          whisper_credits_granted: number | null
        }
        Insert: {
          ai_tokens_granted?: number | null
          credits_error?: string | null
          credits_renewed?: boolean | null
          event_data?: Json | null
          event_type: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
          whisper_credits_granted?: number | null
        }
        Update: {
          ai_tokens_granted?: number | null
          credits_error?: string | null
          credits_renewed?: boolean | null
          event_data?: Json | null
          event_type?: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
          whisper_credits_granted?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          ai_tokens_monthly: number
          badge: string | null
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          feature_ai_chat: boolean | null
          feature_ai_conclusion: boolean | null
          feature_ai_rads: boolean | null
          feature_ai_suggestions: boolean | null
          feature_export: boolean | null
          feature_priority_support: boolean | null
          feature_templates: boolean | null
          feature_voice_dictation: boolean | null
          feature_whisper: boolean | null
          id: string
          is_active: boolean | null
          is_highlighted: boolean | null
          name: string
          updated_at: string | null
          whisper_credits_monthly: number
        }
        Insert: {
          ai_tokens_monthly?: number
          badge?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          feature_ai_chat?: boolean | null
          feature_ai_conclusion?: boolean | null
          feature_ai_rads?: boolean | null
          feature_ai_suggestions?: boolean | null
          feature_export?: boolean | null
          feature_priority_support?: boolean | null
          feature_templates?: boolean | null
          feature_voice_dictation?: boolean | null
          feature_whisper?: boolean | null
          id?: string
          is_active?: boolean | null
          is_highlighted?: boolean | null
          name: string
          updated_at?: string | null
          whisper_credits_monthly?: number
        }
        Update: {
          ai_tokens_monthly?: number
          badge?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          feature_ai_chat?: boolean | null
          feature_ai_conclusion?: boolean | null
          feature_ai_rads?: boolean | null
          feature_ai_suggestions?: boolean | null
          feature_export?: boolean | null
          feature_priority_support?: boolean | null
          feature_templates?: boolean | null
          feature_voice_dictation?: boolean | null
          feature_whisper?: boolean | null
          id?: string
          is_active?: boolean | null
          is_highlighted?: boolean | null
          name?: string
          updated_at?: string | null
          whisper_credits_monthly?: number
        }
        Relationships: []
      }
      subscription_prices: {
        Row: {
          amount_cents: number
          amount_cents_annual: number | null
          created_at: string | null
          currency: string | null
          id: string
          interval: string | null
          interval_count: number | null
          is_active: boolean | null
          plan_id: string | null
          stripe_price_id: string | null
          stripe_price_id_annual: string | null
          stripe_price_id_annual_live: string | null
          stripe_price_id_annual_test: string | null
          stripe_price_id_live: string | null
          stripe_price_id_test: string | null
          stripe_product_id: string | null
          stripe_product_id_live: string | null
          stripe_product_id_test: string | null
          updated_at: string | null
        }
        Insert: {
          amount_cents: number
          amount_cents_annual?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          is_active?: boolean | null
          plan_id?: string | null
          stripe_price_id?: string | null
          stripe_price_id_annual?: string | null
          stripe_price_id_annual_live?: string | null
          stripe_price_id_annual_test?: string | null
          stripe_price_id_live?: string | null
          stripe_price_id_test?: string | null
          stripe_product_id?: string | null
          stripe_product_id_live?: string | null
          stripe_product_id_test?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_cents?: number
          amount_cents_annual?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          is_active?: boolean | null
          plan_id?: string | null
          stripe_price_id?: string | null
          stripe_price_id_annual?: string | null
          stripe_price_id_annual_live?: string | null
          stripe_price_id_annual_test?: string | null
          stripe_price_id_live?: string | null
          stripe_price_id_test?: string | null
          stripe_product_id?: string | null
          stripe_product_id_live?: string | null
          stripe_product_id_test?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_prices_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_controle: {
        Row: {
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          dispositivo_id: string | null
          id: string
          operacao: string
          registro_id: string
          sincronizado: boolean | null
          tabela_nome: string
          versao_local: number | null
          versao_nuvem: number | null
        }
        Insert: {
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          dispositivo_id?: string | null
          id?: string
          operacao: string
          registro_id: string
          sincronizado?: boolean | null
          tabela_nome: string
          versao_local?: number | null
          versao_nuvem?: number | null
        }
        Update: {
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          dispositivo_id?: string | null
          id?: string
          operacao?: string
          registro_id?: string
          sincronizado?: boolean | null
          tabela_nome?: string
          versao_local?: number | null
          versao_nuvem?: number | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      system_templates: {
        Row: {
          achados: string
          adicionais: string | null
          ativo: boolean | null
          categoria: string | null
          codigo: string
          condicoes_logicas: Json | null
          conteudo_template: string | null
          created_at: string | null
          id: string
          impressao: string
          indicacao_clinica: string | null
          modalidade_codigo: string
          regiao_codigo: string
          tags: string[] | null
          tecnica: Json
          tecnica_config: Json | null
          titulo: string
          updated_at: string | null
          variaveis: Json | null
          version: number | null
        }
        Insert: {
          achados: string
          adicionais?: string | null
          ativo?: boolean | null
          categoria?: string | null
          codigo: string
          condicoes_logicas?: Json | null
          conteudo_template?: string | null
          created_at?: string | null
          id?: string
          impressao: string
          indicacao_clinica?: string | null
          modalidade_codigo: string
          regiao_codigo: string
          tags?: string[] | null
          tecnica: Json
          tecnica_config?: Json | null
          titulo: string
          updated_at?: string | null
          variaveis?: Json | null
          version?: number | null
        }
        Update: {
          achados?: string
          adicionais?: string | null
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string
          condicoes_logicas?: Json | null
          conteudo_template?: string | null
          created_at?: string | null
          id?: string
          impressao?: string
          indicacao_clinica?: string | null
          modalidade_codigo?: string
          regiao_codigo?: string
          tags?: string[] | null
          tecnica?: Json
          tecnica_config?: Json | null
          titulo?: string
          updated_at?: string | null
          variaveis?: Json | null
          version?: number | null
        }
        Relationships: []
      }
      template_secoes: {
        Row: {
          codigo: string
          condicoes_logicas: Json | null
          conteudo_template: string | null
          created_at: string | null
          id: string
          multipla: boolean | null
          nivel: number | null
          obrigatoria: boolean | null
          ordem: number
          parent_id: string | null
          template_id: string | null
          titulo: string
          updated_at: string | null
          variaveis: Json | null
        }
        Insert: {
          codigo: string
          condicoes_logicas?: Json | null
          conteudo_template?: string | null
          created_at?: string | null
          id?: string
          multipla?: boolean | null
          nivel?: number | null
          obrigatoria?: boolean | null
          ordem: number
          parent_id?: string | null
          template_id?: string | null
          titulo: string
          updated_at?: string | null
          variaveis?: Json | null
        }
        Update: {
          codigo?: string
          condicoes_logicas?: Json | null
          conteudo_template?: string | null
          created_at?: string | null
          id?: string
          multipla?: boolean | null
          nivel?: number | null
          obrigatoria?: boolean | null
          ordem?: number
          parent_id?: string | null
          template_id?: string | null
          titulo?: string
          updated_at?: string | null
          variaveis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "template_secoes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "template_secoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_secoes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          ativo: boolean | null
          codigo: string
          condicoes_logicas: Json | null
          conteudo_template: string
          created_at: string | null
          created_by: string | null
          descricao: string | null
          estrutura_anatomica_id: string | null
          guideline_categoria: string | null
          guideline_referencia: string | null
          id: string
          modalidade_id: string | null
          regiao_anatomica_id: string | null
          tipo_template_id: string | null
          titulo: string
          updated_at: string | null
          variaveis: Json | null
          version: number | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          condicoes_logicas?: Json | null
          conteudo_template: string
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          estrutura_anatomica_id?: string | null
          guideline_categoria?: string | null
          guideline_referencia?: string | null
          id?: string
          modalidade_id?: string | null
          regiao_anatomica_id?: string | null
          tipo_template_id?: string | null
          titulo: string
          updated_at?: string | null
          variaveis?: Json | null
          version?: number | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          condicoes_logicas?: Json | null
          conteudo_template?: string
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          estrutura_anatomica_id?: string | null
          guideline_categoria?: string | null
          guideline_referencia?: string | null
          id?: string
          modalidade_id?: string | null
          regiao_anatomica_id?: string | null
          tipo_template_id?: string | null
          titulo?: string
          updated_at?: string | null
          variaveis?: Json | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_estrutura_anatomica_id_fkey"
            columns: ["estrutura_anatomica_id"]
            isOneToOne: false
            referencedRelation: "estruturas_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_regiao_anatomica_id_fkey"
            columns: ["regiao_anatomica_id"]
            isOneToOne: false
            referencedRelation: "regioes_anatomicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_tipo_template_id_fkey"
            columns: ["tipo_template_id"]
            isOneToOne: false
            referencedRelation: "tipos_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_laudos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          id: number
          modalidade: string
          regiao: string
          template: string
          titulo: string
          variaveis: string[] | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          id?: number
          modalidade: string
          regiao: string
          template: string
          titulo: string
          variaveis?: string[] | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          id?: number
          modalidade?: string
          regiao?: string
          template?: string
          titulo?: string
          variaveis?: string[] | null
        }
        Relationships: []
      }
      tipos_medicoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          formula_calculo: string | null
          id: string
          maximo: number | null
          minimo: number | null
          nome: string
          precisao: number | null
          tipo_dado: string
          unidade_padrao: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          formula_calculo?: string | null
          id?: string
          maximo?: number | null
          minimo?: number | null
          nome: string
          precisao?: number | null
          tipo_dado: string
          unidade_padrao: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          formula_calculo?: string | null
          id?: string
          maximo?: number | null
          minimo?: number | null
          nome?: string
          precisao?: number | null
          tipo_dado?: string
          unidade_padrao?: string
        }
        Relationships: []
      }
      tipos_templates: {
        Row: {
          codigo: string
          cor_hex: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          prioridade: number | null
        }
        Insert: {
          codigo: string
          cor_hex?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          prioridade?: number | null
        }
        Update: {
          codigo?: string
          cor_hex?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          prioridade?: number | null
        }
        Relationships: []
      }
      user_ai_balance: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          monthly_limit: number | null
          plan_expires_at: string | null
          plan_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          monthly_limit?: number | null
          plan_expires_at?: string | null
          plan_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          monthly_limit?: number | null
          plan_expires_at?: string | null
          plan_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_calculator_usage: {
        Row: {
          calculator_id: string
          id: string
          usage_count: number | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          calculator_id: string
          id?: string
          usage_count?: number | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          calculator_id?: string
          id?: string
          usage_count?: number | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_dictionary: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          word: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          word: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          word?: string
        }
        Relationships: []
      }
      user_favorite_calculators: {
        Row: {
          calculator_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          calculator_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          calculator_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_frases: {
        Row: {
          created_at: string | null
          frase_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frase_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          frase_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_frases_frase_id_fkey"
            columns: ["frase_id"]
            isOneToOne: false
            referencedRelation: "frases_modelo"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_tables: {
        Row: {
          created_at: string | null
          id: string
          table_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          table_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          table_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_templates: {
        Row: {
          created_at: string | null
          id: string
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "system_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "system_templates_filters_v"
            referencedColumns: ["id"]
          },
        ]
      }
      user_frase_usage: {
        Row: {
          frase_id: string
          id: string
          report_id: string | null
          usage_count: number | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          frase_id: string
          id?: string
          report_id?: string | null
          usage_count?: number | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          frase_id?: string
          id?: string
          report_id?: string | null
          usage_count?: number | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_frase_usage_frase_id_fkey"
            columns: ["frase_id"]
            isOneToOne: false
            referencedRelation: "frases_modelo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_frase_usage_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          plan_id: string | null
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "subscription_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_table_usage: {
        Row: {
          id: string
          table_id: string
          usage_count: number | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          table_id: string
          usage_count?: number | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          table_id?: string
          usage_count?: number | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_template_usage: {
        Row: {
          id: string
          report_id: string | null
          template_id: string
          usage_count: number | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          report_id?: string | null
          template_id: string
          usage_count?: number | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          report_id?: string | null
          template_id?: string
          usage_count?: number | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_template_usage_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_template_usage_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "system_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_template_usage_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "system_templates_filters_v"
            referencedColumns: ["id"]
          },
        ]
      }
      user_whisper_balance: {
        Row: {
          balance: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_commands: {
        Row: {
          ai_model: string | null
          ai_processing_time: number | null
          ai_response: string | null
          applied_changes: Json | null
          audio_data: string | null
          audio_duration: number | null
          audio_format: string | null
          audio_size: number | null
          audio_url: string | null
          command_parameters: Json | null
          command_type: string | null
          completed_at: string | null
          confidence_score: number | null
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          original_text: string
          processed_at: string | null
          processed_command: string | null
          report_id: string | null
          success: boolean | null
          transcribed_text: string
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_processing_time?: number | null
          ai_response?: string | null
          applied_changes?: Json | null
          audio_data?: string | null
          audio_duration?: number | null
          audio_format?: string | null
          audio_size?: number | null
          audio_url?: string | null
          command_parameters?: Json | null
          command_type?: string | null
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          original_text: string
          processed_at?: string | null
          processed_command?: string | null
          report_id?: string | null
          success?: boolean | null
          transcribed_text: string
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_processing_time?: number | null
          ai_response?: string | null
          applied_changes?: Json | null
          audio_data?: string | null
          audio_duration?: number | null
          audio_format?: string | null
          audio_size?: number | null
          audio_url?: string | null
          command_parameters?: Json | null
          command_type?: string | null
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          original_text?: string
          processed_at?: string | null
          processed_command?: string | null
          report_id?: string | null
          success?: boolean | null
          transcribed_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_commands_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      whisper_credits_ledger: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      whisper_usage_log: {
        Row: {
          audio_duration_seconds: number
          audio_size_bytes: number | null
          created_at: string
          credits_consumed: number
          error_message: string | null
          id: string
          metadata: Json | null
          transcription_status: string
          user_id: string
        }
        Insert: {
          audio_duration_seconds: number
          audio_size_bytes?: number | null
          created_at?: string
          credits_consumed: number
          error_message?: string | null
          id?: string
          metadata?: Json | null
          transcription_status: string
          user_id: string
        }
        Update: {
          audio_duration_seconds?: number
          audio_size_bytes?: number | null
          created_at?: string
          credits_consumed?: number
          error_message?: string | null
          id?: string
          metadata?: Json | null
          transcription_status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      system_templates_filters_v: {
        Row: {
          ativo: boolean | null
          codigo: string | null
          id: string | null
          modalidade_codigo: string | null
          regiao_codigo: string | null
          tags: string[] | null
          titulo: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo?: string | null
          id?: string | null
          modalidade_codigo?: string | null
          regiao_codigo?: string | null
          tags?: string[] | null
          titulo?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string | null
          id?: string | null
          modalidade_codigo?: string | null
          regiao_codigo?: string | null
          tags?: string[] | null
          titulo?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_whisper_credits: {
        Args: {
          p_credits_to_add: number
          p_description?: string
          p_metadata?: Json
          p_transaction_type?: string
          p_user_id: string
        }
        Returns: {
          balance_after: number
          message: string
          success: boolean
        }[]
      }
      aplicar_template_lombar: {
        Args: { template_nome: string; variaveis: Json }
        Returns: string
      }
      auto_save_report: {
        Args: { p_content: string; p_report_id: string; p_user_id: string }
        Returns: undefined
      }
      build_ai_request: {
        Args: { fn_name: string; user_data: Json }
        Returns: Json
      }
      check_ai_credits: {
        Args: { p_user_id: string }
        Returns: {
          balance: number
          monthly_limit: number
          plan_type: string
        }[]
      }
      cleanup_orphan_mobile_sessions: { Args: never; Returns: number }
      conclusao_angio_rm_cervical: {
        Args: {
          achados_adicionais?: string
          achados_principais?: string[]
          comparativo_exames_anteriores?: string
          complicacoes?: boolean
          conclusao_final?: string
          gravidade_achados?: string
          intervalo_seguimento?: string
          necessita_tratamento?: boolean
          prognostico?: string
          seguimento?: string
          tipo_complicacao?: string
          tipo_tratamento?: string
        }
        Returns: string
      }
      conclusao_angio_rm_intracraniana: {
        Args: {
          achados_significativos?: boolean
          microangiopatia?: boolean
          microangiopatia_grau?: string
          reducao_volumetrica?: boolean
          reducao_volumetrica_grau?: string
          tipo_achado?: string
        }
        Returns: string
      }
      consume_ai_credits: {
        Args: {
          p_credits_to_consume: number
          p_description?: string
          p_feature_used?: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: {
          balance_after: number
          message: string
          success: boolean
        }[]
      }
      consume_whisper_credits: {
        Args: {
          p_credits_to_consume: number
          p_description?: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: {
          balance_after: number
          message: string
          success: boolean
        }[]
      }
      converter_posicao_para_quadrante: {
        Args: { lateralidade: string; posicao_horas: number }
        Returns: string
      }
      determinar_idade_trombose: {
        Args: {
          compressibilidade: string
          ecogenicidade: string
          paredes: string
          recanalizacao: string
        }
        Returns: string
      }
      determinar_nivel_cervical: {
        Args: { localizacao: string; referencia_anatomica: string }
        Returns: string
      }
      get_platform_metrics: { Args: never; Returns: Json }
      get_user_subscription_status: {
        Args: { p_user_id: string }
        Returns: {
          ai_tokens_monthly: number
          cancel_at_period_end: boolean
          current_period_end: string
          plan_code: string
          plan_name: string
          status: string
          whisper_credits_monthly: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      inserir_frase_unica: {
        Args: {
          p_categoria?: string
          p_codigo: string
          p_condicoes_logicas?: Json
          p_estrutura_anatomica_id: string
          p_modalidade_id: string
          p_regiao_anatomica_id: string
          p_sinonimos?: string[]
          p_tags?: string[]
          p_texto: string
          p_tipo_template_id: string
          p_variaveis?: Json
        }
        Returns: {
          frase_id: string
          mensagem: string
          sucesso: boolean
        }[]
      }
      inserir_template_unico: {
        Args: {
          p_codigo: string
          p_condicoes_logicas?: Json
          p_conteudo_template: string
          p_descricao: string
          p_estrutura_anatomica_id: string
          p_guideline_categoria?: string
          p_guideline_referencia?: string
          p_modalidade_id: string
          p_regiao_anatomica_id: string
          p_tipo_template_id: string
          p_titulo: string
          p_variaveis?: Json
        }
        Returns: {
          mensagem: string
          sucesso: boolean
          template_id: string
        }[]
      }
      interpretar_doppler_aorta_iliaca: {
        Args: {
          grau_ateromatose?: string
          presenca_aneurisma?: boolean
          presenca_dissecao?: boolean
          presenca_estenose?: boolean
          presenca_trombose?: boolean
        }
        Returns: string
      }
      interpretar_doppler_membros_inferiores: {
        Args: {
          itb_direito?: number
          itb_esquerdo?: number
          presenca_estenose?: boolean
          presenca_oclusao?: boolean
        }
        Returns: string
      }
      interpretar_doppler_venoso_tvp: {
        Args: {
          achados_adicionais?: string[]
          bilateral: boolean
          extensao: string
          recanalizacao: string
          veias_afetadas: string[]
        }
        Returns: string
      }
      interpretar_quadril_infantil: {
        Args: {
          achado_acetabulo?: string
          achado_cabeca?: string
          achado_labio?: string
          achado_promontorio?: string
          angulo_alfa: number
          angulo_beta: number
          idade_meses: number
        }
        Returns: string
      }
      localizacao_anatomica_cotovelo: {
        Args: { estrutura: string; lado: string }
        Returns: string
      }
      localizacao_anatomica_joelho: {
        Args: { detalhe?: string; estrutura: string; lado?: string }
        Returns: string
      }
      localizacao_anatomica_ombro: {
        Args: { localizacao?: string }
        Returns: string
      }
      localizacao_anatomica_pe: {
        Args: { localizacao?: string }
        Returns: string
      }
      localizacao_anatomica_punho: {
        Args: { localizacao?: string }
        Returns: string
      }
      localizacao_anatomica_quadril: {
        Args: { estrutura: string; lado?: string }
        Returns: string
      }
      localizacao_anatomica_tornozelo: {
        Args: { localizacao?: string }
        Returns: string
      }
      localizar_estenose: {
        Args: {
          artéria?: string
          grau?: string
          lado?: string
          percentual?: string
          segmento?: string
        }
        Returns: string
      }
      localizar_oclusão: {
        Args: {
          artéria?: string
          grau?: string
          lado?: string
          segmento?: string
        }
        Returns: string
      }
      medir_diastase_reto: { Args: never; Returns: number }
      medir_distancia_pele_universal: { Args: never; Returns: number }
      medir_espessura_partes_moles: { Args: never; Returns: number }
      medir_espessura_pele: { Args: never; Returns: number }
      medir_espessura_subcutaneo: { Args: never; Returns: number }
      nome_articulacao_pe: { Args: { articulacao?: string }; Returns: string }
      nome_articulacao_punho: {
        Args: { articulacao?: string }
        Returns: string
      }
      obter_categoria_tirads: { Args: { pontuacao: number }; Returns: string }
      obter_recomendacao_tirads: {
        Args: { categoria: string }
        Returns: string
      }
      obter_referencias_doppler_carotidas: {
        Args: { idade_paciente?: number; sexo?: string }
        Returns: Json
      }
      probabilidade_passagem_calculo: {
        Args: { p_diametro_mm: number; p_localizacao?: string }
        Returns: number
      }
      refresh_platform_metrics: { Args: never; Returns: undefined }
      refund_whisper_credits: {
        Args: {
          p_credits_to_refund: number
          p_reason?: string
          p_user_id: string
        }
        Returns: Json
      }
      renew_mobile_session: { Args: { p_session_token: string }; Returns: Json }
      renew_monthly_credits:
        | {
            Args: { p_plan_code: string; p_user_id: string }
            Returns: undefined
          }
        | { Args: { p_plan_code: string; p_user_id: string }; Returns: Json }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      tecnica_angiotc: {
        Args: {
          contraste?: string
          equipamento?: string
          reconstrucao?: string
          regiao?: string
        }
        Returns: string
      }
      tecnica_rm_atm: {
        Args: {
          boca_aberta?: boolean
          contraste?: boolean
          dinamico?: boolean
          planos?: string[]
          sequencias?: string[]
        }
        Returns: string
      }
      tecnica_rm_coluna: {
        Args: {
          campos?: string
          contraste?: boolean
          plano?: string
          qualidade?: string
        }
        Returns: string
      }
      tecnica_rm_coluna_lombar: {
        Args: {
          campos?: string
          contraste?: boolean
          plano?: string
          qualidade?: string
        }
        Returns: string
      }
      tecnica_rm_orbitas:
        | {
            Args: {
              contraste?: boolean
              difusao?: boolean
              fat_sat?: boolean
              planos?: string[]
              sequencias?: string[]
            }
            Returns: string
          }
        | {
            Args: {
              campo_visao?: string
              dose_contraste?: string
              espessura_corte?: number
              intervalo_corte?: number
              matriz?: string
              planos?: string
              protocolo_especifico?: string
              sequencias?: string
              tipo_contraste?: string
              uso_contraste?: boolean
            }
            Returns: string
          }
      tecnica_tc_coluna: { Args: never; Returns: string }
      tecnica_tc_pescoco: {
        Args: {
          contraste?: boolean
          espessura_corte?: string
          fase?: string
          reconstrucao?: string
        }
        Returns: string
      }
      template_tc_pescoco_glandulas_salivares: {
        Args: {
          calcificacoes?: boolean
          caracteristicas?: string
          cistica?: boolean
          densidade?: string
          glandula: string
          invasao_tecido_adjacente?: boolean
          lateralidade: string
          linfonodos_afetados?: string
          localizacao?: string
          margens?: string
          mista?: boolean
          necrose?: boolean
          observacoes_adicionais?: string
          patologia: string
          realce_contraste?: string
          solida?: boolean
          tamanho?: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_inflamatorio: {
        Args: {
          caracteristicas?: string
          complicacoes?: string
          estruturas_adjacentes?: string
          evolucao?: string
          extensao?: string
          grau?: string
          lateralidade?: string
          linfonodos?: string
          localizacao: string
          observacoes_adicionais?: string
          tipo: string
        }
        Returns: string
      }
      template_tc_pescoco_linfonodos: {
        Args: {
          capsula?: string
          centro?: string
          comparativo_previo?: string
          contornos?: string
          estadiamento_tnm?: string
          infiltracao_gordura?: string
          lateralidade: string
          localizacao: string
          morfologia?: string
          numero_linfonodos?: number
          observacoes_adicionais?: string
          padrao_difusao?: string
          realce_contraste?: string
          sinais_malignidade?: string
          tamanho_maior: number
          tamanho_menor?: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_neoplasia_cavidade_oral: {
        Args: {
          caracteristicas_morfologicas?: string
          estadiamento_tnm?: string
          extensao_profunda?: boolean
          extensao_superficial?: boolean
          invasao_muscular?: boolean
          invasao_osea?: boolean
          invasao_perineural?: boolean
          invasao_vascular?: boolean
          linfonodos_afetados?: string
          localizacao: string
          localizacao_especifica?: string
          tamanho: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_neoplasia_hipofaringe: {
        Args: {
          caracteristicas_morfologicas?: string
          estadiamento_tnm?: string
          extensao_profunda?: boolean
          extensao_superficial?: boolean
          invasao_cartilagem_cricoide?: boolean
          invasao_cartilagem_tireoide?: boolean
          invasao_esofago?: boolean
          invasao_laringe?: boolean
          invasao_muscular?: boolean
          invasao_paratireoide?: boolean
          invasao_perineural?: boolean
          invasao_tireoide?: boolean
          invasao_vascular?: boolean
          lateralidade?: string
          linfonodos_afetados?: string
          localizacao: string
          tamanho: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_neoplasia_laringe: {
        Args: {
          caracteristicas_morfologicas?: string
          estadiamento_tnm?: string
          extensao_profunda?: boolean
          extensao_superficial?: boolean
          invasao_cartilagem_aringea?: boolean
          invasao_cartilagem_cricoide?: boolean
          invasao_cartilagem_tireoide?: boolean
          invasao_epiglote?: boolean
          invasao_espaco_paraglote?: boolean
          invasao_espaco_preepiglote?: boolean
          invasao_extralaringea?: boolean
          invasao_musc_extrinsecos?: boolean
          invasao_musc_intrinsecos?: boolean
          invasao_paraglote?: boolean
          invasao_pos_epiglote?: boolean
          invasao_pre_epiglote?: boolean
          invasao_prega_ventricular?: boolean
          invasao_pregas_vocais?: boolean
          invasao_traqueia?: boolean
          invasao_vallecula?: boolean
          invasao_ventriculo_morgagni?: boolean
          lateralidade?: string
          linfonodos_afetados?: string
          localizacao: string
          tamanho: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_neoplasia_nasofaringe: {
        Args: {
          caracteristicas_morfologicas?: string
          estadiamento_tnm?: string
          extensao_profunda?: boolean
          extensao_superficial?: boolean
          invasao_base_cranio?: boolean
          invasao_canal_pterigoideo?: boolean
          invasao_espaco_parafaringeo?: boolean
          invasao_espaco_prevertebral?: boolean
          invasao_fossa_infratemporal?: boolean
          invasao_fossa_pterigopalatina?: boolean
          invasao_musc_mastigatorios?: boolean
          invasao_musc_pterigoideos?: boolean
          invasao_orbita?: boolean
          invasao_sinus_esfenoidal?: boolean
          invasao_sinus_maxilar?: boolean
          lateralidade?: string
          linfonodos_afetados?: string
          localizacao: string
          tamanho: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_neoplasia_orofaringe: {
        Args: {
          caracteristicas_morfologicas?: string
          estadiamento_tnm?: string
          extensao_profunda?: boolean
          extensao_superficial?: boolean
          invasao_base_lingua?: boolean
          invasao_muscular?: boolean
          invasao_neuroforame?: boolean
          invasao_palato_mole?: boolean
          invasao_parede_faringea?: boolean
          invasao_vascular?: boolean
          lateralidade?: string
          linfonodos_afetados?: string
          localizacao: string
          tamanho: number
          unidade?: string
        }
        Returns: string
      }
      template_tc_pescoco_normal: {
        Args: {
          avaliar_cavidade_oral?: boolean
          avaliar_faringe?: boolean
          avaliar_glandulas?: boolean
          avaliar_laringe?: boolean
          avaliar_linfonodos?: boolean
          avaliar_tireoide?: boolean
          avaliar_vasos?: boolean
          estruturas_oseas?: boolean
        }
        Returns: string
      }
      template_tc_pescoco_tecnica: {
        Args: {
          algoritmo?: string
          contraste?: boolean
          espessura_corte?: number
          fase?: boolean
          intervalo_corte?: number
          janela_mole?: boolean
          janela_osea?: boolean
          observacoes_tecnicas?: string
          reconstrucao_multiplanar?: boolean
        }
        Returns: string
      }
      template_tc_torax_calcificacoes_cardiacas: {
        Args: {
          extensao?: string
          localizacao?: string
          padrao?: string
          septo_interventricular?: boolean
          tipo_calcificacao?: string
        }
        Returns: string
      }
      template_tc_torax_cisto_mediastinal: {
        Args: {
          densidade?: string
          extensao?: string
          localizacao?: string
          predominancia?: string
          tamanho_cm?: number
          tipo_cisto?: string
          topografia?: string
        }
        Returns: string
      }
      template_tc_torax_linfoma_linfonodal: {
        Args: {
          cadeias_pericardiofrenicas?: boolean
          cadeias_toracicas?: boolean
          regioes_afetadas?: string[]
          tamanho_maximo_cm?: number
          tamanho_pericardiofrenicas_cm?: number
          tamanho_toracicas_cm?: number
        }
        Returns: string
      }
      template_tc_torax_linfoma_nodular: {
        Args: {
          broncogramas_aereos?: boolean
          consolidacoes?: boolean
          localizacao?: string[]
          padrao_distribuicao?: string
          tamanho_maximo_cm?: number
        }
        Returns: string
      }
      template_tc_torax_linfonodomegalia: {
        Args: {
          cadeias_afetadas?: string[]
          calcificacoes?: boolean
          caracteristicas_contraste?: string
          componentes_baixa_densidade?: boolean
          comprometimento_contralateral?: boolean
          comprometimento_supraclavicular?: boolean
          multiplas?: boolean
          necrose?: boolean
          tamanho_menor_eixo_cm?: number
        }
        Returns: string
      }
      template_tc_torax_linfonodomegalia_especifica: {
        Args: {
          cadeia_direita?: string
          cadeia_esquerda?: string
          caracteristicas?: string
          medida_direita_cm?: number
          medida_esquerda_cm?: number
        }
        Returns: string
      }
      template_tc_torax_mediastinite_fibrosante: {
        Args: {
          bandas_atelectasicas?: boolean
          calcificacoes?: boolean
          consolidações?: boolean
          densidade?: string
          estenose_severa?: boolean
          localizacao?: string
          oclusao_completa?: boolean
          recuo_vcs?: boolean
          revestimento_vascular?: boolean
          vasos_afetados?: string[]
        }
        Returns: string
      }
      template_tc_torax_neoplasia_esofago: {
        Args: {
          dilatacao_montante?: boolean
          estenose?: boolean
          invasao_adjacentes?: boolean
          invasao_aorta?: boolean
          invasao_traqueobronquica?: boolean
          localizacao_tercos?: boolean[]
          nivel_hidroaereo?: boolean
          perda_planos?: boolean
          tipo_espessamento?: string
        }
        Returns: string
      }
      template_tc_torax_normal: {
        Args: {
          acesso_venoso?: string
          fases_estudo?: string[]
          janelamento?: string
          tecnica_contraste?: boolean
          volume_contraste_ml?: number
          volumetria?: string
        }
        Returns: string
      }
      template_tc_torax_tumor_mediastino_anterior: {
        Args: {
          compressao_pulmonar?: string
          contornos?: string
          elevacao_diafragma?: boolean
          estruturas_vasculares?: string[]
          extensao_inferior?: string
          extensao_superior?: string
          invasao_parede_toracica?: boolean
          invasao_vascular?: boolean
          necrose?: boolean
          realce_contraste?: string
          tamanho_cm?: string[]
        }
        Returns: string
      }
      update_mobile_heartbeat: {
        Args: { p_session_token: string }
        Returns: Json
      }
      update_mobile_session_status: {
        Args: {
          p_device_info?: Json
          p_session_token: string
          p_status: string
        }
        Returns: Json
      }
      validar_medida_contra_referencia: {
        Args: {
          p_estrutura: string
          p_idade: number
          p_sexo?: string
          p_valor: number
        }
        Returns: Json
      }
      validate_mobile_session: {
        Args: { p_session_token: string }
        Returns: Json
      }
      validate_mobile_session_secure: {
        Args: {
          p_mobile_ip?: unknown
          p_session_token: string
          p_temp_jwt?: string
        }
        Returns: Json
      }
      verificar_duplicacao_frase: {
        Args: {
          p_estrutura_anatomica_id: string
          p_modalidade_id: string
          p_regiao_anatomica_id: string
          p_texto: string
        }
        Returns: {
          duplicado: boolean
          frase_id: string
          motivo: string
        }[]
      }
      verificar_duplicacao_template: {
        Args: {
          p_codigo: string
          p_modalidade_id: string
          p_regiao_anatomica_id: string
          p_titulo: string
        }
        Returns: {
          duplicado: boolean
          motivo: string
          template_id: string
        }[]
      }
      verificar_referencia_por_idade: {
        Args: { p_estrutura: string; p_idade: number; p_sexo?: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
