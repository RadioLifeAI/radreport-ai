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
  Info
} from 'lucide-react';

// Types
interface PromptConfig {
  id: string;
  function_name: string;
  display_name: string;
  description: string | null;
  system_prompt: string;
  model_name: string;
  model_id: string | null;
  max_tokens: number;
  reasoning_effort: string;
  temperature: number;
  is_active: boolean;
  version: number;
  updated_at: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  is_active: boolean;
  default_max_tokens: number;
  created_at: string;
  updated_at: string;
  // New capability fields
  supports_temperature: boolean;
  supports_reasoning: boolean;
  is_legacy: boolean;
  api_name: string | null;
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

const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Groq', 'Meta', 'Mistral'];

// Model info for icons and descriptions
const MODEL_INFO: Record<string, { icon: string; label: string; color: string }> = {
  'gpt-5-nano-2025-08-07': { icon: '💡', label: 'Econômico, Rápido', color: 'text-green-400' },
  'gpt-5-2025-08-07': { icon: '⭐', label: 'Flagship', color: 'text-cyan-400' },
  'gpt-4o-mini': { icon: '⚡', label: 'Legacy Mini', color: 'text-yellow-400' },
  'gpt-4o': { icon: '🚀', label: 'Legacy Flagship', color: 'text-orange-400' },
  'gpt-4.1-2025-04-14': { icon: '🔮', label: 'Reasoning', color: 'text-purple-400' },
  'o3-mini': { icon: '🧠', label: 'Reasoning Compact', color: 'text-blue-400' },
  'o3': { icon: '🧠', label: 'Reasoning Full', color: 'text-indigo-400' },
  'o4-mini': { icon: '✨', label: 'Reasoning Next', color: 'text-pink-400' },
  'claude-3-5-sonnet': { icon: '🎭', label: 'Anthropic', color: 'text-amber-400' },
  'gemini-2.0-flash': { icon: '💎', label: 'Google', color: 'text-sky-400' },
  'whisper-large-v3-turbo': { icon: '🎤', label: 'Transcrição', color: 'text-rose-400' },
};

export default function AIConfigPage() {
  // Shared state
  const [loading, setLoading] = useState(true);
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
  
  // Config modal state (all-in-one)
  const [modalDisplayName, setModalDisplayName] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalModel, setModalModel] = useState('');
  const [modalMaxTokens, setModalMaxTokens] = useState(2000);
  const [modalTemperature, setModalTemperature] = useState(0.7);
  const [modalReasoning, setModalReasoning] = useState('low');
  const [modalActive, setModalActive] = useState(true);
  const [modalPrompt, setModalPrompt] = useState('');

  // Models state
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [modelToDelete, setModelToDelete] = useState<AIModel | null>(null);
  const [savingModel, setSavingModel] = useState(false);
  
  // Model form state
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('OpenAI');
  const [formDescription, setFormDescription] = useState('');
  const [formMaxTokens, setFormMaxTokens] = useState(2000);
  const [formActive, setFormActive] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    
    const [configsRes, modelsRes, historyRes] = await Promise.all([
      supabase.from('ai_prompt_configs').select('*').order('display_name'),
      supabase.from('ai_models').select('*').order('name'),
      supabase.from('ai_prompt_config_history').select('*').order('changed_at', { ascending: false }).limit(5)
    ]);

    if (configsRes.data) {
      setConfigs(configsRes.data);
      if (configsRes.data.length > 0 && !selectedConfig) {
        handleSelectConfig(configsRes.data[0]);
      }
    }

    if (modelsRes.data) {
      setModels(modelsRes.data);
      
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

  // Prompts functions
  const handleSelectConfig = (config: PromptConfig) => {
    setSelectedConfig(config);
  };

  const openConfigModal = () => {
    if (selectedConfig) {
      setModalDisplayName(selectedConfig.display_name);
      setModalDescription(selectedConfig.description || '');
      setModalModel(selectedConfig.model_name);
      setModalMaxTokens(selectedConfig.max_tokens);
      setModalTemperature(selectedConfig.temperature);
      setModalReasoning(selectedConfig.reasoning_effort);
      setModalActive(selectedConfig.is_active);
      setModalPrompt(selectedConfig.system_prompt);
      setConfigModalOpen(true);
    }
  };

  const saveFullConfig = async () => {
    if (!selectedConfig) return;
    
    setSavingPrompt(true);
    
    // Check if prompt changed to save history
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

    const { error } = await supabase
      .from('ai_prompt_configs')
      .update({ 
        display_name: modalDisplayName,
        description: modalDescription || null,
        model_name: modalModel,
        max_tokens: modalMaxTokens,
        temperature: modalTemperature,
        reasoning_effort: modalReasoning,
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
    setFormName('');
    setFormProvider('OpenAI');
    setFormDescription('');
    setFormMaxTokens(2000);
    setFormActive(true);
    setEditingModel(null);
  };

  const openEditModelDialog = (model: AIModel) => {
    setEditingModel(model);
    setFormName(model.name);
    setFormProvider(model.provider);
    setFormDescription(model.description || '');
    setFormMaxTokens(model.default_max_tokens);
    setFormActive(model.is_active);
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

    const modelData = {
      name: formName.trim(),
      provider: formProvider,
      description: formDescription.trim() || null,
      default_max_tokens: formMaxTokens,
      is_active: formActive,
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

  const getModelProvider = (modelName: string) => {
    const model = models.find(m => m.name === modelName);
    return model?.provider || 'OpenAI';
  };

  // Get model capabilities from database
  const getModelCapabilities = (modelName: string) => {
    const model = models.find(m => m.name === modelName);
    if (model) {
      return {
        supportsTemperature: model.supports_temperature ?? false,
        supportsReasoning: model.supports_reasoning ?? false,
        isLegacy: model.is_legacy ?? false,
      };
    }
    // Fallback: infer from model name if not in database
    const isLegacy = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5', 'gpt-4-turbo'].some(
      legacy => modelName.toLowerCase().includes(legacy.toLowerCase())
    );
    const isReasoning = ['gpt-5', 'o3', 'o4', 'gpt-4.1'].some(
      rm => modelName.toLowerCase().includes(rm.toLowerCase())
    );
    return {
      supportsTemperature: isLegacy,
      supportsReasoning: isReasoning,
      isLegacy,
    };
  };

  // Current modal model capabilities
  const modalModelCapabilities = getModelCapabilities(modalModel);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-mono">Configurações IA</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie prompts e modelos de inteligência artificial
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
                        Prompts Configurados
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
                        Modelos Disponíveis
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
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Providers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono">
                        {new Set(models.map(m => m.provider)).size}
                      </div>
                      <p className="text-xs text-muted-foreground">provedores de IA</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Alterações Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-mono">{recentActivity.length}</div>
                      <p className="text-xs text-muted-foreground">últimos 5 dias</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Usage per Model */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-mono flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Uso por Modelo
                      </CardTitle>
                      <CardDescription>Quantas funções utilizam cada modelo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {activeModels.map((model) => {
                          const count = getUsageCount(model.name);
                          const percentage = configs.length > 0 ? (count / configs.length) * 100 : 0;
                          const info = getModelInfo(model.name);
                          return (
                            <div key={model.id} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-mono flex items-center gap-2">
                                  <span className={info.color}>{info.icon}</span>
                                  {model.name}
                                </span>
                                <Badge variant={count > 0 ? 'default' : 'secondary'} className="font-mono">
                                  {count} funções
                                </Badge>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        {activeModels.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">Nenhum modelo ativo</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-mono flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Atividade Recente
                      </CardTitle>
                      <CardDescription>Últimas alterações em prompts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono truncate">{item.function_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.new_model && `Modelo: ${item.new_model}`}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                              {formatDateShort(item.changed_at)}
                            </span>
                          </div>
                        ))}
                        {recentActivity.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* ==================== PROMPTS TAB ==================== */}
          <TabsContent value="prompts" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[500px] w-full" />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-4">
                {/* Functions List */}
                <Card className="lg:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-mono flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Edge Functions
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {configs.length} funções configuradas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      <div className="px-2 pb-2 space-y-1">
                        {configs.map((config) => {
                          const info = getModelInfo(config.model_name);
                          return (
                            <button
                              key={config.id}
                              onClick={() => handleSelectConfig(config)}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                selectedConfig?.id === config.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-sm font-medium truncate">
                                  {config.display_name}
                                </span>
                                <ChevronRight className={`h-4 w-4 flex-shrink-0 ${
                                  selectedConfig?.id === config.id ? 'opacity-100' : 'opacity-50'
                                }`} />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs ${selectedConfig?.id === config.id ? 'opacity-80' : info.color}`}>
                                  {info.icon}
                                </span>
                                <span className="text-[10px] opacity-70 font-mono truncate">
                                  {config.model_name}
                                </span>
                                {!config.is_active && (
                                  <Badge variant="secondary" className="text-[9px] px-1">
                                    Inativo
                                  </Badge>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Editor Panel */}
                <Card className="lg:col-span-3">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-mono flex items-center gap-2">
                          {selectedConfig?.display_name || 'Selecione uma função'}
                          {selectedConfig && (
                            <Badge variant="outline" className="font-mono text-xs">
                              v{selectedConfig.version}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {selectedConfig?.description || 'Selecione uma função para editar'}
                        </CardDescription>
                      </div>
                      {selectedConfig && (
                        <Button onClick={openConfigModal} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar Configuração
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedConfig ? (
                      <>
                        {/* Current Config Display */}
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <Badge variant="outline" className="font-mono text-xs gap-1">
                            <span className={getModelInfo(selectedConfig.model_name).color}>
                              {getModelInfo(selectedConfig.model_name).icon}
                            </span>
                            {selectedConfig.model_name}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            {selectedConfig.max_tokens} tokens
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            temp: {selectedConfig.temperature}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              selectedConfig.reasoning_effort === 'low' ? 'bg-green-500' :
                              selectedConfig.reasoning_effort === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            reasoning: {selectedConfig.reasoning_effort}
                          </Badge>
                          <Badge variant={selectedConfig.is_active ? 'default' : 'secondary'} className="font-mono text-xs">
                            {selectedConfig.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>

                        {/* Prompt Preview (Read-only) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-mono text-sm flex items-center gap-2">
                              <Code2 className="h-4 w-4" />
                              System Prompt
                            </Label>
                            <span className="text-xs text-muted-foreground font-mono">
                              {getLineCount(selectedConfig.system_prompt)} linhas • {selectedConfig.system_prompt.length} chars
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 rounded-l-md border-r border-border flex flex-col items-center pt-3 font-mono text-[10px] text-muted-foreground overflow-hidden select-none">
                              {Array.from({ length: Math.min(getLineCount(selectedConfig.system_prompt), 20) }, (_, i) => (
                                <div key={i} className="h-[21px] leading-[21px]">
                                  {i + 1}
                                </div>
                              ))}
                            </div>
                            <Textarea
                              value={selectedConfig.system_prompt}
                              readOnly
                              rows={12}
                              className="font-mono text-sm pl-12 leading-[21px] resize-none bg-muted/20 cursor-default"
                              spellCheck={false}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="font-mono">
                              Última alteração: {formatDate(selectedConfig.updated_at)}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" onClick={openHistory}>
                            <History className="h-4 w-4 mr-2" />
                            Histórico
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        Selecione uma função para visualizar
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ==================== MODELS TAB ==================== */}
          <TabsContent value="models" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">Total de Modelos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">{models.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">Modelos Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-green-500">
                    {activeModels.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-primary">
                    {new Set(models.map(m => m.provider)).size}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Models Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-mono flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Modelos Cadastrados
                    </CardTitle>
                    <CardDescription>
                      {models.length} modelos configurados no sistema
                    </CardDescription>
                  </div>
                  <Button onClick={openCreateModelDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Modelo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-mono">Nome</TableHead>
                          <TableHead className="font-mono">Provider</TableHead>
                          <TableHead className="font-mono text-center">Max Tokens</TableHead>
                          <TableHead className="font-mono text-center">Em Uso</TableHead>
                          <TableHead className="font-mono text-center">Status</TableHead>
                          <TableHead className="font-mono text-center">Criado</TableHead>
                          <TableHead className="font-mono text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {models.map((model) => {
                          const info = getModelInfo(model.name);
                          return (
                            <TableRow key={model.id}>
                              <TableCell className="font-mono font-medium">
                                <div className="flex items-center gap-2">
                                  <span className={info.color}>{info.icon}</span>
                                  {model.name}
                                </div>
                                {model.description && (
                                  <span className="text-xs text-muted-foreground block mt-0.5">
                                    {model.description}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {model.provider}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {model.default_max_tokens.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge 
                                  variant={getUsageCount(model.name) > 0 ? 'default' : 'secondary'}
                                  className="font-mono"
                                >
                                  {getUsageCount(model.name)} funções
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <button 
                                  onClick={() => toggleModelActive(model)}
                                  className="inline-flex items-center gap-1"
                                >
                                  {model.is_active ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="text-center text-sm text-muted-foreground font-mono">
                                {formatDateShort(model.created_at)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => openEditModelDialog(model)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setModelToDelete(model);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ==================== FULL CONFIG MODAL ==================== */}
        <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="font-mono flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Editar Configuração
              </DialogTitle>
              <DialogDescription>
                Configure todos os parâmetros da função IA
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Row 1: Name and Function */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Nome da Configuração
                  </Label>
                  <Input
                    value={modalDisplayName}
                    onChange={(e) => setModalDisplayName(e.target.value)}
                    className="font-mono"
                    placeholder="Ex: Gerador de Conclusões"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                    Função (Edge Function)
                  </Label>
                  <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 flex items-center">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {selectedConfig?.function_name}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Row 2: Model and Provider */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                    Modelo
                  </Label>
                  <Select value={modalModel} onValueChange={setModalModel}>
                    <SelectTrigger className="font-mono">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {activeModels.map((model) => {
                        const info = getModelInfo(model.name);
                        return (
                          <SelectItem key={model.id} value={model.name} className="font-mono">
                            <div className="flex items-center gap-2">
                              <span className={info.color}>{info.icon}</span>
                              <span>{model.name}</span>
                              <span className="text-muted-foreground text-xs">({info.label})</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-primary" />
                    Provider
                  </Label>
                  <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 flex items-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {getModelProvider(modalModel)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Row 3: Max Tokens, Temperature, Reasoning */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    Max Tokens
                  </Label>
                  <Input
                    type="number"
                    value={modalMaxTokens}
                    onChange={(e) => setModalMaxTokens(parseInt(e.target.value) || 0)}
                    className="font-mono"
                    min={100}
                    max={128000}
                  />
                </div>
                
                {/* Temperature - Only for legacy models */}
                <div className="space-y-2">
                  <Label className={`font-mono text-xs flex items-center gap-2 ${!modalModelCapabilities.supportsTemperature ? 'opacity-50' : ''}`}>
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    Temperature
                    {!modalModelCapabilities.supportsTemperature && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 ml-1">N/A</Badge>
                    )}
                  </Label>
                  {modalModelCapabilities.supportsTemperature ? (
                    <>
                      <Input
                        type="number"
                        step="0.1"
                        value={modalTemperature}
                        onChange={(e) => setModalTemperature(parseFloat(e.target.value) || 0)}
                        className="font-mono"
                        min={0}
                        max={2}
                      />
                      <p className="text-[10px] text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Suportado pelo modelo selecionado
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center text-muted-foreground font-mono">
                        <span className="text-xs">Não suportado</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Modelos reasoning não usam temperature
                      </p>
                    </>
                  )}
                </div>
                
                {/* Reasoning Effort - Only for reasoning models */}
                <div className="space-y-2">
                  <Label className={`font-mono text-xs flex items-center gap-2 ${!modalModelCapabilities.supportsReasoning ? 'opacity-50' : ''}`}>
                    <Brain className="h-3.5 w-3.5 text-primary" />
                    Reasoning Effort
                    {!modalModelCapabilities.supportsReasoning && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 ml-1">N/A</Badge>
                    )}
                  </Label>
                  {modalModelCapabilities.supportsReasoning ? (
                    <>
                      <Select value={modalReasoning} onValueChange={setModalReasoning}>
                        <SelectTrigger className="font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="low" className="font-mono">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                              <span>Low</span>
                              <span className="text-muted-foreground text-xs">(Rápido, menos tokens)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium" className="font-mono">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                              <span>Medium</span>
                              <span className="text-muted-foreground text-xs">(Balanceado)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="high" className="font-mono">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                              <span>High</span>
                              <span className="text-muted-foreground text-xs">(Preciso, mais tokens)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Suportado pelo modelo selecionado
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center text-muted-foreground font-mono">
                        <span className="text-xs">Não suportado</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Modelos legados não usam reasoning_effort
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Model capabilities info banner */}
              {modalModel && (
                <div className={`p-3 rounded-lg border ${modalModelCapabilities.supportsReasoning ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-yellow-950/20 border-yellow-500/30'}`}>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {modalModelCapabilities.supportsReasoning ? (
                      <>
                        <Brain className="h-4 w-4 text-cyan-400" />
                        <span className="text-cyan-300 font-medium">Modelo de Reasoning</span>
                        <span className="text-muted-foreground">• Usa max_completion_tokens + reasoning_effort</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-300 font-medium">Modelo Legado</span>
                        <span className="text-muted-foreground">• Usa max_tokens + temperature</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Row 4: Description and Active */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-primary" />
                    Descrição / Categoria
                  </Label>
                  <Input
                    value={modalDescription}
                    onChange={(e) => setModalDescription(e.target.value)}
                    className="font-mono"
                    placeholder="Ex: Gera conclusões de laudos radiológicos"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Status
                  </Label>
                  <div className="h-10 px-3 py-2 rounded-md border border-input bg-background flex items-center justify-between">
                    <span className="text-sm font-mono">
                      {modalActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <Switch
                      checked={modalActive}
                      onCheckedChange={setModalActive}
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-mono text-xs flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                    System Prompt
                  </Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {getLineCount(modalPrompt)} linhas • {modalPrompt.length} caracteres
                  </span>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-cyan-950/30 to-indigo-950/30 border border-cyan-500/20 p-1">
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-background/50 rounded-l-md border-r border-border/50 flex flex-col items-center pt-3 font-mono text-[9px] text-muted-foreground overflow-hidden select-none">
                      {Array.from({ length: Math.min(getLineCount(modalPrompt), 50) }, (_, i) => (
                        <div key={i} className="h-[18px] leading-[18px]">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <Textarea
                      value={modalPrompt}
                      onChange={(e) => setModalPrompt(e.target.value)}
                      rows={14}
                      className="font-mono text-xs pl-10 leading-[18px] resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      spellCheck={false}
                      placeholder="# PAPEL&#10;Você é um radiologista sênior brasileiro..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 pt-4 border-t">
              <Button variant="outline" onClick={() => setConfigModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveFullConfig} disabled={savingPrompt} className="gap-2">
                <Save className="h-4 w-4" />
                {savingPrompt ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ==================== HISTORY MODAL ==================== */}
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Histórico de Alterações
              </DialogTitle>
              <DialogDescription>
                {selectedConfig?.function_name}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatDate(item.changed_at)}
                      </Badge>
                      {item.new_model && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          {item.new_model}
                        </Badge>
                      )}
                    </div>
                    {item.change_reason && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.change_reason}
                      </p>
                    )}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver prompt anterior
                      </summary>
                      <pre className="mt-2 p-2 rounded bg-muted/50 overflow-x-auto font-mono text-[10px] max-h-[200px] overflow-y-auto">
                        {item.previous_prompt || 'N/A'}
                      </pre>
                    </details>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum histórico encontrado
                  </p>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* ==================== MODEL DIALOG ==================== */}
        <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {editingModel ? 'Editar Modelo' : 'Novo Modelo'}
              </DialogTitle>
              <DialogDescription>
                {editingModel ? 'Atualize as informações do modelo' : 'Adicione um novo modelo de IA'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs">Nome do Modelo</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: gpt-5-nano-2025-08-07"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Provider</Label>
                <Select value={formProvider} onValueChange={setFormProvider}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p} value={p} className="font-mono">{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Descrição</Label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ex: Modelo econômico para tarefas simples"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs">Max Tokens Padrão</Label>
                <Input
                  type="number"
                  value={formMaxTokens}
                  onChange={(e) => setFormMaxTokens(parseInt(e.target.value) || 0)}
                  className="font-mono"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs">Ativo</Label>
                <Switch checked={formActive} onCheckedChange={setFormActive} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModelDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveModel} disabled={savingModel}>
                <Save className="h-4 w-4 mr-2" />
                {savingModel ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ==================== DELETE CONFIRMATION ==================== */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Confirmar Exclusão
              </DialogTitle>
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
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
