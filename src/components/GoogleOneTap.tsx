import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function GoogleOneTap() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only show Google One Tap if user is not authenticated
    if (isAuthenticated) return;

    // Google One Tap will be configured in the future
    // For now, this is a placeholder component
    
  }, [isAuthenticated]);

  return null;
}
