import { Link } from 'react-router-dom';
import { Brain, FileText, Shield, Zap, Check, MessageSquare, ChevronRight, Mic, Copy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/hero/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlatformMetrics } from '@/hooks/usePlatformMetrics';

const Index = () => {
  const { data: platformData, isLoading: metricsLoading } = usePlatformMetrics();

  // Static fallbacks
  const metrics = platformData?.metrics ?? {
    templates_count: 150,
    frases_count: 400,
    tables_count: 100,
    calculators_count: 25,
    dictionary_terms_count: 4300,
    modalities_count: 5,
  };

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* IA Assistente */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Brain className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle>IA Assistente</CardTitle>
                <CardDescription>
                  Sugestões inteligentes, conclusões automáticas e correção em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Templates */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle>{metrics.templates_count}+ Templates</CardTitle>
                <CardDescription>
                  Biblioteca completa para todas as modalidades radiológicas
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Frases Modelo */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle>{metrics.frases_count}+ Frases Modelo</CardTitle>
                <CardDescription>
                  Frases com variáveis dinâmicas para laudos personalizados
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Tabelas */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Zap className="h-6 w-6 text-pink-400" />
                </div>
                <CardTitle>100+ Tabelas RADS</CardTitle>
                <CardDescription>
                  Classificações e referências internacionais completas
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Segurança */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle>Segurança LGPD</CardTitle>
                <CardDescription>
                  Criptografia de ponta e total conformidade com LGPD
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Ditado por Voz */}
            <Card className="glass-card hover-scale group">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <Mic className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle>Ditado Premium</CardTitle>
                <CardDescription>
                  Whisper AI + Web Speech com comandos de voz estruturais
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como <span className="gradient-text-medical">Funciona</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Workflow simplificado para laudos profissionais
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Passo 1 */}
            <div className="glass-card p-6 text-center relative">
              <div className="text-5xl font-bold text-primary/20 absolute top-2 left-4">1</div>
              <FileText className="h-10 w-10 mx-auto mb-4 text-cyan-400" />
              <h3 className="font-semibold mb-2">Escolha o Template</h3>
              <p className="text-sm text-muted-foreground">{metrics.templates_count}+ templates para todas as modalidades</p>
            </div>
            
            {/* Passo 2 */}
            <div className="glass-card p-6 text-center relative">
              <div className="text-5xl font-bold text-primary/20 absolute top-2 left-4">2</div>
              <Mic className="h-10 w-10 mx-auto mb-4 text-indigo-400" />
              <h3 className="font-semibold mb-2">Dite ou Escreva</h3>
              <p className="text-sm text-muted-foreground">Ditado por voz ou digitação com autocorreção</p>
            </div>
            
            {/* Passo 3 */}
            <div className="glass-card p-6 text-center relative">
              <div className="text-5xl font-bold text-primary/20 absolute top-2 left-4">3</div>
              <Brain className="h-10 w-10 mx-auto mb-4 text-purple-400" />
              <h3 className="font-semibold mb-2">IA Refina</h3>
              <p className="text-sm text-muted-foreground">Conclusão automática e sugestões inteligentes</p>
            </div>
            
            {/* Passo 4 */}
            <div className="glass-card p-6 text-center relative">
              <div className="text-5xl font-bold text-primary/20 absolute top-2 left-4">4</div>
              <Copy className="h-10 w-10 mx-auto mb-4 text-pink-400" />
              <h3 className="font-semibold mb-2">Copie e Envie</h3>
              <p className="text-sm text-muted-foreground">Formatação profissional pronta para colar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Números Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Números que <span className="gradient-text-medical">Impressionam</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold gradient-text-medical">{metrics.templates_count}+</p>
              <p className="text-xs text-muted-foreground">Templates</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold gradient-text-medical">{metrics.frases_count}+</p>
              <p className="text-xs text-muted-foreground">Frases Modelo</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold gradient-text-medical">100+</p>
              <p className="text-xs text-muted-foreground">Tabelas RADS</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold gradient-text-medical">25</p>
              <p className="text-xs text-muted-foreground">Calculadoras</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold gradient-text-medical">4.300+</p>
              <p className="text-xs text-muted-foreground">Termos Médicos</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold gradient-text-medical">5</p>
              <p className="text-xs text-muted-foreground">Modalidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section - Lite */}
      <section id="precos" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos para cada <span className="gradient-text-medical">necessidade</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano ideal para seu volume de trabalho
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {metricsLoading ? (
              // Skeleton loading
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-5 rounded-xl">
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-8 w-24 mb-4" />
                  <Skeleton className="h-10 w-32 mb-4" />
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              platformData?.plans?.map((plan) => {
                const price = plan.prices?.[0];
                const primaryFeatures = plan.features
                  ?.filter(f => f.is_primary && f.show_in_card)
                  .slice(0, 4);
                const isFree = plan.code === 'free';
                
                return (
                  <Card 
                    key={plan.id}
                    className={`glass-card ${plan.is_highlighted ? 'ring-2 ring-primary shadow-glow' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      {plan.badge && (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2 ${
                          plan.is_highlighted 
                            ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-background' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {plan.badge}
                        </span>
                      )}
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {plan.description && (
                        <CardDescription className="text-xs">{plan.description}</CardDescription>
                      )}
                      <div className="mt-2">
                        <span className="text-3xl font-bold">
                          {price?.amount_cents ? `R$ ${Math.round(price.amount_cents / 100)}` : 'R$ 0'}
                        </span>
                        {!isFree && <span className="text-muted-foreground text-sm">/mês</span>}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ul className="space-y-2">
                        {primaryFeatures?.map((f) => (
                          <li key={f.id} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>
                              {f.is_dynamic && f.dynamic_value 
                                ? `${f.dynamic_value.toLocaleString('pt-BR')} ${f.display_name}`
                                : f.display_name
                              }
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={isFree ? 'default' : plan.is_highlighted ? 'default' : 'outline'}
                        className={`w-full ${plan.is_highlighted ? 'btn-premium' : ''}`}
                        asChild
                      >
                        <Link to={isFree ? '/signup' : '/precos'}>
                          {isFree ? 'Começar grátis' : 'Ver detalhes'}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
              <Link to="/precos">
                Comparar todos os planos <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
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
                Os dados dos pacientes são seguros?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Utilizamos criptografia de ponta a ponta, servidores em conformidade com LGPD e 
                certificações ISO 27001. Seus dados nunca são compartilhados com terceiros.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Posso personalizar os templates?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! Temos {metrics.templates_count}+ templates profissionais, {metrics.frases_count}+ frases modelo, 100+ tabelas de referência 
                e 25 calculadoras médicas. Você pode criar favoritos, personalizar variáveis e 
                salvar suas próprias frases modelo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                O que são as calculadoras médicas?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                São 25 calculadoras especializadas (volumes, índices, escores) que calculam automaticamente 
                e inserem o resultado formatado direto no laudo. Inclui peso fetal (Hadlock), volume elipsoide, 
                índice cardiotorácico, hematoma ABC/2, entre outras.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="glass-card px-6 border-0">
              <AccordionTrigger className="text-left">
                Há período de teste gratuito?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim! O plano Gratuito oferece acesso permanente para você testar a plataforma. 
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
