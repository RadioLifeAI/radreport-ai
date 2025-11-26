import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText, 
  Save, 
  Send, 
  Mic, 
  Sparkles,
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfessionalEditorPageProps {
  onGenerateConclusion: (conclusion: string) => void;
}

export function ProfessionalEditorPage({ onGenerateConclusion }: ProfessionalEditorPageProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [content, setContent] = useState('');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-16 border-b border-border/40 bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-indigo-500/60 shadow-glow" />
            <span className="font-bold text-xl">RadReport</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={logout}
            className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-border/40 bg-card p-4 overflow-y-auto">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <FileText size={20} />
                <span className="font-medium">Novo Laudo</span>
              </button>

              <div className="pt-4 space-y-1">
                <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase">
                  Laudos Recentes
                </h3>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    className="w-full flex items-start gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <FileText size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Laudo #{i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hoje às {10 + i}:00
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="h-14 border-b border-border/40 bg-card flex items-center gap-2 px-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <Save size={18} />
              <span className="hidden sm:inline">Salvar</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <Mic size={18} />
              <span className="hidden sm:inline">Voz</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
              <Sparkles size={18} />
              <span className="hidden sm:inline">IA</span>
            </button>
            <div className="flex-1" />
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg btn-premium text-sm font-medium">
              <Send size={18} />
              <span>Finalizar</span>
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="glass-card rounded-2xl p-8 min-h-[600px]">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Título do Laudo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Tomografia de Crânio"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Dados do Paciente
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nome do paciente"
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Idade"
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Conteúdo do Laudo
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Digite ou use o reconhecimento de voz para ditar o laudo..."
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[400px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
