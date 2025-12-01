import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, RefreshCw, History } from 'lucide-react';

interface PromptConfig {
  id: string;
  function_name: string;
  display_name: string;
  description: string | null;
  system_prompt: string;
  model_name: string;
  max_tokens: number;
  reasoning_effort: string;
  temperature: number;
  is_active: boolean;
  version: number;
}

export default function PromptsPage() {
  const [configs, setConfigs] = useState<PromptConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<PromptConfig | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');

  const fetchConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_prompt_configs')
      .select('*')
      .order('display_name');

    if (error) {
      toast.error('Erro ao carregar configurações');
      console.error(error);
    } else {
      setConfigs(data || []);
      if (data && data.length > 0 && !selectedConfig) {
        setSelectedConfig(data[0]);
        setEditedPrompt(data[0].system_prompt);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSelectConfig = (config: PromptConfig) => {
    setSelectedConfig(config);
    setEditedPrompt(config.system_prompt);
  };

  const handleSave = async () => {
    if (!selectedConfig) return;

    setSaving(true);
    const { error } = await supabase
      .from('ai_prompt_configs')
      .update({ 
        system_prompt: editedPrompt,
        version: selectedConfig.version + 1
      })
      .eq('id', selectedConfig.id);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success('Prompt salvo com sucesso');
      fetchConfigs();
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuração de Prompts</h1>
            <p className="text-muted-foreground mt-1">
              Edite os prompts de sistema das Edge Functions de IA
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
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Lista de funções */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Edge Functions</CardTitle>
                <CardDescription>Selecione uma função para editar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {configs.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => handleSelectConfig(config)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConfig?.id === config.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="font-medium">{config.display_name}</div>
                    <div className="text-xs opacity-70">{config.function_name}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Editor de prompt */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedConfig?.display_name || 'Selecione uma função'}</CardTitle>
                    <CardDescription>{selectedConfig?.description}</CardDescription>
                  </div>
                  {selectedConfig && (
                    <Badge variant="outline">v{selectedConfig.version}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedConfig ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label>Modelo</Label>
                        <Input value={selectedConfig.model_name} disabled />
                      </div>
                      <div>
                        <Label>Max Tokens</Label>
                        <Input value={selectedConfig.max_tokens} disabled />
                      </div>
                      <div>
                        <Label>Reasoning</Label>
                        <Input value={selectedConfig.reasoning_effort} disabled />
                      </div>
                    </div>

                    <div>
                      <Label>System Prompt</Label>
                      <Textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        rows={12}
                        className="font-mono text-sm mt-2"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" disabled>
                        <History className="h-4 w-4 mr-2" />
                        Histórico
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Selecione uma função para editar seu prompt
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
