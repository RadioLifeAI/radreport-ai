import * as React from 'react'
import { type Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Undo, Redo } from 'lucide-react'

export interface UndoRedoButtonProps {
  editor: Editor
  action: 'undo' | 'redo'
}

export function UndoRedoButton({ editor, action }: UndoRedoButtonProps) {
  const Icon = action === 'undo' ? Undo : Redo
  const label = action === 'undo' ? 'Undo' : 'Redo'

  const canPerformAction = action === 'undo' 
    ? editor.can().undo() 
    : editor.can().redo()

  const handleClick = () => {
    if (action === 'undo') {
      editor.chain().focus().undo().run()
    } else {
      editor.chain().focus().redo().run()
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={!canPerformAction}
          className="h-8 w-8"
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
