import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRadiologyCalculatorAdmin, DbRadiologyCalculator } from '@/hooks/useRadiologyCalculators';
import { radiologyCalculators } from '@/lib/radiologyCalculators';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, ExternalLink, Calculator, Info, Upload } from 'lucide-react';

const CATEGORIES = [
  { value: 'geral', label: 'Geral' },
  { value: 'neuro', label: 'Neurologia' },
  { value: 'obstetricia', label: 'Obstetrícia' },
  { value: 'vascular', label: 'Vascular' },
  { value: 'oncologia', label: 'Oncologia' },
];

interface CalcFormData {
  code: string;
  name: string;
  category: string;
  description: string;
  reference_text: string;
  reference_url: string;
  output_template: string;
  info_purpose: string;
  info_usage: string[];
  info_grading: string[];
  display_order: number;
  ativo: boolean;
}

const emptyForm: CalcFormData = {
  code: '',
  name: '',
  category: 'geral',
  description: '',
  reference_text: '',
  reference_url: '',
  output_template: '',
  info_purpose: '',
  info_usage: [],
  info_grading: [],
  display_order: 0,
  ativo: true,
};

export default function CalculatorsAdminPage() {
  const { calculators, isLoading, createCalculator, updateCalculator, deleteCalculator } = useRadiologyCalculatorAdmin();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCalc, setEditingCalc] = useState<DbRadiologyCalculator | null>(null);
  const [formData, setFormData] = useState<CalcFormData>(emptyForm);
  const [usageText, setUsageText] = useState('');
  const [gradingText, setGradingText] = useState('');

  // Calculadoras do código que ainda não estão no banco
  const codeOnlyCalculators = radiologyCalculators.filter(
    calc => !calculators.some(db => db.code === calc.id)
  );

  const filteredCalculators = calculators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingCalc(null);
    setFormData(emptyForm);
    setUsageText('');
    setGradingText('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (calc: DbRadiologyCalculator) => {
    setEditingCalc(calc);
    setFormData({
      code: calc.code,
      name: calc.name,
      category: calc.category,
      description: calc.description || '',
      reference_text: calc.reference_text || '',
      reference_url: calc.reference_url || '',
      output_template: calc.output_template || '',
      info_purpose: calc.info_purpose || '',
      info_usage: calc.info_usage || [],
      info_grading: calc.info_grading || [],
      display_order: calc.display_order,
      ativo: calc.ativo,
    });
    setUsageText((calc.info_usage || []).join('\n'));
    setGradingText((calc.info_grading || []).join('\n'));
    setIsDialogOpen(true);
  };

  const handleImportFromCode = (codeCalc: typeof radiologyCalculators[0]) => {
    setEditingCalc(null);
    const refUrl = typeof codeCalc.reference === 'object' ? codeCalc.reference?.url : '';
    setFormData({
      code: codeCalc.id,
      name: codeCalc.name,
      category: codeCalc.category,
      description: codeCalc.description,
      reference_text: typeof codeCalc.reference === 'object' ? codeCalc.reference?.text || '' : '',
      reference_url: refUrl,
      output_template: '',
      info_purpose: codeCalc.info?.purpose || '',
      info_usage: codeCalc.info?.usage || [],
      info_grading: codeCalc.info?.grading || [],
      display_order: 0,
      ativo: true,
    });
    setUsageText((codeCalc.info?.usage || []).join('\n'));
    setGradingText((codeCalc.info?.grading || []).join('\n'));
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const info_usage = usageText.split('\n').filter(l => l.trim());
    const info_grading = gradingText.split('\n').filter(l => l.trim());

    try {
      if (editingCalc) {
        await updateCalculator.mutateAsync({
          id: editingCalc.id,
          ...formData,
          info_usage,
          info_grading,
          description: formData.description || null,
          reference_text: formData.reference_text || null,
          reference_url: formData.reference_url || null,
          output_template: formData.output_template || null,
          info_purpose: formData.info_purpose || null,
        });
        toast.success('Calculadora atualizada!');
      } else {
        await createCalculator.mutateAsync({
          ...formData,
          info_usage,
          info_grading,
          description: formData.description || null,
          reference_text: formData.reference_text || null,
          reference_url: formData.reference_url || null,
          output_template: formData.output_template || null,
          info_purpose: formData.info_purpose || null,
        });
        toast.success('Calculadora criada!');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar calculadora');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta calculadora?')) return;
    try {
      await deleteCalculator.mutateAsync(id);
      toast.success('Calculadora excluída!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir calculadora');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Calculadoras Radiológicas
            </h1>
            <p className="text-muted-foreground">
              Gerencie metadados, referências e templates de saída das calculadoras
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Calculadora
          </Button>
        </div>

        {/* Calculadoras não sincronizadas */}
        {codeOnlyCalculators.length > 0 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                {codeOnlyCalculators.length} calculadoras do código ainda não configuradas no banco
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {codeOnlyCalculators.slice(0, 10).map(calc => (
                  <Button
                    key={calc.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleImportFromCode(calc)}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {calc.name}
                  </Button>
                ))}
                {codeOnlyCalculators.length > 10 && (
                  <Badge variant="secondary">+{codeOnlyCalculators.length - 10} mais</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
                <TableHead>Template Saída</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredCalculators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma calculadora encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredCalculators.map(calc => (
                  <TableRow key={calc.id}>
                    <TableCell className="font-mono text-xs">{calc.code}</TableCell>
                    <TableCell className="font-medium">{calc.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {CATEGORIES.find(c => c.value === calc.category)?.label || calc.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {calc.output_template ? (
                        <Badge variant="default">Customizado</Badge>
                      ) : (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {calc.reference_url ? (
                        <a
                          href={calc.reference_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ver
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={calc.ativo ? 'default' : 'secondary'}>
                        {calc.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(calc)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(calc.id)}>
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
          {filteredCalculators.length} calculadoras no banco • {radiologyCalculators.length} calculadoras no código
        </p>
      </div>

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingCalc ? 'Editar Calculadora' : 'Nova Calculadora'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="flex-1">
            <TabsList>
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="output">Template de Saída</TabsTrigger>
              <TabsTrigger value="reference">Referências</TabsTrigger>
              <TabsTrigger value="info">Info Expandível</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[55vh] mt-4">
              <TabsContent value="basic" className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Código *</Label>
                    <Input
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Ex: volume-ellipsoid"
                      disabled={!!editingCalc}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deve corresponder ao ID no código TypeScript
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Volume por Elipsóide"
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
                    <Label>Ordem de Exibição</Label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição breve da calculadora..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.ativo}
                    onCheckedChange={v => setFormData({ ...formData, ativo: v })}
                  />
                  <Label>Ativo</Label>
                </div>
              </TabsContent>

              <TabsContent value="output" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Template de Saída Customizado</Label>
                  <Textarea
                    value={formData.output_template}
                    onChange={e => setFormData({ ...formData, output_template: e.target.value })}
                    placeholder="Volume calculado: {{value}} {{unit}}, {{interpretation}}."
                    className="font-mono text-sm min-h-[150px]"
                  />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Placeholders disponíveis:</strong></p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><code>{"{{value}}"}</code> - Valor numérico do resultado</li>
                      <li><code>{"{{unit}}"}</code> - Unidade de medida (cm³, %, etc.)</li>
                      <li><code>{"{{interpretation}}"}</code> - Interpretação/classificação</li>
                      <li><code>{"{{formattedText}}"}</code> - Texto formatado padrão</li>
                    </ul>
                    <p className="mt-2">Se vazio, usa o texto padrão gerado pela calculadora.</p>
                  </div>
                </div>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    {formData.output_template ? (
                      <p className="font-mono bg-muted p-2 rounded">
                        {formData.output_template
                          .replace(/\{\{value\}\}/g, '42,5')
                          .replace(/\{\{unit\}\}/g, 'cm³')
                          .replace(/\{\{interpretation\}\}/g, 'Volume normal')
                          .replace(/\{\{formattedText\}\}/g, 'Volume: 42,5 cm³ (normal)')}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">Usando texto padrão da calculadora</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reference" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Texto da Referência</Label>
                  <Textarea
                    value={formData.reference_text}
                    onChange={e => setFormData({ ...formData, reference_text: e.target.value })}
                    placeholder="Ex: Hadlock FP et al. Radiology 1985;157:495-497"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Citação bibliográfica completa
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>URL da Referência</Label>
                  <Input
                    value={formData.reference_url}
                    onChange={e => setFormData({ ...formData, reference_url: e.target.value })}
                    placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Link para o artigo/guideline original
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="info" className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label>Propósito</Label>
                  <Textarea
                    value={formData.info_purpose}
                    onChange={e => setFormData({ ...formData, info_purpose: e.target.value })}
                    placeholder="Para que serve esta calculadora..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Como Usar (uma instrução por linha)</Label>
                  <Textarea
                    value={usageText}
                    onChange={e => setUsageText(e.target.value)}
                    placeholder="1. Meça a dimensão X&#10;2. Meça a dimensão Y&#10;3. Insira os valores"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Classificação/Grading (um item por linha)</Label>
                  <Textarea
                    value={gradingText}
                    onChange={e => setGradingText(e.target.value)}
                    placeholder="Score 0: Normal&#10;Score 1: Leve&#10;Score 2: Moderado"
                    rows={4}
                  />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.code || !formData.name}>
              {editingCalc ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
