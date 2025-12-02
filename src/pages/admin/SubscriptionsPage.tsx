import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Save, ExternalLink, Copy, Check, Users, CreditCard, Settings, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('plans');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Assinaturas</h1>
          <p className="text-muted-foreground mt-1">Configure planos, preços e integração com Stripe</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Package className="h-4 w-4" /> Planos
            </TabsTrigger>
            <TabsTrigger value="prices" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Preços Stripe
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Assinantes
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans"><PlansTab /></TabsContent>
          <TabsContent value="prices"><PricesTab /></TabsContent>
          <TabsContent value="subscribers"><SubscribersTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function PlansTab() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['admin-subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase.from('subscription_plans').select('*').order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (plan: any) => {
      const { error } = await supabase.from('subscription_plans').update(plan).eq('id', plan.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plans'] });
      setEditingPlan(null);
      toast.success('Plano atualizado!');
    },
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos de Assinatura</CardTitle>
        <CardDescription>Gerencie os planos e suas features</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plano</TableHead>
              <TableHead>Tokens/mês</TableHead>
              <TableHead>Whisper/mês</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan: any) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-xs text-muted-foreground">{plan.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {editingPlan?.id === plan.id ? (
                    <Input type="number" value={editingPlan.ai_tokens_monthly} onChange={(e) => setEditingPlan({ ...editingPlan, ai_tokens_monthly: parseInt(e.target.value) })} className="w-24" />
                  ) : plan.ai_tokens_monthly.toLocaleString()}
                </TableCell>
                <TableCell>
                  {editingPlan?.id === plan.id ? (
                    <Input type="number" value={editingPlan.whisper_credits_monthly} onChange={(e) => setEditingPlan({ ...editingPlan, whisper_credits_monthly: parseInt(e.target.value) })} className="w-24" />
                  ) : plan.whisper_credits_monthly}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {plan.feature_ai_conclusion && <Badge variant="outline" className="text-xs">Conclusão</Badge>}
                    {plan.feature_ai_rads && <Badge variant="outline" className="text-xs">RADS</Badge>}
                    {plan.feature_whisper && <Badge variant="outline" className="text-xs">Whisper</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch checked={plan.is_active} onCheckedChange={(checked) => updatePlanMutation.mutate({ id: plan.id, is_active: checked })} />
                </TableCell>
                <TableCell>
                  {editingPlan?.id === plan.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updatePlanMutation.mutate(editingPlan)}><Save className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingPlan(null)}>Cancelar</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditingPlan(plan)}>Editar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PricesTab() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stripeIds, setStripeIds] = useState({ price_id: '', product_id: '' });

  const { data: prices, isLoading } = useQuery({
    queryKey: ['admin-subscription-prices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('subscription_prices').select(`*, plan:subscription_plans(name, code)`).order('amount_cents');
      if (error) throw error;
      return data;
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, stripe_price_id, stripe_product_id }: any) => {
      const { error } = await supabase.from('subscription_prices').update({ stripe_price_id, stripe_product_id }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-prices'] });
      toast.success('IDs Stripe atualizados!');
    },
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços e IDs do Stripe</CardTitle>
        <CardDescription>
          Configure os IDs do Stripe.{' '}
          <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
            Abrir Stripe Dashboard <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plano</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Stripe Product ID</TableHead>
              <TableHead>Stripe Price ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices?.map((price: any) => (
              <TableRow key={price.id}>
                <TableCell><span className="font-medium">{price.plan?.name}</span></TableCell>
                <TableCell><span className="font-mono">R$ {(price.amount_cents / 100).toFixed(2)}/{price.interval === 'month' ? 'mês' : 'ano'}</span></TableCell>
                <TableCell>
                  {editingId === price.id ? (
                    <Input value={stripeIds.product_id} onChange={(e) => setStripeIds({ ...stripeIds, product_id: e.target.value })} placeholder="prod_xxx" className="w-48 font-mono text-xs" />
                  ) : <code className="text-xs bg-muted px-2 py-1 rounded">{price.stripe_product_id || '—'}</code>}
                </TableCell>
                <TableCell>
                  {editingId === price.id ? (
                    <Input value={stripeIds.price_id} onChange={(e) => setStripeIds({ ...stripeIds, price_id: e.target.value })} placeholder="price_xxx" className="w-48 font-mono text-xs" />
                  ) : <code className="text-xs bg-muted px-2 py-1 rounded">{price.stripe_price_id || '—'}</code>}
                </TableCell>
                <TableCell>
                  {price.stripe_price_id ? <Badge variant="default" className="bg-green-500">Configurado</Badge> : <Badge variant="destructive">Pendente</Badge>}
                </TableCell>
                <TableCell>
                  {editingId === price.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { updatePriceMutation.mutate({ id: price.id, stripe_price_id: stripeIds.price_id, stripe_product_id: stripeIds.product_id }); setEditingId(null); }}><Save className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(price.id); setStripeIds({ price_id: price.stripe_price_id || '', product_id: price.stripe_product_id || '' }); }}>Editar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SubscribersTab() {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_subscriptions').select(`*, plan:subscription_plans(name, code)`).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Assinantes</CardTitle>
        <CardDescription>Usuários com assinaturas ativas ou canceladas</CardDescription>
      </CardHeader>
      <CardContent>
        {!subscribers?.length ? (
          <div className="text-center py-8 text-muted-foreground">Nenhum assinante encontrado</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell><code className="text-xs">{sub.user_id.slice(0, 8)}...</code></TableCell>
                  <TableCell><Badge variant="outline">{sub.plan?.name || 'N/A'}</Badge></TableCell>
                  <TableCell><Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>{sub.status}</Badge></TableCell>
                  <TableCell><span className="text-sm">{new Date(sub.current_period_start).toLocaleDateString('pt-BR')} - {new Date(sub.current_period_end).toLocaleDateString('pt-BR')}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-stripe-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stripe_settings' as any).select('*');
      if (error) throw error;
      const settingsMap: Record<string, any> = {};
      (data as any[])?.forEach((item) => { settingsMap[item.setting_key] = item; });
      return settingsMap;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase.from('stripe_settings' as any).update({ setting_value: value }).eq('setting_key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stripe-settings'] });
      toast.success('Configuração salva!');
    },
  });

  const webhookUrl = `https://gxhbdbovixbptrjrcwbr.supabase.co/functions/v1/stripe-webhook`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copiada!');
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const isTestMode = settings?.mode?.setting_value === 'test';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Modo do Stripe</CardTitle>
          <CardDescription>Alterne entre ambiente de teste e produção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base">Modo Atual</Label>
              <p className="text-sm text-muted-foreground">{isTestMode ? 'Usando chaves de TESTE' : 'Usando chaves de PRODUÇÃO'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isTestMode ? 'secondary' : 'default'} className={isTestMode ? '' : 'bg-green-500'}>{isTestMode ? '🧪 Teste' : '🚀 Produção'}</Badge>
              <Switch checked={!isTestMode} onCheckedChange={(checked) => updateSettingMutation.mutate({ key: 'mode', value: checked ? 'live' : 'test' })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chaves Públicas</CardTitle>
          <CardDescription>Chaves usadas no frontend para inicializar o Stripe.js</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chave Pública de Teste (pk_test_xxx)</Label>
            <Input defaultValue={settings?.test_publishable_key?.setting_value || ''} placeholder="pk_test_..." className="font-mono text-sm" onBlur={(e) => updateSettingMutation.mutate({ key: 'test_publishable_key', value: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Chave Pública de Produção (pk_live_xxx)</Label>
            <Input defaultValue={settings?.live_publishable_key?.setting_value || ''} placeholder="pk_live_..." className="font-mono text-sm" onBlur={(e) => updateSettingMutation.mutate({ key: 'live_publishable_key', value: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Webhook</CardTitle>
          <CardDescription>
            Configure no <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe Dashboard</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL do Webhook</Label>
            <div className="flex gap-2">
              <Input value={webhookUrl} readOnly className="font-mono text-sm bg-muted" />
              <Button variant="outline" onClick={copyWebhookUrl}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-muted/50">
            <Label className="text-sm font-medium">Eventos para configurar:</Label>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              <li>• checkout.session.completed</li>
              <li>• customer.subscription.created/updated/deleted</li>
              <li>• invoice.paid, invoice.payment_failed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chaves Secretas</CardTitle>
          <CardDescription>Gerenciadas nos Secrets do Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
            <p className="text-sm"><strong>STRIPE_SECRET_KEY</strong> - Já configurado ✅</p>
            <p className="text-sm text-muted-foreground"><strong>STRIPE_WEBHOOK_SECRET</strong> - Configurar após criar webhook</p>
            <Button variant="outline" size="sm" asChild className="mt-2">
              <a href="https://supabase.com/dashboard/project/gxhbdbovixbptrjrcwbr/settings/functions" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> Gerenciar Secrets
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
