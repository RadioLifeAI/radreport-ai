// Modal for filling template variables before applying template
// Includes technique selection, collapsible groups, visual highlighting, and real-time preview

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  FileText, 
  Calculator, 
  Ruler, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
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
  onSubmit: (selectedTechnique: string | null, variableValues: TemplateVariableValues) => void
}

// Group variables by common prefix or semantic context
interface VariableGroup {
  name: string
  variables: TemplateVariable[]
}

function groupVariablesByPrefix(variables: TemplateVariable[]): VariableGroup[] {
  if (variables.length <= 4) {
    // Few variables - no grouping needed
    return [{ name: '', variables }]
  }

  const prefixMap = new Map<string, TemplateVariable[]>()
  const ungrouped: TemplateVariable[] = []

  // Known semantic groups
  const semanticGroups: Record<string, string[]> = {
    'Dimensões': ['diametro', 'altura', 'largura', 'comprimento', 'espessura', 'medida', 'tamanho'],
    'Volumes': ['volume', 'vol_'],
    'Posição': ['posicao', 'localizacao', 'lado', 'segmento'],
    'Velocidades': ['velocidade', 'vps', 'vdf', 'vel_'],
    'Índices': ['indice', 'ratio', 'ir_', 'rr_'],
    'Distâncias': ['distancia', 'dist_'],
    'Áreas': ['area', 'perimetro'],
  }

  variables.forEach(v => {
    const nameLower = v.nome.toLowerCase()
    let grouped = false

    // Try semantic grouping first
    for (const [groupName, prefixes] of Object.entries(semanticGroups)) {
      if (prefixes.some(p => nameLower.startsWith(p) || nameLower.includes(p))) {
        const existing = prefixMap.get(groupName) || []
        prefixMap.set(groupName, [...existing, v])
        grouped = true
        break
      }
    }

    if (!grouped) {
      // Try prefix-based grouping (first word before underscore)
      const parts = v.nome.split('_')
      if (parts.length > 1) {
        const prefix = parts[0]
        // Only group if prefix appears in other variables too
        const samePrefix = variables.filter(other => 
          other.nome.startsWith(prefix + '_') && other.nome !== v.nome
        )
        if (samePrefix.length >= 1) {
          const existing = prefixMap.get(prefix) || []
          if (!existing.find(e => e.nome === v.nome)) {
            prefixMap.set(prefix, [...existing, v])
          }
          grouped = true
        }
      }
    }

    if (!grouped) {
      ungrouped.push(v)
    }
  })

  const groups: VariableGroup[] = []

  // Add grouped variables
  prefixMap.forEach((vars, name) => {
    if (vars.length >= 2) {
      // Format group name
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')
      groups.push({ name: formattedName, variables: vars })
    } else {
      // Single variable - add to ungrouped
      ungrouped.push(...vars)
    }
  })

  // Add ungrouped at the beginning
  if (ungrouped.length > 0) {
    groups.unshift({ name: '', variables: ungrouped })
  }

  return groups
}

export function TemplateVariablesModal({
  open,
  onOpenChange,
  template,
  onSubmit
}: TemplateVariablesModalProps) {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [values, setValues] = useState<TemplateVariableValues>({})
  const [volumeMeasurements, setVolumeMeasurements] = useState<Record<string, VolumeMeasurement>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewOpen, setPreviewOpen] = useState(true)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const availableTechniques = template ? getAvailableTechniques(template) : []
  const hasMultipleTechniques = availableTechniques.length > 1
  const variaveis = template?.variaveis || []

  // Group variables
  const variableGroups = useMemo(() => groupVariablesByPrefix(variaveis), [variaveis])

  // Calculate progress stats
  const progressStats = useMemo(() => {
    const total = variaveis.length
    const required = variaveis.filter(v => v.obrigatorio).length
    const filled = variaveis.filter(v => {
      const value = values[v.nome]
      return value !== undefined && value !== null && value !== ''
    }).length
    const requiredFilled = variaveis.filter(v => {
      if (!v.obrigatorio) return false
      const value = values[v.nome]
      return value !== undefined && value !== null && value !== ''
    }).length
    const requiredPending = required - requiredFilled

    return { total, required, filled, requiredFilled, requiredPending }
  }, [variaveis, values])

  // Check if a variable is filled
  const isVariableFilled = (nome: string): boolean => {
    const value = values[nome]
    return value !== undefined && value !== null && value !== ''
  }

  // Get group progress
  const getGroupProgress = (group: VariableGroup) => {
    const total = group.variables.length
    const filled = group.variables.filter(v => isVariableFilled(v.nome)).length
    const hasRequiredUnfilled = group.variables.some(v => v.obrigatorio && !isVariableFilled(v.nome))
    return { total, filled, hasRequiredUnfilled }
  }

  // Initialize with default values
  useEffect(() => {
    if (open && template) {
      // Set default technique
      const defaultTech = getDefaultTechnique(template)
      setSelectedTechnique(defaultTech)

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
      setCollapsedGroups(new Set())
    }
  }, [open, template, variaveis])

  // Auto-collapse fully filled groups, expand groups with required unfilled
  useEffect(() => {
    if (variaveis.length > 4) {
      const newCollapsed = new Set<string>()
      variableGroups.forEach(group => {
        if (group.name) {
          const { filled, total, hasRequiredUnfilled } = getGroupProgress(group)
          if (filled === total && !hasRequiredUnfilled) {
            newCollapsed.add(group.name)
          }
        }
      })
      setCollapsedGroups(newCollapsed)
    }
  }, [variableGroups, values])

  // Generate preview HTML
  const previewHtml = useMemo(() => {
    if (!template) return ''

    // Process conditional logic to derive additional variables
    const processedValues = processConditionalLogic(template.condicoes_logicas, values)

    // Process each section with variable substitution (including derived variables)
    const processedAchados = processTemplateText(template.conteudo.achados, processedValues)
    const processedImpressao = processTemplateText(template.conteudo.impressao, processedValues)
    const processedAdicionais = template.conteudo.adicionais 
      ? processTemplateText(template.conteudo.adicionais, processedValues)
      : ''

    // Get selected technique text
    const tecnicaText = selectedTechnique && template.conteudo.tecnica[selectedTechnique]
      ? processTemplateText(template.conteudo.tecnica[selectedTechnique], processedValues)
      : ''

    // Format sections
    const tituloHtml = `<h2 style="text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 12pt;">${template.titulo}</h2>`
    
    const tecnicaHtml = tecnicaText
      ? `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">TÉCNICA</h3>${dividirEmSentencas(tecnicaText)}`
      : ''
    
    const achadosHtml = `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">ACHADOS</h3>${dividirEmSentencas(processedAchados)}`
    
    const impressaoHtml = `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">IMPRESSÃO</h3>${dividirEmSentencas(processedImpressao)}`
    
    const adicionaisHtml = processedAdicionais
      ? `<h3 style="text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;">ADICIONAIS</h3>${dividirEmSentencas(processedAdicionais)}`
      : ''

    return [tituloHtml, tecnicaHtml, achadosHtml, impressaoHtml, adicionaisHtml]
      .filter(Boolean)
      .join('')
  }, [template, selectedTechnique, values])

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
    onSubmit(selectedTechnique, processedValues)
    onOpenChange(false)
  }

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupName)) {
        newSet.delete(groupName)
      } else {
        newSet.add(groupName)
      }
      return newSet
    })
  }

  // Get visual status for a variable
  const getVariableStatus = (variable: TemplateVariable) => {
    const filled = isVariableFilled(variable.nome)
    const hasError = !!errors[variable.nome]
    
    if (hasError) return 'error'
    if (variable.obrigatorio && !filled) return 'required-unfilled'
    if (variable.obrigatorio && filled) return 'required-filled'
    if (filled) return 'optional-filled'
    return 'optional-unfilled'
  }

  const renderField = (variable: TemplateVariable) => {
    const value = values[variable.nome]
    const error = errors[variable.nome]
    const status = getVariableStatus(variable)

    // Status-based styling
    const containerStyles: Record<string, string> = {
      'error': 'border-destructive bg-destructive/5',
      'required-unfilled': 'border-amber-500/50 bg-amber-500/5',
      'required-filled': 'border-green-500/30 bg-green-500/5',
      'optional-filled': 'border-cyan-500/30 bg-cyan-500/5',
      'optional-unfilled': 'border-border bg-muted/30'
    }

    const containerClass = `space-y-2 p-3 rounded-lg border transition-all duration-200 ${containerStyles[status]}`

    // Check if this is a volume variable (by type or detection)
    if (variable.tipo === 'volume' || isVolumeVariable(variable)) {
      const measurement = volumeMeasurements[variable.nome] || createDefaultVolumeMeasurement()
      const calculatedVolume = calculateEllipsoidVolume(measurement.x, measurement.y, measurement.z)
      const displayVolume = measurement.useCalculated ? calculatedVolume : measurement.directVolume
      
      return (
        <div key={variable.nome} className={containerClass}>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              {status === 'required-unfilled' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
              {status === 'required-filled' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              {variable.descricao || variable.nome}
              <span className="text-muted-foreground">({variable.unidade || 'cm³'})</span>
              {variable.obrigatorio && <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-500/50 text-amber-500">Obrigatório</Badge>}
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
          <div key={variable.nome} className={containerClass}>
            <Label htmlFor={variable.nome} className="text-sm flex items-center gap-1.5">
              {status === 'required-unfilled' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
              {status === 'required-filled' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-500/50 text-amber-500">Obrigatório</Badge>}
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
          <div key={variable.nome} className={containerClass}>
            <Label htmlFor={variable.nome} className="text-sm flex items-center gap-1.5 flex-wrap">
              {status === 'required-unfilled' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
              {status === 'required-filled' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              {variable.descricao || variable.nome}
              {variable.unidade && <span className="text-muted-foreground">({variable.unidade})</span>}
              {variable.obrigatorio && <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-500/50 text-amber-500">Obrigatório</Badge>}
              {(variable.minimo !== undefined || variable.maximo !== undefined) && (
                <span className="text-xs text-muted-foreground">
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
          <div key={variable.nome} className={containerClass}>
            <Label htmlFor={variable.nome} className="text-sm flex items-center gap-1.5">
              {status === 'required-unfilled' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
              {status === 'required-filled' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <Badge variant="outline" className="text-[10px] h-4 px-1 border-amber-500/50 text-amber-500">Obrigatório</Badge>}
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
          <div key={variable.nome} className={containerClass}>
            <div className="flex items-center justify-between">
              <Label htmlFor={variable.nome} className="text-sm flex items-center gap-1.5">
                {status === 'required-unfilled' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                {status === 'required-filled' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                {variable.descricao || variable.nome}
              </Label>
              <Switch
                id={variable.nome}
                checked={!!value}
                onCheckedChange={(checked) => handleValueChange(variable.nome, checked)}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Render a group of variables
  const renderGroup = (group: VariableGroup, index: number) => {
    if (!group.name) {
      // Ungrouped variables - render directly
      return (
        <div key={`ungrouped-${index}`} className="space-y-3">
          {group.variables.map(renderField)}
        </div>
      )
    }

    const { total, filled, hasRequiredUnfilled } = getGroupProgress(group)
    const isCollapsed = collapsedGroups.has(group.name)
    const isComplete = filled === total

    return (
      <Collapsible 
        key={group.name} 
        open={!isCollapsed}
        onOpenChange={() => toggleGroup(group.name)}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${!isCollapsed ? 'rotate-0' : '-rotate-90'}`} 
            />
            <span className="font-medium text-sm">{group.name}</span>
            {hasRequiredUnfilled && (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            )}
          </div>
          <Badge 
            variant={isComplete ? 'default' : 'outline'}
            className={`text-xs ${isComplete ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}`}
          >
            {isComplete && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {filled}/{total}
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3 pl-4 border-l-2 border-muted ml-2">
          {group.variables.map(renderField)}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  if (!template) return null

  const hasExtensiveVariables = variaveis.length > 6

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        {/* Header with progress */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-500" />
                {template.titulo}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {template.modalidade} • {template.regiao}
              </p>
            </div>
            {variaveis.length > 0 && (
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                  {progressStats.filled}/{progressStats.total} preenchidas
                </Badge>
                {progressStats.requiredPending > 0 && (
                  <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-500">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {progressStats.requiredPending} obrigatória{progressStats.requiredPending > 1 ? 's' : ''} pendente{progressStats.requiredPending > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Main content - 2 columns on large screens */}
        <div className={`flex-1 overflow-hidden ${hasExtensiveVariables ? 'flex flex-col lg:flex-row' : ''}`}>
          {/* Variables column */}
          <div className={`flex-1 ${hasExtensiveVariables ? 'lg:border-r border-border' : ''}`}>
            <ScrollArea className="h-full max-h-[calc(90vh-180px)]">
              <div className="p-6 space-y-6">
                {/* Technique Selection */}
                {hasMultipleTechniques && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">TÉCNICA</Label>
                    <RadioGroup
                      value={selectedTechnique || ''}
                      onValueChange={setSelectedTechnique}
                      className="space-y-2"
                    >
                      {availableTechniques.map((tech) => (
                        <div key={tech} className="flex items-center space-x-2">
                          <RadioGroupItem value={tech} id={tech} />
                          <Label htmlFor={tech} className="cursor-pointer">
                            {tech}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Variables Section */}
                {variaveis.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      VARIÁVEIS
                      <span className="text-xs text-muted-foreground font-normal">
                        ({progressStats.filled}/{progressStats.total})
                      </span>
                    </Label>
                    <div className="space-y-4">
                      {variableGroups.map((group, index) => renderGroup(group, index))}
                    </div>
                  </div>
                )}

                {/* Preview for small screens / few variables */}
                {!hasExtensiveVariables && (
                  <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                        {previewOpen ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        PREVIEW
                      </Label>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${previewOpen ? 'rotate-180' : ''}`} 
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <ScrollArea className="h-[300px] w-full rounded-lg border border-border">
                        <div 
                          className="p-4 bg-background prose prose-sm prose-invert max-w-none"
                          style={{ color: 'hsl(var(--foreground))' }}
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      </ScrollArea>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Sticky Preview column for extensive variables */}
          {hasExtensiveVariables && (
            <div className="hidden lg:flex flex-col w-[45%] min-w-[350px]">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-500" />
                  PREVIEW
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="h-7 text-xs"
                >
                  {previewOpen ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
                  {previewOpen ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
              {previewOpen && (
                <ScrollArea className="flex-1 max-h-[calc(90vh-220px)]">
                  <div 
                    className="p-4 bg-muted/20 prose prose-sm prose-invert max-w-none"
                    style={{ color: 'hsl(var(--foreground))' }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </ScrollArea>
              )}
            </div>
          )}

          {/* Mobile preview toggle for extensive variables */}
          {hasExtensiveVariables && (
            <div className="lg:hidden border-t border-border">
              <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3">
                  <Label className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    {previewOpen ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    PREVIEW
                  </Label>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${previewOpen ? 'rotate-180' : ''}`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ScrollArea className="h-[250px] border-t border-border">
                    <div 
                      className="p-4 bg-muted/20 prose prose-sm prose-invert max-w-none"
                      style={{ color: 'hsl(var(--foreground))' }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </ScrollArea>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
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
