import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

/**
 * Rate limiting hook to prevent brute force attacks
 * @param maxAttempts - Maximum number of attempts allowed (default: 5)
 * @param windowMs - Time window in milliseconds (default: 60000ms = 1 minute)
 */
export const useRateLimit = ({ 
  maxAttempts = 5, 
  windowMs = 60000 
}: Partial<RateLimitConfig> = {}) => {
  const [attempts, setAttempts] = useState<number[]>([]);
  
  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }
    
    setAttempts([...recentAttempts, now]);
    return true; // Allowed
  }, [attempts, maxAttempts, windowMs]);
  
  const remainingTime = useCallback((): number => {
    if (attempts.length === 0) return 0;
    const oldest = Math.min(...attempts);
    const remaining = windowMs - (Date.now() - oldest);
    return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
  }, [attempts, windowMs]);
  
  const reset = useCallback(() => {
    setAttempts([]);
  }, []);
  
  return { 
    checkRateLimit, 
    remainingTime, 
    attemptsCount: attempts.length,
    reset
  };
};
