import { FileText, History, ChevronLeft } from 'lucide-react'
import { Editor } from '@tiptap/react'
import VoiceButton from '@/components/voice/VoiceButton'
import SpeechStatusPanel from '@/components/voice/SpeechStatusPanel'
import EditorAIButton from '@/components/editor/EditorAIButton'

interface EditorRightSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  editor: Editor | null
  isVoiceActive: boolean
  voiceStatus: 'idle' | 'listening' | 'waiting'
  onVoiceStart: () => void
  onVoiceStop: () => void
  onFrasesClick: () => void
}

export function EditorRightSidebar({
  collapsed,
  onToggleCollapse,
  editor,
  isVoiceActive,
  voiceStatus,
  onVoiceStart,
  onVoiceStop,
  onFrasesClick,
}: EditorRightSidebarProps) {
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
            <button
              onClick={onFrasesClick}
              className="w-full flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <FileText size={18} />
              <span className="text-sm">Frases rápidas</span>
            </button>
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
              />
              <SpeechStatusPanel />
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
