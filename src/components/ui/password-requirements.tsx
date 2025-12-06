import { Check, Circle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export const PasswordRequirements = ({ password, className = '' }: PasswordRequirementsProps) => {
  const requirements = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Número', met: /[0-9]/.test(password) },
    { label: 'Caractere especial (!@#$%...)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const metCount = requirements.filter(r => r.met).length;

  return (
    <div className={`p-3 bg-muted/30 border border-border/50 rounded-lg space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Requisitos da senha</p>
        <span className={`text-xs font-medium ${metCount === requirements.length ? 'text-green-500' : 'text-muted-foreground'}`}>
          {metCount}/{requirements.length}
        </span>
      </div>
      <ul className="text-xs space-y-1">
        {requirements.map((req, i) => (
          <li 
            key={i} 
            className={`flex items-center gap-2 transition-colors ${
              req.met ? 'text-green-500' : 'text-muted-foreground'
            }`}
          >
            {req.met ? (
              <Check size={12} className="shrink-0" />
            ) : (
              <Circle size={12} className="shrink-0" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
