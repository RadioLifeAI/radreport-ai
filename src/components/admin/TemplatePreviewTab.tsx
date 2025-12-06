// Admin Preview Tab - Simulates TemplateVariablesModal exactly as radiologist sees it
// For testing templates before saving without applying to editor

import { useState, useEffect, useMemo } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, FileText, Calculator, Ruler, Settings2, CalendarIcon, 
  Trash2, Eye, RotateCcw, FlaskConical, AlertCircle 
} from 'lucide-react'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  TemplateVariable, 
  TemplateVariableValues, 
  VolumeMeasurement, 
  TecnicaConfig 
} from '@/types/templateVariables'
import { 
  processTemplateText, 
  processConditionalLogic,
  isVolumeVariable,
  createDefaultVolumeMeasurement,
  getVolumeValue,
  calculateEllipsoidVolume,
  getTechniquePattern,
  normalizeTemplateVariables
} from '@/utils/templateVariableProcessor'
import { dividirEmSentencas } from '@/utils/templateFormatter'
import { Json } from '@/integrations/supabase/types'

interface TecnicaConfigInput {
  tipo: 'alternativo' | 'complementar' | 'misto' | 'unico' | 'auto';
  concatenar: boolean;
  separador?: string;
  prefixo_label?: boolean;
  ordem_exibicao?: string[];
}

interface TemplateFormData {
  titulo?: string;
  modalidade_codigo?: string;
  regiao_codigo?: string;
  tecnica?: Json;
  achados?: string;
  impressao?: string;
  adicionais?: string;
  variaveis?: Json;
  condicoes_logicas?: Json;
}

interface TemplatePreviewTabProps {
  formData: TemplateFormData;
  tecnicaConfigForm: TecnicaConfigInput;
}

export function TemplatePreviewTab({ formData, tecnicaConfigForm }: TemplatePreviewTabProps) {
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [values, setValues] = useState<TemplateVariableValues>({})
  const [volumeMeasurements, setVolumeMeasurements] = useState<Record<string, VolumeMeasurement>>({})
  const [variablesOpen, setVariablesOpen] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [removedSections, setRemovedSections] = useState<string[]>([])

  // Parse tecnica from JSON
  const tecnicaObj = useMemo(() => {
    if (!formData.tecnica) return {}
    if (typeof formData.tecnica === 'object' && !Array.isArray(formData.tecnica)) {
      return formData.tecnica as Record<string, string>
    }
    return {}
  }, [formData.tecnica])

  const availableTechniques = useMemo(() => Object.keys(tecnicaObj), [tecnicaObj])
  const hasMultipleTechniques = availableTechniques.length > 1

  // Normalize variables from JSON
  const variaveis = useMemo(() => {
    return normalizeTemplateVariables(formData.variaveis as any[] | Record<string, any> | null | undefined)
  }, [formData.variaveis])

  // Get effective tecnica config
  const effectiveTecnicaConfig: TecnicaConfig = useMemo(() => {
    if (tecnicaConfigForm.tipo !== 'auto') {
      return tecnicaConfigForm as TecnicaConfig
    }
    return getTechniquePattern(tecnicaObj)
  }, [tecnicaConfigForm, tecnicaObj])

  // Reset and initialize when formData changes
  useEffect(() => {
    // For complementary patterns, select ALL techniques automatically
    // For alternative patterns, select first one by default
    if (effectiveTecnicaConfig.tipo === 'complementar') {
      setSelectedTechniques(availableTechniques)
    } else {
      // Select 'SEM' by default if available, otherwise first
      const defaultTech = availableTechniques.includes('SEM') 
        ? 'SEM' 
        : availableTechniques[0] || ''
      setSelectedTechniques(defaultTech ? [defaultTech] : [])
    }

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
    setRemovedSections([])
  }, [formData, variaveis, availableTechniques, effectiveTecnicaConfig.tipo])

  // Generate preview HTML with removable sections
  const previewSections = useMemo(() => {
    if (!formData.achados && !formData.impressao) return []

    // Process conditional logic to derive additional variables
    const processedValues = processConditionalLogic(
      formData.condicoes_logicas as any[] | undefined, 
      values
    )

    // Process each section with variable substitution
    const processedAchados = processTemplateText(formData.achados || '', processedValues)
    const processedImpressao = processTemplateText(formData.impressao || '', processedValues)
    const processedAdicionais = formData.adicionais 
      ? processTemplateText(formData.adicionais, processedValues)
      : ''

    // Get combined technique text based on config type
    let tecnicaText = ''
    if (effectiveTecnicaConfig.tipo === 'complementar') {
      // For complementary: concatenate all with labels if configured
      const orderedKeys = effectiveTecnicaConfig.ordem_exibicao || availableTechniques
      const parts = orderedKeys
        .filter(key => tecnicaObj[key])
        .map(key => {
          const text = processTemplateText(tecnicaObj[key], processedValues)
          if (effectiveTecnicaConfig.prefixo_label) {
            const label = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
            return `${label}: ${text}`
          }
          return text
        })
      tecnicaText = parts.join(effectiveTecnicaConfig.separador || '. ')
    } else {
      // For alternative/single: use selected techniques
      tecnicaText = selectedTechniques
        .map(tech => tecnicaObj[tech])
        .filter(Boolean)
        .map(text => processTemplateText(text, processedValues))
        .join(effectiveTecnicaConfig.separador || ' ')
    }

    // Build sections array with ids for removal tracking
    const sections: { id: string; html: string; label: string }[] = []
    
    sections.push({
      id: 'titulo',
      label: 'Título',
      html: `<h2 style="text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 12pt;">${formData.titulo || 'TÍTULO DO TEMPLATE'}</h2>`
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
  }, [formData, selectedTechniques, values, tecnicaObj, availableTechniques, effectiveTecnicaConfig])

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
  }

  const handleReset = () => {
    // Re-initialize everything
    if (effectiveTecnicaConfig.tipo === 'complementar') {
      setSelectedTechniques(availableTechniques)
    } else {
      const defaultTech = availableTechniques.includes('SEM') 
        ? 'SEM' 
        : availableTechniques[0] || ''
      setSelectedTechniques(defaultTech ? [defaultTech] : [])
    }

    const initialValues: TemplateVariableValues = {}
    const initialVolumeMeasurements: Record<string, VolumeMeasurement> = {}
    
    variaveis.forEach(v => {
      if (v.valor_padrao !== undefined && v.valor_padrao !== null) {
        initialValues[v.nome] = v.valor_padrao
      }
      if (isVolumeVariable(v)) {
        initialVolumeMeasurements[v.nome] = createDefaultVolumeMeasurement()
      }
    })
    
    setValues(initialValues)
    setVolumeMeasurements(initialVolumeMeasurements)
    setRemovedSections([])
    toast.info('Preview resetado')
  }

  const handleTestApply = () => {
    // Validate required fields
    const missingRequired = variaveis
      .filter(v => v.obrigatorio && (values[v.nome] === undefined || values[v.nome] === ''))
      .map(v => v.descricao || v.nome)

    if (missingRequired.length > 0) {
      toast.warning(`Campos obrigatórios pendentes: ${missingRequired.join(', ')}`)
      return
    }

    toast.success('Template funcionando corretamente! Pronto para salvar.', {
      description: `${variaveis.length} variáveis processadas, ${previewSections.filter(s => !removedSections.includes(s.id)).length} seções incluídas`
    })
  }

  const renderField = (variable: TemplateVariable) => {
    const value = values[variable.nome]

    // Check if this is a volume variable
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
            <div className="space-y-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                value={measurement.directVolume || ''}
                onChange={(e) => handleVolumeMeasurementChange(variable.nome, 'directVolume', parseFloat(e.target.value) || 0)}
                placeholder="0,0"
              />
              <p className="text-xs text-muted-foreground">
                Volume informado pelo equipamento ou medido diretamente
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Volume final:</span>
            <span className="text-lg font-bold text-cyan-500">
              {displayVolume.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {variable.unidade || 'cm³'}
            </span>
          </div>
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
            />
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
            />
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
              <SelectTrigger>
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
        const dateValue = value ? parse(value as string, 'dd/MM/yyyy', new Date()) : undefined
        const isValidDate = dateValue && !isNaN(dateValue.getTime())
        
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
                    !isValidDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isValidDate 
                    ? format(dateValue, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecione a data..."
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={isValidDate ? dateValue : undefined}
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
          </div>
        )

      default:
        return null
    }
  }

  // Check if template has minimum content
  const hasContent = formData.achados || formData.impressao

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Preencha Achados e/ou Impressão
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Adicione conteúdo na aba "Conteúdo" para ver o preview
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
        <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <Eye className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Modo Simulação:</strong> Este é exatamente como o radiologista verá o modal ao clicar no template.
          </span>
        </p>
      </div>

      {/* Technique Selection - Alternative */}
      {hasMultipleTechniques && effectiveTecnicaConfig.tipo === 'alternativo' && (
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

      {/* Complementary techniques - show preview only */}
      {hasMultipleTechniques && effectiveTecnicaConfig.tipo === 'complementar' && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">TÉCNICA</Label>
          <div className="text-sm bg-muted/30 p-3 rounded-lg space-y-1 border border-border/50">
            {availableTechniques.map((tech) => (
              <div key={tech} className="text-muted-foreground">
                {effectiveTecnicaConfig.prefixo_label && (
                  <span className="font-medium text-foreground">
                    {tech.charAt(0).toUpperCase() + tech.slice(1).toLowerCase()}:
                  </span>
                )}{' '}
                <span className="text-foreground/80">
                  {tecnicaObj[tech]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Campos complementares são concatenados automaticamente
          </p>
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

      {variaveis.length === 0 && (
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
          Este template não possui variáveis dinâmicas.
        </div>
      )}

      {/* Preview Section - Collapsible */}
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

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleTestApply} className="flex-1 gap-2 bg-cyan-600 hover:bg-cyan-700">
          <FlaskConical className="h-4 w-4" />
          Testar Aplicação
        </Button>
      </div>
    </div>
  )
}
