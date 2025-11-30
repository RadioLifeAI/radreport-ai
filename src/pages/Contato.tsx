import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Mail, Clock, Phone, ShieldCheck, HelpCircle, DollarSign, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Contato() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Mensagem enviada!',
      description: 'Entraremos em contato em breve.',
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-medical animate-fade-in">
            Fale Conosco
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Estamos aqui para ajudar. Entre em contato através dos canais abaixo
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Envie uma Mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Dr. João Silva"
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="joao.silva@hospital.com.br"
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                    Assunto
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Dúvida sobre planos"
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Descreva sua dúvida ou sugestão..."
                    rows={5}
                    className="bg-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:brightness-110"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">E-mail</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      contato@radreport.com.br
                    </p>
                    <a href="mailto:contato@radreport.com.br" className="text-primary hover:underline text-sm">
                      Enviar e-mail
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      +55 77 98864-0691
                    </p>
                    <a 
                      href="https://wa.me/5577988640691" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">DPO (Proteção de Dados)</h3>
                    <p className="text-muted-foreground text-sm mb-1">
                      Dr. Nailson Costa (CRM-BA 28286)
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Para questões sobre LGPD e privacidade
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">Prazo de Resposta</h3>
                    <p className="text-muted-foreground text-sm">
                      Até 15 dias úteis para todas as solicitações
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Perguntas Frequentes</h3>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li>
                    <a href="/#faq" className="text-primary hover:underline flex items-center gap-2 text-sm">
                      → Como funcionam os tokens?
                    </a>
                  </li>
                  <li>
                    <a href="/#faq" className="text-primary hover:underline flex items-center gap-2 text-sm">
                      → Como usar o ditado por voz?
                    </a>
                  </li>
                  <li>
                    <a href="/#faq" className="text-primary hover:underline flex items-center gap-2 text-sm">
                      → Posso cancelar meu plano?
                    </a>
                  </li>
                  <li>
                    <a href="/precos" className="text-primary hover:underline flex items-center gap-2 text-sm">
                      → Ver todos os planos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
