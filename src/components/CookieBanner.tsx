import { useState } from 'react';
import { Cookie, Settings } from 'lucide-react';
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
          <div className="container mx-auto px-3 py-3 md:px-4 md:py-5 max-w-6xl">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Ícone + Texto */}
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <Cookie className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm md:text-base font-semibold text-foreground">
                    <span className="md:hidden">Usamos cookies</span>
                    <span className="hidden md:inline">Utilizamos cookies para melhorar sua experiência</span>
                  </h3>
                  {/* Descrição completa apenas em desktop */}
                  <p className="hidden md:block text-sm text-muted-foreground leading-relaxed mt-1">
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

              {/* Botões em linha única */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={acceptAll}
                  className="px-3 py-1.5 md:px-5 md:py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0"
                  aria-label="Aceitar todos os cookies"
                >
                  <span className="md:hidden">Aceitar</span>
                  <span className="hidden md:inline">Aceitar todos</span>
                </button>
                <button
                  onClick={rejectAll}
                  className="px-3 py-1.5 md:px-5 md:py-2 text-sm bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0"
                  aria-label="Aceitar apenas cookies essenciais"
                >
                  <span className="md:hidden">Recusar</span>
                  <span className="hidden md:inline">Apenas essenciais</span>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="p-2 md:px-3 md:py-1.5 text-sm text-primary hover:bg-accent rounded-lg transition-colors min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                  aria-label="Personalizar preferências de cookies"
                >
                  <Settings className="w-4 h-4 md:hidden" />
                  <span className="hidden md:inline">Personalizar</span>
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
