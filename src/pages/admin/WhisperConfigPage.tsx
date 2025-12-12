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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Save, 
  RefreshCw, 
  Mic, 
  Settings2,
  Zap,
  DollarSign,
  Filter,
  Sparkles,
  Activity,
  MessageSquare
} from 'lucide-react';

interface WhisperConfig {
  id: string;
  config_name: string;
  display_name: string;
  provider: string;
  model: string;
  system_prompt: string;
  prompt_groq: string | null;
  prompt_openai: string | null;
  prompt_openai_mini: string | null;
  language: string;
  temperature: number;
  response_format: string;
  no_speech_prob_threshold: number;
  avg_logprob_threshold: number;
  credit_cost_per_minute: number;
  max_credits_per_audio: number;
  min_audio_seconds: number;
  remove_fillers: boolean;
  normalize_measurements: boolean;
  provider_gratuito: string;
  provider_basico: string;
  provider_profissional: string;
  provider_premium: string;
  is_active: boolean;
  version: number;
  updated_at: string;
  use_previous_context: boolean;
  previous_context_chars: number;
  enable_streaming: boolean;
}

const PROVIDERS = [
  { value: 'groq', label: 'Groq Whisper', icon: '🔴', model: 'whisper-large-v3-turbo', cost: '$0.00015/min' },
  { value: 'openai_mini', label: 'OpenAI Mini', icon: '🟢', model: 'gpt-4o-mini-transcribe', cost: '$0.003/min' },
  { value: 'openai', label: 'OpenAI Pro', icon: '⭐', model: 'gpt-4o-transcribe', cost: '$0.006/min' },
];

export default function WhisperConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<WhisperConfig | null>(null);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [provider, setProvider] = useState('groq');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [language, setLanguage] = useState('pt');
  const [temperature, setTemperature] = useState(0);
  const [noSpeechThreshold, setNoSpeechThreshold] = useState(0.5);
  const [avgLogprobThreshold, setAvgLogprobThreshold] = useState(-0.5);
  const [creditCostPerMinute, setCreditCostPerMinute] = useState(1);
  const [maxCreditsPerAudio, setMaxCreditsPerAudio] = useState(5);
  const [minAudioSeconds, setMinAudioSeconds] = useState(2);
  const [removeFillers, setRemoveFillers] = useState(true);
  const [normalizeMeasurements, setNormalizeMeasurements] = useState(true);
  const [providerGratuito, setProviderGratuito] = useState('groq');
  const [providerBasico, setProviderBasico] = useState('openai_mini');
  const [providerProfissional, setProviderProfissional] = useState('openai');
  const [providerPremium, setProviderPremium] = useState('openai');
  const [isActive, setIsActive] = useState(true);
  const [usePreviousContext, setUsePreviousContext] = useState(true);
  const [previousContextChars, setPreviousContextChars] = useState(200);
  const [enableStreaming, setEnableStreaming] = useState(false);
  const [promptGroq, setPromptGroq] = useState('');
  const [promptOpenai, setPromptOpenai] = useState('');
  const [promptOpenaiMini, setPromptOpenaiMini] = useState('');

  const fetchConfig = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('whisper_config')
      .select('*')
      .eq('config_name', 'default')
      .single();

    if (error) {
      console.error('Error fetching config:', error);
      toast.error('Erro ao carregar configuração');
    } else if (data) {
      setConfig(data);
      setDisplayName(data.display_name);
      setProvider(data.provider);
      setSystemPrompt(data.system_prompt);
      setLanguage(data.language || 'pt');
      setTemperature(Number(data.temperature) || 0);
      setNoSpeechThreshold(Number(data.no_speech_prob_threshold) || 0.5);
      setAvgLogprobThreshold(Number(data.avg_logprob_threshold) || -0.5);
      setCreditCostPerMinute(data.credit_cost_per_minute || 1);
      setMaxCreditsPerAudio(data.max_credits_per_audio || 5);
      setMinAudioSeconds(data.min_audio_seconds || 2);
      setRemoveFillers(data.remove_fillers ?? true);
      setNormalizeMeasurements(data.normalize_measurements ?? true);
      setProviderGratuito(data.provider_gratuito || 'groq');
      setProviderBasico(data.provider_basico || 'openai_mini');
      setProviderProfissional(data.provider_profissional || 'openai');
      setProviderPremium(data.provider_premium || 'openai');
      setIsActive(data.is_active ?? true);
      setUsePreviousContext(data.use_previous_context ?? true);
      setPreviousContextChars(data.previous_context_chars || 200);
      setEnableStreaming(data.enable_streaming ?? false);
      setPromptGroq(data.prompt_groq || '');
      setPromptOpenai(data.prompt_openai || '');
      setPromptOpenaiMini(data.prompt_openai_mini || '');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);

    const { error } = await supabase
      .from('whisper_config')
      .update({
        display_name: displayName,
        provider,
        system_prompt: systemPrompt,
        language,
        temperature,
        no_speech_prob_threshold: noSpeechThreshold,
        avg_logprob_threshold: avgLogprobThreshold,
        credit_cost_per_minute: creditCostPerMinute,
        max_credits_per_audio: maxCreditsPerAudio,
        min_audio_seconds: minAudioSeconds,
        remove_fillers: removeFillers,
        normalize_measurements: normalizeMeasurements,
        provider_gratuito: providerGratuito,
        provider_basico: providerBasico,
        provider_profissional: providerProfissional,
        provider_premium: providerPremium,
        is_active: isActive,
        use_previous_context: usePreviousContext,
        previous_context_chars: previousContextChars,
        enable_streaming: enableStreaming,
        prompt_groq: promptGroq || null,
        prompt_openai: promptOpenai || null,
        prompt_openai_mini: promptOpenaiMini || null,
      })
      .eq('id', config.id);

    if (error) {
      console.error('Error saving config:', error);
      toast.error('Erro ao salvar configuração');
    } else {
      toast.success('Configuração salva com sucesso!');
      fetchConfig();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="h-6 w-6 text-rose-500" />
              Configuração Whisper
            </h1>
            <p className="text-muted-foreground">
              Sistema de transcrição multi-provider dinâmico
            </p>
          </div>
          <div className="flex items-center gap-2">
            {config && (
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                v{config.version}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={fetchConfig}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-1" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Provider Selection by Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Seleção de Provider por Plano
              </CardTitle>
              <CardDescription>
                Define qual provider de transcrição será usado para cada plano de assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plano Gratuito</Label>
                  <Select value={providerGratuito} onValueChange={setProviderGratuito}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PROVIDERS.find(p => p.value === providerGratuito)?.cost}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Plano Básico</Label>
                  <Select value={providerBasico} onValueChange={setProviderBasico}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PROVIDERS.find(p => p.value === providerBasico)?.cost}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Plano Profissional</Label>
                  <Select value={providerProfissional} onValueChange={setProviderProfissional}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PROVIDERS.find(p => p.value === providerProfissional)?.cost}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Plano Premium</Label>
                  <Select value={providerPremium} onValueChange={setProviderPremium}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PROVIDERS.find(p => p.value === providerPremium)?.cost}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Provider Padrão (Fallback)</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                          <span className="text-muted-foreground">({p.model})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Credit Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Configurações de Créditos
              </CardTitle>
              <CardDescription>
                Define custos e limites de créditos por transcrição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Custo por Minuto</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={creditCostPerMinute}
                    onChange={(e) => setCreditCostPerMinute(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">créditos/min</p>
                </div>

                <div className="space-y-2">
                  <Label>Máximo por Áudio</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={maxCreditsPerAudio}
                    onChange={(e) => setMaxCreditsPerAudio(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">créditos máx</p>
                </div>

                <div className="space-y-2">
                  <Label>Mínimo de Áudio</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={minAudioSeconds}
                    onChange={(e) => setMinAudioSeconds(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">segundos</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Temperatura (Variabilidade)</Label>
                <Slider
                  value={[temperature]}
                  onValueChange={([v]) => setTemperature(v)}
                  min={0}
                  max={1}
                  step={0.1}
                />
                <p className="text-xs text-muted-foreground">
                  Valor: {temperature} (0 = determinístico, 1 = criativo)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filtering Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                Filtragem de Qualidade
              </CardTitle>
              <CardDescription>
                Thresholds para filtrar segmentos de baixa qualidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>No Speech Probability Threshold</Label>
                  <Slider
                    value={[noSpeechThreshold]}
                    onValueChange={([v]) => setNoSpeechThreshold(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor: {noSpeechThreshold} (segmentos com no_speech_prob maior são filtrados)
                  </p>
                </div>

                <div>
                  <Label>Average Log Probability Threshold</Label>
                  <Slider
                    value={[avgLogprobThreshold]}
                    onValueChange={([v]) => setAvgLogprobThreshold(v)}
                    min={-2}
                    max={0}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor: {avgLogprobThreshold} (segmentos com avg_logprob menor são filtrados)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post-processing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Pós-processamento
              </CardTitle>
              <CardDescription>
                Tratamento automático do texto transcrito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Remover Vícios de Fala</Label>
                  <p className="text-xs text-muted-foreground">
                    Remove "ééé", "hã", "né", "tipo", "hmm"
                  </p>
                </div>
                <Switch
                  checked={removeFillers}
                  onCheckedChange={setRemoveFillers}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Normalizar Medidas</Label>
                  <p className="text-xs text-muted-foreground">
                    Formato brasileiro: 3.2 → 3,2 cm, "por" → "x"
                  </p>
                </div>
                <Switch
                  checked={normalizeMeasurements}
                  onCheckedChange={setNormalizeMeasurements}
                />
              </div>
            </CardContent>
          </Card>

          {/* Context & Streaming Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Contexto & Streaming
              </CardTitle>
              <CardDescription>
                Configurações avançadas para continuidade e latência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Usar Contexto Anterior</Label>
                  <p className="text-xs text-muted-foreground">
                    Envia últimos caracteres da transcrição anterior para melhor continuidade
                  </p>
                </div>
                <Switch
                  checked={usePreviousContext}
                  onCheckedChange={setUsePreviousContext}
                />
              </div>

              {usePreviousContext && (
                <div className="space-y-2">
                  <Label>Tamanho do Contexto: {previousContextChars} caracteres</Label>
                  <Slider
                    value={[previousContextChars]}
                    onValueChange={([v]) => setPreviousContextChars(v)}
                    min={100}
                    max={500}
                    step={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    Groq: contexto será truncado junto com prompt (~850 chars total)
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Habilitar Streaming (Experimental)</Label>
                  <p className="text-xs text-muted-foreground">
                    SSE para OpenAI gpt-4o-transcribe. Reduz latência percebida.
                  </p>
                </div>
                <Switch
                  checked={enableStreaming}
                  onCheckedChange={setEnableStreaming}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Configuração Ativa</Label>
                  <p className="text-xs text-muted-foreground">
                    Desativar para usar fallback hardcoded
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Provider-Specific Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cyan-500" />
              Prompts por Provider
            </CardTitle>
            <CardDescription>
              Cada provider tem limite e otimização diferente. Groq: ~850 chars (hints apenas). OpenAI: ilimitado (instruções completas).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="groq" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="groq" className="gap-1">
                  <span>🔴</span> Groq
                </TabsTrigger>
                <TabsTrigger value="openai" className="gap-1">
                  <span>⭐</span> OpenAI Pro
                </TabsTrigger>
                <TabsTrigger value="openai_mini" className="gap-1">
                  <span>🟢</span> OpenAI Mini
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="groq" className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Prompt Groq (whisper-large-v3-turbo)</Label>
                  <Badge variant="outline" className="text-yellow-600">
                    {promptGroq.length}/850 chars
                  </Badge>
                </div>
                <Textarea
                  value={promptGroq}
                  onChange={(e) => setPromptGroq(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder="Terminologia apenas como hints..."
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Groq limita prompt a ~224 tokens (~850 chars). Use apenas terminologia como hints, sem instruções detalhadas.
                </p>
              </TabsContent>
              
              <TabsContent value="openai" className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Prompt OpenAI Pro (gpt-4o-transcribe)</Label>
                  <Badge variant="outline" className="text-green-600">
                    {promptOpenai.length} chars ✓
                  </Badge>
                </div>
                <Textarea
                  value={promptOpenai}
                  onChange={(e) => setPromptOpenai(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder="Instruções detalhadas para transcrição médica..."
                />
                <p className="text-xs text-muted-foreground">
                  ✅ Sem limite de caracteres. Pode incluir instruções detalhadas de formatação, regras e terminologia completa.
                </p>
              </TabsContent>
              
              <TabsContent value="openai_mini" className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Prompt OpenAI Mini (gpt-4o-mini-transcribe)</Label>
                  <Badge variant="outline" className="text-blue-600">
                    {promptOpenaiMini.length} chars
                  </Badge>
                </div>
                <Textarea
                  value={promptOpenaiMini}
                  onChange={(e) => setPromptOpenaiMini(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                  placeholder="Instruções moderadas para transcrição..."
                />
                <p className="text-xs text-muted-foreground">
                  Instruções intermediárias. Mais completo que Groq, mais conciso que Pro para melhor performance.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Legacy System Prompt (Fallback) */}
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              Prompt Fallback (Legado)
            </CardTitle>
            <CardDescription>
              Usado apenas se prompt específico do provider estiver vazio. Mantido para compatibilidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={8}
              className="font-mono text-sm"
              placeholder="Instruções para transcrição médica..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              {systemPrompt.length} caracteres 
              {systemPrompt.length > 850 && (
                <span className="text-yellow-500 ml-2">
                  (Groq irá truncar para ~850 caracteres)
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
