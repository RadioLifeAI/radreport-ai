import { useState, useCallback, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Database, Plus, Trash2, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useRADSOptions, RADSOptionsMap } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback } from '@/lib/radsOptionsProvider'
import {
  LIRADSUSData,
  LIRADSUSObservacao,
  evaluateLIRADSUS,
  liradsUSCategories,
  generateLIRADSUSLaudoCompletoHTML,
  getLIRADSUSRecommendation
} from '@/lib/liradsUSClassifications'
import { cn } from '@/lib/utils'

interface LIRADSUSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

const TABS = [
  { id: 'paciente', label: 'Paciente' },
  { id: 'parenquima', label: 'Parênquima' },
  { id: 'observacoes', label: 'Observações' },
  { id: 'trombose', label: 'Trombose' },
  { id: 'visualizacao', label: 'Visualização' },
  { id: 'comparativo', label: 'Comparativo' },
  { id: 'notas', label: 'Notas' },
]

const initialObservacao: LIRADSUSObservacao = {
  tipo: 'nenhuma',
  tamanho: 0,
  localizacao: '',
  ecogenicidade: '',
  novo: false,
  cresceu: false,
}

const initialData: LIRADSUSData = {
  populacaoRisco: 'cirrose',
  etiologiaCirrose: '',
  childPugh: '',
  elegivelTransplante: true,
  afpStatus: 'nao_disponivel',
  afpValor: undefined,
  imc: undefined,
  aspectoParenquima: 'homogeneo',
  tamanhoFigado: 'normal',
  contornosFigado: '',
  esteatose: '',
  esplenomegalia: '',
  tamanhoBaco: undefined,
  ascite: '',
  observacoes: [{ ...initialObservacao }],
  tromboTipo: 'nenhum',
  tromboLocalizacao: '',
  tromboNovo: false,
  visScore: 'A',
  limitacoesVIS: [],
  temComparativo: false,
  dataExameAnterior: '',
  comparativoResultado: '',
  resultadoAnterior: '',
  notas: '',
}

// Tipos benignos para verificação tiebreaker
const TIPOS_BENIGNOS = ['nenhuma', 'cisto_simples', 'hemangioma', 'esteatose_focal']
const isDefinitivelyBenign = (tipo: string) => TIPOS_BENIGNOS.includes(tipo)

export function LIRADSUSModal({ open, onOpenChange, editor }: LIRADSUSModalProps) {
  const [activeTab, setActiveTab] = useState('paciente')
  const [data, setData] = useState<LIRADSUSData>({ ...initialData })
  const [showPreview, setShowPreview] = useState(true)

  const { data: dbOptions, isLoading, isError } = useRADSOptions('LIRADS_US')
  const options = useMemo(() => 
    getRADSOptionsWithFallback('LIRADS_US', dbOptions, isLoading, isError),
    [dbOptions, isLoading, isError]
  )

  const getOptions = useCallback((categoria: string) => {
    return options[categoria] || []
  }, [options])

  const result = useMemo(() => evaluateLIRADSUS(data), [data])
  const recommendation = useMemo(() => 
    getLIRADSUSRecommendation(result.categoria, data.visScore, data.afpStatus, data, options),
    [result.categoria, data.visScore, data.afpStatus, data, options]
  )
  
  // Verificar se há observação próxima do limiar 10mm (tiebreaker)
  const hasTiebreakerObservation = useMemo(() => 
    data.observacoes.some(o => o.tamanho >= 9 && o.tamanho <= 11 && !isDefinitivelyBenign(o.tipo)),
    [data.observacoes]
  )

  const updateField = <K extends keyof LIRADSUSData>(field: K, value: LIRADSUSData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const addObservacao = () => {
    if (data.observacoes.length < 3) {
      setData(prev => ({
        ...prev,
        observacoes: [...prev.observacoes, { ...initialObservacao }]
      }))
    }
  }

  const removeObservacao = (index: number) => {
    setData(prev => ({
      ...prev,
      observacoes: prev.observacoes.filter((_, i) => i !== index)
    }))
  }

  const updateObservacao = (index: number, field: keyof LIRADSUSObservacao, value: any) => {
    setData(prev => ({
      ...prev,
      observacoes: prev.observacoes.map((obs, i) => 
        i === index ? { ...obs, [field]: value } : obs
      )
    }))
  }

  const toggleLimitacao = (limitacao: string) => {
    setData(prev => ({
      ...prev,
      limitacoesVIS: prev.limitacoesVIS.includes(limitacao)
        ? prev.limitacoesVIS.filter(l => l !== limitacao)
        : [...prev.limitacoesVIS, limitacao]
    }))
  }

  const handleInsert = () => {
    if (!editor) return
    const html = generateLIRADSUSLaudoCompletoHTML(data, result.categoria, options)
    editor.chain().focus().insertContent(html).run()
    onOpenChange(false)
    setData({ ...initialData })
    setActiveTab('paciente')
  }

  const handleReset = () => {
    setData({ ...initialData })
    setActiveTab('paciente')
  }

  const categoryColor = result.categoryInfo?.cor || 'gray'
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500/20 text-green-600 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-600 border-red-500/30',
    gray: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl h-[90vh] flex flex-col p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-amber-500" />
              ACR LI-RADS US Surveillance v2024
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
          </div>
        </DialogHeader>

        <ResizablePanelGroup direction="horizontal" className="flex-1 px-4 pb-4" autoSaveId="lirads-us-layout">
          {/* Tabs Laterais */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
            <div className="h-full flex flex-col gap-1 pr-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-2 text-left text-sm rounded-md transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Formulário */}
          <ResizablePanel defaultSize={showPreview ? 50 : 85} minSize={40} maxSize={80}>
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 py-2">
                {/* Tab Paciente */}
                {activeTab === 'paciente' && (
                  <div className="space-y-4">
                    <div>
                      <Label>População de Risco</Label>
                      <Select value={data.populacaoRisco} onValueChange={v => updateField('populacaoRisco', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOptions('populacao_risco').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {data.populacaoRisco === 'cirrose' && (
                      <div>
                        <Label>Etiologia da Cirrose</Label>
                        <Select value={data.etiologiaCirrose || ''} onValueChange={v => updateField('etiologiaCirrose', v)}>
                          <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                          <SelectContent>
                            {getOptions('etiologia_cirrose').map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Classificação Child-Pugh</Label>
                      <Select value={data.childPugh || ''} onValueChange={v => updateField('childPugh', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                        <SelectContent>
                          {getOptions('child_pugh').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="elegivel"
                        checked={data.elegivelTransplante}
                        onCheckedChange={v => updateField('elegivelTransplante', !!v)}
                      />
                      <Label htmlFor="elegivel">Elegível para transplante hepático</Label>
                    </div>

                    <Separator />

                    <div>
                      <Label>Status AFP</Label>
                      <Select value={data.afpStatus} onValueChange={v => updateField('afpStatus', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOptions('afp_status').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {data.afpStatus !== 'nao_disponivel' && (
                      <div>
                        <Label>Valor AFP (ng/mL)</Label>
                        <Input
                          type="number"
                          value={data.afpValor || ''}
                          onChange={e => updateField('afpValor', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="Opcional"
                        />
                      </div>
                    )}

                    <Separator />

                    <div>
                      <Label>IMC (kg/m²) - Opcional</Label>
                      <Input
                        type="number"
                        value={data.imc || ''}
                        onChange={e => updateField('imc', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="Ex: 32,5"
                        step="0.1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Relevante para VIS-C (≥ 35 = fator de risco)
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab Parênquima */}
                {activeTab === 'parenquima' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Aspecto do Parênquima</Label>
                      <Select value={data.aspectoParenquima} onValueChange={v => updateField('aspectoParenquima', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOptions('aspecto_parenquima').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tamanho do Fígado</Label>
                      <Select value={data.tamanhoFigado} onValueChange={v => updateField('tamanhoFigado', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOptions('tamanho_figado').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Contornos Hepáticos</Label>
                      <Select value={data.contornosFigado || ''} onValueChange={v => updateField('contornosFigado', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                        <SelectContent>
                          {getOptions('contornos_figado').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Esteatose Hepática</Label>
                      <Select value={data.esteatose || ''} onValueChange={v => updateField('esteatose', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                        <SelectContent>
                          {getOptions('esteatose').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <Label>Esplenomegalia</Label>
                      <Select value={data.esplenomegalia || ''} onValueChange={v => updateField('esplenomegalia', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                        <SelectContent>
                          {getOptions('esplenomegalia').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {data.esplenomegalia === 'presente' && (
                      <div>
                        <Label>Tamanho do Baço (cm)</Label>
                        <Input
                          type="number"
                          value={data.tamanhoBaco || ''}
                          onChange={e => updateField('tamanhoBaco', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="Opcional"
                        />
                      </div>
                    )}

                    <div>
                      <Label>Ascite</Label>
                      <Select value={data.ascite || ''} onValueChange={v => updateField('ascite', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                        <SelectContent>
                          {getOptions('ascite').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Tab Observações */}
                {activeTab === 'observacoes' && (
                  <div className="space-y-4">
                    {data.observacoes.map((obs, idx) => (
                      <div key={idx} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Observação {idx + 1}</span>
                          {data.observacoes.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeObservacao(idx)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <Label>Tipo</Label>
                          <Select value={obs.tipo} onValueChange={v => updateObservacao(idx, 'tipo', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {getOptions('tipo_observacao').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {obs.tipo !== 'nenhuma' && (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Tamanho (mm)</Label>
                                <Input
                                  type="number"
                                  value={obs.tamanho || ''}
                                  onChange={e => updateObservacao(idx, 'tamanho', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div>
                                <Label>Localização</Label>
                                <Select value={obs.localizacao} onValueChange={v => updateObservacao(idx, 'localizacao', v)}>
                                  <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                                  <SelectContent>
                                    {getOptions('localizacao_observacao').map(opt => (
                                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label>Ecogenicidade</Label>
                              <Select value={obs.ecogenicidade || ''} onValueChange={v => updateObservacao(idx, 'ecogenicidade', v)}>
                                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                                <SelectContent>
                                  {getOptions('ecogenicidade_observacao').map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`novo-${idx}`}
                                  checked={obs.novo}
                                  onCheckedChange={v => updateObservacao(idx, 'novo', !!v)}
                                />
                                <Label htmlFor={`novo-${idx}`}>Nova</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`cresceu-${idx}`}
                                  checked={obs.cresceu}
                                  onCheckedChange={v => updateObservacao(idx, 'cresceu', !!v)}
                                />
                                <Label htmlFor={`cresceu-${idx}`}>Cresceu</Label>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {data.observacoes.length < 3 && (
                      <Button variant="outline" onClick={addObservacao} className="w-full gap-2">
                        <Plus className="h-4 w-4" /> Adicionar Observação
                      </Button>
                    )}
                  </div>
                )}

                {/* Tab Trombose */}
                {activeTab === 'trombose' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de Trombose</Label>
                      <Select value={data.tromboTipo} onValueChange={v => updateField('tromboTipo', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOptions('trombo_tipo').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {data.tromboTipo !== 'nenhum' && (
                      <>
                        <div>
                          <Label>Localização</Label>
                          <Select value={data.tromboLocalizacao || ''} onValueChange={v => updateField('tromboLocalizacao', v)}>
                            <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                            <SelectContent>
                              {getOptions('trombo_localizacao').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="trombo-novo"
                            checked={data.tromboNovo}
                            onCheckedChange={v => updateField('tromboNovo', !!v)}
                          />
                          <Label htmlFor="trombo-novo">Trombo novo (upgrade para US-3)</Label>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tab Visualização */}
                {activeTab === 'visualizacao' && (
                  <div className="space-y-4">
                    <div>
                      <Label>VIS Score (Qualidade de Visualização)</Label>
                      <Select value={data.visScore} onValueChange={v => updateField('visScore', v as 'A' | 'B' | 'C')}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getOptions('vis_score').map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {data.visScore !== 'A' && (
                      <div>
                        <Label>Limitações</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {getOptions('limitacao_vis').map(opt => (
                            <div key={opt.value} className="flex items-center gap-2">
                              <Checkbox
                                id={`lim-${opt.value}`}
                                checked={data.limitacoesVIS.includes(opt.value)}
                                onCheckedChange={() => toggleLimitacao(opt.value)}
                              />
                              <Label htmlFor={`lim-${opt.value}`} className="text-sm">{opt.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.visScore === 'C' && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-600">
                          VIS-C: Considerar modalidade alternativa (TC/RM) ou repetir US em 3 meses.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Comparativo */}
                {activeTab === 'comparativo' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="tem-comparativo"
                        checked={data.temComparativo}
                        onCheckedChange={v => updateField('temComparativo', !!v)}
                      />
                      <Label htmlFor="tem-comparativo">Possui exame anterior para comparação</Label>
                    </div>

                    {data.temComparativo && (
                      <>
                        <div>
                          <Label>Data do Exame Anterior</Label>
                          <Input
                            type="date"
                            value={data.dataExameAnterior || ''}
                            onChange={e => updateField('dataExameAnterior', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>Resultado do Exame Anterior</Label>
                          <Select value={data.resultadoAnterior || ''} onValueChange={v => updateField('resultadoAnterior', v)}>
                            <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                            <SelectContent>
                              {getOptions('resultado_anterior').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Evolução Comparativa</Label>
                          <Select value={data.comparativoResultado || ''} onValueChange={v => updateField('comparativoResultado', v)}>
                            <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                            <SelectContent>
                              {getOptions('comparativo').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Tab Notas */}
                {activeTab === 'notas' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Observações Adicionais</Label>
                      <Textarea
                        value={data.notas || ''}
                        onChange={e => updateField('notas', e.target.value)}
                        placeholder="Notas adicionais..."
                        rows={6}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </ResizablePanel>

          {showPreview && (
            <>
              <ResizableHandle withHandle />

              {/* Preview */}
              <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
                <ScrollArea className="h-full pl-4">
                  <div className="space-y-4 py-2">
                    {/* Card de Classificação */}
                    <div className={cn("p-4 rounded-lg border-2", colorClasses[categoryColor])}>
                      <div className="text-2xl font-bold">{result.categoria}</div>
                      <div className="text-lg font-medium">{result.categoryInfo?.nome}</div>
                      <div className="text-sm mt-1 opacity-80">{result.categoryInfo?.descricao}</div>
                    </div>

                    {/* VIS Score */}
                    <div className="flex items-center gap-2">
                      <Badge variant={data.visScore === 'A' ? 'default' : data.visScore === 'B' ? 'secondary' : 'destructive'}>
                        VIS-{data.visScore}
                      </Badge>
                      {data.visScore === 'C' && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>

                    {/* Alerta Tiebreaker (ACR v2024) */}
                    {hasTiebreakerObservation && (
                      <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs">
                        <span className="font-medium">⚠️ Tiebreaker:</span> Observação próxima de 10mm. Se incerto entre US-2 e US-3, escolha a categoria de maior suspeição (US-3).
                      </div>
                    )}

                    <Separator />

                    {/* Seções Preenchidas */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {data.populacaoRisco ? <Check className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                        <span>Paciente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Parênquima</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {data.observacoes.some(o => o.tipo !== 'nenhuma') ? <Check className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                        <span>Observações ({data.observacoes.filter(o => o.tipo !== 'nenhuma').length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Trombose</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Visualização (VIS-{data.visScore})</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Recomendação */}
                    <div>
                      <Label className="text-xs uppercase text-muted-foreground">Recomendação</Label>
                      <p className="text-sm mt-1">{recommendation}</p>
                    </div>
                  </div>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleReset}>Limpar</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
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
