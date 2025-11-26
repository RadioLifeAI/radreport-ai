import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter } from 'lucide-react';

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
            <div className="flex gap-4">
              <a
                href="mailto:contato@radreport.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#precos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#assistente" className="text-muted-foreground hover:text-foreground transition-colors">
                  Assistente IA
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  LGPD
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {currentYear} RadReport. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
