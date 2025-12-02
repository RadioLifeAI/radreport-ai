import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Eye, Copy, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface FraseModelo {
  id: string;
  codigo: string;
  texto: string;
  modalidade_codigo?: string | null;
  categoria?: string | null;
  variaveis?: Json;
  'sinônimos'?: string[] | null;
  tags?: string[] | null;
  ativa?: boolean | null;
  conclusao?: string | null;
  tecnica?: string | null;
  observacao?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const MODALITIES = ['US', 'TC', 'RM', 'RX', 'MM'];
const ITEMS_PER_PAGE = 15;

const FrasesPage = () => {
  const [frases, setFrases] = useState<FraseModelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingFrase, setEditingFrase] = useState<FraseModelo | null>(null);
  const [viewingFrase, setViewingFrase] = useState<FraseModelo | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    codigo: '',
    texto: '',
    modalidade_codigo: '',
    categoria: '',
    conclusao: '',
    tecnica: '',
    observacao: '',
    ativa: true,
    variaveis: '[]',
    sinonimos: '',
    tags: ''
  });

  useEffect(() => {
    loadFrases();
  }, []);

  const loadFrases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('frases_modelo')
        .select('*')
        .order('codigo');
      
      if (error) throw error;
      setFrases(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar frases: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    frases.forEach(f => f.categoria && cats.add(f.categoria));
    return Array.from(cats).sort();
  }, [frases]);

  // Filtered frases
  const filteredFrases = useMemo(() => {
    return frases.filter(frase => {
      const matchesSearch = !searchTerm || 
        frase.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        frase.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        frase.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesModality = !selectedModality || frase.modalidade_codigo === selectedModality;
      const matchesCategory = !selectedCategory || frase.categoria === selectedCategory;
      const matchesStatus = !selectedStatus || 
        (selectedStatus === 'ativa' ? frase.ativa : !frase.ativa);
      
      return matchesSearch && matchesModality && matchesCategory && matchesStatus;
    });
  }, [frases, searchTerm, selectedModality, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredFrases.length / ITEMS_PER_PAGE);
  const paginatedFrases = filteredFrases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const countVariables = (texto: string) => {
    const matches = texto.match(/\{\{[^}]+\}\}/g);
    return matches ? matches.length : 0;
  };

  const openEditModal = (frase?: FraseModelo) => {
    if (frase) {
      setEditingFrase(frase);
      setFormData({
        codigo: frase.codigo,
        texto: frase.texto,
        modalidade_codigo: frase.modalidade_codigo || '',
        categoria: frase.categoria || '',
        conclusao: frase.conclusao || '',
        tecnica: frase.tecnica || '',
        observacao: frase.observacao || '',
        ativa: frase.ativa ?? true,
        variaveis: JSON.stringify(frase.variaveis || [], null, 2),
        sinonimos: frase['sinônimos']?.join(', ') || '',
        tags: frase.tags?.join(', ') || ''
      });
    } else {
      setEditingFrase(null);
      setFormData({
        codigo: '',
        texto: '',
        modalidade_codigo: '',
        categoria: '',
        conclusao: '',
        tecnica: '',
        observacao: '',
        ativa: true,
        variaveis: '[]',
        sinonimos: '',
        tags: ''
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.codigo || !formData.texto) {
      toast.error('Código e texto são obrigatórios');
      return;
    }

    setSaving(true);
    try {
      let parsedVariaveis: Json = [];
      try {
        parsedVariaveis = JSON.parse(formData.variaveis);
      } catch {
        toast.error('JSON de variáveis inválido');
        setSaving(false);
        return;
      }

      const fraseData = {
        codigo: formData.codigo,
        texto: formData.texto,
        modalidade_codigo: formData.modalidade_codigo || null,
        categoria: formData.categoria || null,
        conclusao: formData.conclusao || null,
        tecnica: formData.tecnica || null,
        observacao: formData.observacao || null,
        ativa: formData.ativa,
        variaveis: parsedVariaveis,
        'sinônimos': formData.sinonimos ? formData.sinonimos.split(',').map(s => s.trim()).filter(Boolean) : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null
      };

      if (editingFrase) {
        const { error } = await supabase
          .from('frases_modelo')
          .update(fraseData)
          .eq('id', editingFrase.id);
        if (error) throw error;
        toast.success('Frase atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('frases_modelo')
          .insert(fraseData);
        if (error) throw error;
        toast.success('Frase criada com sucesso');
      }

      setIsEditModalOpen(false);
      loadFrases();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (frase: FraseModelo) => {
    if (!confirm(`Excluir frase "${frase.codigo}"?`)) return;

    try {
      const { error } = await supabase
        .from('frases_modelo')
        .delete()
        .eq('id', frase.id);
      if (error) throw error;
      toast.success('Frase excluída');
      loadFrases();
    } catch (error: any) {
      toast.error('Erro ao excluir: ' + error.message);
    }
  };

  const handleDuplicate = async (frase: FraseModelo) => {
    const newFrase = {
      ...frase,
      codigo: `${frase.codigo}_COPY`,
    };
    delete (newFrase as any).id;
    delete (newFrase as any).created_at;
    delete (newFrase as any).updated_at;

    try {
      const { error } = await supabase
        .from('frases_modelo')
        .insert(newFrase);
      if (error) throw error;
      toast.success('Frase duplicada');
      loadFrases();
    } catch (error: any) {
      toast.error('Erro ao duplicar: ' + error.message);
    }
  };

  const handleToggleActive = async (frase: FraseModelo) => {
    try {
      const { error } = await supabase
        .from('frases_modelo')
        .update({ ativa: !frase.ativa })
        .eq('id', frase.id);
      if (error) throw error;
      toast.success(frase.ativa ? 'Frase desativada' : 'Frase ativada');
      loadFrases();
    } catch (error: any) {
      toast.error('Erro: ' + error.message);
    }
  };

  const activeCount = frases.filter(f => f.ativa).length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Frases Modelo</h1>
            <p className="text-sm text-muted-foreground">
              {frases.length} frases • {activeCount} ativas
            </p>
          </div>
          <Button onClick={() => openEditModal()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Frase
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, texto ou tags..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={selectedModality || 'all'} onValueChange={(v) => { setSelectedModality(v === 'all' ? null : v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {MODALITIES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedCategory || 'all'} onValueChange={(v) => { setSelectedCategory(v === 'all' ? null : v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Todas</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus || 'all'} onValueChange={(v) => { setSelectedStatus(v === 'all' ? null : v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="ativa">Ativas</SelectItem>
              <SelectItem value="inativa">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Código</TableHead>
                <TableHead>Texto</TableHead>
                <TableHead className="w-[120px]">Categoria</TableHead>
                <TableHead className="w-[80px]">Mod.</TableHead>
                <TableHead className="w-[60px] text-center">Vars</TableHead>
                <TableHead className="w-[80px] text-center">Status</TableHead>
                <TableHead className="w-[140px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : paginatedFrases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Nenhuma frase encontrada
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFrases.map((frase) => (
                  <TableRow key={frase.id}>
                    <TableCell className="font-mono text-xs">{frase.codigo}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm">{frase.texto}</TableCell>
                    <TableCell>
                      {frase.categoria && (
                        <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                          {frase.categoria}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {frase.modalidade_codigo && (
                        <Badge variant="secondary" className="text-xs">
                          {frase.modalidade_codigo}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {countVariables(frase.texto) > 0 && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {countVariables(frase.texto)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={frase.ativa ?? true}
                        onCheckedChange={() => handleToggleActive(frase)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setViewingFrase(frase); setIsViewModalOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(frase)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicate(frase)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(frase)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredFrases.length)} de {filteredFrases.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">{currentPage} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFrase ? 'Editar Frase' : 'Nova Frase'}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basico" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basico">Básico</TabsTrigger>
              <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
              <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
              <TabsTrigger value="sinonimos">Sinônimos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basico" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código *</Label>
                  <Input
                    value={formData.codigo}
                    onChange={(e) => setFormData(p => ({ ...p, codigo: e.target.value }))}
                    placeholder="US_ABD_FIGADO_NORMAL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modalidade</Label>
                  <Select value={formData.modalidade_codigo} onValueChange={(v) => setFormData(p => ({ ...p, modalidade_codigo: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODALITIES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input
                    value={formData.categoria}
                    onChange={(e) => setFormData(p => ({ ...p, categoria: e.target.value }))}
                    placeholder="Fígado"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (separadas por vírgula)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                    placeholder="normal, rotina, fígado"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.ativa}
                  onCheckedChange={(checked) => setFormData(p => ({ ...p, ativa: checked }))}
                />
                <Label>Frase ativa</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="conteudo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Texto *</Label>
                <Textarea
                  value={formData.texto}
                  onChange={(e) => setFormData(p => ({ ...p, texto: e.target.value }))}
                  placeholder="Texto da frase com {{variáveis}}"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Conclusão</Label>
                <Textarea
                  value={formData.conclusao}
                  onChange={(e) => setFormData(p => ({ ...p, conclusao: e.target.value }))}
                  placeholder="Texto para seção de impressão"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Técnica</Label>
                  <Input
                    value={formData.tecnica}
                    onChange={(e) => setFormData(p => ({ ...p, tecnica: e.target.value }))}
                    placeholder="Técnica utilizada"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Observação</Label>
                  <Input
                    value={formData.observacao}
                    onChange={(e) => setFormData(p => ({ ...p, observacao: e.target.value }))}
                    placeholder="Notas adicionais"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="variaveis" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Variáveis (JSON)</Label>
                <Textarea
                  value={formData.variaveis}
                  onChange={(e) => setFormData(p => ({ ...p, variaveis: e.target.value }))}
                  placeholder='[{"nome": "medida", "tipo": "numero", "unidade": "cm"}]'
                  rows={10}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Formato: {"[{nome, tipo, opcoes?, unidade?, minimo?, maximo?, obrigatorio?}]"}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sinonimos" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Sinônimos (separados por vírgula)</Label>
                <Textarea
                  value={formData.sinonimos}
                  onChange={(e) => setFormData(p => ({ ...p, sinonimos: e.target.value }))}
                  placeholder="fígado normal, hepatico sem alterações"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Termos alternativos que podem ser usados para buscar esta frase
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingFrase ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-sm">{viewingFrase?.codigo}</span>
              {viewingFrase?.ativa ? (
                <Badge variant="default" className="text-xs">Ativa</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Inativa</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {viewingFrase && (
            <div className="space-y-4 mt-4">
              <div className="flex gap-2">
                {viewingFrase.modalidade_codigo && (
                  <Badge variant="outline">{viewingFrase.modalidade_codigo}</Badge>
                )}
                {viewingFrase.categoria && (
                  <Badge variant="secondary">{viewingFrase.categoria}</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Texto</Label>
                <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {viewingFrase.texto.split(/(\{\{[^}]+\}\})/g).map((part, i) => (
                    part.match(/\{\{[^}]+\}\}/) ? (
                      <span key={i} className="bg-cyan-500/20 text-cyan-400 px-1 rounded">{part}</span>
                    ) : part
                  ))}
                </div>
              </div>
              
              {viewingFrase.conclusao && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Conclusão</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">{viewingFrase.conclusao}</div>
                </div>
              )}
              
              {Array.isArray(viewingFrase.variaveis) && viewingFrase.variaveis.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Variáveis ({viewingFrase.variaveis.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {viewingFrase.variaveis.map((v: any, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {v.nome || v}: {v.tipo || 'texto'}
                        {v.unidade && ` (${v.unidade})`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {viewingFrase.tags && viewingFrase.tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {viewingFrase.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FrasesPage;
