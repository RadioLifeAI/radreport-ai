// Modal for filling template variables before applying template
// Includes technique selection and variable input with real-time preview

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDown, FileText, Calculator, Ruler, Settings2, CalendarIcon, Trash2 } from 'lucide-react'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { TemplateVariable, TemplateVariableValues, TemplateWithVariables, VolumeMeasurement } from '@/types/templateVariables'
import { 
  processTemplateText, 
  getAvailableTechniques, 
  getDefaultTechnique, 
  processConditionalLogic,
  isVolumeVariable,
  createDefaultVolumeMeasurement,
  getVolumeValue,
  calculateEllipsoidVolume
} from '@/utils/templateVariableProcessor'
import { dividirEmSentencas } from '@/utils/templateFormatter'

interface TemplateVariablesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: TemplateWithVariables | null
  onSubmit: (selectedTechniques: string[], variableValues: TemplateVariableValues, removedSections?: string[]) => void
}

export function TemplateVariablesModal({
  open,
  onOpenChange,
  template,
  onSubmit
}: TemplateVariablesModalProps) {
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [values, setValues] = useState<TemplateVariableValues>({})
  const [volumeMeasurements, setVolumeMeasurements] = useState<Record<string, VolumeMeasurement>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [variablesOpen, setVariablesOpen] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [removedSections, setRemovedSections] = useState<string[]>([])

  const availableTechniques = template ? getAvailableTechniques(template) : []
  const hasMultipleTechniques = availableTechniques.length > 1
  const variaveis = template?.variaveis || []

  // Initialize with default values
  useEffect(() => {
    if (open && template) {
      // Set default technique(s) - select first one by default
      const defaultTech = getDefaultTechnique(template)
      setSelectedTechniques(defaultTech ? [defaultTech] : [])

      // Initialize variable values and volume measurements
      const initialValues: TemplateVariableValues = {}
      const initialVolumeMeasurements: Record<string, VolumeMeasurement> = {}
      
      variaveis.forEach(v => {
        if (v.valor_padrao !== undefined && v.valor_padrao !== null) {
          initialValues[v.nome] = v.valor_padrao
        }
        // Initialize volume measurements for volume-type variables
        if (isVolumeVariable(v)) {
          initialVolumeMeasurements[v.nome] = createDefaultVolumeMeasurement()
        }
      })
      
      setValues(initialValues)
      setVolumeMeasurements(initialVolumeMeasurements)
      setErrors({})
      setPreviewOpen(true)
      setRemovedSections([])
    }
  }, [open, template, variaveis])

  // Generate preview HTML with removable sections
  const previewSections = useMemo(() => {
    if (!template) return []

    // Process conditional logic to derive additional variables
    const processedValues = processConditionalLogic(template.condicoes_logicas, values)

    // Process each section with variable substitution (including derived variables)
    const processedAchados = processTemplateText(template.conteudo.achados, processedValues)
    const processedImpressao = processTemplateText(template.conteudo.impressao, processedValues)
    const processedAdicionais = template.conteudo.adicionais 
      ? processTemplateText(template.conteudo.adicionais, processedValues)
      : ''

    // Get combined technique text from all selected techniques
    const tecnicaText = selectedTechniques
      .map(tech => template.conteudo.tecnica[tech])
      .filter(Boolean)
      .map(text => processTemplateText(text, processedValues))
      .join(' ')

    // Build sections array with ids for removal tracking
    const sections: { id: string; html: string; label: string }[] = []
    
    sections.push({
      id: 'titulo',
      label: 'Título',
      html: `<h2 style="text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 12pt;">${template.titulo}</h2>`
    })
    
    if (tecnicaText) {
      sections.push({
        id: 'tecnica',
        label: 'Técnica',
        html: `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">TÉCNICA</h3>${dividirEmSentencas(tecnicaText)}`
      })
    }
    
    sections.push({
      id: 'achados',
      label: 'Achados',
      html: `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">ACHADOS</h3>${dividirEmSentencas(processedAchados)}`
    })
    
    sections.push({
      id: 'impressao',
      label: 'Impressão',
      html: `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">IMPRESSÃO</h3>${dividirEmSentencas(processedImpressao)}`
    })
    
    if (processedAdicionais) {
      sections.push({
        id: 'adicionais',
        label: 'Adicionais',
        html: `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">ADICIONAIS</h3>${dividirEmSentencas(processedAdicionais)}`
      })
    }

    return sections
  }, [template, selectedTechniques, values])

  // Filter out removed sections for final HTML
  const previewHtml = useMemo(() => {
    return previewSections
      .filter(section => !removedSections.includes(section.id))
      .map(section => section.html)
      .join('')
  }, [previewSections, removedSections])

  const toggleSectionRemoval = (sectionId: string) => {
    setRemovedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleValueChange = (nome: string, value: string | number | boolean) => {
    setValues(prev => ({ ...prev, [nome]: value }))
    // Clear error for this field
    if (errors[nome]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[nome]
        return newErrors
      })
    }
  }

  // Handle volume measurement changes
  const handleVolumeMeasurementChange = (
    nome: string, 
    field: keyof VolumeMeasurement, 
    value: number | boolean
  ) => {
    setVolumeMeasurements(prev => {
      const currentMeasurement = prev[nome] || createDefaultVolumeMeasurement()
      const updated = { ...currentMeasurement, [field]: value }
      
      // Update the values object with calculated volume
      const volumeValue = getVolumeValue(updated)
      setValues(prevValues => ({ ...prevValues, [nome]: volumeValue }))
      
      return { ...prev, [nome]: updated }
    })
    
    // Clear error for this field
    if (errors[nome]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[nome]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    variaveis.forEach(v => {
      if (v.obrigatorio) {
        const value = values[v.nome]
        if (value === undefined || value === null || value === '') {
          newErrors[v.nome] = 'Campo obrigatório'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    // Process conditional logic before submitting
    const processedValues = processConditionalLogic(template?.condicoes_logicas, values)
    onSubmit(selectedTechniques, processedValues, removedSections)
    onOpenChange(false)
  }

  const renderField = (variable: TemplateVariable) => {
    const value = values[variable.nome]
    const error = errors[variable.nome]

    // Check if this is a volume variable (by type or detection)
    if (variable.tipo === 'volume' || isVolumeVariable(variable)) {
      const measurement = volumeMeasurements[variable.nome] || createDefaultVolumeMeasurement()
      const calculatedVolume = calculateEllipsoidVolume(measurement.x, measurement.y, measurement.z)
      const displayVolume = measurement.useCalculated ? calculatedVolume : measurement.directVolume
      
      return (
        <div key={variable.nome} className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {variable.descricao || variable.nome}
              <span className="text-muted-foreground ml-1">({variable.unidade || 'cm³'})</span>
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2 text-xs">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
              <span className={measurement.useCalculated ? 'text-cyan-500 font-medium' : 'text-muted-foreground'}>
                Medidas
              </span>
              <Switch
                checked={!measurement.useCalculated}
                onCheckedChange={(checked) => handleVolumeMeasurementChange(variable.nome, 'useCalculated', !checked)}
                className="h-4 w-7"
              />
              <span className={!measurement.useCalculated ? 'text-cyan-500 font-medium' : 'text-muted-foreground'}>
                Direto
              </span>
              <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {measurement.useCalculated ? (
            // X, Y, Z measurement inputs with auto calculation
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">X (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={measurement.x || ''}
                    onChange={(e) => handleVolumeMeasurementChange(variable.nome, 'x', parseFloat(e.target.value) || 0)}
                    placeholder="0,0"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={measurement.y || ''}
                    onChange={(e) => handleVolumeMeasurementChange(variable.nome, 'y', parseFloat(e.target.value) || 0)}
                    placeholder="0,0"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Z (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={measurement.z || ''}
                    onChange={(e) => handleVolumeMeasurementChange(variable.nome, 'z', parseFloat(e.target.value) || 0)}
                    placeholder="0,0"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calculator className="h-3 w-3" />
                Fórmula elipsoide: L × W × H × 0,52 = 
                <span className="font-semibold text-cyan-500">
                  {calculatedVolume.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} cm³
                </span>
              </p>
            </div>
          ) : (
            // Direct volume input
            <div className="space-y-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                value={measurement.directVolume || ''}
                onChange={(e) => handleVolumeMeasurementChange(variable.nome, 'directVolume', parseFloat(e.target.value) || 0)}
                placeholder="0,0"
                className={error ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Volume informado pelo equipamento ou medido diretamente
              </p>
            </div>
          )}

          {/* Display final volume */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Volume final:</span>
            <span className="text-lg font-bold text-cyan-500">
              {displayVolume.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {variable.unidade || 'cm³'}
            </span>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )
    }

    switch (variable.tipo) {
      case 'texto':
        return (
          <div key={variable.nome} className="space-y-2">
            <Label htmlFor={variable.nome}>
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={variable.nome}
              value={value?.toString() || ''}
              onChange={(e) => handleValueChange(variable.nome, e.target.value)}
              placeholder={variable.valor_padrao?.toString() || ''}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      case 'numero':
        return (
          <div key={variable.nome} className="space-y-2">
            <Label htmlFor={variable.nome}>
              {variable.descricao || variable.nome}
              {variable.unidade && <span className="text-muted-foreground ml-1">({variable.unidade})</span>}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
              {(variable.minimo !== undefined || variable.maximo !== undefined) && (
                <span className="text-xs text-muted-foreground ml-2">
                  [{variable.minimo ?? '...'} - {variable.maximo ?? '...'}]
                </span>
              )}
            </Label>
            <Input
              id={variable.nome}
              type="number"
              min={variable.minimo}
              max={variable.maximo}
              step="0.1"
              value={value?.toString() || ''}
              onChange={(e) => handleValueChange(variable.nome, parseFloat(e.target.value) || 0)}
              placeholder={variable.valor_padrao?.toString() || '0'}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={variable.nome} className="space-y-2">
            <Label htmlFor={variable.nome}>
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value?.toString() || ''}
              onValueChange={(val) => handleValueChange(variable.nome, val)}
            >
              <SelectTrigger className={error ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {variable.opcoes?.map((opcao) => (
                  <SelectItem key={opcao} value={opcao}>
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      case 'boolean':
        return (
          <div key={variable.nome} className="flex items-center justify-between space-y-2">
            <Label htmlFor={variable.nome}>
              {variable.descricao || variable.nome}
            </Label>
            <Switch
              id={variable.nome}
              checked={!!value}
              onCheckedChange={(checked) => handleValueChange(variable.nome, checked)}
            />
          </div>
        )

      case 'data':
        // Parse the stored date string (DD/MM/YYYY) back to Date object for Calendar
        const templateDateValue = value ? parse(value as string, 'dd/MM/yyyy', new Date()) : undefined
        const isTemplateValidDate = templateDateValue && !isNaN(templateDateValue.getTime())
        
        return (
          <div key={variable.nome} className="space-y-2">
            <Label htmlFor={variable.nome}>
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !isTemplateValidDate && "text-muted-foreground",
                    error && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isTemplateValidDate 
                    ? format(templateDateValue, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecione a data..."
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={isTemplateValidDate ? templateDateValue : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleValueChange(variable.nome, format(date, "dd/MM/yyyy"))
                    }
                  }}
                  locale={ptBR}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-500" />
            {template.titulo}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {template.modalidade} • {template.regiao}
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 [&>[data-radix-scroll-area-viewport]]:scroll-smooth [&_[data-orientation=vertical]]:w-2 [&_[data-orientation=vertical]]:bg-muted/50 [&_[data-orientation=vertical]]:rounded-full [&_[data-orientation=vertical]_>_div]:bg-cyan-500/40 [&_[data-orientation=vertical]_>_div]:hover:bg-cyan-500/60 [&_[data-orientation=vertical]_>_div]:rounded-full">
          <div className="space-y-6 py-4">
            {/* Technique Selection - Checkbox for multiple */}
            {hasMultipleTechniques && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">TÉCNICA (selecione uma ou mais)</Label>
                <div className="space-y-2">
                  {availableTechniques.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tech-${tech}`}
                        checked={selectedTechniques.includes(tech)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTechniques(prev => [...prev, tech])
                          } else {
                            setSelectedTechniques(prev => prev.filter(t => t !== tech))
                          }
                        }}
                      />
                      <Label htmlFor={`tech-${tech}`} className="cursor-pointer">
                        {tech}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variables Section - Collapsible */}
            {variaveis.length > 0 && (
              <Collapsible open={variablesOpen} onOpenChange={setVariablesOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-cyan-500" />
                    <Label className="text-base font-semibold cursor-pointer">VARIÁVEIS</Label>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {Object.keys(values).filter(k => values[k] !== undefined && values[k] !== '').length}/{variaveis.length} preenchidas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const requiredPending = variaveis.filter(v => 
                        v.obrigatorio && (values[v.nome] === undefined || values[v.nome] === '')
                      ).length
                      return requiredPending > 0 && (
                        <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                          {requiredPending} obrigatória{requiredPending > 1 ? 's' : ''} pendente{requiredPending > 1 ? 's' : ''}
                        </span>
                      )
                    })()}
                    <ChevronDown 
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${variablesOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="space-y-4">
                    {variaveis.map(renderField)}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Preview Section - Collapsible with remove option */}
            <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-500" />
                  <Label className="text-base font-semibold cursor-pointer">PREVIEW</Label>
                  {removedSections.length > 0 && (
                    <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                      {removedSections.length} seção removida{removedSections.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${previewOpen ? 'rotate-180' : ''}`} 
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                {/* Section removal controls */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {previewSections.map((section) => (
                    <Button
                      key={section.id}
                      variant={removedSections.includes(section.id) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleSectionRemoval(section.id)}
                      className="h-7 text-xs gap-1.5"
                    >
                      {removedSections.includes(section.id) ? (
                        <>
                          <Trash2 className="h-3 w-3" />
                          {section.label} (removida)
                        </>
                      ) : (
                        section.label
                      )}
                    </Button>
                  ))}
                </div>
                <ScrollArea className="h-[300px] w-full rounded-lg border border-border [&_[data-orientation=vertical]]:w-1.5 [&_[data-orientation=vertical]]:bg-transparent [&_[data-orientation=vertical]_>_div]:bg-cyan-500/30 [&_[data-orientation=vertical]_>_div]:hover:bg-cyan-500/50 [&_[data-orientation=vertical]_>_div]:rounded-full">
                  <div 
                    className="p-4 bg-background prose prose-sm prose-invert max-w-none"
                    style={{ color: 'hsl(var(--foreground))' }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700">
            Aplicar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
