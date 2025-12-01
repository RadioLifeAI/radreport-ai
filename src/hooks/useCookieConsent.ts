import { useState, useCallback } from 'react';

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

// Função helper para verificação síncrona do localStorage
function getStoredConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const parsed: CookieConsent = JSON.parse(stored);
      if (parsed.version === CONSENT_VERSION) {
        return parsed;
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

export function useCookieConsent() {
  // Lazy initialization - verifica localStorage ANTES do primeiro render
  const [consent, setConsent] = useState<CookieConsent | null>(() => getStoredConsent());
  const [showBanner, setShowBanner] = useState(() => getStoredConsent() === null);

  const saveConsent = useCallback((newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent(defaultConsent);
  }, [saveConsent]);

  const updatePreferences = useCallback((
    preferences: Partial<Omit<CookieConsent, 'version' | 'timestamp' | 'essential'>>
  ) => {
    saveConsent({
      ...defaultConsent,
      ...preferences,
    });
  }, [saveConsent]);

  return {
    consent,
    showBanner,
    acceptAll,
    rejectAll,
    updatePreferences,
    hasConsent: consent !== null,
  };
}
