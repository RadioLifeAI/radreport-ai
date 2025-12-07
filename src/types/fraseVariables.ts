export interface FraseVariable {
  nome: string
  tipo: 'texto' | 'numero' | 'select' | 'boolean' | 'data' | 'volume'
  descricao?: string
  opcoes?: string[]
  valor_padrao?: string | number | boolean
  obrigatorio?: boolean
  unidade?: string  // ex: "mm", "cm", "HU", "cm³"
  minimo?: number  // Validação min para números
  maximo?: number  // Validação max para números
}

export interface FraseWithVariables {
  id: string
  codigo: string
  texto: string
  variaveis: FraseVariable[]
  conclusao?: string
  observacao?: string
  categoria?: string
}

export interface VariableValues {
  [key: string]: string | number | boolean
}
