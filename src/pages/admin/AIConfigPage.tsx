import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Save, 
  RefreshCw, 
  History, 
  Code2, 
  Settings2,
  ChevronRight,
  ChevronDown,
  Clock,
  Zap,
  Plus,
  Edit,
  Trash2,
  Brain,
  CheckCircle2,
  XCircle,
  BarChart3,
  Activity,
  TrendingUp,
  Sparkles,
  Cpu,
  AlertCircle,
  Info,
  SlidersHorizontal
} from 'lucide-react';

// Types
interface AIProvider {
  id: string;
  name: string;
  display_name: string;
  api_base_url: string;
  api_key_secret_name: string;
  is_active: boolean;
}

interface PromptConfig {
  id: string;
  function_name: string;
  display_name: string;
  description: string | null;
  system_prompt: string;
  model_name: string;
  model_id: string | null;
  provider_id: string | null;
  max_tokens: number;
  reasoning_effort: string | null;
  temperature: number | null;
  top_p: number | null;
  top_k: number | null;
  frequency_penalty: number | null;
  presence_penalty: number | null;
  thinking_budget: number | null;
  stop_sequences: string[] | null;
  seed: number | null;
  response_format: string | null;
  is_active: boolean;
  version: number;
  updated_at: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  provider_id: string | null;
  api_name: string | null;
  model_family: string | null;
  description: string | null;
  tier: string | null;
  is_active: boolean;
  is_legacy: boolean | null;
  default_max_tokens: number;
  context_window: number | null;
  max_output_tokens: number | null;
  input_cost_per_1m: number | null;
  output_cost_per_1m: number | null;
  // API Connection
  api_base_url: string | null;
  api_key_secret_name: string | null;
  auth_header: string | null;
  auth_prefix: string | null;
  api_version: string | null;
  extra_headers: Record<string, unknown> | null;
  // Capabilities
  supports_temperature: boolean | null;
  supports_reasoning: boolean | null;
  supports_extended_thinking: boolean | null;
  supports_thinking_budget: boolean | null;
  supports_top_p: boolean | null;
  supports_top_k: boolean | null;
  supports_frequency_penalty: boolean | null;
  supports_presence_penalty: boolean | null;
  supports_stop_sequences: boolean | null;
  supports_seed: boolean | null;
  supports_json_mode: boolean | null;
  supports_tools: boolean | null;
  supports_streaming: boolean | null;
  supports_vision: boolean | null;
  created_at: string;
  updated_at: string;
}

interface PromptHistory {
  id: string;
  function_name: string;
  previous_prompt: string | null;
  new_prompt: string;
  previous_model: string | null;
  new_model: string | null;
  changed_at: string;
  change_reason: string | null;
}

interface ModelUsage {
  model_name: string;
  usage_count: number;
}

// Model info for icons and descriptions
const MODEL_INFO: Record<string, { icon: string; label: string; color: string }> = {
  'gpt-5-nano-2025-08-07': { icon: '💡', label: 'Econômico', color: 'text-green-400' },
  'gpt-5-2025-08-07': { icon: '⭐', label: 'Flagship', color: 'text-cyan-400' },
  'gpt-5-mini-2025-08-07': { icon: '🚀', label: 'Balanced', color: 'text-blue-400' },
  'gpt-4o-mini': { icon: '⚡', label: 'Legacy Mini', color: 'text-yellow-400' },
  'gpt-4o': { icon: '🔥', label: 'Legacy Pro', color: 'text-orange-400' },
  'gpt-4.1-2025-04-14': { icon: '🔮', label: 'Coding', color: 'text-purple-400' },
  'gpt-4.1-mini-2025-04-14': { icon: '💎', label: 'Coding Mini', color: 'text-violet-400' },
  'gpt-4.1-nano-2025-04-14': { icon: '⚡', label: 'Coding Nano', color: 'text-indigo-400' },
  'o3-mini': { icon: '🧠', label: 'Reasoning', color: 'text-blue-400' },
  'o4-mini-2025-04-16': { icon: '✨', label: 'Reasoning Next', color: 'text-pink-400' },
  'claude-3-5-sonnet-20241022': { icon: '🎭', label: 'Anthropic', color: 'text-amber-400' },
  'claude-3-7-sonnet-20250219': { icon: '🎭', label: 'Anthropic 3.7', color: 'text-amber-500' },
  'claude-3-5-haiku-20241022': { icon: '🍃', label: 'Anthropic Fast', color: 'text-emerald-400' },
  'gemini-2.5-pro': { icon: '💎', label: 'Google Pro', color: 'text-sky-400' },
  'gemini-2.5-flash': { icon: '⚡', label: 'Google Flash', color: 'text-sky-300' },
  'gemini-2.5-flash-lite': { icon: '🌟', label: 'Google Lite', color: 'text-sky-200' },
  'llama-3.3-70b-versatile': { icon: '🦙', label: 'Groq Llama', color: 'text-rose-400' },
  'whisper-large-v3-turbo': { icon: '🎤', label: 'Transcrição', color: 'text-rose-400' },
  // OpenRouter models
  'openrouter/openai/gpt-5': { icon: '🌐', label: 'OR GPT-5', color: 'text-teal-400' },
  'openrouter/anthropic/claude-sonnet-4': { icon: '🌐', label: 'OR Claude 4', color: 'text-teal-400' },
  'openrouter/google/gemini-2.5-flash': { icon: '🌐', label: 'OR Gemini Flash', color: 'text-teal-300' },
  'openrouter/google/gemini-2.5-pro': { icon: '🌐', label: 'OR Gemini Pro', color: 'text-teal-400' },
  'openrouter/meta-llama/llama-3.3-70b-instruct': { icon: '🌐', label: 'OR Llama 70B', color: 'text-teal-300' },
  'openrouter/mistralai/mistral-large-2411': { icon: '🌐', label: 'OR Mistral', color: 'text-teal-400' },
  'openrouter/qwen/qwen-2.5-72b-instruct': { icon: '🌐', label: 'OR Qwen 72B', color: 'text-teal-300' },
  'openrouter/deepseek/deepseek-chat-v3-0324': { icon: '🌐', label: 'OR DeepSeek V3', color: 'text-teal-400' },
};

const PROVIDER_ICONS: Record<string, string> = {
  'openai': '🟢',
  'anthropic': '🟠',
  'google': '🔵',
  'groq': '🔴',
  'lovable': '💜',
  'openrouter': '🌐',
};

// Provider defaults for API connection auto-population (BASE URLs only - RPC appends paths)
const PROVIDER_DEFAULTS: Record<string, {
  api_base_url: string;
  api_key_secret_name: string;
  auth_header: string;
  auth_prefix: string;
  api_version: string;
  extra_headers: string;
}> = {
  openai: {
    api_base_url: 'https://api.openai.com',
    api_key_secret_name: 'OPENAI_API_KEY',
    auth_header: 'Authorization',
    auth_prefix: 'Bearer ',
    api_version: '',
    extra_headers: '{}'
  },
  anthropic: {
    api_base_url: 'https://api.anthropic.com',
    api_key_secret_name: 'ANTHROPIC_API_KEY',
    auth_header: 'x-api-key',
    auth_prefix: '',
    api_version: '2023-06-01',
    extra_headers: '{"anthropic-version": "2023-06-01"}'
  },
  google: {
    api_base_url: 'https://generativelanguage.googleapis.com',
    api_key_secret_name: 'GOOGLE_API_KEY',
    auth_header: 'x-goog-api-key',
    auth_prefix: '',
    api_version: '',
    extra_headers: '{}'
  },
  groq: {
    api_base_url: 'https://api.groq.com',
    api_key_secret_name: 'GROQ_API_KEY',
    auth_header: 'Authorization',
    auth_prefix: 'Bearer ',
    api_version: '',
    extra_headers: '{}'
  },
  lovable: {
    api_base_url: 'https://ai.gateway.lovable.dev',
    api_key_secret_name: 'LOVABLE_API_KEY',
    auth_header: 'Authorization',
    auth_prefix: 'Bearer ',
    api_version: '',
    extra_headers: '{}'
  },
  openrouter: {
    api_base_url: 'https://openrouter.ai/api/v1',
    api_key_secret_name: 'OPENROUTER_API_KEY',
    auth_header: 'Authorization',
    auth_prefix: 'Bearer ',
    api_version: '',
    extra_headers: '{"HTTP-Referer": "https://radreport.app", "X-Title": "RadReport"}'
  }
};

export default function AIConfigPage() {
  // Shared state
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [configs, setConfigs] = useState<PromptConfig[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([]);
  const [recentActivity, setRecentActivity] = useState<PromptHistory[]>([]);

  // Prompts state
  const [selectedConfig, setSelectedConfig] = useState<PromptConfig | null>(null);
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  // Config modal state
  const [modalDisplayName, setModalDisplayName] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalProvider, setModalProvider] = useState('');
  const [modalModel, setModalModel] = useState('');
  const [modalMaxTokens, setModalMaxTokens] = useState(2000);
  const [modalTemperature, setModalTemperature] = useState<number | null>(0.7);
  const [modalReasoning, setModalReasoning] = useState('low');
  const [modalTopP, setModalTopP] = useState<number | null>(null);
  const [modalTopK, setModalTopK] = useState<number | null>(null);
  const [modalFrequencyPenalty, setModalFrequencyPenalty] = useState<number | null>(null);
  const [modalPresencePenalty, setModalPresencePenalty] = useState<number | null>(null);
  const [modalThinkingBudget, setModalThinkingBudget] = useState<number | null>(null);
  const [modalSeed, setModalSeed] = useState<number | null>(null);
  const [modalStopSequences, setModalStopSequences] = useState('');
  const [modalActive, setModalActive] = useState(true);
  const [modalPrompt, setModalPrompt] = useState('');

  // Models state
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [modelToDelete, setModelToDelete] = useState<AIModel | null>(null);
  const [savingModel, setSavingModel] = useState(false);
  
  // Model form state - Identification
  const [formName, setFormName] = useState('');
  const [formApiName, setFormApiName] = useState('');
  const [formProvider, setFormProvider] = useState('openai');
  const [formModelFamily, setFormModelFamily] = useState('');
  const [formTier, setFormTier] = useState('standard');
  const [formDescription, setFormDescription] = useState('');
  
  // Model form state - Limits
  const [formContextWindow, setFormContextWindow] = useState<number | null>(null);
  const [formMaxOutputTokens, setFormMaxOutputTokens] = useState<number | null>(null);
  const [formMaxTokens, setFormMaxTokens] = useState(2000);
  
  // Model form state - Costs
  const [formInputCost, setFormInputCost] = useState<number | null>(null);
  const [formOutputCost, setFormOutputCost] = useState<number | null>(null);
  
  // Model form state - Status
  const [formActive, setFormActive] = useState(true);
  const [formIsLegacy, setFormIsLegacy] = useState(false);
  
  // Model form state - Capabilities
  const [formSupportsTemperature, setFormSupportsTemperature] = useState(true);
  const [formSupportsTopP, setFormSupportsTopP] = useState(true);
  const [formSupportsTopK, setFormSupportsTopK] = useState(false);
  const [formSupportsFrequencyPenalty, setFormSupportsFrequencyPenalty] = useState(false);
  const [formSupportsPresencePenalty, setFormSupportsPresencePenalty] = useState(false);
  const [formSupportsStopSequences, setFormSupportsStopSequences] = useState(true);
  const [formSupportsSeed, setFormSupportsSeed] = useState(false);
  const [formSupportsJsonMode, setFormSupportsJsonMode] = useState(true);
  const [formSupportsTools, setFormSupportsTools] = useState(true);
  const [formSupportsStreaming, setFormSupportsStreaming] = useState(true);
  const [formSupportsVision, setFormSupportsVision] = useState(false);
  const [formSupportsReasoning, setFormSupportsReasoning] = useState(false);
  const [formSupportsExtendedThinking, setFormSupportsExtendedThinking] = useState(false);
  const [formSupportsThinkingBudget, setFormSupportsThinkingBudget] = useState(false);
  
  // Model form state - API Connection
  const [formApiBaseUrl, setFormApiBaseUrl] = useState('');
  const [formApiKeySecretName, setFormApiKeySecretName] = useState('');
  const [formAuthHeader, setFormAuthHeader] = useState('Authorization');
  const [formAuthPrefix, setFormAuthPrefix] = useState('Bearer ');
  const [formApiVersion, setFormApiVersion] = useState('');
  const [formExtraHeaders, setFormExtraHeaders] = useState('{}');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    
    const [providersRes, configsRes, modelsRes, historyRes] = await Promise.all([
      supabase.from('ai_providers').select('*').eq('is_active', true).order('display_name'),
      supabase.from('ai_prompt_configs').select('*').order('display_name'),
      supabase.from('ai_models').select('*').order('provider, name'),
      supabase.from('ai_prompt_config_history').select('*').order('changed_at', { ascending: false }).limit(5)
    ]);

    if (providersRes.data) {
      setProviders(providersRes.data);
    }

    if (configsRes.data) {
      setConfigs(configsRes.data);
      if (configsRes.data.length > 0 && !selectedConfig) {
        handleSelectConfig(configsRes.data[0]);
      }
    }

    if (modelsRes.data) {
      setModels(modelsRes.data as AIModel[]);
      
      // Calculate usage
      if (configsRes.data) {
        const usageCounts = configsRes.data.reduce((acc: Record<string, number>, config) => {
          if (config.model_name) {
            acc[config.model_name] = (acc[config.model_name] || 0) + 1;
          }
          return acc;
        }, {});
        
        setModelUsage(
          Object.entries(usageCounts).map(([model_name, usage_count]) => ({
            model_name,
            usage_count: usage_count as number
          }))
        );
      }
    }

    if (historyRes.data) {
      setRecentActivity(historyRes.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get models filtered by provider
  const getModelsForProvider = (providerName: string) => {
    return models.filter(m => m.provider.toLowerCase() === providerName.toLowerCase() && m.is_active);
  };

  // Get provider from model
  const getProviderFromModel = (modelName: string) => {
    const model = models.find(m => m.name === modelName);
    return model?.provider.toLowerCase() || 'openai';
  };

  // Prompts functions
  const handleSelectConfig = (config: PromptConfig) => {
    setSelectedConfig(config);
  };

  const openConfigModal = () => {
    if (selectedConfig) {
      const provider = getProviderFromModel(selectedConfig.model_name);
      setModalDisplayName(selectedConfig.display_name);
      setModalDescription(selectedConfig.description || '');
      setModalProvider(provider);
      setModalModel(selectedConfig.model_name);
      setModalMaxTokens(selectedConfig.max_tokens);
      setModalTemperature(selectedConfig.temperature);
      setModalReasoning(selectedConfig.reasoning_effort || 'low');
      setModalTopP(selectedConfig.top_p);
      setModalTopK(selectedConfig.top_k);
      setModalFrequencyPenalty(selectedConfig.frequency_penalty);
      setModalPresencePenalty(selectedConfig.presence_penalty);
      setModalThinkingBudget(selectedConfig.thinking_budget);
      setModalSeed(selectedConfig.seed);
      setModalStopSequences(selectedConfig.stop_sequences?.join(', ') || '');
      setModalActive(selectedConfig.is_active);
      setModalPrompt(selectedConfig.system_prompt);
      setAdvancedOpen(false);
      setConfigModalOpen(true);
    }
  };

  // Handle provider change - reset model
  const handleProviderChange = (newProvider: string) => {
    setModalProvider(newProvider);
    const providerModels = getModelsForProvider(newProvider);
    if (providerModels.length > 0) {
      setModalModel(providerModels[0].name);
    } else {
      setModalModel('');
    }
  };

  // Handle model provider change - auto-populate API connection fields
  const handleModelProviderChange = (newProvider: string) => {
    setFormProvider(newProvider);
    const defaults = PROVIDER_DEFAULTS[newProvider];
    if (defaults) {
      setFormApiBaseUrl(defaults.api_base_url);
      setFormApiKeySecretName(defaults.api_key_secret_name);
      setFormAuthHeader(defaults.auth_header);
      setFormAuthPrefix(defaults.auth_prefix);
      setFormApiVersion(defaults.api_version);
      setFormExtraHeaders(defaults.extra_headers);
    }
  };

  // Get model capabilities
  const getModelCapabilities = (modelName: string) => {
    const model = models.find(m => m.name === modelName);
    if (model) {
      return {
        supportsTemperature: model.supports_temperature ?? false,
        supportsReasoning: model.supports_reasoning ?? false,
        supportsExtendedThinking: model.supports_extended_thinking ?? false,
        supportsThinkingBudget: model.supports_thinking_budget ?? false,
        supportsTopP: model.supports_top_p ?? true,
        supportsTopK: model.supports_top_k ?? false,
        supportsFrequencyPenalty: model.supports_frequency_penalty ?? false,
        supportsPresencePenalty: model.supports_presence_penalty ?? false,
        supportsStopSequences: model.supports_stop_sequences ?? true,
        supportsSeed: model.supports_seed ?? false,
        supportsJsonMode: model.supports_json_mode ?? false,
        supportsTools: model.supports_tools ?? false,
        supportsVision: model.supports_vision ?? false,
        isLegacy: model.is_legacy ?? false,
        tier: model.tier,
        contextWindow: model.context_window,
        maxOutputTokens: model.max_output_tokens,
        inputCost: model.input_cost_per_1m,
        outputCost: model.output_cost_per_1m,
      };
    }
    return null;
  };

  const modalModelCapabilities = getModelCapabilities(modalModel);

  const saveFullConfig = async () => {
    if (!selectedConfig) return;
    
    setSavingPrompt(true);
    
    const promptChanged = modalPrompt !== selectedConfig.system_prompt;
    
    if (promptChanged) {
      await supabase.from('ai_prompt_config_history').insert({
        config_id: selectedConfig.id,
        function_name: selectedConfig.function_name,
        previous_prompt: selectedConfig.system_prompt,
        new_prompt: modalPrompt,
        previous_model: selectedConfig.model_name,
        new_model: modalModel,
        change_reason: 'Edição via painel administrativo'
      });
    }

    // Find provider_id from selected model
    const selectedModelData = models.find(m => m.name === modalModel);
    const providerId = selectedModelData?.provider_id || null;

    const { error } = await supabase
      .from('ai_prompt_configs')
      .update({ 
        display_name: modalDisplayName,
        description: modalDescription || null,
        model_name: modalModel,
        model_id: selectedModelData?.id || null,
        provider_id: providerId,
        max_tokens: modalMaxTokens,
        temperature: modalModelCapabilities?.supportsTemperature ? modalTemperature : null,
        reasoning_effort: modalModelCapabilities?.supportsReasoning ? modalReasoning : null,
        top_p: modalModelCapabilities?.supportsTopP ? modalTopP : null,
        top_k: modalModelCapabilities?.supportsTopK ? modalTopK : null,
        frequency_penalty: modalModelCapabilities?.supportsFrequencyPenalty ? modalFrequencyPenalty : null,
        presence_penalty: modalModelCapabilities?.supportsPresencePenalty ? modalPresencePenalty : null,
        thinking_budget: (modalModelCapabilities?.supportsThinkingBudget || modalModelCapabilities?.supportsExtendedThinking) ? modalThinkingBudget : null,
        seed: modalModelCapabilities?.supportsSeed ? modalSeed : null,
        stop_sequences: modalStopSequences ? modalStopSequences.split(',').map(s => s.trim()).filter(Boolean) : null,
        is_active: modalActive,
        system_prompt: modalPrompt,
        version: promptChanged ? selectedConfig.version + 1 : selectedConfig.version,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedConfig.id);

    if (error) {
      toast.error('Erro ao salvar configuração');
    } else {
      toast.success('Configuração salva com sucesso');
      setConfigModalOpen(false);
      fetchData();
    }
    setSavingPrompt(false);
  };

  const fetchHistory = async (functionName: string) => {
    const { data } = await supabase
      .from('ai_prompt_config_history')
      .select('*')
      .eq('function_name', functionName)
      .order('changed_at', { ascending: false })
      .limit(10);

    if (data) setHistory(data);
  };

  const openHistory = async () => {
    if (selectedConfig) {
      await fetchHistory(selectedConfig.function_name);
      setHistoryOpen(true);
    }
  };

  // Models functions
  const resetModelForm = () => {
    // Identification
    setFormName('');
    setFormApiName('');
    setFormProvider('openai');
    setFormModelFamily('');
    setFormTier('standard');
    setFormDescription('');
    // Limits
    setFormContextWindow(null);
    setFormMaxOutputTokens(null);
    setFormMaxTokens(2000);
    // Costs
    setFormInputCost(null);
    setFormOutputCost(null);
    // Status
    setFormActive(true);
    setFormIsLegacy(false);
    // Capabilities
    setFormSupportsTemperature(true);
    setFormSupportsTopP(true);
    setFormSupportsTopK(false);
    setFormSupportsFrequencyPenalty(false);
    setFormSupportsPresencePenalty(false);
    setFormSupportsStopSequences(true);
    setFormSupportsSeed(false);
    setFormSupportsJsonMode(true);
    setFormSupportsTools(true);
    setFormSupportsStreaming(true);
    setFormSupportsVision(false);
    setFormSupportsReasoning(false);
    setFormSupportsExtendedThinking(false);
    setFormSupportsThinkingBudget(false);
    // API Connection - default to OpenAI
    const defaults = PROVIDER_DEFAULTS['openai'];
    setFormApiBaseUrl(defaults.api_base_url);
    setFormApiKeySecretName(defaults.api_key_secret_name);
    setFormAuthHeader(defaults.auth_header);
    setFormAuthPrefix(defaults.auth_prefix);
    setFormApiVersion(defaults.api_version);
    setFormExtraHeaders(defaults.extra_headers);
    setEditingModel(null);
  };

  const openEditModelDialog = (model: AIModel) => {
    setEditingModel(model);
    // Identification
    setFormName(model.name);
    setFormApiName(model.api_name || '');
    setFormProvider(model.provider.toLowerCase());
    setFormModelFamily(model.model_family || '');
    setFormTier(model.tier || 'standard');
    setFormDescription(model.description || '');
    // Limits
    setFormContextWindow(model.context_window);
    setFormMaxOutputTokens(model.max_output_tokens);
    setFormMaxTokens(model.default_max_tokens);
    // Costs
    setFormInputCost(model.input_cost_per_1m);
    setFormOutputCost(model.output_cost_per_1m);
    // Status
    setFormActive(model.is_active);
    setFormIsLegacy(model.is_legacy ?? false);
    // Capabilities
    setFormSupportsTemperature(model.supports_temperature ?? true);
    setFormSupportsTopP(model.supports_top_p ?? true);
    setFormSupportsTopK(model.supports_top_k ?? false);
    setFormSupportsFrequencyPenalty(model.supports_frequency_penalty ?? false);
    setFormSupportsPresencePenalty(model.supports_presence_penalty ?? false);
    setFormSupportsStopSequences(model.supports_stop_sequences ?? true);
    setFormSupportsSeed(model.supports_seed ?? false);
    setFormSupportsJsonMode(model.supports_json_mode ?? true);
    setFormSupportsTools(model.supports_tools ?? true);
    setFormSupportsStreaming(model.supports_streaming ?? true);
    setFormSupportsVision(model.supports_vision ?? false);
    setFormSupportsReasoning(model.supports_reasoning ?? false);
    setFormSupportsExtendedThinking(model.supports_extended_thinking ?? false);
    setFormSupportsThinkingBudget(model.supports_thinking_budget ?? false);
    // API Connection
    const providerDefaults = PROVIDER_DEFAULTS[model.provider.toLowerCase()];
    setFormApiBaseUrl(model.api_base_url || providerDefaults?.api_base_url || '');
    setFormApiKeySecretName(model.api_key_secret_name || providerDefaults?.api_key_secret_name || '');
    setFormAuthHeader(model.auth_header || providerDefaults?.auth_header || 'Authorization');
    setFormAuthPrefix(model.auth_prefix || providerDefaults?.auth_prefix || 'Bearer ');
    setFormApiVersion(model.api_version || providerDefaults?.api_version || '');
    setFormExtraHeaders(model.extra_headers ? JSON.stringify(model.extra_headers) : providerDefaults?.extra_headers || '{}');
    setModelDialogOpen(true);
  };

  const openCreateModelDialog = () => {
    resetModelForm();
    setModelDialogOpen(true);
  };

  const handleSaveModel = async () => {
    if (!formName.trim()) {
      toast.error('Nome do modelo é obrigatório');
      return;
    }

    setSavingModel(true);

    // Find provider_id
    const providerData = providers.find(p => p.name.toLowerCase() === formProvider.toLowerCase());

    // Parse extra_headers JSON
    let parsedExtraHeaders = null;
    try {
      const trimmed = formExtraHeaders.trim();
      if (trimmed && trimmed !== '{}') {
        parsedExtraHeaders = JSON.parse(trimmed);
      }
    } catch (e) {
      toast.error('Extra Headers JSON inválido');
      setSavingModel(false);
      return;
    }

    const modelData = {
      // Identification
      name: formName.trim(),
      api_name: formApiName.trim() || null,
      provider: formProvider,
      provider_id: providerData?.id || null,
      model_family: formModelFamily.trim() || null,
      tier: formTier || 'standard',
      description: formDescription.trim() || null,
      // Limits
      context_window: formContextWindow,
      max_output_tokens: formMaxOutputTokens,
      default_max_tokens: formMaxTokens,
      // Costs
      input_cost_per_1m: formInputCost,
      output_cost_per_1m: formOutputCost,
      // Status
      is_active: formActive,
      is_legacy: formIsLegacy,
      // API Connection
      api_base_url: formApiBaseUrl.trim() || null,
      api_key_secret_name: formApiKeySecretName.trim() || null,
      auth_header: formAuthHeader.trim() || null,
      auth_prefix: formAuthPrefix,
      api_version: formApiVersion.trim() || null,
      extra_headers: parsedExtraHeaders,
      // Capabilities
      supports_temperature: formSupportsTemperature,
      supports_top_p: formSupportsTopP,
      supports_top_k: formSupportsTopK,
      supports_frequency_penalty: formSupportsFrequencyPenalty,
      supports_presence_penalty: formSupportsPresencePenalty,
      supports_stop_sequences: formSupportsStopSequences,
      supports_seed: formSupportsSeed,
      supports_json_mode: formSupportsJsonMode,
      supports_tools: formSupportsTools,
      supports_streaming: formSupportsStreaming,
      supports_vision: formSupportsVision,
      supports_reasoning: formSupportsReasoning,
      supports_extended_thinking: formSupportsExtendedThinking,
      supports_thinking_budget: formSupportsThinkingBudget,
      updated_at: new Date().toISOString()
    };

    let error;

    if (editingModel) {
      const result = await supabase.from('ai_models').update(modelData).eq('id', editingModel.id);
      error = result.error;
    } else {
      const result = await supabase.from('ai_models').insert(modelData);
      error = result.error;
    }

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success(editingModel ? 'Modelo atualizado' : 'Modelo criado');
      setModelDialogOpen(false);
      resetModelForm();
      fetchData();
    }

    setSavingModel(false);
  };

  const handleDeleteModel = async () => {
    if (!modelToDelete) return;

    const usage = modelUsage.find(u => u.model_name === modelToDelete.name);
    if (usage && usage.usage_count > 0) {
      toast.error(`Não é possível excluir: modelo em uso por ${usage.usage_count} função(ões)`);
      setDeleteDialogOpen(false);
      return;
    }

    const { error } = await supabase.from('ai_models').delete().eq('id', modelToDelete.id);

    if (error) {
      toast.error('Erro ao excluir');
    } else {
      toast.success('Modelo excluído');
      setDeleteDialogOpen(false);
      setModelToDelete(null);
      fetchData();
    }
  };

  const toggleModelActive = async (model: AIModel) => {
    const { error } = await supabase
      .from('ai_models')
      .update({ is_active: !model.is_active, updated_at: new Date().toISOString() })
      .eq('id', model.id);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success(model.is_active ? 'Modelo desativado' : 'Modelo ativado');
      fetchData();
    }
  };

  // Helpers
  const getUsageCount = (modelName: string) => modelUsage.find(u => u.model_name === modelName)?.usage_count || 0;
  const getLineCount = (text: string) => text.split('\n').length;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const formatDateShort = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const activeModels = models.filter(m => m.is_active);
  
  const getModelInfo = (modelName: string) => {
    return MODEL_INFO[modelName] || { icon: '🤖', label: 'Modelo', color: 'text-muted-foreground' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-mono">Configurações IA</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie prompts e modelos multi-provedor
            </p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview" className="font-mono text-xs">
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="prompts" className="font-mono text-xs">
              <Settings2 className="h-4 w-4 mr-2" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="models" className="font-mono text-xs">
              <Brain className="h-4 w-4 mr-2" />
              Modelos
            </TabsTrigger>
          </TabsList>

          {/* ==================== OVERVIEW TAB ==================== */}
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <>
                {/* Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-primary" />
                        Prompts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono">{configs.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {configs.filter(c => c.is_active).length} ativos
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Modelos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono">{models.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {activeModels.length} ativos
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        Provedores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono">{providers.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {providers.map(p => PROVIDER_ICONS[p.name] || '🔌').join(' ')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Alterações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono">{recentActivity.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Últimas 24h
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Provider Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-mono">Modelos por Provedor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                      {providers.map(provider => {
                        const providerModels = models.filter(m => m.provider.toLowerCase() === provider.name.toLowerCase());
                        const activeCount = providerModels.filter(m => m.is_active).length;
                        return (
                          <div key={provider.id} className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{PROVIDER_ICONS[provider.name] || '🔌'}</span>
                              <span className="font-mono text-sm">{provider.display_name}</span>
                            </div>
                            <div className="text-2xl font-bold font-mono">{providerModels.length}</div>
                            <p className="text-xs text-muted-foreground">{activeCount} ativos</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma alteração recente</p>
                    ) : (
                      <div className="space-y-3">
                        {recentActivity.map(activity => (
                          <div key={activity.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                            <Code2 className="h-4 w-4 text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono truncate">{activity.function_name}</p>
                              <p className="text-xs text-muted-foreground">{activity.change_reason}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {formatDateShort(activity.changed_at)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* ==================== PROMPTS TAB ==================== */}
          <TabsContent value="prompts" className="space-y-4">
            {loading ? (
              <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-[400px]" />
                <Skeleton className="h-[400px] col-span-2" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {/* Functions List */}
                <Card className="md:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono">Funções IA</CardTitle>
                    <CardDescription className="text-xs">
                      Selecione uma função para editar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      {configs.map(config => (
                        <div
                          key={config.id}
                          onClick={() => handleSelectConfig(config)}
                          className={`flex items-center gap-3 p-3 cursor-pointer border-b border-border/50 hover:bg-muted/50 transition-colors ${
                            selectedConfig?.id === config.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{config.display_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={config.is_active ? 'default' : 'secondary'} className="text-[10px] h-4">
                                {config.is_active ? 'Ativo' : 'Inativo'}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                v{config.version}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Config Editor */}
                <Card className="md:col-span-2">
                  {selectedConfig ? (
                    <>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-mono">{selectedConfig.display_name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {selectedConfig.description || selectedConfig.function_name}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={openHistory}>
                              <History className="h-4 w-4 mr-1" />
                              Histórico
                            </Button>
                            <Button size="sm" onClick={openConfigModal}>
                              <Settings2 className="h-4 w-4 mr-1" />
                              Configurar
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Current Config Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Provedor</p>
                            <p className="text-sm font-mono mt-1">
                              {PROVIDER_ICONS[getProviderFromModel(selectedConfig.model_name)] || '🔌'}{' '}
                              {getProviderFromModel(selectedConfig.model_name)}
                            </p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Modelo</p>
                            <p className="text-sm font-mono mt-1 truncate">
                              {getModelInfo(selectedConfig.model_name).icon} {selectedConfig.model_name.split('-').slice(0, 2).join('-')}
                            </p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Max Tokens</p>
                            <p className="text-sm font-mono mt-1">{selectedConfig.max_tokens.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {selectedConfig.reasoning_effort ? 'Reasoning' : 'Temperature'}
                            </p>
                            <p className="text-sm font-mono mt-1">
                              {selectedConfig.reasoning_effort || selectedConfig.temperature || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* System Prompt Preview */}
                        <div>
                          <Label className="text-xs text-muted-foreground">System Prompt ({getLineCount(selectedConfig.system_prompt)} linhas)</Label>
                          <ScrollArea className="h-[280px] mt-2 border border-border rounded-lg">
                            <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                              {selectedConfig.system_prompt}
                            </pre>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-[500px]">
                      <p className="text-muted-foreground">Selecione uma função para visualizar</p>
                    </CardContent>
                  )}
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ==================== MODELS TAB ==================== */}
          <TabsContent value="models" className="space-y-4">
            {loading ? (
              <Skeleton className="h-[400px]" />
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="font-mono">Modelos de IA</CardTitle>
                    <CardDescription className="text-xs">
                      {models.length} modelos • {activeModels.length} ativos
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={openCreateModelDialog}>
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Modelo
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Modelo</TableHead>
                          <TableHead>Provedor</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead className="text-right">Contexto</TableHead>
                          <TableHead className="text-right">Custo ($/1M)</TableHead>
                          <TableHead className="text-center">Capabilities</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {models.map(model => {
                          const info = getModelInfo(model.name);
                          const usage = getUsageCount(model.name);
                          return (
                            <TableRow key={model.id} className={!model.is_active ? 'opacity-50' : ''}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{info.icon}</span>
                                  <div>
                                    <p className="font-mono text-sm">{model.name}</p>
                                    {model.model_family && (
                                      <p className="text-[10px] text-muted-foreground">{model.model_family}</p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span>{PROVIDER_ICONS[model.provider.toLowerCase()] || '🔌'}</span>
                                  <span className="text-sm capitalize">{model.provider}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {model.tier && (
                                  <Badge variant="outline" className="text-[10px]">
                                    {model.tier}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {model.context_window ? `${(model.context_window / 1000).toFixed(0)}K` : '-'}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {model.input_cost_per_1m !== null ? (
                                  <span>${model.input_cost_per_1m.toFixed(2)} / ${model.output_cost_per_1m?.toFixed(2) || '-'}</span>
                                ) : '-'}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  {model.supports_vision && <span title="Vision">👁</span>}
                                  {model.supports_tools && <span title="Tools">🔧</span>}
                                  {model.supports_reasoning && <span title="Reasoning">🧠</span>}
                                  {model.supports_thinking_budget && <span title="Thinking">💭</span>}
                                  {model.supports_streaming && <span title="Stream">📡</span>}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Switch
                                    checked={model.is_active}
                                    onCheckedChange={() => toggleModelActive(model)}
                                    className="scale-75"
                                  />
                                  {usage > 0 && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      {usage}x
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModelDialog(model)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-destructive" 
                                    onClick={() => { setModelToDelete(model); setDeleteDialogOpen(true); }}
                                    disabled={usage > 0}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* ==================== CONFIG MODAL ==================== */}
        <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono">Configuração: {selectedConfig?.display_name}</DialogTitle>
              <DialogDescription>
                Configure o modelo, parâmetros e prompt do sistema
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome de Exibição</Label>
                  <Input
                    id="displayName"
                    value={modalDisplayName}
                    onChange={e => setModalDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={modalDescription}
                    onChange={e => setModalDescription(e.target.value)}
                    placeholder="Descrição opcional"
                  />
                </div>
              </div>

              {/* Provider and Model Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provedor</Label>
                  <Select value={modalProvider} onValueChange={handleProviderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o provedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.name.toLowerCase()}>
                          {PROVIDER_ICONS[provider.name] || '🔌'} {provider.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select value={modalModel} onValueChange={setModalModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {getModelsForProvider(modalProvider).map(model => {
                        const info = getModelInfo(model.name);
                        return (
                          <SelectItem key={model.id} value={model.name}>
                            {info.icon} {model.name} 
                            {model.tier && <span className="text-muted-foreground ml-2">({model.tier})</span>}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Model Capabilities Info */}
              {modalModelCapabilities && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Capabilities do Modelo</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {modalModelCapabilities.supportsTemperature && <Badge variant="outline" className="text-[10px]">Temperature</Badge>}
                    {modalModelCapabilities.supportsReasoning && <Badge variant="outline" className="text-[10px]">Reasoning</Badge>}
                    {modalModelCapabilities.supportsThinkingBudget && <Badge variant="outline" className="text-[10px]">Thinking Budget</Badge>}
                    {modalModelCapabilities.supportsExtendedThinking && <Badge variant="outline" className="text-[10px]">Extended Thinking</Badge>}
                    {modalModelCapabilities.supportsTopK && <Badge variant="outline" className="text-[10px]">Top K</Badge>}
                    {modalModelCapabilities.supportsVision && <Badge variant="outline" className="text-[10px]">Vision</Badge>}
                    {modalModelCapabilities.supportsTools && <Badge variant="outline" className="text-[10px]">Tools</Badge>}
                    {modalModelCapabilities.contextWindow && (
                      <Badge variant="secondary" className="text-[10px]">
                        {(modalModelCapabilities.contextWindow / 1000).toFixed(0)}K ctx
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Main Parameters */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={modalMaxTokens}
                    onChange={e => setModalMaxTokens(parseInt(e.target.value) || 2000)}
                  />
                </div>

                {/* Temperature - only show if supported */}
                {modalModelCapabilities?.supportsTemperature && (
                  <div className="space-y-2">
                    <Label>Temperature: {modalTemperature?.toFixed(1) || '0.7'}</Label>
                    <Slider
                      value={[modalTemperature ?? 0.7]}
                      onValueChange={([v]) => setModalTemperature(v)}
                      min={0}
                      max={2}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                )}

                {/* Reasoning Effort - only show if supported */}
                {modalModelCapabilities?.supportsReasoning && (
                  <div className="space-y-2">
                    <Label>Reasoning Effort</Label>
                    <Select value={modalReasoning} onValueChange={setModalReasoning}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Thinking Budget - only show if supported */}
                {(modalModelCapabilities?.supportsThinkingBudget || modalModelCapabilities?.supportsExtendedThinking) && (
                  <div className="space-y-2">
                    <Label htmlFor="thinkingBudget">Thinking Budget (tokens)</Label>
                    <Input
                      id="thinkingBudget"
                      type="number"
                      value={modalThinkingBudget ?? ''}
                      onChange={e => setModalThinkingBudget(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Ex: 10000"
                    />
                  </div>
                )}
              </div>

              {/* Advanced Parameters - Collapsible */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Parâmetros Avançados
                    </span>
                    {advancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {modalModelCapabilities?.supportsTopP && (
                      <div className="space-y-2">
                        <Label>Top P: {modalTopP?.toFixed(2) || 'default'}</Label>
                        <Slider
                          value={[modalTopP ?? 1]}
                          onValueChange={([v]) => setModalTopP(v)}
                          min={0}
                          max={1}
                          step={0.05}
                        />
                      </div>
                    )}

                    {modalModelCapabilities?.supportsTopK && (
                      <div className="space-y-2">
                        <Label htmlFor="topK">Top K</Label>
                        <Input
                          id="topK"
                          type="number"
                          value={modalTopK ?? ''}
                          onChange={e => setModalTopK(e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="Ex: 40"
                        />
                      </div>
                    )}

                    {modalModelCapabilities?.supportsFrequencyPenalty && (
                      <div className="space-y-2">
                        <Label>Frequency Penalty: {modalFrequencyPenalty?.toFixed(1) || '0'}</Label>
                        <Slider
                          value={[modalFrequencyPenalty ?? 0]}
                          onValueChange={([v]) => setModalFrequencyPenalty(v)}
                          min={-2}
                          max={2}
                          step={0.1}
                        />
                      </div>
                    )}

                    {modalModelCapabilities?.supportsPresencePenalty && (
                      <div className="space-y-2">
                        <Label>Presence Penalty: {modalPresencePenalty?.toFixed(1) || '0'}</Label>
                        <Slider
                          value={[modalPresencePenalty ?? 0]}
                          onValueChange={([v]) => setModalPresencePenalty(v)}
                          min={-2}
                          max={2}
                          step={0.1}
                        />
                      </div>
                    )}

                    {modalModelCapabilities?.supportsSeed && (
                      <div className="space-y-2">
                        <Label htmlFor="seed">Seed (opcional)</Label>
                        <Input
                          id="seed"
                          type="number"
                          value={modalSeed ?? ''}
                          onChange={e => setModalSeed(e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="Ex: 12345"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stopSequences">Stop Sequences (separados por vírgula)</Label>
                    <Input
                      id="stopSequences"
                      value={modalStopSequences}
                      onChange={e => setModalStopSequences(e.target.value)}
                      placeholder="Ex: ###, END, STOP"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={modalPrompt}
                  onChange={e => setModalPrompt(e.target.value)}
                  className="min-h-[300px] font-mono text-xs"
                  placeholder="Insira o prompt do sistema..."
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <Label>Status da Função</Label>
                  <p className="text-xs text-muted-foreground">Ativar/desativar esta função de IA</p>
                </div>
                <Switch checked={modalActive} onCheckedChange={setModalActive} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveFullConfig} disabled={savingPrompt}>
                {savingPrompt ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configuração
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ==================== HISTORY DIALOG ==================== */}
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono">Histórico de Alterações</DialogTitle>
              <DialogDescription>
                {selectedConfig?.display_name}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma alteração registrada
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map(h => (
                    <div key={h.id} className="p-4 border border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{formatDate(h.changed_at)}</Badge>
                        {h.new_model && h.new_model !== h.previous_model && (
                          <Badge variant="secondary" className="text-xs">
                            Modelo: {h.previous_model} → {h.new_model}
                          </Badge>
                        )}
                      </div>
                      {h.change_reason && (
                        <p className="text-sm text-muted-foreground">{h.change_reason}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-destructive/10 rounded">
                          <p className="font-medium text-destructive mb-1">Anterior</p>
                          <pre className="whitespace-pre-wrap line-clamp-5">{h.previous_prompt || 'N/A'}</pre>
                        </div>
                        <div className="p-2 bg-primary/10 rounded">
                          <p className="font-medium text-primary mb-1">Novo</p>
                          <pre className="whitespace-pre-wrap line-clamp-5">{h.new_prompt}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* ==================== MODEL DIALOG ==================== */}
        <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {editingModel ? 'Editar Modelo' : 'Novo Modelo'}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="identification" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="identification">Identificação</TabsTrigger>
                <TabsTrigger value="connection">Conexão API</TabsTrigger>
                <TabsTrigger value="limits">Limites</TabsTrigger>
                <TabsTrigger value="costs">Custos</TabsTrigger>
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>
              
              {/* IDENTIFICATION TAB */}
              <TabsContent value="identification" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelName">Nome do Modelo *</Label>
                    <Input
                      id="modelName"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="Ex: gpt-5-nano-2025-08-07"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiName">API Name</Label>
                    <Input
                      id="apiName"
                      value={formApiName}
                      onChange={e => setFormApiName(e.target.value)}
                      placeholder="Ex: gpt-5-nano-2025-08-07"
                    />
                    <p className="text-xs text-muted-foreground">Identificador usado nas chamadas de API</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Provedor</Label>
                    <Select value={formProvider} onValueChange={handleModelProviderChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map(p => (
                          <SelectItem key={p.id} value={p.name.toLowerCase()}>
                            {PROVIDER_ICONS[p.name] || '🔌'} {p.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelFamily">Model Family</Label>
                    <Input
                      id="modelFamily"
                      value={formModelFamily}
                      onChange={e => setFormModelFamily(e.target.value)}
                      placeholder="Ex: gpt-5, claude-3, gemini-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tier</Label>
                  <Select value={formTier} onValueChange={setFormTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">💰 Economy</SelectItem>
                      <SelectItem value="standard">⚖️ Standard</SelectItem>
                      <SelectItem value="premium">💎 Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modelDesc">Descrição</Label>
                  <Textarea
                    id="modelDesc"
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Descrição do modelo..."
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              {/* CONNECTION TAB */}
              <TabsContent value="connection" className="space-y-4 pt-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border mb-4">
                  <p className="text-sm text-muted-foreground">
                    Configurações de conexão da API. Estes valores são preenchidos automaticamente ao selecionar um provedor, mas podem ser personalizados.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiBaseUrl">API Base URL *</Label>
                  <Input
                    id="apiBaseUrl"
                    value={formApiBaseUrl}
                    onChange={e => setFormApiBaseUrl(e.target.value)}
                    placeholder="https://api.openai.com/v1/chat/completions"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKeySecretName">Secret Name</Label>
                    <Input
                      id="apiKeySecretName"
                      value={formApiKeySecretName}
                      onChange={e => setFormApiKeySecretName(e.target.value)}
                      placeholder="Ex: OPENAI_API_KEY"
                    />
                    <p className="text-xs text-muted-foreground">Nome do segredo no Supabase Vault</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiVersion">API Version</Label>
                    <Input
                      id="apiVersion"
                      value={formApiVersion}
                      onChange={e => setFormApiVersion(e.target.value)}
                      placeholder="Ex: 2023-06-01"
                    />
                    <p className="text-xs text-muted-foreground">Versão da API (se aplicável)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="authHeader">Auth Header</Label>
                    <Input
                      id="authHeader"
                      value={formAuthHeader}
                      onChange={e => setFormAuthHeader(e.target.value)}
                      placeholder="Authorization"
                    />
                    <p className="text-xs text-muted-foreground">Header de autenticação</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authPrefix">Auth Prefix</Label>
                    <Input
                      id="authPrefix"
                      value={formAuthPrefix}
                      onChange={e => setFormAuthPrefix(e.target.value)}
                      placeholder="Bearer "
                    />
                    <p className="text-xs text-muted-foreground">Prefixo antes da API key</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="extraHeaders">Extra Headers (JSON)</Label>
                  <Textarea
                    id="extraHeaders"
                    value={formExtraHeaders}
                    onChange={e => setFormExtraHeaders(e.target.value)}
                    placeholder='{"anthropic-version": "2023-06-01"}'
                    rows={3}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">Headers adicionais em formato JSON</p>
                </div>
              </TabsContent>
              
              {/* LIMITS TAB */}
              <TabsContent value="limits" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contextWindow">Context Window</Label>
                    <Input
                      id="contextWindow"
                      type="number"
                      value={formContextWindow || ''}
                      onChange={e => setFormContextWindow(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Ex: 128000"
                    />
                    <p className="text-xs text-muted-foreground">Máximo de tokens de entrada</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxOutputTokens">Max Output Tokens</Label>
                    <Input
                      id="maxOutputTokens"
                      type="number"
                      value={formMaxOutputTokens || ''}
                      onChange={e => setFormMaxOutputTokens(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Ex: 16384"
                    />
                    <p className="text-xs text-muted-foreground">Máximo de tokens de saída</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultMaxTokens">Default Max Tokens</Label>
                  <Input
                    id="defaultMaxTokens"
                    type="number"
                    value={formMaxTokens}
                    onChange={e => setFormMaxTokens(parseInt(e.target.value) || 2000)}
                    placeholder="Ex: 2000"
                  />
                  <p className="text-xs text-muted-foreground">Valor padrão usado nas configurações de prompt</p>
                </div>
              </TabsContent>
              
              {/* COSTS TAB */}
              <TabsContent value="costs" className="space-y-4 pt-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Custos por 1 milhão de tokens (USD). Usados para análise de ROI e estimativas de custo.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inputCost">Input Cost ($/1M tokens)</Label>
                      <Input
                        id="inputCost"
                        type="number"
                        step="0.01"
                        value={formInputCost || ''}
                        onChange={e => setFormInputCost(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Ex: 0.15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outputCost">Output Cost ($/1M tokens)</Label>
                      <Input
                        id="outputCost"
                        type="number"
                        step="0.01"
                        value={formOutputCost || ''}
                        onChange={e => setFormOutputCost(e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Ex: 0.60"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* CAPABILITIES TAB */}
              <TabsContent value="capabilities" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {/* Generation */}
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">🎛️ Geração</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Temperature</Label>
                    <Switch checked={formSupportsTemperature} onCheckedChange={setFormSupportsTemperature} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Top P</Label>
                    <Switch checked={formSupportsTopP} onCheckedChange={setFormSupportsTopP} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Top K</Label>
                    <Switch checked={formSupportsTopK} onCheckedChange={setFormSupportsTopK} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Stop Sequences</Label>
                    <Switch checked={formSupportsStopSequences} onCheckedChange={setFormSupportsStopSequences} />
                  </div>
                  
                  {/* Advanced */}
                  <div className="col-span-2 pt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">🧠 Avançado</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Reasoning</Label>
                    <Switch checked={formSupportsReasoning} onCheckedChange={setFormSupportsReasoning} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Extended Thinking</Label>
                    <Switch checked={formSupportsExtendedThinking} onCheckedChange={setFormSupportsExtendedThinking} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Thinking Budget</Label>
                    <Switch checked={formSupportsThinkingBudget} onCheckedChange={setFormSupportsThinkingBudget} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Seed</Label>
                    <Switch checked={formSupportsSeed} onCheckedChange={setFormSupportsSeed} />
                  </div>
                  
                  {/* Features */}
                  <div className="col-span-2 pt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">✨ Features</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">JSON Mode</Label>
                    <Switch checked={formSupportsJsonMode} onCheckedChange={setFormSupportsJsonMode} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Tools/Functions</Label>
                    <Switch checked={formSupportsTools} onCheckedChange={setFormSupportsTools} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Streaming</Label>
                    <Switch checked={formSupportsStreaming} onCheckedChange={setFormSupportsStreaming} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Vision</Label>
                    <Switch checked={formSupportsVision} onCheckedChange={setFormSupportsVision} />
                  </div>
                  
                  {/* Penalties */}
                  <div className="col-span-2 pt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">⚖️ Penalties</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Frequency Penalty</Label>
                    <Switch checked={formSupportsFrequencyPenalty} onCheckedChange={setFormSupportsFrequencyPenalty} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Presence Penalty</Label>
                    <Switch checked={formSupportsPresencePenalty} onCheckedChange={setFormSupportsPresencePenalty} />
                  </div>
                </div>
              </TabsContent>
              
              {/* STATUS TAB */}
              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="text-base">Modelo Ativo</Label>
                      <p className="text-sm text-muted-foreground">
                        Modelos ativos aparecem nas configurações de prompt
                      </p>
                    </div>
                    <Switch checked={formActive} onCheckedChange={setFormActive} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <Label className="text-base">Modelo Legacy</Label>
                      <p className="text-sm text-muted-foreground">
                        Modelos legacy são marcados como obsoletos mas ainda funcionam
                      </p>
                    </div>
                    <Switch checked={formIsLegacy} onCheckedChange={setFormIsLegacy} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setModelDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveModel} disabled={savingModel}>
                {savingModel ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ==================== DELETE DIALOG ==================== */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o modelo "{modelToDelete?.name}"?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteModel}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
