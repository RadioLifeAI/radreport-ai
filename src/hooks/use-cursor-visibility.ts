import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'

interface UseCursorVisibilityProps {
  editor: Editor | null
  overlayHeight?: number
}

export function useCursorVisibility({
  editor,
  overlayHeight = 0,
}: UseCursorVisibilityProps) {
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!editor) return

    const updateCursorPosition = () => {
      const { state } = editor
      const { selection } = state
      const { from } = selection

      const coords = editor.view.coordsAtPos(from)
      
      setRect({
        x: coords.left,
        y: coords.top,
        width: 0,
        height: coords.bottom - coords.top,
      })
    }

    editor.on('selectionUpdate', updateCursorPosition)
    editor.on('transaction', updateCursorPosition)

    updateCursorPosition()

    return () => {
      editor.off('selectionUpdate', updateCursorPosition)
      editor.off('transaction', updateCursorPosition)
    }
  }, [editor, overlayHeight])

  return rect
}
