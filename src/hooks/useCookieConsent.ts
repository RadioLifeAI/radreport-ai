import { useState, useEffect } from 'react';

export interface CookieConsent {
  version: string;
  timestamp: string;
  essential: true;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'radreport_cookie_consent';
const CONSENT_VERSION = '1.0';

const defaultConsent: CookieConsent = {
  version: CONSENT_VERSION,
  timestamp: new Date().toISOString(),
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      try {
        const parsed: CookieConsent = JSON.parse(stored);
        // Invalidar se versão diferente
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed);
        } else {
          setShowBanner(true);
        }
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setShowBanner(false);
  };

  const acceptAll = () => {
    saveConsent({
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    saveConsent(defaultConsent);
  };

  const updatePreferences = (preferences: Partial<Omit<CookieConsent, 'version' | 'timestamp' | 'essential'>>) => {
    saveConsent({
      ...defaultConsent,
      ...preferences,
    });
  };

  return {
    consent,
    showBanner,
    acceptAll,
    rejectAll,
    updatePreferences,
    hasConsent: consent !== null,
  };
}
