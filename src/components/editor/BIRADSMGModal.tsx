import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, Calendar, AlertCircle, FileText, ClipboardList, FileCheck, Stethoscope, StickyNote, History, Eye, EyeOff, Check, Minus, ChevronRight, Activity, Shuffle, Scale, Circle, Sparkles, Target, LucideIcon, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import {
  BIRADSMGData,
  BIRADSMGNodulo,
  biradsCategories,
  evaluateBIRADSMG,
  generateBIRADSMGAchados,
  generateBIRADSMGImpression,
  generateBIRADSMGLaudoCompletoHTML,
  generateBIRADSMGRecomendacao,
  generateBIRADSMGIndicacao,
  generateBIRADSMGComparativo,
  generateBIRADSMGNotas,
  createEmptyBIRADSMGNodulo,
  createEmptyBIRADSMGData,
  formatMeasurement,
  calcularTempoSeguimento,
  formatarTempoSeguimento,
} from '@/lib/radsClassifications'
import { useRADSOptions, RADSOption } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback } from '@/lib/radsOptionsProvider'

interface BIRADSMGModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'indicacao' | 'parenquima' | 'distorcao' | 'assimetria' | 'nodulos' | 'calcificacoes' | 'linfonodos' | 'comparativo' | 'recomendacao' | 'notas'

const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'indicacao', label: 'Indicação', icon: ClipboardList },
  { id: 'parenquima', label: 'Parênquima', icon: Activity },
  { id: 'distorcao', label: 'Distorção', icon: Shuffle },
  { id: 'assimetria', label: 'Assimetria', icon: Scale },
  { id: 'nodulos', label: 'Nódulos', icon: Circle },
  { id: 'calcificacoes', label: 'Calcificações', icon: Sparkles },
  { id: 'linfonodos', label: 'Linfonodos', icon: Target },
  { id: 'comparativo', label: 'Comparativo', icon: Calendar },
  { id: 'recomendacao', label: 'Recomendação', icon: FileCheck },
  { id: 'notas', label: 'Notas', icon: FileText },
]

// Componente de seção do preview
interface SectionPreviewProps {
  title: string
  content: string
  hasContent: boolean
  isRequired?: boolean
}

const SectionPreview = ({ title, content, hasContent, isRequired = false }: SectionPreviewProps) => (
  <div className={`mb-3 rounded-md p-2 ${!hasContent && isRequired ? 'bg-destructive/10 border-l-2 border-destructive' : hasContent ? 'bg-muted/30' : ''}`}>
    <div className="flex items-center gap-1.5 mb-1">
      {hasContent ? (
        <Check size={12} className="text-green-500 shrink-0" />
      ) : isRequired ? (
        <AlertCircle size={12} className="text-destructive shrink-0" />
      ) : (
        <Minus size={12} className="text-muted-foreground shrink-0" />
      )}
      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide">{title}</span>
    </div>
    <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-foreground/80">
      {content || <span className="italic text-muted-foreground">Não preenchido</span>}
    </p>
  </div>
)

export function BIRADSMGModal({ open, onOpenChange, editor }: BIRADSMGModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('indicacao')
  const [data, setData] = useState<BIRADSMGData>(createEmptyBIRADSMGData())
  const [showPreview, setShowPreview] = useState(true)

  // Fetch dynamic options from database with fallback
  const { data: dbOptions, isLoading, isError } = useRADSOptions('BIRADS_MG')
  
  // Get options with fallback to hardcoded if database unavailable
  const options = useMemo(() => 
    getRADSOptionsWithFallback('BIRADS_MG', dbOptions, isLoading, isError),
    [dbOptions, isLoading, isError]
  )

  // Helper to get options for a category
  const getOpts = (categoria: string): RADSOption[] => options[categoria] || []

  const updateData = <K extends keyof BIRADSMGData>(field: K, value: BIRADSMGData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddNodulo = () => {
    if (data.nodulos.length < 6) {
      setData(prev => ({ ...prev, nodulos: [...prev.nodulos, createEmptyBIRADSMGNodulo()] }))
    }
  }

  const handleRemoveNodulo = (index: number) => {
    setData(prev => ({ ...prev, nodulos: prev.nodulos.filter((_, i) => i !== index) }))
  }

  const updateNodulo = (index: number, field: keyof BIRADSMGNodulo, value: any) => {
    setData(prev => {
      const newNodulos = [...prev.nodulos]
      ;(newNodulos[index] as any)[field] = value
      return { ...prev, nodulos: newNodulos }
    })
  }

  const updateMedida = (noduloIndex: number, medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => {
      const newNodulos = [...prev.nodulos]
      newNodulos[noduloIndex].medidas[medidaIndex] = numValue
      return { ...prev, nodulos: newNodulos }
    })
  }

  const biradsCategory = useMemo(() => evaluateBIRADSMG(data, options), [data, options])
  const categoryInfo = biradsCategories.find(c => c.value === biradsCategory || c.value.toString() === biradsCategory.toString())

  const indicacaoTexto = useMemo(() => generateBIRADSMGIndicacao(data, options), [data, options])
  const achadosTexto = useMemo(() => generateBIRADSMGAchados(data, options), [data, options])
  const impressaoTexto = useMemo(() => generateBIRADSMGImpression(data, biradsCategory, options), [data, biradsCategory, options])
  const recomendacaoTexto = useMemo(() => generateBIRADSMGRecomendacao(data, biradsCategory, options), [data, biradsCategory, options])
  const comparativoTexto = useMemo(() => generateBIRADSMGComparativo(data, options), [data, options])
  const notasTexto = useMemo(() => generateBIRADSMGNotas(data, options), [data, options])

  // Cálculo de completude
  const completeness = useMemo(() => {
    let filled = 0
    const total = 10

    // Indicação (obrigatório)
    if (data.indicacao.tipo) filled++
    // Parênquima (obrigatório)
    if (data.parenquima) filled++
    // Pele
    if (data.pele) filled++
    // Distorção (check if evaluated)
    filled++ // sempre conta como preenchido (pode ser "sem distorção")
    // Assimetria
    filled++ // sempre conta como preenchido
    // Nódulos
    filled++ // sempre conta como preenchido
    // Calcificações
    filled++ // sempre conta como preenchido
    // Linfonodos
    filled++ // sempre conta como preenchido
    // Comparativo
    filled++ // sempre conta como preenchido
    // Recomendação sempre gerada
    filled++

    return { filled, total, percentage: Math.round((filled / total) * 100) }
  }, [data])

  const handleInsertAchados = () => {
    if (editor) {
      editor.chain().focus().insertContent(achadosTexto.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')).run()
      onOpenChange(false)
    }
  }

  const handleInsertImpressao = () => {
    if (editor) {
      editor.chain().focus().insertContent(impressaoTexto.replace(/\n/g, '<br>')).run()
      onOpenChange(false)
    }
  }

  const handleInsertLaudoCompleto = () => {
    if (editor) {
      // Substitui todo o conteúdo do editor com HTML formatado
      editor.chain()
        .focus()
        .selectAll()
        .deleteSelection()
        .insertContent(generateBIRADSMGLaudoCompletoHTML(data, biradsCategory, options))
        .run()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setData(createEmptyBIRADSMGData())
    setActiveTab('indicacao')
  }

  const getTempoSeguimento = (nodulo: BIRADSMGNodulo) => {
    if (!nodulo.temComparacao || !nodulo.dataExameAnterior) return null
    const meses = calcularTempoSeguimento(nodulo.dataExameAnterior)
    return {
      meses,
      texto: formatarTempoSeguimento(meses),
      suficiente: meses >= 24
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'indicacao':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Stethoscope size={16} className="text-pink-500" />
              Indicação Clínica
            </h3>
            
            <RadioGroup
              value={data.indicacao.tipo}
              onValueChange={(v) => updateData('indicacao', { ...data.indicacao, tipo: v as 'rastreamento' | 'diagnostica' })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="rastreamento" id="ind-rastreamento" />
                <Label htmlFor="ind-rastreamento" className="cursor-pointer flex-1">
                  Mamografia de rastreamento
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="diagnostica" id="ind-diagnostica" className="mt-1" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="ind-diagnostica" className="cursor-pointer">
                    Mamografia diagnóstica
                  </Label>
                  {data.indicacao.tipo === 'diagnostica' && (
                    <Input
                      placeholder="Motivo (ex: nódulo palpável, mastalgia)"
                      value={data.indicacao.motivoDiagnostica || ''}
                      onChange={(e) => updateData('indicacao', { ...data.indicacao, motivoDiagnostica: e.target.value })}
                      className="h-9"
                    />
                  )}
                </div>
              </div>
            </RadioGroup>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="historia-familiar"
                checked={data.indicacao.historiaFamiliar}
                onCheckedChange={(checked) => updateData('indicacao', { ...data.indicacao, historiaFamiliar: !!checked })}
              />
              <Label htmlFor="historia-familiar" className="cursor-pointer">História familiar positiva</Label>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Antecedentes</Label>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Neoplasia + Cirurgia conservadora</Label>
                <Select
                  value={data.indicacao.antecedentes.neoplasiaCirurgiaConservadora || 'nenhum'}
                  onValueChange={(v) => updateData('indicacao', { 
                    ...data.indicacao, 
                    antecedentes: { ...data.indicacao.antecedentes, neoplasiaCirurgiaConservadora: v === 'nenhum' ? null : v as 'direita' | 'esquerda' } 
                  })}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Nenhum</SelectItem>
                    <SelectItem value="direita">À direita</SelectItem>
                    <SelectItem value="esquerda">À esquerda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Neoplasia + Mastectomia</Label>
                <Select
                  value={data.indicacao.antecedentes.neoplasiaMastectomia || 'nenhum'}
                  onValueChange={(v) => updateData('indicacao', { 
                    ...data.indicacao, 
                    antecedentes: { ...data.indicacao.antecedentes, neoplasiaMastectomia: v === 'nenhum' ? null : v as 'direita' | 'esquerda' } 
                  })}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Nenhum</SelectItem>
                    <SelectItem value="direita">À direita</SelectItem>
                    <SelectItem value="esquerda">À esquerda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mamoplastia"
                  checked={data.indicacao.antecedentes.mamoplastia}
                  onCheckedChange={(checked) => updateData('indicacao', { 
                    ...data.indicacao, 
                    antecedentes: { ...data.indicacao.antecedentes, mamoplastia: !!checked } 
                  })}
                />
                <Label htmlFor="mamoplastia" className="cursor-pointer">Antecedente de mamoplastia</Label>
              </div>
            </div>
          </div>
        )

      case 'parenquima':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Padrão do Parênquima Mamário</h3>
            
            <div className="space-y-2 mb-4">
              <Label className="text-xs text-muted-foreground">Pele</Label>
              <RadioGroup
                value={data.pele}
                onValueChange={(v) => updateData('pele', v as 'normal' | 'alterada')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="pele-normal" />
                  <Label htmlFor="pele-normal" className="cursor-pointer text-sm">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alterada" id="pele-alterada" />
                  <Label htmlFor="pele-alterada" className="cursor-pointer text-sm">Alterada</Label>
                </div>
              </RadioGroup>
              {data.pele === 'alterada' && (
                <Input
                  placeholder="Descreva as alterações da pele"
                  value={data.peleDescricao || ''}
                  onChange={(e) => updateData('peleDescricao', e.target.value)}
                  className="h-9 mt-2"
                />
              )}
            </div>

            <RadioGroup
              value={data.parenquima}
              onValueChange={(v) => updateData('parenquima', v)}
              className="space-y-3"
            >
              {getOpts('parenquima').map((opt) => (
                <div key={opt.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={opt.value} id={`par-${opt.value}`} className="mt-0.5" />
                  <Label htmlFor={`par-${opt.value}`} className="cursor-pointer flex-1">
                    <span className="font-medium">{opt.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Prolongamentos axilares</Label>
              <RadioGroup
                value={data.prolongamentosAxilares}
                onValueChange={(v) => updateData('prolongamentosAxilares', v as 'normal' | 'alterado')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="prol-normal" />
                  <Label htmlFor="prol-normal" className="cursor-pointer text-sm">Sem particularidades</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alterado" id="prol-alterado" />
                  <Label htmlFor="prol-alterado" className="cursor-pointer text-sm">Alterado</Label>
                </div>
              </RadioGroup>
              {data.prolongamentosAxilares === 'alterado' && (
                <Input
                  placeholder="Descreva as alterações"
                  value={data.prolongamentosDescricao || ''}
                  onChange={(e) => updateData('prolongamentosDescricao', e.target.value)}
                  className="h-9 mt-2"
                />
              )}
            </div>
          </div>
        )

      case 'distorcao':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="distorcao-presente"
                checked={data.distorcaoArquitetural.presente}
                onCheckedChange={(checked) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, presente: !!checked })}
              />
              <Label htmlFor="distorcao-presente" className="font-semibold cursor-pointer">Distorção arquitetural presente</Label>
            </div>

            {data.distorcaoArquitetural.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Tipo</Label>
                  <Select
                    value={data.distorcaoArquitetural.tipo || ''}
                    onValueChange={(v) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, tipo: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {getOpts('distorcaoArquitetural').map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Lado</Label>
                    <Select
                      value={data.distorcaoArquitetural.lado || ''}
                      onValueChange={(v) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, lado: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {getOpts('ladoMG').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Localização</Label>
                    <Select
                      value={data.distorcaoArquitetural.localizacao || ''}
                      onValueChange={(v) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, localizacao: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {getOpts('localizacaoMG').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'assimetria':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="assimetria-presente"
                checked={data.assimetria.presente}
                onCheckedChange={(checked) => updateData('assimetria', { ...data.assimetria, presente: !!checked })}
              />
              <Label htmlFor="assimetria-presente" className="font-semibold cursor-pointer">Assimetria presente</Label>
            </div>

            {data.assimetria.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Tipo</Label>
                  <Select
                    value={data.assimetria.tipo || ''}
                    onValueChange={(v) => updateData('assimetria', { ...data.assimetria, tipo: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {getOpts('assimetria').map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Lado</Label>
                    <Select
                      value={data.assimetria.lado || ''}
                      onValueChange={(v) => updateData('assimetria', { ...data.assimetria, lado: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {getOpts('ladoMG').filter(o => o.value !== 'bilateral').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Localização</Label>
                    <Select
                      value={data.assimetria.localizacao || ''}
                      onValueChange={(v) => updateData('assimetria', { ...data.assimetria, localizacao: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {getOpts('localizacaoMG').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'nodulos':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Nódulos ({data.nodulos.length}/6)</h3>
              <Button variant="outline" size="sm" onClick={handleAddNodulo} disabled={data.nodulos.length >= 6}>
                <Plus size={14} className="mr-1" /> Adicionar
              </Button>
            </div>

            {data.nodulos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum nódulo adicionado.</p>
                <p className="text-sm">Clique em "Adicionar" para começar.</p>
              </div>
            )}

            {data.nodulos.map((nodulo, index) => {
              const tempoInfo = getTempoSeguimento(nodulo)
              return (
                <div key={index} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">N{index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveNodulo(index)} className="h-7 w-7 p-0 text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {/* Comparação temporal */}
                  <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`comp-${index}`}
                        checked={nodulo.temComparacao}
                        onCheckedChange={(checked) => updateNodulo(index, 'temComparacao', !!checked)}
                      />
                      <Label htmlFor={`comp-${index}`} className="text-xs cursor-pointer">Comparação disponível</Label>
                    </div>
                    {nodulo.temComparacao && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={nodulo.dataExameAnterior || ''}
                          onChange={(e) => updateNodulo(index, 'dataExameAnterior', e.target.value || null)}
                          className="h-8 text-xs"
                          max={new Date().toISOString().split('T')[0]}
                        />
                        <Select value={nodulo.estadoNodulo} onValueChange={(v) => updateNodulo(index, 'estadoNodulo', v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="estavel">Estável</SelectItem>
                            <SelectItem value="cresceu">Cresceu</SelectItem>
                            <SelectItem value="diminuiu">Diminuiu</SelectItem>
                            <SelectItem value="novo">Novo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {tempoInfo && (
                      <div className={`text-xs ${tempoInfo.suficiente ? 'text-green-600' : 'text-amber-600'}`}>
                        {tempoInfo.suficiente ? '✓' : '⚠'} {tempoInfo.texto}
                      </div>
                    )}
                  </div>

                  {/* Características */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Densidade</Label>
                      <Select value={nodulo.densidade} onValueChange={(v) => updateNodulo(index, 'densidade', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('densidade').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Forma</Label>
                      <Select value={nodulo.forma} onValueChange={(v) => updateNodulo(index, 'forma', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('formaMG').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Margens</Label>
                      <Select value={nodulo.margens} onValueChange={(v) => updateNodulo(index, 'margens', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('margensMG').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Medidas e localização */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Medidas (cm)</Label>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <Input
                            key={i}
                            type="text"
                            value={formatMeasurement(nodulo.medidas[i])}
                            onChange={(e) => updateMedida(index, i, e.target.value)}
                            className="h-8 text-xs text-center"
                            placeholder={['L', 'A', 'P'][i]}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Lado</Label>
                      <Select value={nodulo.lado} onValueChange={(v) => updateNodulo(index, 'lado', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('ladoMG').filter(o => o.value !== 'bilateral').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Localização</Label>
                      <Select value={nodulo.localizacao} onValueChange={(v) => updateNodulo(index, 'localizacao', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('localizacaoMG').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )

      case 'calcificacoes':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="calc-presente"
                checked={data.calcificacoes.presente}
                onCheckedChange={(checked) => updateData('calcificacoes', { ...data.calcificacoes, presente: !!checked })}
              />
              <Label htmlFor="calc-presente" className="font-semibold cursor-pointer">Calcificações presentes</Label>
            </div>

            {data.calcificacoes.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Tipo</Label>
                  <Select
                    value={data.calcificacoes.tipo || ''}
                    onValueChange={(v) => updateData('calcificacoes', { ...data.calcificacoes, tipo: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {getOpts('calcificacoes').map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Lado</Label>
                  <Select
                    value={data.calcificacoes.lado || ''}
                    onValueChange={(v) => updateData('calcificacoes', { ...data.calcificacoes, lado: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {getOpts('ladoMG').map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {data.calcificacoes.tipo === 'suspeitas' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">Morfologia</Label>
                      <Select
                        value={data.calcificacoes.morfologia || ''}
                        onValueChange={(v) => updateData('calcificacoes', { ...data.calcificacoes, morfologia: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {getOpts('morfologiaCalcificacoes').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Distribuição</Label>
                      <Select
                        value={data.calcificacoes.distribuicao || ''}
                        onValueChange={(v) => updateData('calcificacoes', { ...data.calcificacoes, distribuicao: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {getOpts('distribuicaoCalcificacoes').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Localização</Label>
                      <Select
                        value={data.calcificacoes.localizacao || ''}
                        onValueChange={(v) => updateData('calcificacoes', { ...data.calcificacoes, localizacao: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {getOpts('localizacaoMG').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )

      case 'linfonodos':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="linfono-presente"
                checked={data.linfonodomegalias.presente}
                onCheckedChange={(checked) => updateData('linfonodomegalias', { ...data.linfonodomegalias, presente: !!checked })}
              />
              <Label htmlFor="linfono-presente" className="font-semibold cursor-pointer">Linfonodomegalias presentes</Label>
            </div>

            {data.linfonodomegalias.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Lado</Label>
                    <Select
                      value={data.linfonodomegalias.lado || ''}
                      onValueChange={(v) => updateData('linfonodomegalias', { ...data.linfonodomegalias, lado: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {getOpts('ladoMG').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'comparativo':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <History size={16} className="text-blue-500" />
              Estudo Comparativo
            </h3>
            
            <RadioGroup
              value={data.estudoComparativo.tipo}
              onValueChange={(v) => updateData('estudoComparativo', { ...data.estudoComparativo, tipo: v as any })}
              className="space-y-2"
            >
              {getOpts('comparativoTipoMG').map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`comp-${opt.value}`} />
                  <Label htmlFor={`comp-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {(data.estudoComparativo.tipo && data.estudoComparativo.tipo !== 'primeira' && data.estudoComparativo.tipo !== 'nao_disponivel') && (
              <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Data do exame anterior</Label>
                  <Input
                    type="date"
                    value={data.estudoComparativo.dataExameAnterior || ''}
                    onChange={(e) => updateData('estudoComparativo', { ...data.estudoComparativo, dataExameAnterior: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
          </div>
        )

      case 'recomendacao':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Recomendação Manual</h3>
            <p className="text-xs text-muted-foreground">
              Deixe em branco para gerar automaticamente com base na categoria BI-RADS.
            </p>
            
            <div className="space-y-2">
              <Label className="text-sm">Sobrescrever recomendação</Label>
              <Select
                value={data.recomendacaoManual?.categoria || ''}
                onValueChange={(v) => updateData('recomendacaoManual', v ? { ativo: true, categoria: v } : { ativo: false, categoria: '' })}
              >
                <SelectTrigger><SelectValue placeholder="Automática (baseada no BI-RADS)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Automática (baseada no BI-RADS)</SelectItem>
                  {getOpts('recomendacaoManual').map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="text-xs text-muted-foreground mb-1">Recomendação atual:</div>
              <p className="text-sm">{recomendacaoTexto || 'Não definida'}</p>
            </div>
          </div>
        )

      case 'notas':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <StickyNote size={16} className="text-yellow-500" />
              Notas e Observações
            </h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="nota-mamas-densas"
                checked={data.notas.densaMamasUS}
                onCheckedChange={(checked) => updateData('notas', { ...data.notas, densaMamasUS: !!checked })}
              />
              <Label htmlFor="nota-mamas-densas" className="cursor-pointer text-sm">
                Incluir nota sobre complementação ultrassonográfica (mamas densas)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="nota-correlacao"
                checked={data.notas.densaMamasCorrelacao}
                onCheckedChange={(checked) => updateData('notas', { ...data.notas, densaMamasCorrelacao: !!checked })}
              />
              <Label htmlFor="nota-correlacao" className="cursor-pointer text-sm">
                Incluir nota sobre correlação clínica
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Outra observação</Label>
              <Textarea
                value={data.notas.outraObservacao || ''}
                onChange={(e) => updateData('notas', { ...data.notas, outraObservacao: e.target.value })}
                placeholder="Digite uma observação adicional..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-pink-500">BI-RADS® MG</span>
              <span className="text-muted-foreground font-normal">Mamografia - ACR</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs"
              >
                {showPreview ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r bg-muted/30 overflow-y-auto shrink-0">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Resizable Main Content + Preview */}
          <ResizablePanelGroup 
            direction="horizontal" 
            autoSaveId="birads-mg-layout"
            className="flex-1"
          >
            {/* Main Content */}
            <ResizablePanel defaultSize={showPreview ? 65 : 100} minSize={40} maxSize={80}>
              <div className="overflow-y-auto p-6 h-full">
                {renderTabContent()}
              </div>
            </ResizablePanel>

            {/* Preview Panel */}
            {showPreview && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
                  <div className="bg-muted/20 overflow-y-auto h-full">
                    <div className="p-4 space-y-4">
                      {/* BI-RADS Category */}
                      <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                        <div className="text-xs text-muted-foreground mb-1">Categoria</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-pink-500">BI-RADS {biradsCategory}</span>
                        </div>
                        {categoryInfo && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {categoryInfo.name} • Risco: {categoryInfo.risco}
                          </div>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Preenchimento</span>
                          <span className="font-medium">{completeness.filled}/{completeness.total}</span>
                        </div>
                        <Progress value={completeness.percentage} className="h-1.5" />
                      </div>

                      <Separator />

                      {/* Sections Preview */}
                      <div className="space-y-1">
                        <SectionPreview title="Indicação" content={indicacaoTexto} hasContent={!!indicacaoTexto} isRequired />
                        <SectionPreview title="Achados" content={achadosTexto} hasContent={!!achadosTexto} isRequired />
                        <SectionPreview title="Comparativo" content={comparativoTexto} hasContent={!!comparativoTexto} />
                        <SectionPreview title="Impressão" content={impressaoTexto} hasContent={!!impressaoTexto} isRequired />
                        <SectionPreview title="Recomendação" content={recomendacaoTexto} hasContent={!!recomendacaoTexto} isRequired />
                        <SectionPreview title="Notas" content={notasTexto} hasContent={!!notasTexto} />
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Limpar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleInsertAchados}>
                Inserir Achados
              </Button>
              <Button variant="outline" size="sm" onClick={handleInsertImpressao}>
                Inserir Impressão
              </Button>
              <Button onClick={handleInsertLaudoCompleto} className="bg-pink-600 hover:bg-pink-700">
                <FileCheck size={14} className="mr-1" />
                Inserir Laudo Completo
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
