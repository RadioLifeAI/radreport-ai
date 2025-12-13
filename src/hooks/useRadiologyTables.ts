import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RADIOLOGY_TABLES, RadiologyTable, TableCategory } from '@/lib/radiologyTables';

export interface DbRadiologyTable {
  id: string;
  code: string;
  name: string;
  category: string;
  subcategory: string | null;
  type: 'informative' | 'dynamic';
  modalities: string[] | null;
  html_content: string;
  reference_text: string | null;
  reference_url: string | null;
  display_order: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Converte do formato DB para o formato usado nos componentes
function dbToRadiologyTable(db: DbRadiologyTable): RadiologyTable {
  return {
    id: db.code,
    name: db.name,
    category: db.category,
    subcategory: db.subcategory || undefined,
    type: db.type,
    modality: db.modalities || undefined,
    htmlContent: db.html_content,
  };
}

// Agrupa tabelas por categoria
function groupByCategory(tables: RadiologyTable[]): TableCategory[] {
  const categoryMap = new Map<string, { name: string; icon: string; tables: RadiologyTable[] }>();
  
  const categoryInfo: Record<string, { name: string; icon: string }> = {
    'rads': { name: 'Classificações RADS', icon: 'Award' },
    'obstetricia': { name: 'Obstetrícia', icon: 'Baby' },
    'vascular': { name: 'Vascular', icon: 'Heart' },
    'neuro': { name: 'Neurorradiologia', icon: 'Brain' },
    'oncologia': { name: 'Oncologia', icon: 'Target' },
  };

  tables.forEach(table => {
    if (!categoryMap.has(table.category)) {
      const info = categoryInfo[table.category] || { name: table.category, icon: 'Table2' };
      categoryMap.set(table.category, { ...info, tables: [] });
    }
    categoryMap.get(table.category)!.tables.push(table);
  });

  return Array.from(categoryMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    icon: data.icon,
    tables: data.tables,
  }));
}

export function useRadiologyTables() {
  const queryClient = useQueryClient();

  const { data: dbTables, isLoading, error } = useQuery({
    queryKey: ['radiology-tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radiology_tables')
        .select('*')
        .eq('ativo', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as DbRadiologyTable[];
    },
    staleTime: 30 * 60 * 1000, // 30 min cache
    retry: 2,
  });

  // Fallback para dados hardcoded se banco falhar ou estiver vazio
  const tableCategories: TableCategory[] = dbTables && dbTables.length > 0
    ? groupByCategory(dbTables.map(dbToRadiologyTable))
    : RADIOLOGY_TABLES;

  // Dados brutos do banco para admin
  const rawDbTables = dbTables || [];

  return {
    tableCategories,
    rawDbTables,
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['radiology-tables'] }),
  };
}

export function useRadiologyTableAdmin() {
  const queryClient = useQueryClient();

  const { data: allTables, isLoading } = useQuery({
    queryKey: ['radiology-tables-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radiology_tables')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as DbRadiologyTable[];
    },
  });

  const createTable = useMutation({
    mutationFn: async (table: Omit<DbRadiologyTable, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('radiology_tables')
        .insert(table)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-tables'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-tables-admin'] });
    },
  });

  const updateTable = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbRadiologyTable> & { id: string }) => {
      const { data, error } = await supabase
        .from('radiology_tables')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-tables'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-tables-admin'] });
    },
  });

  const deleteTable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('radiology_tables')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-tables'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-tables-admin'] });
    },
  });

  return {
    tables: allTables || [],
    isLoading,
    createTable,
    updateTable,
    deleteTable,
  };
}
