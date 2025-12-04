import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import TurnstileWidget from '@/components/TurnstileWidget';
import LoginHeroBackground from '@/components/LoginHeroBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { isValidEmail, validateMedicalPassword, sanitizeInput } from '@/utils/validation';
import { supabase } from '@/integrations/supabase/client';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    if (!isValidEmail(email)) return 'Por favor, insira um email válido';
    return null;
  }, [email]);

  const passwordValidation = useMemo(() => {
    if (!password) return { isValid: true, errors: [] };
    return validateMedicalPassword(password);
  }, [password]);

  const passwordError = useMemo(() => {
    if (passwordValidation.errors.length > 0) {
      return passwordValidation.errors.join(', ');
    }
    return null;
  }, [passwordValidation]);

  const confirmPasswordError = useMemo(
    () => (confirmPassword && password !== confirmPassword ? 'As senhas não coincidem' : null),
    [confirmPassword, password]
  );

  const disabled =
    loading ||
    !!emailError ||
    !!passwordError ||
    !!confirmPasswordError ||
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !turnstileToken;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setErr(null);
    setTurnstileError(null);
    setLoading(true);

    try {
      // Validate Turnstile token first
      const { data: turnstileResult, error: turnstileErr } = await supabase.functions.invoke('verify-turnstile', {
        body: { token: turnstileToken }
      });
      
      if (turnstileErr || !turnstileResult?.success) {
        setTurnstileError('Verificação de segurança falhou. Tente novamente.');
        setTurnstileToken(null);
        setLoading(false);
        return;
      }

      // Proceed with registration
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);

      await register(sanitizedEmail, password, sanitizedName);
      navigate('/login');
    } catch (error: any) {
      setErr(error.message || 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 login-hero-container relative overflow-hidden">
        <LoginHeroBackground />
        <div className="login-hero-glow" />

        <div className="relative z-float w-full max-w-md mx-auto px-4 py-16">
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text-medical">
              Criar conta
            </h1>
            <p className="text-muted-foreground text-xl">Cadastre-se para começar a usar</p>
          </div>

          <div className="glass-card rounded-2xl p-8 animate-scale-in">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Nome completo</label>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 form-input-enhanced rounded-lg"
                placeholder="Dr. João Silva"
                required
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 form-input-enhanced rounded-lg"
                placeholder="seu@email.com"
                required
              />
              {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 form-input-enhanced rounded-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 form-input-enhanced rounded-lg pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPass ? '🙈' : '👁️'}
                </button>
              </div>
              {confirmPasswordError && <p className="text-destructive text-sm mt-1">{confirmPasswordError}</p>}
            </div>

            <div>
              <TurnstileWidget 
                onSuccess={setTurnstileToken} 
                onError={setTurnstileError}
                onExpire={() => setTurnstileToken(null)}
              />
              {turnstileError && <p className="text-destructive text-sm mt-1 text-center">{turnstileError}</p>}
            </div>

            {err && (
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 text-destructive text-sm">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={disabled}
              className="w-full btn-premium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
