import PageLayout from '@/components/layout/PageLayout';
import { Check, X } from 'lucide-react';

export default function Precos() {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'sempre grátis',
      tokens: '20 tokens',
      description: 'Para testar a plataforma',
      features: [
        { text: '20 tokens/mês', included: true },
        { text: 'Editor básico', included: true },
        { text: 'Templates limitados (10)', included: true },
        { text: 'Ditado por voz Web Speech', included: true },
        { text: 'Tabelas de referência', included: true },
        { text: 'IA Conclusão', included: false },
        { text: 'IA RADS', included: false },
        { text: 'Suporte prioritário', included: false }
      ],
      cta: 'Começar Grátis',
      href: '/signup',
      highlighted: false
    },
    {
      name: 'Básico',
      price: 'R$ 79',
      period: '/mês',
      tokens: '1.500 tokens',
      description: 'Ideal para plantonistas',
      features: [
        { text: '1.500 tokens/mês', included: true },
        { text: 'Editor completo', included: true },
        { text: '159 templates completos', included: true },
        { text: 'Ditado por voz avançado', included: true },
        { text: '28+ tabelas de referência', included: true },
        { text: 'IA Conclusão', included: true },
        { text: 'IA RADS', included: true },
        { text: 'Suporte prioritário', included: false }
      ],
      cta: 'Assinar Básico',
      href: '/signup',
      highlighted: false
    },
    {
      name: 'Profissional',
      price: 'R$ 149',
      period: '/mês',
      tokens: '4.000 tokens',
      description: 'Para radiologistas ativos',
      badge: 'MAIS POPULAR',
      features: [
        { text: '4.000 tokens/mês', included: true },
        { text: 'Editor completo', included: true },
        { text: '159 templates completos', included: true },
        { text: 'Ditado por voz avançado', included: true },
        { text: '28+ tabelas de referência', included: true },
        { text: 'IA Conclusão ilimitada', included: true },
        { text: 'IA RADS ilimitada', included: true },
        { text: 'Suporte prioritário', included: true }
      ],
      cta: 'Assinar Profissional',
      href: '/signup',
      highlighted: true
    },
    {
      name: 'Premium',
      price: 'R$ 249',
      period: '/mês',
      tokens: '8.000 tokens',
      description: 'Alto volume ou equipes',
      features: [
        { text: '8.000 tokens/mês', included: true },
        { text: 'Editor completo', included: true },
        { text: '159 templates completos', included: true },
        { text: 'Ditado por voz avançado', included: true },
        { text: '28+ tabelas de referência', included: true },
        { text: 'IA Conclusão ilimitada', included: true },
        { text: 'IA RADS ilimitada', included: true },
        { text: 'Suporte prioritário 24/7', included: true }
      ],
      cta: 'Assinar Premium',
      href: '/signup',
      highlighted: false
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-medical animate-fade-in">
            Planos e Preços
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Escolha o plano ideal para o seu volume de trabalho
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 animate-fade-in ${
                  plan.highlighted ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-bold text-primary-foreground shadow-glow">
                    {plan.badge}
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-primary font-semibold mb-1">{plan.tokens}</p>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/70'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block w-full py-3 rounded-lg text-center font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow hover:brightness-110'
                      : 'border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Explanation */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto glass-card rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            Como funcionam os Tokens?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">2</span>
                <div>
                  <p className="font-semibold text-foreground">IA Conclusão</p>
                  <p className="text-sm text-muted-foreground">tokens por uso</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">2</span>
                <div>
                  <p className="font-semibold text-foreground">IA RADS</p>
                  <p className="text-sm text-muted-foreground">tokens por classificação</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">1</span>
                <div>
                  <p className="font-semibold text-foreground">IA Sugestões</p>
                  <p className="text-sm text-muted-foreground">token por revisão</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">1</span>
                <div>
                  <p className="font-semibold text-foreground">Chat IA</p>
                  <p className="text-sm text-muted-foreground">token por mensagem</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-secondary font-bold">✓</span>
                <div>
                  <p className="font-semibold text-foreground">Corretor AI</p>
                  <p className="text-sm text-muted-foreground">incluído (sem custo)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <details className="glass-card rounded-lg p-6 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
                Posso cancelar a qualquer momento?
                <span className="text-primary">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Sim! Todos os planos são mensais e podem ser cancelados a qualquer momento sem multa ou burocracia.
              </p>
            </details>
            <details className="glass-card rounded-lg p-6 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
                O que acontece se eu exceder meus tokens?
                <span className="text-primary">+</span>
              </summary>
              <p className="mt-4 text-muted-foreground">
                Você pode fazer upgrade do plano a qualquer momento ou adquirir pacotes adicionais de tokens. O sistema continuará funcionando, mas funcionalidades de IA ficarão temporariamente desabilitadas.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Comece com 20 Tokens Grátis
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Teste todas as funcionalidades sem compromisso
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:brightness-110 transition-all shadow-glow"
          >
            Criar Conta Gratuita
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
