import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckSquare,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b border-border bg-muted/30 p-2 flex flex-wrap gap-1 items-center">
      {/* Text Formatting */}
      <Button
        size="sm"
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Itálico"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Sublinhado"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Tachado"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Código"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title="Destacar"
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <Button
        size="sm"
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista com marcadores"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('taskList') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="Lista de tarefas"
      >
        <CheckSquare className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Citação"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment */}
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Alinhar à esquerda"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Centralizar"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Alinhar à direita"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        title="Justificar"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Undo/Redo */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Desfazer"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Refazer"
      >
        <Redo className="h-4 w-4" />
      </Button>

      {/* Spacer to push theme toggle to the right */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  )
}
