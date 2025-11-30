import { useState } from 'react'
import { Calculator, ChevronDown, Heart, Baby, Brain, Ruler } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { radiologyCalculators, RadiologyCalculator } from '@/lib/radiologyCalculators'
import { CalculatorModal } from './CalculatorModal'
import { Editor } from '@tiptap/react'

interface CalculatorsDropdownProps {
  editor: Editor | null
}

const categoryIcons = {
  geral: Ruler,
  obstetricia: Baby,
  neuro: Brain,
  cardio: Heart,
  urologia: Ruler
}

const categoryLabels = {
  geral: 'Geral',
  obstetricia: 'Obstetrícia',
  neuro: 'Neuroimagem',
  cardio: 'Cardiologia',
  urologia: 'Urologia'
}

export function CalculatorsDropdown({ editor }: CalculatorsDropdownProps) {
  const [selectedCalculator, setSelectedCalculator] = useState<RadiologyCalculator | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCalculatorClick = (calculator: RadiologyCalculator) => {
    setSelectedCalculator(calculator)
    setIsModalOpen(true)
  }

  const handleInsertCalculation = (text: string) => {
    if (!editor) return
    
    editor.chain()
      .focus()
      .insertContent(text)
      .run()
  }

  // Group calculators by category
  const calculatorsByCategory = radiologyCalculators.reduce((acc, calc) => {
    if (!acc[calc.category]) {
      acc[calc.category] = []
    }
    acc[calc.category].push(calc)
    return acc
  }, {} as Record<string, RadiologyCalculator[]>)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Calculator size={18} />
            <span className="text-sm">Calculadoras</span>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[320px] max-h-[600px] overflow-y-auto">
          {Object.entries(calculatorsByCategory).map(([category, calcs], index) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]
            const label = categoryLabels[category as keyof typeof categoryLabels]
            
            return (
              <div key={category}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{label}</span>
                </DropdownMenuLabel>
                {calcs.map(calc => (
                  <DropdownMenuItem
                    key={calc.id}
                    onClick={() => handleCalculatorClick(calc)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{calc.name}</span>
                      <span className="text-xs text-muted-foreground">{calc.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <CalculatorModal
        calculator={selectedCalculator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInsert={handleInsertCalculation}
      />
    </>
  )
}
