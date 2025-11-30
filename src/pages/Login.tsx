import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import GoogleOneTap from '@/components/GoogleOneTap';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import EmailVerificationNotice from '@/components/EmailVerificationNotice';
import LoginHeroBackground from '@/components/LoginHeroBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { isValidEmail, sanitizeInput } from '@/utils/validation';
import { useRateLimit } from '@/hooks/useRateLimit';

export default function Login() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const { checkRateLimit, remainingTime } = useRateLimit({ maxAttempts: 5, windowMs: 60000 });

  useEffect(() => {
    const stored = localStorage.getItem('rr.lastEmail');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.expires && parsed.expires > Date.now()) {
          setEmail(parsed.email);
          setRemember(true);
        } else {
          localStorage.removeItem('rr.lastEmail');
        }
      } catch {
        // Legacy format - just use as is
        setEmail(stored);
      }
    }
  }, []);

  useEffect(() => {
    if (user && !user.email_confirmed_at) {
      setShowEmailVerification(true);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/editor');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');
    const urlMessage = urlParams.get('message');

    if (urlError && urlMessage) {
      let userMessage = urlMessage;

      switch (urlError) {
        case 'oauth_error':
          userMessage = 'Erro no login com Google. Por favor, tente novamente.';
          break;
        case 'exchange_error':
          userMessage = 'Erro ao processar autenticação. Por favor, tente novamente.';
          break;
        case 'auth_failed':
          userMessage = 'Falha na autenticação. Por favor, tente novamente.';
          break;
      }

      setErr(userMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const emailError = useMemo(() => {
    if (!email) return null;
    if (!isValidEmail(email)) return 'Por favor, insira um email válido';
    return null;
  }, [email]);

  const disabled = Boolean(loading || !!emailError || !email || !password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    
    // Rate limiting check
    if (!checkRateLimit()) {
      setErr(`Muitas tentativas. Aguarde ${remainingTime()} segundos.`);
      return;
    }
    
    setErr(null);
    setLoading(true);
    try {
      const sanitizedEmail = sanitizeInput(email);
      await login(sanitizedEmail, password);
      
      // Save email with TTL (30 days)
      if (remember) {
        localStorage.setItem('rr.lastEmail', JSON.stringify({
          email: sanitizedEmail,
          expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
        }));
      } else {
        localStorage.removeItem('rr.lastEmail');
      }
    } catch (error: any) {
      setErr(error.message || 'Não foi possível entrar. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  }

  if (showEmailVerification && user?.email) {
    return <EmailVerificationNotice email={user.email} onClose={() => setShowEmailVerification(false)} />;
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
            Bem-vindo de volta!
          </h1>
          <p className="text-muted-foreground text-xl">Acesse sua conta para continuar</p>
        </div>

        <div className="glass-card rounded-2xl p-8 animate-scale-in">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="mb-4">
              <GoogleLoginButton />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-muted-foreground">ou</span>
              </div>
            </div>

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Email
              </label>
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
              <label className="block text-foreground text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-foreground text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mr-2 rounded border-border"
                />
                Lembrar-me
              </label>
              <Link to="/forgot-password" className="text-primary hover:text-primary/80 text-sm font-medium">
                Esqueceu a senha?
              </Link>
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
        </div>

        <GoogleOneTap />
      </main>
      <Footer />
    </div>
  );
}
