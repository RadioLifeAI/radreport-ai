import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Plus, Search, Pencil, Trash2, Copy, Eye, ChevronLeft, ChevronRight,
  FileText, RefreshCw, Save, Variable
} from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface SystemTemplate {
  id: string;
  codigo: string;
  titulo: string;
  modalidade_codigo: string;
  regiao_codigo?: string;
  tecnica?: Json;
  achados: string;
  impressao: string;
  adicionais?: string;
  conteudo_template?: string;
  tags?: string[];
  ativo: boolean;
  variaveis?: Json;
  condicoes_logicas?: Json;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

interface Modalidade {
  id: string;
  codigo: string;
  nome: string;
}

interface RegiaoAnatomica {
  id: string;
  codigo: string;
  nome: string;
}

const ITEMS_PER_PAGE = 15;

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<SystemTemplate[]>([]);
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [regioes, setRegioes] = useState<RegiaoAnatomica[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalidade, setFilterModalidade] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplate | null>(null);
  
  const [formData, setFormData] = useState<Partial<SystemTemplate>>({
    codigo: '',
    titulo: '',
    modalidade_codigo: '',
    regiao_codigo: '',
    tecnica: {},
    achados: '',
    impressao: '',
    adicionais: '',
    tags: [],
    ativo: true,
    variaveis: [],
    condicoes_logicas: []
  });
  const [formTab, setFormTab] = useState('basico');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesRes, modalidadesRes, regioesRes] = await Promise.all([
        supabase.from('system_templates').select('*').order('modalidade_codigo').order('titulo'),
        supabase.from('modalidades').select('*').eq('ativa', true).order('ordem'),
        supabase.from('regioes_anatomicas').select('*').eq('ativa', true).order('nome')
      ]);

      if (templatesRes.data) setTemplates(templatesRes.data as SystemTemplate[]);
      if (modalidadesRes.data) setModalidades(modalidadesRes.data);
      if (regioesRes.data) setRegioes(regioesRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchSearch = !searchTerm || 
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchModalidade = filterModalidade === 'all' || t.modalidade_codigo === filterModalidade;
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && t.ativo) || 
      (filterStatus === 'inactive' && !t.ativo);
    return matchSearch && matchModalidade && matchStatus;
  });

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (template: SystemTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...template,
      tecnica: template.tecnica || {},
      variaveis: template.variaveis || [],
      condicoes_logicas: template.condicoes_logicas || []
    });
    setFormTab('basico');
    setEditModalOpen(true);
  };

  const handleNew = () => {
    setSelectedTemplate(null);
    setFormData({
      codigo: '',
      titulo: '',
      modalidade_codigo: '',
      regiao_codigo: '',
      tecnica: { SEM: '' },
      achados: '',
      impressao: '',
      adicionais: '',
      tags: [],
      ativo: true,
      variaveis: [],
      condicoes_logicas: []
    });
    setFormTab('basico');
    setEditModalOpen(true);
  };

  const handleView = (template: SystemTemplate) => {
    setSelectedTemplate(template);
    setViewModalOpen(true);
  };

  const handleDelete = (template: SystemTemplate) => {
    setSelectedTemplate(template);
    setDeleteModalOpen(true);
  };

  const handleDuplicate = async (template: SystemTemplate) => {
    try {
      const newTemplate = {
        codigo: `${template.codigo}_COPY`,
        titulo: `${template.titulo} (Cópia)`,
        modalidade_codigo: template.modalidade_codigo,
        regiao_codigo: template.regiao_codigo,
        tecnica: template.tecnica,
        achados: template.achados,
        impressao: template.impressao,
        adicionais: template.adicionais,
        tags: template.tags,
        ativo: template.ativo,
        variaveis: template.variaveis,
        condicoes_logicas: template.condicoes_logicas
      };

      const { error } = await supabase.from('system_templates').insert(newTemplate);
      if (error) throw error;
      
      toast.success('Template duplicado com sucesso');
      loadData();
    } catch (error) {
      toast.error('Erro ao duplicar template');
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.codigo || !formData.titulo || !formData.modalidade_codigo || !formData.achados || !formData.impressao) {
        toast.error('Preencha os campos obrigatórios');
        return;
      }

      const dataToSave = {
        codigo: formData.codigo,
        titulo: formData.titulo,
        modalidade_codigo: formData.modalidade_codigo,
        regiao_codigo: formData.regiao_codigo || null,
        tecnica: formData.tecnica,
        achados: formData.achados,
        impressao: formData.impressao,
        adicionais: formData.adicionais || null,
        tags: formData.tags,
        ativo: formData.ativo,
        variaveis: formData.variaveis,
        condicoes_logicas: formData.condicoes_logicas
      };

      if (selectedTemplate) {
        const { error } = await supabase
          .from('system_templates')
          .update(dataToSave)
          .eq('id', selectedTemplate.id);
        if (error) throw error;
        toast.success('Template atualizado');
      } else {
        const { error } = await supabase.from('system_templates').insert(dataToSave);
        if (error) throw error;
        toast.success('Template criado');
      }

      setEditModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const confirmDelete = async () => {
    if (!selectedTemplate) return;
    try {
      const { error } = await supabase
        .from('system_templates')
        .delete()
        .eq('id', selectedTemplate.id);
      if (error) throw error;
      
      toast.success('Template excluído');
      setDeleteModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  const toggleStatus = async (template: SystemTemplate) => {
    try {
      const { error } = await supabase
        .from('system_templates')
        .update({ ativo: !template.ativo })
        .eq('id', template.id);
      if (error) throw error;
      
      toast.success(`Template ${template.ativo ? 'desativado' : 'ativado'}`);
      loadData();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const getVariablesCount = (template: SystemTemplate): number => {
    const vars = template.variaveis;
    if (Array.isArray(vars)) return vars.length;
    if (typeof vars === 'object' && vars !== null) return Object.keys(vars).length;
    return 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-mono">Templates de Laudos</h1>
            <p className="text-muted-foreground text-sm">
              {templates.length} templates • {templates.filter(t => t.ativo).length} ativos
            </p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, código ou tags..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterModalidade} onValueChange={(v) => { setFilterModalidade(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Modalidades</SelectItem>
              {modalidades.map(m => (
                <SelectItem key={m.id} value={m.codigo}>{m.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="w-[100px]">Modalidade</TableHead>
                <TableHead className="w-[120px]">Região</TableHead>
                <TableHead className="w-[80px] text-center">Vars</TableHead>
                <TableHead className="w-[80px] text-center">Status</TableHead>
                <TableHead className="w-[160px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {loading ? 'Carregando...' : 'Nenhum template encontrado'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{template.codigo}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{template.titulo}</div>
                      {template.tags && template.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {template.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">{tag}</Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{template.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.modalidade_codigo}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {template.regiao_codigo || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getVariablesCount(template) > 0 ? (
                        <Badge variant="secondary" className="gap-1">
                          <Variable className="h-3 w-3" />
                          {getVariablesCount(template)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={template.ativo}
                        onCheckedChange={() => toggleStatus(template)}
                        className="scale-75"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleView(template)} title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(template)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicate(template)} title="Duplicar">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(template)} title="Excluir" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredTemplates.length)} de {filteredTemplates.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center px-3 text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Edit/Create Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedTemplate ? 'Editar Template' : 'Novo Template'}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={formTab} onValueChange={setFormTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="basico">Básico</TabsTrigger>
                <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
                <TabsTrigger value="config">Configurações</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                <TabsContent value="basico" className="space-y-4 m-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código *</Label>
                      <Input
                        id="codigo"
                        value={formData.codigo || ''}
                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                        placeholder="TC_TORAX_NORMAL_001"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título *</Label>
                      <Input
                        id="titulo"
                        value={formData.titulo || ''}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        placeholder="TC de Tórax Normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Modalidade *</Label>
                      <Select
                        value={formData.modalidade_codigo || ''}
                        onValueChange={(v) => setFormData({ ...formData, modalidade_codigo: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {modalidades.map(m => (
                            <SelectItem key={m.id} value={m.codigo}>{m.nome} ({m.codigo})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Região Anatômica</Label>
                      <Select
                        value={formData.regiao_codigo || ''}
                        onValueChange={(v) => setFormData({ ...formData, regiao_codigo: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {regioes.map(r => (
                            <SelectItem key={r.id} value={r.codigo}>{r.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                      placeholder="normal, protocolo, tórax"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="conteudo" className="space-y-4 m-0">
                  <div className="space-y-2">
                    <Label>Técnica (JSON)</Label>
                    <Textarea
                      value={JSON.stringify(formData.tecnica || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const tecnica = JSON.parse(e.target.value);
                          setFormData({ ...formData, tecnica });
                        } catch {}
                      }}
                      className="font-mono text-sm min-h-[100px]"
                      placeholder='{"SEM": "Texto sem contraste", "EV": "Texto com contraste"}'
                    />
                    <p className="text-xs text-muted-foreground">
                      Objeto com chaves para cada tipo de técnica (SEM, EV, Primovist, etc.)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achados">Achados *</Label>
                    <Textarea
                      id="achados"
                      value={formData.achados || ''}
                      onChange={(e) => setFormData({ ...formData, achados: e.target.value })}
                      className="min-h-[150px]"
                      placeholder="Descreva os achados do exame. Use {{variavel}} para variáveis dinâmicas."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impressao">Impressão *</Label>
                    <Textarea
                      id="impressao"
                      value={formData.impressao || ''}
                      onChange={(e) => setFormData({ ...formData, impressao: e.target.value })}
                      className="min-h-[80px]"
                      placeholder="Conclusão/impressão diagnóstica"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adicionais">Informações Adicionais</Label>
                    <Textarea
                      id="adicionais"
                      value={formData.adicionais || ''}
                      onChange={(e) => setFormData({ ...formData, adicionais: e.target.value })}
                      className="min-h-[60px]"
                      placeholder="Observações, recomendações (opcional)"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="variaveis" className="space-y-4 m-0">
                  <div className="space-y-2">
                    <Label>Variáveis (JSON Array)</Label>
                    <Textarea
                      value={JSON.stringify(formData.variaveis || [], null, 2)}
                      onChange={(e) => {
                        try {
                          const variaveis = JSON.parse(e.target.value);
                          setFormData({ ...formData, variaveis });
                        } catch {}
                      }}
                      className="font-mono text-sm min-h-[250px]"
                      placeholder={`[
  {
    "nome": "medida_x",
    "tipo": "numero",
    "descricao": "Medida em X",
    "unidade": "cm",
    "obrigatorio": true
  },
  {
    "nome": "lado",
    "tipo": "select",
    "opcoes": ["direito", "esquerdo", "bilateral"]
  }
]`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tipos: texto, numero, select, boolean. Use &#123;&#123;nome_variavel&#125;&#125; no conteúdo.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Condições Lógicas (JSON Array)</Label>
                    <Textarea
                      value={JSON.stringify(formData.condicoes_logicas || [], null, 2)}
                      onChange={(e) => {
                        try {
                          const condicoes_logicas = JSON.parse(e.target.value);
                          setFormData({ ...formData, condicoes_logicas });
                        } catch {}
                      }}
                      className="font-mono text-sm min-h-[100px]"
                      placeholder={`[
  {
    "quando": "lado",
    "igual": "bilateral",
    "derivar": { "prefixo": "Bilateralmente" }
  }
]`}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="config" className="space-y-4 m-0">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <Label className="text-base">Template Ativo</Label>
                      <p className="text-sm text-muted-foreground">
                        Templates inativos não aparecem para seleção
                      </p>
                    </div>
                    <Switch
                      checked={formData.ativo ?? true}
                      onCheckedChange={(v) => setFormData({ ...formData, ativo: v })}
                    />
                  </div>

                  {selectedTemplate && (
                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <Label className="text-base">Informações do Sistema</Label>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <span className="ml-2 font-mono text-xs">{selectedTemplate.id}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Versão:</span>
                          <span className="ml-2">{selectedTemplate.version || 1}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Criado:</span>
                          <span className="ml-2">{selectedTemplate.created_at ? new Date(selectedTemplate.created_at).toLocaleString('pt-BR') : '-'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Atualizado:</span>
                          <span className="ml-2">{selectedTemplate.updated_at ? new Date(selectedTemplate.updated_at).toLocaleString('pt-BR') : '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {selectedTemplate ? 'Salvar Alterações' : 'Criar Template'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visualizar Template
              </DialogTitle>
            </DialogHeader>

            {selectedTemplate && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Código</Label>
                    <p className="font-mono">{selectedTemplate.codigo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Título</Label>
                    <p>{selectedTemplate.titulo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Modalidade</Label>
                    <Badge>{selectedTemplate.modalidade_codigo}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Região</Label>
                    <p>{selectedTemplate.regiao_codigo || '-'}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTemplate.tags?.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    )) || <span className="text-muted-foreground">-</span>}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Técnica</Label>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(selectedTemplate.tecnica, null, 2)}
                  </pre>
                </div>

                <div>
                  <Label className="text-muted-foreground">Achados</Label>
                  <div className="text-sm bg-muted p-2 rounded mt-1 whitespace-pre-wrap">
                    {selectedTemplate.achados || '-'}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Impressão</Label>
                  <div className="text-sm bg-muted p-2 rounded mt-1 whitespace-pre-wrap">
                    {selectedTemplate.impressao || '-'}
                  </div>
                </div>

                {getVariablesCount(selectedTemplate) > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Variáveis ({getVariablesCount(selectedTemplate)})</Label>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(selectedTemplate.variaveis, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => { setViewModalOpen(false); handleEdit(selectedTemplate!); }}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Tem certeza que deseja excluir o template <strong>{selectedTemplate?.titulo}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
