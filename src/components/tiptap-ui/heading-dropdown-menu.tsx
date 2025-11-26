import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeadingDropdownMenuProps {}

type Level = 1 | 2 | 3

export function HeadingDropdownMenu({}: HeadingDropdownMenuProps = {}) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const getCurrentHeading = () => {
    for (const level of [1, 2, 3] as Level[]) {
      if (editor.isActive('heading', { level })) {
        return `Heading ${level}`
      }
    }
    return editor.isActive('paragraph') ? 'Paragraph' : 'Text'
  }

  const setHeading = (level: Level) => {
    editor.chain().focus().setHeading({ level }).run()
  }

  const setParagraph = () => {
    editor.chain().focus().setParagraph().run()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 gap-1 px-2">
          <span className="text-sm">{getCurrentHeading()}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={setParagraph}
          className={cn(
            editor.isActive('paragraph') && 'bg-accent'
          )}
        >
          Paragraph
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setHeading(1)}
          className={cn(
            'text-2xl font-bold',
            editor.isActive('heading', { level: 1 }) && 'bg-accent'
          )}
        >
          Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setHeading(2)}
          className={cn(
            'text-xl font-bold',
            editor.isActive('heading', { level: 2 }) && 'bg-accent'
          )}
        >
          Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setHeading(3)}
          className={cn(
            'text-lg font-bold',
            editor.isActive('heading', { level: 3 }) && 'bg-accent'
          )}
        >
          Heading 3
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
