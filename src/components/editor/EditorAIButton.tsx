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

  async function classifyRADS(){
    if (!editor) return
    setLoading(true)
    try{
      const findingsHtml = editor.getHTML()
      const examTitle = modalidade || 'Exame'
      const { data, error } = await supabase.functions.invoke('ai-rads-classification', {
        body: { findingsHtml, examTitle, modality: modalidade, user_id: user?.id }
      })
      if (error) throw error
      if (data?.replacement) {
        // Inserir classificação RADS na conclusão
        insertConclusion(editor, data.replacement)
        toast.success('Classificação RADS gerada com sucesso')
      }
    } catch (e) {
      console.error('Erro ao classificar RADS:', e)
      toast.error('Erro ao classificar RADS')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-2">
      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors" 
        onClick={suggest} 
        disabled={loading}
        title="IA Sugerir melhorias no texto"
      >
        <span className="text-sm">{loading ? 'Processando...' : 'IA Sugerir'}</span>
      </button>
      
      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors" 
        onClick={generateConclusion} 
        disabled={loading}
        title="Gerar conclusão automaticamente"
      >
        <span className="text-sm">Conclusão IA</span>
      </button>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors" 
        onClick={classifyRADS} 
        disabled={loading}
        title="Classificar achados usando sistema RADS"
      >
        <span className="text-sm">Classificar RADS</span>
      </button>
    </div>
  )
}
