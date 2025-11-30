import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Shield, BarChart3, Settings, Megaphone } from 'lucide-react';

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookiePreferencesModal({ open, onOpenChange }: CookiePreferencesModalProps) {
  const { consent, acceptAll, updatePreferences } = useCookieConsent();
  const [preferences, setPreferences] = useState({
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    if (consent) {
      setPreferences({
        analytics: consent.analytics,
        functional: consent.functional,
        marketing: consent.marketing,
      });
    }
  }, [consent]);

  const handleSave = () => {
    updatePreferences(preferences);
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preferências de Cookies</DialogTitle>
          <DialogDescription>
            Gerencie suas preferências de cookies. Você pode alterar suas escolhas a qualquer momento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essenciais */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="essential" className="text-base font-semibold">
                  Cookies Essenciais
                </Label>
                <Switch id="essential" checked disabled />
              </div>
              <p className="text-sm text-muted-foreground">
                Necessários para o funcionamento básico do site, incluindo autenticação, 
                sessão do usuário e segurança. Estes cookies não podem ser desativados.
              </p>
              <p className="text-xs text-muted-foreground">
                Exemplos: tokens de sessão, preferências de idioma, estado de autenticação
              </p>
            </div>
          </div>

          {/* Analíticos */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <BarChart3 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="text-base font-semibold cursor-pointer">
                  Cookies Analíticos
                </Label>
                <Switch 
                  id="analytics" 
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ajudam-nos a entender como os visitantes interagem com o site, coletando e 
                relatando informações de forma anônima para melhorar o serviço.
              </p>
              <p className="text-xs text-muted-foreground">
                Exemplos: páginas visitadas, tempo de permanência, origem do tráfego
              </p>
            </div>
          </div>

          {/* Funcionais */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <Settings className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="functional" className="text-base font-semibold cursor-pointer">
                  Cookies Funcionais
                </Label>
                <Switch 
                  id="functional" 
                  checked={preferences.functional}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, functional: checked }))}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Permitem funcionalidades aprimoradas e personalizadas, como lembrar suas 
                preferências de exibição, templates favoritos e configurações do editor.
              </p>
              <p className="text-xs text-muted-foreground">
                Exemplos: tema escuro/claro, templates recentes, preferências de layout
              </p>
            </div>
          </div>

          {/* Marketing */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <Megaphone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing" className="text-base font-semibold cursor-pointer">
                  Cookies de Marketing
                </Label>
                <Switch 
                  id="marketing" 
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Utilizados para rastrear visitantes através de websites e exibir anúncios 
                relevantes e envolventes para o usuário individual.
              </p>
              <p className="text-xs text-muted-foreground">
                Exemplos: remarketing, anúncios personalizados, rastreamento de conversões
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleAcceptAll} className="w-full sm:w-auto">
            Aceitar todos
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Salvar preferências
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
