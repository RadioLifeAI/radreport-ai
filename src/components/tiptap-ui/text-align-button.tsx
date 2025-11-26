import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'

export interface TextAlignButtonProps {
  editor: Editor
  alignment: 'left' | 'center' | 'right' | 'justify'
}

const alignmentIcons = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustify,
}

const alignmentLabels = {
  left: 'Align Left',
  center: 'Align Center',
  right: 'Align Right',
  justify: 'Align Justify',
}

export function TextAlignButton({ editor, alignment }: TextAlignButtonProps) {
  const Icon = alignmentIcons[alignment]
  const label = alignmentLabels[alignment]

  const isActive = editor.isActive({ textAlign: alignment })
  const canSetAlignment = editor.can().setTextAlign(alignment)

  const handleClick = () => {
    editor.chain().focus().setTextAlign(alignment).run()
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={!canSetAlignment}
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
