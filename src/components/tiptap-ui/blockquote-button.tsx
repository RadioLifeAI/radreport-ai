import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Quote } from 'lucide-react'

export interface BlockquoteButtonProps {
  editor: Editor
}

export function BlockquoteButton({ editor }: BlockquoteButtonProps) {
  const isActive = editor.isActive('blockquote')
  const canToggle = editor.can().toggleBlockquote()

  const handleClick = () => {
    editor.chain().focus().toggleBlockquote().run()
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
          <Quote className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Blockquote</p>
      </TooltipContent>
    </Tooltip>
  )
}
