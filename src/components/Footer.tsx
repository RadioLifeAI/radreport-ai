import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-indigo-500/60 shadow-glow" />
              <span className="font-bold text-xl tracking-tight">RadReport</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Sistema inteligente de laudos radiológicos com IA
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Uma plataforma <strong>RadAi Labs</strong></p>
              <p>RadAi Labs LTDA</p>
              <p>CNPJ: 63.762.346/0001-47</p>
            </div>
            <div className="flex gap-4">
              <a
                href="mailto:contato@radreport.com.br"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/recursos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link to="/precos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/recursos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Editor IA
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ditado por Voz
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/lgpd" className="text-muted-foreground hover:text-foreground transition-colors">
                  LGPD
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {currentYear} RadReport – Uma plataforma RadAi Labs</p>
          <p className="mt-1">RadAi Labs LTDA · CNPJ: 63.762.346/0001-47</p>
        </div>
      </div>
    </footer>
  );
}
