import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react'
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
import {
  BIRADSFindingData,
  biradsUSGOptions,
  biradsCategories,
  calculateBIRADSCategory,
  generateBIRADSFindingDescription,
  generateBIRADSImpression,
  createEmptyBIRADSFinding,
  formatMeasurement,
  calcularTempoSeguimento,
  formatarTempoSeguimento,
} from '@/lib/radsClassifications'

interface BIRADSModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

export function BIRADSModal({ open, onOpenChange, editor }: BIRADSModalProps) {
  const [quantidade, setQuantidade] = useState<'um' | 'multiplos'>('um')
  const [achados, setAchados] = useState<BIRADSFindingData[]>([createEmptyBIRADSFinding()])

  const handleQuantidadeChange = (value: 'um' | 'multiplos') => {
    setQuantidade(value)
    if (value === 'um') {
      setAchados([achados[0] || createEmptyBIRADSFinding()])
    }
  }

  const handleAddAchado = () => {
    if (achados.length < 6) {
      setAchados([...achados, createEmptyBIRADSFinding()])
      setQuantidade('multiplos')
    }
  }

  const handleRemoveAchado = (index: number) => {
    if (achados.length > 1) {
      const newAchados = achados.filter((_, i) => i !== index)
      setAchados(newAchados)
      if (newAchados.length === 1) {
        setQuantidade('um')
      }
    }
  }

  const updateAchado = (index: number, field: keyof BIRADSFindingData, value: string | number | boolean | null) => {
    const newAchados = [...achados]
    ;(newAchados[index] as any)[field] = value
    setAchados(newAchados)
  }

  const updateMedida = (achadoIndex: number, medidaIndex: number, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0
    const newAchados = [...achados]
    newAchados[achadoIndex].medidas[medidaIndex] = numValue
    setAchados(newAchados)
  }

  const biradsCategory = useMemo(() => calculateBIRADSCategory(achados), [achados])
  const categoryInfo = biradsCategories.find(c => c.value === biradsCategory || c.value.toString() === biradsCategory.toString())

  const achadosTexto = useMemo(() => {
    return achados.map((achado, index) => generateBIRADSFindingDescription(achado, index)).join('\n\n')
  }, [achados])

  const impressaoTexto = useMemo(() => {
    return generateBIRADSImpression(achados, biradsCategory)
  }, [achados, biradsCategory])

  const handleInsertAchados = () => {
    if (editor) {
      editor.chain().focus().insertContent(achadosTexto.replace(/\n/g, '<br>')).run()
      onOpenChange(false)
    }
  }

  const handleInsertImpressao = () => {
    if (editor) {
      editor.chain().focus().insertContent(impressaoTexto.replace(/\n/g, '<br>')).run()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setQuantidade('um')
    setAchados([createEmptyBIRADSFinding()])
  }

  // Calcular tempo de seguimento para exibição
  const getTempoSeguimento = (achado: BIRADSFindingData) => {
    if (!achado.temComparacao || !achado.dataExameAnterior) return null
    const meses = calcularTempoSeguimento(achado.dataExameAnterior)
    return {
      meses,
      texto: formatarTempoSeguimento(meses),
      suficiente: meses >= 24
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <span>🎀</span>
            ACR BI-RADS® - Ultrassonografia Mamária
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Quantidade de achados */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quantidade de nódulos</Label>
            <div className="flex items-center gap-4">
              <RadioGroup
                value={quantidade}
                onValueChange={(v) => handleQuantidadeChange(v as 'um' | 'multiplos')}
                className="flex gap-4"
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAchado}
                disabled={achados.length >= 6}
                className="ml-auto"
              >
                <Plus size={14} className="mr-1" />
                Adicionar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Achados */}
          {achados.map((achado, index) => {
            const tempoInfo = getTempoSeguimento(achado)
            
            return (
              <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">N{index + 1}</h4>
                  {achados.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAchado(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>

                {/* Seção de Comparação com Exame Anterior */}
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    <Label className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      Comparação com exame anterior
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`comparacao-${index}`}
                      checked={achado.temComparacao}
                      onCheckedChange={(checked) => updateAchado(index, 'temComparacao', !!checked)}
                    />
                    <Label htmlFor={`comparacao-${index}`} className="text-sm cursor-pointer">
                      Disponível comparação com exame anterior
                    </Label>
                  </div>

                  {achado.temComparacao && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Data do exame anterior</Label>
                        <Input
                          type="date"
                          value={achado.dataExameAnterior || ''}
                          onChange={(e) => updateAchado(index, 'dataExameAnterior', e.target.value || null)}
                          className="h-9"
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Estado do nódulo</Label>
                        <Select
                          value={achado.estadoNodulo}
                          onValueChange={(v) => updateAchado(index, 'estadoNodulo', v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
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
                    <div className={`flex items-center gap-2 text-xs mt-2 ${tempoInfo.suficiente ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {tempoInfo.suficiente ? (
                        <>
                          <span>✓</span>
                          <span>Tempo de seguimento: {tempoInfo.texto} (≥ 2 anos - elegível para BI-RADS 2 se estável)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} />
                          <span>Tempo de seguimento: {tempoInfo.texto} (&lt; 2 anos)</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Linha 1: Ecogenicidade, Forma, Margens */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Ecogenicidade</Label>
                    <Select
                      value={achado.ecogenicidade}
                      onValueChange={(v) => updateAchado(index, 'ecogenicidade', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.ecogenicidade.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Forma</Label>
                    <Select
                      value={achado.forma}
                      onValueChange={(v) => updateAchado(index, 'forma', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.forma.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Margens</Label>
                    <Select
                      value={achado.margens}
                      onValueChange={(v) => updateAchado(index, 'margens', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.margens.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Linha 2: Eixo, Sombra */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Orientação (Eixo)</Label>
                    <Select
                      value={achado.eixo}
                      onValueChange={(v) => updateAchado(index, 'eixo', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.eixo.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sombra Acústica</Label>
                    <Select
                      value={achado.sombra}
                      onValueChange={(v) => updateAchado(index, 'sombra', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.sombra.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Linha 3: Localização, Lado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Localização (Hora)</Label>
                    <Select
                      value={achado.localizacao}
                      onValueChange={(v) => updateAchado(index, 'localizacao', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.localizacao.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Lado da Mama</Label>
                    <Select
                      value={achado.lado}
                      onValueChange={(v) => updateAchado(index, 'lado', v)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {biradsUSGOptions.lado.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Linha 4: Medidas */}
                <div className="grid grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Medida X (cm)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatMeasurement(achado.medidas[0])}
                      onChange={(e) => updateMedida(index, 0, e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Medida Y (cm)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatMeasurement(achado.medidas[1])}
                      onChange={(e) => updateMedida(index, 1, e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Medida Z (cm)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatMeasurement(achado.medidas[2])}
                      onChange={(e) => updateMedida(index, 2, e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Dist. Pele (cm)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatMeasurement(achado.distPele)}
                      onChange={(e) => updateAchado(index, 'distPele', parseFloat(e.target.value.replace(',', '.')) || 0)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Dist. Papila (cm)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formatMeasurement(achado.distPapila)}
                      onChange={(e) => updateAchado(index, 'distPapila', parseFloat(e.target.value.replace(',', '.')) || 0)}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          <Separator />

          {/* Classificação */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="mb-2">
                <span className="text-lg font-bold text-primary">
                  Classificação: ACR BI-RADS {biradsCategory}
                </span>
              </div>
            {categoryInfo && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{categoryInfo.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Risco: {categoryInfo.risco}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{categoryInfo.recommendation}</p>
              </div>
            )}
          </div>

          {/* Preview Achados */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">📝 Descrição (Achados)</Label>
            <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap font-mono">
              {achadosTexto}
            </div>
          </div>

          {/* Preview Impressão */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">📋 Impressão</Label>
            <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap font-mono">
              {impressaoTexto}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Limpar
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleInsertImpressao}>
            Inserir Impressão
          </Button>
          <Button onClick={handleInsertAchados}>
            Inserir Achados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
