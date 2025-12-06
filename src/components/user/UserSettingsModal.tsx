import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PasswordRequirements } from '@/components/ui/password-requirements';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEditorSettings } from '@/hooks/useEditorSettings';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { UserCreditsCard } from './UserCreditsCard';
import { validateMedicalPassword } from '@/utils/validation';
import { User, FileText, Sparkles, Mic, Lock, AlertTriangle, History, CreditCard, Crown, ExternalLink, Key, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Consistent credit thresholds
const CREDIT_THRESHOLDS = {
  AI: { GREEN: 100, YELLOW: 50 },
  WHISPER: { GREEN: 10, YELLOW: 5 }
};

interface UserSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
  onUpgrade?: () => void;
}

// Validation functions
const validateName = (name: string): string | null => {
  if (!name || name.trim().length < 3) {
    return 'Nome deve ter no mínimo 3 caracteres';
  }
  if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
    return 'Nome deve conter apenas letras e espaços';
  }
  return null;
};

const validateCRM = (crm: string): string | null => {
  if (!crm) return null; // CRM is optional
  // Format: 4-7 digits + hyphen + 2 letter state (e.g., 123456-SP)
  if (!/^\d{4,7}-[A-Z]{2}$/.test(crm)) {
    return 'CRM deve estar no formato: 123456-SP';
  }
  return null;
};

export const UserSettingsModal = ({ open, onOpenChange, defaultTab = 'profile', onUpgrade }: UserSettingsModalProps) => {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading: profileLoading } = useUserProfile();
  const { settings, updateSettings, isLoading: settingsLoading } = useEditorSettings();
  const { subscription, isSubscribed, planName, openPortal, isOpeningPortal } = useSubscription();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Update tab when defaultTab changes
  useEffect(() => {
    if (open) {
      setCurrentTab(defaultTab);
    }
  }, [defaultTab, open]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get('full_name') as string,
      specialty: formData.get('specialty') as string,
      crm: formData.get('crm') as string,
      institution: formData.get('institution') as string,
    };

    // Validate fields
    const newErrors: Record<string, string> = {};
    
    const nameError = validateName(updates.full_name);
    if (nameError) newErrors.full_name = nameError;

    const crmError = validateCRM(updates.crm);
    if (crmError) newErrors.crm = crmError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      toast.error('Corrija os erros nos campos');
      return;
    }

    try {
      await updateProfile(updates);
      setErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success('Email de redefinição de senha enviado!');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      toast.error('Erro ao enviar email de redefinição');
    }
  };

  const handleDirectPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      toast.error('Usuário não encontrado');
      return;
    }

    // Validate new password strength
    const validation = validateMedicalPassword(newPassword);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    // Confirm passwords match
    if (newPassword !== confirmNewPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Re-authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        toast.error('Senha atual incorreta');
        setIsChangingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast.error('Erro ao alterar senha: ' + updateError.message);
        setIsChangingPassword(false);
        return;
      }

      toast.success('Senha alterada com sucesso!');
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast.info('Funcionalidade em desenvolvimento');
    // TODO: Implement account deletion with proper data cleanup
  };

  const isLoading = profileLoading || settingsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Configurações do Usuário</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 sm:grid-cols-7 bg-muted/30 gap-0.5 sm:gap-1 p-1">
            <TabsTrigger value="profile" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <User size={16} className="shrink-0" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <FileText size={16} className="shrink-0" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <Sparkles size={16} className="shrink-0" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <Mic size={16} className="shrink-0" />
              <span className="hidden sm:inline">Voz</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <Lock size={16} className="shrink-0" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <History size={16} className="shrink-0" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="credits" className="text-xs gap-1 px-1 sm:px-3 min-h-[44px]">
              <CreditCard size={16} className="shrink-0" />
              <span className="hidden sm:inline">Créditos</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Seu nome completo"
                    disabled={isSaving}
                    className={errors.full_name ? 'border-destructive' : ''}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-destructive">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    defaultValue={profile?.specialty || ''}
                    placeholder="Ex: Radiologia"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crm">CRM</Label>
                  <Input
                    id="crm"
                    name="crm"
                    defaultValue={profile?.crm || ''}
                    placeholder="Ex: 123456-SP"
                    disabled={isSaving}
                    className={errors.crm ? 'border-destructive' : ''}
                  />
                  {errors.crm && (
                    <p className="text-xs text-destructive">{errors.crm}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Formato: 6 dígitos-UF (ex: 123456-SP)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Instituição</Label>
                  <Input
                    id="institution"
                    name="institution"
                    defaultValue={profile?.institution || ''}
                    placeholder="Nome da instituição"
                    disabled={isSaving}
                  />
                </div>

                <Button type="submit" className="w-full min-h-[44px]" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            )}
          </TabsContent>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-salvar</Label>
                    <p className="text-xs text-muted-foreground">
                      Salvar automaticamente as alterações
                    </p>
                  </div>
                  <Switch
                    checked={settings?.auto_save_enabled ?? true}
                    onCheckedChange={(checked) => updateSettings({ auto_save_enabled: checked })}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Intervalo de Auto-salvar</Label>
                  <Select
                    value={settings?.auto_save_interval?.toString() || '30'}
                    onValueChange={(value) => updateSettings({ auto_save_interval: parseInt(value) })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="min-h-[44px]">
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
                  <Label>Tema do Editor</Label>
                  <Select
                    value={settings?.theme || 'dark'}
                    onValueChange={(value) => updateSettings({ theme: value })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Família da Fonte</Label>
                  <Select
                    value={settings?.font_family || 'Inter'}
                    onValueChange={(value) => updateSettings({ font_family: value })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Selecione a fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamanho da Fonte</Label>
                  <Select
                    value={settings?.font_size?.toString() || '14'}
                    onValueChange={(value) => updateSettings({ font_size: parseInt(value) })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px (padrão)</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Altura da Linha</Label>
                  <Select
                    value={settings?.line_height?.toString() || '1.5'}
                    onValueChange={(value) => updateSettings({ line_height: parseFloat(value) })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Selecione a altura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.2">1.2</SelectItem>
                      <SelectItem value="1.5">1.5 (padrão)</SelectItem>
                      <SelectItem value="1.8">1.8</SelectItem>
                      <SelectItem value="2.0">2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ativar IA</Label>
                    <p className="text-xs text-muted-foreground">
                      Habilitar recursos de inteligência artificial
                    </p>
                  </div>
                  <Switch
                    checked={settings?.ai_enabled ?? true}
                    onCheckedChange={(checked) => updateSettings({ ai_enabled: checked })}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sugestões Automáticas</Label>
                    <p className="text-xs text-muted-foreground">
                      Receber sugestões da IA automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={settings?.ai_auto_suggest ?? false}
                    onCheckedChange={(checked) => updateSettings({ ai_auto_suggest: checked })}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confiança Mínima para Sugestões</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings?.ai_confidence_threshold || 70]}
                      onValueChange={([value]) => updateSettings({ ai_confidence_threshold: value })}
                      min={50}
                      max={100}
                      step={5}
                      className="flex-1"
                      disabled={isSaving}
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {settings?.ai_confidence_threshold || 70}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sugestões com confiança abaixo deste valor serão ignoradas
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent value="voice" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ativar Ditado por Voz</Label>
                    <p className="text-xs text-muted-foreground">
                      Habilitar entrada de voz no editor
                    </p>
                  </div>
                  <Switch
                    checked={settings?.voice_enabled ?? true}
                    onCheckedChange={(checked) => updateSettings({ voice_enabled: checked })}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pontuação Automática</Label>
                    <p className="text-xs text-muted-foreground">
                      Adicionar pontuação automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={settings?.voice_auto_punctuation ?? true}
                    onCheckedChange={(checked) => updateSettings({ voice_auto_punctuation: checked })}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Idioma do Reconhecimento</Label>
                  <Select
                    value={settings?.voice_language || 'pt-BR'}
                    onValueChange={(value) => updateSettings({ voice_language: value })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sensibilidade do Microfone</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings?.voice_sensitivity || 70]}
                      onValueChange={([value]) => updateSettings({ voice_sensitivity: value })}
                      min={30}
                      max={100}
                      step={5}
                      className="flex-1"
                      disabled={isSaving}
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {settings?.voice_sensitivity || 70}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valores mais altos captam sons mais baixos
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="space-y-6">
              {/* Account Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Lock size={16} />
                  Informações da Conta
                </h3>
                
                <div className="space-y-2 rounded-lg border border-border/40 p-4 bg-muted/20">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium break-all">{user?.email}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Criado em</span>
                    <span className="text-sm font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Direct Password Change */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Key size={16} />
                  Alterar Senha
                </h3>
                <p className="text-xs text-muted-foreground">
                  Altere sua senha diretamente, sem necessidade de email
                </p>
                
                <form onSubmit={handleDirectPasswordChange} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input 
                      id="currentPassword"
                      type="password" 
                      placeholder="Digite sua senha atual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isChangingPassword}
                      className="min-h-[44px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input 
                      id="newPassword"
                      type="password" 
                      placeholder="Digite sua nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                      className="min-h-[44px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirmNewPassword"
                      type="password" 
                      placeholder="Confirme sua nova senha"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={isChangingPassword}
                      className="min-h-[44px]"
                    />
                  </div>
                  
                  {newPassword && (
                    <PasswordRequirements password={newPassword} />
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full min-h-[44px]"
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                  >
                    {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                </form>
              </div>

              <Separator />

              {/* Password Reset via Email (alternative) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <Mail size={16} />
                  Esqueceu a senha atual?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enviaremos um email com instruções para redefinir sua senha
                </p>
                <Button 
                  variant="outline" 
                  className="w-full min-h-[44px]"
                  onClick={handleResetPassword}
                >
                  Enviar Email de Redefinição
                </Button>
              </div>

              <Separator className="border-destructive/20" />

              {/* Danger Zone */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Zona de Perigo
                </h3>
                <p className="text-xs text-muted-foreground">
                  Excluir sua conta é permanente e não pode ser desfeito
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full min-h-[44px]"
                    >
                      Excluir Minha Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                        e removerá seus dados de nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Sim, excluir conta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <History size={20} className="text-muted-foreground" />
                <h3 className="text-lg font-semibold">Histórico de Uso</h3>
              </div>
              
              <div className="rounded-lg border border-border/40 p-8 text-center bg-muted/10">
                <History size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Histórico de uso em desenvolvimento
                </p>
                <p className="text-xs text-muted-foreground">
                  Em breve você poderá visualizar seu histórico de laudos, templates e estatísticas
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Crown size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">Assinatura & Créditos</h3>
              </div>

              {/* Subscription Status Card */}
              <Card className="p-4 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Seu Plano</h4>
                  <Badge className={`${
                    isSubscribed 
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {planName}
                  </Badge>
                </div>
                
                {isSubscribed ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      Status: <span className="text-green-400 font-medium">Ativo</span>
                    </p>
                    <p>
                      Renova em: <span className="text-foreground">{formatDate(subscription.current_period_end)}</span>
                    </p>
                    {subscription.cancel_at_period_end && (
                      <p className="text-yellow-400 flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Cancela no final do período
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Você está no plano gratuito. Faça upgrade para desbloquear mais recursos.
                  </p>
                )}
              </Card>
              
              {/* Credits Info */}
              <UserCreditsCard onUpgrade={() => {
                onOpenChange(false);
                onUpgrade?.();
              }} />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => {
                    onOpenChange(false);
                    onUpgrade?.();
                  }} 
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
                >
                  <Crown size={16} className="mr-2" />
                  Ver Planos
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => openPortal()} 
                  className="flex-1"
                  disabled={isOpeningPortal}
                >
                  <ExternalLink size={16} className="mr-2" />
                  {isOpeningPortal ? 'Abrindo...' : 'Gerenciar Assinatura'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};