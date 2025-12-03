import { useState } from 'react'
import { Calculator, ChevronDown, Heart, Baby, Brain, Ruler, Activity, Scan, Target } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
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
  urologia: Ruler,
  abdome: Scan,
  vascular: Activity,
  oncologia: Target
}

const categoryLabels = {
  geral: 'Geral',
  obstetricia: 'Obstetrícia',
  neuro: 'Neuroimagem',
  cardio: 'Cardiologia',
  urologia: 'Urologia',
  abdome: 'Abdome',
  vascular: 'Vascular',
  oncologia: 'Oncologia'
}

export function CalculatorsDropdown({ editor }: CalculatorsDropdownProps) {
  const [selectedCalculator, setSelectedCalculator] = useState<RadiologyCalculator | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground">
            <Calculator size={16} />
            <span className="text-sm">Calculadoras</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 bg-popover border-border z-[100]">
          {Object.entries(calculatorsByCategory).map(([category, calcs]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons]
            const label = categoryLabels[category as keyof typeof categoryLabels]
            
            return (
              <DropdownMenuSub key={category}>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-80 bg-popover border-border z-[101]">
                  {calcs.map((calc) => (
                    <div
                      key={calc.id}
                      className="group flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm transition-colors cursor-pointer"
                      onClick={() => {
                        handleCalculatorClick(calc)
                        setDropdownOpen(false)
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{calc.name}</span>
                        <span className="text-xs text-muted-foreground">{calc.description}</span>
                      </div>
                      <Calculator className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
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
