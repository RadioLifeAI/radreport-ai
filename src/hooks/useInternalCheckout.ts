import { useState, useCallback } from 'react';
import { useEmbeddedCheckout } from './useEmbeddedCheckout';
import { useSubscription } from './useSubscription';

export const useInternalCheckout = () => {
  const [showPlansSheet, setShowPlansSheet] = useState(false);
  const { isLoading, initializeCheckout } = useEmbeddedCheckout();
  const { refetch: refetchSubscription } = useSubscription();

  const openPlansSheet = useCallback(() => {
    setShowPlansSheet(true);
  }, []);

  const closePlansSheet = useCallback(() => {
    setShowPlansSheet(false);
  }, []);

  const handleSelectPlan = useCallback(async (priceId: string, interval: 'month' | 'year' = 'month') => {
    if (!priceId) {
      return;
    }
    // Use embedded=false for redirect to checkout.stripe.com
    await initializeCheckout(priceId, false, interval);
    setShowPlansSheet(false);
  }, [initializeCheckout]);

  return {
    // State
    showPlansSheet,
    isLoading,
    
    // Actions
    openPlansSheet,
    closePlansSheet,
    handleSelectPlan,
  };
};
