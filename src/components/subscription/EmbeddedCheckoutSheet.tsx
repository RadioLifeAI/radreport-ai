import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';

// Initialize Stripe - use test key for now, will be replaced with live key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface EmbeddedCheckoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientSecret: string | null;
  onComplete?: () => void;
}

export const EmbeddedCheckoutSheet = ({
  open,
  onOpenChange,
  clientSecret,
  onComplete,
}: EmbeddedCheckoutSheetProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientSecret) {
      setIsLoading(false);
    }
  }, [clientSecret]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl md:max-w-2xl p-0 overflow-hidden"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/30">
          <SheetTitle className="text-xl font-bold gradient-text-medical">
            Finalizar Assinatura
          </SheetTitle>
        </SheetHeader>
        
        <div className="h-[calc(100vh-100px)] overflow-y-auto">
          {isLoading || !clientSecret ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Carregando checkout...</span>
            </div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret, onComplete }}
            >
              <EmbeddedCheckout className="h-full" />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
