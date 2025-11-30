import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, isValidEmail } from '@/utils/validation';

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanEmail = sanitizeInput(email);
    
    if (!isValidEmail(cleanEmail)) {
      toast({
        title: 'E-mail inválido',
        description: 'Por favor, insira um e-mail válido.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar e-mail',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-20 px-4 min-h-[calc(100vh-200px)] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="glass-card rounded-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Mail className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                Recuperar Senha
              </h1>
              <p className="text-muted-foreground">
                Digite seu e-mail cadastrado para receber as instruções
              </p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@gmail.com"
                    className="bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:brightness-110"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>

                <div className="text-center">
                  <a
                    href="/login"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Login
                  </a>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-foreground mb-2">
                    ✓ E-mail enviado com sucesso!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </p>
                </div>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Login
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
