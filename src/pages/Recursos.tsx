import PageLayout from '@/components/layout/PageLayout';
import { Sparkles, FileText, Mic, Table2, Brain, Zap } from 'lucide-react';

export default function Recursos() {
  const features = [
    {
      icon: Brain,
      title: 'Editor Inteligente com IA',
      description: 'Editor médico profissional com correções automáticas, sugestões inteligentes e formatação especializada para radiologia.',
      details: [
        'Correção ortográfica médica especializada',
        'Sugestões automáticas de melhoria',
        'Formatação profissional instantânea',
        'Integração com nomenclatura RADS'
      ]
    },
    {
      icon: FileText,
      title: '159 Templates Profissionais',
      description: 'Biblioteca completa de templates de laudos para todas as modalidades radiológicas.',
      details: [
        'Ultrassonografia (USG)',
        'Tomografia Computadorizada (TC)',
        'Ressonância Magnética (RM)',
        'Radiografia (RX)',
        'Mamografia (MG)'
      ]
    },
    {
      icon: Mic,
      title: 'Ditado por Voz Avançado',
      description: 'Sistema híbrido Web Speech + Whisper AI para transcrição médica de alta precisão.',
      details: [
        'Transcrição em tempo real',
        'Comandos de voz estruturais',
        'Correção automática de termos médicos',
        'Suporte a português brasileiro'
      ]
    },
    {
      icon: Table2,
      title: '28+ Tabelas de Referência',
      description: 'Acesso rápido a tabelas de classificação e medidas de referência internacional.',
      details: [
        'BI-RADS, TI-RADS, PI-RADS',
        'Lung-RADS, LI-RADS, O-RADS',
        'Tabelas pediátricas (Hadlock, Graf)',
        'Escores e classificações (Agatston, Bosniak)'
      ]
    },
    {
      icon: Sparkles,
      title: 'IA Conclusão Automática',
      description: 'Geração inteligente de conclusões e impressões diagnósticas baseadas nos achados.',
      details: [
        'Análise semântica dos achados',
        'Sugestões diagnósticas contextuais',
        'Classificação RADS automática',
        'Formatação profissional'
      ]
    },
    {
      icon: Zap,
      title: '245 Frases Modelo',
      description: 'Banco de frases modelo com variáveis dinâmicas para agilizar a elaboração de laudos.',
      details: [
        'Frases personalizáveis com variáveis',
        'Organização por modalidade e região',
        'Sistema de favoritos',
        'Histórico de uso'
      ]
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-medical">
              Funcionalidades Profissionais
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ferramentas completas para acelerar sua produtividade radiológica com tecnologia de ponta
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-glow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-primary mt-1">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Pronto para Revolucionar seus Laudos?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comece gratuitamente e experimente todas as funcionalidades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:brightness-110 transition-all shadow-glow"
            >
              Começar Gratuitamente
            </a>
            <a
              href="/precos"
              className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all"
            >
              Ver Planos
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
