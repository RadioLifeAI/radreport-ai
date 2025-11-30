import { Link } from 'react-router-dom';
import { Brain, FileText, Shield, Zap, Check, MessageSquare, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/hero/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection
        variant="gradient"
        title={
          <>
            Laudos Radiológicos{' '}
            <span className="gradient-text-medical">Inteligentes</span>
          </>
        }
        subtitle="Sistema profissional de laudos com IA. Aumente sua produtividade, reduza erros e padronize seus relatórios com tecnologia de ponta."
        actions={
          <>
            <Button asChild size="lg" className="btn-premium">
              <Link to="/signup">
                Começar gratuitamente
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="#servicos">Saiba mais</Link>
            </Button>
          </>
        }
      />

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos <span className="gradient-text-medical">Avançados</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tecnologia de ponta para radiologistas modernos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* IA Assistente */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Brain className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle>IA Assistente</CardTitle>
                <CardDescription>
                  Sugestões inteligentes em tempo real com correção automática
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Templates Inteligentes */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle>Templates</CardTitle>
                <CardDescription>
                  Biblioteca completa de templates para todas as modalidades
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Segurança */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Criptografia de ponta e conformidade com LGPD
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Velocidade */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Zap className="h-6 w-6 text-pink-400" />
                </div>
                <CardTitle>Velocidade</CardTitle>
                <CardDescription>
                  Interface otimizada para máxima produtividade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos <span className="gradient-text-medical">Flexíveis</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano ideal para seu volume de trabalho
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Gratuito Plan */}
            <Card className="glass-card">
              <CardHeader>
                <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2">
                  GRÁTIS
                </div>
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <CardDescription>Teste a plataforma</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground block text-sm mt-1">20 tokens</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">20 tokens (≈ 10 laudos)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">159 templates de laudo</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">245 frases modelo</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Ditado por voz (Web Speech)</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground/60">
                  <span className="text-xs ml-6">❌ Corretor AI</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground/60">
                  <span className="text-xs ml-6">❌ IA Conclusão/Sugestões</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">Começar grátis</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Básico Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl">Básico</CardTitle>
                <CardDescription>Plantonistas, baixo volume</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 79</span>
                  <span className="text-muted-foreground">/mês</span>
                  <span className="text-muted-foreground block text-sm mt-1">1.500 tokens</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1.500 tokens/mês (≈ 750 laudos)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tudo do Gratuito</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Corretor AI completo</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">IA Conclusão (2 tokens/uso)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">IA Sugestões (1 token/uso)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">28+ tabelas RADS completas</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground/60">
                  <span className="text-xs ml-6">❌ IA RADS automático</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground/60">
                  <span className="text-xs ml-6">❌ Chat IA Radiológica</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">Assinar Básico</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Profissional Plan - Highlighted */}
            <Card className="glass-card border-primary/50 shadow-glow scale-105 lg:scale-110">
              <CardHeader>
                <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 text-background text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2">
                  MAIS POPULAR
                </div>
                <CardTitle className="text-2xl">Profissional</CardTitle>
                <CardDescription>50 laudos/dia</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 149</span>
                  <span className="text-muted-foreground">/mês</span>
                  <span className="text-muted-foreground block text-sm mt-1">4.000 tokens</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">4.000 tokens/mês</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tudo do Básico</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">IA RADS automático (2 tokens)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Chat IA Radiológica (1 token/msg)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full btn-premium">
                  <Link to="/signup">Assinar Profissional</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Alto volume</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 249</span>
                  <span className="text-muted-foreground">/mês</span>
                  <span className="text-muted-foreground block text-sm mt-1">8.000 tokens</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">8.000 tokens/mês</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tudo do Profissional</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tokens extras: R$ 0,08/token</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Suporte WhatsApp prioritário</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">Assinar Premium</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How Tokens Work Section */}
      <section className="py-20 bg-card/30">
        <div className="container max-w-5xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como funcionam os <span className="gradient-text-medical">Tokens</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Sistema transparente e flexível de consumo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Consumption Table */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  Consumo por Funcionalidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm">IA Conclusão automática</span>
                  <span className="font-semibold text-cyan-400">2 tokens</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm">IA RADS (BI-RADS, TI-RADS, etc.)</span>
                  <span className="font-semibold text-cyan-400">2 tokens</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm">IA Sugestões de melhoria</span>
                  <span className="font-semibold text-cyan-400">1 token</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-sm">Chat IA Radiológica</span>
                  <span className="font-semibold text-cyan-400">1 token/msg</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm">Corretor AI</span>
                  <span className="font-semibold text-green-400">Incluído</span>
                </div>
                <div className="bg-cyan-400/10 rounded-lg p-3 mt-4">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Laudo típico:</strong> 2 tokens (1 Conclusão + 1 Sugestão)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculation Example */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>Exemplo: Radiologista 50 laudos/dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Volume Mensal</p>
                  <p className="text-2xl font-bold">1.100 laudos</p>
                  <p className="text-xs text-muted-foreground">(50 laudos × 22 dias)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Consumo Estimado</p>
                  <p className="text-2xl font-bold text-cyan-400">3.630 tokens</p>
                  <p className="text-xs text-muted-foreground">(Conclusão + Sugestões + 15% RADS + Chat)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Plano Recomendado</p>
                  <p className="text-2xl font-bold text-gradient-to-r from-cyan-400 to-indigo-500">Profissional</p>
                  <p className="text-xs text-muted-foreground">4.000 tokens = R$ 149/mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-card/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas <span className="gradient-text-medical">Frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas sobre o RadReport
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                O que são tokens e como funcionam?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tokens são unidades de consumo para funcionalidades de IA. Um laudo típico consome 2 tokens 
                (1 para Conclusão + 1 para Sugestões). IA RADS e Chat consomem tokens adicionais. 
                O plano Profissional (4.000 tokens) é ideal para 50 laudos/dia.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Quantos tokens preciso para meu volume de trabalho?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Para calcular: (laudos/dia × 22 dias × 2 tokens) + uso adicional de RADS/Chat. 
                Exemplo: 50 laudos/dia = ~3.600 tokens/mês → Plano Profissional (4.000 tokens). 
                20 laudos/dia = ~1.300 tokens → Plano Básico (1.500 tokens).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Os dados dos pacientes são seguros?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Utilizamos criptografia de ponta a ponta, servidores em conformidade com LGPD e 
                certificações ISO 27001. Seus dados nunca são compartilhados com terceiros.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Posso personalizar os templates?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Temos 159 templates profissionais e 245 frases modelo pré-configuradas. 
                Você pode criar favoritos, personalizar variáveis e salvar suas próprias frases modelo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Há período de teste gratuito?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! O plano Gratuito oferece 20 tokens permanentes para você testar a plataforma. 
                Experimente todas as funcionalidades básicas (templates, frases, ditado por voz) antes de assinar.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section id="assistente" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Assistente <span className="gradient-text-medical">Inteligente</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              IA treinada especificamente para radiologia
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-card overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistente RadReport</CardTitle>
                    <CardDescription className="text-xs">Sempre pronto para ajudar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">
                      Como descrevo um nódulo pulmonar de 8mm no lobo superior direito?
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm text-muted-foreground mb-2">
                      Recomendo a seguinte descrição padronizada:
                    </p>
                    <div className="bg-background/50 rounded-lg p-3 font-mono text-xs space-y-1">
                      <p>"Nódulo pulmonar sólido no segmento</p>
                      <p>apical do lobo superior direito,</p>
                      <p>medindo aproximadamente 8mm, com</p>
                      <p>contornos regulares e margens bem</p>
                      <p>definidas."</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Sugestão: Adicione recomendação de follow-up segundo Fleischner 2017
                    </p>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex justify-start">
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button asChild size="lg" className="btn-premium">
                <Link to="/signup">
                  Experimente o Assistente IA
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;