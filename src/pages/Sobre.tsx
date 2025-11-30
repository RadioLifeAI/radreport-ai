import PageLayout from '@/components/layout/PageLayout';
import { Target, Eye, Users, Zap } from 'lucide-react';

export default function Sobre() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-medical animate-fade-in">
            Sobre o RadReport
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Revolucionando a elaboração de laudos radiológicos com tecnologia e inteligência artificial
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl p-8 animate-fade-in">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-glow">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Nossa Missão</h2>
              <p className="text-muted-foreground leading-relaxed">
                Transformar a rotina dos radiologistas, oferecendo ferramentas inteligentes que aumentam a produtividade, 
                reduzem erros e permitem foco total no diagnóstico preciso. Queremos que cada radiologista tenha mais tempo 
                para o que realmente importa: a análise clínica de qualidade.
              </p>
            </div>
            <div className="glass-card rounded-xl p-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-glow">
                <Eye className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Nossa Visão</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ser a plataforma número 1 de laudos radiológicos no Brasil, reconhecida pela excelência tecnológica, 
                suporte impecável e impacto positivo na saúde através de diagnósticos mais rápidos e precisos. 
                Acreditamos em tecnologia a favor da medicina de qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Inovação</h3>
              <p className="text-muted-foreground">
                Buscamos constantemente as melhores tecnologias para oferecer soluções de ponta
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Foco no Usuário</h3>
              <p className="text-muted-foreground">
                Cada funcionalidade é pensada para resolver problemas reais dos radiologistas
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Excelência</h3>
              <p className="text-muted-foreground">
                Comprometimento com qualidade, precisão e confiabilidade em tudo que fazemos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Tecnologia de Ponta</h2>
          <div className="glass-card rounded-xl p-8">
            <p className="text-muted-foreground leading-relaxed mb-6">
              O RadReport utiliza as mais modernas tecnologias de inteligência artificial e processamento de linguagem natural:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-foreground"><strong>OpenAI GPT-5 Nano:</strong> Para sugestões inteligentes, correções e geração de conclusões</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-foreground"><strong>Whisper Large V3 Turbo:</strong> Transcrição de voz médica de alta precisão via Groq</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-foreground"><strong>Web Speech API:</strong> Ditado em tempo real integrado ao navegador</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-foreground"><strong>React + TypeScript:</strong> Interface moderna, responsiva e type-safe</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-foreground"><strong>Supabase:</strong> Backend robusto com autenticação segura e banco de dados PostgreSQL</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span className="text-foreground"><strong>TipTap Editor:</strong> Editor WYSIWYG profissional com formatação médica especializada</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">RadReport em Números</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center glass-card rounded-xl p-6">
              <p className="text-4xl font-bold text-primary mb-2">159</p>
              <p className="text-muted-foreground">Templates Profissionais</p>
            </div>
            <div className="text-center glass-card rounded-xl p-6">
              <p className="text-4xl font-bold text-primary mb-2">245</p>
              <p className="text-muted-foreground">Frases Modelo</p>
            </div>
            <div className="text-center glass-card rounded-xl p-6">
              <p className="text-4xl font-bold text-primary mb-2">28+</p>
              <p className="text-muted-foreground">Tabelas RADS</p>
            </div>
            <div className="text-center glass-card rounded-xl p-6">
              <p className="text-4xl font-bold text-primary mb-2">5</p>
              <p className="text-muted-foreground">Modalidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Faça Parte da Revolução
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se aos radiologistas que já aumentaram sua produtividade
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:brightness-110 transition-all shadow-glow"
          >
            Começar Gratuitamente
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
