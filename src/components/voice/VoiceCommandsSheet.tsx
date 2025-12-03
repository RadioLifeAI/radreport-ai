import { useState, useMemo } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Mic, 
  Search, 
  Type, 
  Navigation, 
  Pencil, 
  Palette, 
  Star,
  Keyboard
} from 'lucide-react'
import { 
  getCommandsByCategory, 
  searchCommands, 
  getTotalCommands,
  type VoiceCommand 
} from '@/lib/voiceCommandsConfig'
import { cn } from '@/lib/utils'

interface VoiceCommandsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Category configuration with colors and icons
const CATEGORY_CONFIG: Record<string, {
  icon: React.ElementType
  label: string
  bgColor: string
  borderColor: string
  badgeClass: string
  iconColor: string
}> = {
  pontuação: {
    icon: Type,
    label: 'Pontuação',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/90 text-amber-950 dark:text-amber-100',
    iconColor: 'text-amber-500'
  },
  navegação: {
    icon: Navigation,
    label: 'Navegação',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeClass: 'bg-blue-500/90 text-blue-950 dark:text-blue-100',
    iconColor: 'text-blue-500'
  },
  edição: {
    icon: Pencil,
    label: 'Edição',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeClass: 'bg-red-500/90 text-red-950 dark:text-red-100',
    iconColor: 'text-red-500'
  },
  formatação: {
    icon: Palette,
    label: 'Formatação',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badgeClass: 'bg-purple-500/90 text-purple-950 dark:text-purple-100',
    iconColor: 'text-purple-500'
  },
  especiais: {
    icon: Star,
    label: 'Especiais',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/90 text-emerald-950 dark:text-emerald-100',
    iconColor: 'text-emerald-500'
  }
}

// Fallback config for unknown categories
const DEFAULT_CONFIG = {
  icon: Keyboard,
  label: 'Outros',
  bgColor: 'bg-muted/50',
  borderColor: 'border-border',
  badgeClass: 'bg-muted text-muted-foreground',
  iconColor: 'text-muted-foreground'
}

function CategoryAccordion({ 
  category, 
  commands 
}: { 
  category: string
  commands: VoiceCommand[] 
}) {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG
  const Icon = config.icon
  
  return (
    <AccordionItem 
      value={category} 
      className={cn(
        "border rounded-lg mb-2 overflow-hidden",
        config.borderColor
      )}
    >
      <AccordionTrigger 
        className={cn(
          "px-4 py-3 hover:no-underline transition-colors",
          config.bgColor
        )}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={config.iconColor} />
          <span className="font-medium">{config.label}</span>
          <Badge variant="secondary" className="text-xs px-2">
            {commands.length}
          </Badge>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[45%]">
                  Função
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[25%]">
                  Comando
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[30%]">
                  Sinônimos
                </th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd, index) => (
                <tr 
                  key={cmd.command} 
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    index !== commands.length - 1 && "border-b border-border/30"
                  )}
                >
                  <td className="px-3 py-2.5 text-xs">
                    {cmd.description}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge className={cn("text-xs font-mono px-2", config.badgeClass)}>
                      {cmd.command}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {cmd.synonyms && cmd.synonyms.length > 0 
                      ? cmd.synonyms.slice(0, 2).join(', ') + (cmd.synonyms.length > 2 ? '...' : '')
                      : '—'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function FilteredResults({ 
  commands, 
  searchQuery 
}: { 
  commands: VoiceCommand[]
  searchQuery: string 
}) {
  if (commands.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Search size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhum comando encontrado para "{searchQuery}"</p>
      </div>
    )
  }

  // Group filtered results by category
  const grouped = commands.reduce((acc, cmd) => {
    const cat = cmd.category || 'outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(cmd)
    return acc
  }, {} as Record<string, VoiceCommand[]>)

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground px-1 mb-3">
        {commands.length} resultado{commands.length !== 1 ? 's' : ''} para "{searchQuery}"
      </p>
      {Object.entries(grouped).map(([category, cmds]) => (
        <CategoryAccordion key={category} category={category} commands={cmds} />
      ))}
    </div>
  )
}

export function VoiceCommandsSheet({ open, onOpenChange }: VoiceCommandsSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const groupedCommands = useMemo(() => getCommandsByCategory(), [])
  const totalCommands = useMemo(() => getTotalCommands(), [])
  
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return null
    return searchCommands(searchQuery)
  }, [searchQuery])

  // Order categories logically
  const categoryOrder = ['pontuação', 'navegação', 'edição', 'formatação', 'especiais']
  const orderedCategories = categoryOrder.filter(cat => groupedCommands[cat]?.length > 0)
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[500px] sm:max-w-[600px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Mic className="text-cyan-500" size={20} />
            </div>
            <div>
              <span>Comandos de Voz</span>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                {totalCommands} comandos disponíveis
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        {/* Search */}
        <div className="px-6 py-4 border-b border-border/30">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
            />
            <Input
              placeholder="Buscar comandos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30"
            />
          </div>
        </div>
        
        {/* Content */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="pr-2">
            {filteredCommands ? (
              <FilteredResults commands={filteredCommands} searchQuery={searchQuery} />
            ) : (
              <Accordion 
                type="multiple" 
                defaultValue={['pontuação', 'navegação']}
                className="space-y-0"
              >
                {orderedCategories.map((category) => (
                  <CategoryAccordion 
                    key={category} 
                    category={category} 
                    commands={groupedCommands[category]} 
                  />
                ))}
              </Accordion>
            )}
          </div>
        </ScrollArea>

        {/* Footer tip */}
        <div className="px-6 py-3 border-t border-border/30 bg-muted/20">
          <p className="text-[10px] text-muted-foreground text-center">
            💡 Dica: Use comandos de voz durante o ditado para inserir pontuação e formatação automaticamente
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
