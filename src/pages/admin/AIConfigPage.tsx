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
import { Slider } from '@/components/ui/slider';
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
  TrendingUp
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

export default function AIConfigPage() {
  // Shared state
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<PromptConfig[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([]);
  const [recentActivity, setRecentActivity] = useState<PromptHistory[]>([]);

  // Prompts state
  const [selectedConfig, setSelectedConfig] = useState<PromptConfig | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<PromptHistory[]>([]);
  
  // Config modal state
  const [modalModel, setModalModel] = useState('');
  const [modalMaxTokens, setModalMaxTokens] = useState(2000);
  const [modalTemperature, setModalTemperature] = useState(0.7);
  const [modalReasoning, setModalReasoning] = useState('low');
  const [modalActive, setModalActive] = useState(true);

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
    setEditedPrompt(config.system_prompt);
    setModalModel(config.model_name);
    setModalMaxTokens(config.max_tokens);
    setModalTemperature(config.temperature);
    setModalReasoning(config.reasoning_effort);
    setModalActive(config.is_active);
  };

  const openConfigModal = () => {
    if (selectedConfig) {
      setModalModel(selectedConfig.model_name);
      setModalMaxTokens(selectedConfig.max_tokens);
      setModalTemperature(selectedConfig.temperature);
      setModalReasoning(selectedConfig.reasoning_effort);
      setModalActive(selectedConfig.is_active);
      setConfigModalOpen(true);
    }
  };

  const saveConfigSettings = async () => {
    if (!selectedConfig) return;
    
    setSavingPrompt(true);
    
    const { error } = await supabase
      .from('ai_prompt_configs')
      .update({ 
        model_name: modalModel,
        max_tokens: modalMaxTokens,
        temperature: modalTemperature,
        reasoning_effort: modalReasoning,
        is_active: modalActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedConfig.id);

    if (error) {
      toast.error('Erro ao salvar configurações');
    } else {
      toast.success('Configurações salvas');
      setConfigModalOpen(false);
      fetchData();
    }
    setSavingPrompt(false);
  };

  const handleSavePrompt = async () => {
    if (!selectedConfig) return;

    setSavingPrompt(true);
    
    // Save history
    await supabase.from('ai_prompt_config_history').insert({
      config_id: selectedConfig.id,
      function_name: selectedConfig.function_name,
      previous_prompt: selectedConfig.system_prompt,
      new_prompt: editedPrompt,
      previous_model: selectedConfig.model_name,
      new_model: selectedConfig.model_name,
      change_reason: 'Manual edit via admin panel'
    });

    // Update config
    const { error } = await supabase
      .from('ai_prompt_configs')
      .update({ 
        system_prompt: editedPrompt,
        version: selectedConfig.version + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedConfig.id);

    if (error) {
      toast.error('Erro ao salvar prompt');
    } else {
      toast.success('Prompt salvo com sucesso');
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
                          return (
                            <div key={model.id} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-mono">{model.name}</span>
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
                        {configs.map((config) => (
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
                              <span className="text-[10px] opacity-70 font-mono truncate">
                                {config.function_name}
                              </span>
                              {!config.is_active && (
                                <Badge variant="secondary" className="text-[9px] px-1">
                                  Inativo
                                </Badge>
                              )}
                            </div>
                          </button>
                        ))}
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
                        <Button variant="outline" size="sm" onClick={openConfigModal}>
                          <Settings2 className="h-4 w-4 mr-2" />
                          Configurações
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedConfig ? (
                      <>
                        {/* Current Config Display */}
                        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                          <Badge variant="outline" className="font-mono text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {selectedConfig.model_name}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            {selectedConfig.max_tokens} tokens
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            temp: {selectedConfig.temperature}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            reasoning: {selectedConfig.reasoning_effort}
                          </Badge>
                          <Badge variant={selectedConfig.is_active ? 'default' : 'secondary'} className="font-mono text-xs">
                            {selectedConfig.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>

                        {/* Prompt Editor */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-mono text-sm flex items-center gap-2">
                              <Code2 className="h-4 w-4" />
                              System Prompt
                            </Label>
                            <span className="text-xs text-muted-foreground font-mono">
                              {getLineCount(editedPrompt)} linhas • {editedPrompt.length} chars
                            </span>
                          </div>
                          <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 rounded-l-md border-r border-border flex flex-col items-center pt-3 font-mono text-[10px] text-muted-foreground overflow-hidden select-none">
                              {Array.from({ length: getLineCount(editedPrompt) }, (_, i) => (
                                <div key={i} className="h-[21px] leading-[21px]">
                                  {i + 1}
                                </div>
                              ))}
                            </div>
                            <Textarea
                              value={editedPrompt}
                              onChange={(e) => setEditedPrompt(e.target.value)}
                              rows={16}
                              className="font-mono text-sm pl-12 leading-[21px] resize-none"
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
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={openHistory}>
                              <History className="h-4 w-4 mr-2" />
                              Histórico
                            </Button>
                            <Button size="sm" onClick={handleSavePrompt} disabled={savingPrompt}>
                              <Save className="h-4 w-4 mr-2" />
                              {savingPrompt ? 'Salvando...' : 'Salvar Prompt'}
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        Selecione uma função para editar o prompt
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
                        {models.map((model) => (
                          <TableRow key={model.id}>
                            <TableCell className="font-mono font-medium">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
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
                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                              {formatDateShort(model.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditModelDialog(model)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setModelToDelete(model);
                                    setDeleteDialogOpen(true);
                                  }}
                                  disabled={getUsageCount(model.name) > 0}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {models.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              Nenhum modelo cadastrado
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ==================== MODALS ==================== */}

        {/* Prompt Config Modal */}
        <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono">Configurações: {selectedConfig?.display_name}</DialogTitle>
              <DialogDescription>
                Ajuste modelo, tokens e parâmetros de geração
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-mono flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Modelo
                </Label>
                <Select value={modalModel} onValueChange={setModalModel}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeModels.map((model) => (
                      <SelectItem key={model.id} value={model.name} className="font-mono">
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono">Max Tokens</Label>
                <Input 
                  type="number" 
                  value={modalMaxTokens}
                  onChange={(e) => setModalMaxTokens(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono">
                  Temperature: {modalTemperature.toFixed(2)}
                </Label>
                <Slider
                  value={[modalTemperature]}
                  onValueChange={([v]) => setModalTemperature(v)}
                  min={0}
                  max={2}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono">Reasoning Effort</Label>
                <Select value={modalReasoning} onValueChange={setModalReasoning}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="font-mono">Low</SelectItem>
                    <SelectItem value="medium" className="font-mono">Medium</SelectItem>
                    <SelectItem value="high" className="font-mono">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={modalActive} onCheckedChange={setModalActive} />
                <Label className="font-mono">Prompt ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigModalOpen(false)}>Cancelar</Button>
              <Button onClick={saveConfigSettings} disabled={savingPrompt}>
                {savingPrompt ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Modal */}
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono">Histórico de Alterações</DialogTitle>
              <DialogDescription>
                Últimas 10 alterações em {selectedConfig?.function_name}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum histórico disponível
                  </p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatDate(item.changed_at)}
                        </Badge>
                        {item.new_model && item.previous_model !== item.new_model && (
                          <span className="text-xs text-muted-foreground">
                            {item.previous_model} → {item.new_model}
                          </span>
                        )}
                      </div>
                      <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground max-h-32 overflow-hidden">
                        {item.new_prompt.slice(0, 300)}...
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Model Dialog */}
        <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono">
                {editingModel ? 'Editar Modelo' : 'Novo Modelo'}
              </DialogTitle>
              <DialogDescription>
                {editingModel 
                  ? 'Atualize as informações do modelo de IA'
                  : 'Adicione um novo modelo de IA ao sistema'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-mono">Nome do Modelo *</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono">Provider</Label>
                <Select value={formProvider} onValueChange={setFormProvider}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((provider) => (
                      <SelectItem key={provider} value={provider} className="font-mono">
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono">Descrição</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrição opcional do modelo"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono">Max Tokens (padrão)</Label>
                <Input
                  type="number"
                  value={formMaxTokens}
                  onChange={(e) => setFormMaxTokens(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={formActive} onCheckedChange={setFormActive} />
                <Label className="font-mono">Modelo ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModelDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveModel} disabled={savingModel}>
                {savingModel ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Model Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-mono text-destructive">Excluir Modelo</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o modelo <strong>{modelToDelete?.name}</strong>?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteModel}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
