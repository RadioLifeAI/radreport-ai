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
  Circle,
  User,
  FileText,
  Heart,
  Layers,
  CircleDot,
  Droplets,
  MapPin,
  History,
  StickyNote,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  Activity
} from 'lucide-react'
import { useRADSOptions } from '@/hooks/useRADSOptions'
import { getCategoryOptions } from '@/lib/radsOptionsProvider'
import {
  ORADSUSData,
  ORADSLesao,
  NoduloMiometrial,
  StatusMenopausal,
  TipoLesaoORADS,
  ColorScore,
  LesaoTipicaBenigna,
  createEmptyORADSData,
  evaluateORADS,
  hasHighRiskAssociatedFindings,
  getORADSFollowUp,
  oradsCategories,
  colorScoreDescriptions,
  lesoesTipicasBenignas,
  generateORADSLaudoCompletoHTML,
  generateORADSUteroTexto,
  generateORADSEndometrioTexto,
  generateORADSOvarioTexto,
  generateORADSLiquidoLivreTexto,
  generateORADSRegiaoAnexialTexto,
  generateORADSImpressao,
  generateORADSComparativoTexto,
  calcularVolumeOvariano,
  calcularVolumeUterino,
  interpretarVolumeOvariano,
  interpretarEspessuraEndometrial,
  getORADSCategoryFromDB,
  getORADSRecommendationFromDB,
  getColorScoreDescriptionFromDB,
  ORADSOptions
} from '@/lib/oradsClassifications'

interface ORADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'paciente' | 'indicacao' | 'utero' | 'endometrio' | 'ovario_direito' | 'ovario_esquerdo' | 'liquido' | 'anexial' | 'comparativo' | 'notas'

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'paciente', label: 'Paciente', icon: <User size={16} /> },
  { id: 'indicacao', label: 'Indicação', icon: <FileText size={16} /> },
  { id: 'utero', label: 'Útero', icon: <Heart size={16} /> },
  { id: 'endometrio', label: 'Endométrio', icon: <Layers size={16} /> },
  { id: 'ovario_direito', label: 'Ovário D', icon: <CircleDot size={16} /> },
  { id: 'ovario_esquerdo', label: 'Ovário E', icon: <CircleDot size={16} /> },
  { id: 'liquido', label: 'Líquido', icon: <Droplets size={16} /> },
  { id: 'anexial', label: 'Anexial', icon: <MapPin size={16} /> },
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

export function ORADSModal({ open, onOpenChange, editor }: ORADSModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('paciente')
  const [showPreview, setShowPreview] = useState(true)
  const [data, setData] = useState<ORADSUSData>(createEmptyORADSData())
  
  // Dynamic options from database
  const { data: oradsOptions, isLoading, isError } = useRADSOptions('ORADS_US')
  
  // Helper to get options for a category
  const getOptions = (categoria: string) => 
    getCategoryOptions('ORADS_US', categoria, oradsOptions, isLoading, isError)

  // Reset on open
  useEffect(() => {
    if (open) {
      setData(createEmptyORADSData())
      setActiveTab('paciente')
    }
  }, [open])

  // Calculate O-RADS scores for all lesions
  const oradsResults = useMemo(() => {
    const allLesions = [
      ...data.ovarioDireito.lesoes.map(l => ({ lesao: l, lado: 'direito' as const })),
      ...data.ovarioEsquerdo.lesoes.map(l => ({ lesao: l, lado: 'esquerdo' as const }))
    ]
    
    return allLesions.map(({ lesao, lado }) => ({
      ...evaluateORADS(lesao, data.statusMenopausal, oradsOptions as ORADSOptions),
      lado
    }))
  }, [data.ovarioDireito.lesoes, data.ovarioEsquerdo.lesoes, data.statusMenopausal, oradsOptions])

  // Highest O-RADS score
  const maxORADS = useMemo(() => {
    if (hasHighRiskAssociatedFindings(data)) return 5
    if (oradsResults.length === 0) return 1
    return Math.max(...oradsResults.map(r => r.score))
  }, [oradsResults, data])

  // Volumes
  const volumeUtero = useMemo(() => 
    calcularVolumeUterino(data.utero.mx, data.utero.my, data.utero.mz), 
    [data.utero.mx, data.utero.my, data.utero.mz]
  )
  
  const volumeOvarioD = useMemo(() => 
    calcularVolumeOvariano(data.ovarioDireito.mx, data.ovarioDireito.my, data.ovarioDireito.mz),
    [data.ovarioDireito.mx, data.ovarioDireito.my, data.ovarioDireito.mz]
  )
  
  const volumeOvarioE = useMemo(() => 
    calcularVolumeOvariano(data.ovarioEsquerdo.mx, data.ovarioEsquerdo.my, data.ovarioEsquerdo.mz),
    [data.ovarioEsquerdo.mx, data.ovarioEsquerdo.my, data.ovarioEsquerdo.mz]
  )

  // Update helpers
  const updateData = (updates: Partial<ORADSUSData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const updateUtero = (updates: Partial<ORADSUSData['utero']>) => {
    setData(prev => ({ ...prev, utero: { ...prev.utero, ...updates } }))
  }

  const updateEndometrio = (updates: Partial<ORADSUSData['endometrio']>) => {
    setData(prev => ({ ...prev, endometrio: { ...prev.endometrio, ...updates } }))
  }

  const updateOvario = (lado: 'direito' | 'esquerdo', updates: Partial<ORADSUSData['ovarioDireito']>) => {
    const key = lado === 'direito' ? 'ovarioDireito' : 'ovarioEsquerdo'
    setData(prev => ({ ...prev, [key]: { ...prev[key], ...updates } }))
  }

  const addNodulo = () => {
    const newNodulo: NoduloMiometrial = {
      localizacao: 'intramural',
      mx: 0, my: 0, mz: 0,
      ecogenicidade: 'hipoecogênico',
      contornos: 'regulares'
    }
    updateUtero({ nodulos: [...data.utero.nodulos, newNodulo] })
  }

  const removeNodulo = (index: number) => {
    updateUtero({ nodulos: data.utero.nodulos.filter((_, i) => i !== index) })
  }

  const updateNodulo = (index: number, updates: Partial<NoduloMiometrial>) => {
    const nodulos = [...data.utero.nodulos]
    nodulos[index] = { ...nodulos[index], ...updates }
    updateUtero({ nodulos })
  }

  const addLesao = (lado: 'direito' | 'esquerdo') => {
    const newLesao: ORADSLesao = {
      tipo: 'cisto_simples',
      tamanho: 0,
      componenteSolido: false,
      colorScore: 1,
      localizacao: lado === 'direito' ? 'ovario_direito' : 'ovario_esquerdo'
    }
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

  const updateLesao = (lado: 'direito' | 'esquerdo', index: number, updates: Partial<ORADSLesao>) => {
    const key = lado === 'direito' ? 'ovarioDireito' : 'ovarioEsquerdo'
    setData(prev => {
      const lesoes = [...prev[key].lesoes]
      lesoes[index] = { ...lesoes[index], ...updates }
      return { ...prev, [key]: { ...prev[key], lesoes } }
    })
  }

  const handleInsert = () => {
    if (!editor) return
    const html = generateORADSLaudoCompletoHTML(data, oradsOptions)
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
              <p className="text-xs text-muted-foreground mt-1">
                Pós-menopausa: amenorreia ≥1 ano ou {'>'}50 anos se incerto/útero ausente
              </p>
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
          </div>
        )

      case 'indicacao':
        return (
          <div className="space-y-4">
            <div>
              <Label>Indicação Clínica</Label>
              <Textarea
                value={data.indicacao || ''}
                onChange={(e) => updateData({ indicacao: e.target.value })}
                placeholder="Ex: Dor pélvica, massa anexial, rastreamento..."
                rows={4}
              />
            </div>
          </div>
        )

      case 'utero':
        return (
          <div className="space-y-4">
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
                <Label>Contornos</Label>
                <Select value={data.utero.contornos} onValueChange={(v) => updateUtero({ contornos: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regulares">Regulares</SelectItem>
                    <SelectItem value="irregulares">Irregulares</SelectItem>
                    <SelectItem value="lobulados">Lobulados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ecotextura</Label>
                <Select value={data.utero.ecotextura} onValueChange={(v) => updateUtero({ ecotextura: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homogenea">Homogênea</SelectItem>
                    <SelectItem value="heterogenea">Heterogênea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Simetria</Label>
                <Select value={data.utero.simetria} onValueChange={(v) => updateUtero({ simetria: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simetrico">Simétrico</SelectItem>
                    <SelectItem value="assimetrico">Assimétrico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Zona Juncional</Label>
                <Select value={data.utero.zonaJuncional} onValueChange={(v) => updateUtero({ zonaJuncional: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="espessada">Espessada</SelectItem>
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
                        <SelectItem value="fundo">Fundo</SelectItem>
                        <SelectItem value="corpo_anterior">Corpo anterior</SelectItem>
                        <SelectItem value="corpo_posterior">Corpo posterior</SelectItem>
                        <SelectItem value="istmo">Istmo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={nodulo.ecogenicidade} onValueChange={(v) => updateNodulo(i, { ecogenicidade: v })}>
                      <SelectTrigger><SelectValue placeholder="Ecogenicidade" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hipoecogênico">Hipoecogênico</SelectItem>
                        <SelectItem value="isoecogênico">Isoecogênico</SelectItem>
                        <SelectItem value="hiperecogênico">Hiperecogênico</SelectItem>
                        <SelectItem value="heterogêneo">Heterogêneo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={nodulo.mx || ''}
                      onChange={(e) => updateNodulo(i, { mx: Number(e.target.value) })}
                      placeholder="L (cm)"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={nodulo.my || ''}
                      onChange={(e) => updateNodulo(i, { my: Number(e.target.value) })}
                      placeholder="AP (cm)"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={nodulo.mz || ''}
                      onChange={(e) => updateNodulo(i, { mz: Number(e.target.value) })}
                      placeholder="T (cm)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'endometrio':
        const endoInterpretation = interpretarEspessuraEndometrial(data.endometrio.espessura, data.statusMenopausal)
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aspecto</Label>
                <Select value={data.endometrio.aspecto} onValueChange={(v) => updateEndometrio({ aspecto: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uniforme">Uniforme/Homogêneo</SelectItem>
                    <SelectItem value="heterogeneo">Heterogêneo</SelectItem>
                    <SelectItem value="espessado">Espessado</SelectItem>
                    <SelectItem value="atrofico">Atrófico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linha Média</Label>
                <Select value={data.endometrio.linhaMedia} onValueChange={(v) => updateEndometrio({ linhaMedia: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="nao_visualizada">Não visualizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Junção Endométrio-Miométrio</Label>
                <Select value={data.endometrio.juncao} onValueChange={(v) => updateEndometrio({ juncao: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Espessura (mm)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={data.endometrio.espessura || ''}
                  onChange={(e) => updateEndometrio({ espessura: Number(e.target.value) })}
                  placeholder="mm"
                />
                {data.endometrio.espessura > 0 && (
                  <p className={`text-xs mt-1 ${endoInterpretation.color === 'success' ? 'text-green-600' : endoInterpretation.color === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {endoInterpretation.interpretation}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.endometrio.polipoEndometrial || false}
                  onCheckedChange={(v) => updateEndometrio({ polipoEndometrial: v })}
                />
                <Label>Pólipo endometrial</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.endometrio.liquidoIntrauterino || false}
                  onCheckedChange={(v) => updateEndometrio({ liquidoIntrauterino: v })}
                />
                <Label>Líquido intrauterino</Label>
              </div>
            </div>
          </div>
        )

      case 'ovario_direito':
      case 'ovario_esquerdo':
        const lado = activeTab === 'ovario_direito' ? 'direito' : 'esquerdo'
        const ovario = lado === 'direito' ? data.ovarioDireito : data.ovarioEsquerdo
        const volumeOvario = lado === 'direito' ? volumeOvarioD : volumeOvarioE
        const volInterpretation = interpretarVolumeOvariano(volumeOvario, data.statusMenopausal)
        
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
                        <SelectItem value="situação parauterina">Parauterina</SelectItem>
                        <SelectItem value="fundo de saco">Fundo de saco</SelectItem>
                        <SelectItem value="fossa ilíaca">Fossa ilíaca</SelectItem>
                        <SelectItem value="laterouterina">Laterouterina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ecogenicidade</Label>
                    <Select value={ovario.ecogenicidade} onValueChange={(v) => updateOvario(lado, { ecogenicidade: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="habitual">Habitual</SelectItem>
                        <SelectItem value="heterogênea">Heterogênea</SelectItem>
                        <SelectItem value="aumentada">Aumentada</SelectItem>
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
                      value={ovario.mx || ''}
                      onChange={(e) => updateOvario(lado, { mx: Number(e.target.value) })}
                      placeholder="Long."
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={ovario.my || ''}
                      onChange={(e) => updateOvario(lado, { my: Number(e.target.value) })}
                      placeholder="AP"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={ovario.mz || ''}
                      onChange={(e) => updateOvario(lado, { mz: Number(e.target.value) })}
                      placeholder="Trans."
                    />
                  </div>
                {volumeOvario > 0 && (
                    <p className={`text-sm mt-1 ${volInterpretation.color === 'success' ? 'text-green-600' : volInterpretation.color === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                      Volume: {volumeOvario.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm³ - {volInterpretation.interpretation}
                    </p>
                )}
                </div>

                {/* Lesões */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Lesões O-RADS</Label>
                    <Button variant="outline" size="sm" onClick={() => addLesao(lado)}>
                      <Plus size={14} className="mr-1" /> Adicionar Lesão
                    </Button>
                  </div>

                  {ovario.lesoes.map((lesao, i) => {
                    const result = evaluateORADS(lesao, data.statusMenopausal, oradsOptions as ORADSOptions)
                    const cat = getORADSCategoryFromDB(result.score, oradsOptions as ORADSOptions)
                    
                    // Dynamic lesao_tipica options from database
                    const lesaoTipicaOptions = oradsOptions?.lesao_tipica || Object.entries(lesoesTipicasBenignas).map(([k, v]) => ({
                      value: k,
                      label: v.nome,
                      texto: v.descricaoCompleta
                    }))
                    
                    // Mapa de conversão para valores do banco
                    const valorToBancoMap: Record<string, string> = {
                      'cisto_hemorragico': 'hemorragico',
                      'cisto_dermoide': 'dermoide',
                      'endometrioma': 'endometrioma',
                      'cisto_paraovarian': 'cisto_paratubal',
                      'cisto_inclusao_peritoneal': 'cisto_peritoneal',
                      'hidrossalpinge': 'hidrossalpinge'
                    }
                    
                    const bancoToValorMap: Record<string, string> = {
                      'hemorragico': 'cisto_hemorragico',
                      'dermoide': 'cisto_dermoide',
                      'endometrioma': 'endometrioma',
                      'cisto_paratubal': 'cisto_paraovarian',
                      'cisto_peritoneal': 'cisto_inclusao_peritoneal',
                      'hidrossalpinge': 'hidrossalpinge'
                    }
                    
                    return (
                      <div key={i} className="border rounded-lg p-3 mb-3 space-y-3">
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
                            <Select value={lesao.tipo} onValueChange={(v) => updateLesao(lado, i, { tipo: v as TipoLesaoORADS })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cisto_simples">Cisto simples</SelectItem>
                                <SelectItem value="cisto_unilocular_nao_simples">Cisto unilocular não-simples</SelectItem>
                                <SelectItem value="cisto_bilocular">Cisto bilocular</SelectItem>
                                <SelectItem value="cisto_multilocular">Cisto multilocular</SelectItem>
                                <SelectItem value="cisto_unilocular_irregular">Cisto unilocular irregular</SelectItem>
                                <SelectItem value="cisto_bilocular_irregular">Cisto bilocular irregular</SelectItem>
                                <SelectItem value="solido">Lesão sólida</SelectItem>
                                <SelectItem value="lesao_tipica_benigna">Lesão típica benigna</SelectItem>
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

                        {lesao.tipo === 'lesao_tipica_benigna' && (
                          <div>
                            <Label className="text-xs">Tipo Específico</Label>
                            <Select 
                              value={lesao.lesaoTipica ? valorToBancoMap[lesao.lesaoTipica] || lesao.lesaoTipica : ''} 
                              onValueChange={(v) => updateLesao(lado, i, { lesaoTipica: (bancoToValorMap[v] || v) as LesaoTipicaBenigna })}
                            >
                              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                              <SelectContent>
                                {lesaoTipicaOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {lesao.tipo !== 'cisto_simples' && lesao.tipo !== 'lesao_tipica_benigna' && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Parede Interna</Label>
                                <Select value={lesao.paredeInterna || ''} onValueChange={(v) => updateLesao(lado, i, { paredeInterna: v as any })}>
                                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="lisa">Lisa</SelectItem>
                                    <SelectItem value="irregular">Irregular</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {(lesao.tipo === 'cisto_multilocular' || lesao.tipo === 'cisto_bilocular') && (
                                <div>
                                  <Label className="text-xs">Septações</Label>
                                  <Select value={lesao.septacao || ''} onValueChange={(v) => updateLesao(lado, i, { septacao: v as any })}>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="lisa">Lisas</SelectItem>
                                      <SelectItem value="irregular">Irregulares</SelectItem>
                                      <SelectItem value="ausente">Ausentes</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={lesao.componenteSolido}
                                  onCheckedChange={(v) => updateLesao(lado, i, { componenteSolido: v })}
                                />
                                <Label className="text-xs">Componente sólido</Label>
                              </div>
                              {lesao.componenteSolido && (
                                <div className="flex-1">
                                  <Label className="text-xs">Nº Papilas</Label>
                                  <Select value={String(lesao.numeroPapilas || '')} onValueChange={(v) => updateLesao(lado, i, { numeroPapilas: Number(v) })}>
                                    <SelectTrigger><SelectValue placeholder="N/A" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="3">3</SelectItem>
                                      <SelectItem value="4">≥4</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {lesao.tipo === 'solido' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={lesao.sombra || false}
                                onCheckedChange={(v) => updateLesao(lado, i, { sombra: v })}
                              />
                              <Label className="text-xs">Sombra acústica</Label>
                            </div>
                            <div>
                              <Label className="text-xs">Contorno externo</Label>
                              <Select value={lesao.contornoExterno || ''} onValueChange={(v) => updateLesao(lado, i, { contornoExterno: v as any })}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="liso">Liso</SelectItem>
                                  <SelectItem value="irregular">Irregular</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <div>
                          <Label className="text-xs">Color Score (Vascularização)</Label>
                          <Select value={String(lesao.colorScore)} onValueChange={(v) => updateLesao(lado, i, { colorScore: Number(v) as ColorScore })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map(cs => (
                                <SelectItem key={cs} value={String(cs)}>
                                  <div className="flex items-center gap-2">
                                    <Activity size={14} className={cs === 1 ? 'text-gray-400' : cs === 2 ? 'text-green-500' : cs === 3 ? 'text-yellow-500' : 'text-red-500'} />
                                    {getColorScoreDescriptionFromDB(cs as ColorScore, oradsOptions)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {cat.risco} ({cat.riscoNumerico})
                        </p>
                      </div>
                    )
                  })}

                  {ovario.lesoes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma lesão adicionada (O-RADS 1 - Normal)
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )

      case 'liquido':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={data.liquidoLivre.presente}
                onCheckedChange={(v) => updateData({ liquidoLivre: { ...data.liquidoLivre, presente: v } })}
              />
              <Label>Líquido livre presente</Label>
            </div>

            {data.liquidoLivre.presente && (
              <>
                <div>
                  <Label>Quantidade</Label>
                  <Select value={data.liquidoLivre.quantidade || ''} onValueChange={(v) => updateData({ liquidoLivre: { ...data.liquidoLivre, quantidade: v as any } })}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequena">Pequena</SelectItem>
                      <SelectItem value="moderada">Moderada</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Localização</Label>
                  <Select value={data.liquidoLivre.localizacao || ''} onValueChange={(v) => updateData({ liquidoLivre: { ...data.liquidoLivre, localizacao: v } })}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no fundo de saco posterior">Fundo de saco posterior</SelectItem>
                      <SelectItem value="na pelve">Pelve</SelectItem>
                      <SelectItem value="peritoneal difuso">Peritoneal difuso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Aspecto</Label>
                  <Select value={data.liquidoLivre.aspecto || ''} onValueChange={(v) => updateData({ liquidoLivre: { ...data.liquidoLivre, aspecto: v as any } })}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anecoico">Anecóico (simples)</SelectItem>
                      <SelectItem value="ecos_finos">Ecos finos de permeio</SelectItem>
                      <SelectItem value="heterogeneo">Heterogêneo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium text-sm">Achados de Alto Risco (O-RADS 5)</h4>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.ascite}
                  onCheckedChange={(v) => updateData({ ascite: v })}
                />
                <Label>Ascite</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={data.nodulosPeritoneais}
                  onCheckedChange={(v) => updateData({ nodulosPeritoneais: v })}
                />
                <Label>Nodularidade peritoneal</Label>
              </div>
              {(data.ascite || data.nodulosPeritoneais) && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    ⚠️ Achados associados a alto risco de malignidade (O-RADS 5) - Encaminhamento para oncologista ginecológico.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 'anexial':
        return (
          <div className="space-y-4">
            <div>
              <Label>Região Anexial Direita</Label>
              <Textarea
                value={data.regiaoAnexial.direita}
                onChange={(e) => updateData({ regiaoAnexial: { ...data.regiaoAnexial, direita: e.target.value } })}
                placeholder="Achados adicionais na região anexial direita..."
                rows={3}
              />
            </div>
            <div>
              <Label>Região Anexial Esquerda</Label>
              <Textarea
                value={data.regiaoAnexial.esquerda}
                onChange={(e) => updateData({ regiaoAnexial: { ...data.regiaoAnexial, esquerda: e.target.value } })}
                placeholder="Achados adicionais na região anexial esquerda..."
                rows={3}
              />
            </div>
          </div>
        )

      case 'comparativo':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={data.comparativo?.temEstudoAnterior || false}
                onCheckedChange={(v) => updateData({ comparativo: { ...data.comparativo, temEstudoAnterior: v } })}
              />
              <Label>Estudo anterior disponível</Label>
            </div>

            {data.comparativo?.temEstudoAnterior && (
              <>
                <div>
                  <Label>Data do Estudo Anterior</Label>
                  <Input
                    type="date"
                    value={data.comparativo?.dataAnterior || ''}
                    onChange={(e) => updateData({ comparativo: { ...data.comparativo, dataAnterior: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Evolução</Label>
                  <Select value={data.comparativo?.evolucao || ''} onValueChange={(v) => updateData({ comparativo: { ...data.comparativo, evolucao: v as any } })}>
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
                  <Label>Conclusão Anterior</Label>
                  <Textarea
                    value={data.comparativo?.conclusaoAnterior || ''}
                    onChange={(e) => updateData({ comparativo: { ...data.comparativo, conclusaoAnterior: e.target.value } })}
                    placeholder="Conclusão do estudo anterior..."
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
                placeholder="Observações adicionais, limitações técnicas, correlação clínica..."
                rows={6}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Preview content - passar oradsOptions para usar textos dinâmicos
  const previewUtero = generateORADSUteroTexto(data, oradsOptions as ORADSOptions)
  const previewEndometrio = generateORADSEndometrioTexto(data, oradsOptions as ORADSOptions)
  const previewOvarioD = generateORADSOvarioTexto(data.ovarioDireito, 'direito', oradsOptions as ORADSOptions)
  const previewOvarioE = generateORADSOvarioTexto(data.ovarioEsquerdo, 'esquerdo', oradsOptions as ORADSOptions)
  const previewLiquido = generateORADSLiquidoLivreTexto(data, oradsOptions as ORADSOptions)
  const previewAnexial = generateORADSRegiaoAnexialTexto(data, oradsOptions as ORADSOptions)
  const previewImpressao = generateORADSImpressao(data, oradsOptions as ORADSOptions)
  const previewComparativo = data.comparativo?.temEstudoAnterior ? generateORADSComparativoTexto(data, oradsOptions as ORADSOptions) : ''

  // Usar categoria do banco com fallback
  const maxCat = getORADSCategoryFromDB(maxORADS, oradsOptions as ORADSOptions)
  const maxRecomendacao = getORADSRecommendationFromDB(maxORADS, oradsOptions as ORADSOptions)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl h-[90vh] flex flex-col p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Circle className="text-pink-500" size={20} />
              ACR O-RADS US v2022 - Ultrassonografia Transvaginal
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
          </div>
        </DialogHeader>

        <ResizablePanelGroup direction="horizontal" className="flex-1" autoSaveId="orads-layout">
          {/* Tabs Sidebar */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
            <ScrollArea className="h-full">
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

          {/* Form Content */}
          <ResizablePanel defaultSize={showPreview ? 50 : 85} minSize={40}>
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
              <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {/* O-RADS Classification Card */}
                    <div className={`rounded-lg p-4 border-2 ${
                      maxCat.cor === 'green' ? 'bg-green-50 dark:bg-green-950 border-green-500' :
                      maxCat.cor === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500' :
                      maxCat.cor === 'orange' ? 'bg-orange-50 dark:bg-orange-950 border-orange-500' :
                      maxCat.cor === 'red' ? 'bg-red-50 dark:bg-red-950 border-red-500' :
                      'bg-gray-50 dark:bg-gray-950 border-gray-500'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold">{maxCat.name}</span>
                        <Badge className={`${
                          maxCat.cor === 'green' ? 'bg-green-500' :
                          maxCat.cor === 'yellow' ? 'bg-yellow-500' :
                          maxCat.cor === 'orange' ? 'bg-orange-500' :
                          maxCat.cor === 'red' ? 'bg-red-500' : 'bg-gray-500'
                        } text-white`}>
                          {maxCat.riscoNumerico}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{maxCat.risco}</p>
                      <p className="text-xs text-muted-foreground mt-2">{maxRecomendacao}</p>
                    </div>

                    {/* Preview Sections */}
                    <SectionPreview
                      title="Útero"
                      content={previewUtero}
                      status={data.utero.mx > 0 ? 'filled' : 'required'}
                    />
                    <SectionPreview
                      title="Endométrio"
                      content={previewEndometrio}
                      status={data.endometrio.espessura > 0 ? 'filled' : 'required'}
                    />
                    <SectionPreview
                      title="Ovário Direito"
                      content={previewOvarioD}
                      status={data.ovarioDireito.presente && data.ovarioDireito.mx > 0 ? 'filled' : 'optional'}
                    />
                    <SectionPreview
                      title="Ovário Esquerdo"
                      content={previewOvarioE}
                      status={data.ovarioEsquerdo.presente && data.ovarioEsquerdo.mx > 0 ? 'filled' : 'optional'}
                    />
                    <SectionPreview
                      title="Região Anexial"
                      content={previewAnexial}
                      status="optional"
                    />
                    <SectionPreview
                      title="Líquido Livre"
                      content={previewLiquido}
                      status="optional"
                    />
                    {previewComparativo && (
                      <SectionPreview
                        title="Comparativo"
                        content={previewComparativo}
                        status="filled"
                      />
                    )}
                    <SectionPreview
                      title="Impressão"
                      content={previewImpressao}
                      status="filled"
                    />
                  </div>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleInsert}>
            Inserir Laudo Completo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
