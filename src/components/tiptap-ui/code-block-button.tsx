import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { FileCode } from 'lucide-react'

export interface CodeBlockButtonProps {
  editor: Editor
}

export function CodeBlockButton({ editor }: CodeBlockButtonProps) {
  const isActive = editor.isActive('codeBlock')
  const canToggle = editor.can().toggleCodeBlock()

  const handleClick = () => {
    editor.chain().focus().toggleCodeBlock().run()
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
          <FileCode className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Code Block</p>
      </TooltipContent>
    </Tooltip>
  )
}
