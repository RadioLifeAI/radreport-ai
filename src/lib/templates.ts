// Templates removidos - todos os templates agora vêm do Supabase system_templates
// Este arquivo mantém apenas os macros e seções padrão para compatibilidade

export type Modalidade = 'TC' | 'RM' | 'US' | 'RX' | 'Mamografia' | 'Doppler' | 'PET/CT'

export type Macro = { id: string; chave: string; modalidade?: Modalidade; texto: string }

export const MACROS: Macro[] = [
  { id: 'pulmoes-normais', chave: 'macro pulmões normais', modalidade: 'TC', texto: 'Pulmões com arquitetura preservada, sem consolidações, sem derrames, sem pneumotórax.' },
  { id: 'conclusao-padrao', chave: 'macro conclusão padrão', texto: 'Achados compatíveis com estudo sem alterações significativas.' },
  { id: 'coluna-lombar-normal', chave: 'macro normal coluna lombar', modalidade: 'RM', texto: 'Alinhamento preservado, discos sem protrusões significativas, sinais inflamatórios ausentes.' },
]

export const DEFAULT_SECTIONS = {
  achados: 'Descrever achados relevantes de forma objetiva, com localização e características.',
  conclusao: 'Síntese interpretativa com as principais impressões diagnósticas.'
}