import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Copy, FileInput, X } from 'lucide-react'
import { RadiologyTable } from '@/lib/radiologyTables'
import { toast } from 'sonner'

interface TableViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: RadiologyTable | null
  onInsertTable?: (htmlContent: string) => void
}

export function TableViewerModal({ open, onOpenChange, table, onInsertTable }: TableViewerModalProps) {
  if (!table) return null

  const handleCopy = async () => {
    try {
      const blob = new Blob([table.htmlContent], { type: 'text/html' })
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': blob })
      ])
      toast.success('Tabela copiada para área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar tabela')
    }
  }

  const handleInsert = () => {
    if (onInsertTable) {
      onInsertTable(table.htmlContent)
      onOpenChange(false)
      toast.success('Tabela inserida no editor')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-card/95 backdrop-blur-md border-border/50">
        <DialogHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-foreground">
                {table.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground text-sm">{table.category}</span>
                {table.modality && table.modality.map((mod) => (
                  <Badge key={mod} variant="secondary" className="text-xs">
                    {mod}
                  </Badge>
                ))}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Área de Visualização da Tabela */}
        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
          <div 
            className="bg-background rounded-lg p-6 shadow-inner border border-border/20"
            dangerouslySetInnerHTML={{ __html: table.htmlContent }}
          />
        </ScrollArea>

        {/* Footer com Ações */}
        <DialogFooter className="border-t border-border/40 pt-4 flex-col sm:flex-row gap-2">
          <div className="flex gap-2 sm:mr-auto">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              <Copy className="h-4 w-4" />
              Copiar
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            {onInsertTable && (
              <Button onClick={handleInsert} className="gap-2">
                <FileInput className="h-4 w-4" />
                Inserir no Editor
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
