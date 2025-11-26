import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import { useReportStore } from '@/store'
import { insertSuggestion, insertConclusion } from '@/editor/commands'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function EditorAIButton({ editor }: { editor: Editor | null }){
  const { modalidade } = useReportStore()
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  async function suggest(){
    if (!editor) return
    setLoading(true)
    try{
      const fullReport = editor.getHTML()
      const { data, error } = await supabase.functions.invoke('ai-suggestion-review', {
        body: { fullReport, userId: user?.id }
      })
      if (error) throw error
      const html = data as string
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
      console.error('Erro ao gerar sugestão IA:', e)
      toast.error('Erro ao gerar sugestão IA')
    } finally { setLoading(false) }
  }

  async function generateConclusion(){
    if (!editor) return
    setLoading(true)
    try{
      const findingsHtml = editor.getHTML()
      const examTitle = modalidade || 'Exame'
      const { data, error } = await supabase.functions.invoke('ai-generate-conclusion', {
        body: { findingsHtml, examTitle, modality: modalidade, user_id: user?.id }
      })
      if (error) throw error
      if (data?.replacement) insertConclusion(editor, data.replacement)
    } catch (e) {
      console.error('Erro ao gerar conclusão IA:', e)
      toast.error('Erro ao gerar conclusão IA')
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
