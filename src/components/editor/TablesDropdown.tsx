import { useState } from 'react'
import { Editor } from '@tiptap/react'
import { Table2, ChevronDown, Award, Baby, Activity, Bone, HeartPulse, Brain, Eye, FileInput, Copy, Bookmark, Stethoscope, Layers } from 'lucide-react'
import { toast } from 'sonner'
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
import { RADIOLOGY_TABLES, RadiologyTable } from '@/lib/radiologyTables'
import { TableViewerModal } from './TableViewerModal'

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
  Brain,
  Stethoscope,
  Layers,
}

export function TablesDropdown({ editor, onInsertTable }: TablesDropdownProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<RadiologyTable | null>(null)

  if (!editor) return null

  const handleViewTable = (table: RadiologyTable) => {
    setSelectedTable(table)
    setViewerOpen(true)
  }

  const handleCopyTable = async (table: RadiologyTable) => {
    try {
      // Cria blob HTML com estilos preservados
      const htmlBlob = new Blob([table.htmlContent], { type: 'text/html' })
      
      // Também cria versão texto plano como fallback
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = table.htmlContent
      const textBlob = new Blob([tempDiv.textContent || ''], { type: 'text/plain' })
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        })
      ])
      
      toast.success('Tabela copiada! Cole em Word ou Google Docs.')
    } catch (error) {
      console.error('Erro ao copiar tabela:', error)
      toast.error('Erro ao copiar tabela')
    }
  }

  const handleInsertAsReference = (table: RadiologyTable) => {
    if (!editor) return
    
    editor
      .chain()
      .focus()
      .insertInformativeTable({
        tableId: table.id,
        tableName: table.name,
        htmlContent: table.htmlContent,
      })
      .run()
    
    toast.success(`Tabela "${table.name}" inserida como referência`)
  }

  const handleInsertEditable = (table: RadiologyTable) => {
    onInsertTable(table.htmlContent)
    toast.success(`Tabela "${table.name}" inserida para edição`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground">
            <Table2 size={16} />
            <span className="text-sm">Tabelas</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-popover border-border z-[100]">
          {RADIOLOGY_TABLES.map((category) => {
            const IconComponent = iconMap[category.icon]
            return (
              <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                  <span>{category.name}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-80 bg-popover border-border z-[101]">
                  {category.tables.map((table) => (
                    <div
                      key={table.id}
                      className="group flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm transition-colors"
                    >
                      <span className="text-sm truncate flex-1 mr-2">{table.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {table.type === 'informative' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewTable(table)
                              }}
                              title="Visualizar tabela"
                            >
                              <Eye className="h-4 w-4 text-slate-400 group-hover:text-white hover:text-blue-400 transition-colors" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyTable(table)
                              }}
                              title="Copiar para clipboard"
                            >
                              <Copy className="h-4 w-4 text-slate-400 group-hover:text-white hover:text-purple-400 transition-colors" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleInsertAsReference(table)
                              }}
                              title="Inserir como referência"
                            >
                              <Bookmark className="h-4 w-4 text-slate-400 group-hover:text-white hover:text-cyan-400 transition-colors" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleInsertEditable(table)
                            }}
                            title="Inserir para edição"
                          >
                            <FileInput className="h-4 w-4 text-slate-400 group-hover:text-white hover:text-green-400 transition-colors" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <TableViewerModal
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        table={selectedTable}
        editor={editor}
        onInsertTable={onInsertTable}
      />
    </>
  )
}
