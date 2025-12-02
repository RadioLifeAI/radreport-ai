import { Shield, CreditCard, RefreshCcw, Lock } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: CreditCard,
      title: "Pagamento Seguro",
      description: "Processado via Stripe"
    },
    {
      icon: RefreshCcw,
      title: "Cancele Quando Quiser",
      description: "Sem multas ou taxas"
    },
    {
      icon: Shield,
      title: "Conformidade LGPD",
      description: "Dados protegidos"
    },
    {
      icon: Lock,
      title: "Criptografia SSL",
      description: "256-bit encryption"
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-8">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <badge.icon className="w-5 h-5 text-primary/70" />
          <div className="text-left">
            <p className="text-sm font-medium text-foreground/80">{badge.title}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
