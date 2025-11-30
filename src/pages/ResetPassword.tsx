import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateMedicalPassword } from '@/utils/validation';

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    // Check for valid password recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidToken(!!session);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidToken(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordErrors([]);

    // Validate password strength
    const validation = validateMedicalPassword(password);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'As senhas digitadas não são iguais',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: 'Senha atualizada!',
        description: 'Sua senha foi redefinida com sucesso.',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Erro ao redefinir senha',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <PageLayout>
        <section className="py-20 px-4 min-h-[calc(100vh-200px)] flex items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="glass-card rounded-xl p-8 animate-fade-in text-center">
              <p className="text-muted-foreground">Verificando link de recuperação...</p>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Invalid or expired token
  if (!isValidToken) {
    return (
      <PageLayout>
        <section className="py-20 px-4 min-h-[calc(100vh-200px)] flex items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="glass-card rounded-xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                  Link Inválido
                </h1>
                <p className="text-muted-foreground mb-4">
                  Este link de recuperação expirou ou é inválido.
                </p>
                <Button
                  onClick={() => navigate('/forgot-password')}
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:brightness-110"
                >
                  Solicitar Novo Link
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-20 px-4 min-h-[calc(100vh-200px)] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="glass-card rounded-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                Redefinir Senha
              </h1>
              <p className="text-muted-foreground">
                Digite sua nova senha
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-foreground">
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-foreground">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-muted/30 border border-border/50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-foreground">Requisitos da senha:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li className={password.length >= 8 ? 'text-primary' : ''}>
                    ✓ Mínimo de 8 caracteres
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-primary' : ''}>
                    ✓ Pelo menos uma letra maiúscula
                  </li>
                  <li className={/[a-z]/.test(password) ? 'text-primary' : ''}>
                    ✓ Pelo menos uma letra minúscula
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-primary' : ''}>
                    ✓ Pelo menos um número
                  </li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-primary' : ''}>
                    ✓ Pelo menos um caractere especial
                  </li>
                </ul>
              </div>

              {/* Validation Errors */}
              {passwordErrors.length > 0 && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <ul className="text-sm text-destructive space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:brightness-110"
              >
                {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
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
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
