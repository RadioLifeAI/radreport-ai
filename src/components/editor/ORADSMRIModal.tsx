import { useState, useEffect, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Scan,
  User,
  FileText,
  Heart,
  Layers,
  CircleDot,
  Activity,
  History,
  StickyNote,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  Zap,
  Droplets
} from 'lucide-react'
import { useRADSOptions } from '@/hooks/useRADSOptions'
import { getCategoryOptions } from '@/lib/radsOptionsProvider'
import {
  ORADSMRIData,
  ORADSMRILesao,
  NoduloMiometrialMRI,
  StatusMenopausal,
  TipoLesaoMRI,
  FluidContent,
  SolidTissueType,
  T2Signal,
  DCECurve,
  WallType,
  SeptationType,
  createEmptyORADSMRIData,
  createEmptyLesaoMRI,
  evaluateORADSMRI,
  hasHighRiskAssociatedFindingsMRI,
  oradsMRICategories,
  getORADSMRICategoryFromDB,
  getORADSMRIRecommendationFromDB,
  getDCEDescriptionFromDB,
  generateORADSMRILaudoCompletoHTML,
  generateORADSMRIUteroTexto,
  generateORADSMRIEndometrioTexto,
  generateORADSMRIOvarioTexto,
  generateORADSMRIAchadosAssociados,
  generateORADSMRIImpressao,
  calcularVolumeOvarianoMRI,
  calcularVolumeUterinoMRI,
  ORADSMRIOptions
} from '@/lib/oradsMRIClassifications'

interface ORADSMRIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'paciente' | 'tecnica' | 'utero' | 'endometrio' | 'ovario_direito' | 'ovario_esquerdo' | 'achados' | 'linfonodos' | 'comparativo' | 'notas'

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'paciente', label: 'Paciente', icon: <User size={16} /> },
  { id: 'tecnica', label: 'Técnica', icon: <Scan size={16} /> },
  { id: 'utero', label: 'Útero', icon: <Heart size={16} /> },
  { id: 'endometrio', label: 'Endométrio', icon: <Layers size={16} /> },
  { id: 'ovario_direito', label: 'Ovário D', icon: <CircleDot size={16} /> },
  { id: 'ovario_esquerdo', label: 'Ovário E', icon: <CircleDot size={16} /> },
  { id: 'achados', label: 'Achados', icon: <Activity size={16} /> },
  { id: 'linfonodos', label: 'Linfonodos', icon: <Droplets size={16} /> },
  { id: 'comparativo', label: 'Comparativo', icon: <History size={16} /> },
  { id: 'notas', label: 'Notas', icon: <StickyNote size={16} /> },
]

// Section Preview Component
function SectionPreview({ title, content, status }: { title: string; content: string; status: 'filled' | 'required' | 'optional' }) {
  const statusIcon = {
    filled: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    required: <AlertCircle className="h-4 w-4 text-red-500" />,
    optional: <MinusCircle className="h-4 w-4 text-muted-foreground" />
  }[status]

  if (!content && status === 'optional') return null

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        {statusIcon}
        <span className="text-xs font-medium text-muted-foreground uppercase">{title}</span>
      </div>
      <p className="text-sm whitespace-pre-wrap">{content || 'Não preenchido'}</p>
    </div>
  )
}

export function ORADSMRIModal({ open, onOpenChange, editor }: ORADSMRIModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('paciente')
  const [showPreview, setShowPreview] = useState(true)
  const [data, setData] = useState<ORADSMRIData>(createEmptyORADSMRIData())
  
  // Dynamic options from database
  const { data: oradsOptions, isLoading, isError } = useRADSOptions('ORADS_MRI')
  
  // Helper to get options for a category
  const getOptions = (categoria: string) => 
    getCategoryOptions('ORADS_MRI', categoria, oradsOptions, isLoading, isError)

  // Reset on open
  useEffect(() => {
    if (open) {
      setData(createEmptyORADSMRIData())
      setActiveTab('paciente')
    }
  }, [open])

  // Calculate O-RADS MRI scores for all lesions
  const oradsResults = useMemo(() => {
    const allLesions = [
      ...data.ovarioDireito.lesoes.map(l => ({ lesao: l, lado: 'direito' as const })),
      ...data.ovarioEsquerdo.lesoes.map(l => ({ lesao: l, lado: 'esquerdo' as const }))
    ]
    
    return allLesions.map(({ lesao, lado }) => ({
      ...evaluateORADSMRI(lesao, data.statusMenopausal, oradsOptions as ORADSMRIOptions),
      lado
    }))
  }, [data.ovarioDireito.lesoes, data.ovarioEsquerdo.lesoes, data.statusMenopausal, oradsOptions])

  // Highest O-RADS score
  const maxORADS = useMemo(() => {
    if (hasHighRiskAssociatedFindingsMRI(data)) return 5
    if (oradsResults.length === 0) return 1
    return Math.max(...oradsResults.map(r => r.score))
  }, [oradsResults, data])

  // Volumes
  const volumeUtero = useMemo(() => 
    calcularVolumeUterinoMRI(data.utero.mx, data.utero.my, data.utero.mz), 
    [data.utero.mx, data.utero.my, data.utero.mz]
  )
  
  const volumeOvarioD = useMemo(() => 
    calcularVolumeOvarianoMRI(data.ovarioDireito.mx, data.ovarioDireito.my, data.ovarioDireito.mz),
    [data.ovarioDireito.mx, data.ovarioDireito.my, data.ovarioDireito.mz]
  )
  
  const volumeOvarioE = useMemo(() => 
    calcularVolumeOvarianoMRI(data.ovarioEsquerdo.mx, data.ovarioEsquerdo.my, data.ovarioEsquerdo.mz),
    [data.ovarioEsquerdo.mx, data.ovarioEsquerdo.my, data.ovarioEsquerdo.mz]
  )

  // Update helpers
  const updateData = (updates: Partial<ORADSMRIData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const updateTecnica = (updates: Partial<ORADSMRIData['tecnica']>) => {
    setData(prev => ({ ...prev, tecnica: { ...prev.tecnica, ...updates } }))
  }

  const updateUtero = (updates: Partial<ORADSMRIData['utero']>) => {
    setData(prev => ({ ...prev, utero: { ...prev.utero, ...updates } }))
  }

  const updateEndometrio = (updates: Partial<ORADSMRIData['endometrio']>) => {
    setData(prev => ({ ...prev, endometrio: { ...prev.endometrio, ...updates } }))
  }

  const updateOvario = (lado: 'direito' | 'esquerdo', updates: Partial<ORADSMRIData['ovarioDireito']>) => {
    const key = lado === 'direito' ? 'ovarioDireito' : 'ovarioEsquerdo'
    setData(prev => ({ ...prev, [key]: { ...prev[key], ...updates } }))
  }

  const updateLinfonodos = (updates: Partial<ORADSMRIData['linfonodos']>) => {
    setData(prev => ({ ...prev, linfonodos: { ...prev.linfonodos, ...updates } }))
  }

  const addNodulo = () => {
    const newNodulo: NoduloMiometrialMRI = {
      localizacao: 'intramural',
      mx: 0, my: 0, mz: 0,
      sinalT2: 'hipointenso',
      enhancement: 'homogêneo'
    }
    updateUtero({ nodulos: [...data.utero.nodulos, newNodulo] })
  }

  const removeNodulo = (index: number) => {
    updateUtero({ nodulos: data.utero.nodulos.filter((_, i) => i !== index) })
  }

  const updateNodulo = (index: number, updates: Partial<NoduloMiometrialMRI>) => {
    const nodulos = [...data.utero.nodulos]
    nodulos[index] = { ...nodulos[index], ...updates }
    updateUtero({ nodulos })
  }

  const addLesao = (lado: 'direito' | 'esquerdo') => {
    const newLesao = createEmptyLesaoMRI(lado === 'direito' ? 'ovario_direito' : 'ovario_esquerdo')
    const key = lado === 'direito' ? 'ovarioDireito' : 'ovarioEsquerdo'
    setData(prev => ({
      ...prev,
      [key]: { ...prev[key], lesoes: [...prev[key].lesoes, newLesao] }
    }))
  }

  const removeLesao = (lado: 'direito' | 'esquerdo', index: number) => {
    const key = lado === 'direito' ? 'ovarioDireito' : 'ovarioEsquerdo'
    setData(prev => ({
      ...prev,
      [key]: { ...prev[key], lesoes: prev[key].lesoes.filter((_, i) => i !== index) }
    }))
  }

  const updateLesao = (lado: 'direito' | 'esquerdo', index: number, updates: Partial<ORADSMRILesao>) => {
    const key = lado === 'direito' ? 'ovarioDireito' : 'ovarioEsquerdo'
    setData(prev => {
      const lesoes = [...prev[key].lesoes]
      lesoes[index] = { ...lesoes[index], ...updates }
      return { ...prev, [key]: { ...prev[key], lesoes } }
    })
  }

  const handleInsert = () => {
    if (!editor) return
    const html = generateORADSMRILaudoCompletoHTML(data, oradsOptions as ORADSMRIOptions)
    editor.chain().focus().setContent(html).run()
    onOpenChange(false)
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'paciente':
        return (
          <div className="space-y-4">
            <div>
              <Label>Status Menopausal</Label>
              <Select value={data.statusMenopausal} onValueChange={(v) => updateData({ statusMenopausal: v as StatusMenopausal })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre">Pré-menopausa</SelectItem>
                  <SelectItem value="pos">Pós-menopausa</SelectItem>
                  <SelectItem value="incerto">Incerto / {'>'}50 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Idade (opcional)</Label>
              <Input
                type="number"
                value={data.idade || ''}
                onChange={(e) => updateData({ idade: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Anos"
              />
            </div>
            <div>
              <Label>DUM (opcional)</Label>
              <Input
                type="date"
                value={data.dum || ''}
                onChange={(e) => updateData({ dum: e.target.value })}
              />
            </div>
            <div>
              <Label>Indicação Clínica</Label>
              <Textarea
                value={data.indicacao || ''}
                onChange={(e) => updateData({ indicacao: e.target.value })}
                placeholder="Ex: Massa anexial, dor pélvica, CA-125 elevado..."
                rows={3}
              />
            </div>
          </div>
        )

      case 'tecnica':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Campo Magnético</Label>
                <Select value={data.tecnica.campo} onValueChange={(v) => updateTecnica({ campo: v as '1.5T' | '3T' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5T">1.5 Tesla</SelectItem>
                    <SelectItem value="3T">3.0 Tesla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={data.tecnica.contraste}
                  onCheckedChange={(v) => updateTecnica({ contraste: v })}
                />
                <Label>Contraste (Gadolínio)</Label>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={data.tecnica.dceRealizado}
                onCheckedChange={(v) => updateTecnica({ dceRealizado: v })}
                disabled={!data.tecnica.contraste}
              />
              <Label className={!data.tecnica.contraste ? 'opacity-50' : ''}>
                DCE (Estudo Dinâmico Pós-Contraste)
              </Label>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Sequências padrão:</strong> T1 axial/sagital, T2 axial/sagital, DWI (b=0, b=800-1000), mapa ADC
                {data.tecnica.contraste && ', T1 pós-contraste'}
                {data.tecnica.dceRealizado && ', DCE com análise de curvas TI'}
              </p>
            </div>
          </div>
        )

      case 'utero':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={data.utero.presente}
                onCheckedChange={(v) => updateUtero({ presente: v })}
              />
              <Label>Útero presente</Label>
            </div>

            {data.utero.presente && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Posição</Label>
                    <Select value={data.utero.posicao} onValueChange={(v) => updateUtero({ posicao: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anteversoflexao">Anteversão/Anteflexão</SelectItem>
                        <SelectItem value="retroversoflexao">Retroversão/Retroflexão</SelectItem>
                        <SelectItem value="medioversao">Médio versão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Forma</Label>
                    <Select value={data.utero.forma} onValueChange={(v) => updateUtero({ forma: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="irregular">Irregular</SelectItem>
                        <SelectItem value="globoso">Globoso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Sinal T2 Miometrial</Label>
                    <Select value={data.utero.sinalT2} onValueChange={(v) => updateUtero({ sinalT2: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homogeneo">Homogêneo</SelectItem>
                        <SelectItem value="heterogeneo">Heterogêneo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Zona Juncional</Label>
                    <Select value={data.utero.zonaJuncional} onValueChange={(v) => updateUtero({ zonaJuncional: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular (≤12mm)</SelectItem>
                        <SelectItem value="irregular">Irregular</SelectItem>
                        <SelectItem value="espessada">Espessada ({'>'}12mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Medidas (cm)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      type="number"
                      step="0.1"
                      value={data.utero.mx || ''}
                      onChange={(e) => updateUtero({ mx: Number(e.target.value) })}
                      placeholder="Long."
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={data.utero.my || ''}
                      onChange={(e) => updateUtero({ my: Number(e.target.value) })}
                      placeholder="AP"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={data.utero.mz || ''}
                      onChange={(e) => updateUtero({ mz: Number(e.target.value) })}
                      placeholder="Trans."
                    />
                  </div>
                  {volumeUtero > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Volume: {volumeUtero.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm³
                    </p>
                  )}
                </div>

                {/* Nódulos Miometriais */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Nódulos Miometriais</Label>
                    <Button variant="outline" size="sm" onClick={addNodulo}>
                      <Plus size={14} className="mr-1" /> Adicionar
                    </Button>
                  </div>
                  
                  {data.utero.nodulos.map((nodulo, i) => (
                    <div key={i} className="border rounded-lg p-3 mb-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Nódulo {i + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeNodulo(i)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={nodulo.localizacao} onValueChange={(v) => updateNodulo(i, { localizacao: v })}>
                          <SelectTrigger><SelectValue placeholder="Localização" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intramural">Intramural</SelectItem>
                            <SelectItem value="subseroso">Subseroso</SelectItem>
                            <SelectItem value="submucoso">Submucoso</SelectItem>
                            <SelectItem value="pediculado">Pediculado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={nodulo.sinalT2} onValueChange={(v) => updateNodulo(i, { sinalT2: v })}>
                          <SelectTrigger><SelectValue placeholder="Sinal T2" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hipointenso">Hipointenso</SelectItem>
                            <SelectItem value="isointenso">Isointenso</SelectItem>
                            <SelectItem value="heterogêneo">Heterogêneo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input type="number" step="0.1" value={nodulo.mx || ''} onChange={(e) => updateNodulo(i, { mx: Number(e.target.value) })} placeholder="L (cm)" />
                        <Input type="number" step="0.1" value={nodulo.my || ''} onChange={(e) => updateNodulo(i, { my: Number(e.target.value) })} placeholder="AP (cm)" />
                        <Input type="number" step="0.1" value={nodulo.mz || ''} onChange={(e) => updateNodulo(i, { mz: Number(e.target.value) })} placeholder="T (cm)" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )

      case 'endometrio':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Espessura (mm)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={data.endometrio.espessura || ''}
                  onChange={(e) => updateEndometrio({ espessura: Number(e.target.value) })}
                  placeholder="mm"
                />
                {data.endometrio.espessura > 0 && data.statusMenopausal === 'pos' && data.endometrio.espessura > 5 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Espessura acima do esperado para pós-menopausa ({'>'}5mm)
                  </p>
                )}
              </div>
              <div>
                <Label>Sinal T2</Label>
                <Select value={data.endometrio.sinalT2} onValueChange={(v) => updateEndometrio({ sinalT2: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="espessado">Espessado</SelectItem>
                    <SelectItem value="heterogeneo">Heterogêneo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.endometrio.distensao}
                  onCheckedChange={(v) => updateEndometrio({ distensao: v })}
                />
                <Label>Distensão cavitária</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.endometrio.massaIntracavitaria}
                  onCheckedChange={(v) => updateEndometrio({ massaIntracavitaria: v })}
                />
                <Label>Massa intracavitária</Label>
              </div>
            </div>
          </div>
        )

      case 'ovario_direito':
      case 'ovario_esquerdo':
        const lado = activeTab === 'ovario_direito' ? 'direito' : 'esquerdo'
        const ovario = lado === 'direito' ? data.ovarioDireito : data.ovarioEsquerdo
        const volumeOvario = lado === 'direito' ? volumeOvarioD : volumeOvarioE
        
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={ovario.presente}
                onCheckedChange={(v) => updateOvario(lado, { presente: v })}
              />
              <Label>Ovário visualizado</Label>
            </div>

            {ovario.presente && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Localização</Label>
                    <Select value={ovario.localizacao} onValueChange={(v) => updateOvario(lado, { localizacao: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parauterina">Parauterina</SelectItem>
                        <SelectItem value="fundo de saco">Fundo de saco</SelectItem>
                        <SelectItem value="fossa ilíaca">Fossa ilíaca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sinal T2</Label>
                    <Select value={ovario.sinalT2} onValueChange={(v) => updateOvario(lado, { sinalT2: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="heterogêneo">Heterogêneo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Medidas (cm)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input type="number" step="0.1" value={ovario.mx || ''} onChange={(e) => updateOvario(lado, { mx: Number(e.target.value) })} placeholder="Long." />
                    <Input type="number" step="0.1" value={ovario.my || ''} onChange={(e) => updateOvario(lado, { my: Number(e.target.value) })} placeholder="AP" />
                    <Input type="number" step="0.1" value={ovario.mz || ''} onChange={(e) => updateOvario(lado, { mz: Number(e.target.value) })} placeholder="Trans." />
                  </div>
                  {volumeOvario > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Volume: {volumeOvario.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm³
                    </p>
                  )}
                </div>

                {/* Lesões */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Lesões O-RADS MRI</Label>
                    <Button variant="outline" size="sm" onClick={() => addLesao(lado)}>
                      <Plus size={14} className="mr-1" /> Adicionar Lesão
                    </Button>
                  </div>

                  {ovario.lesoes.map((lesao, i) => {
                    const result = evaluateORADSMRI(lesao, data.statusMenopausal, oradsOptions as ORADSMRIOptions)
                    const cat = getORADSMRICategoryFromDB(result.score, oradsOptions as ORADSMRIOptions)
                    
                    return (
                      <div key={lesao.id} className="border rounded-lg p-3 mb-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Lesão {i + 1}</span>
                            <Badge className={`${
                              cat.cor === 'green' ? 'bg-green-500' :
                              cat.cor === 'yellow' ? 'bg-yellow-500' :
                              cat.cor === 'orange' ? 'bg-orange-500' :
                              cat.cor === 'red' ? 'bg-red-500' : 'bg-gray-500'
                            } text-white`}>
                              {cat.name}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeLesao(lado, i)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Tipo de Lesão</Label>
                            <Select value={lesao.tipo} onValueChange={(v) => updateLesao(lado, i, { tipo: v as TipoLesaoMRI })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cisto_unilocular">Cisto unilocular</SelectItem>
                                <SelectItem value="cisto_multilocular">Cisto multilocular</SelectItem>
                                <SelectItem value="lesao_solida">Lesão sólida</SelectItem>
                                <SelectItem value="lesao_lipidica">Lesão lipídica (teratoma)</SelectItem>
                                <SelectItem value="tuba_dilatada">Tuba dilatada</SelectItem>
                                <SelectItem value="cisto_paraovarian">Cisto paraovariano</SelectItem>
                                <SelectItem value="foliculo">Folículo</SelectItem>
                                <SelectItem value="cisto_hemorragico">Cisto hemorrágico</SelectItem>
                                <SelectItem value="corpo_luteo">Corpo lúteo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Tamanho (cm)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={lesao.tamanho || ''}
                              onChange={(e) => updateLesao(lado, i, { tamanho: Number(e.target.value) })}
                              placeholder="Maior diâmetro"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Conteúdo Fluido</Label>
                            <Select value={lesao.conteudoFluido} onValueChange={(v) => updateLesao(lado, i, { conteudoFluido: v as FluidContent })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="simple">Simples (T1↓ T2↑)</SelectItem>
                                <SelectItem value="proteinaceous">Proteináceo (T1↑ T2~)</SelectItem>
                                <SelectItem value="hemorrhagic">Hemorrágico (T1↑ shading)</SelectItem>
                                <SelectItem value="mucinous">Mucinoso</SelectItem>
                                <SelectItem value="endometriotic">Endometriótico</SelectItem>
                                <SelectItem value="lipid">Lipídico (fat-sat↓)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Tecido Sólido</Label>
                            <Select value={lesao.tecidoSolido} onValueChange={(v) => updateLesao(lado, i, { tecidoSolido: v as SolidTissueType })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                <SelectItem value="papillary_projection">Projeção papilar</SelectItem>
                                <SelectItem value="mural_nodule">Nódulo mural</SelectItem>
                                <SelectItem value="irregular_septation">Septação irregular</SelectItem>
                                <SelectItem value="irregular_wall">Parede irregular</SelectItem>
                                <SelectItem value="large_solid">Sólido volumoso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Sinal T1</Label>
                            <Select value={lesao.sinalT1} onValueChange={(v) => updateLesao(lado, i, { sinalT1: v as any })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hypointense">Hipointenso</SelectItem>
                                <SelectItem value="isointense">Isointenso</SelectItem>
                                <SelectItem value="hyperintense">Hiperintenso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Sinal T2</Label>
                            <Select value={lesao.sinalT2} onValueChange={(v) => updateLesao(lado, i, { sinalT2: v as T2Signal })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hyperintense">Hiperintenso</SelectItem>
                                <SelectItem value="intermediate">Intermediário</SelectItem>
                                <SelectItem value="hypointense">Hipointenso</SelectItem>
                                <SelectItem value="dark_t2_dark_dwi">Dark T2 / Dark DWI</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">DWI</Label>
                            <Select value={lesao.sinalDWI} onValueChange={(v) => updateLesao(lado, i, { sinalDWI: v as any })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="restricted">Restrição</SelectItem>
                                <SelectItem value="non_restricted">Sem restrição</SelectItem>
                                <SelectItem value="dark">Dark DWI</SelectItem>
                                <SelectItem value="variable">Variável</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {lesao.tecidoSolido !== 'none' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Curva DCE</Label>
                              <Select 
                                value={lesao.curvaDCE} 
                                onValueChange={(v) => updateLesao(lado, i, { curvaDCE: v as DCECurve })}
                                disabled={!data.tecnica.dceRealizado}
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low_risk">Baixo Risco (Tipo 1)</SelectItem>
                                  <SelectItem value="intermediate_risk">Intermediário (Tipo 2)</SelectItem>
                                  <SelectItem value="high_risk">Alto Risco (Tipo 3)</SelectItem>
                                  <SelectItem value="not_performed">Não realizado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {lesao.curvaDCE === 'not_performed' && (
                              <div>
                                <Label className="text-xs">Enhancement vs Miométrio (30-40s)</Label>
                                <Select 
                                  value={lesao.enhancementVsMyometrium || ''} 
                                  onValueChange={(v) => updateLesao(lado, i, { enhancementVsMyometrium: v as any })}
                                >
                                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="less_than">Menor que miométrio</SelectItem>
                                    <SelectItem value="equal_to">Igual ao miométrio</SelectItem>
                                    <SelectItem value="more_than">Maior que miométrio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Parede</Label>
                            <Select value={lesao.parede} onValueChange={(v) => updateLesao(lado, i, { parede: v as WallType })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no_wall">Imperceptível</SelectItem>
                                <SelectItem value="thin_smooth">Fina lisa</SelectItem>
                                <SelectItem value="thick_smooth">Espessa lisa</SelectItem>
                                <SelectItem value="thin_irregular">Fina irregular</SelectItem>
                                <SelectItem value="thick_irregular">Espessa irregular</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Septação</Label>
                            <Select value={lesao.septacao} onValueChange={(v) => updateLesao(lado, i, { septacao: v as SeptationType })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Nenhuma</SelectItem>
                                <SelectItem value="smooth">Lisa</SelectItem>
                                <SelectItem value="irregular">Irregular</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={lesao.paredeEnhancement}
                              onCheckedChange={(v) => updateLesao(lado, i, { paredeEnhancement: v })}
                            />
                            <Label className="text-xs">Realce parede</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={lesao.lipidContent}
                              onCheckedChange={(v) => updateLesao(lado, i, { lipidContent: v })}
                            />
                            <Label className="text-xs">Conteúdo lipídico</Label>
                          </div>
                          {lesao.lipidContent && (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={lesao.rokitanskyEnhancement}
                                onCheckedChange={(v) => updateLesao(lado, i, { rokitanskyEnhancement: v })}
                              />
                              <Label className="text-xs">Rokitansky c/ realce</Label>
                            </div>
                          )}
                        </div>

                        {/* Justificativa da classificação */}
                        <div className="bg-muted p-2 rounded text-xs">
                          <strong>Justificativa:</strong> {result.justificativa}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )

      case 'achados':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Atenção:</strong> Nodularidade peritoneal/omental/mesentérica ± ascite indica O-RADS MRI 5 automaticamente
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.ascite}
                  onCheckedChange={(v) => updateData({ ascite: v })}
                />
                <Label>Ascite</Label>
              </div>
              {data.ascite && (
                <Select value={data.asciteQuantidade || ''} onValueChange={(v) => updateData({ asciteQuantidade: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Quantidade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pequena">Pequena</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.nodulosPeritoneais}
                  onCheckedChange={(v) => updateData({ nodulosPeritoneais: v })}
                />
                <Label>Nodularidade peritoneal</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.nodulosMesentéricos}
                  onCheckedChange={(v) => updateData({ nodulosMesentéricos: v })}
                />
                <Label>Nódulos mesentéricos</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.nodulosOmentais}
                  onCheckedChange={(v) => updateData({ nodulosOmentais: v })}
                />
                <Label>Nódulos omentais</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.omental_caking}
                  onCheckedChange={(v) => updateData({ omental_caking: v })}
                />
                <Label>Omental caking (espessamento omental)</Label>
              </div>
            </div>
          </div>
        )

      case 'linfonodos':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={data.linfonodos.presentes}
                onCheckedChange={(v) => updateLinfonodos({ presentes: v })}
              />
              <Label>Linfonodomegalia</Label>
            </div>

            {data.linfonodos.presentes && (
              <>
                <div>
                  <Label>Localização</Label>
                  <Input
                    value={data.linfonodos.localizacao || ''}
                    onChange={(e) => updateLinfonodos({ localizacao: e.target.value })}
                    placeholder="Ex: ilíaca externa direita, para-aórtica..."
                  />
                </div>
                <div>
                  <Label>Maior eixo (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.linfonodos.tamanho || ''}
                    onChange={(e) => updateLinfonodos({ tamanho: Number(e.target.value) })}
                    placeholder="cm"
                  />
                </div>
                <div>
                  <Label>Características</Label>
                  <Textarea
                    value={data.linfonodos.caracteristicas || ''}
                    onChange={(e) => updateLinfonodos({ caracteristicas: e.target.value })}
                    placeholder="Ex: morfologia preservada, centro gorduroso..."
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>
        )

      case 'comparativo':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={data.comparativo?.temEstudoAnterior || false}
                onCheckedChange={(v) => updateData({ 
                  comparativo: { 
                    ...data.comparativo, 
                    temEstudoAnterior: v 
                  } 
                })}
              />
              <Label>Possui exame anterior para comparação</Label>
            </div>

            {data.comparativo?.temEstudoAnterior && (
              <>
                <div>
                  <Label>Data do exame anterior</Label>
                  <Input
                    type="date"
                    value={data.comparativo?.dataAnterior || ''}
                    onChange={(e) => updateData({
                      comparativo: { ...data.comparativo!, dataAnterior: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Evolução</Label>
                  <Select 
                    value={data.comparativo?.evolucao || ''} 
                    onValueChange={(v) => updateData({
                      comparativo: { ...data.comparativo!, evolucao: v as any }
                    })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estavel">Estável</SelectItem>
                      <SelectItem value="aumento">Aumento</SelectItem>
                      <SelectItem value="reducao">Redução</SelectItem>
                      <SelectItem value="novo">Achado novo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Conclusão do exame anterior (opcional)</Label>
                  <Textarea
                    value={data.comparativo?.conclusaoAnterior || ''}
                    onChange={(e) => updateData({
                      comparativo: { ...data.comparativo!, conclusaoAnterior: e.target.value }
                    })}
                    placeholder="Resumo da conclusão anterior..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
        )

      case 'notas':
        return (
          <div className="space-y-4">
            <div>
              <Label>Notas Adicionais</Label>
              <Textarea
                value={data.notas || ''}
                onChange={(e) => updateData({ notas: e.target.value })}
                placeholder="Observações adicionais, correlação clínica, limitações do exame..."
                rows={6}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Preview content
  const renderPreview = () => {
    const category = getORADSMRICategoryFromDB(maxORADS, oradsOptions as ORADSMRIOptions)
    const recomendacao = getORADSMRIRecommendationFromDB(maxORADS, oradsOptions as ORADSMRIOptions)

    return (
      <div className="space-y-4">
        {/* Classification Card */}
        <div className={`p-4 rounded-lg border-2 ${
          maxORADS <= 2 ? 'bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700' :
          maxORADS === 3 ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-950 dark:border-yellow-700' :
          maxORADS === 4 ? 'bg-orange-50 border-orange-300 dark:bg-orange-950 dark:border-orange-700' :
          'bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-700'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold">{category.name}</span>
            <Badge className={`${
              category.cor === 'green' ? 'bg-green-500' :
              category.cor === 'yellow' ? 'bg-yellow-500' :
              category.cor === 'orange' ? 'bg-orange-500' :
              category.cor === 'red' ? 'bg-red-500' : 'bg-gray-500'
            } text-white`}>
              {category.riscoNumerico}
            </Badge>
          </div>
          <p className="text-sm font-medium">{category.risco}</p>
          {oradsResults.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {oradsResults.length} lesão(ões) avaliada(s)
            </div>
          )}
        </div>

        <SectionPreview 
          title="Indicação" 
          content={data.indicacao || ''} 
          status={data.indicacao ? 'filled' : 'optional'} 
        />

        <SectionPreview 
          title="Útero" 
          content={generateORADSMRIUteroTexto(data, oradsOptions as ORADSMRIOptions)} 
          status={data.utero.presente ? 'filled' : 'optional'} 
        />

        <SectionPreview 
          title="Endométrio" 
          content={generateORADSMRIEndometrioTexto(data, oradsOptions as ORADSMRIOptions)} 
          status={data.endometrio.espessura > 0 ? 'filled' : 'optional'} 
        />

        <SectionPreview 
          title="Ovário Direito" 
          content={generateORADSMRIOvarioTexto(data.ovarioDireito, 'direito', oradsOptions as ORADSMRIOptions)} 
          status={data.ovarioDireito.presente ? 'filled' : 'optional'} 
        />

        <SectionPreview 
          title="Ovário Esquerdo" 
          content={generateORADSMRIOvarioTexto(data.ovarioEsquerdo, 'esquerdo', oradsOptions as ORADSMRIOptions)} 
          status={data.ovarioEsquerdo.presente ? 'filled' : 'optional'} 
        />

        <SectionPreview 
          title="Achados Associados" 
          content={generateORADSMRIAchadosAssociados(data, oradsOptions as ORADSMRIOptions)} 
          status={(data.ascite || data.nodulosPeritoneais) ? 'filled' : 'optional'} 
        />

        <SectionPreview 
          title="Impressão" 
          content={generateORADSMRIImpressao(data, maxORADS, oradsResults, oradsOptions as ORADSMRIOptions)} 
          status="filled" 
        />

        <SectionPreview 
          title="Recomendação" 
          content={recomendacao} 
          status="filled" 
        />
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl h-[90vh] flex flex-col p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-pink-500" />
              ACR O-RADS MRI v2020
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
          </div>
        </DialogHeader>

        <ResizablePanelGroup 
          direction="horizontal" 
          className="flex-1"
          autoSaveId="orads-mri-layout"
        >
          {/* Sidebar - Tabs */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
            <ScrollArea className="h-full border-r">
              <div className="p-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content */}
          <ResizablePanel defaultSize={showPreview ? 50 : 85} minSize={40} maxSize={80}>
            <ScrollArea className="h-full">
              <div className="p-6">
                {renderTabContent()}
              </div>
            </ScrollArea>
          </ResizablePanel>

          {showPreview && (
            <>
              <ResizableHandle withHandle />

              {/* Preview Panel */}
              <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
                <div className="h-full flex flex-col border-l">
                  <div className="px-4 py-2 border-b bg-muted/50">
                    <h3 className="text-sm font-medium">Preview do Laudo</h3>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      {renderPreview()}
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Classificação baseada em ACR O-RADS MRI v2020 (Thomassin-Naggara et al.)
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsert}>
              Inserir Laudo Completo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
