import { useState } from 'react'
import { Plus, Trash2, Info } from 'lucide-react'
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
import {
  tiradOptions,
  NoduleData,
  createEmptyNodule,
  calculateTIRADSPoints,
  getTIRADSLevel,
  getTIRADSRecommendation,
  generateNoduleDescription,
  generateImpression,
  formatMeasurement,
} from '@/lib/radsClassifications'

interface TIRADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

export function TIRADSModal({ open, onOpenChange, editor }: TIRADSModalProps) {
  const [quantidade, setQuantidade] = useState<'um' | 'multiplos'>('um')
  const [nodulos, setNodulos] = useState<NoduleData[]>([createEmptyNodule()])

  const handleQuantidadeChange = (value: 'um' | 'multiplos') => {
    setQuantidade(value)
    if (value === 'um') {
      setNodulos(prev => [prev[0]])
    }
  }

  const handleAddNodulo = () => {
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

  const handleInsertAchados = () => {
    if (!editor) return
    
    const descriptions = nodulos.map((n, i) => generateNoduleDescription(n, i)).join('\n\n')
    
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

  const handleReset = () => {
    setQuantidade('um')
    setNodulos([createEmptyNodule()])
  }

  // Calculate summary for all nodules
  const nodulosSummary = nodulos.map((n, i) => {
    const points = calculateTIRADSPoints(n)
    const tirads = getTIRADSLevel(points)
    const maxDim = Math.max(...n.medidas)
    const recommendation = getTIRADSRecommendation(tirads.level, maxDim)
    return { index: i, points, tirads, maxDim, recommendation }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            🦋 ACR TI-RADS - Classificação de Nódulos Tireoidianos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                  <h4 className="font-semibold text-primary">N{noduloIndex + 1}</h4>
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
                        {tiradOptions.composicao.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label} ({opt.points}pt)
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
                        {tiradOptions.ecogenicidade.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label} ({opt.points}pt)
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
                        {tiradOptions.formato.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label} ({opt.points}pt)
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
                        {tiradOptions.margens.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label} ({opt.points}pt)
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
                        {tiradOptions.focos.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label} ({opt.points}pt)
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
                        {tiradOptions.localizacao.map(opt => (
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

                {/* TI-RADS Result for this nodule */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-primary">
                      TI-RADS {nodulosSummary[noduloIndex].tirads.level}
                    </span>
                    <span className="text-muted-foreground">
                      ({nodulosSummary[noduloIndex].tirads.category})
                    </span>
                    <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                      {nodulosSummary[noduloIndex].points} pontos
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
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
                Adicionar nódulo (N{nodulos.length + 1})
              </Button>
            )}
          </div>

          {/* Preview sections */}
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">📝 Descrição (Achados):</Label>
              <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap font-mono">
                {nodulos.map((n, i) => generateNoduleDescription(n, i)).join('\n\n')}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">📋 Impressão:</Label>
              <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono">
                {generateImpression(nodulos.length)}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={handleReset}>
            Limpar
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={handleInsertImpressao}>
              Inserir Impressão
            </Button>
            <Button onClick={handleInsertAchados}>
              Inserir Achados
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
