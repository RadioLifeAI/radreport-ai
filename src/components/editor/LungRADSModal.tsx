import { useState, useEffect, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Wind, Plus, Trash2, AlertTriangle, ChevronRight, Eye, EyeOff, Check, Circle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useRADSOptions } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback, getCategoryOptions } from '@/lib/radsOptionsProvider'
import {
  LungRADSData,
  LungRADSNodulo,
  initialLungRADSData,
  createEmptyNodulo,
  evaluateLungRADS,
  calcularDiametroMedio,
  generateIndicacaoTexto,
  generateNoduloTexto,
  generateParenquimaTexto,
  generateLinfonodosTexto,
  generateComparativoTexto,
  generateImpressaoTexto,
  generateRecomendacaoTexto
} from '@/lib/lungRADSClassifications'

interface LungRADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabKey = 'paciente' | 'nodulos' | 'parenquima' | 'linfonodos' | 'comparativo' | 'categoria' | 'notas'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'paciente', label: 'Paciente' },
  { key: 'nodulos', label: 'Nódulos' },
  { key: 'parenquima', label: 'Parênquima' },
  { key: 'linfonodos', label: 'Linfonodos' },
  { key: 'comparativo', label: 'Comparativo' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'notas', label: 'Notas' }
]

export function LungRADSModal({ open, onOpenChange, editor }: LungRADSModalProps) {
  const [data, setData] = useState<LungRADSData>(initialLungRADSData())
  const [activeTab, setActiveTab] = useState<TabKey>('paciente')
  const [showPreview, setShowPreview] = useState(true)
  
  const { data: dbOptions, isLoading, isError } = useRADSOptions('LUNG_RADS')
  
  // Reset on open
  useEffect(() => {
    if (open) {
      setData(initialLungRADSData())
      setActiveTab('paciente')
    }
  }, [open])
  
  // Avaliação em tempo real
  const evaluation = useMemo(() => evaluateLungRADS(data), [data])
  
  // Helper para obter opções
  const getOptions = (categoria: string) => {
    return getCategoryOptions('LUNG_RADS', categoria, dbOptions, isLoading, isError)
  }
  
  // Atualizar dados
  const updateData = <K extends keyof LungRADSData>(key: K, value: LungRADSData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }
  
  // Atualizar nódulo
  const updateNodulo = (index: number, field: keyof LungRADSNodulo, value: any) => {
    setData(prev => {
      const nodulos = [...prev.nodulos]
      nodulos[index] = { ...nodulos[index], [field]: value }
      return { ...prev, nodulos }
    })
  }
  
  // Adicionar nódulo
  const addNodulo = () => {
    if (data.nodulos.length >= 5) return
    const newId = String(data.nodulos.length + 1)
    setData(prev => ({
      ...prev,
      nodulos: [...prev.nodulos, createEmptyNodulo(newId)]
    }))
  }
  
  // Remover nódulo
  const removeNodulo = (index: number) => {
    if (data.nodulos.length <= 1) return
    setData(prev => ({
      ...prev,
      nodulos: prev.nodulos.filter((_, i) => i !== index)
    }))
  }
  
  // Gerar laudo HTML
  const generateReport = (): string => {
    const parts: string[] = []
    
    parts.push('<p><strong>TOMOGRAFIA COMPUTADORIZADA DE TÓRAX - PROTOCOLO DE BAIXA DOSE</strong></p>')
    parts.push('<p><strong>Lung-RADS v2022</strong></p>')
    parts.push('<br/>')
    
    // Indicação - passar dbOptions
    const indicacao = generateIndicacaoTexto(data, dbOptions || undefined)
    if (indicacao) {
      parts.push(`<p><strong>INDICAÇÃO:</strong> ${indicacao}</p>`)
    }
    
    // Técnica
    parts.push('<p><strong>TÉCNICA:</strong> Tomografia computadorizada de tórax com protocolo de baixa dose para rastreamento de câncer de pulmão, sem uso de contraste endovenoso.</p>')
    parts.push('<br/>')
    
    // Análise
    parts.push('<p><strong>ANÁLISE:</strong></p>')
    
    // Nódulos
    const nodulosValidos = data.nodulos.filter(n => n.tipo && n.diametroLongo > 0)
    if (nodulosValidos.length > 0) {
      parts.push('<p><em>Nódulos pulmonares:</em></p>')
      nodulosValidos.forEach((nodulo, idx) => {
        const texto = generateNoduloTexto(nodulo, dbOptions || undefined)
        parts.push(`<p>- Nódulo ${idx + 1}: ${texto}</p>`)
      })
    } else {
      parts.push('<p>- Ausência de nódulos pulmonares significativos.</p>')
    }
    
    // Parênquima - passar dbOptions
    const parenquima = generateParenquimaTexto(data, dbOptions || undefined)
    parts.push(`<p>- ${parenquima}</p>`)
    
    // Linfonodos - passar dbOptions
    const linfonodos = generateLinfonodosTexto(data, dbOptions || undefined)
    parts.push(`<p>- ${linfonodos}</p>`)
    
    // Comparativo - passar dbOptions
    const comparativo = generateComparativoTexto(data, dbOptions || undefined)
    parts.push(`<p>- ${comparativo}</p>`)
    
    parts.push('<br/>')
    
    // Classificação
    parts.push(`<p><strong>CLASSIFICAÇÃO:</strong></p>`)
    parts.push(`<p>${evaluation.categoria.nome}: ${evaluation.categoria.descricao}</p>`)
    if (data.modificadorS) {
      parts.push(`<p>Modificador S aplicado${data.motivoS ? `: ${data.motivoS}` : ''}</p>`)
    }
    parts.push(`<p>Probabilidade de malignidade: ${evaluation.categoria.probabilidadeMalignidade}</p>`)
    
    parts.push('<br/>')
    
    // Impressão - passar dbOptions
    parts.push('<p><strong>IMPRESSÃO:</strong></p>')
    const impressao = generateImpressaoTexto(evaluation, data, dbOptions || undefined)
    parts.push(`<p>${impressao}</p>`)
    
    parts.push('<br/>')
    
    // Recomendação - passar dbOptions
    parts.push('<p><strong>RECOMENDAÇÃO:</strong></p>')
    const recomendacao = generateRecomendacaoTexto(evaluation, dbOptions || undefined)
    parts.push(`<p>${recomendacao}</p>`)
    
    // Notas
    if (data.notas) {
      parts.push('<br/>')
      parts.push(`<p><strong>NOTAS:</strong> ${data.notas}</p>`)
    }
    
    return parts.join('')
  }
  
  // Inserir no editor
  const handleInsert = () => {
    if (!editor) return
    
    const html = generateReport()
    editor.chain().focus().setContent(html).run()
    onOpenChange(false)
  }
  
  // Renderizar indicadores de seção
  const SectionIndicator = ({ filled, required = false }: { filled: boolean; required?: boolean }) => {
    if (filled) {
      return <Check className="w-4 h-4 text-green-500" />
    }
    if (required) {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }
    return <Circle className="w-4 h-4 text-muted-foreground/30" />
  }
  
  // Verificar se seção está preenchida
  const isSectionFilled = (tab: TabKey): boolean => {
    switch (tab) {
      case 'paciente':
        return !!(data.indicacao || data.historicoTabagismo)
      case 'nodulos':
        return data.nodulos.some(n => n.tipo && n.diametroLongo > 0)
      case 'parenquima':
        return data.enfisema || data.fibrose || data.bronquiectasias || !!data.outrosAchadosParenquima
      case 'linfonodos':
        return !!data.linfadenopatia
      case 'comparativo':
        return data.temComparativo || !!data.comparativoResultado
      case 'categoria':
        return !!data.categoriaManual || data.modificadorS
      case 'notas':
        return !!data.notas
      default:
        return false
    }
  }
  
  // Renderizar tab de Paciente
  const renderPacienteTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Indicação do exame</Label>
        <Select value={data.indicacao} onValueChange={(v) => updateData('indicacao', v)}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {getOptions('indicacao_exame').map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Histórico de tabagismo</Label>
        <Select value={data.historicoTabagismo} onValueChange={(v) => updateData('historicoTabagismo', v)}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {getOptions('historico_tabagismo').map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {(data.historicoTabagismo === 'ativo' || data.historicoTabagismo?.includes('ex')) && (
        <div className="space-y-2">
          <Label>Carga tabágica</Label>
          <Select value={data.cargaTabagica} onValueChange={(v) => updateData('cargaTabagica', v)}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {getOptions('carga_tabagica').map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
  
  // Renderizar tab de Nódulos
  const renderNodulosTab = () => (
    <div className="space-y-4">
      {data.nodulos.map((nodulo, idx) => (
        <div key={nodulo.id} className="border rounded-lg p-4 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Nódulo {idx + 1}</h4>
            {data.nodulos.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeNodulo(idx)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={nodulo.tipo} onValueChange={(v) => updateNodulo(idx, 'tipo', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {getOptions('tipo_nodulo').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Segmento Pulmonar</Label>
              <Select value={nodulo.localizacao} onValueChange={(v) => updateNodulo(idx, 'localizacao', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione o segmento..." /></SelectTrigger>
                <SelectContent>
                  {getOptions('segmento_nodulo').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Diâmetro longo (mm)</Label>
              <Input
                type="number"
                step="0.1"
                value={nodulo.diametroLongo || ''}
                onChange={(e) => updateNodulo(idx, 'diametroLongo', parseFloat(e.target.value) || 0)}
                placeholder="0,0"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Diâmetro curto (mm)</Label>
              <Input
                type="number"
                step="0.1"
                value={nodulo.diametroCurto || ''}
                onChange={(e) => updateNodulo(idx, 'diametroCurto', parseFloat(e.target.value) || 0)}
                placeholder="0,0"
              />
            </div>
          </div>
          
          {nodulo.tipo === 'part_solid' && (
            <div className="space-y-2">
              <Label>Componente sólido (mm)</Label>
              <Input
                type="number"
                step="0.1"
                value={nodulo.componenteSolido || ''}
                onChange={(e) => updateNodulo(idx, 'componenteSolido', parseFloat(e.target.value) || 0)}
                placeholder="0,0"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Margem</Label>
              <Select value={nodulo.margem} onValueChange={(v) => updateNodulo(idx, 'margem', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {getOptions('margem_nodulo').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Calcificação</Label>
              <Select value={nodulo.calcificacao} onValueChange={(v) => updateNodulo(idx, 'calcificacao', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {getOptions('calcificacao').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {nodulo.tipo === 'cisto' && (
            <div className="space-y-2">
              <Label>Tipo de cisto</Label>
              <Select value={nodulo.cistoTipo || ''} onValueChange={(v) => updateNodulo(idx, 'cistoTipo', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {getOptions('cisto_tipo').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {nodulo.tipo === 'via_aerea' && (
            <div className="space-y-2">
              <Label>Relação com via aérea</Label>
              <Select value={nodulo.viaAerea} onValueChange={(v) => updateNodulo(idx, 'viaAerea', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {getOptions('via_aerea').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`novo-${idx}`}
                checked={nodulo.novo}
                onCheckedChange={(c) => updateNodulo(idx, 'novo', !!c)}
              />
              <Label htmlFor={`novo-${idx}`} className="text-sm">Novo</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id={`crescimento-${idx}`}
                checked={nodulo.crescimento}
                onCheckedChange={(c) => updateNodulo(idx, 'crescimento', !!c)}
              />
              <Label htmlFor={`crescimento-${idx}`} className="text-sm">Em crescimento</Label>
            </div>
          </div>
        </div>
      ))}
      
      {data.nodulos.length < 5 && (
        <Button variant="outline" onClick={addNodulo} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar nódulo
        </Button>
      )}
    </div>
  )
  
  // Renderizar tab de Parênquima
  const renderParenquimaTab = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Achados parenquimatosos</Label>
        
        <div className="flex items-center gap-2">
          <Checkbox
            id="enfisema"
            checked={data.enfisema}
            onCheckedChange={(c) => updateData('enfisema', !!c)}
          />
          <Label htmlFor="enfisema">Enfisema pulmonar</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox
            id="fibrose"
            checked={data.fibrose}
            onCheckedChange={(c) => updateData('fibrose', !!c)}
          />
          <Label htmlFor="fibrose">Alterações fibróticas</Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox
            id="bronquiectasias"
            checked={data.bronquiectasias}
            onCheckedChange={(c) => updateData('bronquiectasias', !!c)}
          />
          <Label htmlFor="bronquiectasias">Bronquiectasias</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Outros achados parenquimatosos</Label>
        <Textarea
          value={data.outrosAchadosParenquima || ''}
          onChange={(e) => updateData('outrosAchadosParenquima', e.target.value)}
          placeholder="Descreva outros achados..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Achados inflamatórios/infecciosos</Label>
        <div className="grid grid-cols-2 gap-2">
          {getOptions('achado_inflamatorio').map(opt => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`inflam-${opt.value}`}
                checked={data.achadosInflamatorios.includes(opt.value)}
                onCheckedChange={(c) => {
                  if (c) {
                    updateData('achadosInflamatorios', [...data.achadosInflamatorios, opt.value])
                  } else {
                    updateData('achadosInflamatorios', data.achadosInflamatorios.filter(v => v !== opt.value))
                  }
                }}
              />
              <Label htmlFor={`inflam-${opt.value}`} className="text-sm">{opt.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
  
  // Renderizar tab de Linfonodos
  const renderLinfonodosTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Linfonodos mediastinais/hilares</Label>
        <Select value={data.linfadenopatia} onValueChange={(v) => updateData('linfadenopatia', v)}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {getOptions('linfonodos').map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {data.linfadenopatia && data.linfadenopatia !== 'normal' && (
        <>
          <div className="space-y-2">
            <Label>Maior eixo do linfonodo (mm)</Label>
            <Input
              type="number"
              step="0.1"
              value={data.tamanhoLinfonodo || ''}
              onChange={(e) => updateData('tamanhoLinfonodo', parseFloat(e.target.value) || undefined)}
              placeholder="0,0"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Estação Linfonodal</Label>
            <Select value={data.localizacaoLinfonodo || ''} onValueChange={(v) => updateData('localizacaoLinfonodo', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione a estação..." /></SelectTrigger>
              <SelectContent>
                {getOptions('localizacao_linfonodo').map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
  
  // Renderizar tab de Comparativo
  const renderComparativoTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="temComparativo"
          checked={data.temComparativo}
          onCheckedChange={(c) => updateData('temComparativo', !!c)}
        />
        <Label htmlFor="temComparativo">Exame anterior disponível para comparação</Label>
      </div>
      
      {data.temComparativo && (
        <>
          <div className="space-y-2">
            <Label>Data do exame anterior</Label>
            <Input
              type="date"
              value={data.dataExameAnterior || ''}
              onChange={(e) => updateData('dataExameAnterior', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Resultado da comparação</Label>
            <Select value={data.comparativoResultado} onValueChange={(v) => updateData('comparativoResultado', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {getOptions('comparativo').map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {!data.temComparativo && (
        <p className="text-sm text-muted-foreground">
          Sem exame anterior disponível. Este será considerado o exame baseline.
        </p>
      )}
    </div>
  )
  
  // Renderizar tab de Categoria
  const renderCategoriaTab = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border-2" style={{ borderColor: evaluation.categoria.cor.replace('text-', '') }}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-lg font-bold ${evaluation.categoria.cor}`}>
            {evaluation.categoria.nome}
          </span>
          <Badge variant="outline">{evaluation.categoria.probabilidadeMalignidade}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{evaluation.categoria.descricao}</p>
      </div>
      
      <div className="space-y-2">
        <Label>Categoria manual (override)</Label>
        <Select value={data.categoriaManual || 'auto'} onValueChange={(v) => updateData('categoriaManual', v === 'auto' ? undefined : v)}>
          <SelectTrigger><SelectValue placeholder="Automático" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Automático</SelectItem>
            {getOptions('categoria').map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="modificadorS"
            checked={data.modificadorS}
            onCheckedChange={(c) => updateData('modificadorS', !!c)}
          />
          <Label htmlFor="modificadorS">Aplicar modificador S</Label>
        </div>
        
        {data.modificadorS && (
          <div className="space-y-2">
            <Label>Motivo do modificador S</Label>
            <Select value={data.motivoS || ''} onValueChange={(v) => updateData('motivoS', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {getOptions('modificador_s').map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {evaluation.alertas.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Alertas
          </Label>
          <ul className="text-sm space-y-1">
            {evaluation.alertas.map((alerta, idx) => (
              <li key={idx} className="text-yellow-600">• {alerta}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
  
  // Renderizar tab de Notas
  const renderNotasTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Notas adicionais</Label>
        <Textarea
          value={data.notas || ''}
          onChange={(e) => updateData('notas', e.target.value)}
          placeholder="Notas ou observações adicionais..."
          rows={6}
        />
      </div>
    </div>
  )
  
  // Renderizar conteúdo da tab ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'paciente': return renderPacienteTab()
      case 'nodulos': return renderNodulosTab()
      case 'parenquima': return renderParenquimaTab()
      case 'linfonodos': return renderLinfonodosTab()
      case 'comparativo': return renderComparativoTab()
      case 'categoria': return renderCategoriaTab()
      case 'notas': return renderNotasTab()
      default: return null
    }
  }
  
  // Renderizar preview
  const renderPreview = () => {
    const nodulosValidos = data.nodulos.filter(n => n.tipo && n.diametroLongo > 0)
    
    return (
      <div className="space-y-4">
        {/* Card de classificação */}
        <div className={`p-4 rounded-lg ${evaluation.categoria.corBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-lg font-bold ${evaluation.categoria.cor}`}>
              {evaluation.categoria.nome}
            </span>
            <Badge variant="secondary">{evaluation.categoria.probabilidadeMalignidade}</Badge>
          </div>
          <p className="text-sm text-foreground/80">{evaluation.categoria.descricao}</p>
          {data.modificadorS && (
            <Badge variant="outline" className="mt-2">Modificador S</Badge>
          )}
        </div>
        
        {/* Seções do preview */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <SectionIndicator filled={isSectionFilled('paciente')} />
            <div>
              <strong>Indicação:</strong>
              <p className="text-muted-foreground">
                {generateIndicacaoTexto(data, dbOptions || undefined) || 'Não preenchido'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <SectionIndicator filled={isSectionFilled('nodulos')} required />
            <div>
              <strong>Nódulos ({nodulosValidos.length}):</strong>
              {nodulosValidos.length > 0 ? (
                <ul className="text-muted-foreground list-none space-y-1">
                  {nodulosValidos.map((n, idx) => (
                    <li key={n.id}>
                      {idx + 1}. {generateNoduloTexto(n, dbOptions || undefined)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum nódulo</p>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <SectionIndicator filled={isSectionFilled('parenquima')} />
            <div>
              <strong>Parênquima:</strong>
              <p className="text-muted-foreground">{generateParenquimaTexto(data)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <SectionIndicator filled={isSectionFilled('linfonodos')} />
            <div>
              <strong>Linfonodos:</strong>
              <p className="text-muted-foreground">{generateLinfonodosTexto(data, dbOptions || undefined)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <SectionIndicator filled={isSectionFilled('comparativo')} />
            <div>
              <strong>Comparativo:</strong>
              <p className="text-muted-foreground">{generateComparativoTexto(data, dbOptions || undefined)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <div>
              <strong>Recomendação:</strong>
              <p className="text-muted-foreground">{generateRecomendacaoTexto(evaluation, dbOptions || undefined)}</p>
            </div>
          </div>
        </div>
        
        {/* Alertas */}
        {evaluation.alertas.length > 0 && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-700 dark:text-yellow-400">Alertas</span>
            </div>
            <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
              {evaluation.alertas.map((alerta, idx) => (
                <li key={idx}>• {alerta}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              ACR Lung-RADS v2022
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="md:hidden"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </DialogHeader>
        
        <ResizablePanelGroup 
          direction="horizontal" 
          className="flex-1"
          autoSaveId="lung-rads-layout"
        >
          {/* Sidebar de tabs */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <SectionIndicator filled={isSectionFilled(tab.key)} />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Conteúdo principal */}
          <ResizablePanel defaultSize={showPreview ? 50 : 85} minSize={40} maxSize={80}>
            <ScrollArea className="h-full">
              <div className="p-4">
                {renderTabContent()}
              </div>
            </ScrollArea>
          </ResizablePanel>
          
          {showPreview && (
            <>
              <ResizableHandle withHandle />
              
              {/* Preview */}
              <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </h3>
                    {renderPreview()}
                  </div>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => {
              setData(initialLungRADSData())
              setActiveTab('paciente')
            }}
          >
            Limpar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsert} className="gap-2">
              <Check className="h-4 w-4" />
              Inserir Laudo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
