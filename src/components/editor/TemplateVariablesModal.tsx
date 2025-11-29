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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, FileText } from 'lucide-react'
import { TemplateVariable, TemplateVariableValues, TemplateWithVariables } from '@/types/templateVariables'
import { processTemplateText, getAvailableTechniques, getDefaultTechnique, processConditionalLogic } from '@/utils/templateVariableProcessor'
import { dividirEmSentencas } from '@/utils/templateFormatter'

interface TemplateVariablesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: TemplateWithVariables | null
  onSubmit: (selectedTechnique: string | null, variableValues: TemplateVariableValues) => void
}

export function TemplateVariablesModal({
  open,
  onOpenChange,
  template,
  onSubmit
}: TemplateVariablesModalProps) {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [values, setValues] = useState<TemplateVariableValues>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewOpen, setPreviewOpen] = useState(true)

  const availableTechniques = template ? getAvailableTechniques(template) : []
  const hasMultipleTechniques = availableTechniques.length > 1
  const variaveis = template?.variaveis || []

  // Initialize with default values
  useEffect(() => {
    if (open && template) {
      // Set default technique
      const defaultTech = getDefaultTechnique(template)
      setSelectedTechnique(defaultTech)

      // Initialize variable values
      const initialValues: TemplateVariableValues = {}
      variaveis.forEach(v => {
        if (v.valor_padrao !== undefined && v.valor_padrao !== null) {
          initialValues[v.nome] = v.valor_padrao
        }
      })
      setValues(initialValues)
      setErrors({})
      setPreviewOpen(true)
    }
  }, [open, template, variaveis])

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

  const renderField = (variable: TemplateVariable) => {
    const value = values[variable.nome]
    const error = errors[variable.nome]

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

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
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
              <div className="space-y-3">
                <Label className="text-base font-semibold">VARIÁVEIS</Label>
                <div className="space-y-4">
                  {variaveis.map(renderField)}
                </div>
              </div>
            )}

            {/* Preview Section */}
            <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <Label className="text-base font-semibold cursor-pointer">PREVIEW</Label>
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
