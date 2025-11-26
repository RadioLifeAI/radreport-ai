import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { CodeBlockIcon } from '@/components/tiptap-icons'

export interface CodeBlockButtonProps {}

export function CodeBlockButton({}: CodeBlockButtonProps = {}) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const isActive = editor.isActive('codeBlock')
  const canToggle = editor.can().toggleCodeBlock()

  const handleClick = () => {
    editor.chain().focus().toggleCodeBlock().run()
  }

  return (
    <Button
      data-style="ghost"
      data-active={isActive}
      onClick={handleClick}
      disabled={!canToggle}
    >
      <CodeBlockIcon className="h-4 w-4" />
    </Button>
  )
}
