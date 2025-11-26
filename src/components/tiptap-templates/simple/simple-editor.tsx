import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { useTheme } from 'next-themes'
import { Toolbar } from '@/components/primitives/toolbar'
import { Spacer } from '@/components/primitives/spacer'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { SunIcon } from '@/components/tiptap-icons/sun-icon'
import { MoonStarIcon } from '@/components/tiptap-icons/moon-star-icon'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListButton } from '@/components/tiptap-ui/list-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SimpleEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

export function SimpleEditor({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  className,
}: SimpleEditorProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor || !mounted) {
    return null
  }

  const handleTaskListToggle = () => {
    editor.chain().focus().toggleTaskList().run()
  }

  const isTaskListActive = editor.isActive('taskList')

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden bg-background', className)}>
      <Toolbar>
        <HeadingDropdownMenu editor={editor} />
        
        <Separator orientation="vertical" className="h-6" />
        
        <MarkButton editor={editor} markType="bold" />
        <MarkButton editor={editor} markType="italic" />
        <MarkButton editor={editor} markType="underline" />
        <MarkButton editor={editor} markType="strike" />
        <MarkButton editor={editor} markType="code" />
        
        <Separator orientation="vertical" className="h-6" />
        
        <ColorHighlightPopover editor={editor} type="color" />
        <ColorHighlightPopover editor={editor} type="highlight" />
        
        <Separator orientation="vertical" className="h-6" />
        
        <ListButton editor={editor} listType="bulletList" />
        <ListButton editor={editor} listType="orderedList" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTaskListToggle}
              className={cn(
                'h-8 w-8',
                isTaskListActive && 'bg-accent text-accent-foreground'
              )}
            >
              <ListChecks className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Task List</p>
          </TooltipContent>
        </Tooltip>
        
        <BlockquoteButton editor={editor} />
        <CodeBlockButton editor={editor} />
        
        <Separator orientation="vertical" className="h-6" />
        
        <TextAlignButton editor={editor} alignment="left" />
        <TextAlignButton editor={editor} alignment="center" />
        <TextAlignButton editor={editor} alignment="right" />
        <TextAlignButton editor={editor} alignment="justify" />
        
        <Separator orientation="vertical" className="h-6" />
        
        <LinkPopover editor={editor} />
        <ImageUploadButton editor={editor} />
        
        <Separator orientation="vertical" className="h-6" />
        
        <UndoRedoButton editor={editor} action="undo" />
        <UndoRedoButton editor={editor} action="redo" />
        
        <Spacer />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8"
            >
              <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonStarIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle theme</p>
          </TooltipContent>
        </Tooltip>
      </Toolbar>
      
      <div className="px-4 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
