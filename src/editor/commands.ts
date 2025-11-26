import { Editor } from '@tiptap/react'

export function insertSuggestion(editor: Editor, text: string) {
  if (!editor) return
  
  editor.chain().focus().insertContent(text).run()
}

export function insertConclusion(editor: Editor, html: string) {
  if (!editor) return
  
  // Aceitar HTML estruturado (com <h3> e <p>)
  editor.chain().focus().insertContent(html).run()
}

export function replaceSelection(editor: Editor, text: string) {
  if (!editor) return
  
  const { from, to } = editor.state.selection
  editor.chain().focus().deleteRange({ from, to }).insertContent(text).run()
}

export function insertAtCursor(editor: Editor, content: string) {
  if (!editor) return
  
  editor.chain().focus().insertContent(content).run()
}

export function applyTemplate(editor: Editor, html: string) {
  if (!editor) return
  
  editor.commands.setContent(html)
}

export function voiceInsert(editor: Editor, text: string) {
  if (!editor) return
  
  editor.chain().focus().insertContent(text + ' ').run()
}

export function expandCurrentSentence(editor: Editor, text: string) {
  if (!editor) return
  
  editor.chain().focus().insertContent(text).run()
}
