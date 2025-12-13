import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRadiologyTableAdmin, DbRadiologyTable } from '@/hooks/useRadiologyTables';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, Search, ExternalLink, Table2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'rads', label: 'Classificações RADS' },
  { value: 'obstetricia', label: 'Obstetrícia' },
  { value: 'vascular', label: 'Vascular' },
  { value: 'neuro', label: 'Neurorradiologia' },
  { value: 'oncologia', label: 'Oncologia' },
];

const TABLE_TYPES = [
  { value: 'informative', label: 'Informativa' },
  { value: 'dynamic', label: 'Dinâmica' },
];

interface TableFormData {
  code: string;
  name: string;
  category: string;
  subcategory: string;
  type: 'informative' | 'dynamic';
  modalities: string[];
  html_content: string;
  reference_text: string;
  reference_url: string;
  display_order: number;
  ativo: boolean;
}

const emptyForm: TableFormData = {
  code: '',
  name: '',
  category: 'rads',
  subcategory: '',
  type: 'informative',
  modalities: [],
  html_content: '',
  reference_text: '',
  reference_url: '',
  display_order: 0,
  ativo: true,
};

export default function TablesAdminPage() {
  const { tables, isLoading, createTable, updateTable, deleteTable } = useRadiologyTableAdmin();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<DbRadiologyTable | null>(null);
  const [previewTable, setPreviewTable] = useState<DbRadiologyTable | null>(null);
  const [formData, setFormData] = useState<TableFormData>(emptyForm);

  const filteredTables = tables.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingTable(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (table: DbRadiologyTable) => {
    setEditingTable(table);
    setFormData({
      code: table.code,
      name: table.name,
      category: table.category,
      subcategory: table.subcategory || '',
      type: table.type as 'informative' | 'dynamic',
      modalities: table.modalities || [],
      html_content: table.html_content,
      reference_text: table.reference_text || '',
      reference_url: table.reference_url || '',
      display_order: table.display_order,
      ativo: table.ativo,
    });
    setIsDialogOpen(true);
  };

  const handlePreview = (table: DbRadiologyTable) => {
    setPreviewTable(table);
    setIsPreviewOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingTable) {
        await updateTable.mutateAsync({
          id: editingTable.id,
          ...formData,
          modalities: formData.modalities.length > 0 ? formData.modalities : null,
          subcategory: formData.subcategory || null,
          reference_text: formData.reference_text || null,
          reference_url: formData.reference_url || null,
        });
        toast.success('Tabela atualizada!');
      } else {
        await createTable.mutateAsync({
          ...formData,
          modalities: formData.modalities.length > 0 ? formData.modalities : null,
          subcategory: formData.subcategory || null,
          reference_text: formData.reference_text || null,
          reference_url: formData.reference_url || null,
        });
        toast.success('Tabela criada!');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar tabela');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tabela?')) return;
    try {
      await deleteTable.mutateAsync(id);
      toast.success('Tabela excluída!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir tabela');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Table2 className="h-6 w-6" />
              Tabelas de Referência
            </h1>
            <p className="text-muted-foreground">
              Gerencie tabelas de referência radiológica e suas referências bibliográficas
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tabela
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredTables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma tabela encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredTables.map(table => (
                  <TableRow key={table.id}>
                    <TableCell className="font-mono text-xs">{table.code}</TableCell>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {CATEGORIES.find(c => c.value === table.category)?.label || table.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={table.type === 'dynamic' ? 'default' : 'secondary'}>
                        {table.type === 'dynamic' ? 'Dinâmica' : 'Informativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {table.reference_url ? (
                        <a
                          href={table.reference_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ver ref.
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={table.ativo ? 'default' : 'secondary'}>
                        {table.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handlePreview(table)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(table)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(table.id)}>
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

        <p className="text-sm text-muted-foreground">
          {filteredTables.length} tabelas • Dados hardcoded servem como fallback se banco estiver vazio
        </p>
      </div>

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingTable ? 'Editar Tabela' : 'Nova Tabela'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="flex-1">
            <TabsList>
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="content">Conteúdo HTML</TabsTrigger>
              <TabsTrigger value="reference">Referências</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4">
              <TabsContent value="basic" className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Código *</Label>
                    <Input
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Ex: birads-mamografia"
                      disabled={!!editingTable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: BI-RADS Mamografia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategoria</Label>
                    <Input
                      value={formData.subcategory}
                      onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                      placeholder="Ex: Mama"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as 'informative' | 'dynamic' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TABLE_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.ativo}
                    onCheckedChange={v => setFormData({ ...formData, ativo: v })}
                  />
                  <Label>Ativo</Label>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Conteúdo HTML *</Label>
                  <Textarea
                    value={formData.html_content}
                    onChange={e => setFormData({ ...formData, html_content: e.target.value })}
                    placeholder="<table>...</table>"
                    className="font-mono text-sm min-h-[400px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole o HTML da tabela aqui. Suporta &lt;table&gt;, &lt;thead&gt;, &lt;tbody&gt;, etc.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reference" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Texto da Referência</Label>
                  <Textarea
                    value={formData.reference_text}
                    onChange={e => setFormData({ ...formData, reference_text: e.target.value })}
                    placeholder="Ex: ACR BI-RADS Atlas, 5th Edition, 2013"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Citação bibliográfica completa para exibição
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>URL da Referência</Label>
                  <Input
                    value={formData.reference_url}
                    onChange={e => setFormData({ ...formData, reference_url: e.target.value })}
                    placeholder="https://www.acr.org/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Link para a fonte/guideline original
                  </p>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.code || !formData.name || !formData.html_content}>
              {editingTable ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewTable?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh]">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: previewTable?.html_content || '' }}
            />
            {previewTable?.reference_text && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Referência:</strong> {previewTable.reference_text}
                  {previewTable.reference_url && (
                    <a
                      href={previewTable.reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      [Link]
                    </a>
                  )}
                </p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
