import { type Editor } from '@tiptap/react'

export function getMarkAttributes(editor: Editor, markType: string) {
  const { from, to, empty } = editor.state.selection
  const marks = []

  if (empty) {
    marks.push(...editor.state.storedMarks || editor.state.selection.$from.marks())
  } else {
    editor.state.doc.nodesBetween(from, to, (node) => {
      marks.push(...node.marks)
    })
  }

  const mark = marks.find((markItem) => markItem.type.name === markType)

  if (mark) {
    return mark.attrs
  }

  return {}
}

export function isTextSelected(editor: Editor) {
  const { from, to } = editor.state.selection
  return from !== to
}
