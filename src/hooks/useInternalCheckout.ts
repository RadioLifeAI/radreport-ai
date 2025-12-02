import { useState, useCallback } from 'react';
import { useEmbeddedCheckout } from './useEmbeddedCheckout';
import { useSubscription } from './useSubscription';

export const useInternalCheckout = () => {
  const [showPlansSheet, setShowPlansSheet] = useState(false);
  const [showCheckoutSheet, setShowCheckoutSheet] = useState(false);
  const { clientSecret, isLoading, initializeCheckout, clearCheckout } = useEmbeddedCheckout();
  const { refetch: refetchSubscription } = useSubscription();

  const openPlansSheet = useCallback(() => {
    setShowPlansSheet(true);
  }, []);

  const closePlansSheet = useCallback(() => {
    setShowPlansSheet(false);
  }, []);

  const handleSelectPlan = useCallback(async (priceId: string) => {
    const result = await initializeCheckout(priceId, true);
    if (result?.clientSecret) {
      setShowPlansSheet(false);
      setShowCheckoutSheet(true);
    }
  }, [initializeCheckout]);

  const handleCheckoutComplete = useCallback(() => {
    setShowCheckoutSheet(false);
    clearCheckout();
    // Refresh subscription status
    refetchSubscription();
  }, [clearCheckout, refetchSubscription]);

  const closeCheckoutSheet = useCallback(() => {
    setShowCheckoutSheet(false);
    clearCheckout();
  }, [clearCheckout]);

  return {
    // State
    showPlansSheet,
    showCheckoutSheet,
    clientSecret,
    isLoading,
    
    // Actions
    openPlansSheet,
    closePlansSheet,
    handleSelectPlan,
    handleCheckoutComplete,
    closeCheckoutSheet,
  };
};
