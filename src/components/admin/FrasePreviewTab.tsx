import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  FlaskConical, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  Eye,
  CalendarIcon,
  Calculator,
  Edit3,
  FileText,
  MessageSquare,
  Settings
} from 'lucide-react'
import { 
  normalizeTemplateVariables, 
  processTemplateText,
  isVolumeVariable,
  calculateEllipsoidVolume
} from '@/utils/templateVariableProcessor'
import type { TemplateVariable } from '@/types/templateVariables'

interface FrasePreviewTabProps {
  formData: {
    codigo: string
    texto: string
    conclusao: string
    tecnica: string
    observacao: string
    variaveis: string
  }
}

interface VolumeMeasurement {
  x: number
  y: number
  z: number
  directVolume: number
  useDirectVolume: boolean
}

export function FrasePreviewTab({ formData }: FrasePreviewTabProps) {
  const [values, setValues] = useState<Record<string, any>>({})
  const [volumeMeasurements, setVolumeMeasurements] = useState<Record<string, VolumeMeasurement>>({})
  const [variablesOpen, setVariablesOpen] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(true)

  // Parse and normalize variables from JSON string
  const normalizedVariables = useMemo(() => {
    if (!formData.variaveis) return []
    try {
      const parsed = JSON.parse(formData.variaveis)
      return normalizeTemplateVariables(parsed)
    } catch {
      return []
    }
  }, [formData.variaveis])

  // Check if there are any variables
  const hasVariables = normalizedVariables.length > 0

  // Count filled variables
  const filledCount = useMemo(() => {
    return normalizedVariables.filter(v => {
      if (isVolumeVariable(v)) {
        const vm = volumeMeasurements[v.nome]
        if (!vm) return false
        if (vm.useDirectVolume) return vm.directVolume > 0
        return vm.x > 0 || vm.y > 0 || vm.z > 0
      }
      const val = values[v.nome]
      return val !== undefined && val !== null && val !== ''
    }).length
  }, [normalizedVariables, values, volumeMeasurements])

  // Count required variables
  const requiredCount = normalizedVariables.filter(v => v.obrigatorio).length
  const requiredFilled = normalizedVariables.filter(v => {
    if (!v.obrigatorio) return true
    if (isVolumeVariable(v)) {
      const vm = volumeMeasurements[v.nome]
      if (!vm) return false
      if (vm.useDirectVolume) return vm.directVolume > 0
      return vm.x > 0 || vm.y > 0 || vm.z > 0
    }
    const val = values[v.nome]
    return val !== undefined && val !== null && val !== ''
  }).length

  // Build values including volume calculations
  const allValues = useMemo(() => {
    const result = { ...values }
    Object.entries(volumeMeasurements).forEach(([key, vm]) => {
      if (vm.useDirectVolume) {
        result[key] = vm.directVolume
      } else if (vm.x > 0 && vm.y > 0 && vm.z > 0) {
        result[key] = calculateEllipsoidVolume(vm.x, vm.y, vm.z)
      }
    })
    return result
  }, [values, volumeMeasurements])

  // Process text with variable substitution
  const processedText = useMemo(() => {
    if (!formData.texto) return ''
    return processTemplateText(formData.texto, allValues)
  }, [formData.texto, allValues])

  // Process conclusion with variable substitution
  const processedConclusion = useMemo(() => {
    if (!formData.conclusao) return ''
    return processTemplateText(formData.conclusao, allValues)
  }, [formData.conclusao, allValues])

  // Handle value change
  const handleValueChange = useCallback((nome: string, value: any) => {
    setValues(prev => ({ ...prev, [nome]: value }))
  }, [])

  // Handle volume measurement change
  const handleVolumeChange = useCallback((nome: string, field: keyof VolumeMeasurement, value: number | boolean) => {
    setVolumeMeasurements(prev => ({
      ...prev,
      [nome]: {
        ...(prev[nome] || { x: 0, y: 0, z: 0, directVolume: 0, useDirectVolume: false }),
        [field]: value
      }
    }))
  }, [])

  // Reset all values
  const handleReset = useCallback(() => {
    setValues({})
    setVolumeMeasurements({})
    toast.info('Valores resetados')
  }, [])

  // Test application
  const handleTest = useCallback(() => {
    const missingRequired = normalizedVariables.filter(v => {
      if (!v.obrigatorio) return false
      if (isVolumeVariable(v)) {
        const vm = volumeMeasurements[v.nome]
        if (!vm) return true
        if (vm.useDirectVolume) return vm.directVolume <= 0
        return vm.x <= 0 && vm.y <= 0 && vm.z <= 0
      }
      const val = values[v.nome]
      return val === undefined || val === null || val === ''
    })

    if (missingRequired.length > 0) {
      toast.error(`Campos obrigatórios pendentes: ${missingRequired.map(v => v.descricao || v.nome).join(', ')}`)
      return
    }

    toast.success('Frase funcionando corretamente! Variáveis processadas com sucesso.')
  }, [normalizedVariables, values, volumeMeasurements])

  // Format variable name for display
  const formatLabel = (v: TemplateVariable) => {
    return v.descricao || v.nome.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Render field based on type
  const renderField = (variable: TemplateVariable) => {
    const { nome, tipo, unidade, opcoes, obrigatorio } = variable
    const label = formatLabel(variable)

    // Volume type
    if (isVolumeVariable(variable)) {
      const vm = volumeMeasurements[nome] || { x: 0, y: 0, z: 0, directVolume: 0, useDirectVolume: false }
      const calculatedVolume = vm.x > 0 && vm.y > 0 && vm.z > 0 
        ? calculateEllipsoidVolume(vm.x, vm.y, vm.z) 
        : 0

      return (
        <div key={nome} className="space-y-2 p-3 border border-border/50 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {label} {obrigatorio && <span className="text-destructive">*</span>}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {vm.useDirectVolume ? 'Direto' : 'Calcular'}
              </span>
              <Switch
                checked={vm.useDirectVolume}
                onCheckedChange={(checked) => handleVolumeChange(nome, 'useDirectVolume', checked)}
              />
            </div>
          </div>

          {vm.useDirectVolume ? (
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="Volume"
                value={vm.directVolume || ''}
                onChange={(e) => handleVolumeChange(nome, 'directVolume', parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground">{unidade || 'cm³'}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="X"
                    value={vm.x || ''}
                    onChange={(e) => handleVolumeChange(nome, 'x', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Y"
                    value={vm.y || ''}
                    onChange={(e) => handleVolumeChange(nome, 'y', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Z"
                    value={vm.z || ''}
                    onChange={(e) => handleVolumeChange(nome, 'z', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <span className="text-xs text-muted-foreground">cm</span>
              </div>
              {calculatedVolume > 0 && (
                <p className="text-xs text-muted-foreground pl-6">
                  Volume calculado: {calculatedVolume.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {unidade || 'cm³'}
                </p>
              )}
            </div>
          )}
        </div>
      )
    }

    // Select type
    if (tipo === 'select' && opcoes && opcoes.length > 0) {
      return (
        <div key={nome} className="space-y-1.5">
          <Label className="text-sm">
            {label} {obrigatorio && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={values[nome] || ''}
            onValueChange={(val) => handleValueChange(nome, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {opcoes.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    // Boolean type - handle string comparison for type safety
    if ((tipo as string) === 'boolean' || (tipo as string) === 'booleano') {
      return (
        <div key={nome} className="flex items-center justify-between py-2">
          <Label className="text-sm">
            {label} {obrigatorio && <span className="text-destructive">*</span>}
          </Label>
          <Switch
            checked={values[nome] || false}
            onCheckedChange={(checked) => handleValueChange(nome, checked)}
          />
        </div>
      )
    }

    // Date type
    if (tipo === 'data') {
      const dateValue = values[nome] 
        ? parse(values[nome], 'dd/MM/yyyy', new Date())
        : undefined

      return (
        <div key={nome} className="space-y-1.5">
          <Label className="text-sm">
            {label} {obrigatorio && <span className="text-destructive">*</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values[nome] || 'Selecione uma data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (date) {
                    handleValueChange(nome, format(date, 'dd/MM/yyyy', { locale: ptBR }))
                  }
                }}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }

    // Number type
    if (tipo === 'numero') {
      return (
        <div key={nome} className="space-y-1.5">
          <Label className="text-sm">
            {label} {obrigatorio && <span className="text-destructive">*</span>}
            {unidade && <span className="text-muted-foreground ml-1">({unidade})</span>}
          </Label>
          <Input
            type="number"
            step="0.1"
            placeholder={`Digite ${label.toLowerCase()}`}
            value={values[nome] || ''}
            onChange={(e) => handleValueChange(nome, parseFloat(e.target.value) || '')}
          />
        </div>
      )
    }

    // Text type (default)
    return (
      <div key={nome} className="space-y-1.5">
        <Label className="text-sm">
          {label} {obrigatorio && <span className="text-destructive">*</span>}
        </Label>
        <Input
          type="text"
          placeholder={`Digite ${label.toLowerCase()}`}
          value={values[nome] || ''}
          onChange={(e) => handleValueChange(nome, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
        <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <strong>Modo Simulação:</strong> Exatamente como o radiologista verá ao selecionar esta frase.
        </p>
      </div>

      {/* Variables Section */}
      {hasVariables && (
        <Collapsible open={variablesOpen} onOpenChange={setVariablesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Variáveis</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filledCount}/{normalizedVariables.length} preenchidas
                </Badge>
                {requiredCount > 0 && requiredFilled < requiredCount && (
                  <Badge variant="destructive" className="text-xs">
                    {requiredCount - requiredFilled} obrigatórias
                  </Badge>
                )}
                {variablesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="max-h-[300px] pr-4">
              <div className="space-y-4 p-3 border border-border/50 rounded-lg bg-muted/20">
                {normalizedVariables.map(renderField)}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Text Preview Section */}
      <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-3 h-auto">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Preview do Texto</span>
            </div>
            {previewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 p-3 border border-border/50 rounded-lg bg-muted/20">
            {/* Main Text */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Texto (Achados)</Label>
              <div className="p-3 bg-background rounded border border-border/50 min-h-[60px]">
                {processedText || (
                  <span className="text-muted-foreground italic">Sem texto definido</span>
                )}
              </div>
            </div>

            {/* Conclusion */}
            {formData.conclusao && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3" />
                  Conclusão (Impressão)
                </Label>
                <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded min-h-[40px]">
                  {processedConclusion || (
                    <span className="text-muted-foreground italic">Sem conclusão definida</span>
                  )}
                </div>
              </div>
            )}

            {/* Technique */}
            {formData.tecnica && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Técnica</Label>
                <div className="p-3 bg-muted/50 rounded border border-border/50 text-sm">
                  {formData.tecnica}
                </div>
              </div>
            )}

            {/* Observation */}
            {formData.observacao && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Observação</Label>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded text-sm">
                  {formData.observacao}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* No variables message */}
      {!hasVariables && (
        <div className="text-center py-6 text-muted-foreground">
          <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Esta frase não possui variáveis configuradas.</p>
          <p className="text-xs mt-1">O texto será inserido exatamente como está definido.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
        <Button size="sm" onClick={handleTest} className="gap-1.5">
          <FlaskConical className="h-3.5 w-3.5" />
          Testar Aplicação
        </Button>
      </div>
    </div>
  )
}
