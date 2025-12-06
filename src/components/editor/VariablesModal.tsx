import { useState, useEffect, useMemo, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { FraseVariable, VariableValues } from '@/types/fraseVariables'
import { useVariableProcessor } from '@/hooks/useVariableProcessor'

interface VariablesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  codigo: string
  texto: string
  conclusao?: string
  variaveis: FraseVariable[]
  onSubmit: (processedTexto: string, processedConclusao?: string) => void
}

export function VariablesModal({
  open,
  onOpenChange,
  codigo,
  texto,
  conclusao,
  variaveis,
  onSubmit
}: VariablesModalProps) {
  const { processText } = useVariableProcessor()
  const [values, setValues] = useState<VariableValues>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize with default values
  useEffect(() => {
    if (open && variaveis) {
      const initialValues: VariableValues = {}
      variaveis.forEach(v => {
        if (v.valor_padrao !== undefined && v.valor_padrao !== null) {
          initialValues[v.nome] = v.valor_padrao
        }
      })
      setValues(initialValues)
      setErrors({})
    }
  }, [open, variaveis])

  // Generate preview
  const preview = useMemo(() => {
    return processText(texto, values)
  }, [texto, values, processText])

  const conclusaoPreview = useMemo(() => {
    return conclusao ? processText(conclusao, values) : null
  }, [conclusao, values, processText])

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    variaveis.forEach(v => {
      if (v.obrigatorio) {
        const value = values[v.nome]
        if (value === undefined || value === null || value === '') {
          newErrors[v.nome] = 'Obrigatório'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const processedTexto = processText(texto, values)
    const processedConclusao = conclusao ? processText(conclusao, values) : undefined
    onSubmit(processedTexto, processedConclusao)
    onOpenChange(false)
  }

  // Count filled/total for progress
  const filledCount = useMemo(() => {
    return variaveis.filter(v => {
      const val = values[v.nome]
      if (v.tipo === 'boolean') return true
      return val !== undefined && val !== null && val !== ''
    }).length
  }, [variaveis, values])

  const getFieldStatus = (variable: FraseVariable): 'filled' | 'pending' | 'optional' => {
    const value = values[variable.nome]
    const isEmpty = value === undefined || value === null || value === ''
    
    if (variable.tipo === 'boolean') return 'filled'
    if (!isEmpty) return 'filled'
    if (variable.obrigatorio) return 'pending'
    return 'optional'
  }

  const renderCompactField = (variable: FraseVariable) => {
    const value = values[variable.nome]
    const error = errors[variable.nome]
    const status = getFieldStatus(variable)

    const statusIndicator = (
      <span className={cn(
        "text-[10px] leading-none shrink-0",
        status === 'filled' && "text-emerald-500",
        status === 'pending' && "text-amber-500",
        status === 'optional' && "text-muted-foreground/50"
      )}>
        {status === 'filled' ? '●' : status === 'pending' ? '○' : '·'}
      </span>
    )

    const labelText = variable.descricao || variable.nome.replace(/_/g, ' ')

    switch (variable.tipo) {
      case 'texto':
        return (
          <div key={variable.nome} className="flex items-center gap-2 py-0.5">
            {statusIndicator}
            <Label htmlFor={variable.nome} className="text-[11px] text-muted-foreground min-w-[80px] max-w-[100px] truncate">
              {labelText}
            </Label>
            <Input
              id={variable.nome}
              value={value?.toString() || ''}
              onChange={(e) => handleValueChange(variable.nome, e.target.value)}
              placeholder={variable.valor_padrao?.toString() || '...'}
              className={cn(
                "h-6 text-[11px] flex-1 px-2",
                error && 'border-destructive'
              )}
            />
          </div>
        )

      case 'numero':
        return (
          <div key={variable.nome} className="flex items-center gap-2 py-0.5">
            {statusIndicator}
            <Label htmlFor={variable.nome} className="text-[11px] text-muted-foreground min-w-[80px] max-w-[100px] truncate">
              {labelText}
              {variable.unidade && <span className="ml-0.5 opacity-60">({variable.unidade})</span>}
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
              className={cn(
                "h-6 text-[11px] w-16 px-2",
                error && 'border-destructive'
              )}
            />
          </div>
        )

      case 'select':
        return (
          <div key={variable.nome} className="flex items-center gap-2 py-0.5">
            {statusIndicator}
            <Label htmlFor={variable.nome} className="text-[11px] text-muted-foreground min-w-[80px] max-w-[100px] truncate">
              {labelText}
            </Label>
            <Select
              value={value?.toString() || ''}
              onValueChange={(val) => handleValueChange(variable.nome, val)}
            >
              <SelectTrigger className={cn("h-6 text-[11px] flex-1 px-2", error && 'border-destructive')}>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {variable.opcoes?.map((opcao) => (
                  <SelectItem key={opcao} value={opcao} className="text-[11px]">
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'boolean':
        return (
          <div key={variable.nome} className="flex items-center gap-2 py-0.5">
            {statusIndicator}
            <Label htmlFor={variable.nome} className="text-[11px] text-muted-foreground flex-1 truncate">
              {labelText}
            </Label>
            <Switch
              id={variable.nome}
              checked={!!value}
              onCheckedChange={(checked) => handleValueChange(variable.nome, checked)}
              className="scale-[0.65]"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="px-3 py-2 border-b shrink-0">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-xs font-medium truncate">{codigo}</DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-muted-foreground">
                {filledCount}/{variaveis.length}
              </span>
              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(filledCount / variaveis.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content - Two columns */}
        <div className="flex-1 flex min-h-0">
          {/* Variables Panel - Compact, scrollable */}
          <div className="w-[240px] border-r flex flex-col shrink-0">
            <div className="px-2 py-1.5 border-b bg-muted/30">
              <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                Variáveis
              </span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
              {variaveis.map(renderCompactField)}
            </div>
          </div>

          {/* Preview Panel - Primary, always visible */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-3 py-1.5 border-b bg-muted/30">
              <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                Preview
              </span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
              <div className="space-y-3">
                {/* Texto Preview */}
                <div>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase mb-1">Texto</div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/20 rounded p-2 border">
                    {preview || <span className="text-muted-foreground italic">Preencha as variáveis...</span>}
                  </div>
                </div>

                {/* Conclusão Preview */}
                {conclusao && (
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase mb-1">Conclusão</div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/20 rounded p-2 border">
                      {conclusaoPreview || <span className="text-muted-foreground italic">Preencha as variáveis...</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-3 py-2 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={handleSubmit}>
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
