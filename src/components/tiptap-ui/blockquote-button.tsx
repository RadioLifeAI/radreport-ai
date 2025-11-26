import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Quote } from 'lucide-react'

export interface BlockquoteButtonProps {}

export function BlockquoteButton({}: BlockquoteButtonProps = {}) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const isActive = editor.isActive('blockquote')
  const canToggle = editor.can().toggleBlockquote()

  const handleClick = () => {
    editor.chain().focus().toggleBlockquote().run()
  }

  return (
    <Button
      data-style="ghost"
      data-active={isActive}
      onClick={handleClick}
      disabled={!canToggle}
    >
      <Quote className="h-4 w-4" />
    </Button>
  )
}
