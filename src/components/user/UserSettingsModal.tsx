import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEditorSettings } from '@/hooks/useEditorSettings';
import { useAuth } from '@/hooks/useAuth';
import { Slider } from '@/components/ui/slider';
import { Lock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { User, Edit3, Sparkles, Mic, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserSettingsModal = ({ open, onOpenChange }: UserSettingsModalProps) => {
  const { profile, updateProfile } = useUserProfile();
  const { settings, updateSettings } = useEditorSettings();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: formData.get('full_name') as string,
        specialty: formData.get('specialty') as string,
        crm: formData.get('crm') as string,
        institution: formData.get('institution') as string,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-md border-border/40">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text-medical">
            Configurações
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Gerencie suas preferências e configurações do editor
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/30">
            <TabsTrigger value="profile" className="text-xs">
              <User size={14} className="mr-1" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="editor" className="text-xs">
              <Edit3 size={14} className="mr-1" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              <Sparkles size={14} className="mr-1" />
              IA
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">
              <Mic size={14} className="mr-1" />
              Voz
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              <Shield size={14} className="mr-1" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 pt-4">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ''}
                  placeholder="Dr. João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  defaultValue={profile?.specialty || ''}
                  placeholder="Radiologia, Neurorradiologia, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input
                  id="crm"
                  name="crm"
                  defaultValue={profile?.crm || ''}
                  placeholder="123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <Input
                  id="institution"
                  name="institution"
                  defaultValue={profile?.institution || ''}
                  placeholder="Hospital/Clínica"
                />
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? 'Salvando...' : 'Salvar Perfil'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto_save">Auto-salvar ativado</Label>
                <Switch
                  id="auto_save"
                  checked={settings?.auto_save_enabled ?? true}
                  onCheckedChange={(checked) => 
                    updateSettings({ auto_save_enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto_save_interval">Intervalo de Auto-salvar</Label>
                <Select
                  value={settings?.auto_save_interval?.toString() || '30'}
                  onValueChange={(value) => 
                    updateSettings({ auto_save_interval: parseInt(value) })
                  }
                  disabled={!settings?.auto_save_enabled}
                >
                  <SelectTrigger id="auto_save_interval">
                    <SelectValue placeholder="Selecione o intervalo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 segundos</SelectItem>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">1 minuto</SelectItem>
                    <SelectItem value="120">2 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Tema do Editor</Label>
                <Select
                  value={settings?.theme || 'dark'}
                  onValueChange={(value) => 
                    updateSettings({ theme: value })
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Claro</SelectItem>
                    <SelectItem value="dark">🌙 Escuro</SelectItem>
                    <SelectItem value="system">💻 Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font_family">Família da Fonte</Label>
                <Select
                  value={settings?.font_family || 'Inter'}
                  onValueChange={(value) => 
                    updateSettings({ font_family: value })
                  }
                >
                  <SelectTrigger id="font_family">
                    <SelectValue placeholder="Selecione a fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia (Serif)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font_size">Tamanho da Fonte</Label>
                <Select
                  value={settings?.font_size?.toString() || '14'}
                  onValueChange={(value) => 
                    updateSettings({ font_size: parseInt(value) })
                  }
                >
                  <SelectTrigger id="font_size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="line_height">Altura da Linha</Label>
                <Select
                  value={settings?.line_height?.toString() || '1.5'}
                  onValueChange={(value) => 
                    updateSettings({ line_height: parseFloat(value) })
                  }
                >
                  <SelectTrigger id="line_height">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">1.2</SelectItem>
                    <SelectItem value="1.5">1.5</SelectItem>
                    <SelectItem value="1.8">1.8</SelectItem>
                    <SelectItem value="2.0">2.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai_enabled">Ativar IA</Label>
                <Switch
                  id="ai_enabled"
                  checked={settings?.ai_enabled ?? true}
                  onCheckedChange={(checked) => 
                    updateSettings({ ai_enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ai_auto_suggest">Sugestões Automáticas</Label>
                <Switch
                  id="ai_auto_suggest"
                  checked={settings?.ai_auto_suggest ?? true}
                  onCheckedChange={(checked) => 
                    updateSettings({ ai_auto_suggest: checked })
                  }
                  disabled={!settings?.ai_enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai_confidence">Confiança Mínima para Sugestões</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="ai_confidence"
                    value={[settings?.ai_confidence_threshold ?? 0.7]}
                    onValueChange={([value]) => 
                      updateSettings({ ai_confidence_threshold: value })
                    }
                    min={0.5}
                    max={1.0}
                    step={0.05}
                    className="flex-1"
                    disabled={!settings?.ai_enabled}
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {Math.round((settings?.ai_confidence_threshold ?? 0.7) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sugestões com confiança abaixo deste valor serão ignoradas
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice_enabled">Ativar Ditado por Voz</Label>
                <Switch
                  id="voice_enabled"
                  checked={settings?.voice_enabled ?? true}
                  onCheckedChange={(checked) => 
                    updateSettings({ voice_enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice_auto_punctuation">Pontuação Automática</Label>
                <Switch
                  id="voice_auto_punctuation"
                  checked={settings?.voice_auto_punctuation ?? true}
                  onCheckedChange={(checked) => 
                    updateSettings({ voice_auto_punctuation: checked })
                  }
                  disabled={!settings?.voice_enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice_language">Idioma do Reconhecimento</Label>
                <Select
                  value={settings?.voice_language || 'pt-BR'}
                  onValueChange={(value) => 
                    updateSettings({ voice_language: value })
                  }
                  disabled={!settings?.voice_enabled}
                >
                  <SelectTrigger id="voice_language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                    <SelectItem value="pt-PT">🇵🇹 Português (Portugal)</SelectItem>
                    <SelectItem value="en-US">🇺🇸 Inglês (EUA)</SelectItem>
                    <SelectItem value="es-ES">🇪🇸 Espanhol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice_sensitivity">Sensibilidade do Microfone</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="voice_sensitivity"
                    value={[settings?.voice_sensitivity ?? 0.8]}
                    onValueChange={([value]) => 
                      updateSettings({ voice_sensitivity: value })
                    }
                    min={0.3}
                    max={1.0}
                    step={0.05}
                    className="flex-1"
                    disabled={!settings?.voice_enabled}
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {Math.round((settings?.voice_sensitivity ?? 0.8) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Valores mais altos captam sons mais baixos
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <div className="space-y-4">
              {/* Informações da Conta */}
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  Conta
                </Label>
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  Criada em: {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }) : '—'}
                </p>
              </div>

              {/* Alterar Senha */}
              <div className="space-y-2">
                <Label>Alterar Senha</Label>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    const { supabase } = await import('@/integrations/supabase/client');
                    const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) {
                      toast.error('Erro ao enviar email de redefinição');
                    } else {
                      toast.success('Email de redefinição enviado com sucesso');
                    }
                  }}
                >
                  <Lock size={14} className="mr-2" />
                  Enviar email para redefinir senha
                </Button>
                <p className="text-xs text-muted-foreground">
                  Você receberá um email com instruções para criar nova senha
                </p>
              </div>

              {/* Excluir Conta */}
              <div className="pt-4 border-t border-border/40">
                <Label className="text-destructive">Zona de Perigo</Label>
                <Button 
                  variant="destructive" 
                  className="w-full mt-2"
                  onClick={() => {
                    toast.error('Funcionalidade em desenvolvimento', {
                      description: 'Por favor, entre em contato com o suporte para excluir sua conta.'
                    });
                  }}
                >
                  <AlertTriangle size={14} className="mr-2" />
                  Excluir Minha Conta
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta ação é irreversível e excluirá todos os seus dados
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
