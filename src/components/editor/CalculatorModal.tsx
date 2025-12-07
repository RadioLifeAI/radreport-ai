import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Calculator, ExternalLink, Info, ChevronDown } from 'lucide-react'
import { RadiologyCalculator, CalculatorResult, CalculatorInput } from '@/lib/radiologyCalculators'

interface CalculatorModalProps {
  calculator: RadiologyCalculator | null
  isOpen: boolean
  onClose: () => void
  onInsert: (text: string) => void
}

export function CalculatorModal({ calculator, isOpen, onClose, onInsert }: CalculatorModalProps) {
  const [values, setValues] = useState<Record<string, number | string>>({})
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    if (calculator && isOpen) {
      // Initialize with default values
      const initialValues: Record<string, number | string> = {}
      calculator.inputs.forEach(input => {
        if (input.defaultValue !== undefined) {
          initialValues[input.name] = input.defaultValue
        }
      })
      setValues(initialValues)
      setInfoOpen(false)
    }
  }, [calculator, isOpen])

  // Filter inputs based on showWhen conditions
  const getVisibleInputs = (): CalculatorInput[] => {
    if (!calculator) return []
    return calculator.inputs.filter(input => {
      if (!input.showWhen) return true
      return values[input.showWhen.field] === input.showWhen.value
    })
  }

  useEffect(() => {
    if (calculator && Object.keys(values).length > 0) {
      // Check if all VISIBLE required values are present
      const visibleInputs = getVisibleInputs()
      const allValuesFilled = visibleInputs.every(input => {
        const value = values[input.name]
        return value !== undefined && value !== '' && value !== null
      })

      if (allValuesFilled) {
        try {
          const calculatedResult = calculator.calculate(values)
          setResult(calculatedResult)
        } catch (error) {
          console.error('Error calculating result:', error)
          setResult(null)
        }
      } else {
        setResult(null)
      }
    }
  }, [values, calculator])

  const handleInputChange = (name: string, value: string) => {
    const input = calculator?.inputs.find(i => i.name === name)
    if (!input) return

    if (input.type === 'number') {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        setValues(prev => ({ ...prev, [name]: numValue }))
      } else if (value === '') {
        setValues(prev => {
          const newValues = { ...prev }
          delete newValues[name]
          return newValues
        })
      }
    } else if (input.type === 'date') {
      setValues(prev => ({ ...prev, [name]: value }))
    } else if (input.type === 'select') {
      setValues(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleInsert = () => {
    if (result) {
      onInsert(result.formattedText)
      onClose()
    }
  }

  if (!calculator) return null

  const getColorClasses = (color?: 'success' | 'warning' | 'danger') => {
    switch (color) {
      case 'success':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30'
      case 'danger':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
      default:
        return 'text-foreground bg-muted'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            {calculator.name}
          </DialogTitle>
          <DialogDescription>{calculator.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Collapsible Info Card */}
          {calculator.info && (
            <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors group">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Sobre esta escala
                </span>
                <ChevronDown className={`w-4 h-4 ml-auto text-blue-600 dark:text-blue-400 transition-transform duration-200 ${infoOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-4 bg-muted/50 rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Purpose */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Finalidade</h4>
                  <p className="text-sm text-foreground leading-relaxed">{calculator.info.purpose}</p>
                </div>
                
                {/* Usage */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Como usar</h4>
                  <ul className="text-sm space-y-1.5">
                    {calculator.info.usage.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Grading (if exists) */}
                {calculator.info.grading && calculator.info.grading.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Graduação</h4>
                    <ul className="text-sm space-y-1">
                      {calculator.info.grading.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-muted-foreground font-mono text-xs min-w-[1.5rem]">{i}:</span>
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Parâmetros</h3>
            <div className="grid gap-4">
              {getVisibleInputs().map(input => (
                <div key={input.name} className="grid gap-2">
                  <Label htmlFor={input.name}>
                    {input.label} {input.unit && <span className="text-muted-foreground">({input.unit})</span>}
                  </Label>
                  {input.type === 'select' && input.options ? (
                    <Select
                      value={values[input.name] as string || ''}
                      onValueChange={(v) => handleInputChange(input.name, v)}
                    >
                      <SelectTrigger className="font-mono">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {input.options.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={input.name}
                      type={input.type === 'date' ? 'date' : 'number'}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={values[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      placeholder={input.placeholder}
                      className="font-mono"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Resultado</h3>
              <div className={`rounded-lg p-4 ${getColorClasses(result.color)}`}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold">
                    {typeof result.value === 'number' ? result.value.toFixed(2) : result.value}
                  </span>
                  {result.unit && <span className="text-lg font-medium">{result.unit}</span>}
                </div>
                {result.interpretation && (
                  <p className="text-sm font-medium">{result.interpretation}</p>
                )}
              </div>

              {/* Formatted text preview */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Texto para inserção:</h4>
                <p className="text-sm text-foreground">{result.formattedText}</p>
              </div>
            </div>
          )}

          {/* Reference */}
          {calculator.reference && (
            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg text-xs">
              <ExternalLink className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-muted-foreground">Referência: </span>
                <a
                  href={calculator.reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {calculator.reference.text}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!result}
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400"
          >
            Inserir no Laudo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
