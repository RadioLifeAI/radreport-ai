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

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl">Básico</CardTitle>
                <CardDescription>Para radiologistas iniciantes</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Até 100 laudos/mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Templates básicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Suporte por email</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">Começar</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan - Highlighted */}
            <Card className="glass-card border-primary/50 shadow-glow scale-105">
              <CardHeader>
                <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 text-background text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2">
                  MAIS POPULAR
                </div>
                <CardTitle className="text-2xl">Profissional</CardTitle>
                <CardDescription>Para radiologistas ativos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 299</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Laudos ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Todos os templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>IA avançada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Suporte prioritário</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full btn-premium">
                  <Link to="/signup">Começar agora</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Institutional Plan */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl">Institucional</CardTitle>
                <CardDescription>Para clínicas e hospitais</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Usuários ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Integração PACS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Treinamento dedicado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-cyan-400" />
                  <span>Suporte 24/7</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:contato@radreport.com">Fale conosco</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
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
                Como funciona a IA do RadReport?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Nossa IA foi treinada com milhões de laudos radiológicos e oferece sugestões em tempo real,
                correção ortográfica contextual e padronização automática seguindo guidelines internacionais.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Os dados dos pacientes são seguros?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Utilizamos criptografia de ponta a ponta, servidores em conformidade com LGPD e 
                certificações ISO 27001. Seus dados nunca são compartilhados com terceiros.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Posso personalizar os templates?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutamente! Você pode criar, editar e salvar seus próprios templates personalizados,
                além de usar nossa biblioteca com centenas de templates pré-configurados.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Há período de teste gratuito?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Oferecemos 14 dias de teste gratuito do plano Profissional, sem necessidade de
                cartão de crédito. Teste todas as funcionalidades antes de decidir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                O sistema funciona offline?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim, nossa versão desktop oferece modo offline completo. Seus laudos são sincronizados
                automaticamente quando a conexão for restabelecida.
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