import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Database, Users, Activity } from 'lucide-react';

const stats = [
  { title: 'Prompts Configurados', value: '7', icon: FileText, description: 'Edge Functions com prompts' },
  { title: 'Modelos Ativos', value: '3', icon: Database, description: 'Modelos de IA disponíveis' },
  { title: 'Usuários Admin', value: '1', icon: Users, description: 'Administradores ativos' },
  { title: 'Requisições Hoje', value: '-', icon: Activity, description: 'Chamadas às Edge Functions' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie prompts, modelos e configurações do sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ title, value, icon: Icon, description }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Início Rápido</CardTitle>
            <CardDescription>
              Acesse as principais funcionalidades do painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use o menu lateral para navegar entre as seções. 
              Em <strong>Prompts IA</strong> você pode editar os prompts de sistema das Edge Functions.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
