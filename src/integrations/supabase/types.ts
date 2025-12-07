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
      analise_conclusiva_coluna: {
        Args: {
          achados_principais?: string[]
          gravidade?: string
          regiao?: string
        }
        Returns: string
      }
      analise_geral_orbitas: {
        Args: {
          abscesso?: boolean
          assimetria?: boolean
          celulite?: boolean
          dimensao_anormal?: string
          edema_celular?: boolean
          empiema?: boolean
          hematoma?: boolean
          lado_afetado?: string
          localizacao?: string
        }
        Returns: string
      }
      aplicar_template_lombar: {
        Args: { template_nome: string; variaveis: Json }
        Returns: string
      }
      auto_save_report: {
        Args: { p_content: string; p_report_id: string; p_user_id: string }
        Returns: undefined
      }
      avaliar_alinhamento_cervical: {
        Args: {
          escoliose?: boolean
          grau_escoliose?: number
          lordose_normal?: boolean
          tipo_escoliose?: string
        }
        Returns: string
      }
      avaliar_alinhamento_lombar: {
        Args: {
          acentuacao?: boolean
          componente_rotacional?: boolean
          direcao_escoliose?: string
          escoliose?: boolean
          grau_escoliose?: number
          lordose_normal?: boolean
          retificacao?: boolean
        }
        Returns: string
      }
      avaliar_altura_discal_cervical: {
        Args: {
          altura_reduzida?: boolean
          colapso?: boolean
          grau_reducao?: number
          nivel?: string
        }
        Returns: string
      }
      avaliar_aneurismas: {
        Args: {
          aneurismas?: boolean
          aneurismas_rupturados?: boolean
          aneurismas_tratados?: boolean
          localização_aneurismas?: string[]
          morfologia_aneurismas?: string[]
          tamanho_aneurismas?: string[]
          tipo_tratamento?: string[]
        }
        Returns: string
      }
      avaliar_aneurismas_malformacoes: {
        Args: {
          aneurisma_aorta?: boolean
          aneurisma_basilar?: boolean
          aneurisma_carotida_comum_direita?: boolean
          aneurisma_carotida_comum_esquerda?: boolean
          aneurisma_carotida_interna_direita?: boolean
          aneurisma_carotida_interna_esquerda?: boolean
          aneurisma_vertebral_direita?: boolean
          aneurisma_vertebral_esquerda?: boolean
          aneurismas?: boolean
          angiomatose?: boolean
          dimensao_aneurisma_aorta?: string
          dimensao_aneurisma_basilar?: string
          dimensao_aneurisma_carotida_comum_direita?: string
          dimensao_aneurisma_carotida_comum_esquerda?: string
          dimensao_aneurisma_carotida_interna_direita?: string
          dimensao_aneurisma_carotida_interna_esquerda?: string
          dimensao_aneurisma_vertebral_direita?: string
          dimensao_aneurisma_vertebral_esquerda?: string
          fistula_carotidocavernosa?: boolean
          localizacao_aneurisma_carotida_interna_direita?: string
          localizacao_aneurisma_carotida_interna_esquerda?: string
          localizacao_malformacao?: string
          malformacao_arteriovenosa?: boolean
          malformacao_capilar?: boolean
          malformacoes?: boolean
        }
        Returns: string
      }
      avaliar_aorta_tronco_braquiocefalico: {
        Args: {
          aorta_aneurisma?: boolean
          aorta_dilatada?: boolean
          aorta_normal?: boolean
          ateromatose?: boolean
          calcificacoes?: boolean
          dimensao_aorta?: string
          disseccao?: boolean
          grau_ateromatose?: string
          local_disseccao?: string
          trombose?: boolean
          tronco_braquiocefalico_alto?: boolean
          tronco_braquiocefalico_bifurcacao_anomala?: boolean
          tronco_braquiocefalico_normal?: boolean
        }
        Returns: string
      }
      avaliar_artéria_basilar: {
        Args: {
          basilar_aneurisma?: boolean
          basilar_ateromatose?: boolean
          basilar_disseccao?: boolean
          basilar_dolicoectasica?: boolean
          basilar_estenose?: boolean
          basilar_normal?: boolean
          basilar_tortuosidade?: boolean
          basilar_trombose?: boolean
          circulacao_posterior?: string
          dimensao_basilar?: string
          grau_ateromatose_basilar?: string
          grau_tortuosidade_basilar?: string
          percentual_estenose_basilar?: number
        }
        Returns: string
      }
      avaliar_artérias_carótidas_comuns: {
        Args: {
          bifurcacao_direita_estenose?: boolean
          bifurcacao_direita_normal?: boolean
          bifurcacao_esquerda_estenose?: boolean
          bifurcacao_esquerda_normal?: boolean
          carotida_comum_direita_ateromatose?: boolean
          carotida_comum_direita_estenose?: boolean
          carotida_comum_direita_normal?: boolean
          carotida_comum_direita_tortuosidade?: boolean
          carotida_comum_esquerda_ateromatose?: boolean
          carotida_comum_esquerda_estenose?: boolean
          carotida_comum_esquerda_normal?: boolean
          carotida_comum_esquerda_tortuosidade?: boolean
          dimensao_bifurcacao_direita?: string
          dimensao_bifurcacao_esquerda?: string
          dimensao_carotida_comum_direita?: string
          dimensao_carotida_comum_esquerda?: string
          grau_ateromatose_ccd?: string
          grau_ateromatose_cce?: string
          grau_tortuosidade_ccd?: string
          grau_tortuosidade_cce?: string
          percentual_estenose_bifurcacao_direita?: number
          percentual_estenose_bifurcacao_esquerda?: number
          percentual_estenose_ccd?: number
          percentual_estenose_cce?: number
        }
        Returns: string
      }
      avaliar_artérias_intracranianas: {
        Args: {
          ateromatose?: boolean
          basilar?: string
          basilar_detalhes?: string
          carótidas_internas?: string
          carótidas_internas_detalhes?: string
          cerebrais_anteriores?: string
          cerebrais_anteriores_detalhes?: string
          cerebrais_medias?: string
          cerebrais_medias_detalhes?: string
          cerebrais_posteriores?: string
          cerebrais_posteriores_detalhes?: string
          circulação_colateral?: string
          grau_ateromatose?: string
          vertebrais?: string
          vertebrais_detalhes?: string
        }
        Returns: string
      }
      avaliar_artérias_subclávias: {
        Args: {
          dimensao_aneurisma_direita?: string
          dimensao_aneurisma_esquerda?: string
          grau_ateromatose_direita?: string
          grau_ateromatose_esquerda?: string
          lado_subclavia?: string
          percentual_estenose_direita?: number
          percentual_estenose_esquerda?: number
          sindrome_subclavia?: boolean
          subclavia_direita_aneurisma?: boolean
          subclavia_direita_ateromatose?: boolean
          subclavia_direita_disseccao?: boolean
          subclavia_direita_estenose?: boolean
          subclavia_direita_normal?: boolean
          subclavia_direita_trombose?: boolean
          subclavia_esquerda_aneurisma?: boolean
          subclavia_esquerda_ateromatose?: boolean
          subclavia_esquerda_disseccao?: boolean
          subclavia_esquerda_estenose?: boolean
          subclavia_esquerda_normal?: boolean
          subclavia_esquerda_trombose?: boolean
        }
        Returns: string
      }
      avaliar_artérias_vertebrais: {
        Args: {
          dimensao_vertebral_direita?: string
          dimensao_vertebral_esquerda?: string
          dominancia_vertebral?: string
          grau_ateromatose_vertebral_direita?: string
          grau_ateromatose_vertebral_esquerda?: string
          grau_tortuosidade_vertebral_direita?: string
          grau_tortuosidade_vertebral_esquerda?: string
          percentual_estenose_vertebral_direita?: number
          percentual_estenose_vertebral_esquerda?: number
          vertebral_direita_ateromatose?: boolean
          vertebral_direita_atresia?: boolean
          vertebral_direita_disseccao?: boolean
          vertebral_direita_estenose?: boolean
          vertebral_direita_hipoplasia?: boolean
          vertebral_direita_normal?: boolean
          vertebral_direita_tortuosidade?: boolean
          vertebral_esquerda_ateromatose?: boolean
          vertebral_esquerda_atresia?: boolean
          vertebral_esquerda_disseccao?: boolean
          vertebral_esquerda_estenose?: boolean
          vertebral_esquerda_hipoplasia?: boolean
          vertebral_esquerda_normal?: boolean
          vertebral_esquerda_tortuosidade?: boolean
        }
        Returns: string
      }
      avaliar_artrodese_cervical: {
        Args: {
          artrodese?: boolean
          consolidacao?: boolean
          material?: string
          nivel?: string
          pseudartrose?: boolean
          tipo?: string
        }
        Returns: string
      }
      avaliar_artrodese_lombar: {
        Args: {
          artefatos?: boolean
          artrodese?: boolean
          consolidacao?: boolean
          material?: string
          niveis?: string[]
          tipo?: string
        }
        Returns: string
      }
      avaliar_assimilacao_atlas: {
        Args: { fusao?: boolean; impactacao?: boolean; segmentos?: string }
        Returns: string
      }
      avaliar_baastrup: {
        Args: { baastrup?: boolean; niveis?: string[] }
        Returns: string
      }
      avaliar_bulbos_carótidos_acc: {
        Args: {
          acc_direita_ateromatose?: boolean
          acc_direita_estenose?: boolean
          acc_direita_normal?: boolean
          acc_direita_tortuosidade?: boolean
          acc_direita_ulceracao?: boolean
          acc_esquerda_ateromatose?: boolean
          acc_esquerda_estenose?: boolean
          acc_esquerda_normal?: boolean
          acc_esquerda_tortuosidade?: boolean
          acc_esquerda_ulceracao?: boolean
          bulbo_direito_ateromatose?: boolean
          bulbo_direito_estenose?: boolean
          bulbo_direito_normal?: boolean
          bulbo_direito_tortuosidade?: boolean
          bulbo_direito_ulceracao?: boolean
          bulbo_esquerdo_ateromatose?: boolean
          bulbo_esquerdo_estenose?: boolean
          bulbo_esquerdo_normal?: boolean
          bulbo_esquerdo_tortuosidade?: boolean
          bulbo_esquerdo_ulceracao?: boolean
          dimensao_acc_direita?: string
          dimensao_acc_esquerda?: string
          dimensao_bulbo_direito?: string
          dimensao_bulbo_esquerdo?: string
          grau_ateromatose_acc_direita?: string
          grau_ateromatose_acc_esquerda?: string
          grau_ateromatose_bulbo_direito?: string
          grau_ateromatose_bulbo_esquerdo?: string
          percentual_estenose_acc_direita?: number
          percentual_estenose_acc_esquerda?: number
          percentual_estenose_bulbo_direito?: number
          percentual_estenose_bulbo_esquerdo?: number
        }
        Returns: string
      }
      avaliar_canal_cervical: {
        Args: {
          area_canal?: number
          diametro_sagital?: number
          estenose_central?: boolean
          estenose_lateral?: boolean
          estreitamento?: boolean
          grau?: string
          nivel?: string
        }
        Returns: string
      }
      avaliar_canal_lombar: {
        Args: {
          estreitamento?: boolean
          etiologia?: string
          grau?: string
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_chiari: {
        Args: {
          descida_tipo?: string
          hidrocefalia?: boolean
          siringomielia?: boolean
          tipo?: string
          tonsilas_descida?: number
        }
        Returns: string
      }
      avaliar_cisto_ovariano_funcional: {
        Args: { aspecto: string; idade_dias: number; tamanho_cm: number }
        Returns: string
      }
      avaliar_cistos_facetarios: {
        Args: {
          cistos?: boolean
          compressao?: boolean
          lateralidade?: string
          niveis?: string[]
          tamanho?: number
          tipos?: string[]
        }
        Returns: string
      }
      avaliar_colecao_pos_cirurgia_lombar: {
        Args: {
          coleccao?: boolean
          dimensoes?: number[]
          localizacao?: string
          niveis?: string[]
          volume?: number
        }
        Returns: string
      }
      avaliar_coleccao_pos_cirurgia_cervical: {
        Args: {
          coleccao?: boolean
          compressao?: boolean
          localizacao?: string
          tipo?: string
          volume?: number
        }
        Returns: string
      }
      avaliar_compressibilidade: {
        Args: {
          augmentacao?: boolean
          compressao_manual: boolean
          probe_compression?: boolean
        }
        Returns: string
      }
      avaliar_compressibilidade_venosa: {
        Args: {
          p_completamente_compressivel: boolean
          p_dor_compressao: number
          p_nao_compressivel: boolean
          p_parcialmente_compressivel: boolean
        }
        Returns: Json
      }
      avaliar_condilos_atm: {
        Args: {
          artropatia?: boolean
          cistos_subcorticais?: boolean
          contornos_normal?: boolean
          edema_oseo?: boolean
          esclerose_subcortical?: boolean
          focos_edema?: string[]
          forma_normal?: boolean
          grau_artropatia?: string
          lado_predominio?: string
          localizacao_retificacao?: string
          osteofitos_marginais?: boolean
          reducao_espaco_articular?: boolean
          retificacao_contornos?: boolean
        }
        Returns: string
      }
      avaliar_cone_medular: {
        Args: {
          calibre?: string
          localizacao?: string
          morfologia_normal?: boolean
          sinal?: string
        }
        Returns: string
      }
      avaliar_corpos_vertebrais_cervicais: {
        Args: {
          altura_normal?: boolean
          compressao?: boolean
          fratura?: boolean
          grau_compressao?: number
          nivel_compressao?: string
          tipo_fratura?: string
        }
        Returns: string
      }
      avaliar_corpos_vertebrais_lombares: {
        Args: {
          acunhamento?: boolean
          altura_normal?: boolean
          edema_medular?: boolean
          fratura?: boolean
          grau_reducao?: number
          grau_retropulsao?: string
          neoplasia?: boolean
          niveis_acunhamento?: string[]
          retropulsao?: boolean
          tipo_acunhamento?: string
          tipo_fratura?: string
          tipo_neoplasia?: string
        }
        Returns: string
      }
      avaliar_derrame_articular_atm: {
        Args: {
          bilobado?: boolean
          derrame_presente?: boolean
          lado_derrame?: string
          quantidade_derrame?: string
        }
        Returns: string
      }
      avaliar_descolamentos: {
        Args: {
          altura_descolamento?: string
          chronicidade?: string
          complicacoes?: string
          descolamento_coroidiano?: boolean
          descolamento_exsudativo?: boolean
          descolamento_hemorragico?: boolean
          descolamento_retiniano?: boolean
          descolamento_rhegmatogenico?: boolean
          descolamento_seroso?: boolean
          descolamento_tracional?: boolean
          extensao_descolamento?: string
          lado_afetado?: string
          localizacao_descolamento?: string
        }
        Returns: string
      }
      avaliar_discos_atm: {
        Args: {
          alteracao_sinal?: boolean
          deslocamento?: boolean
          disco_topico?: boolean
          morfologia_presaervada?: boolean
          recaptura?: boolean
          reducao_espessura?: boolean
          satisfacao_recaptura?: string
          segmento_afetado?: string[]
          tipo_deslocamento?: string
        }
        Returns: string
      }
      avaliar_discos_cervicais: {
        Args: {
          desidratacao?: boolean
          extrusao?: boolean
          grau_desidratacao?: string
          hernia?: boolean
          localizacao_hernia?: string
          migracao?: boolean
          nivel?: string
          protrusao?: boolean
          tipo_hernia?: string
        }
        Returns: string
      }
      avaliar_discos_lombares: {
        Args: {
          desidratacao?: boolean
          extensao?: string
          grau_desidratacao?: string
          niveis?: string[]
          niveis_reducao?: string[]
          reducao_espaco?: boolean
        }
        Returns: string
      }
      avaliar_dissecções: {
        Args: {
          comprimento_dissecções?: string[]
          dissecções?: boolean
          dissecções_tratadas?: boolean
          grau_dissecções?: string[]
          localização_dissecções?: string[]
          tipo_tratamento_dissecções?: string
        }
        Returns: string
      }
      avaliar_disseccoes_stents: {
        Args: {
          data_implante_stent?: string
          disseccao_acc_direita?: boolean
          disseccao_acc_esquerda?: boolean
          disseccao_aorta?: boolean
          disseccao_basilar?: boolean
          disseccao_carotida_comum_direita?: boolean
          disseccao_carotida_comum_esquerda?: boolean
          disseccao_vertebral_direita?: boolean
          disseccao_vertebral_esquerda?: boolean
          disseccoes?: boolean
          estenose_interna_stent_acc_direita?: number
          estenose_interna_stent_acc_esquerda?: number
          estenose_interna_stent_aorta?: number
          estenose_interna_stent_basilar?: number
          estenose_interna_stent_carotida_direita?: number
          estenose_interna_stent_carotida_esquerda?: number
          estenose_interna_stent_vertebral_direita?: number
          estenose_interna_stent_vertebral_esquerda?: number
          extensao_disseccao_acc_direita?: string
          extensao_disseccao_acc_esquerda?: string
          extensao_disseccao_aorta?: string
          extensao_disseccao_basilar?: string
          extensao_disseccao_carotida_direita?: string
          extensao_disseccao_carotida_esquerda?: string
          extensao_disseccao_vertebral_direita?: string
          extensao_disseccao_vertebral_esquerda?: string
          permeabilidade_stent_acc_direita?: string
          permeabilidade_stent_acc_esquerda?: string
          permeabilidade_stent_aorta?: string
          permeabilidade_stent_basilar?: string
          permeabilidade_stent_carotida_direita?: string
          permeabilidade_stent_carotida_esquerda?: string
          permeabilidade_stent_vertebral_direita?: string
          permeabilidade_stent_vertebral_esquerda?: string
          stent_acc_direita?: boolean
          stent_acc_esquerda?: boolean
          stent_aorta?: boolean
          stent_basilar?: boolean
          stent_carotida_comum_direita?: boolean
          stent_carotida_comum_esquerda?: boolean
          stent_vertebral_direita?: boolean
          stent_vertebral_esquerda?: boolean
          stents?: boolean
        }
        Returns: string
      }
      avaliar_edema_perifacetario: {
        Args: {
          edema?: boolean
          grau?: string
          lateralidade?: string
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_espacadores_lombares: {
        Args: { espacadores?: boolean; niveis?: string[] }
        Returns: string
      }
      avaliar_excursao_condilar_atm: {
        Args: {
          excursao_preservada?: boolean
          hiperexcursao?: boolean
          hipoexcursao?: boolean
          lado_afetado?: string
          manobra_abertura?: boolean
        }
        Returns: string
      }
      avaliar_facetas_cervicais: {
        Args: {
          anquilose?: boolean
          artropatia?: boolean
          grau?: string
          nivel?: string
          osteofitos?: boolean
          sinovite?: boolean
        }
        Returns: string
      }
      avaliar_facetas_lombares: {
        Args: {
          artropatia?: boolean
          aspecto?: string
          extensao?: string
          grau?: string
          hipertrofico?: boolean
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_filum_terminal: {
        Args: { fibrolipoma?: boolean; tamanho?: number }
        Returns: string
      }
      avaliar_fissuras_anulares_cervical: {
        Args: {
          fissuras?: boolean
          grau?: string
          nivel?: string
          tipo?: string
        }
        Returns: string
      }
      avaliar_fístulas_durais: {
        Args: {
          alimentadores_fístulas?: string[]
          drenagem_fístulas?: string[]
          fístulas_durais?: boolean
          fístulas_tratadas?: boolean
          grau_fístulas?: string[]
          localização_fístulas?: string[]
          tipo_tratamento_fístulas?: string
        }
        Returns: string
      }
      avaliar_forames_intervertebrais_cervical: {
        Args: {
          compressao_radicular?: boolean
          estreitamento?: boolean
          grau?: string
          nivel?: string
        }
        Returns: string
      }
      avaliar_globos_oculares_congenitas: {
        Args: {
          anoftalmia?: boolean
          astigmatismo?: boolean
          buftalmia?: boolean
          cavidade_anterior?: string
          coloboma?: boolean
          cristalino_dimensoes?: string
          estafiloma?: boolean
          globo_ocular_dimensoes?: string
          hipermetropia?: boolean
          lado_afetado?: string
          microesferoftalmia?: boolean
          microftalmia?: boolean
          miopia_axial?: boolean
          nanoftalmia?: boolean
          vitreo_dimensoes?: string
        }
        Returns: string
      }
      avaliar_globos_oculares_pos_operatorio: {
        Args: {
          banda_escleral?: boolean
          exenteracao_orbitaria?: boolean
          gas_intravitreo?: boolean
          implante_ahmed?: boolean
          implante_baerveldt?: boolean
          implante_lente_intraocular?: boolean
          implante_ocular?: boolean
          lado_afetado?: string
          peso_palpebral?: boolean
          protese_ocular?: boolean
          silicone_intravitreo?: boolean
          tipo_exenteracao?: string
        }
        Returns: string
      }
      avaliar_gordura_epidural_lombar: {
        Args: {
          localizacao?: string
          niveis?: string[]
          proeminencia?: boolean
          tipo?: string
        }
        Returns: string
      }
      avaliar_hemangiomas_lombares: {
        Args: {
          componente_extra?: boolean
          extensao?: boolean
          hemangiomas?: boolean
          localizacao?: string[]
          tipo?: string
        }
        Returns: string
      }
      avaliar_hernia_lombar: {
        Args: {
          hernia?: boolean
          impactos_radicular?: string[]
          localizacoes?: string[]
          niveis?: string[]
          tipos?: string[]
        }
        Returns: string
      }
      avaliar_hipoplasia_facetas: {
        Args: { hipoplasia?: boolean; lateralidade?: string; niveis?: string[] }
        Returns: string
      }
      avaliar_insuficiencia_venosa_cronica: {
        Args: {
          p_classe_clap: number
          p_obstrucao_venosa: boolean
          p_refluxo_múltiplo: boolean
          p_úlcera_ativa: boolean
          p_úlcera_cicatrizada: boolean
        }
        Returns: Json
      }
      avaliar_integridade_parede_pos_cirurgia: {
        Args: {
          espessura_parede_mm: number
          presenca_colecao?: boolean
          presenca_deiscencia?: boolean
          tempo_pos_cirurgia_dias: number
        }
        Returns: {
          fase_cicatrizacao: string
          integridade: string
          necessita_intervencao: boolean
          previsao_cicatrizacao_dias: number
        }[]
      }
      avaliar_invaginacao_basilar: {
        Args: { angulo_clivo?: number; dens_descida?: number; grau?: string }
        Returns: string
      }
      avaliar_laminectomia_cervical: {
        Args: {
          extensao?: string
          grau_reestenose?: string
          laminectomia?: boolean
          nivel?: string
          reestenose?: boolean
        }
        Returns: string
      }
      avaliar_laminectomia_lombar: {
        Args: {
          fibrose?: boolean
          laminectomia?: boolean
          lateralidade?: string
          local_fibrose?: string
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_ligamento_amarelo_cervical: {
        Args: {
          espessamento?: boolean
          grau?: string
          nivel?: string
          ossificacao?: boolean
        }
        Returns: string
      }
      avaliar_ligamento_amarelo_lombar: {
        Args: {
          espessamento?: boolean
          grau?: string
          impacto?: string
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_ligamentos_interespinhosos: {
        Args: { edema?: boolean; etiologia?: string; niveis?: string[] }
        Returns: string
      }
      avaliar_liquefacao_lombar: {
        Args: {
          associacoes?: string[]
          liquefacao?: boolean
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_liquido_livre_pelvico: {
        Args: { localizacao: string; quantidade: string }
        Returns: string
      }
      avaliar_lises_istmo_lombar: {
        Args: {
          bilateral?: boolean
          desalinhamento?: boolean
          grau_listese?: string
          lise?: boolean
          niveis?: string[]
        }
        Returns: string
      }
      avaliar_listese_cervical: {
        Args: {
          grau?: number
          listese?: boolean
          nivel?: string
          tipo?: string
        }
        Returns: string
      }
      avaliar_listese_lombar: {
        Args: {
          etiologia?: string
          graus?: string[]
          listese?: boolean
          niveis?: string[]
          tipo?: string
        }
        Returns: string
      }
      avaliar_mav: {
        Args: {
          alimentadores_mav?: string[]
          drenagem_mav?: string
          graduação_spetzler?: string
          localização_mav?: string
          mav?: boolean
          mav_tratada?: boolean
          tamanho_mav?: string
          tipo_mav?: string
          tipo_tratamento_mav?: string
        }
        Returns: string
      }
      avaliar_medula_cervical: {
        Args: {
          atrofia?: boolean
          compressao_medular?: boolean
          grau?: string
          mielopatia?: boolean
          nivel_compressao?: string
          nivel_siringomielia?: string
          siringomielia?: boolean
        }
        Returns: string
      }
      avaliar_metastases_cervical: {
        Args: { localizacao?: string[]; metastases?: boolean; padrao?: string }
        Returns: string
      }
      avaliar_modic_lombar: {
        Args: {
          modic?: boolean
          niveis?: string[]
          predominancia?: string
          tipos?: string[]
        }
        Returns: string
      }
      avaliar_musculatura_paravertebral_lombar: {
        Args: {
          edema?: boolean
          etiologia_edema?: string
          extensao_lipos?: string
          grau_hipotrofia?: string
          hipotrofia?: boolean
          lipossubstituicao?: boolean
          localizacao_lipos?: string
          niveis_edema?: string[]
          normal?: boolean
        }
        Returns: string
      }
      avaliar_musculos_mastigadores_atm: {
        Args: {
          hipertrofia?: boolean
          hipotrofia?: boolean
          lado_hipotrofia?: string
          musculos_preservados?: boolean
          sinais_atrofia?: boolean
        }
        Returns: string
      }
      avaliar_nodulo_parede_abdominal: {
        Args: {
          diametro_cm: number
          ecogenicidade?: string
          limites?: string
          profundidade?: string
        }
        Returns: {
          necessita_biopsia: boolean
          necessita_seguimento: boolean
          probabilidade_benigno: number
          probabilidade_maligno: number
        }[]
      }
      avaliar_numeracao_lombar: {
        Args: {
          articulacao?: string
          caracteristica?: string
          fusao?: boolean
          tipo_transicao?: string
          transicao?: boolean
        }
        Returns: string
      }
      avaliar_osteofitos_lombares: {
        Args: { grau?: string; localizacao?: string; osteofitos?: boolean }
        Returns: string
      }
      avaliar_pagete_lombar: {
        Args: { niveis?: string[]; pagete?: boolean }
        Returns: string
      }
      avaliar_parafusos_cervical: {
        Args: {
          fratura?: boolean
          localizacao?: string[]
          lousecao?: boolean
          parafusos?: boolean
          posicao?: string
        }
        Returns: string
      }
      avaliar_pedículos_lombares: {
        Args: { niveis?: string[]; pedículos_curtos?: boolean }
        Returns: string
      }
      avaliar_placas_fim_cervical: {
        Args: {
          espessamento?: boolean
          grau?: string
          nivel?: string
          osteofitos?: boolean
        }
        Returns: string
      }
      avaliar_plano_cirurgico_lombar: {
        Args: { heterogeneidade?: boolean; localizacao?: string }
        Returns: string
      }
      avaliar_processo_inflamatorio_facetas: {
        Args: {
          alteracoes_periarticulares?: boolean
          bilateral?: boolean
          derrame_articular?: boolean
          edema_oseo?: boolean
          inflamacao?: boolean
          niveis?: string[]
          realce_sinovial?: boolean
          sinovite?: boolean
        }
        Returns: string
      }
      avaliar_raizes_cauda_equina: {
        Args: {
          agrupamento?: boolean
          distribuicao?: string
          morfologia_normal?: boolean
        }
        Returns: string
      }
      avaliar_refluxo_venoso: {
        Args: {
          p_diametro_veia: number
          p_localizacao: string
          p_tempo_refluxo: number
        }
        Returns: Json
      }
      avaliar_schmorl_lombar: {
        Args: { niveis?: string[]; schmorl?: boolean; tipos?: string[] }
        Returns: string
      }
      avaliar_sistema_venoso_intracraniano: {
        Args: {
          grau_trombose?: string[]
          localização_trombose?: string[]
          seios_venosos?: string
          seios_venosos_detalhes?: string
          trombose_venosa?: boolean
          veis_corticais?: string
          veis_corticais_detalhes?: string
          veis_profundas?: string
          veis_profundas_detalhes?: string
        }
        Returns: string
      }
      avaliar_stents_e_clipes: {
        Args: {
          clipes?: boolean
          integridade_clipes?: string
          localização_clipes?: string[]
          localização_stents?: string[]
          permeabilidade_stents?: string[]
          stents?: boolean
        }
        Returns: string
      }
      avaliar_tecido_retrodiscal_atm: {
        Args: {
          alteracoes_retrodiscal?: boolean
          retrodiscal_normal?: boolean
          tipo_alteracao?: string
        }
        Returns: string
      }
      avaliar_tecnica_angio_rm_cervical: {
        Args: {
          artefatos?: boolean
          campo_visao?: string
          contraste_utilizado?: string
          dose_contraste?: string
          espessura_corte?: string
          matriz?: string
          planos_aquisicao?: string
          qualidade_imagem?: string
          sequencia_utilizada?: string
          tempo_aquisicao?: string
          tipo_artefato?: string
        }
        Returns: string
      }
      avaliar_tecnica_angio_rm_intracraniana: {
        Args: {
          artefatos?: boolean
          contraste_utilizado?: string
          dose_contraste?: string
          fatores_técnicos?: string
          qualidade_exame?: string
          sequencias_utilizadas?: string[]
          tempo_injeção?: string
          tipo_artefatos?: string
        }
        Returns: string
      }
      avaliar_variações_anatômicas: {
        Args: {
          importância_clínica?: string[]
          tipo_variações?: string[]
          variações?: boolean
        }
        Returns: string
      }
      avaliar_veias_perfurantes: {
        Args: {
          p_competencia: string
          p_diametro: number
          p_localizacao: string
          p_tempo_refluxo: number
        }
        Returns: Json
      }
      build_ai_request: {
        Args: { fn_name: string; user_data: Json }
        Returns: Json
      }
      buscar_templates: {
        Args: {
          p_estrutura?: string
          p_modalidade?: string
          p_regiao?: string
          p_tipo?: string
        }
        Returns: {
          codigo: string
          descricao: string
          id: string
          modalidade_nome: string
          regiao_nome: string
          tipo_cor: string
          tipo_nome: string
          titulo: string
        }[]
      }
      calcular_angulo_alfa_graf: {
        Args: {
          ponto_1_x: number
          ponto_1_y: number
          ponto_2_x: number
          ponto_2_y: number
          ponto_3_x: number
          ponto_3_y: number
        }
        Returns: number
      }
      calcular_angulo_beta_graf: {
        Args: {
          ponto_1_x: number
          ponto_1_y: number
          ponto_2_x: number
          ponto_2_y: number
          ponto_3_x: number
          ponto_3_y: number
        }
        Returns: number
      }
      calcular_distancias_mama: {
        Args: {
          lateralidade: string
          posicao_horas: number
          tamanho_nodulo: number
        }
        Returns: {
          distancia_papila: number
          distancia_pele: number
          profundidade_relativa: string
        }[]
      }
      calcular_espessura_parede_normal: {
        Args: { idade?: number; imc: number; sexo?: string }
        Returns: {
          espessura_muscular_mm: number
          espessura_pele_mm: number
          espessura_subcutanea_mm: number
          espessura_total_mm: number
        }[]
      }
      calcular_espessura_tendao: {
        Args: {
          diametro: number
          referencia_max: number
          referencia_min: number
        }
        Returns: string
      }
      calcular_indice_esplenico: {
        Args: { p_comprimento_cm?: number; p_espessura_cm?: number }
        Returns: number
      }
      calcular_indice_hepatico: {
        Args: { p_ecogenicidade_figado?: string; p_ecogenicidade_rim?: string }
        Returns: number
      }
      calcular_indices_ventriculares: {
        Args: {
          diametro_frontal_direito_mm: number
          diametro_frontal_esquerdo_mm: number
          diametro_occipital_direito_mm?: number
          diametro_occipital_esquerdo_mm?: number
          largura_cranio_mm?: number
        }
        Returns: Json
      }
      calcular_itb: {
        Args: {
          pressao_arterial_braço: number
          pressao_arterial_tornozelo: number
        }
        Returns: number
      }
      calcular_percentual_estenose: {
        Args: { diametro_normal: number; diametro_residual: number }
        Returns: number
      }
      calcular_percentual_estenose_doppler: {
        Args: { velocidade_estenose: number; velocidade_pre_estenose: number }
        Returns: number
      }
      calcular_probabilidade_complicacoes_hernia: {
        Args: {
          dor_local?: boolean
          idade_paciente: number
          reduzivel?: boolean
          tamanho_defeito_cm: number
        }
        Returns: {
          necessita_cirurgia_urgente: boolean
          probabilidade_encarceramento: number
          probabilidade_estrangulamento: number
        }[]
      }
      calcular_relacao_ll: {
        Args: { comprimento: number; largura: number }
        Returns: number
      }
      calcular_risco_iota_simples: {
        Args: {
          p_diametro_maximo_mm: number
          p_presenca_ascite?: boolean
          p_presenca_nodulos?: boolean
          p_presenca_septos?: boolean
          p_presenca_solidos?: boolean
        }
        Returns: string
      }
      calcular_volume_calculo: {
        Args: {
          p_comprimento_mm: number
          p_espessura_mm: number
          p_largura_mm: number
        }
        Returns: number
      }
      calcular_volume_colecao: {
        Args: { p_medida1: number; p_medida2: number; p_medida3: number }
        Returns: number
      }
      calcular_volume_elipsoidal: {
        Args: { diametros: number[] }
        Returns: number
      }
      calcular_volume_elipsoide_universal: {
        Args: { p_a: number; p_b: number; p_c: number }
        Returns: number
      }
      calcular_volume_glandula_salivar: {
        Args: { comprimento: number; espessura: number; largura: number }
        Returns: number
      }
      calcular_volume_hepatico: {
        Args: { p_ap_cm: number; p_cc_cm: number; p_ll_cm: number }
        Returns: number
      }
      calcular_volume_musculoesqueletico: {
        Args: { comprimento: number; largura: number; profundidade: number }
        Returns: number
      }
      calcular_volume_ovariano: {
        Args: { p_ap_cm: number; p_cc_cm: number; p_ll_cm: number }
        Returns: number
      }
      calcular_volume_placa: {
        Args: { espessura: number; extensao: number; largura?: number }
        Returns: number
      }
      calcular_volume_prostatico: {
        Args: { altura_cm: number; comprimento_cm: number; largura_cm: number }
        Returns: number
      }
      calcular_volume_testicular: {
        Args: { altura_cm: number; comprimento_cm: number; largura_cm: number }
        Returns: number
      }
      calcular_volume_testicular_total: {
        Args: { vol_direito_ml: number; vol_esquerdo_ml: number }
        Returns: number
      }
      calcular_volume_tireoide: {
        Args: { comprimento: number; espessura: number; largura: number }
        Returns: number
      }
      calcular_washout_absoluto: {
        Args: { delayed_hu: number; post_hu: number; pre_hu: number }
        Returns: number
      }
      calcular_washout_relativo: {
        Args: { delayed_hu: number; post_hu: number }
        Returns: number
      }
      check_ai_credits: {
        Args: { p_user_id: string }
        Returns: {
          balance: number
          monthly_limit: number
          plan_type: string
        }[]
      }
      classificar_aneurisma_aorta:
        | { Args: { p_diametro_mm: number }; Returns: string }
        | {
            Args: {
              diametro_anteroposterior: number
              diametro_transverso: number
            }
            Returns: string
          }
      classificar_area_nervo_mediano: {
        Args: { area: number }
        Returns: string
      }
      classificar_assimetria_testicular: {
        Args: { vol_direito_ml: number; vol_esquerdo_ml: number }
        Returns: Json
      }
      classificar_ateromatose_aorta_iliaca: {
        Args: { grau: string; localizacao?: string }
        Returns: string
      }
      classificar_birads_cisto: {
        Args: {
          conteudo: string
          crescimento?: string
          nodulo_mural: string
          paredes: string
          septos: string
          vascularizacao: string
        }
        Returns: {
          categoria: string
          descricao: string
          recomendacao: string
          risco_malignidade: number
          tipo_cisto: string
        }[]
      }
      classificar_birads_nodulo: {
        Args: {
          calcificacoes: string
          crescimento?: string
          ecogenicidade: string
          forma: string
          margens: string
          orientacao: string
          sombra_acustica: string
          vascularizacao: string
        }
        Returns: {
          categoria: string
          descricao: string
          pontuacao: number
          recomendacao: string
          risco_malignidade: number
        }[]
      }
      classificar_cisto_testicular: {
        Args: { conteudo?: string; diametro_mm: number; localizacao: string }
        Returns: Json
      }
      classificar_co_rads: {
        Args: {
          distribuicao: string
          extensao_percentual?: number
          padrao_tc: string
        }
        Returns: string
      }
      classificar_colecao_parede_abdominal: {
        Args: {
          espessura_parede_mm: number
          presenca_debris?: boolean
          presenca_septos?: boolean
          volume_ml: number
        }
        Returns: {
          gravidade: string
          necessita_drenagem: boolean
          tipo_colecao: string
        }[]
      }
      classificar_conteudo_vesical: {
        Args: {
          aspecto?: string
          presenca_debris?: boolean
          presenca_ecogenicos?: boolean
        }
        Returns: Json
      }
      classificar_densidade_nodulo: {
        Args: { tipo_densidade: string }
        Returns: string
      }
      classificar_derrame_articular: {
        Args: { volume_ml: number }
        Returns: string
      }
      classificar_dissecao_aorta: {
        Args: {
          extensao_dissecao: string
          localizacao_entry: string
          tipo_dissecao: string
        }
        Returns: string
      }
      classificar_ecogenicidade_testicular: {
        Args: { ecogenicidade_atual: string; ecogenicidade_referencia?: string }
        Returns: Json
      }
      classificar_ectasia_ductal: {
        Args: {
          calibre: number
          conteudo: string
          localizacao: string
          vascularizacao: string
        }
        Returns: {
          categoria_birads: string
          descricao: string
          gravidade: string
          recomendacao: string
        }[]
      }
      classificar_espessura_bexiga: {
        Args: { espessura_mm: number; replecao?: string }
        Returns: Json
      }
      classificar_espessura_endometrial: {
        Args: { espessura_cm: number; fase_ciclo: string }
        Returns: string
      }
      classificar_espessura_fascia_plantar: {
        Args: { espessura: number }
        Returns: string
      }
      classificar_espessura_imt: {
        Args: { espessura: number; idade_paciente?: number }
        Returns: string
      }
      classificar_espessura_nervo_mediano: {
        Args: { espessura: number }
        Returns: string
      }
      classificar_espessura_parede: {
        Args: { espessura_medida_mm: number; localizacao?: string }
        Returns: string
      }
      classificar_espessura_tendao_calcaneo: {
        Args: { espessura: number }
        Returns: string
      }
      classificar_espessura_tendao_ombro: {
        Args: { espessura: number; tendao?: string }
        Returns: string
      }
      classificar_espessura_tendao_quadril: {
        Args: { espessura_mm: number; tendao_tipo?: string }
        Returns: string
      }
      classificar_esteatose: {
        Args: { p_indice_hepatico: number }
        Returns: string
      }
      classificar_estenose_arterial_doppler: {
        Args: {
          indice_velocidade: number
          velocidade_diastolica_final: number
          velocidade_pico_sistolica: number
        }
        Returns: string
      }
      classificar_estenose_carotidea: {
        Args: {
          indice_espectro?: number
          relacao_cca_aci?: number
          velocidade_pico_sistolica: number
        }
        Returns: string
      }
      classificar_fluxo_vertebral: {
        Args: {
          direcao_fluxo: string
          velocidade_diastolica?: number
          velocidade_sistolica?: number
        }
        Returns: string
      }
      classificar_glandula_salivar: {
        Args: {
          contornos: string
          ductos: string
          ecogenicidade: string
          ecotextura: string
          volume: number
        }
        Returns: {
          diagnostico: string
          gravidade: string
          recomendacao: string
        }[]
      }
      classificar_graf_completo: {
        Args: {
          achado_acetabulo?: string
          achado_cabeca?: string
          angulo_alfa: number
          angulo_beta: number
          idade_meses: number
        }
        Returns: string
      }
      classificar_gravidade_tvp: {
        Args: {
          extensao: string
          recanalizacao?: string
          veias_afetadas: number
        }
        Returns: string
      }
      classificar_hernia_ingl: {
        Args: { p_colo: number; p_tipo: string }
        Returns: string
      }
      classificar_hernia_por_tamanho: {
        Args: { p_colo: number }
        Returns: string
      }
      classificar_hidronefrose: {
        Args: { p_diametro_calice_mm?: number; p_diametro_pelve_mm: number }
        Returns: string
      }
      classificar_hmg_papile: {
        Args: {
          acometimento_parenquimal?: boolean
          dilatacao_ventricular?: boolean
          extensao_ventricular?: boolean
          grau: number
          lado?: string
        }
        Returns: Json
      }
      classificar_idade_trombose_venosa: {
        Args: {
          p_aderencia_parede: string
          p_calibre: string
          p_ecogenicidade: string
          p_mobilidade: string
          p_paredes: string
        }
        Returns: Json
      }
      classificar_itb: { Args: { valor_itb: number }; Returns: string }
      classificar_linfonodo_cervical: {
        Args: {
          comprimento: number
          contornos: string
          ecogenicidade: string
          hilo: string
          largura: number
          relacao_l_l: number
          vascularizacao: string
        }
        Returns: {
          classificacao: string
          descricao: string
          pontuacao_risco: number
          sugestivo_maligno: boolean
        }[]
      }
      classificar_lpv_de_vries: {
        Args: {
          extensao_subcortical?: boolean
          grau: number
          lado?: string
          presenca_cistos?: boolean
          tamanho_cistos_cm?: number
        }
        Returns: Json
      }
      classificar_lung_rads: {
        Args: {
          crescimento?: boolean
          diametro_mm: number
          novo_nodulo?: boolean
          tipo_densidade: string
        }
        Returns: string
      }
      classificar_massa_testicular: {
        Args: {
          diametro_mm: number
          ecogenicidade: string
          margens?: string
          vascularizacao?: string
        }
        Returns: Json
      }
      classificar_morfologia_nodulo: {
        Args: { morfologia: string[] }
        Returns: string
      }
      classificar_nodulo_adrenal: {
        Args: {
          delayed_hu: number
          post_hu: number
          pre_hu: number
          tamanho_mm: number
        }
        Returns: string
      }
      classificar_nodulo_tamanho: {
        Args: { diametro_mm: number }
        Returns: string
      }
      classificar_placa_carotidea: {
        Args: {
          calcificacoes?: boolean
          ecogenicidade: string
          ecotextura: string
          superficie: string
        }
        Returns: string
      }
      classificar_placa_doppler: {
        Args: {
          calcificacao: boolean
          ecogenicidade: string
          espessura_placa: number
          superficie_placa: string
        }
        Returns: string
      }
      classificar_posicao_diu: {
        Args: {
          distancia_fundo_cm: number
          distancia_serosa_cm: number
          posicao_cervical: string
        }
        Returns: string
      }
      classificar_posicao_uterina: {
        Args: { posicao: string }
        Returns: string
      }
      classificar_replecao_vesical: {
        Args: { volume_ml: number }
        Returns: string
      }
      classificar_residuo_pos_miccional: {
        Args: { volume_ml: number }
        Returns: Json
      }
      classificar_risco_hernia_incisional: {
        Args: { largura_defeito_cm?: number; tamanho_defeito_cm: number }
        Returns: {
          necessita_cirurgia: boolean
          recomendacao: string
          risco: string
        }[]
      }
      classificar_roubo_subclavia: {
        Args: { grau_roubo: string; velocidade_vertebral?: number }
        Returns: string
      }
      classificar_sindrome_pos_trombotica: {
        Args: {
          p_calibre_irregular: boolean
          p_colaterais_visiveis: boolean
          p_obstrucao_venosa: boolean
          p_paredes_espessadas: boolean
          p_refluxo_multiplo: boolean
        }
        Returns: Json
      }
      classificar_tirads_2025: {
        Args: {
          composicao: string
          ecogenicidade: string
          focos_ecogenicos: string
          formato: string
          margens: string
        }
        Returns: number
      }
      classificar_varicocele: {
        Args: { diametro_mm: number; refluxo_valsalva?: boolean }
        Returns: Json
      }
      classificar_vascularizacao_doppler: {
        Args: { p_fluxo: string; p_intensidade?: string }
        Returns: string
      }
      classificar_vesiculas_seminais: {
        Args: { diametro_mm: number; ecotextura?: string; simetria?: string }
        Returns: Json
      }
      classificar_volume_derrame_punho: {
        Args: { volume: number }
        Returns: string
      }
      classificar_volume_ovariano: {
        Args: { p_fase_menstrual?: string; p_volume_cm3: number }
        Returns: string
      }
      classificar_volume_prostatico:
        | { Args: { p_idade: number; p_volume_cm3: number }; Returns: string }
        | { Args: { volume_cm3: number }; Returns: Json }
      classificar_volume_testicular: {
        Args: { volume_ml: number }
        Returns: Json
      }
      classificar_volume_uterino: {
        Args: { idade_paciente: number; volume_cm3: number }
        Returns: string
      }
      componente_abscesso_subcutaneo: {
        Args: {
          conteudo?: string
          lado: string
          medida_a_cm: number
          medida_b_cm: number
          regiao: string[]
        }
        Returns: string
      }
      componente_acetabulo_infantil: {
        Args: { achado_acetabulo?: string }
        Returns: string
      }
      componente_acromioclavicular: {
        Args: { situacao?: string }
        Returns: string
      }
      componente_adenoides_aumentadas: {
        Args: { grau?: string; reducao_coluna_aerea?: boolean }
        Returns: string
      }
      componente_adenoma_adrenal: {
        Args: {
          delayed_hu: number
          lado: string
          post_hu: number
          pre_hu: number
          tamanho_cm: number
        }
        Returns: string
      }
      componente_adrenal_normal: { Args: { lado: string }; Returns: string }
      componente_alcas_intestinais_normais: { Args: never; Returns: string }
      componente_alinhamento_coluna: {
        Args: {
          direcao_escoliose?: string
          grau_escoliose?: number
          posicao_exame?: string
          regiao?: string
          tipo_alinhamento?: string
        }
        Returns: string
      }
      componente_alteracoes_benignas_cranio: {
        Args: {
          lado: string
          medida_a_cm?: number
          medida_b_cm?: number
          regiao: string[]
          tipo: string
        }
        Returns: string
      }
      componente_alteracoes_mama_pos_cirurgica: {
        Args: {
          calcificações?: boolean
          densidade_gordura?: boolean
          esteatonecrose?: boolean
          lado?: string
          regioes_afetadas?: string[]
          retração_cutânea?: boolean
          tipo_cirurgia?: string
        }
        Returns: string
      }
      componente_alteracoes_osseas_toracicas: {
        Args: {
          acometimento?: string
          costela?: string
          costela_final?: string
          costela_inicial?: string
          fratura?: boolean
          fraturas_multiplas?: boolean
          ilhota_ossea?: boolean
          lesoes_osteoblasticas?: boolean
          lesoes_osteoliticas?: boolean
          localizacao?: string
          metastaticas?: boolean
          porcao?: string
          porcao_ilhota?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_alteracoes_pos_cirurgicas: {
        Args: {
          grau?: string
          lado?: string
          localizacao?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_alteracoes_pos_cirurgicas_septo: {
        Args: {
          descontinuidade?: boolean
          procedimento?: string
          tipo?: string
        }
        Returns: string
      }
      componente_aneurisma: {
        Args: {
          colo?: string
          localizacao?: string
          observacao?: string
          orientacao?: string
          tamanho?: string
          tipo?: string
          vaso: string
        }
        Returns: string
      }
      componente_aneurisma_aorta: {
        Args: { diametro_cm: number; localizacao: string }
        Returns: string
      }
      componente_aneurisma_basilar: {
        Args: {
          colo?: string
          localizacao?: string
          observacao?: string
          orientacao?: string
          tamanho?: string
          tipo?: string
        }
        Returns: string
      }
      componente_aneurisma_fusiforme_basilar: {
        Args: { observacao?: string; tamanho?: string }
        Returns: string
      }
      componente_aneurisma_vertebral: {
        Args: {
          colo?: string
          lado: string
          localizacao?: string
          observacao?: string
          orientacao?: string
          tamanho?: string
          tipo?: string
        }
        Returns: string
      }
      componente_angulos_graf: {
        Args: {
          angulo_alfa?: number
          angulo_beta?: number
          idade_meses?: number
          tipo_classificacao?: string
        }
        Returns: string
      }
      componente_aorta_aneurisma: {
        Args: {
          colo_distal?: number
          colo_proximal?: number
          diametro_maximo: number
          extensao?: number
          localizacao: string
          presenca_trombo?: string
        }
        Returns: string
      }
      componente_aorta_ateromatosa: { Args: never; Returns: string }
      componente_aorta_ectasia: {
        Args: { diametro: number; localizacao: string }
        Returns: string
      }
      componente_aorta_normal:
        | {
            Args: {
              diametro_bifurcacao?: number
              diametro_infrarrenal?: number
              diametro_suprarrenal?: number
            }
            Returns: string
          }
        | { Args: never; Returns: string }
      componente_aorta_placa: {
        Args: {
          classificacao?: string
          espessura?: number
          estenose_associada?: string
          extensao?: number
          localizacao: string
        }
        Returns: string
      }
      componente_aorta_trombose: {
        Args: { conteudo?: string; extensao?: number; localizacao: string }
        Returns: string
      }
      componente_apendice_normal: { Args: never; Returns: string }
      componente_apendicite_aguda: {
        Args: { complicacoes: string[] }
        Returns: string
      }
      componente_arco_aortico: {
        Args: { achado?: string; observacao?: string; segmentos?: string }
        Returns: string
      }
      componente_artéria_carotida_normal: {
        Args: {
          lado: string
          segmento?: string
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_arteria_estenose: {
        Args: {
          grau_estenose: string
          indice_velocidade?: number
          nome_arteria: string
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_arteria_normal: {
        Args: {
          diametro?: number
          indice_pulsatilidade?: number
          indice_resistividade?: number
          nome_arteria: string
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_arteria_ocluida: {
        Args: {
          colaterais?: string
          extensao_oclusao?: string
          nome_arteria: string
        }
        Returns: string
      }
      componente_artéria_vertebral_normal: {
        Args: {
          direcao_fluxo?: string
          lado: string
          velocidade_diastolica?: number
          velocidade_sistolica?: number
        }
        Returns: string
      }
      componente_articulacoes_atloido_axis: {
        Args: {
          p_alargamento?: string
          p_artrose?: string
          p_assimetria?: string
          p_espaco_articular?: string
          p_estreitamento?: string
          p_liquido?: string
          p_luxacao?: string
          p_osteofitos?: string
          p_subluxacao?: string
        }
        Returns: string
      }
      componente_articulacoes_atloido_occipitais: {
        Args: {
          p_alargamento?: string
          p_artrose?: string
          p_assimetria?: string
          p_espaco_articular?: string
          p_estreitamento?: string
          p_liquido?: string
          p_osteofitos?: string
        }
        Returns: string
      }
      componente_ascite_acentuada: { Args: never; Returns: string }
      componente_ascite_minima: { Args: never; Returns: string }
      componente_ascite_moderada: { Args: never; Returns: string }
      componente_aspecto_paradoxal_cornetos: {
        Args: { cornetos?: string[]; lado?: string }
        Returns: string
      }
      componente_assimetria_fossas_etmoidais: {
        Args: { grau?: string; lado_mais_baixo?: string }
        Returns: string
      }
      componente_assimetria_ventricular: {
        Args: { caracter?: string; lado_maior?: string }
        Returns: string
      }
      componente_atelectasia: {
        Args: {
          extensao?: string
          lobo: string
          segmentos?: string[]
          tipo?: string
        }
        Returns: string
      }
      componente_atelectasia_uncinada: { Args: never; Returns: string }
      componente_ateromatose_vertebral: {
        Args: {
          estenose?: string
          lado: string
          observacao?: string
          tipo?: string
        }
        Returns: string
      }
      componente_atresia_cae: {
        Args: {
          lado?: string
          pavilhao_auricular?: string
          tipo_atresia?: string
        }
        Returns: string
      }
      componente_atrofia_cerebral: {
        Args: { grau?: string; lado?: string; lobos?: string[]; tipo?: string }
        Returns: string
      }
      componente_atrofia_cerebral_idade_especifica: {
        Args: { grau_atrofia?: string }
        Returns: string
      }
      componente_ausencia_fraturas_calota: { Args: never; Returns: string }
      componente_ausencia_hernia: {
        Args: { p_lateralidade?: string; p_regiao?: string }
        Returns: string
      }
      componente_baco_normal: { Args: never; Returns: string }
      componente_basilar: {
        Args: { achado?: string; observacao?: string }
        Returns: string
      }
      componente_bexiga_espessada:
        | {
            Args: {
              espessura_parede_mm?: number
              padrao?: string
              replecao?: string
            }
            Returns: string
          }
        | { Args: never; Returns: string }
      componente_bexiga_normal:
        | {
            Args: {
              conteudo?: string
              espessura_parede_mm?: number
              replecao?: string
            }
            Returns: string
          }
        | { Args: never; Returns: string }
      componente_biceps_cabeca_longa: {
        Args: {
          espessura?: number
          liquido_bainha?: boolean
          situacao?: string
          subluxado?: boolean
        }
        Returns: string
      }
      componente_biceps_distal_cotovelo: {
        Args: { com_bursite?: boolean; distancia_coto?: number; estado: string }
        Returns: string
      }
      componente_bronquios: {
        Args: {
          aspergiloma?: boolean
          bronquiectasias?: boolean
          calcificacao?: boolean
          caracteristicas?: string
          conteudo?: string
          infeccao?: boolean
          localizacao?: string
          secrecao?: boolean
          segmento?: string
          tipo_alteracao?: string
          tipo_bronquiectasia?: string
        }
        Returns: string
      }
      componente_bulbo_aci: {
        Args: { achado?: string; lado: string; observacao?: string }
        Returns: string
      }
      componente_bursa_normal: { Args: { nome_bursa: string }; Returns: string }
      componente_bursa_olecraniana_cotovelo: {
        Args: { estado: string; medidas?: Record<string, unknown> }
        Returns: string
      }
      componente_bursa_subacromial: {
        Args: { situacao?: string }
        Returns: string
      }
      componente_bursas_quadril: {
        Args: {
          achado_bursa?: string
          bursa_localizacao?: string
          unidade_medida?: string
          volume_liquido?: number
        }
        Returns: string
      }
      componente_bursite_com_medidas: {
        Args: {
          altura: number
          largura: number
          nome_bursa: string
          profundidade: number
        }
        Returns: string
      }
      componente_bursite_sem_medidas: {
        Args: { nome_bursa: string }
        Returns: string
      }
      componente_cabeca_femoral_infantil: {
        Args: { achado_cabeca?: string }
        Returns: string
      }
      componente_calcificacao_discal: {
        Args: {
          p_dimensoes?: string
          p_intensidade?: string
          p_localizacao?: string
          p_nivel?: string
          p_relacao_com_hernia?: string
          p_tipo?: string
        }
        Returns: string
      }
      componente_calcificacoes_cardiacas: {
        Args: {
          localizacao?: string
          padrao?: string
          septo_interventricular?: boolean
          tipo?: string
        }
        Returns: string
      }
      componente_calcificacoes_multiplas: {
        Args: { etiologia?: string; localizacao?: string; padrao?: string }
        Returns: string
      }
      componente_calibre_fluxo: {
        Args: {
          calibre?: string
          fluxo?: string
          observacao?: string
          vaso: string
        }
        Returns: string
      }
      componente_canal_coluna: {
        Args: {
          p_area_canal?: string
          p_diametro_anteroposterior?: string
          p_diametro_transverso?: string
          p_estreitamento?: string
          p_grau_estenose?: string
          p_regiao?: string
          p_tipo_estreitamento?: string
        }
        Returns: string
      }
      componente_canal_guyon_punho: {
        Args: {
          doppler?: string
          medidas?: string
          situacao?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_carotidas_comuns: {
        Args: { achado?: string; lado?: string; observacao?: string }
        Returns: string
      }
      componente_cavidade_abdominal_normal: { Args: never; Returns: string }
      componente_cavidade_oral: {
        Args: {
          achado?: string
          extensao_gengiva_inferior?: boolean
          extensao_gengiva_superior?: boolean
          extensao_labio_inferior?: boolean
          extensao_labio_superior?: boolean
          extensao_lingua?: boolean
          extensao_palato_duro?: boolean
          extensao_soalho_boca?: boolean
          extensao_trigono_retromolar?: boolean
          invasao_mandibula?: boolean
          invasao_maxila?: boolean
          invasao_osso?: boolean
          invasao_rebordo_alveolar?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_cistite: { Args: never; Returns: string }
      componente_cisto_aracnoide: {
        Args: {
          conteudo?: string
          espessura_paredes?: string
          lado?: string
          localizacao: string
          volume_cm3?: number
        }
        Returns: string
      }
      componente_cisto_aracnoide_idoso: {
        Args: {
          desvio_cm?: number
          dimensoes_cm?: string[]
          efeito_expansivo?: boolean
          lado?: string
          localizacao?: string[]
        }
        Returns: string
      }
      componente_cisto_baker: {
        Args: { estado: string; medidas?: Record<string, unknown> }
        Returns: string
      }
      componente_cisto_coloide_idoso: {
        Args: { dimensoes_cm?: number; localizacao?: string }
        Returns: string
      }
      componente_cisto_esplenico: {
        Args: { diametro_cm: number; localizacao: string }
        Returns: string
      }
      componente_cisto_ganglionar_punho: {
        Args: {
          localizacao?: string
          medidas?: string
          origem?: string
          situacao?: string
        }
        Returns: string
      }
      componente_cisto_hepatico_simples: {
        Args: { diametro_cm: number; lobo: string; segmento: string }
        Returns: string
      }
      componente_cisto_inclusao_epidermica: {
        Args: {
          p_conteudo?: string
          p_distancia_pele?: number
          p_lateralidade?: string
          p_medida1?: number
          p_medida2?: number
          p_medida3?: number
          p_paredes?: string
          p_regiao?: string
        }
        Returns: string
      }
      componente_cisto_mediastinal_congenito: {
        Args: {
          contorno_interno_esofago?: boolean
          localizacao?: string
          relacao_esofago?: boolean
          tamanho_transverso_cm?: number
          tipo?: string
        }
        Returns: string
      }
      componente_cisto_pericardico: {
        Args: {
          densidade?: string
          impregnacao_contraste?: boolean
          localizacao?: string
          tamanho_transverso_cm?: number
        }
        Returns: string
      }
      componente_cisto_popliteo: {
        Args: {
          conteudo?: string
          extensao?: string
          lateralidade: string
          medida?: string
          paredes?: string
        }
        Returns: string
      }
      componente_cisto_renal_complexo: {
        Args: {
          complicacoes: string[]
          diametro_cm: number
          localizacao: string
          rim: string
        }
        Returns: string
      }
      componente_cisto_renal_simples: {
        Args: { diametro_cm: number; localizacao: string; rim: string }
        Returns: string
      }
      componente_cisto_sebacco: {
        Args: {
          lado: string
          medida_a_cm: number
          medida_b_cm: number
          regiao: string[]
        }
        Returns: string
      }
      componente_cisto_testicular: {
        Args: { conteudo?: string; diametro_mm: number; localizacao: string }
        Returns: string
      }
      componente_cisto_timpico: {
        Args: {
          densidade?: string
          extensao?: string
          localizacao?: string
          predominancia?: string
          tamanho_maximo_cm?: number
          topografia?: string
        }
        Returns: string
      }
      componente_cistos_polipos_paranasais_idoso: {
        Args: { localizacao?: string[]; tipo?: string }
        Returns: string
      }
      componente_classificacao_malignidade: {
        Args: {
          criterios?: string
          lado?: string
          nivel?: string
          observacao?: string
          suspeita?: string
          tamanho?: string
        }
        Returns: string
      }
      componente_colecao_extra_axial: {
        Args: {
          caracteristicas?: string
          lado?: string
          localizacao: string
          tipo: string
          volume_cm3?: number
        }
        Returns: string
      }
      componente_colecao_organizada: {
        Args: {
          p_conteudo?: string
          p_distancia_pele?: number
          p_lateralidade?: string
          p_medida1?: number
          p_medida2?: number
          p_medida3?: number
          p_paredes?: string
          p_plano?: string
          p_regiao?: string
          p_septos?: string
        }
        Returns: string
      }
      componente_colecao_pancreatica_aguda: {
        Args: { localizacao: string; medida_a_cm: number; medida_b_cm: number }
        Returns: string
      }
      componente_colecistite_aguda: {
        Args: { complicacoes: string[] }
        Returns: string
      }
      componente_colecistolitase: {
        Args: { quantidade: string }
        Returns: string
      }
      componente_colesteatoma_adquirido: {
        Args: {
          detalhes_erosao?: string
          erosao_ossicular?: boolean
          extensao_antro?: boolean
          lado?: string
          localizacao_cavidade?: string[]
        }
        Returns: string
      }
      componente_colesteatoma_cae: {
        Args: {
          arqueamento_membrana?: boolean
          lado?: string
          paredes_erosao?: string[]
        }
        Returns: string
      }
      componente_colesteatoma_pars_flacida: {
        Args: {
          deslocamento_medial?: boolean
          detalhes_erosao?: string
          erosao_ossicular?: boolean
          lado?: string
          remodelamento_esporao?: boolean
        }
        Returns: string
      }
      componente_colesteatoma_pars_tensa: {
        Args: {
          deslocamento_lateral?: boolean
          detalhes_erosao?: string
          erosao_ossicular?: boolean
          lado?: string
          localizacao?: string
        }
        Returns: string
      }
      componente_complexo_intimal_normal: {
        Args: { espessura?: number; lado: string }
        Returns: string
      }
      componente_contusao_cerebral: {
        Args: {
          efeito_tumefativo?: boolean
          hemorragica?: boolean
          lado?: string
          regioes: string[]
        }
        Returns: string
      }
      componente_cornetos_nasais_normais: { Args: never; Returns: string }
      componente_corpos_vertebrais: {
        Args: {
          alteracoes_morfologicas?: string
          altura?: string
          grau_osteofitos?: string
          infiltracao_medular?: string
          localizacao_osteofitos?: string
          nivel_alteracao?: string
          osteofitos?: string
          regiao?: string
        }
        Returns: string
      }
      componente_covid_tc: {
        Args: {
          aspecto_clinico?: string
          distribuicao: string
          extensao_percentual: number
          padrao_tc: string
        }
        Returns: string
      }
      componente_degenerativo_coluna: {
        Args: {
          p_artrose_facetaria?: string
          p_escalopeamento?: string
          p_escalopeamento_anterior?: string
          p_escalopeamento_posterior?: string
          p_espessamento_osteofitico?: string
          p_localizacao_osteofitos?: string
          p_osteofitos?: string
          p_regiao?: string
          p_subluxacao?: string
          p_subluxacao_anterolistese?: string
          p_subluxacao_retrolistese?: string
        }
        Returns: string
      }
      componente_dens_axis: {
        Args: {
          p_cisto?: string
          p_corte?: string
          p_desvio?: string
          p_erosao?: string
          p_fratura?: string
          p_integridade?: string
          p_morfologia?: string
          p_tipo_fratura?: string
        }
        Returns: string
      }
      componente_derrame_articular_pe: {
        Args: {
          articulacao?: string
          dedo?: string
          situacao?: string
          volume?: string
        }
        Returns: string
      }
      componente_derrame_articular_punho: {
        Args: { localizacao?: string; situacao?: string; volume?: string }
        Returns: string
      }
      componente_derrame_articular_quadril: {
        Args: { achado_derrame?: string; volume_derrame?: string }
        Returns: string
      }
      componente_derrame_articular_tornozelo: {
        Args: { articulacao?: string; situacao?: string; volume?: string }
        Returns: string
      }
      componente_derrame_ausente: { Args: never; Returns: string }
      componente_derrame_presente: { Args: { volume: string }; Returns: string }
      componente_desidratacao_discal: {
        Args: {
          p_altura?: string
          p_grau?: string
          p_integridade_anel?: string
          p_nivel?: string
          p_sinal?: string
          p_tipo_desidratacao?: string
        }
        Returns: string
      }
      componente_desvio_linha_mediana: {
        Args: {
          desvio_cm?: number
          direcao?: string
          estrutura?: string
          nivel?: string
        }
        Returns: string
      }
      componente_desvio_septo_nasal: {
        Args: {
          contato_corne?: string
          contato_lado?: string
          esporao?: boolean
          esporao_lado?: string
          lado?: string
          segmento?: string
          severidade?: string
        }
        Returns: string
      }
      componente_dilatacao_ventricular: {
        Args: {
          graduacao?: string
          indice_frontal_direito?: number
          indice_frontal_esquerdo?: number
          localizacao?: string
          tipo?: string
        }
        Returns: string
      }
      componente_dilatacao_vias_biliares: {
        Args: { diametro_mm: number; localizacao: string }
        Returns: string
      }
      componente_discos_coluna: {
        Args: {
          altura_discos?: string
          degeneracao_gasosa?: boolean
          esclerose_platoss?: boolean
          hernias_schmorl?: boolean
          reducao_niveis?: string[]
          regiao?: string
        }
        Returns: string
      }
      componente_discos_intervertebrais: {
        Args: {
          p_altura?: string
          p_calcificacao?: string
          p_degeneracao?: string
          p_desidratacao?: string
          p_extrusao?: string
          p_integridade?: string
          p_localizacao_hernia?: string
          p_migracao_fragmento?: string
          p_protrusao?: string
          p_regiao?: string
          p_sequestracao?: string
          p_sinal_disco?: string
          p_tipo_hernia?: string
        }
        Returns: string
      }
      componente_disseccao: {
        Args: {
          achados?: string
          localizacao?: string
          observacao?: string
          tipo?: string
          vaso: string
        }
        Returns: string
      }
      componente_disseccao_aci: {
        Args: {
          achados?: string
          calcificacao?: string
          lado: string
          observacao?: string
        }
        Returns: string
      }
      componente_disseccao_vertebral: {
        Args: {
          achado?: string
          lado: string
          observacao?: string
          segmentos?: string
          tipo_achado?: string
        }
        Returns: string
      }
      componente_disseminacao_perineural: {
        Args: {
          base_craneo?: boolean
          extensao?: string
          forame?: string
          fossa?: string
          lado?: string
          nervo?: string
          observacao?: string
        }
        Returns: string
      }
      componente_diverticulite_aguda: {
        Args: { complicacoes: string[]; localizacao: string[] }
        Returns: string
      }
      componente_diverticulo_kommerel: {
        Args: { achado?: string; lado?: string; observacao?: string }
        Returns: string
      }
      componente_diverticulose_sem_inflamacao: {
        Args: { localizacao: string[] }
        Returns: string
      }
      componente_doenca_endo_periodondica: {
        Args: { localizacao?: string; severidade?: string; tipo?: string }
        Returns: string
      }
      componente_drenagem_extra_craniana: {
        Args: {
          lado_trepanacao: string
          localizacao_extremidade: string[]
          regiao_trepanacao: string[]
          tipo_drenagem?: string
        }
        Returns: string
      }
      componente_ectasia_ventricular: {
        Args: { grau?: string; tipo?: string }
        Returns: string
      }
      componente_ectasia_ventricular_compensatoria_idoso: {
        Args: { grau_ectasia?: string; tipo_ectasia?: string }
        Returns: string
      }
      componente_ectasia_ventricular_prominente: {
        Args: {
          grau_ectasia?: string
          proporcionalidade?: string
          tipo_ectasia?: string
        }
        Returns: string
      }
      componente_edema: {
        Args: {
          extensao?: string
          lamina_liquida?: string
          lateralidade: string
          localizacao?: string
        }
        Returns: string
      }
      componente_edema_parede: {
        Args: { p_grau?: string; p_lateralidade?: string; p_regiao?: string }
        Returns: string
      }
      componente_edema_partes_moles: {
        Args: { grau?: string; lado: string; regiao: string[] }
        Returns: string
      }
      componente_edema_subcutaneo: {
        Args: { localizacao: string }
        Returns: string
      }
      componente_elastofibroma: {
        Args: {
          bilateral?: boolean
          caracteristicas?: string
          compativel?: boolean
          densidade?: string
          forma?: string
          localizacao?: string
        }
        Returns: string
      }
      componente_endometrio_transvaginal: {
        Args: { aspecto: string; espessura_cm: number; fase_ciclo: string }
        Returns: string
      }
      componente_enfisema: {
        Args: { distribuicao?: string; predominancia?: string; tipo: string }
        Returns: string
      }
      componente_entesofito: { Args: { localizacao: string }; Returns: string }
      componente_epididimite: {
        Args: { diametro_mm: number; lado: string }
        Returns: string
      }
      componente_epididimo_normal: {
        Args: { diametro_mm?: number; lado: string }
        Returns: string
      }
      componente_epiglote: {
        Args: {
          achado?: string
          extensao_face_lingual?: boolean
          extensao_prega_ari_epiglotica?: boolean
          extensao_valécula?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_esclerose_cronica_paranasal_idoso: {
        Args: { localizacao?: string[] }
        Returns: string
      }
      componente_espaco_atloido_dental: {
        Args: {
          p_alargamento?: string
          p_assimetria?: string
          p_estreitamento?: string
          p_limite_normal?: string
          p_mensuração?: string
          p_presenca_liquido?: string
        }
        Returns: string
      }
      componente_espacos_intermetatarsicos_pe: {
        Args: { espaco?: string; medida?: number; situacao?: string }
        Returns: string
      }
      componente_espacos_liquoricos_retrocerebelares: {
        Args: { efeito_expansivo?: boolean }
        Returns: string
      }
      componente_espessamento_cornetos_nasais: {
        Args: {
          cornetos?: string[]
          lado?: string
          reducao_espaco?: boolean
          secrecao?: boolean
        }
        Returns: string
      }
      componente_espessamento_mucoso_paranasal_idoso: {
        Args: {
          aspecto_ondulado?: boolean
          cistos_retencao?: boolean
          localizacao?: string[]
        }
        Returns: string
      }
      componente_esplenomegalia: {
        Args: { tamanho_cm: number }
        Returns: string
      }
      componente_estadiamento_tnm: {
        Args: {
          m_estagio?: string
          n_estagio?: string
          observacao?: string
          t_estagio?: string
        }
        Returns: string
      }
      componente_estadio_n: {
        Args: {
          descricao?: string
          estagio?: string
          extensao_extra_nodal?: string
          lateraliade?: string
          numero_nodos?: string
          observacao?: string
          tamanho_maximo?: string
        }
        Returns: string
      }
      componente_esteatose_hepatica: { Args: { grau: string }; Returns: string }
      componente_estenose: {
        Args: {
          criterio?: string
          grau?: string
          localizacao?: string
          observacao?: string
          percentual?: string
          vaso: string
        }
        Returns: string
      }
      componente_estenose_basilar: {
        Args: { grau?: string; observacao?: string; tipo_placa?: string }
        Returns: string
      }
      componente_estenose_carotida_comum: {
        Args: {
          emergencia?: string
          grau?: string
          lado: string
          localizacao?: string
          observacao?: string
        }
        Returns: string
      }
      componente_estenose_carotidea: {
        Args: {
          indice_espectro?: number
          lado: string
          relacao_cca_aci?: number
          segmento?: string
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_estenose_cervical: {
        Args: {
          p_area_canal?: string
          p_diametro_anteroposterior?: string
          p_diametro_transverso?: string
          p_dimensoes?: string
          p_grau?: string
          p_localizacao?: string
          p_nivel?: string
          p_relacao_com_hernia?: string
          p_relacao_com_ligamentos?: string
          p_relacao_com_osteofitos?: string
          p_tipo?: string
        }
        Returns: string
      }
      componente_estenose_subclavia: {
        Args: {
          grau?: string
          lado: string
          localizacao?: string
          observacao?: string
          tipo_placa?: string
        }
        Returns: string
      }
      componente_estenose_tronco_braquiocefalico: {
        Args: { grau?: string; observacao?: string; tipo_placa?: string }
        Returns: string
      }
      componente_estenose_vertebral: {
        Args: {
          lado: string
          localizacao?: string
          observacao?: string
          segmentos?: string
          tipo?: string
        }
        Returns: string
      }
      componente_estruturas_centro_medianas: {
        Args: { desvio?: boolean; desvio_cm?: number; estrutura?: string }
        Returns: string
      }
      componente_estruturas_osseas_normal: { Args: never; Returns: string }
      componente_etmoidectomia: {
        Args: { extensao?: string; lado?: string; tipo?: string }
        Returns: string
      }
      componente_exostose_cae: {
        Args: {
          conteudo_medial?: boolean
          lado?: string
          quantidade?: string
          tipo_base?: string
        }
        Returns: string
      }
      componente_extensao_extra_laringea: {
        Args: {
          contato_carotida?: boolean
          estruturas?: string
          invasao_base_lingua?: boolean
          invasao_esofago?: boolean
          invasao_glandula_tireoide?: boolean
          invasao_mediastino?: boolean
          invasao_ossea?: boolean
          invasao_traqueia?: boolean
          obliteracao_espaco_prevertebral?: boolean
          observacao?: string
          percentual_carotida?: string
        }
        Returns: string
      }
      componente_extensores_cotovelo: {
        Args: { estado: string; localizacao?: string }
        Returns: string
      }
      componente_extensores_pe: {
        Args: { dedo?: string; situacao?: string }
        Returns: string
      }
      componente_extensores_punho: {
        Args: {
          compartimento?: string
          dedos_afetados?: string
          situacao?: string
        }
        Returns: string
      }
      componente_facetas_coluna: {
        Args: {
          grau_artropatia?: string
          hipertrofia?: boolean
          lado?: string
          niveis?: string[]
          regiao?: string
          tipo_artropatia?: string
        }
        Returns: string
      }
      componente_faringe: {
        Args: {
          achado?: string
          extensao_anterior?: string
          extensao_inferior?: string
          extensao_lateral?: string
          extensao_medial?: string
          extensao_posterior?: string
          extensao_superior?: string
          invasao_base_craneo?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          reducao_luz?: boolean
          tamanho?: string
          tipo?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_fascia_plantar: {
        Args: {
          banda?: string
          distancia_insercao?: number
          espessura?: number
          localizacao_terco?: string
          situacao?: string
        }
        Returns: string
      }
      componente_fascia_plantar_proximal_tornozelo: {
        Args: {
          banda?: string
          distancia_insercao?: number
          espessura?: number
          localizacao_terco?: string
          situacao?: string
        }
        Returns: string
      }
      componente_femoral_comum: {
        Args: {
          diametro?: number
          indice_resistividade?: number
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_femoral_superficial: {
        Args: {
          diametro?: number
          indice_resistividade?: number
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_fenestracao_basilar: {
        Args: { observacao?: string }
        Returns: string
      }
      componente_ferida_cirurgica_recente: {
        Args: { lado: string; regiao: string[]; tipo_cirurgia?: string }
        Returns: string
      }
      componente_fibrose_cicatricial: {
        Args: {
          p_distancia_pele?: number
          p_ecogenicidade?: string
          p_formato?: string
          p_lateralidade?: string
          p_limites?: string
          p_medida1?: number
          p_medida2?: number
          p_medida3?: number
          p_plano?: string
          p_regiao?: string
          p_sombra?: string
          p_vascularizacao?: string
        }
        Returns: string
      }
      componente_fibrose_medial_cae: {
        Args: {
          contato_membrana?: boolean
          formato_material?: string
          lado?: string
        }
        Returns: string
      }
      componente_fibulares: {
        Args: {
          indice_resistividade?: number
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_figado_normal: {
        Args: { tamanho_cm: number }
        Returns: string
      }
      componente_flexores_cotovelo: {
        Args: { estado: string; localizacao?: string }
        Returns: string
      }
      componente_flexores_pe: {
        Args: { dedo?: string; situacao?: string }
        Returns: string
      }
      componente_flexores_punho: {
        Args: { situacao?: string; tendao?: string }
        Returns: string
      }
      componente_foco_calcificacao_residual: {
        Args: { lado?: string; localizacao: string[] }
        Returns: string
      }
      componente_focos_gasosos_subcutaneos: {
        Args: { lado: string; origem?: string; regiao: string[] }
        Returns: string
      }
      componente_fossas_etmoidais_normais: { Args: never; Returns: string }
      componente_fratura_arco_zigomatico: {
        Args: { desalinhamento?: boolean; extensao?: string; lado: string }
        Returns: string
      }
      componente_fratura_base_cranio: {
        Args: { complicacoes?: string; localizacao: string; tipo?: string }
        Returns: string
      }
      componente_fratura_calota: {
        Args: {
          desalinhamento?: boolean
          lado: string
          regiao: string[]
          tipo?: string
        }
        Returns: string
      }
      componente_fratura_face: {
        Args: {
          complicacoes?: string
          desalinhamento?: boolean
          lado: string
          osso: string
          regiao: string[]
        }
        Returns: string
      }
      componente_fratura_mandibula: {
        Args: {
          desalinhamento?: boolean
          extensao?: string
          lado: string
          regiao: string[]
        }
        Returns: string
      }
      componente_fratura_orbita: {
        Args: {
          complicacoes?: string
          desalinhamento?: boolean
          lado: string
          parede: string[]
        }
        Returns: string
      }
      componente_fratura_ossos_temporais: {
        Args: {
          cadeia_ossicular?: boolean
          lado: string
          regiao: string
          subluxacao?: boolean
          tipo: string
        }
        Returns: string
      }
      componente_fratura_processo_pterigoideo: {
        Args: { lado: string; segmento?: string[] }
        Returns: string
      }
      componente_fratura_seio_maxilar: {
        Args: {
          desalinhamento?: boolean
          hemossinus?: boolean
          lado: string
          parede: string[]
        }
        Returns: string
      }
      componente_fratura_vertebral: {
        Args: {
          acometimento_medular?: boolean
          grau_compressao?: number
          grau_retropulsao?: string
          nivel?: string
          retropulsao?: string
          tipo_fratura?: string
        }
        Returns: string
      }
      componente_gengivas: {
        Args: {
          achado?: string
          extensao_anterior?: string
          extensao_inferior?: string
          extensao_lateral?: string
          extensao_medial?: string
          extensao_posterior?: string
          extensao_superior?: string
          invasao_mandibula?: boolean
          invasao_maxila?: boolean
          invasao_rebordo_alveolar?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          segmento?: string
          tamanho?: string
          tipo?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_glandula_salivar: {
        Args: {
          achado?: string
          calcificacao?: boolean
          contornos?: string
          densidade?: string
          dilatacao_ductal?: boolean
          glandula?: string
          lado?: string
          lesao?: boolean
          observacao?: string
          realce?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_glenoumeral: {
        Args: { situacao?: string; volume_derrame?: string }
        Returns: string
      }
      componente_gordura_hoffa: {
        Args: { estado: string; localizacao?: string }
        Returns: string
      }
      componente_hematoma_epidural: {
        Args: {
          desvio_cm?: number
          desvio_mediana?: boolean
          forma?: string
          lado: string
          localizacao?: string
          tempo?: string
          volume_cm3?: number
        }
        Returns: string
      }
      componente_hematoma_epidural_idoso: {
        Args: {
          desvio_cm?: number
          efeito_expansivo?: boolean
          espessura_cm?: number
          lado?: string
          localizacao?: string[]
        }
        Returns: string
      }
      componente_hematoma_intraparenquimatoso: {
        Args: {
          desvio_linha_mediana_cm?: number
          dimensoes_cm?: string[]
          edema_perilesional?: boolean
          hemorragia_ventricular?: boolean
          herniacao_subfalcina?: boolean
          lado?: string
          lobos: string[]
          volume_cm3?: number
        }
        Returns: string
      }
      componente_hematoma_subdural: {
        Args: {
          desvio_cm?: number
          desvio_mediana?: boolean
          espessura_mm?: number
          lado: string
          localizacao?: string
          tempo?: string
          volume_cm3?: number
        }
        Returns: string
      }
      componente_hematoma_subdural_idoso: {
        Args: {
          desvio_cm?: number
          efeito_expansivo?: boolean
          espessura_cm?: number
          lado?: string
          localizacao?: string[]
          tipo?: string
        }
        Returns: string
      }
      componente_hematoma_subgaleal: {
        Args: {
          lado: string
          regiao: string[]
          tempo?: string
          volume_cm3: number
        }
        Returns: string
      }
      componente_hemorragia_intraventricular_idoso: {
        Args: {
          localizacao_ventricular?: string[]
          tipo?: string
          ventriculos?: string[]
        }
        Returns: string
      }
      componente_hemorragia_subaracnoide_idoso: {
        Args: {
          cisternas?: string[]
          lado?: string
          localizacao?: string[]
          tipo?: string
        }
        Returns: string
      }
      componente_hepatomegalia: {
        Args: { tamanho_cm: number }
        Returns: string
      }
      componente_hernia_cervical: {
        Args: {
          p_altura?: string
          p_compressao_medular?: string
          p_compressao_radicular?: string
          p_comprimento?: string
          p_dimensoes?: string
          p_forame_intervertebral?: string
          p_largura?: string
          p_localizacao?: string
          p_nivel?: string
          p_recesso_lateral?: string
          p_relacao_com_canal?: string
          p_tipo?: string
        }
        Returns: string
      }
      componente_hernia_discal: {
        Args: {
          contato_radicular?: string
          distancia?: string
          localizacao?: string
          migracao?: string
          nivel?: string
          regiao?: string
          tamanho?: string
          tipo?: string
        }
        Returns: string
      }
      componente_hernia_pulmonar_intercostal: {
        Args: {
          arcos_costais?: string[]
          colo_cm?: number
          lado?: string
          lobo_pulmonar?: string
          musculos_afetados?: string[]
          saco_herniario_cm?: string[]
        }
        Returns: string
      }
      componente_herniacao_cerebral_idoso: {
        Args: { estrutura?: string; tipo?: string }
        Returns: string
      }
      componente_hiato_seminal_obliterado: {
        Args: { causa?: string; lado?: string; material_tipo?: string }
        Returns: string
      }
      componente_hidrocefalia_pressao_normal: {
        Args: {
          achados_adicionais?: string
          dilatacao?: string
          grau_sulcos?: string
        }
        Returns: string
      }
      componente_higroma_subdural_idoso: {
        Args: {
          desvio_cm?: number
          efeito_expansivo?: boolean
          espessura_cm?: number
          lado?: string
          localizacao?: string[]
        }
        Returns: string
      }
      componente_hipofaringe: {
        Args: {
          achado?: string
          extensao_anel_cricóide?: boolean
          extensao_base_lingua?: boolean
          extensao_cartilagem_aritenóide?: boolean
          extensao_cartilagem_tireoide?: boolean
          extensao_coluna_cervical?: boolean
          extensao_comissura_anterior?: boolean
          extensao_comissura_posterior?: boolean
          extensao_epiglote?: boolean
          extensao_espaco_paraglótico?: boolean
          extensao_espaco_pre_epiglotico?: boolean
          extensao_lamina_quadrada_cricóide?: boolean
          extensao_mediastino?: boolean
          extensao_membrana_crico_tireoide?: boolean
          extensao_parede_posterior?: boolean
          extensao_prega_faringo_epiglotica?: boolean
          extensao_prega_vocal?: boolean
          extensao_regiao_pos_cricoide?: boolean
          extensao_seio_piriforme?: boolean
          extensao_tecidos_moles_exolaríngeos?: boolean
          extensao_traqueia?: boolean
          extensao_valécula_epiglotica?: boolean
          extensao_ventriculo_laríngeo?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_hipoplasia: {
        Args: { observacao?: string; tipo?: string; vaso: string }
        Returns: string
      }
      componente_hipoplasia_vertebral: {
        Args: { lado: string; observacao?: string }
        Returns: string
      }
      componente_hmg: {
        Args: {
          dilatacao_ventricular?: boolean
          extensao_ventricular?: boolean
          grau: number
          lado?: string
        }
        Returns: string
      }
      componente_iliaca_aneurisma: {
        Args: {
          colo_distal?: number
          colo_proximal?: number
          diametro_maximo: number
          extensao?: number
          lateralidade: string
          nome_arteria: string
          presenca_trombo?: string
        }
        Returns: string
      }
      componente_iliaca_comum: {
        Args: { diametro?: number; estado?: string; lateralidade: string }
        Returns: string
      }
      componente_iliaca_ectasia: {
        Args: { diametro: number; lateralidade: string; nome_arteria: string }
        Returns: string
      }
      componente_iliaca_externa: {
        Args: { diametro?: number; estado?: string; lateralidade: string }
        Returns: string
      }
      componente_iliaca_interna: {
        Args: { diametro?: number; estado?: string; lateralidade: string }
        Returns: string
      }
      componente_iliaca_placa: {
        Args: {
          classificacao?: string
          espessura?: number
          estenose_associada?: string
          extensao?: number
          lateralidade: string
          nome_arteria: string
        }
        Returns: string
      }
      componente_iliaca_trombose: {
        Args: { extensao?: number; lateralidade: string; nome_arteria: string }
        Returns: string
      }
      componente_infraespinal: {
        Args: {
          calcificacao?: number
          espessura?: number
          extensao?: number
          retracao?: number
          situacao?: string
          tipo_rotura?: string
        }
        Returns: string
      }
      componente_infundibulo_etmoidal_obliterado: {
        Args: { causa?: string; lado?: string; material_tipo?: string }
        Returns: string
      }
      componente_instabilidade_manobras: {
        Args: { achado_instabilidade?: string }
        Returns: string
      }
      componente_invasao_osea: {
        Args: {
          estrutura?: string
          extensao?: string
          lado?: string
          observacao?: string
          tipo?: string
        }
        Returns: string
      }
      componente_isquemia_aguda_subaguda: {
        Args: {
          desvio_linha_mediana_cm?: number
          efeito_tumefativo?: boolean
          herniacao_subfalcina?: boolean
          lobos: string[]
          regioes?: string[]
          transformacao_hemorragica?: boolean
        }
        Returns: string
      }
      componente_keratosis_obturans: {
        Args: {
          deslocamento_membrana?: boolean
          lado?: string
          paredes_remodelamento?: string[]
        }
        Returns: string
      }
      componente_labio_acetabular_infantil: {
        Args: { achado_labio?: string }
        Returns: string
      }
      componente_labios: {
        Args: {
          achado?: string
          extensao?: string
          invasao_osso?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_labirintite_ossificante: {
        Args: {
          detalhamento_coclear?: boolean
          lado?: string
          localizacoes?: string[]
        }
        Returns: string
      }
      componente_lacuna_isquemica_antiga: {
        Args: { lado?: string; localizacao: string[] }
        Returns: string
      }
      componente_laringe: {
        Args: {
          achado?: string
          extensao_anterior?: string
          extensao_extra_laringea?: boolean
          extensao_inferior?: string
          extensao_lateral?: string
          extensao_medial?: string
          extensao_posterior?: string
          extensao_superior?: string
          invasao_cartilagem?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          reducao_luz?: boolean
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_laringe_glotica: {
        Args: {
          achado?: string
          extensao_cartilagem_aritenóide?: boolean
          extensao_comissura_anterior?: boolean
          extensao_comissura_posterior?: boolean
          extensao_espaco_paraglótico?: boolean
          extensao_prega_vocal?: boolean
          invasao_cartilagem_aritenóide?: boolean
          invasao_cartilagem_tireoide?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          reducao_luz_laríngea?: boolean
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_laringe_subglotica: {
        Args: {
          achado?: string
          extensao_anel_cricóide?: boolean
          extensao_cartilagem_cricoide?: boolean
          extensao_coluna_cervical?: boolean
          extensao_lamina_quadrada_cricóide?: boolean
          extensao_mediastino?: boolean
          extensao_membrana_crico_tireoide?: boolean
          extensao_traqueia?: boolean
          invasao_cartilagem_cricoide?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          reducao_luz_laríngea?: boolean
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_laringe_supraglotica: {
        Args: {
          achado?: string
          extensao_banda_ventricular?: boolean
          extensao_cartilagem_tireoide?: boolean
          extensao_epiglote?: boolean
          extensao_espaco_paraglótico?: boolean
          extensao_planos_exolaríngeos?: boolean
          extensao_prega_ari_epiglotica?: boolean
          extensao_seio_piriforme?: boolean
          extensao_valécula_epiglotica?: boolean
          extensao_ventrículo_laríngeo?: boolean
          invasao_base_lingua?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          reducao_luz_laríngea?: boolean
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_lesao_expansiva: {
        Args: {
          contornos?: string
          densidade?: string
          extensao_anterior?: string
          extensao_inferior?: string
          extensao_lateral?: string
          extensao_medial?: string
          extensao_posterior?: string
          extensao_superior?: string
          invasao_neural?: boolean
          invasao_osso?: boolean
          invasao_vascular?: boolean
          lado?: string
          localizacao?: string
          observacao?: string
          realce?: string
          tamanho_a?: string
          tamanho_b?: string
          tipo?: string
        }
        Returns: string
      }
      componente_lesao_glandula_salivar: {
        Args: {
          contornos?: string
          efeito_expansivo?: string
          glandula?: string
          lado?: string
          lobo?: string
          natureza?: string
          observacao?: string
          realce?: string
          tamanho?: string
          tipo?: string
        }
        Returns: string
      }
      componente_lesao_traumatica: {
        Args: { localizacao: string; tamanho_mm: number; tipo: string }
        Returns: string
      }
      componente_ligamento_colateral_lateral: {
        Args: { estado: string; localizacao?: string }
        Returns: string
      }
      componente_ligamento_colateral_medial: {
        Args: { estado: string; localizacao?: string }
        Returns: string
      }
      componente_ligamento_fibrose: {
        Args: { nome_ligamento: string }
        Returns: string
      }
      componente_ligamento_lesao: {
        Args: { nome_ligamento: string }
        Returns: string
      }
      componente_ligamento_normal: {
        Args: { nome_ligamento: string }
        Returns: string
      }
      componente_ligamento_rotura: {
        Args: { nome_ligamento: string }
        Returns: string
      }
      componente_ligamentos_colaterais_cotovelo: {
        Args: { estado: string; lado?: string }
        Returns: string
      }
      componente_ligamentos_coluna: {
        Args: {
          p_calcificacao?: string
          p_espessamento?: string
          p_ligamento_amarelo?: string
          p_ligamento_interespinhoso?: string
          p_ligamento_longitudinal_anterior?: string
          p_ligamento_longitudinal_posterior?: string
          p_ligamento_nucal?: string
          p_ligamento_supraespinhoso?: string
          p_regiao?: string
        }
        Returns: string
      }
      componente_ligamentos_talofibulares_tornozelo: {
        Args: { ligamento?: string; situacao?: string }
        Returns: string
      }
      componente_linfoma_mediastinal: {
        Args: {
          broncogramas_aereos?: boolean
          cadeias_pericardiofrenicas?: boolean
          cadeias_toracicas?: boolean
          consolidacoes?: boolean
          localizacao?: string[]
          padrao_distribuicao?: string
          tamanho_maximo_cm?: number
        }
        Returns: string
      }
      componente_linfonodo: {
        Args: {
          calcificacao?: boolean
          contornos?: string
          lado?: string
          morfologia?: string
          necrose?: boolean
          nivel?: string
          observacao?: string
          quantidade?: string
          realce?: string
          suspeita?: string
          tamanho?: string
        }
        Returns: string
      }
      componente_linfonodo_cervical: {
        Args: {
          cadeia: string
          caracteristicas?: string
          lado: string
          tamanho_mm: number
        }
        Returns: string
      }
      componente_linfonodo_detalhado: {
        Args: {
          calcificacao?: string
          contornos?: string
          extra_capsular?: string
          lado?: string
          morfologia?: string
          necrose?: string
          nivel?: string
          observacao?: string
          quantidade?: string
          realce?: string
          suspeita?: string
          tamanho?: string
        }
        Returns: string
      }
      componente_linfonodomegalia: {
        Args: { cadeias: string[]; maior_tamanho_cm: number }
        Returns: string
      }
      componente_linfonodomegalia_ausente: {
        Args: { p_lateralidade?: string; p_regiao?: string }
        Returns: string
      }
      componente_linfonodomegalia_mediastinal: {
        Args: {
          cadeias: string[]
          calcificacoes?: boolean
          caracteristicas_contraste?: string
          multiplas?: boolean
          necrose?: boolean
          tamanho_menor_eixo_cm?: number
        }
        Returns: string
      }
      componente_linfonodomegalia_presente: {
        Args: {
          p_ecogenicidade?: string
          p_lateralidade?: string
          p_medida1?: number
          p_medida2?: number
          p_regiao?: string
        }
        Returns: string
      }
      componente_linfonodos: {
        Args: {
          cadeias: string[]
          caracteristicas?: string
          tamanho_menor_eixo?: number
        }
        Returns: string
      }
      componente_linfonodos_niveis: {
        Args: {
          calcificacao?: boolean
          conglomerado?: boolean
          extra_capsular?: boolean
          lado?: string
          morfologia?: string
          necrose?: boolean
          nivel_ia?: boolean
          nivel_ib?: boolean
          nivel_iia?: boolean
          nivel_iib?: boolean
          nivel_iii?: boolean
          nivel_iv?: boolean
          nivel_va?: boolean
          nivel_vb?: boolean
          nivel_vi?: boolean
          nivel_vii?: boolean
          observacao?: string
          retrofaríngeo?: boolean
          supraclavicular?: boolean
          suspeita_malignidade?: boolean
          tamanho_maximo?: string
        }
        Returns: string
      }
      componente_linfonodos_normais: { Args: never; Returns: string }
      componente_linfonodos_preservados: {
        Args: {
          p_lateralidade?: string
          p_medida1?: number
          p_medida2?: number
          p_regiao?: string
        }
        Returns: string
      }
      componente_lipoma: {
        Args: {
          p_distancia_pele?: number
          p_lateralidade?: string
          p_medida1?: number
          p_medida2?: number
          p_medida3?: number
          p_regiao?: string
        }
        Returns: string
      }
      componente_loja_amigdaliana: {
        Args: {
          achado?: string
          extensao_base_lingua?: boolean
          extensao_espaco_mastigador?: boolean
          extensao_espaco_parafaríngeo?: boolean
          extensao_espaco_prevertebral?: boolean
          extensao_espaco_retrofaríngeo?: boolean
          extensao_hipofaringe?: boolean
          extensao_nasofaringe?: boolean
          extensao_parede_posterior?: boolean
          extensao_soalho_bucal?: boolean
          extensao_sulco_glossoamigdaliano?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_lpv: {
        Args: { grau: number; lado?: string; tamanho_cistos_cm?: number }
        Returns: string
      }
      componente_malformacao_congenita: {
        Args: {
          abertura?: string
          lado?: string
          regiao: string[]
          tipo: string
        }
        Returns: string
      }
      componente_manipulacao_cirurgica_craniana: {
        Args: {
          com_drenagem?: boolean
          lado: string
          local_drenagem?: string
          regiao: string[]
          tipo: string
        }
        Returns: string
      }
      componente_massa_testicular: {
        Args: {
          diametro_mm: number
          ecogenicidade: string
          localizacao: string
          vascularizacao?: string
        }
        Returns: string
      }
      componente_massas_laterais_atlas: {
        Args: {
          p_assimetria?: string
          p_desvio?: string
          p_erosao?: string
          p_fratura?: string
          p_integridade?: string
          p_localizacao_fratura?: string
        }
        Returns: string
      }
      componente_mastoidectomia_cortical_intacta: {
        Args: { lado?: string }
        Returns: string
      }
      componente_mastoidectomia_cortical_parcial: {
        Args: { lado?: string; remocao_cadeia?: string }
        Returns: string
      }
      componente_mastoidectomia_generica: {
        Args: {
          cadeia_ossicular?: string
          cae_removido?: boolean
          lado?: string
          parede_intacta?: boolean
          tipo_mastoidectomia?: string
        }
        Returns: string
      }
      componente_mastoidectomia_radical_completa: {
        Args: { lado?: string }
        Returns: string
      }
      componente_mastoidectomia_radical_modificada: {
        Args: { cadeia_intacta?: boolean; lado?: string }
        Returns: string
      }
      componente_mastoidite_coalescente: {
        Args: {
          complicacao_bezold?: boolean
          complicacao_subperiosteal?: boolean
          dimensoes_bezold?: number[]
          dimensoes_subperiosteal?: number[]
          lado?: string
        }
        Returns: string
      }
      componente_material_cirurgico_toracico: {
        Args: {
          detalhe_adicional?: string
          extremidade?: string
          lado?: string
          localizacao?: string
          posicao?: string
          tipo_dispositivo?: string
        }
        Returns: string
      }
      componente_mediastinite_fibrosante: {
        Args: {
          bandas_atelectasicas?: boolean
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
      componente_mega_cisterna_magna: { Args: never; Returns: string }
      componente_microangiopatia: {
        Args: {
          efeito_mass_effect?: boolean
          gravidade?: string
          regiao?: string
        }
        Returns: string
      }
      componente_mielolipoma_adrenal: {
        Args: { lado: string; tamanho_cm: number }
        Returns: string
      }
      componente_musculatura_regional_pe: {
        Args: { situacao?: string }
        Returns: string
      }
      componente_musculo_normal: {
        Args: {
          p_diastase?: number
          p_lateralidade?: string
          p_musculo_especifico?: string
          p_regiao?: string
        }
        Returns: string
      }
      componente_nasofaringe: {
        Args: {
          achado?: string
          extensao_base_craneo?: boolean
          extensao_coluna_cervical?: boolean
          extensao_espaco_mastigador?: boolean
          extensao_espaco_parafaríngeo?: boolean
          extensao_espaco_prevertebral?: boolean
          extensao_espaco_retrofaríngeo?: boolean
          extensao_fossa_nasal?: boolean
          extensao_loja_amigdaliana?: boolean
          extensao_parede_posterior_contralateral?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_nefropatia_cronica: { Args: { rim: string }; Returns: string }
      componente_neoplasia_cerebral: {
        Args: {
          desvio_linha_mediana_cm?: number
          edema?: boolean
          herniacao_subfalcina?: boolean
          lado?: string
          lobos: string[]
          multipla?: boolean
          necrose?: boolean
          padrao_realce?: string
          regioes?: string[]
          tipo_realce?: string
        }
        Returns: string
      }
      componente_neoplasia_esofago: {
        Args: {
          dilatacao_montante?: boolean
          estenose?: boolean
          invasao_aorta?: boolean
          invasao_estruturas_adjacentes?: boolean
          invasao_traqueobronquica?: boolean
          localizacao?: string
          nivel_hidroaereo?: boolean
          perda_planos_gordurosos?: boolean
          terço_inferior?: boolean
          terço_medio?: boolean
          terço_superior?: boolean
          tipo_espessamento?: string
        }
        Returns: string
      }
      componente_neoplasia_toracica: {
        Args: {
          atelectasia?: boolean
          calcificacao?: boolean
          caracteristica?: string
          cavitacao?: boolean
          distribuicao_metastases?: string
          extensao?: string
          invasao_traqueobronquica?: boolean
          invasao_vascular?: boolean
          localizacao?: string
          metastase?: boolean
          microcalcificacoes?: boolean
          tamanho_metastase_cm?: number
          tipo_histologico?: string
          tipo_neoplasia?: string
        }
        Returns: string
      }
      componente_nervo_mediano: {
        Args: { area_secao_transversal?: number; situacao?: string }
        Returns: string
      }
      componente_nervo_normal: {
        Args: { localizacao: string; nome_nervo: string }
        Returns: string
      }
      componente_nervo_subluxacao: {
        Args: { area_cm2?: number; nome_nervo: string; tipo: string }
        Returns: string
      }
      componente_nervo_ulnar_cotovelo: {
        Args: { area_cm2?: number; com_subluxacao?: boolean; estado: string }
        Returns: string
      }
      componente_neurocisticercose: {
        Args: {
          edema?: boolean
          fase?: string
          lado?: string
          localizacao: string[]
          multipla?: boolean
        }
        Returns: string
      }
      componente_neuropatia: {
        Args: { area_cm2: number; nome_nervo: string }
        Returns: string
      }
      componente_neurotoxoplasmose: {
        Args: {
          edema?: boolean
          lado?: string
          localizacao: string[]
          multipla?: boolean
        }
        Returns: string
      }
      componente_nodulo_generico: {
        Args: {
          p_contornos?: string
          p_distancia_pele?: number
          p_ecogenicidade?: string
          p_ecotextura?: string
          p_intensidade_fluxo?: string
          p_lateralidade?: string
          p_medida1?: number
          p_medida2?: number
          p_medida3?: number
          p_plano?: string
          p_regiao?: string
          p_vascularizacao?: string
        }
        Returns: string
      }
      componente_nodulo_hepatico_simples: {
        Args: {
          caracteristicas: string
          diametro_cm: number
          lobo: string
          segmento: string
        }
        Returns: string
      }
      componente_nodulo_pulmonar: {
        Args: {
          crescimento?: boolean
          diametro_mm: number
          estavel?: boolean
          lobo: string
          morfologia?: string[]
          novo_nodulo?: boolean
          segmentos: string[]
          tipo_densidade: string
        }
        Returns: string
      }
      componente_nodulo_renal: {
        Args: {
          caracteristicas: string
          diametro_cm: number
          localizacao: string
          rim: string
          vascularizacao: string
        }
        Returns: string
      }
      componente_obliteracao_paranasal_idoso: {
        Args: {
          aspecto_ondulado?: boolean
          cistos_retencao?: boolean
          localizacao?: string[]
          material?: string
        }
        Returns: string
      }
      componente_oclusao: {
        Args: {
          extensao?: string
          localizacao?: string
          observacao?: string
          tipo?: string
          vaso: string
        }
        Returns: string
      }
      componente_oclusao_aci: {
        Args: {
          extensao?: string
          lado: string
          localizacao?: string
          observacao?: string
        }
        Returns: string
      }
      componente_oclusao_subclavia: {
        Args: {
          lado: string
          localizacao?: string
          observacao?: string
          tipo?: string
        }
        Returns: string
      }
      componente_oclusao_vertebral: {
        Args: {
          lado: string
          observacao?: string
          segmentos?: string
          tipo?: string
        }
        Returns: string
      }
      componente_oma_bilateral: {
        Args: {
          extensao_antro?: boolean
          extensao_cavidade?: boolean
          localizacao_cavidade?: string[]
        }
        Returns: string
      }
      componente_oma_erosao_ossicular: {
        Args: {
          extensao_antro?: boolean
          extensao_cavidade?: boolean
          lado?: string
          localizacao_cavidade?: string[]
          ossiculos_erosao?: string[]
        }
        Returns: string
      }
      componente_oma_simples: {
        Args: {
          extensao_antro?: boolean
          extensao_cavidade?: boolean
          lado?: string
          localizacao_cavidade?: string[]
        }
        Returns: string
      }
      componente_opacidade_pulmonar: {
        Args: {
          distribuicao: string
          extensao_percentual?: number
          localizacao?: string
          padrao: string
          sugestao_diagnostica?: string
        }
        Returns: string
      }
      componente_orofaringe: {
        Args: {
          achado?: string
          extensao_base_lingua?: boolean
          extensao_espaco_mastigador?: boolean
          extensao_espaco_parafaríngeo?: boolean
          extensao_espaco_pre_epiglotico?: boolean
          extensao_espaco_prevertebral?: boolean
          extensao_espaco_retrofaríngeo?: boolean
          extensao_hipofaringe?: boolean
          extensao_nasofaringe?: boolean
          extensao_palato_mole?: boolean
          extensao_parede_posterior?: boolean
          extensao_soalho_bucal?: boolean
          extensao_sulco_glossoamigdaliano?: boolean
          extensao_valécula_epiglotica?: boolean
          extensao_vertebras_cervicais?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_osteofitos_marginais: {
        Args: { localizacao: string }
        Returns: string
      }
      componente_osteoftos_pe: {
        Args: { articulacao?: string; dedo?: string; situacao?: string }
        Returns: string
      }
      componente_osteoma: {
        Args: {
          descricao_adicional?: string
          localizacao?: string[]
          tamanho?: string
        }
        Returns: string
      }
      componente_osteoma_cae: {
        Args: { aspecto?: string; conteudo_medial?: boolean; lado?: string }
        Returns: string
      }
      componente_ostios_livres: { Args: never; Returns: string }
      componente_ostios_obliteracao: {
        Args: { causa?: string; material_tipo?: string; ostios: string[] }
        Returns: string
      }
      componente_otite_externa_aguda: {
        Args: {
          edema_partes_moles?: boolean
          espessamento_epitelial?: boolean
          lado?: string
          pavilhao_envolvido?: boolean
        }
        Returns: string
      }
      componente_otomastoidite_cronica: {
        Args: {
          extensao_antro?: boolean
          extensao_cavidade?: boolean
          lado?: string
          localizacao_cavidade?: string[]
          retracao_membrana?: boolean
          tecido_granulacao?: boolean
        }
        Returns: string
      }
      componente_otosclerose_fenestral: {
        Args: {
          comprometimento_janela?: boolean
          contato_estribo?: boolean
          lado?: string
          localizacao?: string
          tipo?: string
        }
        Returns: string
      }
      componente_otosclerose_fenestral_espessamento: {
        Args: { lado?: string; tipo_crescimento?: string }
        Returns: string
      }
      componente_otosclerose_fenestral_parcial: {
        Args: { lado?: string; obliteracao?: string }
        Returns: string
      }
      componente_otosclerose_fenestral_total: {
        Args: { lado?: string; obscurecimento_estribo?: boolean }
        Returns: string
      }
      componente_otosclerose_retrofenestral: {
        Args: {
          extensao_coclear?: boolean
          extensao_janela?: boolean
          lado?: string
          obliteracao_canais?: boolean
        }
        Returns: string
      }
      componente_outros_achados_parenquima: {
        Args: { lado?: string; localizacao?: string; tipo: string }
        Returns: string
      }
      componente_ovario_transvaginal: {
        Args: {
          contornos: string
          dimensoes: string
          ecotextura: string
          lado: string
          observacao?: string
          topico: boolean
          volume_cm3: number
        }
        Returns: string
      }
      componente_padrao_linfadenopatia: {
        Args: {
          calcificacao?: boolean
          conglomerado?: boolean
          distribuicao?: string
          lateraliade?: string
          morfologia?: string
          necrose?: boolean
          observacao?: string
          padrao?: string
          suspeita_etologia?: string
          tamanho?: string
        }
        Returns: string
      }
      componente_palato_duro: {
        Args: {
          achado?: string
          extensao_anterior?: string
          extensao_lateral?: string
          extensao_medial?: string
          extensao_posterior?: string
          extensao_superior?: string
          invasao_forames?: boolean
          invasao_fossa_nasal?: boolean
          invasao_fossa_pterigopalatina?: boolean
          invasao_seio_maxilar?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_pancreas_normal: { Args: never; Returns: string }
      componente_pancreatite_aguda_edematosa: {
        Args: { localizacao: string[] }
        Returns: string
      }
      componente_pancreatite_aguda_leve: { Args: never; Returns: string }
      componente_pancreatite_aguda_necrotizante: {
        Args: { localizacao: string[] }
        Returns: string
      }
      componente_parenquima_cerebral_normal:
        | {
            Args: { ecogenicidade?: string; morfologia?: string }
            Returns: string
          }
        | { Args: never; Returns: string }
      componente_parenquima_intersticio: {
        Args: {
          atelectasia?: boolean
          bolhas_subpleurais?: boolean
          bronquiectasias_tracao?: boolean
          bronquiolectasias?: boolean
          calcificacoes?: boolean
          consolidação?: boolean
          distorcao_arquitetural?: boolean
          distribuicao?: string
          enfisema?: boolean
          espessamento_septal?: boolean
          localizacao?: string
          opacidade_vidro_fosco?: boolean
          padrao?: string
          tamanho_max_cm?: number
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_parotida: {
        Args: {
          achado?: string
          aumento_volume?: boolean
          calcificacao?: boolean
          contornos?: string
          densidade?: string
          dilatacao_ductal?: boolean
          inflamacao?: boolean
          lado?: string
          lesao?: boolean
          linfonodos_intraparotideos?: boolean
          lobo?: string
          observacao?: string
          pos_cirurgia?: boolean
          pos_radioterapia?: boolean
          realce?: string
          sialolitíase?: boolean
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_partes_moles_benignas: {
        Args: {
          lado: string
          medida_a_cm: number
          medida_b_cm: number
          regiao: string[]
          tipo: string
        }
        Returns: string
      }
      componente_partes_moles_coluna: {
        Args: {
          p_calcificacao?: string
          p_edema?: string
          p_lesao?: string
          p_localizacao_lesao?: string
          p_musculatura_paravertebral?: string
          p_regiao?: string
          p_tecido_celular_subcutaneo?: string
          p_tipo_lesao?: string
        }
        Returns: string
      }
      componente_partes_moles_contusao: {
        Args: {
          lado: string
          regiao: string[]
          tem_gasosos: boolean
          tem_hematoma: boolean
        }
        Returns: string
      }
      componente_partes_moles_normal: { Args: never; Returns: string }
      componente_partes_moles_pos_cirurgica: {
        Args: { alteracoes?: string; lado: string; regiao: string[] }
        Returns: string
      }
      componente_pata_anserina: { Args: { estado: string }; Returns: string }
      componente_pele_subcutaneo_normal:
        | {
            Args: { p_lateralidade?: string; p_regiao?: string }
            Returns: string
          }
        | { Args: never; Returns: string }
      componente_permeacao_liquorica_transependimaria: {
        Args: { associacao?: string; grau?: string; localizacao?: string }
        Returns: string
      }
      componente_persistencia_arteria: {
        Args: {
          arteria: string
          descricao?: string
          lado?: string
          observacao?: string
        }
        Returns: string
      }
      componente_placa_arco_aortico: {
        Args: {
          estenose?: string
          localizacao?: string
          observacao?: string
          superficie?: string
          tipo_placa?: string
        }
        Returns: string
      }
      componente_placa_ateromatosa:
        | {
            Args: {
              classificacao?: string
              espessura?: number
              estenose_associada?: string
              localizacao: string
            }
            Returns: string
          }
        | {
            Args: {
              espessura?: string
              estenose?: string
              extensao?: string
              localizacao?: string
              observacao?: string
              tipo_placa?: string
              vaso: string
            }
            Returns: string
          }
      componente_placa_bulbo_aci: {
        Args: {
          criterio?: string
          extensao?: string
          grau_estenose?: string
          lado: string
          observacao?: string
          percentual?: string
          tipo_placa?: string
        }
        Returns: string
      }
      componente_placa_carotida_comum: {
        Args: {
          estenose?: string
          lado: string
          localizacao?: string
          observacao?: string
          segmentos?: string
          tamanho?: string
        }
        Returns: string
      }
      componente_placa_carotidea: {
        Args: {
          ecogenicidade?: string
          ecotextura?: string
          espessura?: number
          estenose?: string
          extensao?: number
          lado: string
          localizacao?: string
          superficie?: string
        }
        Returns: string
      }
      componente_placa_subclavia: {
        Args: {
          estenose?: string
          lado: string
          localizacao?: string
          observacao?: string
          tipo_placa?: string
        }
        Returns: string
      }
      componente_placas_ateromatosas_carotidas: {
        Args: { calcificacao?: boolean; lado: string; localizacao?: string }
        Returns: string
      }
      componente_pneumatizacao_cornetos: {
        Args: { cornetos?: string[]; lado?: string; localizacao?: string }
        Returns: string
      }
      componente_pneumonia_infeccao: {
        Args: {
          amiodarona?: boolean
          broncogramas_aereos?: boolean
          derrame_pleural?: boolean
          distribuicao?: string
          eosinofilia?: boolean
          fungo?: boolean
          lado_derrame?: string
          linfonodomegalia?: boolean
          localizacao?: string
          natureza?: string
          opacidade_vidro_fosco?: boolean
          padrao?: string
          sinal_halo?: boolean
          tamanho_linfonodo_cm?: number
          tipo_processo?: string
        }
        Returns: string
      }
      componente_pneumoperitonio_minimo: { Args: never; Returns: string }
      componente_polipos_nasais: {
        Args: {
          lado?: string
          localizacao?: string[]
          reducao_espaco?: boolean
        }
        Returns: string
      }
      componente_poplitea: {
        Args: {
          diametro?: number
          indice_resistividade?: number
          velocidade_pico_sistolica?: number
        }
        Returns: string
      }
      componente_pos_operatorio_coluna: {
        Args: {
          dimensoes?: string
          espacador_tipo?: string
          lateralidade?: string
          material?: string
          niveis?: string
          procedimento?: string
          volume?: string
        }
        Returns: string
      }
      componente_pregas_vocais: {
        Args: {
          achado?: string
          extensao_comissura_anterior?: boolean
          extensao_comissura_posterior?: boolean
          lado?: string
          lesao?: boolean
          mobilidade?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_promontorio_infantil: {
        Args: { achado_promontorio?: string }
        Returns: string
      }
      componente_prostata_hpb: {
        Args: { abaulamento?: boolean; grau_hpb?: string; volume_cm3: number }
        Returns: string
      }
      componente_prostata_normal: {
        Args: { contornos?: string; ecotextura?: string; volume_cm3: number }
        Returns: string
      }
      componente_recesso_esfeno_etmoidal_obliterado: {
        Args: { causa?: string; lado?: string; material_tipo?: string }
        Returns: string
      }
      componente_recesso_frontal_obliterado: {
        Args: { causa?: string; lado?: string; material_tipo?: string }
        Returns: string
      }
      componente_recidiva_pos_mastoidectomia: {
        Args: {
          extensao?: string
          lado?: string
          localizacao?: string
          tipo_recidiva?: string
        }
        Returns: string
      }
      componente_redondo_menor: {
        Args: {
          calcificacao?: number
          espessura?: number
          extensao?: number
          retracao?: number
          situacao?: string
          tipo_rotura?: string
        }
        Returns: string
      }
      componente_regiao_coanal_normal: { Args: never; Returns: string }
      componente_resseccao_parede_maxilar: {
        Args: { descricao_adicional?: string; lado?: string }
        Returns: string
      }
      componente_rim_ectopico: { Args: { tipo: string }; Returns: string }
      componente_rinofaringe_normal: { Args: never; Returns: string }
      componente_rins_normais: { Args: never; Returns: string }
      componente_rm_alteracoes_osseas_benignas: {
        Args: {
          caracteristicas?: string
          dimensoes_cm?: string
          erosao_tabua?: boolean
          lado?: string
          localizacao?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_rm_alteracoes_partes_moles: {
        Args: {
          caracteristicas?: string
          dimensoes_cm?: string
          lado?: string
          localizacao?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_rm_alteracoes_vasculares: {
        Args: {
          calcificacao?: boolean
          caracteristicas?: string
          extensao?: string
          gravidade?: string
          lado?: string
          localizacao?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_rm_anatomia_selar: {
        Args: {
          adeno_hipofise?: string
          aumento_dimensoes?: boolean
          configuracao_sela?: string
          lesao_focal?: boolean
          neuro_hipofise?: string
          realce_hipofise?: string
          reducao_dimensoes?: boolean
          sela_vazia?: boolean
          sinal_neuro_hipofise?: string
        }
        Returns: string
      }
      componente_rm_artefatos: {
        Args: {
          impacto?: string
          local_artefato?: string
          tipo_artefato?: string
        }
        Returns: string
      }
      componente_rm_aumento_pressao_intracraniana: {
        Args: { achados?: string[]; gravidade?: string; localizacao?: string }
        Returns: string
      }
      componente_rm_cavuns_meckel: {
        Args: {
          lado_especifico?: string
          lado_obliteracao?: string
          obliteracao?: string
          preservacao?: string
        }
        Returns: string
      }
      componente_rm_cisto_hipofise: {
        Args: {
          aspecto?: string
          diametro_cm?: number
          foco_hipossinal_t2?: boolean
          localizacao?: string
          paramediano?: string
          realce_contraste?: boolean
          tipo_cisto?: string
        }
        Returns: string
      }
      componente_rm_cistos_comuns: {
        Args: {
          caracteristicas?: string
          desvio_linha_mediana?: boolean
          dimensoes_cm?: string
          efeito_compressivo?: boolean
          localizacao?: string
          medida_desvio_cm?: number
          tipo_cisto?: string
        }
        Returns: string
      }
      componente_rm_colecoes_extraaxiais: {
        Args: {
          caracteristicas?: string
          desvio_linha_mediana?: boolean
          efeito_compressivo?: boolean
          espessura_cm?: number
          lado?: string
          localizacao?: string
          medida_desvio_cm?: number
          obliteracao_sulcos?: boolean
          tipo_colecao?: string
        }
        Returns: string
      }
      componente_rm_comparacao_evolucao: {
        Args: {
          alteracao_significativa?: boolean
          aumento_dimensoes?: boolean
          diminuicao_dimensoes?: boolean
          estabilidade?: boolean
          exame_referencia?: string
        }
        Returns: string
      }
      componente_rm_estruturas_adjacentes: {
        Args: {
          aderencia_interhipotalamica?: boolean
          caracteristica_lesao?: string
          diametro_lesao_cm?: number
          espessura_haste?: string
          haste_hipofisaria?: string
          lesao_hipotalamica?: boolean
          lipoma_hipotalamico?: boolean
          quiasma?: string
          realce_lesao?: string
        }
        Returns: string
      }
      componente_rm_hemorragia_subaracnóidea: {
        Args: {
          caracteristica_material?: string
          cisternas?: string
          extensao?: string
          lado?: string
          localizacao?: string
          tipo_hemorragia?: string
        }
        Returns: string
      }
      componente_rm_isquemia_aguda: {
        Args: {
          efeito_expansivo?: boolean
          estruturas_afetadas?: string
          hemossiderina?: boolean
          lado?: string
          localizacao?: string
          natureza?: string
          territorio_vascular?: string
          tipo_isquemia?: string
        }
        Returns: string
      }
      componente_rm_lesao_expansiva_extraaxial: {
        Args: {
          caracteristicas?: string[]
          efeitos_compressivos?: string[]
          hiperostose?: boolean
          invasao_arteria_carotida?: boolean
          invasao_clivus?: boolean
          invasao_sela?: boolean
          invasao_venoso_dural?: boolean
          lado?: string
          localizacao?: string
          reducao_calibre_carotida?: boolean
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_rm_macroadenoma: {
        Args: {
          cisterna_suprasselar?: string
          componente_cistico?: boolean
          contato_tronco_encefalico?: boolean
          conteudo_t1?: string
          diametro_cm?: number
          invasao_cisterna?: boolean
          invasao_clivus?: boolean
          invasao_seio_esfenoidal?: boolean
          localizacao?: string
          nivel_liquido?: boolean
          paramediano?: string
          realce?: string
          septacoes?: boolean
          sinal_t2?: string
        }
        Returns: string
      }
      componente_rm_microadenoma: {
        Args: {
          aspecto?: string
          diametro_cm?: number
          localizacao?: string
          localizacao_sela?: string
          realce?: string
          sinal_t1?: string
          sinal_t2?: string
        }
        Returns: string
      }
      componente_rm_orificio_trepanacao: {
        Args: {
          cânula_drenagem?: boolean
          dimensoes_cm?: string
          lado?: string
          local_cânula?: string
          localizacao?: string
        }
        Returns: string
      }
      componente_rm_partes_moles_extracranianas: {
        Args: {
          caracteristicas?: string
          diagnostico_provavel?: string
          dimensoes_cm?: string
          lado?: string
          localizacao?: string
          sinais_t1?: string
          sinais_t2?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_rm_pos_operatorio: {
        Args: {
          achado?: string
          craniotomia_local?: string
          dimensoes_cm?: string
          encefalomalacia?: boolean
          gliose?: boolean
          localizacao?: string
          material_inclusao?: boolean
          tipo_cirurgia?: string
        }
        Returns: string
      }
      componente_rm_pos_operatorio_cranio: {
        Args: {
          dimensoes_cm?: string
          lado?: string
          localizacao?: string
          tipo_cirurgia?: string
          tipo_procedimento?: string
        }
        Returns: string
      }
      componente_rm_seios_cavernosos: {
        Args: {
          invasao?: string
          lado_invasao?: string
          linha_intercarotidea?: string
          oblitera_sulco?: boolean
          posicao_ultrapassagem?: string
          preservacao?: string
          ultrapassa_linha?: boolean
        }
        Returns: string
      }
      componente_rm_sela_vazia: {
        Args: { grau?: string; significado_clinico?: string }
        Returns: string
      }
      componente_rm_tecnica: {
        Args: {
          contraste?: boolean
          coronais_hipocampos?: boolean
          difusao?: boolean
          espectroscopia?: boolean
          mtc?: boolean
          perfusao?: boolean
          sedacao?: boolean
          sequencias?: string
          tipo_tecnica?: string
        }
        Returns: string
      }
      componente_rm_volume_cerebral: {
        Args: {
          compatibilidade_etaria?: boolean
          grau?: string
          localizacao?: string
          predominio?: string
          proporcionalidade?: string
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_secrecao_nasal: {
        Args: { aspecto?: string; lado?: string; localizacao?: string }
        Returns: string
      }
      componente_septo_nasal_normal: { Args: never; Returns: string }
      componente_sequela_isquemica: {
        Args: { lado?: string; lobos: string[]; tipo?: string }
        Returns: string
      }
      componente_sialolitíase: {
        Args: {
          ectasia?: boolean
          glandula?: string
          lado?: string
          localizacao?: string
          observacao?: string
          obstrutivo?: boolean
          tamanho?: string
        }
        Returns: string
      }
      componente_sindrome_seio_silente: {
        Args: {
          alargamento_fossa?: boolean
          dimensoes_reduzidas?: boolean
          rebaixamento_assoalho?: boolean
          seio?: string
        }
        Returns: string
      }
      componente_sinusopatia_inflamatoria_idoso: {
        Args: {
          aspecto_material?: string
          correlacao_clinica?: boolean
          localizacao?: string[]
          tipo_material?: string
        }
        Returns: string
      }
      componente_sinusotomia: {
        Args: { lado?: string; seios?: string[]; tipo?: string }
        Returns: string
      }
      componente_sistema_extra_axial_normal: { Args: never; Returns: string }
      componente_sistema_ventricular_normal:
        | {
            Args: {
              dimensoes?: string
              localizacao?: string
              morfologia?: string
            }
            Returns: string
          }
        | { Args: never; Returns: string }
      componente_soalho_lingua: {
        Args: {
          achado?: string
          compromete_feixe_neurovascular?: boolean
          cruza_septo?: boolean
          extensao_base_lingua?: boolean
          extensao_espaco_sublingual?: boolean
          extensao_espaco_submandibular?: boolean
          extensao_espaco_submentoniano?: boolean
          extensao_musculatura_extrinseca?: boolean
          extensao_septo_lingual?: boolean
          lado?: string
          lesao?: boolean
          localizacao?: string
          observacao?: string
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_stent: {
        Args: {
          complicacao?: string
          fluxo?: string
          localizacao?: string
          observacao?: string
          vaso: string
        }
        Returns: string
      }
      componente_stent_carotideo: {
        Args: {
          complicacao?: string
          fluxo?: string
          lado: string
          localizacao_detalhada?: string
          observacao?: string
        }
        Returns: string
      }
      componente_subclavia_aberrante: {
        Args: { lado?: string; observacao?: string; trajeto?: string }
        Returns: string
      }
      componente_subclavias: {
        Args: { achado?: string; lado?: string; observacao?: string }
        Returns: string
      }
      componente_subescapular: {
        Args: {
          calcificacao?: number
          espessura?: number
          extensao?: number
          retracao?: number
          situacao?: string
          tipo_rotura?: string
        }
        Returns: string
      }
      componente_submandibular: {
        Args: {
          achado?: string
          aumento_volume?: boolean
          calcificacao?: boolean
          contornos?: string
          densidade?: string
          dilatacao_ductal?: boolean
          inflamacao?: boolean
          lado?: string
          lesao?: boolean
          observacao?: string
          pos_cirurgia?: boolean
          realce?: string
          sialolitíase?: boolean
          tamanho?: string
          tipo_lesao?: string
        }
        Returns: string
      }
      componente_superficie_ossea_normal: { Args: never; Returns: string }
      componente_superficie_ossea_pe: {
        Args: { situacao?: string }
        Returns: string
      }
      componente_superficie_ossea_quadril: {
        Args: { achado_osseo?: string; localizacao_ossea?: string }
        Returns: string
      }
      componente_superficie_ossea_tornozelo: {
        Args: { localizacao?: string; situacao?: string }
        Returns: string
      }
      componente_supraespinal: {
        Args: {
          calcificacao?: number
          espessura?: number
          extensao?: number
          retracao?: number
          situacao?: string
          tipo_rotura?: string
        }
        Returns: string
      }
      componente_tendao_calcaneo_tornozelo: {
        Args: {
          area_rotura?: string
          distancia_cotos?: number
          distancia_insercao?: number
          segmento?: string
          situacao?: string
        }
        Returns: string
      }
      componente_tendao_normal: {
        Args: { nome_tendao: string }
        Returns: string
      }
      componente_tendao_patelar_quadricipital: {
        Args: {
          estado_patela?: string
          estado_quadrisipital?: string
          localizacao_patela?: string
          localizacao_quadrisipital?: string
        }
        Returns: string
      }
      componente_tendao_rotura_completa: {
        Args: { distancia_coto?: number; nome_tendao: string }
        Returns: string
      }
      componente_tendao_rotura_parcial: {
        Args: { nome_tendao: string }
        Returns: string
      }
      componente_tendinopatia: {
        Args: { localizacao?: string; nome_tendao: string }
        Returns: string
      }
      componente_tendoes_anteriores_tornozelo: {
        Args: { segmento?: string; situacao?: string; tendao?: string }
        Returns: string
      }
      componente_tendoes_laterais_tornozelo: {
        Args: { segmento?: string; situacao?: string; tendao?: string }
        Returns: string
      }
      componente_tendoes_mediais_tornozelo: {
        Args: { segmento?: string; situacao?: string; tendao?: string }
        Returns: string
      }
      componente_tendoes_quadril: {
        Args: {
          achado_tendao?: string
          espessura_tendao?: number
          tendao_localizacao?: string
          unidade_medida?: string
        }
        Returns: string
      }
      componente_tennis_leg: {
        Args: {
          conteudo?: string
          gastrocnemio?: string
          lateralidade: string
          medida?: string
        }
        Returns: string
      }
      componente_tep: {
        Args: { localizacao: string[]; tipo?: string }
        Returns: string
      }
      componente_testiculo_normal: {
        Args: {
          contorno?: string
          ecogenicidade?: string
          lado: string
          volume_ml: number
        }
        Returns: string
      }
      componente_tibiais: {
        Args: {
          indice_resistividade_tibial_anterior?: number
          indice_resistividade_tibial_posterior?: number
          velocidade_pico_sistolica_tibial_anterior?: number
          velocidade_pico_sistolica_tibial_posterior?: number
        }
        Returns: string
      }
      componente_timo: {
        Args: {
          aumentado?: boolean
          contornos?: string
          dimensoes_proprias?: boolean
          espessura_cm?: number
        }
        Returns: string
      }
      componente_timpanoesclerose: {
        Args: {
          calcificacao_membrana?: boolean
          contato_ossicular?: boolean
          fixacao_ossicular?: boolean
          lado?: string
          localizacao?: string[]
        }
        Returns: string
      }
      componente_tonsilas_palatinas_aumentadas: {
        Args: { grau?: string; reducao_coluna_aerea?: boolean }
        Returns: string
      }
      componente_tortuosidade: {
        Args: { observacao?: string; tipo?: string; vaso: string }
        Returns: string
      }
      componente_tortuosidade_carotida_comum: {
        Args: { lado?: string; observacao?: string }
        Returns: string
      }
      componente_torus_mandibular: {
        Args: {
          descricao_adicional?: string
          lateralidade?: string
          tamanho?: string
        }
        Returns: string
      }
      componente_torus_palatino: {
        Args: { descricao_adicional?: string; tamanho?: string }
        Returns: string
      }
      componente_transicao_cranio_cervical: {
        Args: {
          p_articulacoes_atloido_axis?: string
          p_articulacoes_atloido_occipitais?: string
          p_atlas?: string
          p_axis?: string
          p_dens_axis?: string
          p_espaco_atloido_dental?: string
          p_relacao_atlas_axis?: string
          p_sincondroses?: string
        }
        Returns: string
      }
      componente_traqueia: {
        Args: {
          caracteristicas?: string
          densidade?: string
          forma?: string
          localizacao?: string
          relevancia?: string
          tamanho_cm?: number
          tipo_alteracao?: string
        }
        Returns: string
      }
      componente_trato_iliotibial: {
        Args: { estado: string; localizacao?: string }
        Returns: string
      }
      componente_triceps_cotovelo: {
        Args: { distancia_coto?: number; estado: string }
        Returns: string
      }
      componente_tromboflebite: {
        Args: {
          calibre?: string
          conteudo?: string
          extensao?: string
          lateralidade: string
          localizacao_anatomica?: string
          nome_veia: string
          paredes?: string
          tipo?: string
        }
        Returns: string
      }
      componente_tronco_braquiocefalico: {
        Args: { achado?: string; observacao?: string }
        Returns: string
      }
      componente_tumor_mediastino_anterior: {
        Args: {
          compressao_pulmonar?: string
          contornos?: string
          elevacao_diafragma?: boolean
          estruturas_vasculares?: string[]
          extensao_inferior?: string
          extensao_superior?: string
          invasao_parede_toracica?: boolean
          invasao_vascular?: boolean
          localizacao?: string
          necrose?: boolean
          realce_contraste?: string
          tamanho_cm?: string[]
        }
        Returns: string
      }
      componente_tumor_parede_toracica: {
        Args: {
          arcos_costais?: string[]
          contornos?: string
          densidade?: string
          destruicao_ossea?: boolean
          focos_aereos?: boolean
          invasao_pulmonar?: boolean
          lado?: string
          lobo_afetado?: string
          localizacao_parede?: string
          planos_musculoadiposos?: boolean
          tamanho_cm?: string[]
        }
        Returns: string
      }
      componente_turbinectomia: {
        Args: { cornetos?: string[]; lado?: string; tipo?: string }
        Returns: string
      }
      componente_tvp_aguda: {
        Args: {
          calibre?: string
          conteudo?: string
          lateralidade: string
          localizacao?: string
          nome_veia: string
        }
        Returns: string
      }
      componente_tvp_cronica_nao_recanalizada: {
        Args: {
          aderencia?: string
          calibre?: string
          conteudo?: string
          lateralidade: string
          localizacao?: string
          nome_veia: string
        }
        Returns: string
      }
      componente_tvp_cronica_parcialmente_recanalizada: {
        Args: {
          calibre?: string
          compressibilidade?: string
          conteudo?: string
          lateralidade: string
          localizacao?: string
          nome_veia: string
          paredes?: string
          recanalizacao?: string
        }
        Returns: string
      }
      componente_uncinectomia: {
        Args: { lado?: string; tipo?: string }
        Returns: string
      }
      componente_utero_transvaginal: {
        Args: {
          contornos: string
          dimensoes: string
          ecotextura: string
          forma: string
          idade_paciente: number
          posicao: string
          volume_cm3: number
        }
        Returns: string
      }
      componente_variacao_anatomica: {
        Args: { observacao?: string; variacao: string; vaso: string }
        Returns: string
      }
      componente_variacao_anatomica_geral: {
        Args: {
          lado?: string
          observacao?: string
          variacao: string
          vaso?: string
        }
        Returns: string
      }
      componente_variacao_vertebral: {
        Args: { lado: string; observacao?: string; variacao: string }
        Returns: string
      }
      componente_variacoes_cornetos_nasais: {
        Args: {
          cornetos?: string[]
          descricao_adicional?: string
          lado?: string
          tipo?: string
        }
        Returns: string
      }
      componente_varicocele: {
        Args: { diametro_mm: number; lado: string; refluxo_valsalva?: boolean }
        Returns: string
      }
      componente_vegetacao_vesical: {
        Args: { diametro_cm: number; localizacao: string[] }
        Returns: string
      }
      componente_veia_cava_normal: { Args: never; Returns: string }
      componente_veia_nao_caracterizada: {
        Args: { lateralidade: string; motivo?: string; nome_veia: string }
        Returns: string
      }
      componente_veia_normal: {
        Args: {
          calibre?: string
          compressibilidade?: string
          fluxo?: string
          lateralidade: string
          nome_veia: string
        }
        Returns: string
      }
      componente_ventres_musculares_quadril: {
        Args: { achado_muscular?: string; musculatura_localizacao?: string }
        Returns: string
      }
      componente_vertebrais: {
        Args: { achado?: string; lado?: string; observacao?: string }
        Returns: string
      }
      componente_vesiculas_normais: {
        Args: { diametro_mm?: number; simetria?: string }
        Returns: string
      }
      componente_via_biliar_normal: { Args: never; Returns: string }
      componente_vias_drenagem_multiplas_obliteradas: {
        Args: { gravidade?: string; material_tipo?: string; regiao?: string }
        Returns: string
      }
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
      generate_report_number: { Args: never; Returns: string }
      gerar_laudo_atm_completo: {
        Args: {
          alteracao_sinal?: boolean
          artropatia?: boolean
          boca_aberta?: boolean
          cistos_subcorticais?: boolean
          contraste?: boolean
          derrame_presente?: boolean
          deslocamento?: boolean
          dinamico?: boolean
          edema_oseo?: boolean
          esclerose_subcortical?: boolean
          excursao_anormal?: boolean
          grau_artropatia?: string
          hipotrofia?: boolean
          lado_derrame?: string
          lado_excursao?: string
          lado_hipotrofia?: string
          lado_predominio?: string
          osteofitos_marginais?: boolean
          planos?: string[]
          quantidade_derrame?: string
          recaptura?: boolean
          reducao_espaco_articular?: boolean
          reducao_espessura?: boolean
          retificacao_contornos?: boolean
          satisfacao_recaptura?: string
          sequencias?: string[]
          tipo_deslocamento?: string
          tipo_excursao?: string
        }
        Returns: string
      }
      gerar_laudo_lombar_completo: {
        Args: {
          contraste?: boolean
          escoliose?: boolean
          estenose?: boolean
          fraturas?: boolean
          grau_estenose?: string
          hernias?: boolean
          lordose?: string
          neoplasia?: boolean
          niveis_hernias?: string[]
          planos?: string[]
          sequencias?: string[]
          tipo_laudo?: string
          transicao_lombossacra?: string
          v5_lombares?: boolean
        }
        Returns: string
      }
      gerar_numero_laudo: { Args: never; Returns: string }
      get_ai_function_config: { Args: { fn_name: string }; Returns: Json }
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
      renew_monthly_credits:
        | {
            Args: { p_plan_code: string; p_user_id: string }
            Returns: undefined
          }
        | { Args: { p_plan_code: string; p_user_id: string }; Returns: Json }
      rm_craneo_alteracao_corpo_caloso: {
        Args: {
          afilamento?: boolean
          regioes_afetadas?: string[]
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_alteracoes_benignas_ósseas: {
        Args: {
          caracteristicas?: string
          erosao?: boolean
          lado?: string
          localizacao?: string[]
          tabua_externa?: boolean
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_alteracoes_benignas_partes_moles: {
        Args: {
          lado?: string
          medidas?: number[]
          regiao?: string[]
          t1_sinal?: string
          t2_sinal?: string
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_alteracoes_cranio_cervicais: {
        Args: { medida_chamberlain_cm?: number; tipo?: string }
        Returns: string
      }
      rm_craneo_alteracoes_pos_contusaoais: {
        Args: {
          gas_subcutaneo?: boolean
          hematoma_subgaleal?: boolean
          lado?: string
          regioes?: string[]
          temporal?: boolean
        }
        Returns: string
      }
      rm_craneo_alteracoes_vasculares: {
        Args: {
          adicionais?: string[]
          localizacao?: string[]
          segmentos?: string[]
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_anomalia_desenvolvimento_venoso: {
        Args: {
          alteracao_sinal?: boolean
          estruturas_afetadas?: string[]
          lobo_afetado?: string[]
        }
        Returns: string
      }
      rm_craneo_aqueduto_estenose: {
        Args: { causa?: string; localizacao?: string }
        Returns: string
      }
      rm_craneo_artrose_atlantoaxial: {
        Args: {
          calcificacao_partes_moles?: boolean
          edema_articular?: boolean
          medida_subluxacao_cm?: number
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_aumento_pressao_intracraniana: {
        Args: { achados?: string[]; correlacao_clinica?: boolean }
        Returns: string
      }
      rm_craneo_cavernoma: {
        Args: {
          dimensao_cm?: number
          estruturas_afetadas?: string[]
          lobo_afetado?: string[]
          sangramento_recente?: boolean
        }
        Returns: string
      }
      rm_craneo_cavidade_cirurgica: {
        Args: {
          alteracao_adjacente?: boolean
          apagamento_sulcos?: boolean
          colabamento_ventricular?: boolean
          conteudo?: string
          desvio_linha_media?: number
          efeito_atrofico?: boolean
          efeito_compressivo?: boolean
          hemossiderina?: boolean
          herniacao_subfalcina?: boolean
          herniacao_uncal?: boolean
          intensidade_realce?: string
          lesao_remanescente?: boolean
          lobo_afetado?: string[]
          persistencia_exame_anterior?: boolean
          radionecrose?: boolean
          realce_margens?: boolean
          referencia_desvio?: string
          tipo_alteracao_adjacente?: string
        }
        Returns: string
      }
      rm_craneo_cavum_persistente: { Args: { tipo?: string }; Returns: string }
      rm_craneo_colecao_extra_axial: {
        Args: {
          crônico?: boolean
          epidural?: boolean
          espessura?: number
          fossa_posterior?: boolean
          higroma?: boolean
          lado?: string
          localizacao?: string[]
          obliteracao_sulcos?: boolean
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_conflito_vascular_neurovascular: {
        Args: {
          arteria?: string
          lado?: string
          localizacao_detalhada?: string
          nervos_afetados?: string[]
          segmento?: string
        }
        Returns: string
      }
      rm_craneo_displasia_cortical: {
        Args: { giros_afetados?: string[]; lobo_afetado?: string }
        Returns: string
      }
      rm_craneo_efeito_compressivo: {
        Args: {
          desvio_linha_media?: number
          efeitos?: string[]
          nivel_desvio?: string
          significativo?: boolean
        }
        Returns: string
      }
      rm_craneo_efeito_compressivo_herniacoes: {
        Args: {
          apagamento_sulcos?: boolean
          desvio_linha_media?: number
          herniacao_subfalcina?: boolean
          herniacao_tonsilas?: boolean
          herniacao_uncal?: boolean
          lado_herniacao_subfalcina?: string
          lado_herniacao_uncal?: string
          lado_ventriculo?: string
          reducao_amplitude_ventricular?: boolean
          reducao_cisterna_prepontina?: boolean
          reducao_cisternas_perimesencefalicas?: boolean
          reducao_forame_magnum?: boolean
          reducao_iii_ventriculo?: boolean
          reducao_iv_ventriculo?: boolean
          referencia_desvio?: string
        }
        Returns: string
      }
      rm_craneo_esclerose_tuberosa: {
        Args: {
          calcificacao?: boolean
          maior_nodulo_dimensao?: number
          maior_nodulo_lado?: string
          nódulos_subependimarios?: boolean
          tiberes_corticais?: boolean
        }
        Returns: string
      }
      rm_craneo_esquizencefalia: {
        Args: {
          comunicacao?: string
          lado?: string
          localizacao?: string
          revestimento_cortical?: boolean
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_fluxo_liquorico: {
        Args: { achado?: string; localizacao?: string; tipo_estudo?: string }
        Returns: string
      }
      rm_craneo_focos_t2_flair: {
        Args: {
          cistos_periventriculares?: boolean
          descricao_especial?: string
          extensao_perirrolandica?: boolean
          fazekas?: number
          irregularidades_ventriculos?: boolean
          localizacao?: string
          tipo_foco?: string
        }
        Returns: string
      }
      rm_craneo_fratura_calota: {
        Args: {
          desalinhamento?: boolean
          grau_desalinhamento?: string
          lado?: string
          localizacao?: string[]
        }
        Returns: string
      }
      rm_craneo_fratura_mandibula: {
        Args: {
          desalinhamento?: boolean
          estruturas?: string[]
          extensao_cavidade_glenoide?: boolean
          lado?: string
        }
        Returns: string
      }
      rm_craneo_fratura_mastóide: {
        Args: {
          acometimento_cadeia_ossicular?: boolean
          desalinhamento?: boolean
          lado?: string
          subluxacao_ossicular?: boolean
          tipos?: string[]
        }
        Returns: string
      }
      rm_craneo_fratura_nasal: {
        Args: {
          desvio_piramide?: string
          desvio_septo?: boolean
          lado?: string
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_fratura_orbita: {
        Args: {
          complicacoes?: string[]
          desalinhamento?: boolean
          estruturas?: string[]
          lado?: string
        }
        Returns: string
      }
      rm_craneo_fratura_pterigoide: {
        Args: { lado?: string; segmentos?: string[] }
        Returns: string
      }
      rm_craneo_fratura_seios_maxilares: {
        Args: {
          desalinhamento?: boolean
          estruturas?: string[]
          gordura_retro_antral?: boolean
          hemossinus?: boolean
          lado?: string
        }
        Returns: string
      }
      rm_craneo_fratura_zigomatico: {
        Args: {
          desalinhamento?: boolean
          extensao_cavidade_glenoide?: boolean
          lado?: string
        }
        Returns: string
      }
      rm_craneo_glioma_expansivo: {
        Args: {
          calcificacao?: boolean
          comparacao_exame?: boolean
          edema_vasogenico?: boolean
          espectroscopia?: boolean
          estruturas_afetadas?: string[]
          hemorragia?: boolean
          hipotese_alto_grau?: boolean
          infiltracao_tumoral?: boolean
          lesao_remanescente?: boolean
          lobo_afetado?: string[]
          maior_extensao?: boolean
          menor_extensao?: boolean
          necrose_liquefacao?: boolean
          perfusao_dsc?: boolean
          permeabilidade_dce?: boolean
          persistencia?: boolean
          radionecrose?: boolean
          restricao_difusao?: boolean
          tipo_realce?: string
        }
        Returns: string
      }
      rm_craneo_gliose_encefalomalacia: {
        Args: {
          aspecto_cistico?: boolean
          degeneracao_walleriana?: boolean
          dilatacao_ventricular?: boolean
          estruturas_afetadas?: string[]
          fibras_comissurais?: boolean
          fibras_transversas?: boolean
          hemossiderina?: boolean
          lobo_afetado?: string[]
          territorio_arterial?: string[]
          territorio_fronteira?: string[]
          trato_corticoespinal?: boolean
        }
        Returns: string
      }
      rm_craneo_hematoma_intraparenquimatoso: {
        Args: {
          apagamento_sulcos?: boolean
          colabamento_ventricular?: boolean
          desvio_linha_media?: number
          dimensoes?: number[]
          edema_vasogenico?: boolean
          efeito_compressivo?: boolean
          herniacao_subfalcina?: boolean
          herniacao_uncal?: boolean
          lobo_afetado?: string[]
          referencia_desvio?: string
          territorio_arterial?: string[]
          territorio_fronteira?: string[]
          volume_cm3?: number
        }
        Returns: string
      }
      rm_craneo_hemossiderina_calcificacao: {
        Args: { considerar_possibilidade?: string[]; localizacao?: string[] }
        Returns: string
      }
      rm_craneo_herniacao_tonsilar: {
        Args: { medida_cm?: number; tipo?: string }
        Returns: string
      }
      rm_craneo_heterotopia: { Args: never; Returns: string }
      rm_craneo_hipocampo_esclerose: {
        Args: { lado?: string }
        Returns: string
      }
      rm_craneo_hipocampo_mal_rotacao: {
        Args: { lado?: string }
        Returns: string
      }
      rm_craneo_hipocampo_mta_score: {
        Args: { volume_direito?: number; volume_esquerdo?: number }
        Returns: string
      }
      rm_craneo_hipocampo_normal: {
        Args: { proporcional_encefalo?: boolean; reducao_volumetrica?: boolean }
        Returns: string
      }
      rm_craneo_hipocampo_reducao_volumetrica: {
        Args: { bilateral?: boolean; lado?: string }
        Returns: string
      }
      rm_craneo_hipotensao_liquorica: { Args: never; Returns: string }
      rm_craneo_idoso_analise_atrofia: {
        Args: { compatibilidade?: string; estruturas?: string[]; grau?: string }
        Returns: string
      }
      rm_craneo_idoso_analise_colecoes: {
        Args: {
          extra_axiais?: boolean
          hemorragia?: boolean
          intra_axiais?: boolean
          tipo_hemorragia?: string
        }
        Returns: string
      }
      rm_craneo_idoso_analise_linha_media: {
        Args: { desvio?: boolean; estrutura?: string; referencia?: string }
        Returns: string
      }
      rm_craneo_idoso_analise_microangiopatia: {
        Args: {
          distribuicao?: string
          efeito?: string
          localizacao?: string
          quantidade?: string
        }
        Returns: string
      }
      rm_craneo_idoso_analise_vascular: {
        Args: { criterio?: string; fluxo?: string; sistemas?: string[] }
        Returns: string
      }
      rm_craneo_idoso_analise_ventricular: {
        Args: { localizacao?: string; tipo?: string }
        Returns: string
      }
      rm_craneo_idoso_impressao: {
        Args: { atrofia?: string; microangiopatia?: string }
        Returns: string
      }
      rm_craneo_idoso_tecnica: {
        Args: {
          contraste?: boolean
          dose_contraste?: string
          tecnicas?: string[]
        }
        Returns: string
      }
      rm_craneo_isquemia_subaguda: {
        Args: {
          efeito_expansivo?: boolean
          estruturas_afetadas?: string[]
          hemossiderina?: boolean
          lobo_afetado?: string[]
          necrose_cortical?: boolean
          realce_giral?: boolean
          restricao_difusao?: boolean
          territorio_arterial?: string[]
          territorio_fronteira?: string[]
        }
        Returns: string
      }
      rm_craneo_lacuna_isquemica: {
        Args: { hemossiderina?: boolean; localizacao?: string[] }
        Returns: string
      }
      rm_craneo_lesao_realce_anelar: {
        Args: {
          edema_vasogenico?: boolean
          hemossiderina_calcificacao?: boolean
          hipoteses?: string[]
          infiltracao_tumoral?: boolean
          lobo_afetado?: string
          maior_realce?: boolean
          necrose_liquefacao?: boolean
          restricao_difusao?: boolean
          unica?: boolean
        }
        Returns: string
      }
      rm_craneo_lesoes_desmielinizantes: {
        Args: {
          comparacao_exame_anterior?: boolean
          lesoes_black_hold?: boolean
          lesoes_infratentoriais?: string[]
          lesoes_realce?: string[]
          lesoes_supratentoriais?: string[]
          maior_extensao?: boolean
          menor_extensao?: boolean
          novas_lesoes_infratentoriais?: string[]
          novas_lesoes_supratentoriais?: string[]
        }
        Returns: string
      }
      rm_craneo_linha_media_herniações: {
        Args: {
          desvio_medida?: number
          efeitos?: string[]
          nivel_desvio?: string
          reducoes?: string[]
        }
        Returns: string
      }
      rm_craneo_manipulacao_cirurgica: {
        Args: {
          drenagem?: boolean
          edema?: boolean
          lado?: string
          local_drenagem?: string[]
          regioes?: string[]
          tipo_procedimento?: string
          trepanacao?: boolean
        }
        Returns: string
      }
      rm_craneo_neuropatia_facial: {
        Args: {
          lado?: string
          realce_tronco?: boolean
          segmentos_afetados?: string[]
        }
        Returns: string
      }
      rm_craneo_neuropatia_trigemeo: {
        Args: { lado?: string; realce_tronco?: boolean }
        Returns: string
      }
      rm_craneo_perda_sinal_fluxo: {
        Args: { arterias_afetadas?: string[]; tipo_alteracao?: string }
        Returns: string
      }
      rm_craneo_polimicrogiria: {
        Args: { extensao?: string[]; lado?: string; localizacao?: string }
        Returns: string
      }
      rm_craneo_schwannoma_acustico: {
        Args: {
          componentes_cisticos?: boolean
          dimensoes?: number[]
          edema_vasogenico?: boolean
          estruturas_comprimidas?: string[]
          hemossiderina_calcificacao?: boolean
          herniacao_tonsilas?: boolean
          infiltracao_tumoral?: boolean
          lado?: string
          localizacao?: string[]
          realce?: boolean
          reducao_iv_ventriculo?: boolean
        }
        Returns: string
      }
      rm_craneo_siderose_superficial: {
        Args: { localizacao?: string[] }
        Returns: string
      }
      rm_craneo_sistema_ventricular_assimetria: {
        Args: { lado_maior?: string; tipo?: string }
        Returns: string
      }
      rm_craneo_sistema_ventricular_dilatacao: {
        Args: {
          grau?: string
          sinais_hipertensivos?: boolean
          transudação_transependimaria?: boolean
        }
        Returns: string
      }
      rm_craneo_sistema_ventricular_ectasia: {
        Args: { grau?: string; tipo?: string }
        Returns: string
      }
      rm_craneo_trauma_contusao: {
        Args: {
          corpo_caloso?: boolean
          hemossiderina?: boolean
          localizacao?: string[]
          mesencefalo?: boolean
          tipo?: string
        }
        Returns: string
      }
      rm_craneo_ventriculostomia: {
        Args: { localizacao?: string }
        Returns: string
      }
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
      validar_medida_contra_referencia: {
        Args: {
          p_estrutura: string
          p_idade: number
          p_sexo?: string
          p_valor: number
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
