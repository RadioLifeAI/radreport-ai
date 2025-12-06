import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, ClipboardList, Activity, Droplet, Circle, Target, StickyNote, Eye, EyeOff, Check, Minus, AlertCircle, Loader2, LucideIcon, Scan } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
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
import { Progress } from '@/components/ui/progress'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { useRADSOptions, RADSOption } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback } from '@/lib/radsOptionsProvider'
import { 
  NoduleData, 
  createEmptyNodule, 
  getTIRADSLevel, 
  getTIRADSRecommendation,
  generateNoduleDescription,
  formatMeasurement 
} from '@/lib/radsClassifications'
import { getTIRADSPoints } from '@/lib/radsOptionsProvider'

interface USTireoideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

type TabType = 'indicacao' | 'tireoide' | 'cistos' | 'nodulos' | 'linfonodos' | 'notas'

const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: 'indicacao', label: 'Indicação', icon: ClipboardList },
  { id: 'tireoide', label: 'Tireoide', icon: Activity },
  { id: 'cistos', label: 'Cistos', icon: Droplet },
  { id: 'nodulos', label: 'Nódulos', icon: Circle },
  { id: 'linfonodos', label: 'Linfonodos', icon: Target },
  { id: 'notas', label: 'Notas', icon: StickyNote },
]

// Types
interface USTireoideCisto {
  tipo: string
  localizacao: string
  terco: string
  medida: number
}

interface USTireoideLinfonodo {
  nivel: string
  lateralidade: string
  morfologia: string
  medidaMaior: number
  medidaMenor: number
}

interface USTireoideMedidas {
  loboDireito: { x: number; y: number; z: number }
  loboEsquerdo: { x: number; y: number; z: number }
  istmo: number
}

interface USTireoideData {
  indicacao: string
  indicacaoOutras: string
  statusTireoide: 'normal' | 'tireoidopatia' | 'tireoidectomia_total' | 'tireoidectomia_parcial_direita' | 'tireoidectomia_parcial_esquerda'
  dimensoes: string
  contornos: string
  ecotextura: string
  vascularizacao: string
  medidas: USTireoideMedidas
  temCistos: boolean
  cistos: USTireoideCisto[]
  temNodulos: boolean
  nodulos: NoduleData[]
  linfonodoStatus: 'normal' | 'linfonodomegalia' | 'proeminentes'
  linfonodos: USTireoideLinfonodo[]
  achadosAdicionais: string
  notas: string
}

// Section preview component
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

// Helper functions
const createEmptyData = (): USTireoideData => ({
  indicacao: '',
  indicacaoOutras: '',
  statusTireoide: 'normal',
  dimensoes: 'normais',
  contornos: 'preservados',
  ecotextura: 'homogenea',
  vascularizacao: 'normal',
  medidas: {
    loboDireito: { x: 0, y: 0, z: 0 },
    loboEsquerdo: { x: 0, y: 0, z: 0 },
    istmo: 0,
  },
  temCistos: false,
  cistos: [],
  temNodulos: false,
  nodulos: [],
  linfonodoStatus: 'normal',
  linfonodos: [],
  achadosAdicionais: '',
  notas: '',
})

const createEmptyCisto = (): USTireoideCisto => ({
  tipo: '' as any,
  localizacao: '' as any,
  terco: '' as any,
  medida: 0,
})

const createEmptyLinfonodo = (): USTireoideLinfonodo => ({
  nivel: '' as any,
  lateralidade: '' as any,
  morfologia: '' as any,
  medidaMaior: 0,
  medidaMenor: 0,
})

// Volume calculation: x * y * z * 0.52 (cm³)
const calcularVolume = (x: number, y: number, z: number): number => {
  return x * y * z * 0.52
}

// Text generation functions
const generateIndicacao = (data: USTireoideData, options: Record<string, RADSOption[]>): string => {
  if (data.indicacao === 'outras' && data.indicacaoOutras) {
    return data.indicacaoOutras
  }
  const opt = options['indicacao']?.find(o => o.value === data.indicacao)
  return opt?.texto || ''
}

const generateTecnica = (): string => {
  return 'Exame realizado com transdutor linear de alta frequência.'
}

const generateAchados = (data: USTireoideData, options: Record<string, RADSOption[]>, tiradOptions: Record<string, RADSOption[]>): string => {
  const lines: string[] = []
  
  // Status based text
  if (data.statusTireoide === 'tireoidectomia_total') {
    lines.push('Tireoide não caracterizada (status pós-tireoidectomia total).')
  } else if (data.statusTireoide === 'tireoidectomia_parcial_direita') {
    lines.push('Lobo direito não caracterizado (status pós-tireoidectomia parcial).')
    const volE = calcularVolume(data.medidas.loboEsquerdo.x, data.medidas.loboEsquerdo.y, data.medidas.loboEsquerdo.z)
    lines.push(`Lobo esquerdo remanescente medindo ${formatMeasurement(data.medidas.loboEsquerdo.x)} x ${formatMeasurement(data.medidas.loboEsquerdo.y)} x ${formatMeasurement(data.medidas.loboEsquerdo.z)} cm (volume = ${formatMeasurement(volE)} cm³).`)
    lines.push(`Istmo medindo ${formatMeasurement(data.medidas.istmo)} cm.`)
  } else if (data.statusTireoide === 'tireoidectomia_parcial_esquerda') {
    const volD = calcularVolume(data.medidas.loboDireito.x, data.medidas.loboDireito.y, data.medidas.loboDireito.z)
    lines.push(`Lobo direito remanescente medindo ${formatMeasurement(data.medidas.loboDireito.x)} x ${formatMeasurement(data.medidas.loboDireito.y)} x ${formatMeasurement(data.medidas.loboDireito.z)} cm (volume = ${formatMeasurement(volD)} cm³).`)
    lines.push('Lobo esquerdo não caracterizado (status pós-tireoidectomia parcial).')
    lines.push(`Istmo medindo ${formatMeasurement(data.medidas.istmo)} cm.`)
  } else {
    // Normal or tireoidopatia
    const dimensoesOpt = options['dimensoes']?.find(o => o.value === data.dimensoes)
    const contornosOpt = options['contornos']?.find(o => o.value === data.contornos)
    const ecotexturaOpt = options['ecotextura']?.find(o => o.value === data.ecotextura)
    const vascOpt = options['vascularizacao']?.find(o => o.value === data.vascularizacao)
    
    if (data.statusTireoide === 'tireoidopatia') {
      lines.push(`Tireoide de dimensões ${dimensoesOpt?.texto || data.dimensoes}, contornos ${contornosOpt?.texto || data.contornos}, ecotextura ${ecotexturaOpt?.texto || data.ecotextura} e vascularização ${vascOpt?.texto || data.vascularizacao}.`)
    } else {
      lines.push('Tireoide de dimensões, contornos, ecotextura e vascularização normais.')
    }
    
    const volD = calcularVolume(data.medidas.loboDireito.x, data.medidas.loboDireito.y, data.medidas.loboDireito.z)
    const volE = calcularVolume(data.medidas.loboEsquerdo.x, data.medidas.loboEsquerdo.y, data.medidas.loboEsquerdo.z)
    const volTotal = volD + volE
    
    lines.push(`Lobo direito medindo ${formatMeasurement(data.medidas.loboDireito.x)} x ${formatMeasurement(data.medidas.loboDireito.y)} x ${formatMeasurement(data.medidas.loboDireito.z)} cm (volume = ${formatMeasurement(volD)} cm³).`)
    lines.push(`Lobo esquerdo medindo ${formatMeasurement(data.medidas.loboEsquerdo.x)} x ${formatMeasurement(data.medidas.loboEsquerdo.y)} x ${formatMeasurement(data.medidas.loboEsquerdo.z)} cm (volume = ${formatMeasurement(volE)} cm³).`)
    lines.push(`Istmo medindo ${formatMeasurement(data.medidas.istmo)} cm.`)
    lines.push(`Volume tireoidiano total estimado: ${formatMeasurement(volTotal)} cm³.`)
  }
  
  // Cistos
  if (data.temCistos && data.cistos.length > 0) {
    lines.push('')
    data.cistos.forEach((cisto, i) => {
      const tipoOpt = options['cisto_tipo']?.find(o => o.value === cisto.tipo)
      const locOpt = options['cisto_localizacao']?.find(o => o.value === cisto.localizacao)
      const tercoOpt = options['terco']?.find(o => o.value === cisto.terco)
      lines.push(`Cisto ${tipoOpt?.texto || cisto.tipo} ${locOpt?.texto || cisto.localizacao}, no ${tercoOpt?.texto || cisto.terco}, medindo ${formatMeasurement(cisto.medida)} cm.`)
    })
  }
  
  // Nódulos (TI-RADS)
  if (data.temNodulos && data.nodulos.length > 0) {
    lines.push('')
    data.nodulos.forEach((nodulo, i) => {
      lines.push(generateNoduleDescription(nodulo, i, tiradOptions))
    })
  }
  
  // Linfonodos
  lines.push('')
  if (data.linfonodoStatus === 'normal') {
    lines.push('Cadeias linfonodais cervicais sem linfonodomegalias.')
  } else if (data.linfonodoStatus === 'proeminentes') {
    lines.push('Linfonodos cervicais de aspecto proeminente, porém sem características suspeitas.')
  } else if (data.linfonodos.length > 0) {
    data.linfonodos.forEach((linf, i) => {
      const nivelOpt = options['linfonodo_nivel']?.find(o => o.value === linf.nivel)
      const latOpt = options['linfonodo_lateralidade']?.find(o => o.value === linf.lateralidade)
      const morfOpt = options['linfonodo_morfologia']?.find(o => o.value === linf.morfologia)
      lines.push(`Linfonodo nível ${nivelOpt?.texto || linf.nivel} ${latOpt?.texto || linf.lateralidade}, de aspecto ${morfOpt?.texto || linf.morfologia}, medindo ${formatMeasurement(linf.medidaMaior)} x ${formatMeasurement(linf.medidaMenor)} cm.`)
    })
  }
  
  // Achados adicionais
  if (data.achadosAdicionais) {
    lines.push('')
    lines.push(data.achadosAdicionais)
  }
  
  return lines.join('\n')
}

const generateImpressao = (data: USTireoideData, tiradOptions: Record<string, RADSOption[]>): string => {
  const items: string[] = []
  
  if (data.statusTireoide === 'tireoidectomia_total') {
    items.push('- Status pós-tireoidectomia total.')
    return items.join('\n')
  }
  
  if (data.statusTireoide === 'tireoidectomia_parcial_direita') {
    items.push('- Status pós-tireoidectomia parcial direita.')
  } else if (data.statusTireoide === 'tireoidectomia_parcial_esquerda') {
    items.push('- Status pós-tireoidectomia parcial esquerda.')
  }
  
  if (data.statusTireoide === 'tireoidopatia') {
    items.push('- Sinais de tireoidopatia parenquimatosa.')
  }
  
  // Cistos
  if (data.temCistos && data.cistos.length > 0) {
    if (data.cistos.length === 1) {
      items.push('- Cisto tireoidiano.')
    } else {
      items.push('- Cistos tireoidianos.')
    }
  }
  
  // Nódulos com TI-RADS
  if (data.temNodulos && data.nodulos.length > 0) {
    const nodulosComTIRADS = data.nodulos.map((n, i) => {
      const points = getTIRADSPoints('composicao', n.composicao, tiradOptions || {}) +
                     getTIRADSPoints('ecogenicidade', n.ecogenicidade, tiradOptions || {}) +
                     getTIRADSPoints('formato', n.formato, tiradOptions || {}) +
                     getTIRADSPoints('margens', n.margens, tiradOptions || {}) +
                     getTIRADSPoints('focos', n.focos, tiradOptions || {})
      const tirads = getTIRADSLevel(points)
      const maxDim = Math.max(...n.medidas)
      const rec = getTIRADSRecommendation(tirads.level, maxDim)
      return { index: i + 1, tirads, recommendation: rec }
    })
    
    if (nodulosComTIRADS.length === 1) {
      const n = nodulosComTIRADS[0]
      items.push(`- Nódulo tireoidiano ACR TI-RADS ${n.tirads.level}. ${n.recommendation}.`)
    } else {
      items.push('- Nódulos tireoidianos conforme classificação ACR TI-RADS:')
      nodulosComTIRADS.forEach(n => {
        items.push(`  • N${n.index}: TR${n.tirads.level}. ${n.recommendation}.`)
      })
    }
  }
  
  // Linfonodos
  if (data.linfonodoStatus === 'linfonodomegalia') {
    items.push('- Linfonodomegalia cervical.')
  } else if (data.linfonodoStatus === 'proeminentes') {
    items.push('- Linfonodos cervicais proeminentes, de aspecto reacional.')
  }
  
  // Se não há achados significativos
  if (items.length === 0) {
    items.push('- Estudo ultrassonográfico da tireoide dentro dos limites da normalidade.')
  }
  
  return items.join('\n')
}

const generateLaudoHTML = (data: USTireoideData, options: Record<string, RADSOption[]>, tiradOptions: Record<string, RADSOption[]>): string => {
  const indicacao = generateIndicacao(data, options)
  const tecnica = generateTecnica()
  const achados = generateAchados(data, options, tiradOptions)
  const impressao = generateImpressao(data, tiradOptions)
  const notas = data.notas
  
  let html = `<h2 style="text-align: center; text-transform: uppercase; margin-bottom: 18pt;">ULTRASSONOGRAFIA DA TIREOIDE</h2>`
  
  if (indicacao) {
    html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">INDICAÇÃO CLÍNICA</h3>`
    html += `<p style="text-align: justify; margin: 6pt 0;">${indicacao}</p>`
  }
  
  html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">TÉCNICA</h3>`
  html += `<p style="text-align: justify; margin: 6pt 0;">${tecnica}</p>`
  
  html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">ANÁLISE</h3>`
  html += `<p style="text-align: justify; margin: 6pt 0;">${achados.replace(/\n/g, '<br>')}</p>`
  
  html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">OPINIÃO</h3>`
  html += `<p style="text-align: justify; margin: 6pt 0;">${impressao.replace(/\n/g, '<br>')}</p>`
  
  if (notas) {
    html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">NOTAS</h3>`
    html += `<p style="text-align: justify; margin: 6pt 0;">${notas.replace(/\n/g, '<br>')}</p>`
  }
  
  return html
}

export function USTireoideModal({ open, onOpenChange, editor }: USTireoideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('indicacao')
  const [data, setData] = useState<USTireoideData>(createEmptyData())
  const [showPreview, setShowPreview] = useState(true)
  
  // Fetch options from database
  const { data: dbOptions, isLoading, isError } = useRADSOptions('US_TIREOIDE')
  const { data: tiradDbOptions } = useRADSOptions('TIRADS')
  
  const options = useMemo(() => 
    getRADSOptionsWithFallback('US_TIREOIDE', dbOptions, isLoading, isError),
    [dbOptions, isLoading, isError]
  )
  
  const tiradOptions = useMemo(() => 
    getRADSOptionsWithFallback('TIRADS', tiradDbOptions, false, false),
    [tiradDbOptions]
  )
  
  const getOpts = (categoria: string): RADSOption[] => options[categoria] || []
  
  const updateData = <K extends keyof USTireoideData>(field: K, value: USTireoideData[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
  }
  
  const updateMedida = (lobo: 'loboDireito' | 'loboEsquerdo', axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => ({
      ...prev,
      medidas: {
        ...prev.medidas,
        [lobo]: { ...prev.medidas[lobo], [axis]: numValue }
      }
    }))
  }
  
  // Cisto handlers
  const handleAddCisto = () => {
    if (data.cistos.length < 6) {
      setData(prev => ({ ...prev, cistos: [...prev.cistos, createEmptyCisto()], temCistos: true }))
    }
  }
  
  const handleRemoveCisto = (index: number) => {
    setData(prev => {
      const newCistos = prev.cistos.filter((_, i) => i !== index)
      return { ...prev, cistos: newCistos, temCistos: newCistos.length > 0 }
    })
  }
  
  const updateCisto = (index: number, field: keyof USTireoideCisto, value: any) => {
    setData(prev => {
      const newCistos = [...prev.cistos]
      ;(newCistos[index] as any)[field] = value
      return { ...prev, cistos: newCistos }
    })
  }
  
  // Nódulo handlers
  const handleAddNodulo = () => {
    if (data.nodulos.length < 6) {
      setData(prev => ({ ...prev, nodulos: [...prev.nodulos, createEmptyNodule()], temNodulos: true }))
    }
  }
  
  const handleRemoveNodulo = (index: number) => {
    setData(prev => {
      const newNodulos = prev.nodulos.filter((_, i) => i !== index)
      return { ...prev, nodulos: newNodulos, temNodulos: newNodulos.length > 0 }
    })
  }
  
  const updateNodulo = (index: number, field: keyof NoduleData, value: any) => {
    setData(prev => {
      const newNodulos = [...prev.nodulos]
      ;(newNodulos[index] as any)[field] = value
      return { ...prev, nodulos: newNodulos }
    })
  }
  
  const updateNoduloMedida = (noduloIndex: number, medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setData(prev => {
      const newNodulos = [...prev.nodulos]
      const medidas = [...newNodulos[noduloIndex].medidas] as [number, number, number]
      medidas[medidaIndex] = numValue
      newNodulos[noduloIndex] = { ...newNodulos[noduloIndex], medidas }
      return { ...prev, nodulos: newNodulos }
    })
  }
  
  // Linfonodo handlers
  const handleAddLinfonodo = () => {
    if (data.linfonodos.length < 6) {
      setData(prev => ({ ...prev, linfonodos: [...prev.linfonodos, createEmptyLinfonodo()], linfonodoStatus: 'linfonodomegalia' }))
    }
  }
  
  const handleRemoveLinfonodo = (index: number) => {
    setData(prev => {
      const newLinf = prev.linfonodos.filter((_, i) => i !== index)
      return { ...prev, linfonodos: newLinf, linfonodoStatus: newLinf.length > 0 ? 'linfonodomegalia' : 'normal' }
    })
  }
  
  const updateLinfonodo = (index: number, field: keyof USTireoideLinfonodo, value: any) => {
    setData(prev => {
      const newLinf = [...prev.linfonodos]
      ;(newLinf[index] as any)[field] = value
      return { ...prev, linfonodos: newLinf }
    })
  }
  
  // Preview content
  const indicacaoPreview = generateIndicacao(data, options)
  const tecnicaPreview = generateTecnica()
  const achadosPreview = generateAchados(data, options, tiradOptions)
  const impressaoPreview = generateImpressao(data, tiradOptions)
  
  // Progress calculation
  const filledSections = [
    !!indicacaoPreview,
    true, // técnica always filled
    !!achadosPreview,
    !!impressaoPreview,
  ].filter(Boolean).length
  const progress = (filledSections / 4) * 100
  
  // Calculate highest TI-RADS among nodules
  const highestTIRADS = useMemo(() => {
    if (!data.temNodulos || data.nodulos.length === 0) return null
    
    let maxLevel = 1
    let maxCategory = 'Benigno'
    
    data.nodulos.forEach(nodulo => {
      const points = getTIRADSPoints('composicao', nodulo.composicao, tiradOptions || {}) +
                     getTIRADSPoints('ecogenicidade', nodulo.ecogenicidade, tiradOptions || {}) +
                     getTIRADSPoints('formato', nodulo.formato, tiradOptions || {}) +
                     getTIRADSPoints('margens', nodulo.margens, tiradOptions || {}) +
                     getTIRADSPoints('focos', nodulo.focos, tiradOptions || {})
      const tirads = getTIRADSLevel(points)
      if (tirads.level > maxLevel) {
        maxLevel = tirads.level
        maxCategory = tirads.category
      }
    })
    
    return { level: maxLevel, category: maxCategory }
  }, [data.temNodulos, data.nodulos, tiradOptions])
  
  const handleInsertLaudo = () => {
    if (!editor) return
    const html = generateLaudoHTML(data, options, tiradOptions)
    editor.chain().focus().setContent(html).run()
    onOpenChange(false)
  }
  
  const handleReset = () => {
    setData(createEmptyData())
    setActiveTab('indicacao')
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] overflow-hidden p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Scan className="h-5 w-5 text-cyan-500" />
              Ultrassonografia da Tireoide
              {isLoading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1 text-xs"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Sidebar tabs */}
          <div className="w-48 border-r bg-muted/30 overflow-y-auto shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>
          
          {/* Resizable Main Content + Preview */}
          <ResizablePanelGroup 
            direction="horizontal" 
            autoSaveId="us-tireoide-layout"
            className="flex-1"
          >
            {/* Main content */}
            <ResizablePanel defaultSize={showPreview ? 65 : 100} minSize={40} maxSize={80}>
              <div className="overflow-y-auto p-6 h-full">
            {/* INDICAÇÃO */}
            {activeTab === 'indicacao' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-base">Indicação Clínica</h3>
                <div className="space-y-3">
                  <Label>Indicação:</Label>
                  <Select value={data.indicacao} onValueChange={(v) => updateData('indicacao', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a indicação" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOpts('indicacao').map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                      <SelectItem value="outras">Outras...</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {data.indicacao === 'outras' && (
                    <div className="space-y-2">
                      <Label>Especificar:</Label>
                      <Input
                        value={data.indicacaoOutras}
                        onChange={(e) => updateData('indicacaoOutras', e.target.value)}
                        placeholder="Descreva a indicação..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* TIREOIDE */}
            {activeTab === 'tireoide' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-base">Status da Tireoide</h3>
                
                <RadioGroup
                  value={data.statusTireoide}
                  onValueChange={(v) => updateData('statusTireoide', v as USTireoideData['statusTireoide'])}
                  className="space-y-2"
                >
                  {getOpts('status_tireoide').map(opt => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={`status-${opt.value}`} />
                      <Label htmlFor={`status-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {data.statusTireoide === 'tireoidopatia' && (
                  <>
                    <Separator />
                    <h4 className="font-medium text-sm">Características</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dimensões:</Label>
                        <Select value={data.dimensoes} onValueChange={(v) => updateData('dimensoes', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {getOpts('dimensoes').map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Contornos:</Label>
                        <Select value={data.contornos} onValueChange={(v) => updateData('contornos', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {getOpts('contornos').map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ecotextura:</Label>
                        <Select value={data.ecotextura} onValueChange={(v) => updateData('ecotextura', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {getOpts('ecotextura').map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Vascularização:</Label>
                        <Select value={data.vascularizacao} onValueChange={(v) => updateData('vascularizacao', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {getOpts('vascularizacao').map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
                
                {data.statusTireoide !== 'tireoidectomia_total' && (
                  <>
                    <Separator />
                    <h4 className="font-medium text-sm">Medidas</h4>
                    
                    {(data.statusTireoide !== 'tireoidectomia_parcial_direita') && (
                      <div className="space-y-2">
                        <Label>Lobo Direito (X x Y x Z cm):</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={formatMeasurement(data.medidas.loboDireito.x)}
                            onChange={(e) => updateMedida('loboDireito', 'x', e.target.value)}
                            className="w-20 text-center"
                          />
                          <span>x</span>
                          <Input
                            type="text"
                            value={formatMeasurement(data.medidas.loboDireito.y)}
                            onChange={(e) => updateMedida('loboDireito', 'y', e.target.value)}
                            className="w-20 text-center"
                          />
                          <span>x</span>
                          <Input
                            type="text"
                            value={formatMeasurement(data.medidas.loboDireito.z)}
                            onChange={(e) => updateMedida('loboDireito', 'z', e.target.value)}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">
                            Vol: {formatMeasurement(calcularVolume(data.medidas.loboDireito.x, data.medidas.loboDireito.y, data.medidas.loboDireito.z))} cm³
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {(data.statusTireoide !== 'tireoidectomia_parcial_esquerda') && (
                      <div className="space-y-2">
                        <Label>Lobo Esquerdo (X x Y x Z cm):</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={formatMeasurement(data.medidas.loboEsquerdo.x)}
                            onChange={(e) => updateMedida('loboEsquerdo', 'x', e.target.value)}
                            className="w-20 text-center"
                          />
                          <span>x</span>
                          <Input
                            type="text"
                            value={formatMeasurement(data.medidas.loboEsquerdo.y)}
                            onChange={(e) => updateMedida('loboEsquerdo', 'y', e.target.value)}
                            className="w-20 text-center"
                          />
                          <span>x</span>
                          <Input
                            type="text"
                            value={formatMeasurement(data.medidas.loboEsquerdo.z)}
                            onChange={(e) => updateMedida('loboEsquerdo', 'z', e.target.value)}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">
                            Vol: {formatMeasurement(calcularVolume(data.medidas.loboEsquerdo.x, data.medidas.loboEsquerdo.y, data.medidas.loboEsquerdo.z))} cm³
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Istmo (cm):</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={formatMeasurement(data.medidas.istmo)}
                          onChange={(e) => setData(prev => ({ ...prev, medidas: { ...prev.medidas, istmo: parseFloat(e.target.value.replace(',', '.')) || 0 } }))}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* CISTOS */}
            {activeTab === 'cistos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Cistos Tireoidianos</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="temCistos"
                      checked={data.temCistos}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setData(prev => ({ ...prev, temCistos: false, cistos: [] }))
                        } else {
                          handleAddCisto()
                        }
                      }}
                    />
                    <Label htmlFor="temCistos">Presença de cistos</Label>
                  </div>
                </div>
                
                {data.temCistos && (
                  <>
                    {data.cistos.map((cisto, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Cisto {index + 1}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveCisto(index)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Tipo:</Label>
                            <Select value={cisto.tipo} onValueChange={(v) => updateCisto(index, 'tipo', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {getOpts('cisto_tipo').map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Localização:</Label>
                            <Select value={cisto.localizacao} onValueChange={(v) => updateCisto(index, 'localizacao', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {getOpts('cisto_localizacao').map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Terço:</Label>
                            <Select value={cisto.terco} onValueChange={(v) => updateCisto(index, 'terco', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {getOpts('terco').map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Medida (cm):</Label>
                            <Input
                              type="text"
                              value={formatMeasurement(cisto.medida)}
                              onChange={(e) => updateCisto(index, 'medida', parseFloat(e.target.value.replace(',', '.')) || 0)}
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {data.cistos.length < 6 && (
                      <Button variant="outline" size="sm" onClick={handleAddCisto} className="gap-1">
                        <Plus size={14} /> Adicionar Cisto
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* NÓDULOS */}
            {activeTab === 'nodulos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Nódulos Tireoidianos (ACR TI-RADS)</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="temNodulos"
                      checked={data.temNodulos}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setData(prev => ({ ...prev, temNodulos: false, nodulos: [] }))
                        } else {
                          handleAddNodulo()
                        }
                      }}
                    />
                    <Label htmlFor="temNodulos">Presença de nódulos</Label>
                  </div>
                </div>
                
                {data.temNodulos && (
                  <>
                    {data.nodulos.map((nodulo, index) => {
                      const points = getTIRADSPoints('composicao', nodulo.composicao, tiradOptions || {}) +
                                     getTIRADSPoints('ecogenicidade', nodulo.ecogenicidade, tiradOptions || {}) +
                                     getTIRADSPoints('formato', nodulo.formato, tiradOptions || {}) +
                                     getTIRADSPoints('margens', nodulo.margens, tiradOptions || {}) +
                                     getTIRADSPoints('focos', nodulo.focos, tiradOptions || {})
                      const tirads = getTIRADSLevel(points)
                      
                      return (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">Nódulo N{index + 1}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                tirads.level >= 4 ? 'bg-red-100 text-red-700' : 
                                tirads.level === 3 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-green-100 text-green-700'
                              }`}>
                                TR{tirads.level} ({points} pts)
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveNodulo(index)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Composição:</Label>
                              <Select value={nodulo.composicao} onValueChange={(v) => updateNodulo(index, 'composicao', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tiradOptions['composicao']?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Ecogenicidade:</Label>
                              <Select value={nodulo.ecogenicidade} onValueChange={(v) => updateNodulo(index, 'ecogenicidade', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tiradOptions['ecogenicidade']?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Formato:</Label>
                              <Select value={nodulo.formato} onValueChange={(v) => updateNodulo(index, 'formato', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tiradOptions['formato']?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Margens:</Label>
                              <Select value={nodulo.margens} onValueChange={(v) => updateNodulo(index, 'margens', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tiradOptions['margens']?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Focos Ecogênicos:</Label>
                              <Select value={nodulo.focos} onValueChange={(v) => updateNodulo(index, 'focos', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tiradOptions['focos']?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Localização:</Label>
                              <Select value={nodulo.localizacao} onValueChange={(v) => updateNodulo(index, 'localizacao', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tiradOptions['localizacao']?.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Medidas (X x Y x Z cm):</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={formatMeasurement(nodulo.medidas[0])}
                                onChange={(e) => updateNoduloMedida(index, 0, e.target.value)}
                                className="w-20 text-center"
                              />
                              <span>x</span>
                              <Input
                                type="text"
                                value={formatMeasurement(nodulo.medidas[1])}
                                onChange={(e) => updateNoduloMedida(index, 1, e.target.value)}
                                className="w-20 text-center"
                              />
                              <span>x</span>
                              <Input
                                type="text"
                                value={formatMeasurement(nodulo.medidas[2])}
                                onChange={(e) => updateNoduloMedida(index, 2, e.target.value)}
                                className="w-20 text-center"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {data.nodulos.length < 6 && (
                      <Button variant="outline" size="sm" onClick={handleAddNodulo} className="gap-1">
                        <Plus size={14} /> Adicionar Nódulo
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* LINFONODOS */}
            {activeTab === 'linfonodos' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-base">Linfonodos Cervicais</h3>
                
                <RadioGroup
                  value={data.linfonodoStatus}
                  onValueChange={(v) => {
                    updateData('linfonodoStatus', v as USTireoideData['linfonodoStatus'])
                    if (v !== 'linfonodomegalia') {
                      updateData('linfonodos', [])
                    }
                  }}
                  className="space-y-2"
                >
                  {getOpts('linfonodo_status').map(opt => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={`linf-${opt.value}`} />
                      <Label htmlFor={`linf-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {data.linfonodoStatus === 'linfonodomegalia' && (
                  <>
                    <Separator />
                    {data.linfonodos.map((linf, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Linfonodo {index + 1}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveLinfonodo(index)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Nível:</Label>
                            <Select value={linf.nivel} onValueChange={(v) => updateLinfonodo(index, 'nivel', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {getOpts('linfonodo_nivel').map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Lateralidade:</Label>
                            <Select value={linf.lateralidade} onValueChange={(v) => updateLinfonodo(index, 'lateralidade', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {getOpts('linfonodo_lateralidade').map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Morfologia:</Label>
                            <Select value={linf.morfologia} onValueChange={(v) => updateLinfonodo(index, 'morfologia', v)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {getOpts('linfonodo_morfologia').map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Medidas (maior x menor cm):</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={formatMeasurement(linf.medidaMaior)}
                                onChange={(e) => updateLinfonodo(index, 'medidaMaior', parseFloat(e.target.value.replace(',', '.')) || 0)}
                                className="w-20 text-center"
                              />
                              <span>x</span>
                              <Input
                                type="text"
                                value={formatMeasurement(linf.medidaMenor)}
                                onChange={(e) => updateLinfonodo(index, 'medidaMenor', parseFloat(e.target.value.replace(',', '.')) || 0)}
                                className="w-20 text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {data.linfonodos.length < 6 && (
                      <Button variant="outline" size="sm" onClick={handleAddLinfonodo} className="gap-1">
                        <Plus size={14} /> Adicionar Linfonodo
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* NOTAS */}
            {activeTab === 'notas' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-base">Achados Adicionais e Notas</h3>
                
                <div className="space-y-3">
                  <Label>Achados Adicionais:</Label>
                  <Textarea
                    value={data.achadosAdicionais}
                    onChange={(e) => updateData('achadosAdicionais', e.target.value)}
                    placeholder="Outros achados relevantes não contemplados acima..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Notas:</Label>
                  <Textarea
                    value={data.notas}
                    onChange={(e) => updateData('notas', e.target.value)}
                    placeholder="Notas, recomendações ou informações adicionais..."
                    rows={3}
                  />
                </div>
              </div>
            )}
              </div>
            </ResizablePanel>
          
          {/* Preview panel */}
          {showPreview && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={20} maxSize={60}>
                <div className="bg-muted/20 overflow-y-auto p-4 h-full">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">Preview</span>
                      <span className="text-xs text-muted-foreground">{filledSections}/4 seções</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  
                  {/* TI-RADS Classification Card */}
                  {highestTIRADS && (
                    <div className={`p-4 rounded-lg mb-4 text-center ${
                      highestTIRADS.level <= 2 ? 'bg-green-500/20 border border-green-500/30' :
                      highestTIRADS.level === 3 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                      highestTIRADS.level === 4 ? 'bg-orange-500/20 border border-orange-500/30' :
                      'bg-red-500/20 border border-red-500/30'
                    }`}>
                      <p className={`text-2xl font-bold ${
                        highestTIRADS.level <= 2 ? 'text-green-700 dark:text-green-300' :
                        highestTIRADS.level === 3 ? 'text-yellow-700 dark:text-yellow-300' :
                        highestTIRADS.level === 4 ? 'text-orange-700 dark:text-orange-300' :
                        'text-red-700 dark:text-red-300'
                      }`}>
                        TI-RADS {highestTIRADS.level}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {highestTIRADS.category}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {data.nodulos.length} {data.nodulos.length === 1 ? 'nódulo' : 'nódulos'}
                      </p>
                    </div>
                  )}
                  
                  <SectionPreview
                    title="Indicação" 
                    content={indicacaoPreview} 
                    hasContent={!!indicacaoPreview}
                  />
                  <SectionPreview 
                    title="Técnica" 
                    content={tecnicaPreview} 
                    hasContent={true}
                  />
                  <SectionPreview 
                    title="Análise" 
                    content={achadosPreview} 
                    hasContent={!!achadosPreview}
                    isRequired
                  />
                  <SectionPreview 
                    title="Opinião" 
                    content={impressaoPreview} 
                    hasContent={!!impressaoPreview}
                    isRequired
                  />
                  {data.notas && (
                    <SectionPreview 
                      title="Notas" 
                      content={data.notas} 
                      hasContent={true}
                    />
                  )}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" onClick={handleReset}>
              Limpar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInsertLaudo}>
                Inserir Laudo Completo
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
