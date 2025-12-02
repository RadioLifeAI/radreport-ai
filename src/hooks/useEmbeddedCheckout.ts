import { useState } from 'react';
import { invokeEdgeFunction } from '@/services/edgeFunctionClient';
import { toast } from 'sonner';

interface CheckoutResponse {
  clientSecret?: string;
  url?: string;
  error?: string;
}

export const useEmbeddedCheckout = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeCheckout = async (priceId: string, embedded: boolean = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await invokeEdgeFunction<CheckoutResponse>('create-checkout-session', {
        price_id: priceId,
        embedded,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      if (embedded && data.clientSecret) {
        setClientSecret(data.clientSecret);
        return { clientSecret: data.clientSecret };
      } else if (data.url) {
        // Redirect to Stripe hosted checkout
        window.location.href = data.url;
        return { url: data.url };
      }

      throw new Error('Invalid checkout response');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar checkout';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCheckout = () => {
    setClientSecret(null);
    setError(null);
  };

  return {
    clientSecret,
    isLoading,
    error,
    initializeCheckout,
    clearCheckout,
  };
};
