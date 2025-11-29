import { FileText, History, ChevronLeft, MessageSquare, Sparkles, CheckCircle2, XCircle } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { useState } from 'react'
import VoiceButton from '@/components/voice/VoiceButton'
import SpeechStatusPanel from '@/components/voice/SpeechStatusPanel'
import EditorAIButton from '@/components/editor/EditorAIButton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFrasesModelo, FraseModelo } from '@/hooks/useFrasesModelo'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useVariableProcessor } from '@/hooks/useVariableProcessor'

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

          {/* Voice Controls Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Controles de Voz</h3>
            <div className="space-y-2">
              <VoiceButton 
                isActive={isVoiceActive}
                status={voiceStatus}
                onStart={onVoiceStart}
                onStop={onVoiceStop}
                isTranscribing={isTranscribing}
              />
              <SpeechStatusPanel mediaStream={mediaStream} />
              
              {/* Whisper Toggle */}
              {toggleWhisper && (
                <button
                  onClick={toggleWhisper}
                  className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg transition-all ${
                    isWhisperEnabled
                      ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-cyan-500/30 hover:border-cyan-500/50'
                      : 'bg-card border-border/40 hover:bg-muted/50'
                  }`}
                  title={isWhisperEnabled ? 'Whisper ativado' : 'Whisper desativado'}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className={isWhisperEnabled ? 'text-cyan-500' : 'text-muted-foreground'} />
                    <span className="text-xs font-medium">Whisper</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isTranscribing && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-500 rounded animate-pulse">
                        Transcrevendo...
                      </span>
                    )}
                    {isWhisperEnabled ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <XCircle size={14} className="text-muted-foreground" />
                    )}
                  </div>
                </button>
              )}
              
              {/* Whisper Stats (optional) */}
              {whisperStats && whisperStats.total > 0 && (
                <div className="text-[10px] text-muted-foreground space-y-0.5 px-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{whisperStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sucesso:</span>
                    <span className="font-medium text-green-500">{whisperStats.success}</span>
                  </div>
                  {whisperStats.failed > 0 && (
                    <div className="flex justify-between">
                      <span>Falhas:</span>
                      <span className="font-medium text-red-500">{whisperStats.failed}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
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
