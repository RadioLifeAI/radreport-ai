import { useState } from 'react';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferencesModal } from './CookiePreferencesModal';
import { Link } from 'react-router-dom';

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll } = useCookieConsent();
  const [showModal, setShowModal] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom">
        <div className="bg-card/95 backdrop-blur-lg border-t border-border/40 shadow-2xl">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    Utilizamos cookies para melhorar sua experiência
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cookies essenciais são necessários para o funcionamento do site. 
                    Você pode personalizar suas preferências a qualquer momento.{' '}
                    <Link to="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                    {' · '}
                    <Link to="/cookies" className="text-primary hover:underline">
                      Política de Cookies
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={acceptAll}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Aceitar todos
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Apenas essenciais
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full md:w-auto text-sm text-primary hover:underline"
                >
                  Personalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CookiePreferencesModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </>
  );
}
