import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { radiologyCalculators, RadiologyCalculator } from '@/lib/radiologyCalculators';

export interface DbRadiologyCalculator {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string | null;
  reference_text: string | null;
  reference_url: string | null;
  output_template: string | null;
  info_purpose: string | null;
  info_usage: string[] | null;
  info_grading: string[] | null;
  display_order: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export function useRadiologyCalculators() {
  const { data: dbMeta, isLoading, error } = useQuery({
    queryKey: ['radiology-calculators-meta'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radiology_calculators')
        .select('*')
        .eq('ativo', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as DbRadiologyCalculator[];
    },
    staleTime: 30 * 60 * 1000, // 30 min cache
    retry: 2,
  });

  // Merge: lógica do código (calculate) + metadados do banco (referências, templates)
  const calculators: RadiologyCalculator[] = radiologyCalculators.map(calc => {
    const dbData = dbMeta?.find(m => m.code === calc.id);
    
    if (dbData) {
      return {
        ...calc,
        name: dbData.name || calc.name,
        description: dbData.description || calc.description,
        reference: dbData.reference_url && dbData.reference_text ? {
          text: dbData.reference_text,
          url: dbData.reference_url,
        } : calc.reference,
        info: dbData.info_purpose || dbData.info_usage || dbData.info_grading ? {
          purpose: dbData.info_purpose || calc.info?.purpose || '',
          usage: dbData.info_usage || calc.info?.usage || [],
          grading: dbData.info_grading || calc.info?.grading,
        } : calc.info,
      };
    }
    
    return calc;
  });

  // Mapa para busca rápida por ID
  const calculatorMap = new Map(dbMeta?.map(m => [m.code, m]) || []);

  return {
    calculators,
    calculatorMap,
    dbMeta: dbMeta || [],
    isLoading,
    error,
  };
}

export function useRadiologyCalculatorAdmin() {
  const queryClient = useQueryClient();

  const { data: allCalculators, isLoading } = useQuery({
    queryKey: ['radiology-calculators-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('radiology_calculators')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as DbRadiologyCalculator[];
    },
  });

  const createCalculator = useMutation({
    mutationFn: async (calc: Omit<DbRadiologyCalculator, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('radiology_calculators')
        .insert(calc)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-calculators-meta'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-calculators-admin'] });
    },
  });

  const updateCalculator = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbRadiologyCalculator> & { id: string }) => {
      const { data, error } = await supabase
        .from('radiology_calculators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-calculators-meta'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-calculators-admin'] });
    },
  });

  const deleteCalculator = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('radiology_calculators')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiology-calculators-meta'] });
      queryClient.invalidateQueries({ queryKey: ['radiology-calculators-admin'] });
    },
  });

  return {
    calculators: allCalculators || [],
    isLoading,
    createCalculator,
    updateCalculator,
    deleteCalculator,
  };
}

// Helper para aplicar output_template
export function formatCalculatorOutput(
  result: { value: number | string; unit?: string; interpretation?: string; formattedText: string },
  outputTemplate?: string
): string {
  if (!outputTemplate) {
    return result.formattedText;
  }

  return outputTemplate
    .replace(/\{\{value\}\}/g, String(result.value))
    .replace(/\{\{unit\}\}/g, result.unit || '')
    .replace(/\{\{interpretation\}\}/g, result.interpretation || '')
    .replace(/\{\{formattedText\}\}/g, result.formattedText);
}
