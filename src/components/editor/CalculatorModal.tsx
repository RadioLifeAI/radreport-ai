import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, ExternalLink } from 'lucide-react'
import { RadiologyCalculator, CalculatorResult } from '@/lib/radiologyCalculators'

interface CalculatorModalProps {
  calculator: RadiologyCalculator | null
  isOpen: boolean
  onClose: () => void
  onInsert: (text: string) => void
}

export function CalculatorModal({ calculator, isOpen, onClose, onInsert }: CalculatorModalProps) {
  const [values, setValues] = useState<Record<string, number | string>>({})
  const [result, setResult] = useState<CalculatorResult | null>(null)

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
    }
  }, [calculator, isOpen])

  useEffect(() => {
    if (calculator && Object.keys(values).length > 0) {
      // Check if all required values are present
      const allValuesFilled = calculator.inputs.every(input => {
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
          {/* Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Parâmetros</h3>
            <div className="grid gap-4">
              {calculator.inputs.map(input => (
                <div key={input.name} className="grid gap-2">
                  <Label htmlFor={input.name}>
                    {input.label} {input.unit && <span className="text-muted-foreground">({input.unit})</span>}
                  </Label>
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
