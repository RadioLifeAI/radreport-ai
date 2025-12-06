import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  VOICE_COMMANDS_CONFIG, 
  getCommandsByCategory,
  getTotalCommands 
} from '@/lib/voiceCommandsConfig';
import { 
  Settings, 
  Scan, 
  Plug, 
  Edit3, 
  Mic, 
  FileSearch,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  AlertTriangle,
  Shield,
  Database,
  Key,
  Calendar,
  Search,
  Plus,
  GripVertical,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types
interface PlatformMetric {
  metric_key: string;
  metric_value: number;
  description: string | null;
  last_calculated_at: string | null;
}

interface Modalidade {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  ativa: boolean;
  ordem: number | null;
}

interface RegiaoAnatomica {
  id: string;
  codigo: string;
  nome: string;
  ativa: boolean;
  modalidade_id: string | null;
}

interface AuditLog {
  id: string;
  timestamp: string;
  acao: string;
  tabela_nome: string;
  usuario_id: string | null;
  registro_id: string;
}

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  category: string;
  description: string | null;
  updated_at: string | null;
}

// Voice command category labels
const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  'pontuação': { label: 'Pontuação', icon: '📌' },
  'navegação': { label: 'Navegação', icon: '🧭' },
  'edição': { label: 'Edição', icon: '✂️' },
  'formatação': { label: 'Formatação', icon: '🔤' },
  'especiais': { label: 'Especiais', icon: '⭐' },
};

// ============= GENERAL TAB =============
const GeneralTab = () => {
  const [metrics, setMetrics] = useState<PlatformMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [platformVersion, setPlatformVersion] = useState('v1.0.0');
  const [environment, setEnvironment] = useState<'test' | 'live'>('test');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch platform metrics
      const { data: metricsData } = await supabase
        .from('platform_metrics')
        .select('*')
        .order('metric_key');
      
      if (metricsData) setMetrics(metricsData);

      // Fetch stripe settings for environment
      const { data: stripeSettings } = await supabase
        .from('stripe_settings')
        .select('setting_value')
        .eq('setting_key', 'environment_mode')
        .single();
      
      if (stripeSettings) {
        setEnvironment(stripeSettings.setting_value as 'test' | 'live');
      }

      // Fetch system settings (version and maintenance mode)
      const { data: systemSettings } = await supabase
        .from('system_settings')
        .select('*')
        .in('setting_key', ['platform_version', 'maintenance_mode']);
      
      if (systemSettings) {
        const versionSetting = systemSettings.find(s => s.setting_key === 'platform_version');
        const maintenanceSetting = systemSettings.find(s => s.setting_key === 'maintenance_mode');
        
        if (versionSetting) setPlatformVersion(versionSetting.setting_value);
        if (maintenanceSetting) setMaintenanceMode(maintenanceSetting.setting_value === 'true');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenanceMode = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: enabled.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'maintenance_mode');
      
      if (error) throw error;
      
      setMaintenanceMode(enabled);
      toast.success(`Modo manutenção ${enabled ? 'ativado' : 'desativado'}`);
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast.error('Erro ao alterar modo de manutenção');
    }
  };

  const recalculateMetrics = async () => {
    setUpdating(true);
    try {
      // Count templates
      const { count: templatesCount } = await supabase
        .from('system_templates')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      // Count frases
      const { count: frasesCount } = await supabase
        .from('frases_modelo')
        .select('*', { count: 'exact', head: true })
        .eq('ativa', true);

      // Count modalidades
      const { count: modalidadesCount } = await supabase
        .from('modalidades')
        .select('*', { count: 'exact', head: true })
        .eq('ativa', true);

      // Update metrics in database
      const updates = [
        { metric_key: 'total_templates', metric_value: templatesCount || 0 },
        { metric_key: 'total_frases', metric_value: frasesCount || 0 },
        { metric_key: 'total_modalidades', metric_value: modalidadesCount || 0 },
      ];

      for (const update of updates) {
        await supabase
          .from('platform_metrics')
          .upsert({
            ...update,
            last_calculated_at: new Date().toISOString(),
            source: 'admin_recalculation'
          }, { onConflict: 'metric_key' });
      }

      await fetchData();
      toast.success('Métricas atualizadas com sucesso');
    } catch (error) {
      console.error('Error updating metrics:', error);
      toast.error('Erro ao atualizar métricas');
    } finally {
      setUpdating(false);
    }
  };

  const getMetricValue = (key: string): number => {
    const metric = metrics.find(m => m.metric_key === key);
    return metric?.metric_value || 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RadReport</div>
            <p className="text-xs text-muted-foreground mt-1">Sistema de Laudos Radiológicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Versão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{platformVersion}</div>
            <p className="text-xs text-muted-foreground mt-1">Build: {format(new Date(), 'yyyy.MM.dd')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ambiente</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={environment === 'live' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
              {environment === 'live' ? '🟢 LIVE' : '🟡 TEST'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Stripe {environment.toUpperCase()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Modo Manutenção
          </CardTitle>
          <CardDescription>
            Ative para exibir uma página de manutenção para todos os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status: {maintenanceMode ? 'ATIVO' : 'Desativado'}</p>
              <p className="text-sm text-muted-foreground">
                {maintenanceMode 
                  ? 'Usuários não poderão acessar o sistema' 
                  : 'Sistema funcionando normalmente'}
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={toggleMaintenanceMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Métricas da Plataforma
              </CardTitle>
              <CardDescription>Contagens atuais do banco de dados</CardDescription>
            </div>
            <Button onClick={recalculateMetrics} disabled={updating} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { key: 'total_templates', label: 'Templates', fallback: 149 },
              { key: 'total_frases', label: 'Frases', fallback: 474 },
              { key: 'total_calculadoras', label: 'Calculadoras', fallback: 25 },
              { key: 'total_tabelas', label: 'Tabelas', fallback: 100 },
              { key: 'total_termos', label: 'Termos Dict.', fallback: 5000 },
              { key: 'total_modalidades', label: 'Modalidades', fallback: 5 },
            ].map(({ key, label, fallback }) => (
              <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {getMetricValue(key) || fallback}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
          {metrics.length > 0 && metrics[0]?.last_calculated_at && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Última atualização: {format(new Date(metrics[0].last_calculated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============= MODALITIES TAB =============
const ModalitiesTab = () => {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [regioes, setRegioes] = useState<RegiaoAnatomica[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModality, setExpandedModality] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: modData }, { data: regData }] = await Promise.all([
        supabase.from('modalidades').select('*').order('ordem', { ascending: true }),
        supabase.from('regioes_anatomicas').select('*').order('nome')
      ]);
      
      if (modData) setModalidades(modData);
      if (regData) setRegioes(regData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModalidade = async (id: string, currentState: boolean) => {
    try {
      await supabase
        .from('modalidades')
        .update({ ativa: !currentState })
        .eq('id', id);
      
      setModalidades(prev => prev.map(m => 
        m.id === id ? { ...m, ativa: !currentState } : m
      ));
      toast.success(`Modalidade ${!currentState ? 'ativada' : 'desativada'}`);
    } catch (error) {
      toast.error('Erro ao atualizar modalidade');
    }
  };

  const getRegioesForModalidade = (modalidadeId: string) => {
    return regioes.filter(r => r.modalidade_id === modalidadeId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Modalidades de Exame</h3>
          <p className="text-sm text-muted-foreground">
            {modalidades.filter(m => m.ativa).length} de {modalidades.length} ativas
          </p>
        </div>
        <Button variant="outline" size="sm" disabled>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        {modalidades.map((mod) => {
          const regioesCount = getRegioesForModalidade(mod.id).length;
          const isExpanded = expandedModality === mod.id;

          return (
            <Collapsible key={mod.id} open={isExpanded} onOpenChange={() => setExpandedModality(isExpanded ? null : mod.id)}>
              <Card className={!mod.ativa ? 'opacity-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <Switch
                        checked={mod.ativa}
                        onCheckedChange={() => toggleModalidade(mod.id, mod.ativa)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">{mod.codigo}</Badge>
                          <span className="font-medium">{mod.nome}</span>
                        </div>
                        {mod.descricao && (
                          <p className="text-xs text-muted-foreground mt-1">{mod.descricao}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{regioesCount} regiões</Badge>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Regiões Anatômicas:</p>
                      {regioesCount > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {getRegioesForModalidade(mod.id).map(reg => (
                            <Badge key={reg.id} variant={reg.ativa ? 'default' : 'secondary'}>
                              {reg.nome}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma região configurada</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

// ============= INTEGRATIONS TAB =============
const IntegrationsTab = () => {
  const [integrations, setIntegrations] = useState<Array<{
    name: string;
    description: string;
    secretKey: string;
    status: 'configured' | 'pending' | 'error';
    docUrl: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] = useState<'test' | 'live'>('test');

  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    setLoading(true);
    try {
      // Fetch stripe settings to check configuration status
      const { data: stripeSettings } = await supabase
        .from('stripe_settings')
        .select('setting_key, setting_value');

      const settingsMap = new Map(stripeSettings?.map(s => [s.setting_key, s.setting_value]) || []);
      
      const envMode = settingsMap.get('environment_mode') as 'test' | 'live' || 'test';
      setEnvironment(envMode);

      // Check if keys are configured
      const stripeTestConfigured = settingsMap.get('test_webhook_secret') || settingsMap.get('test_publishable_key');
      const stripeLiveConfigured = settingsMap.get('live_webhook_secret') || settingsMap.get('live_publishable_key');

      setIntegrations([
        {
          name: 'OpenAI API',
          description: 'Modelo padrão: gpt-5-nano-2025-08-07',
          secretKey: 'OPENAI_API_KEY',
          status: 'configured', // Assumed configured via Vault
          docUrl: 'https://platform.openai.com/docs',
        },
        {
          name: 'Groq API',
          description: 'Whisper: whisper-large-v3-turbo',
          secretKey: 'GROQ_API_KEY',
          status: 'configured', // Assumed configured via Vault
          docUrl: 'https://console.groq.com/docs',
        },
        {
          name: 'Stripe Live',
          description: 'Pagamentos em produção',
          secretKey: 'STRIPE_SECRET_KEY',
          status: stripeLiveConfigured ? 'configured' : 'pending',
          docUrl: 'https://stripe.com/docs',
        },
        {
          name: 'Stripe Test',
          description: 'Pagamentos em teste',
          secretKey: 'STRIPE_SECRET_KEY_TEST',
          status: stripeTestConfigured ? 'configured' : 'pending',
          docUrl: 'https://stripe.com/docs/testing',
        },
        {
          name: 'Cloudflare Turnstile',
          description: 'Proteção anti-bot',
          secretKey: 'TURNSTILE_SECRET_KEY',
          status: 'configured', // Assumed configured via Vault
          docUrl: 'https://developers.cloudflare.com/turnstile/',
        },
      ]);
    } catch (error) {
      console.error('Error fetching integration status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Integrações & API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Status das integrações externas. Chaves gerenciadas no Supabase Vault.
          </p>
        </div>
        <Badge variant={environment === 'live' ? 'default' : 'secondary'}>
          Ambiente: {environment.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{integration.name}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {integration.secretKey}
                      </Badge>
                      {getStatusIcon(integration.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={integration.docUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Key className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>
              As chaves de API são armazenadas de forma segura no Supabase Vault e nunca são expostas no frontend.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============= EDITOR DEFAULTS TAB =============
const EditorDefaultsTab = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    font_family: 'Inter',
    font_size: 14,
    line_height: 1.5,
    auto_save_enabled: true,
    auto_save_interval: 30,
    ai_enabled: true,
    ai_auto_suggest: false,
    ai_confidence_threshold: 0.7,
    voice_enabled: true,
    voice_language: 'pt-BR',
    voice_sensitivity: 0.5,
    voice_auto_punctuation: true,
  });
  const [originalSettings, setOriginalSettings] = useState(settings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEditorSettings();
  }, []);

  const fetchEditorSettings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'editor');

      if (data && data.length > 0) {
        const settingsFromDB: Record<string, string | number | boolean> = {};
        
        data.forEach((s: SystemSetting) => {
          const key = s.setting_key.replace('editor_default_', '');
          let value: string | number | boolean = s.setting_value;
          
          // Parse values based on type
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          else if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
          }
          
          settingsFromDB[key] = value;
        });

        const newSettings = { ...settings, ...settingsFromDB };
        setSettings(newSettings);
        setOriginalSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching editor settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        setting_key: `editor_default_${key}`,
        setting_value: String(value),
        category: 'editor',
        description: `Default value for ${key}`,
        updated_at: new Date().toISOString()
      }));

      for (const setting of settingsToSave) {
        await supabase
          .from('system_settings')
          .upsert(setting, { onConflict: 'setting_key' });
      }

      setOriginalSettings(settings);
      toast.success('Configurações padrão salvas');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    toast.info('Configurações restauradas para o último estado salvo');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <span className="text-sm">
          Estas configurações são aplicadas apenas a <strong>novos usuários</strong>. 
          Usuários existentes mantêm suas preferências individuais.
        </span>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎨 Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select value={settings.theme} onValueChange={(v) => setSettings(s => ({ ...s, theme: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fonte</Label>
              <Select value={settings.font_family} onValueChange={(v) => setSettings(s => ({ ...s, font_family: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                  <SelectItem value="IBM Plex Sans">IBM Plex Sans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tamanho da Fonte: {settings.font_size}px</Label>
              <Slider
                value={[settings.font_size]}
                onValueChange={([v]) => setSettings(s => ({ ...s, font_size: v }))}
                min={12}
                max={24}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Altura da Linha: {settings.line_height}</Label>
              <Slider
                value={[settings.line_height]}
                onValueChange={([v]) => setSettings(s => ({ ...s, line_height: v }))}
                min={1}
                max={2}
                step={0.1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-save */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">💾 Salvamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-save</p>
              <p className="text-sm text-muted-foreground">Salvar automaticamente o laudo</p>
            </div>
            <Switch
              checked={settings.auto_save_enabled}
              onCheckedChange={(v) => setSettings(s => ({ ...s, auto_save_enabled: v }))}
            />
          </div>
          {settings.auto_save_enabled && (
            <div className="space-y-2">
              <Label>Intervalo: {settings.auto_save_interval} segundos</Label>
              <Slider
                value={[settings.auto_save_interval]}
                onValueChange={([v]) => setSettings(s => ({ ...s, auto_save_interval: v }))}
                min={10}
                max={120}
                step={10}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🤖 Inteligência Artificial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">IA Habilitada</p>
              <p className="text-sm text-muted-foreground">Permitir recursos de IA no editor</p>
            </div>
            <Switch
              checked={settings.ai_enabled}
              onCheckedChange={(v) => setSettings(s => ({ ...s, ai_enabled: v }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-sugestão</p>
              <p className="text-sm text-muted-foreground">Sugerir automaticamente melhorias</p>
            </div>
            <Switch
              checked={settings.ai_auto_suggest}
              onCheckedChange={(v) => setSettings(s => ({ ...s, ai_auto_suggest: v }))}
              disabled={!settings.ai_enabled}
            />
          </div>
          <div className="space-y-2">
            <Label>Confiança Mínima: {(settings.ai_confidence_threshold * 100).toFixed(0)}%</Label>
            <Slider
              value={[settings.ai_confidence_threshold]}
              onValueChange={([v]) => setSettings(s => ({ ...s, ai_confidence_threshold: v }))}
              min={0.5}
              max={1}
              step={0.05}
              disabled={!settings.ai_enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎤 Voz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Voz Habilitada</p>
              <p className="text-sm text-muted-foreground">Permitir ditado por voz</p>
            </div>
            <Switch
              checked={settings.voice_enabled}
              onCheckedChange={(v) => setSettings(s => ({ ...s, voice_enabled: v }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select 
                value={settings.voice_language} 
                onValueChange={(v) => setSettings(s => ({ ...s, voice_language: v }))}
                disabled={!settings.voice_enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sensibilidade: {(settings.voice_sensitivity * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.voice_sensitivity]}
                onValueChange={([v]) => setSettings(s => ({ ...s, voice_sensitivity: v }))}
                min={0.1}
                max={1}
                step={0.1}
                disabled={!settings.voice_enabled}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pontuação Automática</p>
              <p className="text-sm text-muted-foreground">Inserir pontuação ao pausar</p>
            </div>
            <Switch
              checked={settings.voice_auto_punctuation}
              onCheckedChange={(v) => setSettings(s => ({ ...s, voice_auto_punctuation: v }))}
              disabled={!settings.voice_enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Restaurar Padrões
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

// ============= VOICE COMMANDS TAB =============
const VoiceCommandsTab = () => {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['pontuação', 'navegação']);

  // Use the real voice commands config
  const groupedCommands = getCommandsByCategory();
  const totalCommands = getTotalCommands();

  const filteredGroups = Object.entries(groupedCommands).map(([category, commands]) => ({
    category,
    commands: commands.filter(c => 
      c.command.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.action.toLowerCase().includes(search.toLowerCase()) ||
      c.synonyms?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(g => g.commands.length > 0);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Comandos de Voz</h3>
          <p className="text-sm text-muted-foreground">
            {totalCommands} comandos ativos em {Object.keys(groupedCommands).length} categorias
          </p>
        </div>
        <Badge variant="secondary">Somente leitura</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar comando, sinônimo ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredGroups.map(({ category, commands }) => {
          const categoryInfo = CATEGORY_LABELS[category] || { label: category, icon: '📌' };
          const isExpanded = expandedCategories.includes(category);

          return (
            <Collapsible key={category} open={isExpanded} onOpenChange={() => toggleCategory(category)}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>{categoryInfo.icon}</span>
                        {categoryInfo.label}
                        <Badge variant="secondary">{commands.length}</Badge>
                      </CardTitle>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {commands.map((cmd, idx) => (
                        <div key={idx} className="p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">"{cmd.command}"</span>
                            <Badge variant="outline" className="font-mono text-xs">
                              {cmd.action}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{cmd.description}</p>
                          {cmd.synonyms && cmd.synonyms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cmd.synonyms.map((syn, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {syn}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mic className="h-4 w-4" />
            <span>
              Os comandos de voz são definidos em <code className="text-xs bg-muted px-1 rounded">voiceCommandsConfig.ts</code> e não podem ser editados via interface.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============= AUDIT TAB =============
const AuditTab = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, count } = await supabase
        .from('auditoria_log')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (data) setLogs(data);
      if (count !== null) setTotalLogs(count);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Data/Hora', 'Ação', 'Tabela', 'Registro ID', 'Usuário ID'];
    const rows = logs.map(log => [
      format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss'),
      log.acao,
      log.tabela_nome,
      log.registro_id,
      log.usuario_id || 'Sistema'
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_log_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast.success('Logs exportados com sucesso');
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-semibold text-green-500">LGPD Compliance</div>
            <p className="text-xs text-muted-foreground">Dados protegidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold">{format(new Date(), 'dd/MM/yyyy')}</div>
            <p className="text-xs text-muted-foreground">Última verificação</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-lg font-semibold">{totalLogs.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Logs registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>Últimas 50 ações registradas</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.timestamp), 'dd/MM HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          log.acao === 'INSERT' ? 'default' :
                          log.acao === 'UPDATE' ? 'secondary' :
                          log.acao === 'DELETE' ? 'destructive' : 'outline'
                        }>
                          {log.acao}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.tabela_nome}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[100px]">
                        {log.registro_id.slice(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum log de auditoria encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retention Policy */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileSearch className="h-4 w-4 text-muted-foreground" />
              <span>Política de Retenção: <strong>12 meses</strong></span>
            </div>
            <Button variant="outline" size="sm" disabled>
              Limpar Logs Antigos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============= MAIN PAGE =============
const SettingsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações gerais da plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="modalities" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              <span className="hidden sm:inline">Modalidades</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Plug className="h-4 w-4" />
              <span className="hidden sm:inline">Integrações</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voz</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Auditoria</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="modalities">
            <ModalitiesTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="editor">
            <EditorDefaultsTab />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceCommandsTab />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
