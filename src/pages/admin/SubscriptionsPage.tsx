import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { invokeEdgeFunction, EdgeFunctionError, AuthenticationError } from '@/services/edgeFunctionClient';
import { AdminLayout } from '@/components/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CreditCard, Settings, Users, Package, Edit, Save, X, 
  FlaskConical, Rocket, CheckCircle2, AlertCircle, Activity, 
  Wifi, ExternalLink, Copy, Check, RefreshCw, Loader2, Link2, Unlink
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  ai_tokens_monthly: number;
  whisper_credits_monthly: number;
  max_user_templates: number;
  max_user_frases: number;
  is_active: boolean;
  display_order: number;
}

interface SubscriptionPrice {
  id: string;
  plan_id: string;
  interval: string;
  interval_count: number;
  amount_cents: number;
  amount_cents_annual: number | null;
  currency: string;
  stripe_price_id: string | null;
  stripe_price_id_test: string | null;
  stripe_price_id_live: string | null;
  stripe_product_id_test: string | null;
  stripe_product_id_live: string | null;
  stripe_price_id_annual_test: string | null;
  stripe_price_id_annual_live: string | null;
  is_active: boolean;
  subscription_plans?: SubscriptionPlan;
}

interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  subscription_plans?: SubscriptionPlan;
}

interface StripeSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
}

interface EditingPrice {
  id: string;
  plan_name: string;
  // Test environment
  stripe_product_id_test: string;
  stripe_price_id_test: string;
  stripe_price_id_annual_test: string;
  // Live environment
  stripe_product_id_live: string;
  stripe_price_id_live: string;
  stripe_price_id_annual_live: string;
  // Annual price value in cents (captured from Stripe)
  amount_cents_annual: number | null;
}

// Stripe API types
interface StripeProductPrice {
  id: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year' | 'one_time';
  interval_count: number;
  nickname: string | null;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  prices: StripeProductPrice[];
}

// Mapeamento local de produto Stripe para plano local (usado na UI dinâmica)
interface ProductPlanMapping {
  stripeProductId: string;
  localPlanId: string;
}

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('settings');
  const [editingPrice, setEditingPrice] = useState<EditingPrice | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  
  // Environment view state for prices tab
  const [pricesViewEnv, setPricesViewEnv] = useState<'test' | 'live'>('live');
  
  // Stripe products state - separate for each environment
  const [stripeProductsTest, setStripeProductsTest] = useState<StripeProduct[]>([]);
  const [stripeProductsLive, setStripeProductsLive] = useState<StripeProduct[]>([]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingLive, setLoadingLive] = useState(false);
  
  // Mapeamentos locais para UI dinâmica - separados por ambiente
  const [productMappingsTest, setProductMappingsTest] = useState<Record<string, string>>({});
  const [productMappingsLive, setProductMappingsLive] = useState<Record<string, string>>({});
  const [savingMapping, setSavingMapping] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  // Fetch plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as SubscriptionPlan[];
    }
  });

  // Fetch prices with plans
  const { data: prices = [], isLoading: pricesLoading } = useQuery({
    queryKey: ['subscription-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_prices')
        .select('*, subscription_plans(*)')
        .order('amount_cents');
      if (error) throw error;
      return data as SubscriptionPrice[];
    }
  });

  // Fetch user subscriptions
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['user-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as UserSubscription[];
    }
  });

  // Fetch stripe settings
  const { data: stripeSettings = [], isLoading: settingsLoading, refetch: refetchSettings } = useQuery({
    queryKey: ['stripe-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_settings')
        .select('*');
      if (error) throw error;
      return data as StripeSetting[];
    }
  });

  // Get setting value helper
  const getSettingValue = (key: string): string => {
    const setting = stripeSettings.find(s => s.setting_key === key);
    return setting?.setting_value || '';
  };

  const isTestMode = getSettingValue('environment_mode') === 'test';

  // Fetch Stripe products for specific environment using direct fetch (no x-application-name header)
  const fetchStripeProducts = async (env: 'test' | 'live') => {
    const setLoading = env === 'test' ? setLoadingTest : setLoadingLive;
    const setProducts = env === 'test' ? setStripeProductsTest : setStripeProductsLive;
    
    setLoading(true);
    try {
      const data = await invokeEdgeFunction<{ products: StripeProduct[]; count: number; environment: string }>(
        'stripe-list-products',
        { environment: env }
      );
      
      setProducts(data.products || []);
      toast.success(`${data.count || 0} produtos ${env.toUpperCase()} sincronizados`);
    } catch (err: any) {
      console.error(`Error fetching Stripe ${env} products:`, err);
      
      // Specific error messages
      if (err instanceof AuthenticationError) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (err instanceof EdgeFunctionError) {
        toast.error(`Erro ao buscar produtos ${env}: ${err.message}`);
      } else {
        toast.error(`Erro ao buscar produtos ${env}: ${err.message || 'Erro desconhecido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('stripe_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-settings'] });
      toast.success('Configuração atualizada');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  });

  // Update price mutation - saves all fields including amount_cents_annual
  const updatePriceMutation = useMutation({
    mutationFn: async (data: EditingPrice) => {
      const { error } = await supabase
        .from('subscription_prices')
        .update({ 
          stripe_product_id_test: data.stripe_product_id_test || null,
          stripe_product_id_live: data.stripe_product_id_live || null,
          stripe_price_id_test: data.stripe_price_id_test || null,
          stripe_price_id_live: data.stripe_price_id_live || null,
          stripe_price_id_annual_test: data.stripe_price_id_annual_test || null,
          stripe_price_id_annual_live: data.stripe_price_id_annual_live || null,
          amount_cents_annual: data.amount_cents_annual,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-prices'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast.success('Mapeamento Stripe atualizado');
      setEditingPrice(null);
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  });

  // Mutation to update plan limits
  const updatePlanMutation = useMutation({
    mutationFn: async (data: SubscriptionPlan) => {
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          ai_tokens_monthly: data.ai_tokens_monthly,
          whisper_credits_monthly: data.whisper_credits_monthly,
          max_user_templates: data.max_user_templates,
          max_user_frases: data.max_user_frases,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      queryClient.invalidateQueries({ queryKey: ['platform-metrics'] });
      toast.success('Plano atualizado com sucesso');
      setEditingPlan(null);
    },
    onError: (error) => {
      toast.error('Erro ao atualizar plano: ' + error.message);
    }
  });

  // Toggle environment mode
  const handleToggleEnvironment = () => {
    const newMode = isTestMode ? 'live' : 'test';
    updateSettingMutation.mutate({ key: 'environment_mode', value: newMode });
  };

  // Auto-sync ao abrir aba de preços (carrega ambiente selecionado)
  useEffect(() => {
    if (activeTab === 'prices') {
      if (pricesViewEnv === 'live' && stripeProductsLive.length === 0 && !loadingLive) {
        fetchStripeProducts('live');
      } else if (pricesViewEnv === 'test' && stripeProductsTest.length === 0 && !loadingTest) {
        fetchStripeProducts('test');
      }
    }
  }, [activeTab, pricesViewEnv]);

  // Inicializar mapeamentos LIVE quando produtos e preços carregam
  useEffect(() => {
    if (stripeProductsLive.length > 0 && prices.length > 0) {
      const mappings: Record<string, string> = {};
      prices.forEach(price => {
        if (price.stripe_product_id_live && price.plan_id) {
          mappings[price.stripe_product_id_live] = price.plan_id;
        }
      });
      setProductMappingsLive(mappings);
    }
  }, [stripeProductsLive, prices]);

  // Inicializar mapeamentos TEST quando produtos e preços carregam
  useEffect(() => {
    if (stripeProductsTest.length > 0 && prices.length > 0) {
      const mappings: Record<string, string> = {};
      prices.forEach(price => {
        if (price.stripe_product_id_test && price.plan_id) {
          mappings[price.stripe_product_id_test] = price.plan_id;
        }
      });
      setProductMappingsTest(mappings);
    }
  }, [stripeProductsTest, prices]);

  // Salvar mapeamento de produto Stripe para plano local com captura automática de valores
  const saveProductMapping = async (stripeProduct: StripeProduct, localPlanId: string, env: 'test' | 'live') => {
    setSavingMapping(stripeProduct.id);
    try {
      const monthlyPrice = stripeProduct.prices.find(p => p.interval === 'month');
      const yearlyPrice = stripeProduct.prices.find(p => p.interval === 'year');
      
      // Encontrar o registro de preço existente para este plano
      const existingPrice = prices.find(p => p.plan_id === localPlanId);
      if (!existingPrice) {
        toast.error('Registro de preço não encontrado para este plano');
        return;
      }

      // Campos dinâmicos baseados no ambiente
      const productIdField = env === 'test' ? 'stripe_product_id_test' : 'stripe_product_id_live';
      const priceIdField = env === 'test' ? 'stripe_price_id_test' : 'stripe_price_id_live';
      const annualPriceIdField = env === 'test' ? 'stripe_price_id_annual_test' : 'stripe_price_id_annual_live';

      // Build update object - sempre salva IDs do Stripe
      const updateData: Record<string, any> = {
        [productIdField]: stripeProduct.id,
        [priceIdField]: monthlyPrice?.id || null,
        [annualPriceIdField]: yearlyPrice?.id || null,
      };

      // APENAS atualiza amount_cents e amount_cents_annual se for LIVE (valores de produção)
      if (env === 'live') {
        updateData.amount_cents = monthlyPrice?.amount || existingPrice.amount_cents;
        updateData.amount_cents_annual = yearlyPrice?.amount || null;
      }

      const { error } = await supabase
        .from('subscription_prices')
        .update(updateData)
        .eq('id', existingPrice.id);

      if (error) throw error;

      // Atualizar mapeamento local correto
      if (env === 'test') {
        setProductMappingsTest(prev => ({ ...prev, [stripeProduct.id]: localPlanId }));
      } else {
        setProductMappingsLive(prev => ({ ...prev, [stripeProduct.id]: localPlanId }));
      }
      
      queryClient.invalidateQueries({ queryKey: ['subscription-prices'] });
      toast.success(`Mapeamento ${env.toUpperCase()} salvo: ${stripeProduct.name} → ${plans.find(p => p.id === localPlanId)?.name}`);
    } catch (error: any) {
      toast.error('Erro ao salvar mapeamento: ' + error.message);
    } finally {
      setSavingMapping(null);
    }
  };

  // Sincronizar todos os valores do Stripe para o banco local (apenas LIVE atualiza valores)
  const syncAllPricesFromStripe = async (env: 'test' | 'live') => {
    setSyncingAll(true);
    let updated = 0;
    const products = env === 'test' ? stripeProductsTest : stripeProductsLive;
    const productIdField = env === 'test' ? 'stripe_product_id_test' : 'stripe_product_id_live';
    
    try {
      for (const price of prices) {
        const productId = env === 'test' ? price.stripe_product_id_test : price.stripe_product_id_live;
        const product = products.find(p => p.id === productId);
        if (product) {
          const monthlyPrice = product.prices.find(p => p.interval === 'month');
          const yearlyPrice = product.prices.find(p => p.interval === 'year');
          
          // Build update - só atualiza valores monetários se for LIVE
          const updateData: Record<string, any> = {};
          if (env === 'live') {
            updateData.amount_cents = monthlyPrice?.amount || price.amount_cents;
            updateData.amount_cents_annual = yearlyPrice?.amount || null;
          }
          
          // Se não há nada para atualizar (TEST sem valores), pula
          if (Object.keys(updateData).length === 0) {
            updated++;
            continue;
          }
          
          const { error } = await supabase
            .from('subscription_prices')
            .update(updateData)
            .eq('id', price.id);
          
          if (!error) updated++;
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['subscription-prices'] });
      toast.success(`${updated} preços ${env.toUpperCase()} sincronizados!`);
    } catch (error: any) {
      toast.error('Erro ao sincronizar: ' + error.message);
    } finally {
      setSyncingAll(false);
    }
  };

  // Helpers para obter mapeamentos do ambiente atual
  const getCurrentMappings = () => pricesViewEnv === 'test' ? productMappingsTest : productMappingsLive;
  const setCurrentMappings = (fn: (prev: Record<string, string>) => Record<string, string>) => {
    if (pricesViewEnv === 'test') {
      setProductMappingsTest(fn);
    } else {
      setProductMappingsLive(fn);
    }
  };

  // Obter plano mapeado para um produto Stripe (usa ambiente atual)
  const getMappedPlanForProduct = (stripeProductId: string): SubscriptionPlan | undefined => {
    const mappings = getCurrentMappings();
    const planId = mappings[stripeProductId];
    return plans.find(p => p.id === planId);
  };

  // Verificar se produto está mapeado (usa ambiente atual)
  const isProductMapped = (stripeProductId: string): boolean => {
    const mappings = getCurrentMappings();
    return !!mappings[stripeProductId];
  };

  // Dados dinâmicos baseados no ambiente selecionado
  const currentProducts = pricesViewEnv === 'test' ? stripeProductsTest : stripeProductsLive;
  const currentLoading = pricesViewEnv === 'test' ? loadingTest : loadingLive;
  const currentProductIdField = pricesViewEnv === 'test' ? 'stripe_product_id_test' : 'stripe_product_id_live';

  // Calculate system status
  const calculateSystemStatus = () => {
    const checks = [
      { key: 'stripe_configured', label: 'Stripe Secret Key configurada', done: true },
      { key: 'webhook_configured', label: 'Webhook URL configurado', done: !!getSettingValue('webhook_url') },
      { key: 'test_prices', label: 'Preços de teste mapeados', done: prices.some(p => p.stripe_product_id_test && p.stripe_price_id_test) },
      { key: 'live_prices', label: 'Preços de produção mapeados', done: prices.some(p => p.stripe_product_id_live && p.stripe_price_id_live) },
    ];
    const doneCount = checks.filter(c => c.done).length;
    const progress = Math.round((doneCount / checks.length) * 100);
    return { checks, progress, doneCount, total: checks.length };
  };

  const systemStatus = calculateSystemStatus();

  // Metrics - check both product and price
  const activeSubscribers = subscriptions.filter(s => s.status === 'active').length;
  const testPricesMapped = prices.filter(p => p.stripe_product_id_test && p.stripe_price_id_test).length;
  const livePricesMapped = prices.filter(p => p.stripe_product_id_live && p.stripe_price_id_live).length;

  // Webhook URL
  const webhookUrl = `https://gxhbdbovixbptrjrcwbr.supabase.co/functions/v1/stripe-webhook`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    toast.success('URL copiada');
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatStripeCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Ativo</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pendente</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriceMappingStatus = (price: SubscriptionPrice) => {
    const testComplete = !!price.stripe_product_id_test && !!price.stripe_price_id_test;
    const liveComplete = !!price.stripe_product_id_live && !!price.stripe_price_id_live;
    
    if (testComplete && liveComplete) {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completo</Badge>;
    } else if (testComplete || liveComplete) {
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Parcial</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  // Truncate ID for display
  const truncateId = (id: string | null, length = 15) => {
    if (!id) return null;
    return id.length > length ? `${id.substring(0, length)}...` : id;
  };

  // Get prices for selected product filtered by interval (uses environment-specific products)
  const getPricesForProduct = (productId: string, interval: 'month' | 'year', env: 'test' | 'live') => {
    const products = env === 'test' ? stripeProductsTest : stripeProductsLive;
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    return product.prices.filter(p => p.interval === interval);
  };

  // Render environment section with Selects
  const renderEnvironmentSection = (
    envType: 'test' | 'live',
    icon: React.ReactNode,
    label: string,
    colorClass: string
  ) => {
    if (!editingPrice) return null;

    const productIdField = envType === 'test' ? 'stripe_product_id_test' : 'stripe_product_id_live';
    const priceIdField = envType === 'test' ? 'stripe_price_id_test' : 'stripe_price_id_live';
    const annualPriceIdField = envType === 'test' ? 'stripe_price_id_annual_test' : 'stripe_price_id_annual_live';
    
    const selectedProductId = editingPrice[productIdField];
    const products = envType === 'test' ? stripeProductsTest : stripeProductsLive;
    const loading = envType === 'test' ? loadingTest : loadingLive;
    const monthlyPrices = selectedProductId ? getPricesForProduct(selectedProductId, 'month', envType) : [];
    const yearlyPrices = selectedProductId ? getPricesForProduct(selectedProductId, 'year', envType) : [];

    const hasProducts = products.length > 0;

    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            {icon}
            <Label className={`font-medium ${colorClass}`}>{label}</Label>
            <Badge variant="outline" className="text-xs">
              {products.length} produtos
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchStripeProducts(envType)}
            disabled={loading}
            className="h-7 text-xs"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Sincronizar
          </Button>
        </div>
        
        <div className="grid gap-4">
          {/* Product Select */}
          <div className="space-y-2">
            <Label>Produto</Label>
            {hasProducts ? (
              <Select 
                value={editingPrice[productIdField] || undefined}
                onValueChange={(v) => setEditingPrice({ 
                  ...editingPrice, 
                  [productIdField]: v,
                  // Clear prices when product changes
                  [priceIdField]: '',
                  [annualPriceIdField]: ''
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.id}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                value={editingPrice[productIdField]}
                onChange={(e) => setEditingPrice({ ...editingPrice, [productIdField]: e.target.value })}
                placeholder={`prod_${envType}_xxx`}
                className="font-mono text-sm"
              />
            )}
          </div>
          
          {/* Monthly Price Select */}
          <div className="space-y-2">
            <Label>Preço Mensal</Label>
            {hasProducts && selectedProductId ? (
              <Select 
                value={editingPrice[priceIdField] || undefined}
                onValueChange={(v) => setEditingPrice({ ...editingPrice, [priceIdField]: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um preço mensal..." />
                </SelectTrigger>
                <SelectContent>
                  {monthlyPrices.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nenhum preço mensal encontrado
                    </div>
                  ) : (
                    monthlyPrices.map(price => (
                      <SelectItem key={price.id} value={price.id}>
                        <div className="flex items-center gap-2">
                          <span>{formatStripeCurrency(price.amount, price.currency)}/mês</span>
                          {price.nickname && (
                            <span className="text-xs text-muted-foreground">({price.nickname})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                value={editingPrice[priceIdField]}
                onChange={(e) => setEditingPrice({ ...editingPrice, [priceIdField]: e.target.value })}
                placeholder={`price_${envType}_monthly_xxx`}
                className="font-mono text-sm"
              />
            )}
          </div>
          
          {/* Annual Price Select */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              Preço Anual <span className="text-xs">(opcional)</span>
            </Label>
            {hasProducts && selectedProductId ? (
              <Select 
                value={editingPrice[annualPriceIdField] || '__none__'}
                onValueChange={(v) => {
                  const selectedPrice = yearlyPrices.find(p => p.id === v);
                  setEditingPrice({ 
                    ...editingPrice, 
                    [annualPriceIdField]: v === '__none__' ? '' : v,
                    // Capture annual price amount when selecting from LIVE environment
                    ...(envType === 'live' && selectedPrice ? { amount_cents_annual: selectedPrice.amount } : {})
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um preço anual..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {yearlyPrices.map(price => (
                    <SelectItem key={price.id} value={price.id}>
                      <div className="flex items-center gap-2">
                        <span>{formatStripeCurrency(price.amount, price.currency)}/ano</span>
                        {price.nickname && (
                          <span className="text-xs text-muted-foreground">({price.nickname})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                value={editingPrice[annualPriceIdField]}
                onChange={(e) => setEditingPrice({ ...editingPrice, [annualPriceIdField]: e.target.value })}
                placeholder={`price_${envType}_yearly_xxx`}
                className="font-mono text-sm"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Assinaturas</h1>
          <p className="text-muted-foreground">Gerencie planos, preços e assinantes do Stripe</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="plans" className="gap-2">
              <Package className="h-4 w-4" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="prices" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Preços Stripe
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2">
              <Users className="h-4 w-4" />
              Assinantes
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Environment Toggle Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ambiente do Stripe</CardTitle>
                <CardDescription>Alterne entre modo de teste e produção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    {isTestMode ? (
                      <FlaskConical className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Rocket className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <Label className="text-base font-medium">Modo Atual</Label>
                      <p className="text-sm text-muted-foreground">
                        {isTestMode 
                          ? 'Usando chaves de teste - nenhuma cobrança real' 
                          : 'Usando chaves de produção - cobranças reais'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={isTestMode ? 'secondary' : 'default'} className={!isTestMode ? 'bg-green-500' : ''}>
                      {isTestMode ? 'Teste' : 'Produção'}
                    </Badge>
                    <Switch 
                      checked={!isTestMode} 
                      onCheckedChange={handleToggleEnvironment}
                      disabled={updateSettingMutation.isPending}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Status do Sistema
                </CardTitle>
                <CardDescription>Progresso da configuração do Stripe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Configuração</span>
                    <span className="font-medium">{systemStatus.progress}%</span>
                  </div>
                  <Progress value={systemStatus.progress} className="h-2" />
                </div>
                <div className="space-y-2">
                  {systemStatus.checks.map(item => (
                    <div key={item.key} className="flex items-center gap-2 text-sm">
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className={item.done ? 'text-muted-foreground' : ''}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Status Conexão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">Configurado</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Modo: {isTestMode ? 'Teste' : 'Produção'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Preços Mapeados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold">
                      {isTestMode ? testPricesMapped : livePricesMapped}/{prices.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isTestMode ? 'Ambiente de teste' : 'Ambiente de produção'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Assinantes Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-2xl font-bold">{activeSubscribers}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total: {subscriptions.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Webhook URL Card */}
            <Card>
              <CardHeader>
                <CardTitle>Webhook URL</CardTitle>
                <CardDescription>Configure este URL no Stripe Dashboard para receber eventos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input 
                    value={webhookUrl} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
                    {copiedWebhook ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://dashboard.stripe.com/test/webhooks" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Webhooks (Teste)
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://dashboard.stripe.com/webhooks" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Webhooks (Produção)
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Eventos recomendados: checkout.session.completed, customer.subscription.updated, 
                  customer.subscription.deleted, invoice.paid, invoice.payment_failed
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planos de Assinatura</CardTitle>
                <CardDescription>Planos disponíveis no sistema com limites configuráveis</CardDescription>
              </CardHeader>
              <CardContent>
                {plansLoading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-center">Tokens AI</TableHead>
                        <TableHead className="text-center">Whisper</TableHead>
                        <TableHead className="text-center">Templates</TableHead>
                        <TableHead className="text-center">Frases</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map(plan => (
                        <TableRow key={plan.id}>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{plan.code}</code>
                          </TableCell>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell className="text-center">{plan.ai_tokens_monthly.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{plan.whisper_credits_monthly}</TableCell>
                          <TableCell className="text-center">
                            {plan.max_user_templates >= 9999 ? '∞' : plan.max_user_templates}
                          </TableCell>
                          <TableCell className="text-center">
                            {plan.max_user_frases >= 9999 ? '∞' : plan.max_user_frases}
                          </TableCell>
                          <TableCell>
                            <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                              {plan.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingPlan(plan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prices Tab - Dynamic Stripe Products with TEST/LIVE Toggle */}
          <TabsContent value="prices" className="space-y-4">
            {/* Environment Control Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground mr-2">Visualizar:</Label>
                    <div className="flex rounded-lg border overflow-hidden">
                      <Button
                        variant={pricesViewEnv === 'test' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPricesViewEnv('test')}
                        className={`rounded-none gap-1.5 ${pricesViewEnv === 'test' ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                      >
                        <FlaskConical className="h-4 w-4" />
                        TEST
                      </Button>
                      <Button
                        variant={pricesViewEnv === 'live' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPricesViewEnv('live')}
                        className={`rounded-none gap-1.5 ${pricesViewEnv === 'live' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        <Rocket className="h-4 w-4" />
                        LIVE
                      </Button>
                    </div>
                  </div>

                  {/* Active Environment Status */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Sistema Ativo:</span>
                      {isTestMode ? (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1">
                          <FlaskConical className="h-3 w-3" />
                          TEST
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                          <Rocket className="h-3 w-3" />
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant={isTestMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSettingMutation.mutate({ key: 'environment_mode', value: 'test' })}
                        disabled={isTestMode || updateSettingMutation.isPending}
                        className={`gap-1 ${isTestMode ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                      >
                        <FlaskConical className="h-3 w-3" />
                        Ativar TEST
                      </Button>
                      <Button
                        variant={!isTestMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSettingMutation.mutate({ key: 'environment_mode', value: 'live' })}
                        disabled={!isTestMode || updateSettingMutation.isPending}
                        className={`gap-1 ${!isTestMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        <Rocket className="h-3 w-3" />
                        Ativar LIVE
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pricesViewEnv === 'test' ? (
                      <FlaskConical className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Rocket className="h-5 w-5 text-green-500" />
                    )}
                    Produtos Stripe ({pricesViewEnv.toUpperCase()})
                  </CardTitle>
                  <CardDescription>
                    {pricesViewEnv === 'test' 
                      ? 'Ambiente de TESTE - Use para validar a integração antes de ir para produção.'
                      : 'Ambiente de PRODUÇÃO - Valores reais de cobrança.'
                    }
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchStripeProducts(pricesViewEnv)}
                    disabled={currentLoading}
                    className="gap-1.5"
                  >
                    {currentLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    Sincronizar {pricesViewEnv.toUpperCase()} ({currentProducts.length})
                  </Button>
                  {pricesViewEnv === 'live' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => syncAllPricesFromStripe('live')}
                      disabled={syncingAll || currentProducts.length === 0}
                      className="gap-1.5"
                    >
                      {syncingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                      Sincronizar Valores
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Carregando produtos do Stripe ({pricesViewEnv.toUpperCase()})...</span>
                  </div>
                ) : currentProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum produto encontrado no Stripe ({pricesViewEnv.toUpperCase()})</p>
                    <p className="text-sm">Clique em "Sincronizar" para buscar produtos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentProducts.map((product) => {
                      const monthlyPrice = product.prices.find(p => p.interval === 'month');
                      const yearlyPrice = product.prices.find(p => p.interval === 'year');
                      const mappedPlan = getMappedPlanForProduct(product.id);
                      const isMapped = isProductMapped(product.id);
                      const localPrice = prices.find(p => 
                        pricesViewEnv === 'test' 
                          ? p.stripe_product_id_test === product.id
                          : p.stripe_product_id_live === product.id
                      );
                      const currentMappings = getCurrentMappings();

                      return (
                        <div 
                          key={product.id} 
                          className={`border rounded-lg p-4 transition-colors ${
                            isMapped 
                              ? pricesViewEnv === 'test'
                                ? 'bg-amber-500/5 border-amber-500/30'
                                : 'bg-green-500/5 border-green-500/30' 
                              : 'bg-muted/30 border-border'
                          }`}
                        >
                          {/* Product Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                isMapped 
                                  ? pricesViewEnv === 'test' ? 'bg-amber-500/10' : 'bg-green-500/10' 
                                  : 'bg-muted'
                              }`}>
                                <Package className={`h-5 w-5 ${
                                  isMapped 
                                    ? pricesViewEnv === 'test' ? 'text-amber-500' : 'text-green-500'
                                    : 'text-muted-foreground'
                                }`} />
                              </div>
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {product.name}
                                  {isMapped && <Link2 className={`h-3.5 w-3.5 ${pricesViewEnv === 'test' ? 'text-amber-500' : 'text-green-500'}`} />}
                                </h3>
                                <code className="text-xs text-muted-foreground">{product.id}</code>
                              </div>
                            </div>
                            {isMapped ? (
                              <Badge className={pricesViewEnv === 'test' 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                              }>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Mapeado ({pricesViewEnv.toUpperCase()})
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Unlink className="h-3 w-3 mr-1" />
                                Não mapeado
                              </Badge>
                            )}
                          </div>

                          {/* Prices Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Monthly Price */}
                            <div className="p-3 rounded-md bg-background border">
                              <Label className="text-xs text-muted-foreground">Preço Mensal</Label>
                              {monthlyPrice ? (
                                <div className="mt-1">
                                  <span className="text-lg font-bold">
                                    {formatStripeCurrency(monthlyPrice.amount, monthlyPrice.currency)}
                                  </span>
                                  <span className="text-muted-foreground">/mês</span>
                                  <code className="block text-xs text-muted-foreground mt-1">
                                    {monthlyPrice.id}
                                  </code>
                                  {pricesViewEnv === 'live' && localPrice && localPrice.amount_cents !== monthlyPrice.amount && (
                                    <p className="text-xs text-amber-500 mt-1">
                                      ⚠️ Local: {formatCurrency(localPrice.amount_cents / 100)}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-1">Não configurado</p>
                              )}
                            </div>

                            {/* Annual Price */}
                            <div className="p-3 rounded-md bg-background border">
                              <Label className="text-xs text-muted-foreground">Preço Anual</Label>
                              {yearlyPrice ? (
                                <div className="mt-1">
                                  <span className="text-lg font-bold">
                                    {formatStripeCurrency(yearlyPrice.amount, yearlyPrice.currency)}
                                  </span>
                                  <span className="text-muted-foreground">/ano</span>
                                  <code className="block text-xs text-muted-foreground mt-1">
                                    {yearlyPrice.id}
                                  </code>
                                  {pricesViewEnv === 'live' && localPrice && localPrice.amount_cents_annual !== yearlyPrice.amount && (
                                    <p className="text-xs text-amber-500 mt-1">
                                      ⚠️ Local: {localPrice.amount_cents_annual 
                                        ? formatCurrency(localPrice.amount_cents_annual / 100) 
                                        : 'NULL'}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-1">Não configurado</p>
                              )}
                            </div>
                          </div>

                          {/* Mapping Section */}
                          <div className="flex items-center gap-3 pt-3 border-t">
                            <Label className="text-sm whitespace-nowrap">Plano Local:</Label>
                            <Select 
                              value={currentMappings[product.id] || '__none__'}
                              onValueChange={(v) => {
                                const newValue = v === '__none__' ? '' : v;
                                setCurrentMappings(prev => ({
                                  ...prev,
                                  [product.id]: newValue
                                }));
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecione um plano..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">— Nenhum —</SelectItem>
                                {plans.filter(p => p.code !== 'free').map(plan => (
                                  <SelectItem key={plan.id} value={plan.id}>
                                    <div className="flex items-center gap-2">
                                      <span>{plan.name}</span>
                                      <code className="text-xs text-muted-foreground">({plan.code})</code>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => {
                                const planId = currentMappings[product.id];
                                if (planId) {
                                  saveProductMapping(product, planId, pricesViewEnv);
                                } else {
                                  toast.error('Selecione um plano para mapear');
                                }
                              }}
                              disabled={!currentMappings[product.id] || savingMapping === product.id}
                              className="gap-1.5"
                            >
                              {savingMapping === product.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Save className="h-3 w-3" />
                              )}
                              Salvar
                            </Button>
                          </div>

                          {/* Status Summary */}
                          {isMapped && localPrice && (
                            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                              <span className="font-medium">Mapeado para:</span> {mappedPlan?.name} • 
                              {pricesViewEnv === 'live' && (
                                <>
                                  <span className="ml-2">Mensal BD:</span> {formatCurrency(localPrice.amount_cents / 100)} • 
                                  <span className="ml-2">Anual BD:</span> {localPrice.amount_cents_annual 
                                    ? formatCurrency(localPrice.amount_cents_annual / 100) 
                                    : <span className="text-amber-500">NULL</span>
                                  }
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Resumo dos Mapeamentos ({pricesViewEnv.toUpperCase()})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plano Local</TableHead>
                      <TableHead>Preço Mensal (BD)</TableHead>
                      <TableHead>Preço Anual (BD)</TableHead>
                      <TableHead>Produto Stripe ({pricesViewEnv.toUpperCase()})</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prices.map(price => {
                      const productId = pricesViewEnv === 'test' ? price.stripe_product_id_test : price.stripe_product_id_live;
                      const stripeProduct = currentProducts.find(p => p.id === productId);
                      const monthlyMatch = stripeProduct?.prices.find(p => p.interval === 'month')?.amount === price.amount_cents;
                      const annualMatch = stripeProduct?.prices.find(p => p.interval === 'year')?.amount === price.amount_cents_annual;
                      
                      return (
                        <TableRow key={price.id}>
                          <TableCell className="font-medium">
                            {price.subscription_plans?.name || '—'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {formatCurrency(price.amount_cents / 100)}
                              {pricesViewEnv === 'live' && stripeProduct && (monthlyMatch ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {price.amount_cents_annual 
                                ? formatCurrency(price.amount_cents_annual / 100)
                                : <span className="text-muted-foreground">—</span>
                              }
                              {pricesViewEnv === 'live' && stripeProduct && price.amount_cents_annual && (annualMatch ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-amber-500" />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {productId ? (
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {truncateId(productId)}
                              </code>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>{getPriceMappingStatus(price)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assinantes</CardTitle>
                <CardDescription>Usuários com assinaturas ativas ou históricas</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptionsLoading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : subscriptions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum assinante encontrado</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Período Atual</TableHead>
                        <TableHead>Cancelamento</TableHead>
                        <TableHead>Criado em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map(sub => (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {sub.user_id.substring(0, 8)}...
                            </code>
                          </TableCell>
                          <TableCell className="font-medium">
                            {sub.subscription_plans?.name || '—'}
                          </TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell>
                            {formatDate(sub.current_period_start)} - {formatDate(sub.current_period_end)}
                          </TableCell>
                          <TableCell>
                            {sub.cancel_at_period_end ? (
                              <Badge variant="destructive">Sim</Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(sub.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Price Modal with Dynamic Selects */}
      <Dialog open={!!editingPrice} onOpenChange={(open) => !open && setEditingPrice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar IDs Stripe - {editingPrice?.plan_name}</DialogTitle>
            <DialogDescription>
              Configure os Product ID e Price ID para ambientes de teste e produção
            </DialogDescription>
          </DialogHeader>
          
          {editingPrice && (
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div className="text-sm text-muted-foreground">
                  Sincronize produtos Stripe em cada seção abaixo para seleção via dropdown
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    <FlaskConical className="h-3 w-3 mr-1" /> TEST: {stripeProductsTest.length}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Rocket className="h-3 w-3 mr-1" /> LIVE: {stripeProductsLive.length}
                  </Badge>
                </div>
              </div>

              {/* Test Environment */}
              {renderEnvironmentSection(
                'test',
                <FlaskConical className="h-4 w-4 text-amber-500" />,
                'Ambiente de Teste',
                'text-amber-600'
              )}

              {/* Live Environment */}
              {renderEnvironmentSection(
                'live',
                <Rocket className="h-4 w-4 text-green-500" />,
                'Ambiente de Produção',
                'text-green-600'
              )}

              <p className="text-xs text-muted-foreground">
                💡 Use os botões "Sincronizar" em cada seção para carregar produtos do ambiente correspondente.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPrice(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={() => editingPrice && updatePriceMutation.mutate(editingPrice)}
              disabled={updatePriceMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Mapeamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Plano: {editingPlan?.name}</DialogTitle>
            <DialogDescription>
              Configure os limites e créditos deste plano de assinatura
            </DialogDescription>
          </DialogHeader>
          
          {editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai_tokens">Tokens IA mensais</Label>
                  <Input
                    id="ai_tokens"
                    type="number"
                    value={editingPlan.ai_tokens_monthly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan,
                      ai_tokens_monthly: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whisper_credits">Créditos Whisper mensais</Label>
                  <Input
                    id="whisper_credits"
                    type="number"
                    value={editingPlan.whisper_credits_monthly}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan,
                      whisper_credits_monthly: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_templates">Templates personalizados</Label>
                  <Input
                    id="max_templates"
                    type="number"
                    value={editingPlan.max_user_templates}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan,
                      max_user_templates: parseInt(e.target.value) || 0
                    })}
                  />
                  <p className="text-xs text-muted-foreground">Use 9999 para ilimitado</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_frases">Frases personalizadas</Label>
                  <Input
                    id="max_frases"
                    type="number"
                    value={editingPlan.max_user_frases}
                    onChange={(e) => setEditingPlan({
                      ...editingPlan,
                      max_user_frases: parseInt(e.target.value) || 0
                    })}
                  />
                  <p className="text-xs text-muted-foreground">Use 9999 para ilimitado</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={() => editingPlan && updatePlanMutation.mutate(editingPlan)}
              disabled={updatePlanMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
