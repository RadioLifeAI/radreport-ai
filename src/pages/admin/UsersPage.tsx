import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  LayoutDashboard, 
  Shield, 
  Coins, 
  Activity,
  Search,
  UserPlus,
  TrendingUp,
  CreditCard,
  MoreVertical,
  Eye,
  Plus,
  Minus,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types
interface UserProfile {
  id: string;
  full_name: string | null;
  specialty?: string | null;
  crm?: string | null;
  institution?: string | null;
  created_at?: string | null;
}

interface UserWithDetails {
  id: string;
  full_name: string | null;
  specialty?: string | null;
  crm?: string | null;
  institution?: string | null;
  created_at?: string | null;
  email?: string;
  plan_type?: string;
  ai_balance?: number;
  whisper_balance?: number;
  role?: string;
  subscription_status?: string;
  monthly_limit?: number;
}

interface UserMetrics {
  total: number;
  active30Days: number;
  new7Days: number;
  paidSubscribers: number;
}

interface ActivityLog {
  id: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  feature_used: string;
  amount: number;
  description: string;
}

// ============= VISÃO GERAL TAB =============
function OverviewTab() {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Total users
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Active users (last 30 days) - based on ai_credits_ledger activity
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsers } = await supabase
        .from('ai_credits_ledger')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      const uniqueActiveUsers = new Set(activeUsers?.map(u => u.user_id) || []).size;

      // New users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: newCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Paid subscribers
      const { count: paidCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setMetrics({
        total: totalCount || 0,
        active30Days: uniqueActiveUsers,
        new7Days: newCount || 0,
        paidSubscribers: paidCount || 0
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    { label: 'Total de Usuários', value: metrics?.total || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Ativos (30 dias)', value: metrics?.active30Days || 0, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Novos (7 dias)', value: metrics?.new7Days || 0, icon: UserPlus, color: 'text-cyan-500' },
    { label: 'Assinantes Pagos', value: metrics?.paidSubscribers || 0, icon: CreditCard, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value.toLocaleString('pt-BR')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Sistema</CardTitle>
          <CardDescription>Visão geral da base de usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Taxa de Conversão</p>
              <p className="text-lg font-semibold">
                {metrics?.total ? ((metrics.paidSubscribers / metrics.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Taxa de Atividade</p>
              <p className="text-lg font-semibold">
                {metrics?.total ? ((metrics.active30Days / metrics.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Crescimento Semanal</p>
              <p className="text-lg font-semibold text-green-500">+{metrics?.new7Days || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Usuários Gratuitos</p>
              <p className="text-lg font-semibold">
                {(metrics?.total || 0) - (metrics?.paidSubscribers || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============= LISTA DE USUÁRIOS TAB =============
function UsersListTab() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const perPage = 15;

  useEffect(() => {
    fetchUsers();
  }, [page, planFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles with pagination
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      const { data: profiles, count, error } = await query;
      if (error) throw error;

      // Fetch AI balances
      const userIds = profiles?.map(p => p.id) || [];
      const { data: balances } = await supabase
        .from('user_ai_balance')
        .select('user_id, balance, plan_type')
        .in('user_id', userIds);

      // Fetch subscriptions
      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('user_id, status, plan_id')
        .in('user_id', userIds)
        .eq('status', 'active');

      // Fetch roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      // Combine data
      const usersWithDetails: UserWithDetails[] = (profiles || []).map(profile => {
        const balance = balances?.find(b => b.user_id === profile.id);
        const subscription = subscriptions?.find(s => s.user_id === profile.id);
        const role = roles?.find(r => r.user_id === profile.id);

        return {
          ...profile,
          ai_balance: balance?.balance || 0,
          plan_type: balance?.plan_type || 'gratuito',
          subscription_status: subscription?.status || 'none',
          role: role?.role || 'user'
        };
      });

      // Apply plan filter
      let filtered = usersWithDetails;
      if (planFilter !== 'all') {
        filtered = usersWithDetails.filter(u => u.plan_type === planFilter);
      }

      setUsers(filtered);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(searchLower) ||
      u.specialty?.toLowerCase().includes(searchLower) ||
      u.crm?.toLowerCase().includes(searchLower)
    );
  });

  const getPlanBadge = (plan: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      premium: { label: 'Premium', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      profissional: { label: 'Pro', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      basico: { label: 'Básico', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      gratuito: { label: 'Free', className: 'bg-muted text-muted-foreground' },
    };
    const variant = variants[plan] || variants.gratuito;
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, especialidade ou CRM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="gratuito">Gratuito</SelectItem>
            <SelectItem value="basico">Básico</SelectItem>
            <SelectItem value="profissional">Profissional</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchUsers}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead className="text-center">Créditos AI</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedUser(user)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || 'Sem nome'}</p>
                          {user.crm && <p className="text-xs text-muted-foreground">CRM: {user.crm}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.specialty || '-'}
                    </TableCell>
                    <TableCell>{getPlanBadge(user.plan_type || 'gratuito')}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{user.ai_balance || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.role === 'admin' ? (
                        <Badge className="bg-red-500/20 text-red-400">Admin</Badge>
                      ) : user.role === 'moderator' ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400">Mod</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">User</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.created_at ? format(new Date(user.created_at), 'dd/MM/yy', { locale: ptBR }) : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalCount} usuários encontrados
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Página {page} de {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedUser.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.full_name || 'Sem nome'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.specialty || 'Especialidade não informada'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">CRM</p>
                  <p className="font-medium">{selectedUser.crm || '-'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Instituição</p>
                  <p className="font-medium">{selectedUser.institution || '-'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Plano</p>
                  <div className="mt-1">{getPlanBadge(selectedUser.plan_type || 'gratuito')}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Créditos AI</p>
                  <p className="font-medium">{selectedUser.ai_balance || 0}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">Cadastrado em</p>
                <p className="font-medium">
                  {selectedUser.created_at 
                    ? format(new Date(selectedUser.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : '-'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============= ROLES TAB =============
function RolesTab() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  const fetchUsersWithRoles = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const usersWithRoles = (profiles || []).map(p => ({
        ...p,
        role: roles?.find(r => r.user_id === p.id)?.role || 'user'
      }));

      // Show admins and moderators first
      const sorted = usersWithRoles.sort((a, b) => {
        const order = { admin: 0, moderator: 1, user: 2 };
        return (order[a.role as keyof typeof order] || 2) - (order[b.role as keyof typeof order] || 2);
      });

      setUsers(sorted);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Erro ao carregar roles');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      if (newRole === 'user') {
        // Remove role entry
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
      } else {
        // Check if role exists first
        const { data: existing } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (existing) {
          // Update existing
          await supabase
            .from('user_roles')
            .update({ role: newRole as 'admin' | 'moderator' | 'user' })
            .eq('user_id', userId);
        } else {
          // Insert new
          await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: newRole as 'admin' | 'moderator' | 'user' });
        }
      }
      
      toast.success(`Role atualizado para ${newRole}`);
      fetchUsersWithRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erro ao atualizar role');
    } finally {
      setUpdating(null);
    }
  };

  const adminsAndMods = users.filter(u => u.role === 'admin' || u.role === 'moderator');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Administradores e Moderadores
          </CardTitle>
          <CardDescription>
            Usuários com permissões elevadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : adminsAndMods.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum admin ou moderador</p>
          ) : (
            <div className="space-y-2">
              {adminsAndMods.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name || 'Sem nome'}</span>
                  </div>
                  <Select
                    value={user.role || 'user'}
                    onValueChange={(value) => updateRole(user.id, value)}
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Promover Usuário</CardTitle>
          <CardDescription>
            Busque e promova usuários comuns para roles administrativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {users.filter(u => u.role === 'user').slice(0, 20).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                    <span className="text-sm">{user.full_name || 'Sem nome'}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRole(user.id, 'moderator')}
                        disabled={updating === user.id}
                      >
                        Mod
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRole(user.id, 'admin')}
                        disabled={updating === user.id}
                        className="text-red-500 hover:text-red-600"
                      >
                        Admin
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============= CRÉDITOS TAB =============
function CreditsTab() {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creditModal, setCreditModal] = useState<{ user: UserWithDetails; action: 'add' | 'remove' } | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const { data: balances } = await supabase
        .from('user_ai_balance')
        .select('user_id, balance, plan_type, monthly_limit')
        .order('balance', { ascending: false });

      const userIds = balances?.map(b => b.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const combined = (balances || []).map(b => ({
        id: b.user_id,
        full_name: profiles?.find(p => p.id === b.user_id)?.full_name || null,
        ai_balance: b.balance,
        plan_type: b.plan_type,
        monthly_limit: b.monthly_limit
      })) as UserWithDetails[];

      setUsers(combined);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error('Erro ao carregar créditos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreditChange = async () => {
    if (!creditModal || !creditAmount) return;
    
    setUpdating(true);
    try {
      const amount = parseInt(creditAmount);
      const finalAmount = creditModal.action === 'remove' ? -amount : amount;
      
      // Get current balance
      const { data: currentBalance } = await supabase
        .from('user_ai_balance')
        .select('balance')
        .eq('user_id', creditModal.user.id)
        .single();

      const newBalance = (currentBalance?.balance || 0) + finalAmount;

      // Update balance directly
      await supabase
        .from('user_ai_balance')
        .update({ balance: Math.max(0, newBalance) })
        .eq('user_id', creditModal.user.id);

      // Log to ledger
      await supabase
        .from('ai_credits_ledger')
        .insert({
          user_id: creditModal.user.id,
          amount: finalAmount,
          balance_before: currentBalance?.balance || 0,
          balance_after: Math.max(0, newBalance),
          transaction_type: creditModal.action === 'add' ? 'admin_credit' : 'admin_debit',
          feature_used: 'admin_adjustment',
          description: `Ajuste manual via admin (${creditModal.action === 'add' ? '+' : '-'}${amount})`
        });
      
      toast.success(`Créditos ${creditModal.action === 'add' ? 'adicionados' : 'removidos'} com sucesso`);
      setCreditModal(null);
      setCreditAmount('');
      fetchCredits();
    } catch (error) {
      console.error('Error adjusting credits:', error);
      toast.error('Erro ao ajustar créditos');
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!search) return true;
    return u.full_name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={fetchCredits}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead className="text-center">Créditos AI</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'Sem nome'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.plan_type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-lg px-3">
                        {user.ai_balance || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCreditModal({ user, action: 'add' })}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCreditModal({ user, action: 'remove' })}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Credit Adjustment Modal */}
      <Dialog open={!!creditModal} onOpenChange={() => { setCreditModal(null); setCreditAmount(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {creditModal?.action === 'add' ? 'Adicionar' : 'Remover'} Créditos
            </DialogTitle>
            <DialogDescription>
              Usuário: {creditModal?.user.full_name || 'Sem nome'}
              <br />
              Saldo atual: {creditModal?.user.ai_balance || 0} créditos
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder="Quantidade de créditos"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              min={1}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreditModal(null); setCreditAmount(''); }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreditChange} 
              disabled={!creditAmount || updating}
              variant={creditModal?.action === 'remove' ? 'destructive' : 'default'}
            >
              {updating ? 'Processando...' : creditModal?.action === 'add' ? 'Adicionar' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============= ATIVIDADE TAB =============
function ActivityTab() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [featureFilter, setFeatureFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, [featureFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ai_credits_ledger')
        .select('id, created_at, user_id, feature_used, amount, description')
        .order('created_at', { ascending: false })
        .limit(100);

      if (featureFilter !== 'all') {
        query = query.eq('feature_used', featureFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get user names
      const userIds = [...new Set(data?.map(l => l.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const logsWithNames = (data || []).map(log => ({
        ...log,
        user_name: profiles?.find(p => p.id === log.user_id)?.full_name || 'Desconhecido'
      }));

      setLogs(logsWithNames);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  const getFeatureLabel = (feature: string | null) => {
    const labels: Record<string, string> = {
      'ai-generate-conclusion': 'Conclusão AI',
      'ai-suggestion-review': 'Sugestões AI',
      'ai-rads-classification': 'RADS AI',
      'ai-dictation-polish': 'Corretor AI',
      'radreport-chat': 'Chat AI',
      'ai-inline-edit': 'Edição Inline',
      'ai-voice-inline-edit': 'Edição Voz',
      'monthly_renewal': 'Renovação Mensal',
      'signup_bonus': 'Bônus Cadastro'
    };
    return labels[feature || ''] || feature || '-';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Select value={featureFilter} onValueChange={setFeatureFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por feature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Features</SelectItem>
            <SelectItem value="ai-generate-conclusion">Conclusão AI</SelectItem>
            <SelectItem value="ai-suggestion-review">Sugestões AI</SelectItem>
            <SelectItem value="ai-rads-classification">RADS AI</SelectItem>
            <SelectItem value="ai-dictation-polish">Corretor AI</SelectItem>
            <SelectItem value="radreport-chat">Chat AI</SelectItem>
            <SelectItem value="monthly_renewal">Renovação Mensal</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchLogs}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Créditos</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma atividade encontrada
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">{log.user_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getFeatureLabel(log.feature_used)}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={log.amount < 0 ? 'destructive' : 'secondary'}>
                        {log.amount > 0 ? '+' : ''}{log.amount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {log.description || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}

// ============= MAIN PAGE =============
export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground">
            Visualize, gerencie e monitore os usuários da plataforma
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Roles</span>
            </TabsTrigger>
            <TabsTrigger value="credits" className="gap-1.5">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">Créditos</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Atividade</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersListTab />
          </TabsContent>

          <TabsContent value="roles">
            <RolesTab />
          </TabsContent>

          <TabsContent value="credits">
            <CreditsTab />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
