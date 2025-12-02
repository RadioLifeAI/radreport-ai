import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  Database, 
  FileText, 
  Settings, 
  Users, 
  Shield, 
  ChevronLeft,
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/ai-config', icon: Cpu, label: 'Configurações IA' },
  { to: '/admin/templates', icon: Database, label: 'Templates' },
  { to: '/admin/frases', icon: FileText, label: 'Frases Modelo' },
  { to: '/admin/subscriptions', icon: CreditCard, label: 'Assinaturas' },
  { to: '/admin/users', icon: Users, label: 'Usuários', disabled: true },
  { to: '/admin/settings', icon: Settings, label: 'Configurações', disabled: true },
  { to: '/admin/security', icon: Shield, label: 'Segurança', disabled: true },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground font-mono">Admin Panel</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
          RadReport v1.0
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end, disabled }) => (
          disabled ? (
            <div
              key={to}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
            >
              <Icon className="h-4 w-4" />
              <span className="font-mono">{label}</span>
              <span className="ml-auto text-[9px] bg-muted px-1.5 py-0.5 rounded">Em breve</span>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="font-mono">{label}</span>
            </NavLink>
          )
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <NavLink to="/editor">
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Voltar ao Editor</span>
          </NavLink>
        </Button>
      </div>
    </aside>
  );
};
