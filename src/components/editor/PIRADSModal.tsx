import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { 
  Plus, Trash2, Calendar, AlertCircle, FileText, ClipboardList, FileCheck, 
  Stethoscope, StickyNote, History, Eye, EyeOff, Check, Minus, Activity, 
  Circle, Target, Loader2, Magnet, Info, CircleDot, Boxes, Bone, Droplet,
  TrendingUp, LucideIcon, BookOpen, ImageIcon, LayoutGrid
} from 'lucide-react'
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
  PIRADSData,
  PIRADSLesao,
  piradsCategories,
  prostateSectors,
  t2wScoresPZ,
  t2wScoresTZ,
  dwiScores,
  dceAssessment,
  createEmptyPIRADSData,
  createEmptyPIRADSLesao,
  evaluatePIRADS,
  evaluateLesion,
  calculateProstateVolume,
  calculatePSADensity,
  formatMeasurement,
  generatePIRADSIndicacao,
  generatePIRADSTecnica,
  generatePIRADSRelatorio,
  generatePIRADSImpressao,
  generatePIRADSRecomendacao,
  generatePIRADSComparativo,
  generatePIRADSNotas,
  generatePIRADSLaudoCompletoHTML,
} from '@/lib/piradsClassifications'
import { useRADSOptions, RADSOption } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback } from '@/lib/radsOptionsProvider'
import { PIRADSImageSelector, PIRADSAtlasViewer } from './PIRADSImageSelector'
import { 
  t2wPZAtlas, t2wTZAtlas, dwiAtlas, dceAtlas, 
  piradsInterpretation, scoringAlgorithm 
} from '@/lib/piradsAtlasData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PIRADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'indicacao' | 'tecnica' | 'prostata' | 'lesoes' | 'epe' | 'linfonodos' | 'osso' | 'bexiga' | 'comparativo' | 'recomendacao' | 'notas' | 'atlas'

const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'indicacao', label: 'Indicação', icon: ClipboardList },
  { id: 'tecnica', label: 'Técnica', icon: Magnet },
  { id: 'prostata', label: 'Próstata', icon: Target },
  { id: 'lesoes', label: 'Lesões', icon: AlertCircle },
  { id: 'epe', label: 'EPE/FNV/VS', icon: TrendingUp },
  { id: 'linfonodos', label: 'Linfonodos', icon: Boxes },
  { id: 'osso', label: 'Osso', icon: Bone },
  { id: 'bexiga', label: 'Bexiga', icon: Droplet },
  { id: 'comparativo', label: 'Comparativo', icon: Calendar },
  { id: 'recomendacao', label: 'Recomendação', icon: FileCheck },
  { id: 'notas', label: 'Notas', icon: FileText },
  { id: 'atlas', label: 'Atlas', icon: BookOpen },
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

export function PIRADSModal({ open, onOpenChange, editor }: PIRADSModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('indicacao')
  const [data, setData] = useState<PIRADSData>(createEmptyPIRADSData())
  const [showPreview, setShowPreview] = useState(true)
  const [visualMode, setVisualMode] = useState(false)

  const { data: dbOptions, isLoading, isError } = useRADSOptions('PIRADS')
  
  const options = useMemo(() => 
    getRADSOptionsWithFallback('PIRADS', dbOptions, isLoading, isError),
    [dbOptions, isLoading, isError]
  )

  const getOpts = (categoria: string): RADSOption[] => options[categoria] || []

  const updateData = <K extends keyof PIRADSData>(field: K, value: PIRADSData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // Lesion handlers
  const handleAddLesao = () => {
    if (data.lesoes.length < 6) {
      setData(prev => ({ ...prev, lesoes: [...prev.lesoes, createEmptyPIRADSLesao()] }))
    }
  }

  const handleRemoveLesao = (index: number) => {
    setData(prev => ({ ...prev, lesoes: prev.lesoes.filter((_, i) => i !== index) }))
  }

  const updateLesao = (index: number, field: keyof PIRADSLesao, value: any) => {
    setData(prev => {
      const newLesoes = [...prev.lesoes]
      ;(newLesoes[index] as any)[field] = value
      return { ...prev, lesoes: newLesoes }
    })
  }

  const updateMedida = (lesaoIndex: number, medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => {
      const newLesoes = [...prev.lesoes]
      newLesoes[lesaoIndex].medidas[medidaIndex] = numValue
      return { ...prev, lesoes: newLesoes }
    })
  }

  const updateProstataMedida = (medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => {
      const newMedidas = [...prev.prostataMedidas] as [number, number, number]
      newMedidas[medidaIndex] = numValue
      const volume = calculateProstateVolume(newMedidas)
      const psaDensity = prev.psaTotal > 0 ? calculatePSADensity(prev.psaTotal, volume) : 0
      return { ...prev, prostataMedidas: newMedidas, prostataVolume: volume, psaDensity }
    })
  }

  const updatePSA = (value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => {
      const volume = prev.prostataVolume > 0 ? prev.prostataVolume : calculateProstateVolume(prev.prostataMedidas)
      const psaDensity = volume > 0 ? calculatePSADensity(numValue, volume) : 0
      return { ...prev, psaTotal: numValue, psaDensity }
    })
  }

  const piradsScore = useMemo(() => evaluatePIRADS(data), [data])
  const categoryInfo = piradsCategories.find(c => c.value === piradsScore)

  const indicacaoTexto = useMemo(() => generatePIRADSIndicacao(data), [data])
  const tecnicaTexto = useMemo(() => generatePIRADSTecnica(data), [data])
  const relatorioTexto = useMemo(() => generatePIRADSRelatorio(data), [data])
  const impressaoTexto = useMemo(() => generatePIRADSImpressao(data, piradsScore), [data, piradsScore])
  const recomendacaoTexto = useMemo(() => generatePIRADSRecomendacao(data, piradsScore), [data, piradsScore])
  const comparativoTexto = useMemo(() => generatePIRADSComparativo(data), [data])
  const notasTexto = useMemo(() => generatePIRADSNotas(data), [data])

  const completeness = useMemo(() => {
    let filled = 0
    const total = 11
    if (data.indicacao || data.psaTotal > 0) filled++
    if (data.qualidadeEstudo) filled++
    if (data.prostataMedidas.some(m => m > 0)) filled++
    filled++ // lesoes always counts
    if (data.extensaoExtraprostática) filled++
    if (data.feixesNeurovasculares) filled++
    if (data.vesiculasSeminais) filled++
    if (data.linfonodos) filled++
    if (data.osso) filled++
    if (data.bexiga) filled++
    filled++ // comparativo
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
        .insertContent(generatePIRADSLaudoCompletoHTML(data, piradsScore))
        .run()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setData(createEmptyPIRADSData())
    setActiveTab('indicacao')
  }

  const getCategoryColor = (score: number): string => {
    switch (score) {
      case 1: return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
      case 2: return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
      case 3: return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
      case 4: return 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30'
      case 5: return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'indicacao':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Stethoscope size={16} className="text-indigo-500" />
              Indicação Clínica
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">PSA Total (ng/mL)</Label>
                <Input 
                  type="text"
                  placeholder="0,0"
                  value={data.psaTotal > 0 ? formatMeasurement(data.psaTotal) : ''}
                  onChange={(e) => updatePSA(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data do PSA</Label>
                <Input 
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={data.psaData}
                  onChange={(e) => updateData('psaData', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="biopsia-positiva"
                  checked={data.biopsiaPreviaPositiva}
                  onCheckedChange={(checked) => {
                    updateData('biopsiaPreviaPositiva', !!checked)
                    if (checked) updateData('biopsiaPreviaNegativa', false)
                  }}
                />
                <Label htmlFor="biopsia-positiva" className="cursor-pointer text-sm">Biópsia prévia positiva</Label>
              </div>
              
              {data.biopsiaPreviaPositiva && (
                <div className="ml-6 space-y-1">
                  <Label className="text-xs">Gleason Score</Label>
                  <Input 
                    type="text"
                    placeholder="Ex: Gleason 7 (3+4)"
                    value={data.gleason}
                    onChange={(e) => updateData('gleason', e.target.value)}
                    className="h-9"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="biopsia-negativa"
                  checked={data.biopsiaPreviaNegativa}
                  onCheckedChange={(checked) => {
                    updateData('biopsiaPreviaNegativa', !!checked)
                    if (checked) updateData('biopsiaPreviaPositiva', false)
                  }}
                />
                <Label htmlFor="biopsia-negativa" className="cursor-pointer text-sm">Biópsia prévia negativa</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vigilancia-ativa"
                  checked={data.vigilanciaAtiva}
                  onCheckedChange={(checked) => updateData('vigilanciaAtiva', !!checked)}
                />
                <Label htmlFor="vigilancia-ativa" className="cursor-pointer text-sm">Vigilância ativa</Label>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Informações adicionais</Label>
              <Textarea
                placeholder="Outras informações clínicas relevantes..."
                value={data.biopsiaPrevia}
                onChange={(e) => updateData('biopsiaPrevia', e.target.value)}
                rows={2}
              />
            </div>
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

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bobina"
                  checked={data.bobinaEndorretal}
                  onCheckedChange={(checked) => updateData('bobinaEndorretal', !!checked)}
                />
                <Label htmlFor="bobina" className="cursor-pointer">Bobina endorretal</Label>
              </div>
            </div>

            <Separator />

            <h4 className="font-medium text-sm">Qualidade das Sequências</h4>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dwi-adequado"
                  checked={data.dwiAdequado}
                  onCheckedChange={(checked) => updateData('dwiAdequado', !!checked)}
                />
                <Label htmlFor="dwi-adequado" className="cursor-pointer">DWI adequado para avaliação</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dce-adequado"
                  checked={data.dceAdequado}
                  onCheckedChange={(checked) => updateData('dceAdequado', !!checked)}
                />
                <Label htmlFor="dce-adequado" className="cursor-pointer">DCE adequado para avaliação</Label>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Qualidade do Estudo</Label>
              <Select
                value={data.qualidadeEstudo}
                onValueChange={(v) => updateData('qualidadeEstudo', v)}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="otima">Ótima</SelectItem>
                  <SelectItem value="satisfatoria">Satisfatória</SelectItem>
                  <SelectItem value="limitada">Limitada</SelectItem>
                  <SelectItem value="inadequada">Inadequada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'prostata':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Target size={16} className="text-purple-500" />
              Próstata - Dimensões e Volume
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Comprimento (cm)</Label>
                <Input 
                  type="text"
                  placeholder="0,0"
                  value={data.prostataMedidas[0] > 0 ? formatMeasurement(data.prostataMedidas[0]) : ''}
                  onChange={(e) => updateProstataMedida(0, e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Largura (cm)</Label>
                <Input 
                  type="text"
                  placeholder="0,0"
                  value={data.prostataMedidas[1] > 0 ? formatMeasurement(data.prostataMedidas[1]) : ''}
                  onChange={(e) => updateProstataMedida(1, e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Profundidade (cm)</Label>
                <Input 
                  type="text"
                  placeholder="0,0"
                  value={data.prostataMedidas[2] > 0 ? formatMeasurement(data.prostataMedidas[2]) : ''}
                  onChange={(e) => updateProstataMedida(2, e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {data.prostataVolume > 0 && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Volume Prostático:</span>
                  <span className="font-medium">{formatMeasurement(data.prostataVolume)} cm³</span>
                </div>
                {data.psaDensity > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Densidade PSA:</span>
                    <span className={`font-medium ${data.psaDensity > 0.15 ? 'text-destructive' : 'text-green-600'}`}>
                      {formatMeasurement(data.psaDensity)} ng/mL/cm³
                      {data.psaDensity > 0.15 && ' (elevada)'}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <Label className="text-xs">Protrusão Vesical (mm)</Label>
              <Input 
                type="text"
                placeholder="0"
                value={data.protrusaoVesical > 0 ? data.protrusaoVesical.toString() : ''}
                onChange={(e) => updateData('protrusaoVesical', parseFloat(e.target.value) || 0)}
                className="h-9 w-32"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hemorragia"
                  checked={data.hemorragia}
                  onCheckedChange={(checked) => updateData('hemorragia', !!checked)}
                />
                <Label htmlFor="hemorragia" className="cursor-pointer">Hemorragia pós-biópsia</Label>
              </div>
              {data.hemorragia && (
                <Textarea
                  placeholder="Descrever localização e extensão..."
                  value={data.hemorragiaDescricao}
                  onChange={(e) => updateData('hemorragiaDescricao', e.target.value)}
                  rows={2}
                />
              )}
            </div>
          </div>
        )

      case 'lesoes':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Lesões Suspeitas
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={visualMode ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setVisualMode(!visualMode)}
                  className="h-8 text-xs"
                >
                  {visualMode ? <LayoutGrid size={14} className="mr-1" /> : <ImageIcon size={14} className="mr-1" />}
                  {visualMode ? 'Modo Compacto' : 'Modo Visual'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddLesao} disabled={data.lesoes.length >= 6}>
                  <Plus size={14} className="mr-1" /> Adicionar
                </Button>
              </div>
            </div>

            {data.lesoes.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <CircleDot size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma lesão suspeita identificada.</p>
                <p className="text-xs text-muted-foreground mt-1">Clique em "Adicionar" para registrar uma lesão.</p>
              </div>
            ) : (
              data.lesoes.map((lesao, idx) => (
                <div key={lesao.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Lesão {idx + 1}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(evaluateLesion(lesao))}`}>
                        PI-RADS {evaluateLesion(lesao)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`index-${idx}`}
                          checked={lesao.lesaoIndice}
                          onCheckedChange={(checked) => updateLesao(idx, 'lesaoIndice', !!checked)}
                        />
                        <Label htmlFor={`index-${idx}`} className="text-xs cursor-pointer">Índice</Label>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveLesao(idx)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Zona</Label>
                      <Select value={lesao.zona} onValueChange={(v) => updateLesao(idx, 'zona', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pz">Zona Periférica (PZ)</SelectItem>
                          <SelectItem value="tz">Zona de Transição (TZ)</SelectItem>
                          <SelectItem value="afms">Estroma Fibromuscular Anterior (AFMS)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Setor</Label>
                      <Select value={lesao.setor} onValueChange={(v) => updateLesao(idx, 'setor', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {prostateSectors
                            .filter(s => s.zona === lesao.zona || lesao.zona === 'pz' && s.zona === 'pz' || lesao.zona === 'tz' && s.zona === 'tz')
                            .map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Dim. 1 (mm)</Label>
                      <Input 
                        type="text"
                        placeholder="0"
                        value={lesao.medidas[0] > 0 ? lesao.medidas[0].toString() : ''}
                        onChange={(e) => updateMedida(idx, 0, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dim. 2 (mm)</Label>
                      <Input 
                        type="text"
                        placeholder="0"
                        value={lesao.medidas[1] > 0 ? lesao.medidas[1].toString() : ''}
                        onChange={(e) => updateMedida(idx, 1, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dim. 3 (mm)</Label>
                      <Input 
                        type="text"
                        placeholder="0"
                        value={lesao.medidas[2] > 0 ? lesao.medidas[2].toString() : ''}
                        onChange={(e) => updateMedida(idx, 2, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Visual Mode - Image Selectors */}
                  {visualMode ? (
                    <div className="space-y-4">
                      <PIRADSImageSelector
                        title={`T2W Score (${lesao.zona === 'pz' ? 'Zona Periférica' : 'Zona de Transição'})`}
                        subtitle={lesao.zona === 'pz' ? 'Na PZ, DWI é dominante - T2W é secundário' : 'Na TZ, T2W é dominante'}
                        options={lesao.zona === 'pz' ? t2wPZAtlas : t2wTZAtlas}
                        value={lesao.t2wScore}
                        onChange={(v) => updateLesao(idx, 't2wScore', v as 1|2|3|4|5)}
                        columns={5}
                        showDetailedDescription
                      />
                      
                      <PIRADSImageSelector
                        title="DWI/ADC Score"
                        subtitle={lesao.zona === 'pz' ? 'Sequência DOMINANTE na zona periférica' : 'Pode modificar o score na TZ'}
                        options={dwiAtlas}
                        value={lesao.dwiScore}
                        onChange={(v) => updateLesao(idx, 'dwiScore', v as 1|2|3|4|5)}
                        columns={5}
                        showDetailedDescription
                      />
                      
                      <PIRADSImageSelector
                        title="DCE (Realce Dinâmico)"
                        subtitle="Pode fazer upgrade de PI-RADS 3 → 4 na zona periférica"
                        options={dceAtlas}
                        value={lesao.dcePositivo === true ? 1 : 0}
                        onChange={(v) => updateLesao(idx, 'dcePositivo', v === 1 ? true : false)}
                        columns={3}
                        showDetailedDescription
                      />
                    </div>
                  ) : (
                    /* Compact Mode - Original Selects */
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">T2W Score</Label>
                        <Select 
                          value={lesao.t2wScore.toString()} 
                          onValueChange={(v) => updateLesao(idx, 't2wScore', parseInt(v) as 1|2|3|4|5)}
                        >
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {(lesao.zona === 'pz' ? t2wScoresPZ : t2wScoresTZ).map((s) => (
                              <SelectItem key={s.value} value={s.value.toString()}>
                                <span className="font-medium">{s.value}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">DWI Score</Label>
                        <Select 
                          value={lesao.dwiScore.toString()} 
                          onValueChange={(v) => updateLesao(idx, 'dwiScore', parseInt(v) as 1|2|3|4|5)}
                        >
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {dwiScores.map((s) => (
                              <SelectItem key={s.value} value={s.value.toString()}>
                                <span className="font-medium">{s.value}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">DCE</Label>
                        <Select 
                          value={lesao.dcePositivo === true ? 'positivo' : lesao.dcePositivo === false ? 'negativo' : 'nao_avaliado'} 
                          onValueChange={(v) => updateLesao(idx, 'dcePositivo', v === 'positivo' ? true : v === 'negativo' ? false : null)}
                        >
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {dceAssessment.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Extensão Extra-prostática</Label>
                      <Select value={lesao.epe} onValueChange={(v) => updateLesao(idx, 'epe', v)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nao">Não identificada</SelectItem>
                          <SelectItem value="suspeita">Suspeita</SelectItem>
                          <SelectItem value="definitiva">Definitiva</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end pb-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`invasao-sv-${idx}`}
                          checked={lesao.invasaoSV}
                          onCheckedChange={(checked) => updateLesao(idx, 'invasaoSV', !!checked)}
                        />
                        <Label htmlFor={`invasao-sv-${idx}`} className="text-xs cursor-pointer">Invasão de VS</Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )

      case 'epe':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-500" />
              Extensão Extra-prostática, Feixes e Vesículas
            </h3>

            <div className="space-y-1">
              <Label className="text-xs">Extensão Extra-prostática Global</Label>
              <Select value={data.extensaoExtraprostática} onValueChange={(v) => updateData('extensaoExtraprostática', v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_identificada">Não identificada</SelectItem>
                  <SelectItem value="suspeita">Suspeita de EPE</SelectItem>
                  <SelectItem value="definitiva">EPE definitiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Feixes Neurovasculares</Label>
              <Select value={data.feixesNeurovasculares} onValueChange={(v) => updateData('feixesNeurovasculares', v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="preservados">Preservados, sem sinais de envolvimento</SelectItem>
                  <SelectItem value="suspeito_direito">Suspeita de envolvimento à direita</SelectItem>
                  <SelectItem value="suspeito_esquerdo">Suspeita de envolvimento à esquerda</SelectItem>
                  <SelectItem value="suspeito_bilateral">Suspeita de envolvimento bilateral</SelectItem>
                  <SelectItem value="envolvido_direito">Envolvimento definido à direita</SelectItem>
                  <SelectItem value="envolvido_esquerdo">Envolvimento definido à esquerda</SelectItem>
                  <SelectItem value="envolvido_bilateral">Envolvimento definido bilateral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Vesículas Seminais</Label>
              <Select value={data.vesiculasSeminais} onValueChange={(v) => updateData('vesiculasSeminais', v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normais">Sem alterações</SelectItem>
                  <SelectItem value="suspeita_direita">Suspeita de invasão à direita</SelectItem>
                  <SelectItem value="suspeita_esquerda">Suspeita de invasão à esquerda</SelectItem>
                  <SelectItem value="suspeita_bilateral">Suspeita de invasão bilateral</SelectItem>
                  <SelectItem value="invadida_direita">Invasão definida à direita</SelectItem>
                  <SelectItem value="invadida_esquerda">Invasão definida à esquerda</SelectItem>
                  <SelectItem value="invadida_bilateral">Invasão definida bilateral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'linfonodos':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Boxes size={16} className="text-teal-500" />
              Linfonodos Pélvicos
            </h3>

            <RadioGroup
              value={data.linfonodos}
              onValueChange={(v) => updateData('linfonodos', v)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="sem_linfonodopatia" id="linf-normal" />
                <Label htmlFor="linf-normal" className="cursor-pointer flex-1">Sem linfonodopatia suspeita</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="reativo" id="linf-reativo" />
                <Label htmlFor="linf-reativo" className="cursor-pointer flex-1">Linfonodos de aspecto reativo</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="suspeito" id="linf-suspeito" />
                <Label htmlFor="linf-suspeito" className="cursor-pointer flex-1">Linfonodo(s) suspeito(s) para acometimento secundário</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="patologico" id="linf-patologico" />
                <Label htmlFor="linf-patologico" className="cursor-pointer flex-1">Linfonodopatia francamente patológica</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 'osso':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Bone size={16} className="text-gray-500" />
              Avaliação Óssea
            </h3>

            <RadioGroup
              value={data.osso}
              onValueChange={(v) => updateData('osso', v)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="sem_lesoes" id="osso-normal" />
                <Label htmlFor="osso-normal" className="cursor-pointer flex-1">Não há sinais de lesões ósseas destrutivas</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="degenerativo" id="osso-degenerativo" />
                <Label htmlFor="osso-degenerativo" className="cursor-pointer flex-1">Alterações degenerativas, sem lesões suspeitas</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="suspeito" id="osso-suspeito" />
                <Label htmlFor="osso-suspeito" className="cursor-pointer flex-1">Lesão óssea suspeita para secundarismo</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="metastase" id="osso-metastase" />
                <Label htmlFor="osso-metastase" className="cursor-pointer flex-1">Lesões ósseas compatíveis com metástases</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 'bexiga':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Droplet size={16} className="text-blue-500" />
              Bexiga e Achados Incidentais
            </h3>

            <div className="space-y-1">
              <Label className="text-xs">Bexiga</Label>
              <Select value={data.bexiga} onValueChange={(v) => updateData('bexiga', v)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Moderada repleção, conteúdo homogêneo, paredes normais</SelectItem>
                  <SelectItem value="espessada">Paredes discretamente espessadas</SelectItem>
                  <SelectItem value="trabeculada">Paredes trabeculadas (bexiga de esforço)</SelectItem>
                  <SelectItem value="lesao_parede">Lesão na parede vesical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Uretra Membranosa (mm)</Label>
              <Input 
                type="text"
                placeholder="0"
                value={data.uretraMembranosa > 0 ? data.uretraMembranosa.toString() : ''}
                onChange={(e) => updateData('uretraMembranosa', parseFloat(e.target.value) || 0)}
                className="h-9 w-32"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Achados Incidentais</Label>
              <Textarea
                placeholder="Descrever outros achados (hérnias, cistos, etc.)..."
                value={data.achadosIncidentais}
                onChange={(e) => updateData('achadosIncidentais', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case 'comparativo':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <History size={16} className="text-cyan-500" />
              Estudo Comparativo
            </h3>

            <RadioGroup
              value={data.estudoComparativo}
              onValueChange={(v) => updateData('estudoComparativo', v)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="primeiro_exame" id="comp-primeiro" />
                <Label htmlFor="comp-primeiro" className="cursor-pointer flex-1">Primeiro exame de RM da próstata</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="sem_alteracoes" id="comp-sem" />
                <Label htmlFor="comp-sem" className="cursor-pointer flex-1">Sem alterações significativas em relação ao exame anterior</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="progressao" id="comp-progressao" />
                <Label htmlFor="comp-progressao" className="cursor-pointer flex-1">Progressão de doença</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="nova_lesao" id="comp-nova" />
                <Label htmlFor="comp-nova" className="cursor-pointer flex-1">Nova lesão identificada</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="regressao" id="comp-regressao" />
                <Label htmlFor="comp-regressao" className="cursor-pointer flex-1">Regressão de achados</Label>
              </div>
            </RadioGroup>

            {data.estudoComparativo !== 'primeiro_exame' && (
              <div className="space-y-1">
                <Label className="text-xs">Data do Exame Anterior</Label>
                <Input 
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={data.dataExameAnterior}
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
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FileCheck size={16} className="text-green-500" />
              Recomendação
            </h3>

            <p className="text-sm text-muted-foreground">
              Recomendação automática baseada no PI-RADS calculado: <strong>PI-RADS {piradsScore}</strong>
            </p>

            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              {recomendacaoTexto || 'Aguardando dados...'}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Recomendação Manual (opcional)</Label>
              <Textarea
                placeholder="Sobrescrever recomendação automática..."
                value={data.recomendacaoManual}
                onChange={(e) => updateData('recomendacaoManual', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case 'notas':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <StickyNote size={16} className="text-amber-500" />
              Notas e Observações
            </h3>

            <Textarea
              placeholder="Observações adicionais, limitações do exame, etc..."
              value={data.notas}
              onChange={(e) => updateData('notas', e.target.value)}
              rows={6}
            />
          </div>
        )

      case 'atlas':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" />
              Atlas PI-RADS v2.1 - Referência Visual
            </h3>
            
            <p className="text-xs text-muted-foreground">
              Consulte as características de imagem para cada score de acordo com o ACR PI-RADS v2.1.
            </p>

            <Tabs defaultValue="t2w-pz" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="t2w-pz" className="text-xs py-2">T2W (PZ)</TabsTrigger>
                <TabsTrigger value="t2w-tz" className="text-xs py-2">T2W (TZ)</TabsTrigger>
                <TabsTrigger value="dwi" className="text-xs py-2">DWI/ADC</TabsTrigger>
                <TabsTrigger value="dce" className="text-xs py-2">DCE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="t2w-pz" className="mt-4">
                <PIRADSAtlasViewer
                  title="Scoring T2W - Zona Periférica"
                  description={scoringAlgorithm.pz.description}
                  options={t2wPZAtlas}
                />
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs font-semibold mb-2">Regras de avaliação (PZ):</p>
                  <ul className="text-[11px] space-y-1 text-muted-foreground">
                    {scoringAlgorithm.pz.rules.map((rule, i) => (
                      <li key={i}>• {rule}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="t2w-tz" className="mt-4">
                <PIRADSAtlasViewer
                  title="Scoring T2W - Zona de Transição"
                  description={scoringAlgorithm.tz.description}
                  options={t2wTZAtlas}
                />
                <div className="mt-4 p-3 rounded-lg bg-muted/30 border">
                  <p className="text-xs font-semibold mb-2">Regras de avaliação (TZ):</p>
                  <ul className="text-[11px] space-y-1 text-muted-foreground">
                    {scoringAlgorithm.tz.rules.map((rule, i) => (
                      <li key={i}>• {rule}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="dwi" className="mt-4">
                <PIRADSAtlasViewer
                  title="Scoring DWI/ADC (Universal)"
                  description="O scoring DWI é baseado na intensidade do sinal no mapa ADC e nas imagens de alto valor b. É a sequência DOMINANTE na zona periférica."
                  options={dwiAtlas}
                />
              </TabsContent>
              
              <TabsContent value="dce" className="mt-4">
                <PIRADSAtlasViewer
                  title="Avaliação DCE (Realce Dinâmico)"
                  description="O DCE atua como modificador: pode fazer upgrade de PI-RADS 3 → 4 na zona periférica quando positivo."
                  options={dceAtlas}
                />
              </TabsContent>
            </Tabs>

            <Separator />

            {/* PI-RADS Categories */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Categorias PI-RADS e Probabilidade de Malignidade</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {piradsInterpretation.map((cat) => (
                  <div key={cat.score} className={`p-3 rounded-lg border-2 ${cat.color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold">{cat.score}</span>
                      <span className="text-xs font-semibold">{cat.shortLabel}</span>
                    </div>
                    <p className="text-[10px]">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AFMS Info */}
            <div className="p-3 rounded-lg bg-muted/30 border">
              <h4 className="text-xs font-semibold mb-2">{scoringAlgorithm.afms.title}</h4>
              <p className="text-[11px] text-muted-foreground mb-2">{scoringAlgorithm.afms.description}</p>
              <ul className="text-[10px] space-y-1 text-muted-foreground">
                {scoringAlgorithm.afms.rules.map((rule, i) => (
                  <li key={i}>• {rule}</li>
                ))}
              </ul>
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
        className="max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CircleDot className="h-5 w-5 text-indigo-500" />
              PI-RADS v2.1 - RM Multiparamétrica da Próstata
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? 'Ocultar' : 'Preview'}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(90vh - 140px)' }}>
          {/* Sidebar Tabs */}
          <div className="w-44 border-r bg-muted/30 overflow-y-auto shrink-0">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <tab.icon size={14} />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content + Preview */}
          <ResizablePanelGroup 
            direction="horizontal" 
            autoSaveId="pirads-layout"
            className="flex-1"
          >
            <ResizablePanel defaultSize={65} minSize={40} maxSize={80}>
              <div className="overflow-y-auto p-6 h-full">
                {renderTabContent()}
              </div>
            </ResizablePanel>

            {showPreview && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
                  <div className="border-l bg-muted/20 overflow-y-auto h-full p-4">
                    {/* Classification Card */}
                    <div className={`mb-4 p-3 rounded-lg border-2 ${getCategoryColor(piradsScore)}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">PI-RADS {piradsScore}</span>
                        <span className="text-xs">{categoryInfo?.risk || ''}</span>
                      </div>
                      <p className="text-xs mt-1">{categoryInfo?.description || ''}</p>
                      {data.lesoes.length > 0 && (
                        <p className="text-xs mt-1 opacity-70">{data.lesoes.length} lesão(ões) identificada(s)</p>
                      )}
                    </div>

                    {/* Completeness */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Preenchimento</span>
                        <span>{completeness.filled}/{completeness.total}</span>
                      </div>
                      <Progress value={completeness.percentage} className="h-1.5" />
                    </div>

                    <Separator className="my-3" />

                    {/* Preview Sections */}
                    <SectionPreview title="Indicação" content={indicacaoTexto} hasContent={!!indicacaoTexto} isRequired />
                    <SectionPreview title="Técnica" content={tecnicaTexto} hasContent={!!tecnicaTexto} />
                    {comparativoTexto && <SectionPreview title="Comparação" content={comparativoTexto} hasContent={true} />}
                    <SectionPreview title="Relatório" content={relatorioTexto} hasContent={!!relatorioTexto} isRequired />
                    <SectionPreview title="Impressão" content={impressaoTexto} hasContent={!!impressaoTexto} isRequired />
                    <SectionPreview title="Recomendação" content={recomendacaoTexto} hasContent={!!recomendacaoTexto} />
                    {notasTexto && <SectionPreview title="Notas" content={notasTexto} hasContent={true} />}
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="secondary" onClick={handleInsertImpressao}>
                Inserir Impressão
              </Button>
              <Button onClick={handleInsertLaudoCompleto}>
                Inserir Laudo Completo
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
