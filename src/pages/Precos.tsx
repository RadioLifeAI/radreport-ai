import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Loader2, Sparkles, Zap, Crown, Star, HelpCircle, Mic, Brain, FileText, Shield } from 'lucide-react';
import { usePlans, SubscriptionPlan } from '@/hooks/usePlans';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const planIcons: Record<string, React.ElementType> = {
  free: Sparkles,
  basic: Zap,
  professional: Crown,
  premium: Star,
};

const faqs = [
  {
    question: "O que são tokens de IA?",
    answer: "Tokens são unidades de processamento de texto. Em média, 1 token corresponde a cerca de 4 caracteres em português. Cada funcionalidade de IA consome uma quantidade específica de tokens baseada no tamanho do texto processado."
  },
  {
    question: "Como funciona o consumo de tokens?",
    answer: "Cada função de IA consome aproximadamente: Conclusão AI = 2 tokens por laudo, Sugestões AI = 2 tokens por laudo, Classificação RADS = 2 tokens, Mensagem no Chat = 1 token. Os tokens são renovados mensalmente."
  },
  {
    question: "O que são créditos Whisper?",
    answer: "Créditos Whisper permitem usar transcrição de voz premium com alta precisão para terminologia médica. 1 crédito = 1 minuto de áudio (arredondado para cima, máximo 5 créditos por áudio)."
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é calculado proporcionalmente."
  },
  {
    question: "Como funciona o período de teste?",
    answer: "O plano Gratuito oferece 20 tokens mensais para você experimentar as funcionalidades de IA. Não é necessário cartão de crédito para começar."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartões de crédito (Visa, Mastercard, American Express, Elo) e PIX através do Stripe, nossa plataforma de pagamentos segura."
  }
];

function PlanCard({ plan, currentPlanCode, onSubscribe, isLoading }: { 
  plan: SubscriptionPlan; 
  currentPlanCode: string | null;
  onSubscribe: (priceId: string) => void;
  isLoading: boolean;
}) {
  const Icon = planIcons[plan.code] || Sparkles;
  const price = plan.subscription_prices?.[0];
  const priceValue = price ? price.amount_cents / 100 : 0;
  const isCurrentPlan = currentPlanCode === plan.code;
  const isFree = plan.code === 'free';

  return (
    <Card className={`relative flex flex-col ${plan.is_highlighted ? 'border-primary shadow-lg scale-105' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
      {plan.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          {plan.badge}
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 right-4 bg-green-500">
          Seu Plano
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold">
            R$ {priceValue.toFixed(0)}
          </span>
          {!isFree && <span className="text-muted-foreground">/mês</span>}
        </div>
        
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <strong>{plan.ai_tokens_monthly.toLocaleString()}</strong> tokens IA/mês
            </span>
          </li>
          
          {plan.whisper_credits_monthly > 0 && (
            <li className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <strong>{plan.whisper_credits_monthly}</strong> créditos Whisper/mês
              </span>
            </li>
          )}
          
          {plan.feature_ai_conclusion && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Conclusão AI</span>
            </li>
          )}
          
          {plan.feature_ai_suggestions && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Sugestões AI</span>
            </li>
          )}
          
          {plan.feature_ai_rads && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Classificação RADS</span>
            </li>
          )}
          
          {plan.feature_whisper && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Transcrição Whisper Premium</span>
            </li>
          )}
          
          <li className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">149 Templates</span>
          </li>
          
          {plan.feature_priority_support && (
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm">Suporte Prioritário</span>
            </li>
          )}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.is_highlighted ? 'default' : 'outline'}
          disabled={isCurrentPlan || isLoading || isFree}
          onClick={() => price && onSubscribe(price.id)}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isCurrentPlan ? (
            'Plano Atual'
          ) : isFree ? (
            'Plano Gratuito'
          ) : (
            'Assinar Agora'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function PlansSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader className="text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-10 w-32 mx-auto mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function Precos() {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { planCode, createCheckout, isCreatingCheckout } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (priceId: string) => {
    if (!user) {
      navigate('/login?redirect=/precos');
      return;
    }
    createCheckout(priceId);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Preços Transparentes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Potencialize seus laudos radiológicos com inteligência artificial. 
            Comece gratuitamente e faça upgrade quando precisar.
          </p>
        </div>

        {/* Pricing Cards */}
        {plansLoading ? (
          <PlansSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans?.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlanCode={planCode}
                onSubscribe={handleSubscribe}
                isLoading={isCreatingCheckout}
              />
            ))}
          </div>
        )}

        {/* Token Explanation */}
        <Card className="mb-16 bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Como funcionam os tokens?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <p className="text-sm text-muted-foreground">tokens por laudo com Conclusão AI</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <p className="text-sm text-muted-foreground">tokens por classificação RADS</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <p className="text-sm text-muted-foreground">token por mensagem no Chat AI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para transformar seus laudos?
          </h2>
          <p className="text-muted-foreground mb-6">
            Comece gratuitamente com 20 tokens e experimente o poder da IA radiológica.
          </p>
          <Button size="lg" onClick={() => navigate(user ? '/editor' : '/signup')}>
            {user ? 'Ir para o Editor' : 'Criar Conta Grátis'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
