import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
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

    const processedTexto = processText(texto, values)
    const processedConclusao = conclusao ? processText(conclusao, values) : undefined

    onSubmit(processedTexto, processedConclusao)
    onOpenChange(false)
  }

  const renderField = (variable: FraseVariable) => {
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
            </Label>
            <Input
              id={variable.nome}
              type="number"
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Preencher Variáveis</DialogTitle>
          <p className="text-sm text-muted-foreground">{codigo}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {variaveis.map(renderField)}

            {/* Preview Section */}
            {preview && (
              <div className="mt-6 space-y-2">
                <Label>Preview:</Label>
                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  {preview}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
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
