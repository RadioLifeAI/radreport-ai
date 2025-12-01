import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Save, 
  RefreshCw, 
  History, 
  Play, 
  Code2, 
  Settings2,
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react';

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
  is_active: boolean;
  default_max_tokens: number;
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

export default function PromptsPage() {
  const [configs, setConfigs] = useState<PromptConfig[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<PromptConfig | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [editedModel, setEditedModel] = useState('');
  const [editedMaxTokens, setEditedMaxTokens] = useState(2000);
  const [editedTemperature, setEditedTemperature] = useState(0.7);
  const [editedReasoning, setEditedReasoning] = useState('low');
  const [editedActive, setEditedActive] = useState(true);
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    const [configsRes, modelsRes] = await Promise.all([
      supabase.from('ai_prompt_configs').select('*').order('display_name'),
      supabase.from('ai_models').select('*').eq('is_active', true).order('name')
    ]);

    if (configsRes.error) {
      toast.error('Erro ao carregar configurações');
      console.error(configsRes.error);
    } else {
      setConfigs(configsRes.data || []);
      if (configsRes.data && configsRes.data.length > 0 && !selectedConfig) {
        handleSelectConfig(configsRes.data[0]);
      }
    }

    if (modelsRes.data) {
      setModels(modelsRes.data);
    }

    setLoading(false);
  };

  const fetchHistory = async (functionName: string) => {
    const { data, error } = await supabase
      .from('ai_prompt_config_history')
      .select('*')
      .eq('function_name', functionName)
      .order('changed_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setHistory(data);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSelectConfig = (config: PromptConfig) => {
    setSelectedConfig(config);
    setEditedPrompt(config.system_prompt);
    setEditedModel(config.model_name);
    setEditedMaxTokens(config.max_tokens);
    setEditedTemperature(config.temperature);
    setEditedReasoning(config.reasoning_effort);
    setEditedActive(config.is_active);
  };

  const handleSave = async () => {
    if (!selectedConfig) return;

    setSaving(true);
    
    // Save history first
    await supabase.from('ai_prompt_config_history').insert({
      config_id: selectedConfig.id,
      function_name: selectedConfig.function_name,
      previous_prompt: selectedConfig.system_prompt,
      new_prompt: editedPrompt,
      previous_model: selectedConfig.model_name,
      new_model: editedModel,
      change_reason: 'Manual edit via admin panel'
    });

    // Update config
    const { error } = await supabase
      .from('ai_prompt_configs')
      .update({ 
        system_prompt: editedPrompt,
        model_name: editedModel,
        max_tokens: editedMaxTokens,
        temperature: editedTemperature,
        reasoning_effort: editedReasoning,
        is_active: editedActive,
        version: selectedConfig.version + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedConfig.id);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success('Configuração salva com sucesso');
      fetchConfigs();
    }
    setSaving(false);
  };

  const openHistory = async () => {
    if (selectedConfig) {
      await fetchHistory(selectedConfig.function_name);
      setHistoryOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLineCount = (text: string) => text.split('\n').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-mono">Prompts IA</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Configure os prompts de sistema das Edge Functions
            </p>
          </div>
          <Button variant="outline" onClick={fetchConfigs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

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
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editedActive}
                        onCheckedChange={setEditedActive}
                      />
                      <Label className="text-xs">Ativo</Label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedConfig ? (
                  <>
                    {/* Model Settings Row */}
                    <div className="grid gap-4 md:grid-cols-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="space-y-2">
                        <Label className="text-xs font-mono flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Modelo
                        </Label>
                        <Select value={editedModel} onValueChange={setEditedModel}>
                          <SelectTrigger className="font-mono text-xs h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((model) => (
                              <SelectItem key={model.id} value={model.name} className="font-mono text-xs">
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-mono">Max Tokens</Label>
                        <Input 
                          type="number" 
                          value={editedMaxTokens}
                          onChange={(e) => setEditedMaxTokens(Number(e.target.value))}
                          className="font-mono text-xs h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-mono">
                          Temperature: {editedTemperature.toFixed(2)}
                        </Label>
                        <Slider
                          value={[editedTemperature]}
                          onValueChange={([v]) => setEditedTemperature(v)}
                          min={0}
                          max={2}
                          step={0.1}
                          className="mt-3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-mono">Reasoning Effort</Label>
                        <Select value={editedReasoning} onValueChange={setEditedReasoning}>
                          <SelectTrigger className="font-mono text-xs h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low" className="font-mono text-xs">Low</SelectItem>
                            <SelectItem value="medium" className="font-mono text-xs">Medium</SelectItem>
                            <SelectItem value="high" className="font-mono text-xs">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Prompt Editor */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-mono text-sm flex items-center gap-2">
                          <Settings2 className="h-4 w-4" />
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
                        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={openHistory}>
                              <History className="h-4 w-4 mr-2" />
                              Histórico
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-mono">Histórico de Alterações</DialogTitle>
                              <DialogDescription>
                                Últimas 10 alterações em {selectedConfig.function_name}
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
                        <Button variant="outline" size="sm" disabled>
                          <Play className="h-4 w-4 mr-2" />
                          Testar
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={saving}>
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Salvando...' : 'Salvar'}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Code2 className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-sm">Selecione uma função para editar seu prompt</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
