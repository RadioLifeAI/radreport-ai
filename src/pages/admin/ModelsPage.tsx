import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Brain,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';

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

interface ModelUsage {
  model_name: string;
  usage_count: number;
}

const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Groq', 'Meta', 'Mistral'];

export default function ModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [modelToDelete, setModelToDelete] = useState<AIModel | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('OpenAI');
  const [formDescription, setFormDescription] = useState('');
  const [formMaxTokens, setFormMaxTokens] = useState(2000);
  const [formActive, setFormActive] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    
    const [modelsRes, usageRes] = await Promise.all([
      supabase.from('ai_models').select('*').order('name'),
      supabase.from('ai_prompt_configs').select('model_name')
    ]);

    if (modelsRes.error) {
      toast.error('Erro ao carregar modelos');
      console.error(modelsRes.error);
    } else {
      setModels(modelsRes.data || []);
    }

    // Count usage per model
    if (usageRes.data) {
      const usageCounts = usageRes.data.reduce((acc: Record<string, number>, config) => {
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

    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const resetForm = () => {
    setFormName('');
    setFormProvider('OpenAI');
    setFormDescription('');
    setFormMaxTokens(2000);
    setFormActive(true);
    setEditingModel(null);
  };

  const openEditDialog = (model: AIModel) => {
    setEditingModel(model);
    setFormName(model.name);
    setFormProvider(model.provider);
    setFormDescription(model.description || '');
    setFormMaxTokens(model.default_max_tokens);
    setFormActive(model.is_active);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error('Nome do modelo é obrigatório');
      return;
    }

    setSaving(true);

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
      // Update existing
      const result = await supabase
        .from('ai_models')
        .update(modelData)
        .eq('id', editingModel.id);
      error = result.error;
    } else {
      // Create new
      const result = await supabase
        .from('ai_models')
        .insert(modelData);
      error = result.error;
    }

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success(editingModel ? 'Modelo atualizado' : 'Modelo criado');
      setDialogOpen(false);
      resetForm();
      fetchModels();
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!modelToDelete) return;

    // Check if model is in use
    const usage = modelUsage.find(u => u.model_name === modelToDelete.name);
    if (usage && usage.usage_count > 0) {
      toast.error(`Não é possível excluir: modelo em uso por ${usage.usage_count} função(ões)`);
      setDeleteDialogOpen(false);
      return;
    }

    const { error } = await supabase
      .from('ai_models')
      .delete()
      .eq('id', modelToDelete.id);

    if (error) {
      toast.error('Erro ao excluir: ' + error.message);
    } else {
      toast.success('Modelo excluído');
      setDeleteDialogOpen(false);
      setModelToDelete(null);
      fetchModels();
    }
  };

  const toggleActive = async (model: AIModel) => {
    const { error } = await supabase
      .from('ai_models')
      .update({ is_active: !model.is_active, updated_at: new Date().toISOString() })
      .eq('id', model.id);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success(model.is_active ? 'Modelo desativado' : 'Modelo ativado');
      fetchModels();
    }
  };

  const getUsageCount = (modelName: string) => {
    const usage = modelUsage.find(u => u.model_name === modelName);
    return usage?.usage_count || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-mono">Modelos IA</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gerencie os modelos de IA disponíveis no sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchModels} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </div>
        </div>

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
                {models.filter(m => m.is_active).length}
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
            <CardTitle className="text-lg font-mono flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Modelos Cadastrados
            </CardTitle>
            <CardDescription>
              {models.length} modelos configurados no sistema
            </CardDescription>
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
                            onClick={() => toggleActive(model)}
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
                          {formatDate(model.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(model)}
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

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <Switch
                  checked={formActive}
                  onCheckedChange={setFormActive}
                />
                <Label className="font-mono">Modelo ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
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
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
