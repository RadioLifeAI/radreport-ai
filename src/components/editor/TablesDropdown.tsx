import { useState, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import { Table2, ChevronDown, Award, Baby, Activity, Bone, HeartPulse, Brain, Eye, FileInput, Copy, Bookmark, Stethoscope, Layers, Star } from 'lucide-react'
import { toast } from 'sonner'
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
import { RADIOLOGY_TABLES, RadiologyTable } from '@/lib/radiologyTables'
import { TableViewerModal } from './TableViewerModal'
import { useFavoriteTables } from '@/hooks/useFavoriteTables'

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<RadiologyTable | null>(null)
  const { favorites, isFavorite, toggleFavorite, recordUsage, favoriteTables } = useFavoriteTables()

  // Limit to 3 favorites in dropdown
  const displayedFavorites = favoriteTables.slice(0, 3)
  const hiddenCount = favoriteTables.length - 3

  if (!editor) return null

  const handleViewTable = (table: RadiologyTable) => {
    setSelectedTable(table)
    setViewerOpen(true)
  }

  const handleCopyTable = async (table: RadiologyTable) => {
    try {
      const htmlBlob = new Blob([table.htmlContent], { type: 'text/html' })
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
    
    recordUsage(table.id)
    toast.success(`Tabela "${table.name}" inserida como referência`)
  }

  const handleInsertEditable = (table: RadiologyTable) => {
    onInsertTable(table.htmlContent)
    recordUsage(table.id)
    toast.success(`Tabela "${table.name}" inserida para edição`)
  }

  const handleToggleFavorite = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation()
    toggleFavorite(tableId)
  }

  const renderTableActions = (table: RadiologyTable) => (
    <div className="flex items-center gap-1 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => handleToggleFavorite(e, table.id)}
        title={isFavorite(table.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star 
          className={`h-4 w-4 transition-colors ${
            isFavorite(table.id) 
              ? 'fill-amber-400 text-amber-400' 
              : 'text-muted-foreground hover:text-amber-400'
          }`} 
        />
      </Button>
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
            <Eye className="h-4 w-4 text-muted-foreground hover:text-blue-400 transition-colors" />
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
            <Copy className="h-4 w-4 text-muted-foreground hover:text-purple-400 transition-colors" />
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
            <Bookmark className="h-4 w-4 text-muted-foreground hover:text-cyan-400 transition-colors" />
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
          <FileInput className="h-4 w-4 text-muted-foreground hover:text-green-400 transition-colors" />
        </Button>
      )}
    </div>
  )

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-foreground">
            <Table2 size={16} />
            <span className="text-sm">Tabelas</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-popover border-border z-[100]">
          {/* Seção de Favoritos - máximo 3 */}
          {displayedFavorites.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1 justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  Favoritos
                </div>
                {hiddenCount > 0 && (
                  <span className="text-[10px] text-muted-foreground/70">(+{hiddenCount} na sidebar)</span>
                )}
              </div>
              {displayedFavorites.map((table) => (
                <div
                  key={`fav-${table.id}`}
                  className="group flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm transition-colors"
                >
                  <span className="text-sm truncate flex-1 mr-2">{table.name}</span>
                  {renderTableActions(table)}
                </div>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Categorias */}
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
                      {renderTableActions(table)}
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
