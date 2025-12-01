import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, FileText, Tag, AlertCircle } from 'lucide-react'

interface AISuggestionPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  
  // Configuração do modal
  type: 'suggestion' | 'conclusion' | 'rads'
  title: string
  
  // Conteúdo
  previewContent: string
  notes?: string | string[]
  
  // Metadados RADS (opcional)
  radsInfo?: {
    system: string
    category: string
    recommendation?: string
  }
  
  // Estados
  isApplying?: boolean
  applyButtonText?: string
}

export function AISuggestionPreviewModal({
  isOpen,
  onClose,
  onApply,
  type,
  title,
  previewContent,
  notes,
  radsInfo,
  isApplying = false,
  applyButtonText = 'Aplicar'
}: AISuggestionPreviewModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'suggestion': return <Sparkles className="w-5 h-5" />
      case 'conclusion': return <FileText className="w-5 h-5" />
      case 'rads': return <Tag className="w-5 h-5" />
    }
  }

  // Sanitizar notas (remover HTML)
  const sanitizeNote = (note: string): string => {
    return note.replace(/<[^>]*>/g, '')
  }
  
  const notesArray = Array.isArray(notes) ? notes : notes ? [notes] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {getIcon()}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {/* Preview do conteúdo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>📋</span>
                <span>Prévia do Conteúdo</span>
              </div>
              <div 
                className="bg-muted/30 rounded-lg p-4 border border-border/40"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>

            {/* Badge RADS (se aplicável) */}
            {radsInfo && (
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-l-4 border-purple-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 border-purple-500/30">
                        {radsInfo.system}
                      </Badge>
                      <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                        {radsInfo.category}
                      </span>
                    </div>
                    {radsInfo.recommendation && (
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        {radsInfo.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notas (se houver) */}
            {notesArray.length > 0 && (
              <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      💡 Notas do Revisor
                    </p>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                      {notesArray.map((note, idx) => (
                        <li key={idx}>{sanitizeNote(note)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isApplying}
          >
            Cancelar
          </Button>
          <Button
            onClick={onApply}
            disabled={isApplying}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700"
          >
            {isApplying ? 'Aplicando...' : applyButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
