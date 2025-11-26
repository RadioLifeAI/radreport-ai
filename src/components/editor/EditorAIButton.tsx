import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import { useReportStore } from '@/store'
import { insertSuggestion, insertConclusion } from '@/editor/commands'
import { useAuth } from '@/hooks/useAuth'

export default function EditorAIButton({ editor }: { editor: Editor | null }){
  const { modalidade = 'TC' } = { modalidade: 'TC' } // Stub until store is implemented
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  async function suggest(){
    if (!editor) return
    setLoading(true)
    try{
      const fullReport = editor.getHTML()
      const res = await fetch('/functions/v1/ai-suggestion-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullReport, userId: user?.id }),
      })
      if (!res.ok) throw new Error('Falha na sugestão IA')
      const html = await res.text()
      // Extrair <section id="improved"> e <section id="notes">
      const improvedMatch = html.match(/<section[^>]*id=["']improved["'][^>]*>([\s\S]*?)<\/section>/i)
      const notesMatch = html.match(/<section[^>]*id=["']notes["'][^>]*>([\s\S]*?)<\/section>/i)
      const improved = improvedMatch ? improvedMatch[1] : ''
      const notes = notesMatch ? notesMatch[1].replace(/<[^>]*>/g,'').trim() : ''

      if (improved) {
        const { from, to } = editor.state.selection
        if (from !== to) {
          editor.commands.insertContentAt({ from, to }, improved)
        } else {
          editor.chain().focus().insertContent(improved).run()
        }
      }
      if (notes) {
        insertSuggestion(editor, notes)
      }
    } catch (e){
      alert('Erro ao gerar sugestão IA')
    } finally { setLoading(false) }
  }

  async function generateConclusion(){
    if (!editor) return
    setLoading(true)
    try{
      const findingsHtml = editor.getHTML()
      const examTitle = modalidade || 'Exame'
      const res = await fetch('/functions/v1/ai-generate-conclusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findingsHtml, examTitle, modality: modalidade, user_id: user?.id })
      })
      const json = await res.json()
      if (json?.replacement) insertConclusion(editor, json.replacement)
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display:'inline-flex', gap:8 }}>
      <button className="btn btn-toolbar" onClick={suggest} disabled={loading} title="Ctrl+J">
        {loading? 'IA…' : 'IA Sugerir'}
      </button>
      <button className="btn btn-toolbar" onClick={generateConclusion} disabled={loading} title="Ctrl+Shift+J">Conclusão IA</button>
    </div>
  )
}
