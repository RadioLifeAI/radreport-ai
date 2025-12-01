import { NavLink } from 'react-router-dom';
import { 
  Settings, 
  FileText, 
  Database, 
  Users, 
  Shield,
  Home,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin', icon: Home, label: 'Dashboard', end: true },
  { to: '/admin/prompts', icon: FileText, label: 'Prompts IA' },
  { to: '/admin/models', icon: Database, label: 'Modelos' },
  { to: '/admin/users', icon: Users, label: 'Usuários' },
  { to: '/admin/security', icon: Shield, label: 'Segurança' },
  { to: '/admin/settings', icon: Settings, label: 'Configurações' },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
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
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <NavLink to="/editor">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao Editor
          </NavLink>
        </Button>
      </div>
    </aside>
  );
};
