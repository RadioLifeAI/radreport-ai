import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { UserProfileButton } from './UserProfileButton';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAICredits } from '@/hooks/useAICredits';
import { useWhisperCredits } from '@/hooks/useWhisperCredits';
import { 
  User, 
  Settings, 
  History, 
  CreditCard, 
  LogOut,
  Sparkles,
  Mic
} from 'lucide-react';
import { useState } from 'react';

interface UserProfileDropdownProps {
  onOpenSettings: (tab?: string) => void;
}

export const UserProfileDropdown = ({ onOpenSettings }: UserProfileDropdownProps) => {
  const { logout, user } = useAuth();
  const { profile } = useUserProfile();
  const { balance: aiBalance, planType } = useAICredits();
  const { balance: whisperBalance } = useWhisperCredits();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      free: 'Gratuito',
      basic: 'Básico',
      professional: 'Profissional',
      premium: 'Premium',
    };
    return labels[plan] || plan;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <UserProfileButton onClick={() => setOpen(!open)} isOpen={open} />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-72 bg-card/95 backdrop-blur-md border-border/40"
        sideOffset={8}
      >
        <DropdownMenuLabel className="pb-2">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">
              {profile?.full_name || 'Usuário'}
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border/40" />
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => {
            setOpen(false);
            onOpenSettings('profile');
          }}
        >
          <User size={16} className="mr-2 text-muted-foreground" />
          Meu Perfil
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => {
            setOpen(false);
            onOpenSettings('editor');
          }}
        >
          <Settings size={16} className="mr-2 text-muted-foreground" />
          Configurações
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => {
            setOpen(false);
            onOpenSettings('history');
          }}
        >
          <History size={16} className="mr-2 text-muted-foreground" />
          Histórico de Uso
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => {
            setOpen(false);
            onOpenSettings('credits');
          }}
        >
          <CreditCard size={16} className="mr-2 text-muted-foreground" />
          Créditos & Plano
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/40" />
        
        <div className="px-2 py-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Tokens IA</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                aiBalance > 100 ? 'border-green-500/40 text-green-400' :
                aiBalance > 50 ? 'border-yellow-500/40 text-yellow-400' :
                'border-red-500/40 text-red-400'
              }`}
            >
              {aiBalance}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mic size={14} className="text-indigo-400" />
              <span>Whisper</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                whisperBalance > 10 ? 'border-green-500/40 text-green-400' :
                whisperBalance > 5 ? 'border-yellow-500/40 text-yellow-400' :
                'border-red-500/40 text-red-400'
              }`}
            >
              {whisperBalance}
            </Badge>
          </div>
          
          <div className="text-xs text-muted-foreground text-center pt-1">
            Plano: <span className="text-foreground font-medium">{getPlanLabel(planType)}</span>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-border/40" />
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-destructive/10 text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
