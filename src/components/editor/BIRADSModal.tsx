import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, Calendar, AlertCircle, FileText, ClipboardList, FileCheck, Stethoscope, StickyNote, Eye, EyeOff, Check, Minus, Scissors, Activity, Droplet, Circle, RefreshCw, Shuffle, Gem, Target, LucideIcon, Loader2 } from 'lucide-react'
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
  BIRADSFindingData,
  BIRADSUSGData,
  BIRADSUSGCisto,
  biradsUSGOptions,
  biradsUSGExpandedOptions,
  biradsCategories,
  evaluateBIRADSUSGExpanded,
  generateBIRADSUSGIndicacao,
  generateBIRADSUSGTecnica,
  generateBIRADSUSGAchados,
  generateBIRADSUSGComparativo,
  generateBIRADSUSGImpression,
  generateBIRADSUSGNotas,
  generateBIRADSUSGLaudoCompletoHTML,
  createEmptyBIRADSFinding,
  createEmptyBIRADSUSGData,
  createEmptyBIRADSUSGCisto,
  formatMeasurement,
  calcularTempoSeguimento,
  formatarTempoSeguimento,
} from '@/lib/radsClassifications'
import { useRADSOptions } from '@/hooks/useRADSOptions'

interface BIRADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'indicacao' | 'cirurgia' | 'parenquima' | 'cisto' | 'nodulo' | 'ectasia' | 'distorcao' | 'implante' | 'linfonodo' | 'comparativo' | 'notas'

const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'indicacao', label: 'Indicação', icon: ClipboardList },
  { id: 'cirurgia', label: 'Cirurgias', icon: Scissors },
  { id: 'parenquima', label: 'Parênquima', icon: Activity },
  { id: 'cisto', label: 'Cistos', icon: Droplet },
  { id: 'nodulo', label: 'Nódulos', icon: Circle },
  { id: 'ectasia', label: 'Ectasia Ductal', icon: RefreshCw },
  { id: 'distorcao', label: 'Distorção', icon: Shuffle },
  { id: 'implante', label: 'Implante', icon: Gem },
  { id: 'linfonodo', label: 'Linfonodos', icon: Target },
  { id: 'comparativo', label: 'Comparativo', icon: Calendar },
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

export function BIRADSModal({ open, onOpenChange, editor }: BIRADSModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('indicacao')
  const [data, setData] = useState<BIRADSUSGData>(createEmptyBIRADSUSGData())
  const [showPreview, setShowPreview] = useState(true)

  // Fetch dynamic options from database (for future use)
  const { data: dbOptions, isLoading } = useRADSOptions('BIRADS_USG')
  
  // Note: Currently using hardcoded options for compatibility
  // Database options available via dbOptions for gradual migration

  const updateData = <K extends keyof BIRADSUSGData>(field: K, value: BIRADSUSGData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // Cistos handlers
  const handleAddCisto = () => {
    if (data.cistos.length < 6) {
      setData(prev => ({ ...prev, cistos: [...prev.cistos, createEmptyBIRADSUSGCisto()], cistosPresente: 'presente' }))
    }
  }

  const handleRemoveCisto = (index: number) => {
    setData(prev => {
      const newCistos = prev.cistos.filter((_, i) => i !== index)
      return { ...prev, cistos: newCistos, cistosPresente: newCistos.length > 0 ? 'presente' : 'ausencia' }
    })
  }

  const updateCisto = (index: number, field: keyof BIRADSUSGCisto, value: any) => {
    setData(prev => {
      const newCistos = [...prev.cistos]
      ;(newCistos[index] as any)[field] = value
      return { ...prev, cistos: newCistos }
    })
  }

  // Nódulos handlers
  const handleAddNodulo = () => {
    if (data.nodulos.length < 6) {
      setData(prev => ({ ...prev, nodulos: [...prev.nodulos, createEmptyBIRADSFinding()], nodulosPresente: 'presente' }))
    }
  }

  const handleRemoveNodulo = (index: number) => {
    setData(prev => {
      const newNodulos = prev.nodulos.filter((_, i) => i !== index)
      return { ...prev, nodulos: newNodulos, nodulosPresente: newNodulos.length > 0 ? 'presente' : 'ausencia' }
    })
  }

  const updateNodulo = (index: number, field: keyof BIRADSFindingData, value: any) => {
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

  const biradsCategory = useMemo(() => evaluateBIRADSUSGExpanded(data), [data])
  const categoryInfo = biradsCategories.find(c => c.value === biradsCategory || c.value.toString() === biradsCategory.toString())

  const indicacaoTexto = useMemo(() => generateBIRADSUSGIndicacao(data), [data])
  const tecnicaTexto = useMemo(() => generateBIRADSUSGTecnica(), [])
  const achadosTexto = useMemo(() => generateBIRADSUSGAchados(data), [data])
  const comparativoTexto = useMemo(() => generateBIRADSUSGComparativo(data), [data])
  const impressaoTexto = useMemo(() => generateBIRADSUSGImpression(data, biradsCategory), [data, biradsCategory])
  const notasTexto = useMemo(() => generateBIRADSUSGNotas(data), [data])

  // Cálculo de completude
  const completeness = useMemo(() => {
    let filled = 0
    const total = 11

    if (data.indicacao.tipo) filled++
    filled++ // cirurgia sempre preenchida
    filled++ // parênquima sempre preenchida
    filled++ // cistos sempre preenchida
    filled++ // nódulos sempre preenchida
    filled++ // ectasia sempre preenchida
    filled++ // distorção sempre preenchida
    filled++ // implante sempre preenchida
    filled++ // linfonodos sempre preenchida
    filled++ // comparativo sempre preenchida
    filled++ // notas sempre preenchida

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
      editor.chain()
        .focus()
        .selectAll()
        .deleteSelection()
        .insertContent(generateBIRADSUSGLaudoCompletoHTML(data, biradsCategory))
        .run()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setData(createEmptyBIRADSUSGData())
    setActiveTab('indicacao')
  }

  const getTempoSeguimento = (nodulo: BIRADSFindingData) => {
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
              value={data.indicacao.tipo || ''}
              onValueChange={(v) => updateData('indicacao', { tipo: v as any })}
              className="space-y-2"
            >
              {biradsUSGExpandedOptions.tipoIndicacao.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`ind-${opt.value}`} />
                  <Label htmlFor={`ind-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'cirurgia':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Antecedentes Cirúrgicos</h3>
            
            <RadioGroup
              value={data.cirurgia.tipo}
              onValueChange={(v) => updateData('cirurgia', { ...data.cirurgia, tipo: v as any })}
              className="space-y-2"
            >
              {biradsUSGExpandedOptions.tipoCirurgia.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`cir-${opt.value}`} />
                  <Label htmlFor={`cir-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {data.cirurgia.tipo !== 'sem_cirurgias' && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Lado</Label>
                  <Select
                    value={data.cirurgia.lado || ''}
                    onValueChange={(v) => updateData('cirurgia', { ...data.cirurgia, lado: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direita">Direita</SelectItem>
                      <SelectItem value="esquerda">Esquerda</SelectItem>
                      <SelectItem value="bilateral">Bilateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {data.cirurgia.tipo === 'mastectomia' && (
                  <div className="space-y-2">
                    <Label className="text-sm">Reconstrução</Label>
                    <Select
                      value={data.cirurgia.reconstrucao || undefined}
                      onValueChange={(v) => updateData('cirurgia', { ...data.cirurgia, reconstrucao: v as any })}
                    >
                      <SelectTrigger><SelectValue placeholder="Sem reconstrução" /></SelectTrigger>
                      <SelectContent>
                        {biradsUSGExpandedOptions.tipoReconstrucao.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 'parenquima':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Parênquima Mamário</h3>
            
            <RadioGroup
              value={data.parenquima.tipo}
              onValueChange={(v) => updateData('parenquima', { ...data.parenquima, tipo: v as any })}
              className="space-y-2"
            >
              {biradsUSGExpandedOptions.parenquima.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`par-${opt.value}`} />
                  <Label htmlFor={`par-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm">Ecotextura</Label>
              <RadioGroup
                value={data.parenquima.ecotextura}
                onValueChange={(v) => updateData('parenquima', { ...data.parenquima, ecotextura: v as any })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="eco-normal" />
                  <Label htmlFor="eco-normal" className="cursor-pointer">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alterada" id="eco-alterada" />
                  <Label htmlFor="eco-alterada" className="cursor-pointer">Alterada</Label>
                </div>
              </RadioGroup>
              
              {data.parenquima.ecotextura === 'alterada' && (
                <Input
                  placeholder="Descreva as alterações"
                  value={data.parenquima.ecotexturaDesc}
                  onChange={(e) => updateData('parenquima', { ...data.parenquima, ecotexturaDesc: e.target.value })}
                  className="h-9"
                />
              )}
            </div>
          </div>
        )

      case 'cisto':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Cistos</h3>
              <Button variant="outline" size="sm" onClick={handleAddCisto} disabled={data.cistos.length >= 6}>
                <Plus size={14} className="mr-1" /> Adicionar Cisto
              </Button>
            </div>

            {data.cistos.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground border rounded-lg bg-muted/30">
                <p className="text-sm">Nenhum cisto identificado</p>
                <p className="text-xs mt-1">Clique em "Adicionar Cisto" se houver cistos</p>
              </div>
            ) : (
              data.cistos.map((cisto, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Cisto {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveCisto(index)} className="h-8 w-8 p-0 text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tipo</Label>
                      <Select value={cisto.tipo} onValueChange={(v) => updateCisto(index, 'tipo', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {biradsUSGExpandedOptions.tipoCisto.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Quantidade</Label>
                      <Select value={cisto.quantidade} onValueChange={(v) => updateCisto(index, 'quantidade', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="um">Único</SelectItem>
                          <SelectItem value="multiplos">Múltiplos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Lado</Label>
                      <Select value={cisto.lado} onValueChange={(v) => updateCisto(index, 'lado', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {biradsUSGOptions.lado.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Localização</Label>
                      <Select value={cisto.localizacao} onValueChange={(v) => updateCisto(index, 'localizacao', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {biradsUSGOptions.localizacao.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">X (cm)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={formatMeasurement(cisto.medidas[0])}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(',', '.')) || 0
                          const newMedidas: [number, number, number] = [...cisto.medidas]
                          newMedidas[0] = val
                          updateCisto(index, 'medidas', newMedidas)
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Y (cm)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={formatMeasurement(cisto.medidas[1])}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(',', '.')) || 0
                          const newMedidas: [number, number, number] = [...cisto.medidas]
                          newMedidas[1] = val
                          updateCisto(index, 'medidas', newMedidas)
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Z (cm)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={formatMeasurement(cisto.medidas[2])}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value.replace(',', '.')) || 0
                          const newMedidas: [number, number, number] = [...cisto.medidas]
                          newMedidas[2] = val
                          updateCisto(index, 'medidas', newMedidas)
                        }}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )

      case 'nodulo':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Nódulos</h3>
              <Button variant="outline" size="sm" onClick={handleAddNodulo} disabled={data.nodulos.length >= 6}>
                <Plus size={14} className="mr-1" /> Adicionar Nódulo
              </Button>
            </div>

            {data.nodulos.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground border rounded-lg bg-muted/30">
                <p className="text-sm">Nenhum nódulo identificado</p>
                <p className="text-xs mt-1">Clique em "Adicionar Nódulo" se houver nódulos</p>
              </div>
            ) : (
              data.nodulos.map((nodulo, index) => {
                const tempoInfo = getTempoSeguimento(nodulo)
                return (
                  <div key={index} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">N{index + 1}</h4>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveNodulo(index)} className="h-8 w-8 p-0 text-destructive">
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    {/* Comparação */}
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Comparação com exame anterior</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`comp-${index}`}
                          checked={nodulo.temComparacao}
                          onCheckedChange={(checked) => updateNodulo(index, 'temComparacao', !!checked)}
                        />
                        <Label htmlFor={`comp-${index}`} className="text-sm cursor-pointer">Disponível comparação</Label>
                      </div>
                      {nodulo.temComparacao && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Data exame anterior</Label>
                            <Input
                              type="date"
                              value={nodulo.dataExameAnterior || ''}
                              onChange={(e) => updateNodulo(index, 'dataExameAnterior', e.target.value || null)}
                              className="h-9"
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Estado</Label>
                            <Select value={nodulo.estadoNodulo} onValueChange={(v) => updateNodulo(index, 'estadoNodulo', v)}>
                              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="estavel">Estável</SelectItem>
                                <SelectItem value="cresceu">Cresceu</SelectItem>
                                <SelectItem value="diminuiu">Diminuiu</SelectItem>
                                <SelectItem value="novo">Novo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {tempoInfo && (
                        <div className={`flex items-center gap-2 text-xs ${tempoInfo.suficiente ? 'text-green-600' : 'text-amber-600'}`}>
                          {tempoInfo.suficiente ? <span>✓</span> : <AlertCircle size={12} />}
                          <span>Seguimento: {tempoInfo.texto}</span>
                        </div>
                      )}
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ecogenicidade</Label>
                        <Select value={nodulo.ecogenicidade} onValueChange={(v) => updateNodulo(index, 'ecogenicidade', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.ecogenicidade.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Forma</Label>
                        <Select value={nodulo.forma} onValueChange={(v) => updateNodulo(index, 'forma', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.forma.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Margens</Label>
                        <Select value={nodulo.margens} onValueChange={(v) => updateNodulo(index, 'margens', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.margens.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Eixo</Label>
                        <Select value={nodulo.eixo} onValueChange={(v) => updateNodulo(index, 'eixo', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.eixo.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Sombra</Label>
                        <Select value={nodulo.sombra} onValueChange={(v) => updateNodulo(index, 'sombra', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.sombra.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Localização</Label>
                        <Select value={nodulo.localizacao} onValueChange={(v) => updateNodulo(index, 'localizacao', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.localizacao.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Lado</Label>
                        <Select value={nodulo.lado} onValueChange={(v) => updateNodulo(index, 'lado', v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {biradsUSGOptions.lado.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">X (cm)</Label>
                        <Input type="text" inputMode="decimal" value={formatMeasurement(nodulo.medidas[0])} onChange={(e) => updateMedida(index, 0, e.target.value)} className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Y (cm)</Label>
                        <Input type="text" inputMode="decimal" value={formatMeasurement(nodulo.medidas[1])} onChange={(e) => updateMedida(index, 1, e.target.value)} className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Z (cm)</Label>
                        <Input type="text" inputMode="decimal" value={formatMeasurement(nodulo.medidas[2])} onChange={(e) => updateMedida(index, 2, e.target.value)} className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Pele</Label>
                        <Input type="text" inputMode="decimal" value={formatMeasurement(nodulo.distPele)} onChange={(e) => updateNodulo(index, 'distPele', parseFloat(e.target.value.replace(',', '.')) || 0)} className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Papila</Label>
                        <Input type="text" inputMode="decimal" value={formatMeasurement(nodulo.distPapila)} onChange={(e) => updateNodulo(index, 'distPapila', parseFloat(e.target.value.replace(',', '.')) || 0)} className="h-9" />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )

      case 'ectasia':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ectasia-presente"
                checked={data.ectasiaDuctal.presente}
                onCheckedChange={(checked) => updateData('ectasiaDuctal', { ...data.ectasiaDuctal, presente: !!checked })}
              />
              <Label htmlFor="ectasia-presente" className="font-semibold cursor-pointer">Ectasia ductal presente</Label>
            </div>

            {data.ectasiaDuctal.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Lado</Label>
                    <Select value={data.ectasiaDuctal.lado} onValueChange={(v) => updateData('ectasiaDuctal', { ...data.ectasiaDuctal, lado: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.lado.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Localização</Label>
                    <Select value={data.ectasiaDuctal.localizacao} onValueChange={(v) => updateData('ectasiaDuctal', { ...data.ectasiaDuctal, localizacao: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.localizacao.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Calibre (mm)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={data.ectasiaDuctal.calibre > 0 ? formatMeasurement(data.ectasiaDuctal.calibre) : ''}
                    onChange={(e) => updateData('ectasiaDuctal', { ...data.ectasiaDuctal, calibre: parseFloat(e.target.value.replace(',', '.')) || 0 })}
                    className="h-9 w-32"
                    placeholder="Ex: 3,0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Conteúdo</Label>
                  <RadioGroup
                    value={data.ectasiaDuctal.conteudo}
                    onValueChange={(v) => updateData('ectasiaDuctal', { ...data.ectasiaDuctal, conteudo: v as any })}
                    className="flex gap-4"
                  >
                    {biradsUSGExpandedOptions.ectasiaConteudo.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`ect-${opt.value}`} />
                        <Label htmlFor={`ect-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
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
                  <RadioGroup
                    value={data.distorcaoArquitetural.tipo}
                    onValueChange={(v) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, tipo: v as any })}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="sitio_cirurgico" id="dist-sitio" />
                      <Label htmlFor="dist-sitio" className="cursor-pointer">Em sítio cirúrgico</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 border-amber-500/30 bg-amber-500/5">
                      <RadioGroupItem value="fora_sitio" id="dist-fora" />
                      <Label htmlFor="dist-fora" className="cursor-pointer">Fora de sítio cirúrgico (suspeito)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Lado</Label>
                    <Select value={data.distorcaoArquitetural.lado} onValueChange={(v) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, lado: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direita">Direita</SelectItem>
                        <SelectItem value="esquerda">Esquerda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Região (opcional)</Label>
                    <Input
                      value={data.distorcaoArquitetural.localizacao}
                      onChange={(e) => updateData('distorcaoArquitetural', { ...data.distorcaoArquitetural, localizacao: e.target.value })}
                      placeholder="Ex: quadrante súpero-lateral"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'implante':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="implante-presente"
                checked={data.implanteMamario.presente}
                onCheckedChange={(checked) => updateData('implanteMamario', { ...data.implanteMamario, presente: !!checked })}
              />
              <Label htmlFor="implante-presente" className="font-semibold cursor-pointer">Implantes mamários presentes</Label>
            </div>

            {data.implanteMamario.presente && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Posição</Label>
                  <RadioGroup
                    value={data.implanteMamario.posicao}
                    onValueChange={(v) => updateData('implanteMamario', { ...data.implanteMamario, posicao: v as any })}
                    className="flex gap-4"
                  >
                    {biradsUSGExpandedOptions.implantePosicao.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`imp-${opt.value}`} />
                        <Label htmlFor={`imp-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Integridade</Label>
                  <RadioGroup
                    value={data.implanteMamario.integridade}
                    onValueChange={(v) => updateData('implanteMamario', { ...data.implanteMamario, integridade: v as any })}
                    className="space-y-2"
                  >
                    {biradsUSGExpandedOptions.implanteIntegridade.map((opt) => (
                      <div key={opt.value} className={`flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 ${opt.value !== 'integros' ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
                        <RadioGroupItem value={opt.value} id={`int-${opt.value}`} />
                        <Label htmlFor={`int-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {data.implanteMamario.integridade !== 'integros' && (
                  <div className="space-y-2">
                    <Label className="text-sm">Lado afetado</Label>
                    <Select value={data.implanteMamario.lado || ''} onValueChange={(v) => updateData('implanteMamario', { ...data.implanteMamario, lado: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direita">Direita</SelectItem>
                        <SelectItem value="esquerda">Esquerda</SelectItem>
                        <SelectItem value="bilateral">Bilateral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">Observações sobre silicone (opcional)</Label>
                  <Input
                    value={data.implanteMamario.siliconeDesc}
                    onChange={(e) => updateData('implanteMamario', { ...data.implanteMamario, siliconeDesc: e.target.value })}
                    placeholder="Ex: sinais de siliconoma"
                    className="h-9"
                  />
                </div>
              </div>
            )}
          </div>
        )

      case 'linfonodo':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Linfonodos Axilares</h3>
            
            <RadioGroup
              value={data.linfonodomegalia.tipo}
              onValueChange={(v) => updateData('linfonodomegalia', { ...data.linfonodomegalia, tipo: v as any })}
              className="space-y-2"
            >
              {biradsUSGExpandedOptions.linfonodomegalia.map((opt) => (
                <div key={opt.value} className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 ${opt.value === 'perda_padrao' ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
                  <RadioGroupItem value={opt.value} id={`linf-${opt.value}`} />
                  <Label htmlFor={`linf-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {data.linfonodomegalia.tipo === 'perda_padrao' && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Lado</Label>
                  <Select value={data.linfonodomegalia.lado} onValueChange={(v) => updateData('linfonodomegalia', { ...data.linfonodomegalia, lado: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direita">Direita</SelectItem>
                      <SelectItem value="esquerda">Esquerda</SelectItem>
                      <SelectItem value="bilateral">Bilateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Descrição (opcional)</Label>
                  <Input
                    value={data.linfonodomegalia.descricao}
                    onChange={(e) => updateData('linfonodomegalia', { ...data.linfonodomegalia, descricao: e.target.value })}
                    placeholder="Ex: espessamento cortical excêntrico"
                    className="h-9"
                  />
                </div>
              </div>
            )}
          </div>
        )

      case 'comparativo':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Estudo Comparativo</h3>
            
            <RadioGroup
              value={data.comparativo.tipo}
              onValueChange={(v) => updateData('comparativo', { ...data.comparativo, tipo: v as any })}
              className="space-y-2"
            >
              {biradsUSGExpandedOptions.comparativoTipo.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`comp-${opt.value}`} />
                  <Label htmlFor={`comp-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {data.comparativo.tipo === 'disponivel' && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                <div className="space-y-2">
                  <Label className="text-sm">Data do exame anterior</Label>
                  <Input
                    type="date"
                    value={data.comparativo.dataExame || ''}
                    onChange={(e) => updateData('comparativo', { ...data.comparativo, dataExame: e.target.value || null })}
                    className="h-9 w-48"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Evolução</Label>
                  <Select value={data.comparativo.evolucao} onValueChange={(v) => updateData('comparativo', { ...data.comparativo, evolucao: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {biradsUSGExpandedOptions.comparativoEvolucao.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
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
                  id="nota-mamografia"
                  checked={data.notas.correlacaoMamografia}
                  onCheckedChange={(checked) => updateData('notas', { ...data.notas, correlacaoMamografia: !!checked })}
                />
                <Label htmlFor="nota-mamografia" className="cursor-pointer text-sm leading-relaxed">
                  A ultrassonografia mamária não substitui a mamografia. Recomenda-se correlação mamográfica conforme indicação clínica.
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Outra observação</Label>
                <Textarea
                  placeholder="Digite uma observação adicional..."
                  value={data.notas.outraObservacao}
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
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">🎀</span>
              ACR BI-RADS® - Ultrassonografia Mamária
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
          <div className="w-40 border-r bg-muted/30 p-2 space-y-1 overflow-y-auto shrink-0">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <IconComponent size={14} className="opacity-70 shrink-0" />
                  <span className="truncate text-xs">{tab.label}</span>
                </button>
              )
            })}
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
                  ULTRASSONOGRAFIA DAS MAMAS
                </h3>

                <SectionPreview
                  title="Indicação Clínica"
                  content={indicacaoTexto}
                  hasContent={!!indicacaoTexto && indicacaoTexto.length > 0}
                  isRequired
                />

                <SectionPreview
                  title="Técnica"
                  content={tecnicaTexto}
                  hasContent
                />

                <SectionPreview
                  title="Achados"
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