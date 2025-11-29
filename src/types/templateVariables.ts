// Types for dynamic template variables system
// Mirrors fraseVariables.ts structure for consistency

export interface TemplateVariable {
  nome: string
  tipo: 'texto' | 'numero' | 'select' | 'boolean'
  descricao?: string
  opcoes?: string[]
  valor_padrao?: string | number | boolean
  obrigatorio?: boolean
  unidade?: string  // ex: "mm", "cm", "HU"
  minimo?: number  // Validação min para números
  maximo?: number  // Validação max para números
}

export interface ConditionalLogic {
  quando: string  // Variable name to check
  igual: string | number | boolean  // Value to match
  derivar: Record<string, string | number | boolean>  // Derived variables
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
}

export interface TemplateVariableValues {
  [key: string]: string | number | boolean
}

export interface TechniqueSelection {
  selected: string  // Key of selected technique (e.g., 'EV', 'SEM', 'Primovist')
  available: string[]  // List of available technique keys
}
