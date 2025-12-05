import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface RADSOption {
  value: string
  label: string
  texto: string
  pontos?: number
  suspeicao?: 'benigno' | 'indeterminado' | 'suspeito' | 'alto' | 'neutro'
  birads_associado?: string
  usa_lado?: boolean
  usa_meses?: boolean
  variaveis?: Record<string, any>
}

export type RADSOptionsMap = Record<string, RADSOption[]>

export type RADSSistemaCodigo = 'BIRADS_USG' | 'BIRADS_MG' | 'BIRADS_RM' | 'TIRADS' | 'US_TIREOIDE' | 'PIRADS' | 'ORADS_US' | 'ORADS_MRI' | 'LIRADS_US' | 'LUNG_RADS'

interface RADSTextOptionRow {
  id: string
  sistema_codigo: string
  categoria: string
  valor: string
  label: string
  texto: string
  pontos: number | null
  suspeicao: string | null
  birads_associado: string | null
  usa_lado: boolean | null
  usa_meses: boolean | null
  variaveis: Record<string, any> | null
  ordem: number | null
  ativo: boolean | null
}

async function fetchRADSOptions(sistemaCodigo: RADSSistemaCodigo): Promise<RADSOptionsMap> {
  const { data, error } = await supabase
    .from('rads_text_options')
    .select('*')
    .eq('sistema_codigo', sistemaCodigo)
    .eq('ativo', true)
    .order('ordem', { ascending: true })

  if (error) {
    console.error('Error fetching RADS options:', error)
    throw error
  }

  // Group by categoria
  const grouped: RADSOptionsMap = {}
  
  for (const row of (data as RADSTextOptionRow[]) || []) {
    if (!grouped[row.categoria]) {
      grouped[row.categoria] = []
    }
    
    grouped[row.categoria].push({
      value: row.valor,
      label: row.label,
      texto: row.texto,
      pontos: row.pontos ?? undefined,
      suspeicao: row.suspeicao as RADSOption['suspeicao'],
      birads_associado: row.birads_associado ?? undefined,
      usa_lado: row.usa_lado ?? undefined,
      usa_meses: row.usa_meses ?? undefined,
      variaveis: row.variaveis ?? undefined,
    })
  }

  return grouped
}

export function useRADSOptions(sistemaCodigo: RADSSistemaCodigo) {
  return useQuery({
    queryKey: ['rads-options', sistemaCodigo],
    queryFn: () => fetchRADSOptions(sistemaCodigo),
    staleTime: 30 * 60 * 1000, // 30 minutes cache
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook for all systems at once
export function useAllRADSOptions() {
  const biradsUSG = useRADSOptions('BIRADS_USG')
  const biradsMG = useRADSOptions('BIRADS_MG')
  const biradsRM = useRADSOptions('BIRADS_RM')
  const tirads = useRADSOptions('TIRADS')
  const usTireoide = useRADSOptions('US_TIREOIDE')
  const oradsUS = useRADSOptions('ORADS_US')
  const oradsMRI = useRADSOptions('ORADS_MRI')
  const liradsUS = useRADSOptions('LIRADS_US')
  const lungRADS = useRADSOptions('LUNG_RADS')

  return {
    biradsUSG,
    biradsMG,
    biradsRM,
    tirads,
    usTireoide,
    oradsUS,
    oradsMRI,
    liradsUS,
    lungRADS,
    isLoading: biradsUSG.isLoading || biradsMG.isLoading || biradsRM.isLoading || tirads.isLoading || usTireoide.isLoading || oradsUS.isLoading || oradsMRI.isLoading || liradsUS.isLoading || lungRADS.isLoading,
    isError: biradsUSG.isError || biradsMG.isError || biradsRM.isError || tirads.isError || usTireoide.isError || oradsUS.isError || oradsMRI.isError || liradsUS.isError || lungRADS.isError,
  }
}
