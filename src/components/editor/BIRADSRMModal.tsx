import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, Calendar, AlertCircle, FileText, ClipboardList, FileCheck, Stethoscope, StickyNote, History, Eye, EyeOff, Check, Minus, Activity, Circle, Target, Loader2, Magnet, Waves, TrendingUp, Info, LucideIcon } from 'lucide-react'
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
  BIRADSRMData,
  BIRADSRMMassa,
  BIRADSRMNME,
  biradsCategories,
  evaluateBIRADSRM,
  generateBIRADSRMAchados,
  generateBIRADSRMImpressao,
  generateBIRADSRMLaudoCompletoHTML,
  generateBIRADSRMRecomendacao,
  generateBIRADSRMIndicacao,
  generateBIRADSRMComparativo,
  generateBIRADSRMNotas,
  createEmptyBIRADSRMMassa,
  createEmptyBIRADSRMNME,
  createEmptyBIRADSRMData,
  formatMeasurement,
  ACR_BIRADS_RM_REFERENCE,
} from '@/lib/biradsRMClassifications'
import { useRADSOptions, RADSOption } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback } from '@/lib/radsOptionsProvider'

interface BIRADSRMModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'indicacao' | 'background' | 'tecnica' | 'focos' | 'massas' | 'nme' | 'adicionais' | 'comparativo' | 'recomendacao' | 'notas'

const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'indicacao', label: 'Indicação', icon: ClipboardList },
  { id: 'background', label: 'Background', icon: Activity },
  { id: 'tecnica', label: 'Técnica', icon: Magnet },
  { id: 'focos', label: 'Focos', icon: Target },
  { id: 'massas', label: 'Massas', icon: Circle },
  { id: 'nme', label: 'NME', icon: Waves },
  { id: 'adicionais', label: 'Adicionais', icon: Info },
  { id: 'comparativo', label: 'Comparativo', icon: Calendar },
  { id: 'recomendacao', label: 'Recomendação', icon: FileCheck },
  { id: 'notas', label: 'Notas', icon: FileText },
]

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

export function BIRADSRMModal({ open, onOpenChange, editor }: BIRADSRMModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('indicacao')
  const [data, setData] = useState<BIRADSRMData>(createEmptyBIRADSRMData())
  const [showPreview, setShowPreview] = useState(true)

  const { data: dbOptions, isLoading, isError } = useRADSOptions('BIRADS_RM')
  
  const options = useMemo(() => 
    getRADSOptionsWithFallback('BIRADS_RM', dbOptions, isLoading, isError),
    [dbOptions, isLoading, isError]
  )

  const getOpts = (categoria: string): RADSOption[] => options[categoria] || []

  const updateData = <K extends keyof BIRADSRMData>(field: K, value: BIRADSRMData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // Massa handlers
  const handleAddMassa = () => {
    if (data.massas.length < 6) {
      setData(prev => ({ ...prev, massas: [...prev.massas, createEmptyBIRADSRMMassa()] }))
    }
  }

  const handleRemoveMassa = (index: number) => {
    setData(prev => ({ ...prev, massas: prev.massas.filter((_, i) => i !== index) }))
  }

  const updateMassa = (index: number, field: keyof BIRADSRMMassa, value: any) => {
    setData(prev => {
      const newMassas = [...prev.massas]
      ;(newMassas[index] as any)[field] = value
      return { ...prev, massas: newMassas }
    })
  }

  const updateMedida = (massaIndex: number, medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => {
      const newMassas = [...prev.massas]
      newMassas[massaIndex].medidas[medidaIndex] = numValue
      return { ...prev, massas: newMassas }
    })
  }

  // NME handlers
  const handleAddNME = () => {
    if (data.nmes.length < 3) {
      setData(prev => ({ ...prev, nmes: [...prev.nmes, { ...createEmptyBIRADSRMNME(), presente: true }] }))
    }
  }

  const handleRemoveNME = (index: number) => {
    setData(prev => ({ ...prev, nmes: prev.nmes.filter((_, i) => i !== index) }))
  }

  const updateNME = (index: number, field: keyof BIRADSRMNME, value: any) => {
    setData(prev => {
      const newNMEs = [...prev.nmes]
      ;(newNMEs[index] as any)[field] = value
      return { ...prev, nmes: newNMEs }
    })
  }

  // Foco handlers
  const handleAddFoco = () => {
    if (data.focos.length < 4) {
      setData(prev => ({ ...prev, focos: [...prev.focos, { presente: true, localizacao: 'qse_10h', lado: 'direita' }] }))
    }
  }

  const handleRemoveFoco = (index: number) => {
    setData(prev => ({ ...prev, focos: prev.focos.filter((_, i) => i !== index) }))
  }

  const biradsCategory = useMemo(() => evaluateBIRADSRM(data, options), [data, options])
  const categoryInfo = biradsCategories.find(c => c.value === biradsCategory || c.value.toString() === biradsCategory.toString())

  const indicacaoTexto = useMemo(() => generateBIRADSRMIndicacao(data, options), [data, options])
  const achadosTexto = useMemo(() => generateBIRADSRMAchados(data, options), [data, options])
  const impressaoTexto = useMemo(() => generateBIRADSRMImpressao(data, biradsCategory, options), [data, biradsCategory, options])
  const recomendacaoTexto = useMemo(() => generateBIRADSRMRecomendacao(data, biradsCategory, options), [data, biradsCategory, options])
  const comparativoTexto = useMemo(() => generateBIRADSRMComparativo(data, options), [data, options])
  const notasTexto = useMemo(() => generateBIRADSRMNotas(data, options), [data, options])

  const completeness = useMemo(() => {
    let filled = 0
    const total = 10
    if (data.indicacao) filled++
    if (data.composicaoParenquima) filled++
    if (data.bpe) filled++
    filled++ // tecnica sempre preenchida
    filled++ // focos
    filled++ // massas
    filled++ // nme
    filled++ // adicionais
    filled++ // comparativo
    filled++ // recomendação
    return { filled, total, percentage: Math.round((filled / total) * 100) }
  }, [data])

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
        .insertContent(generateBIRADSRMLaudoCompletoHTML(data, biradsCategory, options))
        .run()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setData(createEmptyBIRADSRMData())
    setActiveTab('indicacao')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'indicacao':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Stethoscope size={16} className="text-purple-500" />
              Indicação Clínica
            </h3>
            
            <RadioGroup
              value={data.indicacao}
              onValueChange={(v) => updateData('indicacao', v)}
              className="space-y-2"
            >
              {getOpts('indicacao').map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`ind-${opt.value}`} />
                  <Label htmlFor={`ind-${opt.value}`} className="cursor-pointer flex-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <Label className="text-sm">Informações adicionais</Label>
              <Textarea
                placeholder="Outras informações clínicas relevantes..."
                value={data.indicacaoOutras || ''}
                onChange={(e) => updateData('indicacaoOutras', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )

      case 'background':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Composição do Parênquima (ACR)</h3>
            
            <RadioGroup
              value={data.composicaoParenquima}
              onValueChange={(v) => updateData('composicaoParenquima', v)}
              className="space-y-2"
            >
              {getOpts('composicaoParenquima').map((opt) => (
                <div key={opt.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`par-${opt.value}`} className="mt-0.5" />
                  <Label htmlFor={`par-${opt.value}`} className="cursor-pointer flex-1">
                    <span className="font-medium">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{opt.texto}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Separator />

            <h3 className="font-semibold text-sm">BPE - Background Parenchymal Enhancement</h3>
            
            <RadioGroup
              value={data.bpe}
              onValueChange={(v) => updateData('bpe', v)}
              className="grid grid-cols-2 gap-2"
            >
              {getOpts('bpe').map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`bpe-${opt.value}`} />
                  <Label htmlFor={`bpe-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'tecnica':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Magnet size={16} className="text-blue-500" />
              Técnica do Exame
            </h3>

            <div className="space-y-2">
              <Label className="text-sm">Campo Magnético</Label>
              <RadioGroup
                value={data.campoMagnetico}
                onValueChange={(v) => updateData('campoMagnetico', v as '1.5T' | '3.0T')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1.5T" id="campo-15" />
                  <Label htmlFor="campo-15" className="cursor-pointer">1,5T</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3.0T" id="campo-30" />
                  <Label htmlFor="campo-30" className="cursor-pointer">3,0T</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bobina"
                checked={data.bobinaDedicada}
                onCheckedChange={(checked) => updateData('bobinaDedicada', !!checked)}
              />
              <Label htmlFor="bobina" className="cursor-pointer">Bobina dedicada para mama</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="contraste"
                checked={data.contrastado}
                onCheckedChange={(checked) => updateData('contrastado', !!checked)}
              />
              <Label htmlFor="contraste" className="cursor-pointer">Estudo dinâmico com contraste (gadolínio)</Label>
            </div>
          </div>
        )

      case 'focos':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Target size={16} className="text-yellow-500" />
                Focos de Realce
              </h3>
              <Button variant="outline" size="sm" onClick={handleAddFoco} disabled={data.focos.length >= 4}>
                <Plus size={14} className="mr-1" /> Adicionar
              </Button>
            </div>

            {data.focos.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Sem focos de realce identificados.</p>
            ) : (
              data.focos.map((foco, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Foco {idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFoco(idx)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Lado</Label>
                      <Select
                        value={foco.lado}
                        onValueChange={(v) => {
                          const newFocos = [...data.focos]
                          newFocos[idx].lado = v as 'direita' | 'esquerda'
                          updateData('focos', newFocos)
                        }}
                      >
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direita">Mama direita</SelectItem>
                          <SelectItem value="esquerda">Mama esquerda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Localização</Label>
                      <Select
                        value={foco.localizacao}
                        onValueChange={(v) => {
                          const newFocos = [...data.focos]
                          newFocos[idx].localizacao = v
                          updateData('focos', newFocos)
                        }}
                      >
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('localizacao').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )

      case 'massas':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Circle size={16} className="text-red-500" />
                Massas
              </h3>
              <Button variant="outline" size="sm" onClick={handleAddMassa} disabled={data.massas.length >= 6}>
                <Plus size={14} className="mr-1" /> Adicionar
              </Button>
            </div>

            {data.massas.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Sem massas identificadas.</p>
            ) : (
              data.massas.map((massa, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Massa {idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMassa(idx)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Forma</Label>
                      <Select value={massa.forma} onValueChange={(v) => updateMassa(idx, 'forma', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('massaForma').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Margens</Label>
                      <Select value={massa.margens} onValueChange={(v) => updateMassa(idx, 'margens', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('massaMargens').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Realce Interno</Label>
                      <Select value={massa.realceInterno} onValueChange={(v) => updateMassa(idx, 'realceInterno', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('massaRealceInterno').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Lado</Label>
                      <Select value={massa.lado} onValueChange={(v) => updateMassa(idx, 'lado', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direita">Mama direita</SelectItem>
                          <SelectItem value="esquerda">Mama esquerda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Localização</Label>
                    <Select value={massa.localizacao} onValueChange={(v) => updateMassa(idx, 'localizacao', v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {getOpts('localizacao').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Medidas (cm)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {massa.medidas.map((m, mIdx) => (
                        <Input
                          key={mIdx}
                          type="text"
                          value={m.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                          onChange={(e) => updateMedida(idx, mIdx, e.target.value)}
                          className="h-9 text-center"
                          placeholder={['A', 'B', 'C'][mIdx]}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Cinética - Fase Inicial</Label>
                      <Select value={massa.cineticaInicial} onValueChange={(v) => updateMassa(idx, 'cineticaInicial', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('cineticaFaseInicial').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cinética - Fase Tardia</Label>
                      <Select value={massa.cineticaTardia} onValueChange={(v) => updateMassa(idx, 'cineticaTardia', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('cineticaFaseTardia').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`comp-${idx}`}
                      checked={massa.temComparacao}
                      onCheckedChange={(checked) => updateMassa(idx, 'temComparacao', !!checked)}
                    />
                    <Label htmlFor={`comp-${idx}`} className="cursor-pointer text-sm">Tem estudo comparativo</Label>
                  </div>

                  {massa.temComparacao && (
                    <div className="grid grid-cols-2 gap-3 pl-6 border-l-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Data exame anterior</Label>
                        <Input
                          type="date"
                          value={massa.dataExameAnterior || ''}
                          onChange={(e) => updateMassa(idx, 'dataExameAnterior', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Estado</Label>
                        <Select value={massa.estadoMassa} onValueChange={(v) => updateMassa(idx, 'estadoMassa', v)}>
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
                </div>
              ))
            )}
          </div>
        )

      case 'nme':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Waves size={16} className="text-blue-500" />
                Realce Não Nodular (NME)
              </h3>
              <Button variant="outline" size="sm" onClick={handleAddNME} disabled={data.nmes.length >= 3}>
                <Plus size={14} className="mr-1" /> Adicionar
              </Button>
            </div>

            {data.nmes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Sem realce não nodular identificado.</p>
            ) : (
              data.nmes.map((nme, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">NME {idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveNME(idx)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Distribuição</Label>
                      <Select value={nme.distribuicao} onValueChange={(v) => updateNME(idx, 'distribuicao', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('nmeDistribuicao').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Padrão Interno</Label>
                      <Select value={nme.padraoInterno} onValueChange={(v) => updateNME(idx, 'padraoInterno', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('nmePadraoInterno').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Lado</Label>
                      <Select value={nme.lado} onValueChange={(v) => updateNME(idx, 'lado', v as 'direita' | 'esquerda')}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direita">Mama direita</SelectItem>
                          <SelectItem value="esquerda">Mama esquerda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Extensão (cm)</Label>
                      <Input
                        type="text"
                        value={nme.extensao.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        onChange={(e) => updateNME(idx, 'extensao', parseFloat(e.target.value.replace(',', '.')) || 0)}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Localização</Label>
                    <Select value={nme.localizacao} onValueChange={(v) => updateNME(idx, 'localizacao', v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {getOpts('localizacao').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Cinética - Fase Inicial</Label>
                      <Select value={nme.cineticaInicial} onValueChange={(v) => updateNME(idx, 'cineticaInicial', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('cineticaFaseInicial').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cinética - Fase Tardia</Label>
                      <Select value={nme.cineticaTardia} onValueChange={(v) => updateNME(idx, 'cineticaTardia', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOpts('cineticaFaseTardia').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )

      case 'adicionais':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Achados Adicionais</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cisto"
                  checked={data.achadosAdicionais.cistoSimples}
                  onCheckedChange={(checked) => updateData('achadosAdicionais', { ...data.achadosAdicionais, cistoSimples: !!checked })}
                />
                <Label htmlFor="cisto" className="cursor-pointer">Cisto(s) simples</Label>
              </div>

              <Separator />

              <h4 className="font-medium text-sm">Linfonodos</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="linf-reac"
                    checked={data.achadosAdicionais.linfonodoReacional}
                    onCheckedChange={(checked) => updateData('achadosAdicionais', { ...data.achadosAdicionais, linfonodoReacional: !!checked })}
                  />
                  <Label htmlFor="linf-reac" className="cursor-pointer">Linfonodo(s) axilar(es) reacional(is)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="linf-susp"
                    checked={data.achadosAdicionais.linfonodoSuspeito}
                    onCheckedChange={(checked) => updateData('achadosAdicionais', { ...data.achadosAdicionais, linfonodoSuspeito: !!checked })}
                  />
                  <Label htmlFor="linf-susp" className="cursor-pointer">Linfonodo(s) axilar(es) suspeito(s)</Label>
                </div>
                {data.achadosAdicionais.linfonodoSuspeito && (
                  <Textarea
                    placeholder="Descreva os linfonodos suspeitos..."
                    value={data.achadosAdicionais.linfonodoDescricao || ''}
                    onChange={(e) => updateData('achadosAdicionais', { ...data.achadosAdicionais, linfonodoDescricao: e.target.value })}
                    rows={2}
                    className="mt-2"
                  />
                )}
              </div>

              <Separator />

              <h4 className="font-medium text-sm">Implantes Mamários</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="impl-integro"
                    checked={data.achadosAdicionais.implanteIntegro}
                    onCheckedChange={(checked) => updateData('achadosAdicionais', { ...data.achadosAdicionais, implanteIntegro: !!checked })}
                  />
                  <Label htmlFor="impl-integro" className="cursor-pointer">Implante(s) íntegro(s)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="impl-intra"
                    checked={data.achadosAdicionais.implanteRoturaIntra}
                    onCheckedChange={(checked) => updateData('achadosAdicionais', { ...data.achadosAdicionais, implanteRoturaIntra: !!checked })}
                  />
                  <Label htmlFor="impl-intra" className="cursor-pointer">Sinais de rotura intracapsular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="impl-extra"
                    checked={data.achadosAdicionais.implanteRoturaExtra}
                    onCheckedChange={(checked) => updateData('achadosAdicionais', { ...data.achadosAdicionais, implanteRoturaExtra: !!checked })}
                  />
                  <Label htmlFor="impl-extra" className="cursor-pointer">Sinais de rotura extracapsular</Label>
                </div>
                {(data.achadosAdicionais.implanteRoturaIntra || data.achadosAdicionais.implanteRoturaExtra) && (
                  <Textarea
                    placeholder="Descreva os achados de implante..."
                    value={data.achadosAdicionais.implanteDescricao || ''}
                    onChange={(e) => updateData('achadosAdicionais', { ...data.achadosAdicionais, implanteDescricao: e.target.value })}
                    rows={2}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        )

      case 'comparativo':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <History size={16} className="text-green-500" />
              Estudo Comparativo
            </h3>

            <RadioGroup
              value={data.estudoComparativo}
              onValueChange={(v) => updateData('estudoComparativo', v)}
              className="space-y-2"
            >
              {getOpts('estudoComparativo').map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`comp-${opt.value}`} />
                  <Label htmlFor={`comp-${opt.value}`} className="cursor-pointer flex-1">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>

            {data.estudoComparativo === 'sem_alteracoes' && (
              <div className="space-y-2">
                <Label className="text-sm">Data do exame anterior</Label>
                <Input
                  type="date"
                  value={data.dataExameAnterior || ''}
                  onChange={(e) => updateData('dataExameAnterior', e.target.value)}
                  className="h-9"
                />
              </div>
            )}
          </div>
        )

      case 'recomendacao':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Override de Recomendação</h3>
            <p className="text-xs text-muted-foreground">
              A categoria BI-RADS é calculada automaticamente. Use esta seção apenas se precisar sobrescrever o resultado.
            </p>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Categoria calculada:</strong> BI-RADS {biradsCategory}
              </p>
              {categoryInfo && (
                <p className="text-xs text-muted-foreground mt-1">
                  {categoryInfo.name} - Risco: {categoryInfo.risco}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Recomendação manual (opcional)</Label>
              <Select
                value={data.recomendacaoManual || 'auto'}
                onValueChange={(v) => updateData('recomendacaoManual', v === 'auto' ? undefined : v)}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Automático" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático (calculado)</SelectItem>
                  {getOpts('recomendacao').map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'notas':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <StickyNote size={16} className="text-amber-500" />
              Notas Adicionais
            </h3>

            <Textarea
              placeholder="Observações adicionais para o laudo..."
              value={data.notas || ''}
              onChange={(e) => updateData('notas', e.target.value)}
              rows={5}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl h-[90vh] flex flex-col p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            🧲 ACR BI-RADS - Ressonância Magnética das Mamas
            {isLoading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">{ACR_BIRADS_RM_REFERENCE}</p>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar tabs */}
          <div className="w-44 shrink-0 border-r overflow-y-auto p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <Icon size={16} />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Resizable Main Content + Preview */}
          <ResizablePanelGroup 
            direction="horizontal" 
            autoSaveId="birads-rm-layout"
            className="flex-1"
          >
            {/* Content */}
            <ResizablePanel defaultSize={showPreview ? 65 : 100} minSize={40} maxSize={80}>
              <div className="overflow-y-auto p-6 h-full">
                {renderTabContent()}
              </div>
            </ResizablePanel>

            {/* Preview sidebar */}
            {showPreview && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
                  <div className="overflow-y-auto p-4 bg-muted/20 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-sm">Preview</h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                        <EyeOff size={14} />
                      </Button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span>Completude</span>
                        <span>{completeness.percentage}%</span>
                      </div>
                      <Progress value={completeness.percentage} className="h-1.5" />
                    </div>

                    <div className={`p-3 rounded-lg mb-4 ${
                      typeof biradsCategory === 'number' && biradsCategory <= 2 ? 'bg-green-500/20 text-green-700' :
                      biradsCategory === 3 ? 'bg-yellow-500/20 text-yellow-700' :
                      'bg-red-500/20 text-red-700'
                    }`}>
                      <p className="font-bold text-center">BI-RADS {biradsCategory}</p>
                      {categoryInfo && (
                        <p className="text-xs text-center mt-1">{categoryInfo.name}</p>
                      )}
                    </div>

                    <SectionPreview title="Indicação" content={indicacaoTexto} hasContent={!!data.indicacao} isRequired />
                    <SectionPreview title="Relatório" content={achadosTexto.substring(0, 200) + (achadosTexto.length > 200 ? '...' : '')} hasContent={true} />
                    <SectionPreview title="Comparativo" content={comparativoTexto} hasContent={!!data.estudoComparativo} />
                    <SectionPreview title="Impressão" content={impressaoTexto} hasContent={true} />
                    <SectionPreview title="Recomendação" content={recomendacaoTexto} hasContent={true} />
                    {notasTexto && <SectionPreview title="Notas" content={notasTexto} hasContent={!!notasTexto} />}
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>

          {!showPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="absolute right-4 top-20"
            >
              <Eye size={14} className="mr-1" /> Preview
            </Button>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2">
          <Button variant="outline" onClick={handleReset}>Limpar</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="secondary" onClick={handleInsertImpressao}>Inserir Impressão</Button>
          <Button onClick={handleInsertLaudoCompleto}>Inserir Laudo Completo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
