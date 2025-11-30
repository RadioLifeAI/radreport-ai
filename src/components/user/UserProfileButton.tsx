import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserProfileButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const UserProfileButton = ({ onClick, isOpen }: UserProfileButtonProps) => {
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  const getInitials = () => {
    if (!profile?.full_name) return 'U';
    const names = profile.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return profile.full_name[0].toUpperCase();
  };

  const getFirstName = () => {
    if (!profile?.full_name) return 'Usuário';
    return profile.full_name.split(' ')[0];
  };

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-muted/50 transition-all"
    >
      <Avatar className="h-8 w-8 border border-border/40">
        <AvatarImage src={profile?.avatar_url || undefined} />
        <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-foreground text-xs font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {!isMobile && (
        <>
          <span className="text-sm font-medium text-foreground hidden sm:inline">
            {getFirstName()}
          </span>
          <ChevronDown 
            size={14} 
            className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </>
      )}
    </Button>
  );
};
