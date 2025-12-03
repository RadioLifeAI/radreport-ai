import { useState } from 'react'
import { Calculator, ChevronDown, Heart, Baby, Brain, Ruler, Activity, Scan, Target, Star } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { radiologyCalculators, RadiologyCalculator } from '@/lib/radiologyCalculators'
import { CalculatorModal } from './CalculatorModal'
import { Editor } from '@tiptap/react'
import { useFavoriteCalculators } from '@/hooks/useFavoriteCalculators'

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
  const { favorites, isFavorite, toggleFavorite } = useFavoriteCalculators()

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

  const handleToggleFavorite = (e: React.MouseEvent, calculatorId: string) => {
    e.stopPropagation()
    toggleFavorite(calculatorId)
  }

  // Group calculators by category
  const calculatorsByCategory = radiologyCalculators.reduce((acc, calc) => {
    if (!acc[calc.category]) {
      acc[calc.category] = []
    }
    acc[calc.category].push(calc)
    return acc
  }, {} as Record<string, RadiologyCalculator[]>)

  // Get favorite calculators
  const favoriteCalculators = radiologyCalculators.filter(calc => favorites.includes(calc.id))

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
          {/* Seção de Favoritos */}
          {favoriteCalculators.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Favoritos
              </div>
              {favoriteCalculators.map((calc) => (
                <div
                  key={`fav-${calc.id}`}
                  className="group flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm transition-colors cursor-pointer"
                  onClick={() => {
                    handleCalculatorClick(calc)
                    setDropdownOpen(false)
                  }}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{calc.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{calc.description}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => handleToggleFavorite(e, calc.id)}
                      title="Remover dos favoritos"
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </Button>
                  </div>
                </div>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Categorias */}
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
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{calc.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{calc.description}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => handleToggleFavorite(e, calc.id)}
                          title={isFavorite(calc.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                          <Star 
                            className={`h-4 w-4 transition-colors ${
                              isFavorite(calc.id) 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-muted-foreground hover:text-amber-400'
                            }`} 
                          />
                        </Button>
                        <Calculator className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
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
