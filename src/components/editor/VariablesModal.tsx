import { useState, useEffect, useMemo, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { FraseVariable, VariableValues } from '@/types/fraseVariables'
import { useVariableProcessor } from '@/hooks/useVariableProcessor'
import { splitIntoParagraphs, findAnatomicalLine, ParsedParagraph } from '@/utils/anatomicalMapping'
import { ChevronDown, ChevronRight, MapPin, MousePointer, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VariablesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  codigo: string
  texto: string
  conclusao?: string
  variaveis: FraseVariable[]
  // Novas props para mapeamento contextual
  editorHtml?: string
  estruturaNome?: string
  onSubmit: (
    processedTexto: string, 
    processedConclusao?: string,
    targetLineIndex?: number
  ) => void
}

export function VariablesModal({
  open,
  onOpenChange,
  codigo,
  texto,
  conclusao,
  variaveis,
  editorHtml,
  estruturaNome,
  onSubmit
}: VariablesModalProps) {
  const { processText } = useVariableProcessor()
  const [values, setValues] = useState<VariableValues>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Estados para seções colapsáveis
  const [variablesOpen, setVariablesOpen] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(true)
  
  // Estados para mapeamento anatômico
  const [paragraphs, setParagraphs] = useState<ParsedParagraph[]>([])
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null)
  const [autoMapped, setAutoMapped] = useState(false)

  // Inicializar valores padrão e mapeamento ao abrir
  useEffect(() => {
    if (open) {
      // Reset valores com defaults
      const initialValues: VariableValues = {}
      variaveis.forEach(v => {
        if (v.valor_padrao !== undefined && v.valor_padrao !== null) {
          initialValues[v.nome] = v.valor_padrao
        }
      })
      setValues(initialValues)
      setErrors({})
      
      // Parsear parágrafos do editor
      if (editorHtml) {
        const paras = splitIntoParagraphs(editorHtml)
        setParagraphs(paras)
        
        // Tentar mapeamento automático
        if (estruturaNome) {
          const mapping = findAnatomicalLine(editorHtml, estruturaNome)
          if (mapping?.found) {
            setSelectedLineIndex(mapping.lineIndex)
            setAutoMapped(true)
          } else {
            setSelectedLineIndex(null)
            setAutoMapped(false)
          }
        } else {
          setSelectedLineIndex(null)
          setAutoMapped(false)
        }
      } else {
        setParagraphs([])
        setSelectedLineIndex(null)
        setAutoMapped(false)
      }
    }
  }, [open, variaveis, editorHtml, estruturaNome])

  // Gerar texto processado
  const processedTexto = useMemo(() => {
    return processText(texto, values)
  }, [texto, values, processText])

  const processedConclusao = useMemo(() => {
    return conclusao ? processText(conclusao, values) : undefined
  }, [conclusao, values, processText])

  // Calcular progresso das variáveis
  const variableStats = useMemo(() => {
    const total = variaveis.length
    const filled = variaveis.filter(v => {
      const value = values[v.nome]
      return value !== undefined && value !== null && value !== ''
    }).length
    const required = variaveis.filter(v => v.obrigatorio)
    const requiredFilled = required.filter(v => {
      const value = values[v.nome]
      return value !== undefined && value !== null && value !== ''
    }).length
    const pendingRequired = required.length - requiredFilled
    
    return { total, filled, pendingRequired }
  }, [variaveis, values])

  const handleValueChange = useCallback((nome: string, value: string | number | boolean) => {
    setValues(prev => ({ ...prev, [nome]: value }))
    if (errors[nome]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[nome]
        return newErrors
      })
    }
  }, [errors])

  const handleLineClick = useCallback((index: number) => {
    const para = paragraphs[index]
    if (para && !para.isHeader) {
      setSelectedLineIndex(index)
      setAutoMapped(false)
    }
  }, [paragraphs])

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

    onSubmit(
      processedTexto, 
      processedConclusao,
      selectedLineIndex !== null ? selectedLineIndex : undefined
    )
    onOpenChange(false)
  }

  const renderField = (variable: FraseVariable) => {
    const value = values[variable.nome]
    const error = errors[variable.nome]

    switch (variable.tipo) {
      case 'texto':
        return (
          <div key={variable.nome} className="space-y-1.5">
            <Label htmlFor={variable.nome} className="text-xs font-medium">
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={variable.nome}
              value={value?.toString() || ''}
              onChange={(e) => handleValueChange(variable.nome, e.target.value)}
              placeholder={variable.valor_padrao?.toString() || 'Digite...'}
              className={cn("h-8 text-sm", error && 'border-destructive')}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      case 'numero':
        return (
          <div key={variable.nome} className="space-y-1.5">
            <Label htmlFor={variable.nome} className="text-xs font-medium">
              {variable.descricao || variable.nome}
              {variable.unidade && <span className="text-muted-foreground ml-1">({variable.unidade})</span>}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
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
              className={cn("h-8 text-sm", error && 'border-destructive')}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={variable.nome} className="space-y-1.5">
            <Label htmlFor={variable.nome} className="text-xs font-medium">
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value?.toString() || ''}
              onValueChange={(val) => handleValueChange(variable.nome, val)}
            >
              <SelectTrigger className={cn("h-8 text-sm", error && 'border-destructive')}>
                <SelectValue placeholder="Selecione..." />
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
          <div key={variable.nome} className="flex items-center justify-between py-1">
            <Label htmlFor={variable.nome} className="text-xs font-medium">
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

  // Renderizar preview contextual com parágrafos clicáveis
  const renderContextualPreview = () => {
    if (paragraphs.length === 0) {
      // Fallback: mostrar apenas o texto processado
      return (
        <div className="p-3 bg-muted/30 rounded-md text-sm">
          {processedTexto}
          {processedConclusao && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <span className="text-muted-foreground text-xs uppercase">Conclusão:</span>
              <div className="mt-1">- {processedConclusao}</div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-0.5">
        {paragraphs.map((para, idx) => {
          const isSelected = idx === selectedLineIndex
          const isClickable = !para.isHeader
          
          return (
            <div
              key={idx}
              onClick={() => isClickable && handleLineClick(idx)}
              className={cn(
                "px-2 py-1 rounded text-sm transition-all",
                para.isHeader && "font-semibold text-foreground bg-muted/20 cursor-default",
                !para.isHeader && "cursor-pointer hover:bg-muted/40",
                isSelected && "bg-cyan-500/20 border-l-4 border-cyan-500 pl-3"
              )}
            >
              {isSelected ? (
                <span className="text-foreground">{processedTexto}</span>
              ) : (
                <span 
                  className={cn(
                    para.isHeader ? "text-foreground" : "text-muted-foreground"
                  )}
                  dangerouslySetInnerHTML={{ __html: para.text }}
                />
              )}
            </div>
          )
        })}
        
        {/* Mostrar conclusão na seção IMPRESSÃO */}
        {processedConclusao && (
          <div className="mt-2 px-2 py-1 rounded bg-emerald-500/20 border-l-4 border-emerald-500 pl-3 text-sm">
            - {processedConclusao}
          </div>
        )}
      </div>
    )
  }

  const hasContextualPreview = paragraphs.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            Preencher Variáveis
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-mono">{codigo}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="px-6 py-4 space-y-4">
            {/* Seção VARIÁVEIS - Colapsável */}
            <Collapsible open={variablesOpen} onOpenChange={setVariablesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2">
                  {variablesOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Variáveis
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {variableStats.filled}/{variableStats.total}
                  </Badge>
                  {variableStats.pendingRequired > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {variableStats.pendingRequired} pendente{variableStats.pendingRequired > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variaveis.map(renderField)}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Seção PREVIEW - Colapsável */}
            <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2">
                  {previewOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {hasContextualPreview ? 'Preview do Documento' : 'Preview'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasContextualPreview && selectedLineIndex !== null && (
                    <>
                      <Badge variant="outline" className="text-xs gap-1">
                        <MapPin className="h-3 w-3" />
                        {estruturaNome || `Linha ${selectedLineIndex + 1}`}
                      </Badge>
                      <Badge 
                        variant={autoMapped ? "default" : "secondary"} 
                        className="text-xs gap-1"
                      >
                        {autoMapped ? (
                          <>
                            <Check className="h-3 w-3" />
                            Auto
                          </>
                        ) : (
                          <>
                            <MousePointer className="h-3 w-3" />
                            Manual
                          </>
                        )}
                      </Badge>
                    </>
                  )}
                  {hasContextualPreview && selectedLineIndex === null && (
                    <Badge variant="outline" className="text-xs gap-1 text-amber-600">
                      <AlertCircle className="h-3 w-3" />
                      Clique para selecionar
                    </Badge>
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="rounded-md border bg-background/50 p-3 max-h-[300px] overflow-y-auto">
                  {renderContextualPreview()}
                </div>
                {hasContextualPreview && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Clique em um parágrafo para alterar o local de inserção
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
