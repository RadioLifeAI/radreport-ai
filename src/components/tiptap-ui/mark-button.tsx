import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code 
} from 'lucide-react'

export interface MarkButtonProps {
  editor: Editor
  markType: 'bold' | 'italic' | 'underline' | 'strike' | 'code'
}

const markIcons = {
  bold: Bold,
  italic: Italic,
  underline: UnderlineIcon,
  strike: Strikethrough,
  code: Code,
}

const markLabels = {
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strike: 'Strikethrough',
  code: 'Code',
}

export function MarkButton({ editor, markType }: MarkButtonProps) {
  const Icon = markIcons[markType]
  const label = markLabels[markType]

  const isActive = editor.isActive(markType)
  const canToggle = editor.can().chain().focus().toggleMark(markType).run()

  const handleClick = () => {
    editor.chain().focus().toggleMark(markType).run()
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={!canToggle}
          className={cn(
            'h-8 w-8',
            isActive && 'bg-accent text-accent-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function getFormattedMarkName(markType: string): string {
  return markLabels[markType as keyof typeof markLabels] || markType
}
