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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FraseVariable, VariableValues } from '@/types/fraseVariables'
import { useVariableProcessor } from '@/hooks/useVariableProcessor'
import { splitIntoParagraphs, findAnatomicalLine, ParsedParagraph } from '@/utils/anatomicalMapping'
import { ChevronDown, ChevronRight, MapPin, MousePointer, AlertCircle, Check, Plus, RefreshCw, TextCursorInput, ArrowUp, ArrowDown, Trash2, CalendarIcon, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type InsertionMode = 'replace' | 'append' | 'above' | 'below' | 'remove'

interface VariablesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  codigo: string
  texto: string
  conclusao?: string
  variaveis: FraseVariable[]
  editorHtml?: string
  estruturaNome?: string
  onSubmit: (
    processedTexto: string, 
    processedConclusao?: string,
    targetLineIndex?: number,
    insertionMode?: InsertionMode
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
  const [insertionMode, setInsertionMode] = useState<InsertionMode>('replace')
  
  // Estado para ordem dos parágrafos e drag-and-drop
  const [paragraphOrder, setParagraphOrder] = useState<number[]>([])
  const [draggedParagraph, setDraggedParagraph] = useState<number | null>(null)
  
  // Índice especial para a conclusão
  const CONCLUSAO_INDEX = -999

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
      setInsertionMode('replace')
      
      // Parsear parágrafos do editor
      if (editorHtml) {
        const paras = splitIntoParagraphs(editorHtml)
        setParagraphs(paras)
        // Initialize order with conclusão at end (use CONCLUSAO_INDEX = -999 as special marker)
        const order = paras.map((_, idx) => idx)
        if (conclusao) order.push(CONCLUSAO_INDEX)
        setParagraphOrder(order)
        
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
        setParagraphOrder([])
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

  const handleSelectLine = useCallback((index: number, mode: InsertionMode) => {
    setSelectedLineIndex(index)
    setInsertionMode(mode)
    setAutoMapped(false)
  }, [])

  // Drag and drop handlers for paragraphs
  const handleParagraphDragStart = useCallback((e: React.DragEvent, originalIndex: number) => {
    setDraggedParagraph(originalIndex)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(originalIndex))
  }, [])

  const handleParagraphDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleParagraphDrop = useCallback((e: React.DragEvent, targetOriginalIndex: number) => {
    e.preventDefault()
    if (draggedParagraph === null || draggedParagraph === targetOriginalIndex) {
      setDraggedParagraph(null)
      return
    }
    
    setParagraphOrder(prev => {
      const newOrder = [...prev]
      const draggedOrderIndex = newOrder.indexOf(draggedParagraph)
      const targetOrderIndex = newOrder.indexOf(targetOriginalIndex)
      
      newOrder.splice(draggedOrderIndex, 1)
      newOrder.splice(targetOrderIndex, 0, draggedParagraph)
      
      return newOrder
    })
    setDraggedParagraph(null)
  }, [draggedParagraph])

  const handleParagraphDragEnd = useCallback(() => {
    setDraggedParagraph(null)
  }, [])

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
      selectedLineIndex !== null ? selectedLineIndex : undefined,
      insertionMode
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

      case 'data':
        // Parse the stored date string (DD/MM/YYYY) back to Date object for Calendar
        const dateValue = value ? parse(value as string, 'dd/MM/yyyy', new Date()) : undefined
        const isValidDate = dateValue && !isNaN(dateValue.getTime())
        
        return (
          <div key={variable.nome} className="space-y-1.5">
            <Label htmlFor={variable.nome} className="text-xs font-medium">
              {variable.descricao || variable.nome}
              {variable.obrigatorio && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-8 text-sm",
                    !isValidDate && "text-muted-foreground",
                    error && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
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
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  // Obter conteúdo do preview baseado no modo de inserção
  const getPreviewContent = (para: ParsedParagraph, idx: number): string | null => {
    if (idx !== selectedLineIndex) return null
    
    switch (insertionMode) {
      case 'replace':
        return processedTexto
      case 'append':
        const existing = para.text.trim()
        const sep = existing.endsWith('.') ? ' ' : '. '
        return `${existing}${sep}${processedTexto}`
      case 'above':
      case 'below':
        return null // Linha original mantida, nova mostrada separadamente
    }
  }

  // Renderizar preview contextual com parágrafos clicáveis
  const renderContextualPreview = () => {
    if (paragraphs.length === 0) {
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
        {paragraphOrder.map((originalIdx, displayIndex) => {
          // Check if this is the conclusion (special index)
          const isConclusao = originalIdx === CONCLUSAO_INDEX
          
          if (isConclusao && processedConclusao) {
            return (
              <div
                key="conclusao"
                draggable
                onDragStart={(e) => handleParagraphDragStart(e, CONCLUSAO_INDEX)}
                onDragOver={handleParagraphDragOver}
                onDrop={(e) => handleParagraphDrop(e, CONCLUSAO_INDEX)}
                onDragEnd={handleParagraphDragEnd}
                className={cn(
                  "group relative flex items-center",
                  draggedParagraph === CONCLUSAO_INDEX && "opacity-50 scale-95"
                )}
              >
                <div className="mr-1.5 cursor-grab active:cursor-grabbing">
                  <GripVertical className={cn(
                    "h-4 w-4 text-muted-foreground/60 transition-all",
                    draggedParagraph === CONCLUSAO_INDEX && "text-emerald-500"
                  )} />
                </div>
                <div className={cn(
                  "flex-1 px-2 py-1 rounded text-sm transition-all cursor-grab active:cursor-grabbing",
                  "bg-emerald-500/20 border-l-4 border-emerald-500 pl-3",
                  draggedParagraph === CONCLUSAO_INDEX && "border border-emerald-500 bg-emerald-500/10"
                )}>
                  <span className="font-medium text-emerald-700 dark:text-emerald-300 text-xs uppercase mr-1">Impressão: </span>
                  <span className="text-foreground font-medium bg-amber-400/25 px-1 rounded">- {processedConclusao}</span>
                </div>
              </div>
            )
          }
          
          // Regular paragraph
          if (isConclusao) return null // Skip if no conclusao text
          
          const para = paragraphs[originalIdx]
          if (!para) return null
          
          const idx = originalIdx
          const isSelected = idx === selectedLineIndex
          const isClickable = !para.isHeader
          const previewContent = getPreviewContent(para, idx)
          
          return (
            <div key={idx}>
              {/* Nova linha acima (modo 'above') */}
              {isSelected && insertionMode === 'above' && (
                <div className="px-2 py-1 mb-0.5 rounded bg-emerald-500/20 border-l-4 border-emerald-500 pl-3 text-sm flex items-center gap-2">
                  <span className="text-foreground font-medium">{processedTexto}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">nova</Badge>
                </div>
              )}
              
              {/* Linha principal */}
              <div 
                className="group relative flex items-center"
                draggable={!para.isHeader}
                onDragStart={(e) => handleParagraphDragStart(e, idx)}
                onDragOver={handleParagraphDragOver}
                onDrop={(e) => handleParagraphDrop(e, idx)}
                onDragEnd={handleParagraphDragEnd}
              >
                {/* Drag handle - left side, only for non-headers */}
                {!para.isHeader && (
                  <div className="mr-1.5 cursor-grab active:cursor-grabbing">
                    <GripVertical className={cn(
                      "h-4 w-4 text-muted-foreground/60 transition-all",
                      draggedParagraph === idx && "text-cyan-500"
                    )} />
                  </div>
                )}
                
                <div
                  className={cn(
                    "flex-1 px-2 py-1 rounded text-sm transition-all",
                    para.isHeader && "font-semibold text-foreground bg-muted/20 cursor-default",
                    !para.isHeader && "hover:bg-muted/30 cursor-grab active:cursor-grabbing",
                    isSelected && insertionMode !== 'remove' && "bg-emerald-500/20 border-l-4 border-emerald-500 pl-3",
                    isSelected && insertionMode === 'remove' && "line-through opacity-50 bg-destructive/10 border-l-4 border-destructive/50 pl-3",
                    draggedParagraph === idx && "opacity-50 scale-95 border border-cyan-500 bg-cyan-500/10"
                  )}
                >
                {isSelected && previewContent ? (
                    <span className="text-foreground font-medium">{previewContent}</span>
                  ) : (
                    <span 
                      className={cn(
                        para.isHeader ? "text-foreground" : "text-muted-foreground"
                      )}
                      dangerouslySetInnerHTML={{ __html: para.text }}
                    />
                  )}
                </div>
                
                {/* Botão + discreto (hover-only) */}
                {isClickable && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-5 w-5 absolute right-1 top-1/2 -translate-y-1/2",
                          "opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity",
                          isSelected && "opacity-60"
                        )}
                      >
                        <Plus className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem 
                        onClick={() => handleSelectLine(idx, 'replace')}
                        className="gap-2 text-xs"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                        Substituir
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleSelectLine(idx, 'append')}
                        className="gap-2 text-xs"
                      >
                        <TextCursorInput className="h-3.5 w-3.5 text-muted-foreground" />
                        Adicionar ao final
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleSelectLine(idx, 'above')}
                        className="gap-2 text-xs"
                      >
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
                        Inserir acima
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleSelectLine(idx, 'below')}
                        className="gap-2 text-xs"
                      >
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                        Inserir abaixo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleSelectLine(idx, 'remove')}
                        className="gap-2 text-xs text-destructive/70"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remover linha
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {/* Nova linha abaixo (modo 'below') */}
              {isSelected && insertionMode === 'below' && (
                <div className="px-2 py-1 mt-0.5 rounded bg-emerald-500/20 border-l-4 border-emerald-500 pl-3 text-sm flex items-center gap-2">
                  <span className="text-foreground font-medium">{processedTexto}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">nova</Badge>
                </div>
              )}
            </div>
          )
        })}
        
        {/* Conclusão agora é renderizada dentro do loop ordenado */}
      </div>
    )
  }

  const hasContextualPreview = paragraphs.length > 0

  // Label do modo de inserção
  const getInsertionModeLabel = () => {
    switch (insertionMode) {
      case 'append': return 'Ao final'
      case 'above': return 'Acima'
      case 'below': return 'Abaixo'
      case 'remove': return 'Remover'
      default: return null
    }
  }

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
                      {getInsertionModeLabel() && (
                        <Badge variant="secondary" className="text-xs">
                          {getInsertionModeLabel()}
                        </Badge>
                      )}
                      <Badge 
                        variant={autoMapped ? "default" : "outline"} 
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
                      Clique + para selecionar
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
                    Passe o mouse em um parágrafo e clique em + para opções de inserção
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