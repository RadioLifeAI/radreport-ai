import { MessageSquare, History, ChevronLeft, Sparkles, Zap } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { useState } from 'react'
import VoiceButton from '@/components/voice/VoiceButton'
import SpeechStatusPanel from '@/components/voice/SpeechStatusPanel'
import EditorAIButton from '@/components/editor/EditorAIButton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFrasesModelo, FraseModelo } from '@/hooks/useFrasesModelo'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useVariableProcessor } from '@/hooks/useVariableProcessor'
import { useWhisperCredits } from '@/hooks/useWhisperCredits'

interface EditorRightSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  editor: Editor | null
  isVoiceActive: boolean
  voiceStatus: 'idle' | 'listening' | 'waiting'
  onVoiceStart: () => void
  onVoiceStop: () => void
  mediaStream?: MediaStream | null
  onOpenVariablesModal?: (frase: FraseModelo) => void
  isWhisperEnabled?: boolean
  toggleWhisper?: () => void
  isTranscribing?: boolean
  whisperStats?: {
    total: number
    success: number
    failed: number
  }
}

export function EditorRightSidebar({
  collapsed,
  onToggleCollapse,
  editor,
  isVoiceActive,
  voiceStatus,
  onVoiceStart,
  onVoiceStop,
  mediaStream,
  onOpenVariablesModal,
  isWhisperEnabled = false,
  toggleWhisper,
  isTranscribing = false,
  whisperStats,
}: EditorRightSidebarProps) {
  const [frasesOpen, setFrasesOpen] = useState(false)
  const { recentFrases, favoriteFrases } = useFrasesModelo()
  const { hasVariables } = useVariableProcessor()
  const { balance, isLoading: isLoadingCredits, hasEnoughCredits } = useWhisperCredits()

  const openPurchaseModal = () => {
    toast.info('🚀 Em breve! Pacotes de créditos Whisper disponíveis em dezembro.', { duration: 4000 })
  }

  const handleFraseClick = (frase: FraseModelo) => {
    // Check if frase has variables
    const needsVariables = frase.variaveis && 
                          frase.variaveis.length > 0 && 
                          (hasVariables(frase.frase) || (frase.conclusao && hasVariables(frase.conclusao)))
    
    if (needsVariables && onOpenVariablesModal) {
      onOpenVariablesModal(frase)
      setFrasesOpen(false)
    } else {
      // Insert directly
      if (editor) {
        editor.chain().focus().insertContent(frase.frase + ' ').run()
        setFrasesOpen(false)
      }
    }
  }

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="absolute right-0 top-20 z-40 bg-card border border-border/40 rounded-l-lg p-1 hover:bg-muted transition-colors"
        title="Expandir painel de controles"
      >
        <ChevronLeft size={16} />
      </button>
    )
  }

  return (
    <>
      <button
        onClick={onToggleCollapse}
        className="absolute right-64 top-20 z-40 bg-card border border-border/40 rounded-l-lg p-1 hover:bg-muted transition-colors"
        title="Colapsar painel de controles"
      >
        <ChevronLeft size={16} className="rotate-180" />
      </button>

      <aside className="w-64 border-l border-border/40 bg-card/50 backdrop-blur-sm overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Frases Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Ações Rápidas</h3>
            <Popover open={frasesOpen} onOpenChange={setFrasesOpen}>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors">
                  <MessageSquare size={18} />
                  <span className="text-sm">Frases rápidas</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" side="left">
                <ScrollArea className="h-[400px]">
                  <div className="p-3 space-y-3">
                    {favoriteFrases.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2">FAVORITAS</div>
                        <div className="space-y-1">
                          {favoriteFrases.slice(0, 5).map((frase) => (
                            <button
                              key={frase.id}
                              onClick={() => handleFraseClick(frase)}
                              className="w-full px-2 py-2 text-xs hover:bg-muted rounded transition-colors text-left space-y-1"
                            >
                              <div className="font-medium">{frase.codigo}</div>
                              <div className="text-muted-foreground line-clamp-2">{frase.frase}</div>
                              {frase.categoria && (
                                <Badge variant="secondary" className="text-[10px] mt-1">
                                  {frase.categoria}
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recentFrases.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2">RECENTES</div>
                        <div className="space-y-1">
                          {recentFrases.slice(0, 8).map((frase) => (
                            <button
                              key={frase.id}
                              onClick={() => handleFraseClick(frase)}
                              className="w-full px-2 py-2 text-xs hover:bg-muted rounded transition-colors text-left space-y-1"
                            >
                              <div className="font-medium">{frase.codigo}</div>
                              <div className="text-muted-foreground line-clamp-2">{frase.frase}</div>
                              {frase.categoria && (
                                <Badge variant="secondary" className="text-[10px] mt-1">
                                  {frase.categoria}
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {favoriteFrases.length === 0 && recentFrases.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-4">
                        Nenhuma frase disponível
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Whisper AI Premium Section */}
          <div className="p-3 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 border border-cyan-500/20 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-500" />
              <span className="text-sm font-medium">Whisper AI</span>
            </div>
            
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Refinamento inteligente de termos médicos radiológicos com precisão profissional
            </p>
            
            {/* Saldo atual */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Saldo:</span>
              {isLoadingCredits ? (
                <span className="text-xs text-muted-foreground">...</span>
              ) : (
                <Badge 
                  variant={balance > 10 ? 'default' : balance > 5 ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {balance} créditos
                </Badge>
              )}
            </div>
            
            {/* Botão de upgrade */}
            {balance < 10 && (
              <Button 
                variant="default"
                size="sm"
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-xs"
                onClick={openPurchaseModal}
              >
                <Zap size={14} className="mr-1" />
                {balance === 0 ? 'Obter créditos' : 'Recarregar créditos'}
              </Button>
            )}

            {/* Whisper Toggle com Tooltip */}
            {toggleWhisper && (
              <TooltipProvider>
                <div className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/50">
                  <div className="flex flex-col">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs cursor-help">Ativar Whisper</span>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[200px]">
                        <p className="text-xs">
                          Melhora precisão de termos médicos como hepatomegalia, BI-RADS, esplenomegalia
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    {!hasEnoughCredits && (
                      <span className="text-[10px] text-orange-400">Sem créditos - compre para ativar</span>
                    )}
                  </div>
                  <Switch
                    checked={isWhisperEnabled}
                    onCheckedChange={toggleWhisper}
                    disabled={!hasEnoughCredits}
                  />
                </div>
              </TooltipProvider>
            )}

            {/* Whisper Stats */}
            {isWhisperEnabled && whisperStats && whisperStats.total > 0 && (
              <div className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/30">
                Processados: {whisperStats.success}/{whisperStats.total}
                {whisperStats.failed > 0 && ` (${whisperStats.failed} falhas)`}
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Controle de Voz</h3>

            <VoiceButton
              isActive={isVoiceActive}
              status={voiceStatus}
              onStart={onVoiceStart}
              onStop={onVoiceStop}
              isTranscribing={isTranscribing}
            />

            <SpeechStatusPanel 
              mediaStream={mediaStream}
            />
          </div>

          {/* AI Assistant Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Assistente IA</h3>
            <div className="space-y-2">
              <EditorAIButton editor={editor} />
            </div>
          </div>

          {/* History Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Histórico</h3>
            <button
              className="w-full flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <History size={18} />
              <span className="text-sm">Ver histórico</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
