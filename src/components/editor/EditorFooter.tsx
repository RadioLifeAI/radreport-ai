import { RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { TablesDropdown } from './TablesDropdown'
import { CalculatorsDropdown } from './CalculatorsDropdown'
import { RADSDropdown } from './RADSDropdown'
import { toast } from 'sonner'

interface EditorFooterProps {
  editor: Editor | null
  onRestart: () => void
  onCopy: () => Promise<boolean>
}

export function EditorFooter({ editor, onRestart, onCopy }: EditorFooterProps) {
  const handleInsertTable = (tableHtml: string) => {
    if (!editor) return
    
    editor.chain()
      .focus()
      .insertContent(tableHtml, {
        parseOptions: { preserveWhitespace: false }
      })
      .run()
  }

  const handleAcceptChanges = () => {
    if (!editor) return
    
    // Clear all text colors from the document
    editor.chain().selectAll().unsetColor().setTextSelection(editor.state.doc.content.size).run()
    toast.success('Alterações aceitas', { description: 'Cores removidas do documento' })
  }

  // Check if there are any CSS variable highlight colors in the document
  const hasHighlights = editor?.state.doc.textContent ? (() => {
    let found = false
    editor.state.doc.descendants((node) => {
      if (node.marks?.some(mark => 
        mark.type.name === 'textStyle' && 
        mark.attrs.color && 
        mark.attrs.color.startsWith('var(--highlight-')
      )) {
        found = true
        return false // stop iteration
      }
    })
    return found
  })() : false

  return (
    <div className="h-14 md:h-16 border-t border-border/40 bg-card/95 backdrop-blur-sm flex items-center justify-between px-3 md:px-6">
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={onRestart}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          <RotateCcw size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="text-xs md:text-sm hidden sm:inline">Reiniciar laudo</span>
        </button>
        
        <TablesDropdown editor={editor} onInsertTable={handleInsertTable} />
        <CalculatorsDropdown editor={editor} />
        <RADSDropdown editor={editor} />
        
        {hasHighlights && (
          <button
            onClick={handleAcceptChanges}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
            title="Aceitar todas as alterações e remover destaques"
          >
            <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm hidden sm:inline">Aceitar Alterações</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCopy}
          className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 transition-all shadow-lg hover:scale-105"
        >
          <Sparkles size={16} className="md:w-[18px] md:h-[18px]" />
          <span className="text-xs md:text-sm font-medium">
            <span className="hidden sm:inline">Copiar laudo</span>
            <span className="sm:hidden">Copiar</span>
          </span>
        </button>
      </div>
    </div>
  )
}
