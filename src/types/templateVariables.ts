// Types for dynamic template variables system
// Mirrors fraseVariables.ts structure for consistency

export interface TemplateVariable {
  nome: string
  tipo: 'texto' | 'numero' | 'select' | 'boolean' | 'volume' | 'data'
  descricao?: string
  opcoes?: string[]
  valor_padrao?: string | number | boolean
  obrigatorio?: boolean
  unidade?: string  // ex: "mm", "cm", "HU", "cm³"
  minimo?: number  // Validação min para números
  maximo?: number  // Validação max para números
  calculado?: boolean  // true = auto-calculated field (disabled input)
  grupo?: string  // Group name for visual organization (e.g., "biometria", "placenta")
}

// Volume measurement data for 'volume' type variables
export interface VolumeMeasurement {
  useCalculated: boolean  // true = use X*Y*Z*0.52, false = direct volume entry
  x: number  // cm
  y: number  // cm
  z: number  // cm
  directVolume: number  // cm³ (used when useCalculated = false)
}

export interface ConditionalLogic {
  quando: string  // Variable name to check
  igual: string | number | boolean  // Value to match
  derivar: Record<string, string | number | boolean>  // Derived variables
}

// Configuration for technique field behavior
export interface TecnicaConfig {
  tipo: 'alternativo' | 'complementar' | 'misto' | 'unico' | 'auto'
  concatenar: boolean
  separador?: string  // e.g., ". " for complementary
  prefixo_label?: boolean  // true = "posição: texto" | false = just "texto"
  ordem_exibicao?: string[]  // Order of keys in preview
}

export interface TemplateWithVariables {
  id: string
  titulo: string
  modalidade: string
  regiao: string
  conteudo: {
    tecnica: Record<string, string>
    achados: string
    impressao: string
    adicionais?: string
  }
  tags: string[]
  ativo: boolean
  variaveis?: TemplateVariable[]
  condicoes_logicas?: ConditionalLogic[]
  tecnica_config?: TecnicaConfig  // Configuration for technique behavior
}

export interface TemplateVariableValues {
  [key: string]: string | number | boolean
}

export interface TechniqueSelection {
  selected: string  // Key of selected technique (e.g., 'EV', 'SEM', 'Primovist')
  available: string[]  // List of available technique keys
}
