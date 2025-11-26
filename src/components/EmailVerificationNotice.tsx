import { Mail, X } from 'lucide-react';

interface EmailVerificationNoticeProps {
  email: string;
  onClose: () => void;
}

export default function EmailVerificationNotice({ 
  email, 
  onClose 
}: EmailVerificationNoticeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Mail size={32} className="text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verifique seu email</h2>
            <p className="text-muted-foreground">
              Enviamos um link de confirmação para:
            </p>
            <p className="font-medium text-primary">{email}</p>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Clique no link enviado para ativar sua conta e fazer login.
            </p>
            <p>
              Não recebeu o email? Verifique sua caixa de spam ou entre em contato conosco.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full btn-premium py-3 px-4 rounded-lg"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
