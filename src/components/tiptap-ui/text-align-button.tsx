import * as React from 'react'
import { EditorContext } from '@tiptap/react'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'

export interface TextAlignButtonProps {
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

export function TextAlignButton({ alignment }: TextAlignButtonProps) {
  const context = React.useContext(EditorContext)
  const editor = context?.editor

  if (!editor) return null
  const Icon = alignmentIcons[alignment]
  const label = alignmentLabels[alignment]

  const isActive = editor.isActive({ textAlign: alignment })
  const canSetAlignment = editor.can().setTextAlign(alignment)

  const handleClick = () => {
    editor.chain().focus().setTextAlign(alignment).run()
  }

  return (
    <Button
      data-style="ghost"
      data-active={isActive}
      onClick={handleClick}
      disabled={!canSetAlignment}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
