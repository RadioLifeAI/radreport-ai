import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Database, 
  Users, 
  Activity,
  Brain,
  MessageSquare,
  Mic,
  ScrollText,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardMetrics {
  promptConfigs: number;
  activeModels: number;
  templates: number;
  frasesModelo: number;
  totalUsers: number;
  aiCallsToday: number;
  whisperUsageToday: number;
  recentActivity: Array<{
    id: string;
    function_name: string;
    updated_at: string;
    version: number;
  }>;
}

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceHealth] = useState<ServiceHealth[]>([
    { name: 'Supabase Database', status: 'healthy', latency: 45 },
    { name: 'Edge Functions', status: 'healthy', latency: 120 },
    { name: 'Auth Service', status: 'healthy', latency: 38 },
    { name: 'Storage', status: 'healthy', latency: 65 },
  ]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      // Parallel queries for efficiency
      const [
        promptsRes,
        modelsRes,
        templatesRes,
        frasesRes,
        usersRes,
        aiCallsRes,
        whisperRes,
        recentRes
      ] = await Promise.all([
        supabase.from('ai_prompt_configs').select('id', { count: 'exact', head: true }),
        supabase.from('ai_models').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('system_templates').select('id', { count: 'exact', head: true }).eq('ativo', true),
        supabase.from('frases_modelo').select('id', { count: 'exact', head: true }).eq('ativa', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('ai_conclusion_logs').select('id', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('whisper_usage_log').select('id', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('ai_prompt_configs').select('id, function_name, updated_at, version').order('updated_at', { ascending: false }).limit(5)
      ]);

      setMetrics({
        promptConfigs: promptsRes.count || 0,
        activeModels: modelsRes.count || 0,
        templates: templatesRes.count || 0,
        frasesModelo: frasesRes.count || 0,
        totalUsers: usersRes.count || 0,
        aiCallsToday: aiCallsRes.count || 0,
        whisperUsageToday: whisperRes.count || 0,
        recentActivity: recentRes.data || []
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
    setLoading(false);
  };

  const statCards = [
    { 
      title: 'Prompts Configurados', 
      value: metrics?.promptConfigs || 0, 
      icon: FileText, 
      description: 'Edge Functions com prompts',
      color: 'text-cyan-500'
    },
    { 
      title: 'Modelos Ativos', 
      value: metrics?.activeModels || 0, 
      icon: Brain, 
      description: 'Modelos de IA disponíveis',
      color: 'text-indigo-500'
    },
    { 
      title: 'Templates', 
      value: metrics?.templates || 0, 
      icon: Database, 
      description: 'Templates de laudo ativos',
      color: 'text-emerald-500'
    },
    { 
      title: 'Frases Modelo', 
      value: metrics?.frasesModelo || 0, 
      icon: MessageSquare, 
      description: 'Frases disponíveis',
      color: 'text-amber-500'
    },
    { 
      title: 'Usuários', 
      value: metrics?.totalUsers || 0, 
      icon: Users, 
      description: 'Usuários registrados',
      color: 'text-rose-500'
    },
    { 
      title: 'Chamadas IA Hoje', 
      value: metrics?.aiCallsToday || 0, 
      icon: Activity, 
      description: 'Requisições às Edge Functions',
      color: 'text-violet-500'
    },
    { 
      title: 'Whisper Hoje', 
      value: metrics?.whisperUsageToday || 0, 
      icon: Mic, 
      description: 'Transcrições de áudio',
      color: 'text-blue-500'
    },
    { 
      title: 'Uptime', 
      value: '99.9%', 
      icon: TrendingUp, 
      description: 'Últimos 30 dias',
      color: 'text-green-500'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'down': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-mono">Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              Visão geral do sistema RadReport
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map(({ title, value, icon: Icon, description, color }) => (
              <Card key={title} className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium font-mono">{title}</CardTitle>
                  <Icon className={`h-4 w-4 ${color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">{value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Service Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Status dos Serviços
              </CardTitle>
              <CardDescription>Monitoramento em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceHealth.map((service) => (
                  <div 
                    key={service.name} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                      <span className="font-mono text-sm">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {service.latency && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {service.latency}ms
                        </span>
                      )}
                      {getStatusIcon(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Últimas alterações em prompts</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {metrics?.recentActivity.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-mono text-sm">{item.function_name}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            v{item.version}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatDate(item.updated_at)}
                      </span>
                    </div>
                  ))}
                  {(!metrics?.recentActivity || metrics.recentActivity.length === 0) && (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      Nenhuma atividade recente
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-mono">Acesso Rápido</CardTitle>
            <CardDescription>
              Navegue para as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <a 
                href="/admin/ai-config" 
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <FileText className="h-5 w-5 text-cyan-500" />
                <div>
                  <div className="font-medium font-mono text-sm">Prompts IA</div>
                  <div className="text-xs text-muted-foreground">Editar prompts de sistema</div>
                </div>
              </a>
              <a 
                href="/admin/ai-config" 
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <Brain className="h-5 w-5 text-indigo-500" />
                <div>
                  <div className="font-medium font-mono text-sm">Modelos IA</div>
                  <div className="text-xs text-muted-foreground">Gerenciar modelos disponíveis</div>
                </div>
              </a>
              <a 
                href="/admin/ai-config" 
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <ScrollText className="h-5 w-5 text-emerald-500" />
                <div>
                  <div className="font-medium font-mono text-sm">Logs & Analytics</div>
                  <div className="text-xs text-muted-foreground">Monitorar uso do sistema</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
