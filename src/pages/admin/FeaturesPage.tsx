import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Save, Loader2, Plus, Edit, Trash2, GripVertical, Check, X } from 'lucide-react';

interface PlanFeature {
  id: string;
  feature_key: string;
  display_name: string;
  description: string | null;
  display_order: number;
  is_dynamic: boolean;
  dynamic_field: string | null;
  dynamic_suffix: string | null;
  is_active: boolean;
}

interface FeatureAssignment {
  id: string;
  plan_id: string;
  feature_id: string;
  is_included: boolean;
  custom_text: string | null;
  display_order: number | null;
}

interface Plan {
  id: string;
  code: string;
  name: string;
}

export default function FeaturesPage() {
  const queryClient = useQueryClient();
  const [editingFeature, setEditingFeature] = useState<PlanFeature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all features
  const { data: features, isLoading: featuresLoading } = useQuery({
    queryKey: ['plan-features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plan_features')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as PlanFeature[];
    },
  });

  // Fetch all plans
  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('id, code, name')
        .order('display_order');
      if (error) throw error;
      return data as Plan[];
    },
  });

  // Fetch all assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['plan-feature-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plan_feature_assignments')
        .select('*');
      if (error) throw error;
      return data as FeatureAssignment[];
    },
  });

  // Update feature mutation
  const updateFeatureMutation = useMutation({
    mutationFn: async (feature: Partial<PlanFeature> & { id: string }) => {
      const { error } = await supabase
        .from('plan_features')
        .update({
          display_name: feature.display_name,
          description: feature.description,
          is_dynamic: feature.is_dynamic,
          dynamic_field: feature.dynamic_field,
          dynamic_suffix: feature.dynamic_suffix,
          is_active: feature.is_active,
        })
        .eq('id', feature.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-features'] });
      queryClient.invalidateQueries({ queryKey: ['platform-metrics'] });
      toast.success('Feature atualizada');
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error('Erro ao atualizar feature');
    },
  });

  // Toggle assignment mutation
  const toggleAssignmentMutation = useMutation({
    mutationFn: async ({ planId, featureId, isIncluded }: { planId: string; featureId: string; isIncluded: boolean }) => {
      // Check if assignment exists
      const existing = assignments?.find(a => a.plan_id === planId && a.feature_id === featureId);
      
      if (existing) {
        const { error } = await supabase
          .from('plan_feature_assignments')
          .update({ is_included: isIncluded })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plan_feature_assignments')
          .insert({ plan_id: planId, feature_id: featureId, is_included: isIncluded });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-feature-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['platform-metrics'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar atribuição');
    },
  });

  // Get assignment status
  const getAssignment = (planId: string, featureId: string): boolean => {
    const assignment = assignments?.find(a => a.plan_id === planId && a.feature_id === featureId);
    return assignment?.is_included ?? false;
  };

  const handleEditFeature = (feature: PlanFeature) => {
    setEditingFeature(feature);
    setIsDialogOpen(true);
  };

  const handleSaveFeature = () => {
    if (!editingFeature) return;
    updateFeatureMutation.mutate(editingFeature);
  };

  const isLoading = featuresLoading || assignmentsLoading;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Features dos Planos</h1>
            <p className="text-muted-foreground">
              Gerencie as features exibidas nos cards de preços
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Features</CardTitle>
              <CardDescription>
                Marque quais features estão incluídas em cada plano. Features desmarcadas aparecem com ✗ e riscadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Feature</TableHead>
                      <TableHead className="w-[80px]">Ativa</TableHead>
                      {plans?.map(plan => (
                        <TableHead key={plan.id} className="text-center min-w-[100px]">
                          {plan.name}
                        </TableHead>
                      ))}
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features?.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                            <div>
                              <span className="font-medium">{feature.display_name}</span>
                              {feature.is_dynamic && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Dinâmica
                                </Badge>
                              )}
                              {feature.description && (
                                <p className="text-xs text-muted-foreground">{feature.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={feature.is_active ? 'default' : 'secondary'}>
                            {feature.is_active ? 'Sim' : 'Não'}
                          </Badge>
                        </TableCell>
                        {plans?.map(plan => (
                          <TableCell key={plan.id} className="text-center">
                            <Checkbox
                              checked={getAssignment(plan.id, feature.id)}
                              onCheckedChange={(checked) => {
                                toggleAssignmentMutation.mutate({
                                  planId: plan.id,
                                  featureId: feature.id,
                                  isIncluded: checked === true,
                                });
                              }}
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditFeature(feature)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Feature Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Feature</DialogTitle>
            </DialogHeader>
            {editingFeature && (
              <div className="space-y-4">
                <div>
                  <Label>Nome de Exibição</Label>
                  <Input
                    value={editingFeature.display_name}
                    onChange={(e) => setEditingFeature({ ...editingFeature, display_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Descrição (opcional)</Label>
                  <Input
                    value={editingFeature.description || ''}
                    onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value || null })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingFeature.is_dynamic}
                    onCheckedChange={(checked) => setEditingFeature({ ...editingFeature, is_dynamic: checked })}
                  />
                  <Label>Feature Dinâmica (usa valor do plano)</Label>
                </div>
                {editingFeature.is_dynamic && (
                  <>
                    <div>
                      <Label>Campo Dinâmico</Label>
                      <Input
                        value={editingFeature.dynamic_field || ''}
                        onChange={(e) => setEditingFeature({ ...editingFeature, dynamic_field: e.target.value || null })}
                        placeholder="ex: ai_tokens_monthly"
                      />
                    </div>
                    <div>
                      <Label>Sufixo</Label>
                      <Input
                        value={editingFeature.dynamic_suffix || ''}
                        onChange={(e) => setEditingFeature({ ...editingFeature, dynamic_suffix: e.target.value || null })}
                        placeholder="ex: tokens IA/mês"
                      />
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingFeature.is_active}
                    onCheckedChange={(checked) => setEditingFeature({ ...editingFeature, is_active: checked })}
                  />
                  <Label>Feature Ativa</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFeature} disabled={updateFeatureMutation.isPending}>
                {updateFeatureMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
