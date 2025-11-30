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
import { useState } from 'react';
import { User, Edit3, Sparkles, Mic, Shield } from 'lucide-react';

interface UserSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserSettingsModal = ({ open, onOpenChange }: UserSettingsModalProps) => {
  const { profile, updateProfile } = useUserProfile();
  const { settings, updateSettings } = useEditorSettings();
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
                <Label htmlFor="auto_save">Auto-salvar</Label>
                <Switch
                  id="auto_save"
                  checked={settings?.auto_save_enabled ?? true}
                  onCheckedChange={(checked) => 
                    updateSettings({ auto_save_enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font_size">Tamanho da Fonte</Label>
                <Select
                  value={settings?.font_size?.toString() || '14'}
                  onValueChange={(value) => 
                    updateSettings({ font_size: parseInt(value) })
                  }
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                />
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
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configurações de segurança e privacidade serão implementadas em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
