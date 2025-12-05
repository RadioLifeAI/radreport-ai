import { useState, useMemo } from 'react'
import { Plus, Trash2, Info, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, MinusCircle, Scan } from 'lucide-react'
import { Editor } from '@tiptap/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  NoduleData,
  createEmptyNodule,
  getTIRADSLevel,
  getTIRADSRecommendation,
  generateNoduleDescription,
  generateImpression,
  formatMeasurement,
  ACR_TIRADS_REFERENCE,
  ACR_TIRADS_MAX_NODULES,
} from '@/lib/radsClassifications'
import { useRADSOptions } from '@/hooks/useRADSOptions'
import { getRADSOptionsWithFallback, getTIRADSPoints } from '@/lib/radsOptionsProvider'
import { toast } from 'sonner'

interface TIRADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

// Section Preview Component
function SectionPreview({ 
  title, 
  content, 
  status 
}: { 
  title: string
  content: string
  status: 'filled' | 'required' | 'optional'
}) {
  const getStatusIcon = () => {
    switch (status) {
      case 'filled':
        return <CheckCircle2 size={14} className="text-green-500" />
      case 'required':
        return <AlertCircle size={14} className="text-red-500" />
      case 'optional':
        return <MinusCircle size={14} className="text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-xs font-medium text-muted-foreground uppercase">{title}</span>
      </div>
      {content && (
        <div className="text-xs text-foreground/80 whitespace-pre-wrap pl-5">
          {content}
        </div>
      )}
    </div>
  )
}

export function TIRADSModal({ open, onOpenChange, editor }: TIRADSModalProps) {
  const [quantidade, setQuantidade] = useState<'um' | 'multiplos'>('um')
  const [nodulos, setNodulos] = useState<NoduleData[]>([createEmptyNodule()])
  const [showPreview, setShowPreview] = useState(true)

  // Fetch dynamic options from database
  const { data: dbOptions, isLoading, isError } = useRADSOptions('TIRADS')
  
  // Get options with fallback
  const tiradOptions = useMemo(() => 
    getRADSOptionsWithFallback('TIRADS', dbOptions, isLoading, isError),
    [dbOptions, isLoading, isError]
  )

  // Calculate TI-RADS points for a nodule using dynamic options
  const calculatePoints = (nodulo: NoduleData): number => {
    let points = 0
    points += getTIRADSPoints('composicao', nodulo.composicao, dbOptions)
    points += getTIRADSPoints('ecogenicidade', nodulo.ecogenicidade, dbOptions)
    points += getTIRADSPoints('formato', nodulo.formato, dbOptions)
    points += getTIRADSPoints('margens', nodulo.margens, dbOptions)
    points += getTIRADSPoints('focos', nodulo.focos, dbOptions)
    return points
  }

  const handleQuantidadeChange = (value: 'um' | 'multiplos') => {
    setQuantidade(value)
    if (value === 'um') {
      setNodulos(prev => [prev[0]])
    }
  }

  const handleAddNodulo = () => {
    if (nodulos.length >= ACR_TIRADS_MAX_NODULES) {
      toast.warning(`ACR TI-RADS recomenda avaliar no máximo ${ACR_TIRADS_MAX_NODULES} nódulos (os mais suspeitos, não os maiores)`)
      return
    }
    setNodulos(prev => [...prev, createEmptyNodule()])
  }

  const handleRemoveNodulo = (index: number) => {
    if (index > 0) {
      setNodulos(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateNodulo = (index: number, field: keyof NoduleData, value: any) => {
    setNodulos(prev => prev.map((n, i) => 
      i === index ? { ...n, [field]: value } : n
    ))
  }

  const updateMedida = (noduloIndex: number, medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    setNodulos(prev => prev.map((n, i) => {
      if (i !== noduloIndex) return n
      const newMedidas = [...n.medidas] as [number, number, number]
      newMedidas[medidaIndex] = numValue
      return { ...n, medidas: newMedidas }
    }))
  }

  // Calculate summary for all nodules
  const nodulosSummary = nodulos.map((n, i) => {
    const points = calculatePoints(n)
    const tirads = getTIRADSLevel(points)
    const maxDim = Math.max(...n.medidas)
    const recommendation = getTIRADSRecommendation(tirads.level, maxDim)
    return { index: i, points, tirads, maxDim, recommendation }
  })

  // Get highest TI-RADS level among all nodules
  const highestTIRADS = useMemo(() => {
    return nodulosSummary.reduce((max, n) => 
      n.tirads.level > max.level ? n.tirads : max, 
      { level: 1, category: 'Benigno', risk: '< 2%' }
    )
  }, [nodulosSummary])

  // Generate preview texts
  const previewTexts = useMemo(() => ({
    indicacao: 'Avaliação de nódulo(s) tireoidiano(s).',
    tecnica: 'Exame realizado com transdutor linear de alta frequência.',
    analise: nodulos.map((n, i) => generateNoduleDescription(n, i, dbOptions)).join('\n\n'),
    opiniao: generateImpression(nodulos.length)
  }), [nodulos, dbOptions])

  // Calculate completeness
  const completeness = useMemo(() => {
    let filled = 2 // indicacao and tecnica always filled
    const total = 4
    
    if (nodulos.length > 0 && nodulos[0].medidas.some(m => m > 0)) filled++
    if (previewTexts.opiniao) filled++
    
    return {
      filled,
      total,
      percentage: Math.round((filled / total) * 100)
    }
  }, [nodulos, previewTexts])

  const handleInsertAchados = () => {
    if (!editor) return
    
    const descriptions = nodulos.map((n, i) => generateNoduleDescription(n, i, dbOptions)).join('\n\n')
    
    editor.chain()
      .focus()
      .insertContent(`<p>${descriptions.replace(/\n\n/g, '</p><p>')}</p>`)
      .run()
    
    onOpenChange(false)
  }

  const handleInsertImpressao = () => {
    if (!editor) return
    
    const impression = generateImpression(nodulos.length)
    
    editor.chain()
      .focus()
      .insertContent(`<p>${impression}</p>`)
      .run()
    
    onOpenChange(false)
  }

  const handleInsertLaudoCompleto = () => {
    if (!editor) return
    
    const html = `
      <p><strong>INDICAÇÃO:</strong></p>
      <p>${previewTexts.indicacao}</p>
      <p></p>
      <p><strong>TÉCNICA:</strong></p>
      <p>${previewTexts.tecnica}</p>
      <p></p>
      <p><strong>ANÁLISE:</strong></p>
      <p>${previewTexts.analise.replace(/\n\n/g, '</p><p>')}</p>
      <p></p>
      <p><strong>OPINIÃO:</strong></p>
      <p>${previewTexts.opiniao}</p>
    `
    
    editor.chain()
      .focus()
      .setContent(html)
      .run()
    
    onOpenChange(false)
  }

  const handleReset = () => {
    setQuantidade('um')
    setNodulos([createEmptyNodule()])
  }

  // Get category options with fallback
  const getOptions = (categoria: string) => tiradOptions[categoria] || []

  // Get color classes based on TI-RADS level
  const getTIRADSColorClasses = (level: number) => {
    if (level <= 2) return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
    if (level === 3) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
    if (level === 4) return 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30'
    return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] p-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Scan className="h-5 w-5 text-cyan-500" />
                  ACR TI-RADS - Classificação de Nódulos Tireoidianos
                  {isLoading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">{ACR_TIRADS_REFERENCE}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="hidden sm:inline">{showPreview ? 'Ocultar' : 'Mostrar'} Preview</span>
              </Button>
            </div>
          </DialogHeader>

          {/* Content - 2 columns */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Form Column */}
            <ScrollArea className={`flex-1 ${showPreview ? 'w-2/3' : 'w-full'}`}>
              <div className="p-6 space-y-6">
                {/* Quantidade de nódulos */}
                <div className="space-y-3">
                  <RadioGroup
                    value={quantidade}
                    onValueChange={(v) => handleQuantidadeChange(v as 'um' | 'multiplos')}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="um" id="um" />
                      <Label htmlFor="um" className="cursor-pointer">Um nódulo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiplos" id="multiplos" />
                      <Label htmlFor="multiplos" className="cursor-pointer">Dois ou mais nódulos</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Nódulos */}
                <div className="space-y-4">
                  {nodulos.map((nodulo, noduloIndex) => (
                    <div key={noduloIndex} className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary">Nódulo {noduloIndex + 1}</h4>
                        {noduloIndex > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveNodulo(noduloIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>

                      {/* Row 1: Composição, Ecogenicidade, Formato */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Composição</Label>
                          <Select
                            value={nodulo.composicao}
                            onValueChange={(v) => updateNodulo(noduloIndex, 'composicao', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('composicao').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} ({opt.pontos ?? 0}pt)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Ecogenicidade</Label>
                          <Select
                            value={nodulo.ecogenicidade}
                            onValueChange={(v) => updateNodulo(noduloIndex, 'ecogenicidade', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('ecogenicidade').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} ({opt.pontos ?? 0}pt)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Formato</Label>
                          <Select
                            value={nodulo.formato}
                            onValueChange={(v) => updateNodulo(noduloIndex, 'formato', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('formato').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} ({opt.pontos ?? 0}pt)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 2: Margens, Focos, Localização */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Margens</Label>
                          <Select
                            value={nodulo.margens}
                            onValueChange={(v) => updateNodulo(noduloIndex, 'margens', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('margens').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} ({opt.pontos ?? 0}pt)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Focos ecogênicos</Label>
                          <Select
                            value={nodulo.focos}
                            onValueChange={(v) => updateNodulo(noduloIndex, 'focos', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('focos').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label} ({opt.pontos ?? 0}pt)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Localização</Label>
                          <Select
                            value={nodulo.localizacao}
                            onValueChange={(v) => updateNodulo(noduloIndex, 'localizacao', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOptions('localizacao').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Row 3: Medidas */}
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Medidas (cm)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={formatMeasurement(nodulo.medidas[0])}
                            onChange={(e) => updateMedida(noduloIndex, 0, e.target.value)}
                            className="h-9 w-20 text-center"
                            placeholder="0,0"
                          />
                          <span className="text-muted-foreground">x</span>
                          <Input
                            type="text"
                            value={formatMeasurement(nodulo.medidas[1])}
                            onChange={(e) => updateMedida(noduloIndex, 1, e.target.value)}
                            className="h-9 w-20 text-center"
                            placeholder="0,0"
                          />
                          <span className="text-muted-foreground">x</span>
                          <Input
                            type="text"
                            value={formatMeasurement(nodulo.medidas[2])}
                            onChange={(e) => updateMedida(noduloIndex, 2, e.target.value)}
                            className="h-9 w-20 text-center"
                            placeholder="0,0"
                          />
                          <span className="text-muted-foreground text-sm">cm</span>
                        </div>
                      </div>

                      {/* TI-RADS Result inline badge */}
                      <div className={`rounded-lg p-3 border ${getTIRADSColorClasses(nodulosSummary[noduloIndex].tirads.level)}`}>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold">
                            TI-RADS {nodulosSummary[noduloIndex].tirads.level}
                          </span>
                          <span className="opacity-80">
                            ({nodulosSummary[noduloIndex].tirads.category})
                          </span>
                          <span className="text-xs bg-background/50 px-2 py-0.5 rounded">
                            {nodulosSummary[noduloIndex].points} pontos
                          </span>
                        </div>
                        <div className="text-xs opacity-80 mt-1 flex items-start gap-1">
                          <Info size={12} className="mt-0.5 shrink-0" />
                          <span>{nodulosSummary[noduloIndex].recommendation}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add nodule button */}
                  {quantidade === 'multiplos' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddNodulo}
                      className="w-full"
                    >
                      <Plus size={16} className="mr-2" />
                      Adicionar nódulo ({nodulos.length + 1})
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Preview Column */}
            {showPreview && (
              <div className="w-1/3 border-l border-border bg-muted/20 flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {/* TI-RADS Classification Card - HIGHLIGHTED */}
                    <div className={`p-4 rounded-lg border-2 text-center ${getTIRADSColorClasses(highestTIRADS.level)}`}>
                      <p className="text-3xl font-bold">TI-RADS {highestTIRADS.level}</p>
                      <p className="text-sm mt-1 font-medium">{highestTIRADS.category}</p>
                      <p className="text-xs mt-1 opacity-80">Risco de malignidade: {highestTIRADS.risk}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Completude</span>
                        <span className="font-medium">{completeness.filled}/{completeness.total}</span>
                      </div>
                      <Progress value={completeness.percentage} className="h-2" />
                    </div>

                    {/* Section Previews */}
                    <div className="space-y-4 pt-2">
                      <SectionPreview
                        title="Indicação"
                        content={previewTexts.indicacao}
                        status="filled"
                      />
                      <SectionPreview
                        title="Técnica"
                        content={previewTexts.tecnica}
                        status="filled"
                      />
                      <SectionPreview
                        title="Análise"
                        content={previewTexts.analise}
                        status={previewTexts.analise ? 'filled' : 'required'}
                      />
                      <SectionPreview
                        title="Opinião"
                        content={previewTexts.opiniao}
                        status={previewTexts.opiniao ? 'filled' : 'optional'}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="ghost" onClick={handleReset}>
                Limpar
              </Button>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button variant="secondary" onClick={handleInsertImpressao}>
                  Inserir Opinião
                </Button>
                <Button variant="secondary" onClick={handleInsertAchados}>
                  Inserir Análise
                </Button>
                <Button onClick={handleInsertLaudoCompleto}>
                  Inserir Laudo Completo
                </Button>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
