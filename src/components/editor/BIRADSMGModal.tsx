import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, Calendar, AlertCircle, FileText, ClipboardList, FileCheck, Stethoscope, StickyNote, History, Eye, EyeOff, Check, Minus, ChevronRight } from 'lucide-react'
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
import {
  BIRADSMGData,
  BIRADSMGNodulo,
  biradsMGOptions,
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

interface BIRADSMGModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'indicacao' | 'parenquima' | 'distorcao' | 'assimetria' | 'nodulos' | 'calcificacoes' | 'linfonodos' | 'comparativo' | 'recomendacao' | 'notas'

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'indicacao', label: 'Indicação', icon: '📋' },
  { id: 'parenquima', label: 'Parênquima', icon: '🫁' },
  { id: 'distorcao', label: 'Distorção', icon: '🔀' },
  { id: 'assimetria', label: 'Assimetria', icon: '⚖️' },
  { id: 'nodulos', label: 'Nódulos', icon: '⚪' },
  { id: 'calcificacoes', label: 'Calcificações', icon: '✨' },
  { id: 'linfonodos', label: 'Linfonodos', icon: '🔘' },
  { id: 'comparativo', label: 'Comparativo', icon: '📅' },
  { id: 'recomendacao', label: 'Recomendação', icon: '📄' },
  { id: 'notas', label: 'Notas', icon: '📝' },
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

  const biradsCategory = useMemo(() => evaluateBIRADSMG(data), [data])
  const categoryInfo = biradsCategories.find(c => c.value === biradsCategory || c.value.toString() === biradsCategory.toString())

  const indicacaoTexto = useMemo(() => generateBIRADSMGIndicacao(data), [data])
  const achadosTexto = useMemo(() => generateBIRADSMGAchados(data), [data])
  const impressaoTexto = useMemo(() => generateBIRADSMGImpression(data, biradsCategory), [data, biradsCategory])
  const recomendacaoTexto = useMemo(() => generateBIRADSMGRecomendacao(data, biradsCategory), [data, biradsCategory])
  const comparativoTexto = useMemo(() => generateBIRADSMGComparativo(data), [data])
  const notasTexto = useMemo(() => generateBIRADSMGNotas(data), [data])

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
        .insertContent(generateBIRADSMGLaudoCompletoHTML(data, biradsCategory))
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
              {biradsMGOptions.parenquima.map((opt) => (
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
                      {biradsMGOptions.distorcaoArquitetural.map((opt) => (
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
                        {biradsMGOptions.ladoMG.map((opt) => (
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
                        {biradsMGOptions.localizacaoMG.map((opt) => (
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
                      {biradsMGOptions.assimetria.map((opt) => (
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
                        {biradsMGOptions.ladoMG.filter(o => o.value !== 'bilateral').map((opt) => (
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
                        {biradsMGOptions.localizacaoMG.map((opt) => (
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
                          {biradsMGOptions.densidade.map((opt) => (
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
                          {biradsMGOptions.formaMG.map((opt) => (
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
                          {biradsMGOptions.margensMG.map((opt) => (
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
                          {biradsMGOptions.ladoMG.filter(o => o.value !== 'bilateral').map((opt) => (
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
                          {biradsMGOptions.localizacaoMG.map((opt) => (
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
                      {biradsMGOptions.calcificacoes.map((opt) => (
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
                      {biradsMGOptions.ladoMG.map((opt) => (
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
                          {biradsMGOptions.morfologiaCalcificacoes.map((opt) => (
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
                          {biradsMGOptions.distribuicaoCalcificacoes.map((opt) => (
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
                          {biradsMGOptions.localizacaoMG.map((opt) => (
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
                        {biradsMGOptions.ladoMG.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Localização</Label>
                    <Select
                      value={data.linfonodomegalias.localizacao || ''}
                      onValueChange={(v) => updateData('linfonodomegalias', { ...data.linfonodomegalias, localizacao: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {biradsMGOptions.linfonodomegalias.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="linfono-intram"
                checked={data.linfonodoIntramamario.presente}
                onCheckedChange={(checked) => updateData('linfonodoIntramamario', { ...data.linfonodoIntramamario, presente: !!checked })}
              />
              <Label htmlFor="linfono-intram" className="font-semibold cursor-pointer">Linfonodo intramamário</Label>
            </div>

            {data.linfonodoIntramamario.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Lado</Label>
                  <Select
                    value={data.linfonodoIntramamario.lado || ''}
                    onValueChange={(v) => updateData('linfonodoIntramamario', { ...data.linfonodoIntramamario, lado: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {biradsMGOptions.ladoMG.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              {biradsMGOptions.estudoComparativo.map((opt) => (
                <div key={opt.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`comp-${opt.value}`} className="mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`comp-${opt.value}`} className="cursor-pointer">
                      {opt.label}
                    </Label>
                    {opt.value === 'sem_alteracoes' && data.estudoComparativo.tipo === 'sem_alteracoes' && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Data do exame anterior</Label>
                        <Input
                          type="date"
                          value={data.estudoComparativo.dataExameAnterior || ''}
                          onChange={(e) => updateData('estudoComparativo', { ...data.estudoComparativo, dataExameAnterior: e.target.value })}
                          className="h-9"
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'recomendacao':
        const selectedRecOpt = biradsMGOptions.recomendacaoManual.find(o => o.value === data.recomendacaoManual?.categoria)
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FileCheck size={16} className="text-blue-500" />
              Recomendação
            </h3>
            
            <div className="flex items-start space-x-2 p-3 rounded-lg border bg-blue-500/10 border-blue-500/30">
              <Checkbox
                id="rec-manual-ativo"
                checked={data.recomendacaoManual?.ativo || false}
                onCheckedChange={(checked) => updateData('recomendacaoManual', { 
                  ...data.recomendacaoManual!, 
                  ativo: !!checked 
                })}
              />
              <div className="flex-1">
                <Label htmlFor="rec-manual-ativo" className="cursor-pointer font-medium">
                  Usar recomendação manual
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Override do cálculo automático baseado na classificação
                </p>
              </div>
            </div>

            {data.recomendacaoManual?.ativo && (
              <>
                <RadioGroup
                  value={data.recomendacaoManual?.categoria || '2'}
                  onValueChange={(v) => updateData('recomendacaoManual', { ...data.recomendacaoManual!, categoria: v })}
                  className="space-y-2"
                >
                  {biradsMGOptions.recomendacaoManual.map((opt) => (
                    <div key={opt.value} className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 ${
                      data.recomendacaoManual?.categoria === opt.value ? 'bg-primary/10 border-primary/50' : ''
                    }`}>
                      <RadioGroupItem value={opt.value} id={`rec-${opt.value}`} />
                      <Label htmlFor={`rec-${opt.value}`} className="cursor-pointer flex-1 text-sm">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Select de lado - para BI-RADS 0 */}
                {selectedRecOpt?.usaLado && (
                  <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
                    <Label className="text-sm font-medium">Mama</Label>
                    <Select
                      value={data.recomendacaoManual?.lado || 'direita'}
                      onValueChange={(v) => updateData('recomendacaoManual', { 
                        ...data.recomendacaoManual!, 
                        lado: v as 'direita' | 'esquerda' | 'bilateral' 
                      })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direita">Direita</SelectItem>
                        <SelectItem value="esquerda">Esquerda</SelectItem>
                        <SelectItem value="bilateral">Bilateral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Select de meses - para BI-RADS 3 */}
                {selectedRecOpt?.usaMeses && (
                  <div className="space-y-2 p-3 rounded-lg border bg-muted/30">
                    <Label className="text-sm font-medium">Controle em</Label>
                    <Select
                      value={data.recomendacaoManual?.mesesControle?.toString() || '6'}
                      onValueChange={(v) => updateData('recomendacaoManual', { 
                        ...data.recomendacaoManual!, 
                        mesesControle: parseInt(v) as 6 | 12 
                      })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 meses</SelectItem>
                        <SelectItem value="12">12 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {/* Preview da recomendação */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <Label className="text-xs text-muted-foreground mb-2 block">
                {data.recomendacaoManual?.ativo ? 'Recomendação manual:' : 'Recomendação automática (BI-RADS ' + biradsCategory + '):'}
              </Label>
              <p className="text-sm whitespace-pre-wrap">{recomendacaoTexto}</p>
            </div>
          </div>
        )

      case 'notas':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <StickyNote size={16} className="text-amber-500" />
              Observações
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <Checkbox
                  id="nota-us-densas"
                  checked={data.notas.densaMamasUS}
                  onCheckedChange={(checked) => updateData('notas', { ...data.notas, densaMamasUS: !!checked })}
                />
                <Label htmlFor="nota-us-densas" className="cursor-pointer text-sm leading-relaxed">
                  A ultrassonografia pode ser útil em mamas densas se houver alterações palpáveis ou se a paciente apresentar risco elevado para câncer de mama.
                </Label>
              </div>

              <div className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <Checkbox
                  id="nota-correlacao"
                  checked={data.notas.densaMamasCorrelacao}
                  onCheckedChange={(checked) => updateData('notas', { ...data.notas, densaMamasCorrelacao: !!checked })}
                />
                <Label htmlFor="nota-correlacao" className="cursor-pointer text-sm leading-relaxed">
                  A mamografia possui baixa sensibilidade em mamas densas. Recomenda-se correlação ultrassonográfica.
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Outra observação</Label>
                <Textarea
                  placeholder="Digite uma observação adicional..."
                  value={data.notas.outraObservacao || ''}
                  onChange={(e) => updateData('notas', { ...data.notas, outraObservacao: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">📷</span>
              ACR BI-RADS® - Mamografia
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-1.5 text-xs">{showPreview ? 'Ocultar' : 'Preview'}</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar de navegação */}
          <div className="w-44 border-r bg-muted/30 p-2 space-y-1 overflow-y-auto shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 280px)' }}>
              {renderTabContent()}
            </div>

            {/* Classificação */}
            <div className="border-t p-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Classificação:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    typeof biradsCategory === 'number' && biradsCategory <= 2 ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                    biradsCategory === 3 ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                    biradsCategory === 0 ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400' :
                    'bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    ACR BI-RADS {biradsCategory}
                  </span>
                </div>
                {categoryInfo && (
                  <span className="text-xs text-muted-foreground">
                    {categoryInfo.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Painel de Preview */}
          {showPreview && (
            <div className="w-72 border-l bg-background flex flex-col shrink-0">
              {/* Header do Preview */}
              <div className="px-3 py-2 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-pink-500" />
                  <span className="text-xs font-medium">Preview do Laudo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Progress value={completeness.percentage} className="w-12 h-1.5" />
                  <span className="text-[10px] text-muted-foreground">
                    {completeness.filled}/{completeness.total}
                  </span>
                </div>
              </div>

              {/* Conteúdo do Preview */}
              <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(90vh - 280px)' }}>
                {/* Título */}
                <h3 className="text-center font-bold text-xs mb-4 uppercase tracking-wide text-foreground">
                  MAMOGRAFIA DIGITAL
                </h3>

                <SectionPreview
                  title="Indicação Clínica"
                  content={indicacaoTexto}
                  hasContent={!!indicacaoTexto && indicacaoTexto.length > 0}
                  isRequired
                />

                <SectionPreview
                  title="Análise"
                  content={achadosTexto}
                  hasContent={!!achadosTexto && achadosTexto.length > 0}
                  isRequired
                />

                {comparativoTexto && (
                  <SectionPreview
                    title="Estudo Comparativo"
                    content={comparativoTexto}
                    hasContent={!!comparativoTexto}
                  />
                )}

                <SectionPreview
                  title="Impressão Diagnóstica"
                  content={impressaoTexto}
                  hasContent={!!impressaoTexto && impressaoTexto.length > 0}
                  isRequired
                />

                <SectionPreview
                  title="Recomendação"
                  content={recomendacaoTexto}
                  hasContent={!!recomendacaoTexto && recomendacaoTexto.length > 0}
                />

                {notasTexto && (
                  <SectionPreview
                    title="Notas"
                    content={notasTexto}
                    hasContent={!!notasTexto}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 pt-2 border-t gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Limpar
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={handleInsertAchados}>
            <FileText size={14} className="mr-1" /> Achados
          </Button>
          <Button variant="outline" size="sm" onClick={handleInsertImpressao}>
            <ClipboardList size={14} className="mr-1" /> Impressão
          </Button>
          <Button size="sm" onClick={handleInsertLaudoCompleto} className="bg-pink-600 hover:bg-pink-700">
            <FileCheck size={14} className="mr-1" /> Laudo Completo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
