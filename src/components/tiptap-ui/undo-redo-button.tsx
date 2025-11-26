import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Undo2Icon, Redo2Icon } from '@/components/tiptap-icons'

export interface UndoRedoButtonProps {
  action: 'undo' | 'redo'
}

export function UndoRedoButton({ action }: UndoRedoButtonProps) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const Icon = action === 'undo' ? Undo2Icon : Redo2Icon
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
    <Button
      data-style="ghost"
      onClick={handleClick}
      disabled={!canPerformAction}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
