import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, Calendar, AlertCircle, FileText, ClipboardList, FileCheck } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BIRADSMGData,
  BIRADSMGNodulo,
  biradsMGOptions,
  biradsCategories,
  evaluateBIRADSMG,
  generateBIRADSMGAchados,
  generateBIRADSMGImpression,
  generateBIRADSMGLaudoCompleto,
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

type TabType = 'parenquima' | 'distorcao' | 'assimetria' | 'nodulos' | 'calcificacoes' | 'linfonodos' | 'recomendacao'

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'parenquima', label: 'Parênquima', icon: '🫁' },
  { id: 'distorcao', label: 'Distorção Arquitetural', icon: '🔀' },
  { id: 'assimetria', label: 'Assimetria', icon: '⚖️' },
  { id: 'nodulos', label: 'Nódulos', icon: '⚪' },
  { id: 'calcificacoes', label: 'Calcificações', icon: '✨' },
  { id: 'linfonodos', label: 'Linfonodos', icon: '🔘' },
  { id: 'recomendacao', label: 'Recomendação', icon: '📋' },
]

export function BIRADSMGModal({ open, onOpenChange, editor }: BIRADSMGModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('parenquima')
  const [data, setData] = useState<BIRADSMGData>(createEmptyBIRADSMGData())

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

  const achadosTexto = useMemo(() => generateBIRADSMGAchados(data), [data])
  const impressaoTexto = useMemo(() => generateBIRADSMGImpression(data, biradsCategory), [data, biradsCategory])
  const laudoCompleto = useMemo(() => generateBIRADSMGLaudoCompleto(data, biradsCategory), [data, biradsCategory])

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
      editor.chain().focus().insertContent(laudoCompleto.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')).run()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setData(createEmptyBIRADSMGData())
    setActiveTab('parenquima')
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
      case 'parenquima':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Padrão do Parênquima Mamário</h3>
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
                <Plus size={14} className="mr-1" /> Adicionar Nódulo
              </Button>
            </div>

            {data.nodulos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum nódulo adicionado.</p>
                <p className="text-sm">Clique em "Adicionar Nódulo" para começar.</p>
              </div>
            )}

            {data.nodulos.map((nodulo, index) => {
              const tempoInfo = getTempoSeguimento(nodulo)
              return (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">N{index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveNodulo(index)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  {/* Comparação temporal */}
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500" />
                      <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">Comparação temporal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`comp-${index}`}
                        checked={nodulo.temComparacao}
                        onCheckedChange={(checked) => updateNodulo(index, 'temComparacao', !!checked)}
                      />
                      <Label htmlFor={`comp-${index}`} className="text-sm cursor-pointer">Comparação disponível</Label>
                    </div>
                    {nodulo.temComparacao && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Data anterior</Label>
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
                        <span>Seguimento: {tempoInfo.texto} {tempoInfo.suficiente ? '(≥2 anos)' : '(<2 anos)'}</span>
                      </div>
                    )}
                  </div>

                  {/* Características */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Densidade</Label>
                      <Select value={nodulo.densidade} onValueChange={(v) => updateNodulo(index, 'densidade', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {biradsMGOptions.densidade.map((opt) => (
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
                          {biradsMGOptions.formaMG.map((opt) => (
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
                          {biradsMGOptions.margensMG.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Lado</Label>
                      <Select value={nodulo.lado} onValueChange={(v) => updateNodulo(index, 'lado', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {biradsMGOptions.ladoMG.filter(o => o.value !== 'bilateral').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Localização</Label>
                      <Select value={nodulo.localizacao} onValueChange={(v) => updateNodulo(index, 'localizacao', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {biradsMGOptions.localizacaoMG.map((opt) => (
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
                        value={formatMeasurement(nodulo.medidas[0])}
                        onChange={(e) => updateMedida(index, 0, e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Y (cm)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={formatMeasurement(nodulo.medidas[1])}
                        onChange={(e) => updateMedida(index, 1, e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Z (cm)</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={formatMeasurement(nodulo.medidas[2])}
                        onChange={(e) => updateMedida(index, 2, e.target.value)}
                        className="h-9"
                      />
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
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>
                  </>
                )}

                {data.calcificacoes.tipo && data.calcificacoes.tipo !== 'suspeitas' && (
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
                )}
              </div>
            )}
          </div>
        )

      case 'linfonodos':
        return (
          <div className="space-y-6">
            {/* Linfonodomegalias */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linf-presente"
                  checked={data.linfonodomegalias.presente}
                  onCheckedChange={(checked) => updateData('linfonodomegalias', { ...data.linfonodomegalias, presente: !!checked })}
                />
                <Label htmlFor="linf-presente" className="font-semibold cursor-pointer">Linfonodomegalias presentes</Label>
              </div>

              {data.linfonodomegalias.presente && (
                <div className="space-y-3 pl-6 border-l-2 border-primary/30">
                  <div className="grid grid-cols-2 gap-3">
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
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Linfonodo intramamário */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linf-intra"
                  checked={data.linfonodoIntramamario.presente}
                  onCheckedChange={(checked) => updateData('linfonodoIntramamario', { ...data.linfonodoIntramamario, presente: !!checked })}
                />
                <Label htmlFor="linf-intra" className="font-semibold cursor-pointer">Linfonodo intramamário</Label>
              </div>

              {data.linfonodoIntramamario.presente && (
                <div className="space-y-3 pl-6 border-l-2 border-primary/30">
                  <div className="space-y-2">
                    <Label className="text-sm">Lado</Label>
                    <Select
                      value={data.linfonodoIntramamario.lado || ''}
                      onValueChange={(v) => updateData('linfonodoIntramamario', { ...data.linfonodoIntramamario, lado: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {biradsMGOptions.ladoMG.filter(o => o.value !== 'bilateral').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'recomendacao':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rec-manual"
                checked={data.recomendacaoManual?.ativo || false}
                onCheckedChange={(checked) => updateData('recomendacaoManual', { ...data.recomendacaoManual, ativo: !!checked, categoria: data.recomendacaoManual?.categoria || '' })}
              />
              <Label htmlFor="rec-manual" className="font-semibold cursor-pointer">Forçar BI-RADS 0 (Inconclusivo)</Label>
            </div>

            {data.recomendacaoManual?.ativo && (
              <div className="space-y-4 pl-6 border-l-2 border-amber-500/30">
                <p className="text-sm text-muted-foreground">
                  Selecione o motivo para classificar como BI-RADS 0 e a recomendação correspondente.
                </p>
                <div className="space-y-2">
                  <Label className="text-sm">Recomendação</Label>
                  <Select
                    value={data.recomendacaoManual.categoria || ''}
                    onValueChange={(v) => updateData('recomendacaoManual', { ...data.recomendacaoManual, ativo: true, categoria: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione a recomendação" /></SelectTrigger>
                    <SelectContent>
                      {biradsMGOptions.recomendacoesBirads0.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <span>🎀</span>
            ACR BI-RADS® - Mamografia
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar com abas */}
          <div className="w-48 border-r bg-muted/30 flex-shrink-0">
            <ScrollArea className="h-full">
              <div className="py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6 py-4">
              {renderTabContent()}
            </ScrollArea>

            {/* Classificação */}
            <div className="px-6 py-4 border-t bg-muted/20">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="mb-2">
                  <span className="text-lg font-bold text-primary">
                    Classificação: ACR BI-RADS {biradsCategory}
                  </span>
                </div>
                {categoryInfo && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{categoryInfo.name}</span>
                    <span>Risco: {categoryInfo.risco}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t gap-2">
          <Button variant="ghost" onClick={handleReset}>
            Limpar
          </Button>
          <Button variant="outline" onClick={handleInsertAchados}>
            <ClipboardList size={14} className="mr-1" />
            Achados
          </Button>
          <Button variant="outline" onClick={handleInsertImpressao}>
            <FileText size={14} className="mr-1" />
            Impressão
          </Button>
          <Button onClick={handleInsertLaudoCompleto}>
            <FileCheck size={14} className="mr-1" />
            Laudo Completo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}