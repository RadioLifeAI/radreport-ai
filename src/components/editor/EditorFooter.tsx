import { RotateCcw, Copy, Sparkles } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { TablesDropdown } from './TablesDropdown'
import { CalculatorsDropdown } from './CalculatorsDropdown'

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

  return (
    <div className="h-16 border-t border-border/40 bg-card/95 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          <RotateCcw size={18} />
          <span className="text-sm">Reiniciar laudo</span>
        </button>
        
        <TablesDropdown editor={editor} onInsertTable={handleInsertTable} />
        <CalculatorsDropdown editor={editor} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 transition-all shadow-lg hover:scale-105"
        >
          <Sparkles size={18} />
          <span className="text-sm font-medium">Copiar laudo</span>
        </button>
      </div>
    </div>
  )
}
