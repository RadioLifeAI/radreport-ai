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
  Keyboard,
  FileText,
  MessageSquare,
  Info
} from 'lucide-react'
import { ALL_SYSTEM_COMMANDS, type VoiceCommand } from '@/modules/voice-command-engine'
import { cn } from '@/lib/utils'

interface VoiceCommandsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Category configuration
const CATEGORY_CONFIG: Record<string, {
  icon: React.ElementType
  label: string
  bgColor: string
  borderColor: string
  badgeClass: string
  iconColor: string
}> = {
  punctuation: {
    icon: Type,
    label: 'Pontuação',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/90 text-amber-950 dark:text-amber-100',
    iconColor: 'text-amber-500'
  },
  navigation: {
    icon: Navigation,
    label: 'Navegação',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeClass: 'bg-blue-500/90 text-blue-950 dark:text-blue-100',
    iconColor: 'text-blue-500'
  },
  system: {
    icon: Pencil,
    label: 'Edição',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeClass: 'bg-red-500/90 text-red-950 dark:text-red-100',
    iconColor: 'text-red-500'
  },
  formatting: {
    icon: Palette,
    label: 'Formatação',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badgeClass: 'bg-purple-500/90 text-purple-950 dark:text-purple-100',
    iconColor: 'text-purple-500'
  },
  structural: {
    icon: Star,
    label: 'Estrutura',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/90 text-emerald-950 dark:text-emerald-100',
    iconColor: 'text-emerald-500'
  }
}

const DEFAULT_CONFIG = {
  icon: Keyboard,
  label: 'Outros',
  bgColor: 'bg-muted/50',
  borderColor: 'border-border',
  badgeClass: 'bg-muted text-muted-foreground',
  iconColor: 'text-muted-foreground'
}

function CategoryAccordion({ category, commands }: { category: string; commands: VoiceCommand[] }) {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG
  const Icon = config.icon
  
  return (
    <AccordionItem value={category} className={cn("border rounded-lg mb-2 overflow-hidden", config.borderColor)}>
      <AccordionTrigger className={cn("px-4 py-3 hover:no-underline transition-colors", config.bgColor)}>
        <div className="flex items-center gap-3">
          <Icon size={18} className={config.iconColor} />
          <span className="font-medium">{config.label}</span>
          <Badge variant="secondary" className="text-xs px-2">{commands.length}</Badge>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[50%]">Comando</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[50%]">Sinônimos</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd, index) => (
                <tr key={cmd.id} className={cn("hover:bg-muted/30 transition-colors", index !== commands.length - 1 && "border-b border-border/30")}>
                  <td className="px-3 py-2.5">
                    <Badge className={cn("text-xs font-mono px-2", config.badgeClass)}>{cmd.name}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {cmd.phrases.slice(1, 3).join(', ') || '—'}
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

export function VoiceCommandsSheet({ open, onOpenChange }: VoiceCommandsSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const groupedCommands = useMemo(() => {
    const grouped: Record<string, VoiceCommand[]> = {}
    ALL_SYSTEM_COMMANDS.forEach(cmd => {
      if (!grouped[cmd.category]) grouped[cmd.category] = []
      grouped[cmd.category].push(cmd)
    })
    return grouped
  }, [])
  
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return null
    const query = searchQuery.toLowerCase()
    return ALL_SYSTEM_COMMANDS.filter(cmd => 
      cmd.name.toLowerCase().includes(query) ||
      cmd.phrases.some(p => p.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const categoryOrder = ['punctuation', 'structural', 'system', 'navigation', 'formatting']
  const orderedCategories = categoryOrder.filter(cat => groupedCommands[cat]?.length > 0)
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[500px] sm:max-w-[600px] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Mic className="text-cyan-500" size={20} />
            </div>
            <div>
              <span>Comandos de Voz</span>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                {ALL_SYSTEM_COMMANDS.length} comandos de sistema
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <div className="px-6 py-4 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comandos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="pr-2">
            {/* Dynamic Search Info */}
            <div className="mb-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-foreground mb-1">Templates e Frases são buscados dinamicamente</p>
                  <p className="text-muted-foreground">Use prefixos para inserir:</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText size={12} className="text-cyan-500" />
                      <code className="text-[10px] bg-muted px-1 rounded">"modelo tc tórax"</code>
                      <span className="text-muted-foreground">→ busca template</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare size={12} className="text-teal-500" />
                      <code className="text-[10px] bg-muted px-1 rounded">"frase esteatose"</code>
                      <span className="text-muted-foreground">→ busca frase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {filteredCommands ? (
              filteredCommands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum comando encontrado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground px-1 mb-3">
                    {filteredCommands.length} resultado{filteredCommands.length !== 1 ? 's' : ''}
                  </p>
                  {Object.entries(
                    filteredCommands.reduce((acc, cmd) => {
                      if (!acc[cmd.category]) acc[cmd.category] = []
                      acc[cmd.category].push(cmd)
                      return acc
                    }, {} as Record<string, VoiceCommand[]>)
                  ).map(([cat, cmds]) => (
                    <CategoryAccordion key={cat} category={cat} commands={cmds} />
                  ))}
                </div>
              )
            ) : (
              <Accordion type="multiple" defaultValue={['punctuation', 'structural']} className="space-y-0">
                {orderedCategories.map(category => (
                  <CategoryAccordion key={category} category={category} commands={groupedCommands[category]} />
                ))}
              </Accordion>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-3 border-t border-border/30 bg-muted/20">
          <p className="text-[10px] text-muted-foreground text-center">
            💡 Prefixos: "modelo", "template", "frase", "inserir"
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
