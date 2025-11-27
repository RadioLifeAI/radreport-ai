import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import { useReportStore } from '@/store'
import { insertSuggestion, replaceImpressionSection } from '@/editor/commands'
import { parseReportSections } from '@/editor/sectionUtils'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { Sparkles, FileText, Tag } from 'lucide-react'

export default function EditorAIButton({ editor }: { editor: Editor | null }){
  const { modalidade } = useReportStore()
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [loadingConclusion, setLoadingConclusion] = useState(false)
  const [loadingRADS, setLoadingRADS] = useState(false)
  const { user } = useAuth()

  async function suggest(){
    if (!editor) return
    setLoadingSuggest(true)
    try{
      const fullReport = editor.getHTML()
      const { data, error } = await supabase.functions.invoke('ai-suggestion-review', {
        body: { full_report: fullReport, user_id: user?.id }
      })
      if (error) throw error
      
      const { improved, notes } = data
      
      if (improved) {
        const { from, to } = editor.state.selection
        if (from !== to) {
          editor.commands.insertContentAt({ from, to }, improved)
        } else {
          editor.chain().focus().insertContent(improved).run()
        }
        toast.success('Sugestões aplicadas com sucesso')
      }
      if (notes) {
        insertSuggestion(editor, notes)
      }
    } catch (e){
      console.error('Erro ao gerar sugestão IA:', e)
      toast.error('Erro ao gerar sugestão IA')
    } finally { setLoadingSuggest(false) }
  }

  async function generateConclusion(){
    if (!editor) return
    setLoadingConclusion(true)
    try{
      const fullHtml = editor.getHTML()
      
      // Extrair apenas ACHADOS do laudo
      const sections = parseReportSections(fullHtml)
      const achadosHtml = sections.achados
      
      // Validar que tem achados suficientes
      if (!achadosHtml || achadosHtml.trim().length < 20) {
        toast.error('Descreva os achados antes de gerar conclusão')
        setLoadingConclusion(false)
        return
      }
      
      const examTitle = modalidade || 'Exame'
      const { data, error } = await supabase.functions.invoke('ai-generate-conclusion', {
        body: { findingsHtml: achadosHtml, examTitle, modality: modalidade, user_id: user?.id }
      })
      
      if (error) throw error
      if (data?.replacement) {
        // Substituir seção IMPRESSÃO com a conclusão gerada
        replaceImpressionSection(editor, data.replacement)
        toast.success('Conclusão gerada com sucesso')
      }
    } catch (e) {
      console.error('Erro ao gerar conclusão IA:', e)
      toast.error('Erro ao gerar conclusão IA')
    } finally { setLoadingConclusion(false) }
  }

  async function classifyRADS(){
    if (!editor) return
    setLoadingRADS(true)
    try{
      const fullHtml = editor.getHTML()
      
      // Extrair apenas ACHADOS do laudo
      const sections = parseReportSections(fullHtml)
      const achadosHtml = sections.achados
      
      // Validar que tem achados suficientes
      if (!achadosHtml || achadosHtml.trim().length < 20) {
        toast.error('Descreva os achados antes de classificar RADS')
        setLoadingRADS(false)
        return
      }
      
      const examTitle = modalidade || 'Exame'
      const { data, error } = await supabase.functions.invoke('ai-rads-classification', {
        body: { findingsHtml: achadosHtml, examTitle, modality: modalidade, user_id: user?.id }
      })
      
      if (error) throw error
      if (data?.replacement) {
        // Substituir seção IMPRESSÃO com a classificação RADS
        replaceImpressionSection(editor, data.replacement)
        if (data.rads) {
          toast.success(`${data.rads.system} - Categoria ${data.rads.category}`)
        } else {
          toast.success('Classificação RADS gerada com sucesso')
        }
      }
    } catch (e) {
      console.error('Erro ao classificar RADS:', e)
      toast.error('Erro ao classificar RADS')
    } finally { setLoadingRADS(false) }
  }

  return (
    <div className="space-y-2">
      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={suggest} 
        disabled={loadingSuggest}
        title="IA Sugerir melhorias no texto"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">{loadingSuggest ? 'Processando...' : 'IA Sugerir'}</span>
      </button>
      
      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={generateConclusion} 
        disabled={loadingConclusion}
        title="Gerar conclusão automaticamente"
      >
        <FileText className="w-4 h-4" />
        <span className="text-sm">{loadingConclusion ? 'Gerando...' : 'Conclusão IA'}</span>
      </button>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={classifyRADS} 
        disabled={loadingRADS}
        title="Classificar achados usando sistema RADS"
      >
        <Tag className="w-4 h-4" />
        <span className="text-sm">{loadingRADS ? 'Classificando...' : 'Classificar RADS'}</span>
      </button>
    </div>
  )
}
