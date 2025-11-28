import { Editor } from '@tiptap/react'
import { Table2, ChevronDown, Award, Baby, Activity, Bone, HeartPulse } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { RADIOLOGY_TABLES } from '@/lib/radiologyTables'

interface TablesDropdownProps {
  editor: Editor | null
  onInsertTable: (tableHtml: string) => void
}

const iconMap: Record<string, any> = {
  Award,
  Baby,
  Activity,
  Bone,
  HeartPulse,
}

export function TablesDropdown({ editor, onInsertTable }: TablesDropdownProps) {
  if (!editor) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground">
          <Table2 size={16} />
          <span className="text-sm">Tabelas</span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover border-border z-[100]">
        {RADIOLOGY_TABLES.map((category) => {
          const IconComponent = iconMap[category.icon]
          return (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger className="cursor-pointer">
                {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                <span>{category.name}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-popover border-border z-[101]">
                {category.tables.map((table) => (
                  <DropdownMenuItem
                    key={table.id}
                    onClick={() => onInsertTable(table.htmlContent)}
                    className="cursor-pointer"
                  >
                    {table.name}
                    {table.modality && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {table.modality.join(', ')}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
