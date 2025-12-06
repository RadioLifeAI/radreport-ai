import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Copy, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'

interface RADSOption {
  id: string
  sistema_codigo: string
  categoria: string
  valor: string
  label: string
  texto: string
  pontos: number | null
  suspeicao: string | null
  birads_associado: string | null
  usa_lado: boolean | null
  usa_meses: boolean | null
  variaveis: Record<string, any> | null
  ordem: number | null
  ativo: boolean | null
  created_at: string | null
  updated_at: string | null
}

const SISTEMAS = [
  { value: 'BIRADS_USG', label: 'BI-RADS USG' },
  { value: 'BIRADS_MG', label: 'BI-RADS MG' },
  { value: 'BIRADS_RM', label: 'BI-RADS RM' },
  { value: 'TIRADS', label: 'TI-RADS' },
  { value: 'US_TIREOIDE', label: 'US Tireoide' },
  { value: 'PIRADS', label: 'PI-RADS' },
  { value: 'ORADS_US', label: 'O-RADS US' },
  { value: 'ORADS_MRI', label: 'O-RADS MRI' },
  { value: 'LIRADS_US', label: 'LI-RADS US' },
  { value: 'LUNG_RADS', label: 'Lung-RADS' },
]

const SUSPEICAO_OPTIONS = [
  { value: 'benigno', label: 'Benigno', color: 'bg-green-500' },
  { value: 'indeterminado', label: 'Indeterminado', color: 'bg-yellow-500' },
  { value: 'suspeito', label: 'Suspeito', color: 'bg-orange-500' },
  { value: 'alto', label: 'Alto', color: 'bg-red-500' },
  { value: 'neutro', label: 'Neutro', color: 'bg-gray-500' },
]

const ITEMS_PER_PAGE = 20

export default function RADSOptionsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSistema, setFilterSistema] = useState<string>('all')
  const [filterCategoria, setFilterCategoria] = useState<string>('all')
  const [filterAtivo, setFilterAtivo] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<RADSOption | null>(null)
  const [formData, setFormData] = useState<Partial<RADSOption>>({
    sistema_codigo: '',
    categoria: '',
    valor: '',
    label: '',
    texto: '',
    pontos: null,
    suspeicao: null,
    birads_associado: null,
    usa_lado: false,
    usa_meses: false,
    variaveis: null,
    ordem: 0,
    ativo: true,
  })

  // Fetch all options
  const { data: options = [], isLoading, refetch } = useQuery({
    queryKey: ['rads-options-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rads_text_options')
        .select('*')
        .order('sistema_codigo')
        .order('categoria')
        .order('ordem')
      
      if (error) throw error
      return data as RADSOption[]
    },
  })

  // Get unique categories from current data
  const uniqueCategories = [...new Set(options.map(o => o.categoria))].sort()

  // Filter options
  const filteredOptions = options.filter(option => {
    const matchesSearch = searchTerm === '' || 
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSistema = filterSistema === 'all' || option.sistema_codigo === filterSistema
    const matchesCategoria = filterCategoria === 'all' || option.categoria === filterCategoria
    const matchesAtivo = filterAtivo === 'all' || 
      (filterAtivo === 'true' && option.ativo) || 
      (filterAtivo === 'false' && !option.ativo)
    
    return matchesSearch && matchesSistema && matchesCategoria && matchesAtivo
  })

  // Pagination
  const totalPages = Math.ceil(filteredOptions.length / ITEMS_PER_PAGE)
  const paginatedOptions = filteredOptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterSistema, filterCategoria, filterAtivo])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<RADSOption>) => {
      const insertData = {
        sistema_codigo: data.sistema_codigo!,
        categoria: data.categoria!,
        valor: data.valor!,
        label: data.label!,
        texto: data.texto || '',
        pontos: data.pontos,
        suspeicao: data.suspeicao,
        birads_associado: data.birads_associado,
        usa_lado: data.usa_lado,
        usa_meses: data.usa_meses,
        variaveis: data.variaveis,
        ordem: data.ordem,
        ativo: data.ativo,
      }
      const { error } = await supabase
        .from('rads_text_options')
        .insert([insertData])
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rads-options-admin'] })
      queryClient.invalidateQueries({ queryKey: ['rads-options'] })
      toast.success('Opção criada com sucesso')
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(`Erro ao criar: ${error.message}`)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RADSOption> }) => {
      const { error } = await supabase
        .from('rads_text_options')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rads-options-admin'] })
      queryClient.invalidateQueries({ queryKey: ['rads-options'] })
      toast.success('Opção atualizada')
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rads_text_options')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rads-options-admin'] })
      queryClient.invalidateQueries({ queryKey: ['rads-options'] })
      toast.success('Opção excluída')
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`)
    },
  })

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('rads_text_options')
        .update({ ativo, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rads-options-admin'] })
      queryClient.invalidateQueries({ queryKey: ['rads-options'] })
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`)
    },
  })

  const resetForm = () => {
    setFormData({
      sistema_codigo: '',
      categoria: '',
      valor: '',
      label: '',
      texto: '',
      pontos: null,
      suspeicao: null,
      birads_associado: null,
      usa_lado: false,
      usa_meses: false,
      variaveis: null,
      ordem: 0,
      ativo: true,
    })
    setEditingOption(null)
  }

  const handleCreate = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (option: RADSOption) => {
    setEditingOption(option)
    setFormData({
      sistema_codigo: option.sistema_codigo,
      categoria: option.categoria,
      valor: option.valor,
      label: option.label,
      texto: option.texto,
      pontos: option.pontos,
      suspeicao: option.suspeicao,
      birads_associado: option.birads_associado,
      usa_lado: option.usa_lado ?? false,
      usa_meses: option.usa_meses ?? false,
      variaveis: option.variaveis,
      ordem: option.ordem ?? 0,
      ativo: option.ativo ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleDuplicate = (option: RADSOption) => {
    setEditingOption(null)
    setFormData({
      sistema_codigo: option.sistema_codigo,
      categoria: option.categoria,
      valor: `${option.valor}_copia`,
      label: `${option.label} (cópia)`,
      texto: option.texto,
      pontos: option.pontos,
      suspeicao: option.suspeicao,
      birads_associado: option.birads_associado,
      usa_lado: option.usa_lado ?? false,
      usa_meses: option.usa_meses ?? false,
      variaveis: option.variaveis,
      ordem: (option.ordem ?? 0) + 1,
      ativo: true,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (option: RADSOption) => {
    if (confirm(`Excluir "${option.label}"?`)) {
      deleteMutation.mutate(option.id)
    }
  }

  const handleSubmit = () => {
    if (!formData.sistema_codigo || !formData.categoria || !formData.valor || !formData.label) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    if (editingOption) {
      updateMutation.mutate({ id: editingOption.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const getSistemaLabel = (codigo: string) => {
    return SISTEMAS.find(s => s.value === codigo)?.label || codigo
  }

  const getSuspeicaoColor = (suspeicao: string | null) => {
    return SUSPEICAO_OPTIONS.find(s => s.value === suspeicao)?.color || 'bg-muted'
  }

  // Stats by sistema
  const statsBySistema = SISTEMAS.map(s => ({
    ...s,
    count: options.filter(o => o.sistema_codigo === s.value).length,
    activeCount: options.filter(o => o.sistema_codigo === s.value && o.ativo).length,
  }))

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">RADS Options</h1>
            <p className="text-muted-foreground">
              Gerenciar opções de texto para classificações RADS ({options.length} registros)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Opção
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
          {statsBySistema.map(stat => (
            <Card 
              key={stat.value} 
              className={`cursor-pointer transition-colors ${filterSistema === stat.value ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setFilterSistema(filterSistema === stat.value ? 'all' : stat.value)}
            >
              <CardContent className="p-3 text-center">
                <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
                <div className="text-lg font-bold">{stat.count}</div>
                <div className="text-xs text-green-600">{stat.activeCount} ativos</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por label, valor, texto, categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={filterSistema} onValueChange={setFilterSistema}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Sistemas</SelectItem>
                  {SISTEMAS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAtivo} onValueChange={setFilterAtivo}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Ativos</SelectItem>
                  <SelectItem value="false">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {filteredOptions.length} de {options.length} registros
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Sistema</TableHead>
                    <TableHead className="w-[120px]">Categoria</TableHead>
                    <TableHead className="w-[100px]">Valor</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="w-[200px]">Texto</TableHead>
                    <TableHead className="w-[60px]">Pts</TableHead>
                    <TableHead className="w-[80px]">Suspeição</TableHead>
                    <TableHead className="w-[60px]">Ordem</TableHead>
                    <TableHead className="w-[60px]">Ativo</TableHead>
                    <TableHead className="w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : paginatedOptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOptions.map(option => (
                      <TableRow key={option.id} className={!option.ativo ? 'opacity-50' : ''}>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getSistemaLabel(option.sistema_codigo)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{option.categoria}</TableCell>
                        <TableCell className="font-mono text-xs">{option.valor}</TableCell>
                        <TableCell className="font-medium">{option.label}</TableCell>
                        <TableCell className="text-xs truncate max-w-[200px]" title={option.texto}>
                          {option.texto}
                        </TableCell>
                        <TableCell>{option.pontos ?? '-'}</TableCell>
                        <TableCell>
                          {option.suspeicao && (
                            <Badge className={`${getSuspeicaoColor(option.suspeicao)} text-white text-xs`}>
                              {option.suspeicao}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{option.ordem ?? 0}</TableCell>
                        <TableCell>
                          <Switch
                            checked={option.ativo ?? true}
                            onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: option.id, ativo: checked })}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(option)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDuplicate(option)}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(option)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
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
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOption ? 'Editar Opção RADS' : 'Nova Opção RADS'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sistema *</Label>
                  <Select
                    value={formData.sistema_codigo || ''}
                    onValueChange={(v) => setFormData({ ...formData, sistema_codigo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sistema" />
                    </SelectTrigger>
                    <SelectContent>
                      {SISTEMAS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Input
                    value={formData.categoria || ''}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="ex: composicao, ecogenicidade, indicacao"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor (código) *</Label>
                  <Input
                    value={formData.valor || ''}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="ex: solido, hipoecogenico"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Label (exibição) *</Label>
                  <Input
                    value={formData.label || ''}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="ex: Sólido, Hipoecogênico"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Texto (geração de laudo)</Label>
                <Textarea
                  value={formData.texto || ''}
                  onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                  placeholder="Texto que será inserido no laudo..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pontos (TI-RADS)</Label>
                  <Input
                    type="number"
                    value={formData.pontos ?? ''}
                    onChange={(e) => setFormData({ ...formData, pontos: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="0-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Suspeição</Label>
                  <Select
                    value={formData.suspeicao || 'none'}
                    onValueChange={(v) => setFormData({ ...formData, suspeicao: v === 'none' ? null : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {SUSPEICAO_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>BI-RADS Associado</Label>
                  <Input
                    value={formData.birads_associado || ''}
                    onChange={(e) => setFormData({ ...formData, birads_associado: e.target.value || null })}
                    placeholder="ex: 2, 3, 4A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={formData.ordem ?? 0}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={formData.usa_lado ?? false}
                    onCheckedChange={(checked) => setFormData({ ...formData, usa_lado: checked })}
                  />
                  <Label>Usa Lado (D/E)</Label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={formData.usa_meses ?? false}
                    onCheckedChange={(checked) => setFormData({ ...formData, usa_meses: checked })}
                  />
                  <Label>Usa Meses</Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.ativo ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingOption ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
