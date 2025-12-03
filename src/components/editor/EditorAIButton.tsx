import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import { useReportStore } from '@/store'
import { replaceImpressionSection } from '@/editor/commands'
import { parseReportSections } from '@/editor/sectionUtils'
import { useAuth } from '@/hooks/useAuth'
import { useAICredits } from '@/hooks/useAICredits'
import { useSubscription } from '@/hooks/useSubscription'
import { invokeEdgeFunction } from '@/services/edgeFunctionClient'
import { toast } from 'sonner'
import { Sparkles, FileText, Tag, CreditCard } from 'lucide-react'
import { AISuggestionPreviewModal } from './AISuggestionPreviewModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Credit costs per feature
const CREDIT_COSTS = {
  suggestion: 2,
  conclusion: 2,
  rads: 2,
}

interface EditorAIButtonProps {
  editor: Editor | null
  onUpgrade?: () => void
}

export default function EditorAIButton({ editor, onUpgrade }: EditorAIButtonProps) {
  const { modalidade } = useReportStore()
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [loadingConclusion, setLoadingConclusion] = useState(false)
  const [loadingRADS, setLoadingRADS] = useState(false)
  const { user } = useAuth()
  const { balance, hasEnoughCredits, refreshBalance } = useAICredits()
  const { features } = useSubscription()
  
  // Estados do modal de prévia
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [pendingAISuggestion, setPendingAISuggestion] = useState<{
    type: 'suggestion' | 'conclusion' | 'rads'
    title: string
    content: string
    notes?: string | string[]
    radsInfo?: { system: string; category: string; recommendation?: string }
    applyButtonText: string
  } | null>(null)

  // Feature & credit checks
  const canUseSuggestions = features?.feature_ai_suggestions !== false
  const canUseConclusion = features?.feature_ai_conclusion !== false
  const canUseRADS = features?.feature_ai_rads === true
  
  const hasCreditsSuggestion = hasEnoughCredits(CREDIT_COSTS.suggestion)
  const hasCreditsConclusion = hasEnoughCredits(CREDIT_COSTS.conclusion)
  const hasCreditsRADS = hasEnoughCredits(CREDIT_COSTS.rads)

  async function suggest() {
    if (!editor || !canUseSuggestions || !hasCreditsSuggestion) return
    setLoadingSuggest(true)
    try {
      const fullReport = editor.getHTML()
      const data = await invokeEdgeFunction<{ improved: string; notes: string; credits_remaining?: number }>(
        'ai-suggestion-review',
        { full_report: fullReport, user_id: user?.id }
      )
      
      if (data.credits_remaining !== undefined) refreshBalance()
      
      const { improved, notes } = data
      
      if (!improved && !notes) {
        toast.warning('IA não retornou sugestões')
        return
      }
      
      if (improved || notes) {
        setPendingAISuggestion({
          type: 'suggestion',
          title: 'Revisor IA',
          content: improved || '',
          notes: notes,
          applyButtonText: 'Aplicar Correções'
        })
        setPreviewModalOpen(true)
      }
    } catch (e: any) {
      if (e?.message?.includes('INSUFFICIENT_CREDITS') || e?.status === 402) {
        toast.error('Créditos AI insuficientes', { description: 'Faça upgrade do seu plano para continuar.' })
        refreshBalance()
      } else {
        toast.error('Erro ao gerar sugestão IA')
      }
    } finally { setLoadingSuggest(false) }
  }

  async function generateConclusion() {
    if (!editor || !canUseConclusion || !hasCreditsConclusion) return
    setLoadingConclusion(true)
    try {
      const fullHtml = editor.getHTML()
      const sections = parseReportSections(fullHtml)
      const achadosHtml = sections.achados
      
      if (!achadosHtml || achadosHtml.trim().length < 20) {
        toast.error('Descreva os achados antes de gerar conclusão')
        setLoadingConclusion(false)
        return
      }
      
      const examTitle = modalidade || 'Exame'
      const data = await invokeEdgeFunction<{ replacement: string; notes?: string | string[]; credits_remaining?: number }>(
        'ai-generate-conclusion',
        { findingsHtml: achadosHtml, examTitle, modality: modalidade, user_id: user?.id }
      )
      
      if (data.credits_remaining !== undefined) refreshBalance()
      
      if (data?.replacement) {
        setPendingAISuggestion({
          type: 'conclusion',
          title: 'Conclusão IA',
          content: data.replacement,
          notes: data.notes,
          applyButtonText: 'Inserir Conclusão'
        })
        setPreviewModalOpen(true)
      }
    } catch (e: any) {
      if (e?.message?.includes('INSUFFICIENT_CREDITS') || e?.status === 402) {
        toast.error('Créditos AI insuficientes', { description: 'Faça upgrade do seu plano para continuar.' })
        refreshBalance()
      } else {
        toast.error('Erro ao gerar conclusão IA')
      }
    } finally { setLoadingConclusion(false) }
  }

  async function classifyRADS() {
    if (!editor || !canUseRADS || !hasCreditsRADS) return
    setLoadingRADS(true)
    try {
      const fullHtml = editor.getHTML()
      const sections = parseReportSections(fullHtml)
      const achadosHtml = sections.achados
      
      if (!achadosHtml || achadosHtml.trim().length < 20) {
        toast.error('Descreva os achados antes de classificar RADS')
        setLoadingRADS(false)
        return
      }
      
      const examTitle = modalidade || 'Exame'
      const data = await invokeEdgeFunction<{ replacement: string; notes?: string | string[]; rads?: { system: string; category: string; recommendation?: string }; credits_remaining?: number }>(
        'ai-rads-classification',
        { findingsHtml: achadosHtml, examTitle, modality: modalidade, user_id: user?.id }
      )
      
      if (data.credits_remaining !== undefined) refreshBalance()
      
      if (data?.replacement) {
        setPendingAISuggestion({
          type: 'rads',
          title: 'Classificação RADS',
          content: data.replacement,
          notes: data.notes,
          radsInfo: data.rads,
          applyButtonText: 'Aplicar Classificação'
        })
        setPreviewModalOpen(true)
      }
    } catch (e: any) {
      if (e?.message?.includes('INSUFFICIENT_CREDITS') || e?.status === 402) {
        toast.error('Créditos AI insuficientes', { description: 'Faça upgrade do seu plano para continuar.' })
        refreshBalance()
      } else {
        toast.error('Erro ao classificar RADS')
      }
    } finally { setLoadingRADS(false) }
  }
  
  const handleApplyAISuggestion = () => {
    if (!pendingAISuggestion || !editor) return
    
    switch (pendingAISuggestion.type) {
      case 'suggestion':
        editor.commands.setContent(pendingAISuggestion.content, {
          emitUpdate: true,
          parseOptions: { preserveWhitespace: false }
        })
        toast.success('Correções aplicadas com sucesso')
        break
        
      case 'conclusion':
        replaceImpressionSection(editor, pendingAISuggestion.content)
        toast.success('Conclusão inserida com sucesso')
        break
        
      case 'rads':
        replaceImpressionSection(editor, pendingAISuggestion.content)
        if (pendingAISuggestion.radsInfo) {
          toast.success(`${pendingAISuggestion.radsInfo.system} - ${pendingAISuggestion.radsInfo.category}`)
        } else {
          toast.success('Classificação RADS aplicada com sucesso')
        }
        break
    }
    
    setPreviewModalOpen(false)
    setPendingAISuggestion(null)
  }

  // Determine badge color
  const badgeVariant = balance > 10 ? 'default' : balance > 5 ? 'secondary' : 'destructive'

  return (
    <div className="space-y-2">
      {/* Credits Badge */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs text-muted-foreground">Créditos AI</span>
        <Badge variant={badgeVariant} className="text-xs">
          {balance}
        </Badge>
      </div>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={suggest} 
        disabled={loadingSuggest || !canUseSuggestions || !hasCreditsSuggestion}
        title={!canUseSuggestions ? 'Feature não disponível no seu plano' : !hasCreditsSuggestion ? 'Créditos insuficientes' : 'IA Sugerir melhorias no texto'}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm">{loadingSuggest ? 'Processando...' : 'IA Sugerir'}</span>
        <span className="text-xs text-muted-foreground">({CREDIT_COSTS.suggestion})</span>
      </button>
      
      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={generateConclusion} 
        disabled={loadingConclusion || !canUseConclusion || !hasCreditsConclusion}
        title={!canUseConclusion ? 'Feature não disponível no seu plano' : !hasCreditsConclusion ? 'Créditos insuficientes' : 'Gerar conclusão automaticamente'}
      >
        <FileText className="w-4 h-4" />
        <span className="text-sm">{loadingConclusion ? 'Gerando...' : 'Conclusão IA'}</span>
        <span className="text-xs text-muted-foreground">({CREDIT_COSTS.conclusion})</span>
      </button>

      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={classifyRADS} 
        disabled={loadingRADS || !canUseRADS || !hasCreditsRADS}
        title={!canUseRADS ? 'Feature disponível apenas no plano Profissional ou superior' : !hasCreditsRADS ? 'Créditos insuficientes' : 'Classificar achados usando sistema RADS'}
      >
        <Tag className="w-4 h-4" />
        <span className="text-sm">{loadingRADS ? 'Classificando...' : 'Classificar RADS'}</span>
        <span className="text-xs text-muted-foreground">({CREDIT_COSTS.rads})</span>
      </button>

      {/* Upgrade Button when no credits */}
      {balance === 0 && onUpgrade && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
          onClick={onUpgrade}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Obter mais créditos
        </Button>
      )}
      
      {/* Modal de prévia reutilizável */}
      {pendingAISuggestion && (
        <AISuggestionPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false)
            setPendingAISuggestion(null)
          }}
          onApply={handleApplyAISuggestion}
          type={pendingAISuggestion.type}
          title={pendingAISuggestion.title}
          previewContent={pendingAISuggestion.content}
          notes={pendingAISuggestion.notes}
          radsInfo={pendingAISuggestion.radsInfo}
          applyButtonText={pendingAISuggestion.applyButtonText}
        />
      )}
    </div>
  )
}