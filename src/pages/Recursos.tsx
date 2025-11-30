import PageLayout from '@/components/layout/PageLayout';
import { Sparkles, FileText, Mic, Table2, Brain, Zap } from 'lucide-react';

export default function Recursos() {
  const features = [
    {
      icon: Brain,
      title: 'Editor Inteligente com IA',
      description: 'Editor médico profissional com dicionário de 4.300+ termos, correções automáticas e sugestões inteligentes.',
      details: [
        'Dicionário médico especializado (4.300+ termos)',
        'Correção ortográfica radiológica em tempo real',
        'Sugestões automáticas de melhoria',
        'Formatação profissional instantânea'
      ]
    },
    {
      icon: FileText,
      title: '149 Templates Profissionais',
      description: 'Biblioteca completa de templates com variáveis dinâmicas para todas as modalidades radiológicas.',
      details: [
        'Ultrassonografia (USG) - 8 templates',
        'Tomografia Computadorizada (TC) - 43 templates',
        'Ressonância Magnética (RM) - 44 templates',
        'Radiografia (RX) - 51 templates',
        'Mamografia (MG) - 3 templates'
      ]
    },
    {
      icon: Mic,
      title: 'Ditado por Voz Premium',
      description: 'Sistema híbrido Web Speech + Whisper AI com comandos de voz estruturais e correção automática.',
      details: [
        'Transcrição em tempo real (Web Speech)',
        'Refinamento Whisper AI opcional',
        'Comandos estruturais (nova linha, parágrafo)',
        'Correção automática de termos médicos'
      ]
    },
    {
      icon: Table2,
      title: '100+ Tabelas de Referência',
      description: 'Acesso rápido a classificações RADS e referências internacionais completas com bibliografia.',
      details: [
        'RADS: BI-RADS, TI-RADS, PI-RADS, LI-RADS',
        'Neuroimagem: ASPECTS, Fisher, Fazekas',
        'Tórax: Lung-RADS, Fleischner, TNM',
        'Obstetrícia: Hadlock, ILA, Doppler'
      ]
    },
    {
      icon: Sparkles,
      title: '25 Calculadoras Médicas',
      description: 'Calculadoras especializadas com inserção automática no laudo e interpretação em tempo real.',
      details: [
        'Obstetrícia: IG, DPP, Peso Fetal, ILA',
        'Volumes: Elipsoide, Hepático, Esplênico',
        'Cardio: Agatston, Índice Cardiotorácico',
        'Neuro: Hematoma ABC/2, Índice Evans'
      ]
    },
    {
      icon: Zap,
      title: '400 Frases Modelo',
      description: 'Banco de frases com variáveis dinâmicas, sistema de favoritos e histórico de uso.',
      details: [
        'Frases personalizáveis com variáveis',
        'Organização por modalidade e região',
        'Sistema de favoritos e recentes',
        'Formulários dinâmicos para preenchimento'
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
