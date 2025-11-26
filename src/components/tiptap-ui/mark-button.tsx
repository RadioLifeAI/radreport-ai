import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  StrikeIcon, 
  Code2Icon,
  SubscriptIcon,
  SuperscriptIcon
} from '@/components/tiptap-icons'

export interface MarkButtonProps {
  markType: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'subscript' | 'superscript'
}

const markIcons = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikeIcon,
  code: Code2Icon,
  subscript: SubscriptIcon,
  superscript: SuperscriptIcon,
}

const markLabels = {
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strike: 'Strikethrough',
  code: 'Code',
  subscript: 'Subscript',
  superscript: 'Superscript',
}

export function MarkButton({ markType }: MarkButtonProps) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const Icon = markIcons[markType]
  const label = markLabels[markType]

  const isActive = editor.isActive(markType)
  const canToggle = editor.can().chain().focus().toggleMark(markType).run()

  const handleClick = () => {
    editor.chain().focus().toggleMark(markType).run()
  }

  return (
    <Button
      data-style="ghost"
      data-active={isActive}
      onClick={handleClick}
      disabled={!canToggle}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

