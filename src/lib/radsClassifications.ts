// TI-RADS Classification System (ACR TI-RADS 2017)
import { RADSOptionsMap } from '@/hooks/useRADSOptions'

export interface TIRADSOption {
  value: string
  label: string
  points: number
  texto: string
}

// BI-RADS USG Classification System (ACR BI-RADS 5th Edition v2025)

export interface BIRADSOption {
  value: string
  label: string
  texto: string
  suspeicao?: 'benigno' | 'indeterminado' | 'suspeito' | 'alto' | 'neutro'
}

export interface BIRADSFindingData {
  ecogenicidade: string
  forma: string
  margens: string
  eixo: string
  sombra: string
  localizacao: string
  lado: string
  medidas: [number, number, number]
  distPele: number
  distPapila: number
  // Campos de comparação temporal
  temComparacao: boolean
  dataExameAnterior: string | null // formato YYYY-MM-DD
  estadoNodulo: 'estavel' | 'cresceu' | 'diminuiu' | 'novo'
}

export const biradsUSGOptions = {
  ecogenicidade: [
    { value: 'hipoecogenico', label: 'Hipoecogênico', texto: 'hipoecogênico', suspeicao: 'indeterminado' },
    { value: 'isoecogenico', label: 'Isoecogênico', texto: 'isoecogênico', suspeicao: 'indeterminado' },
    { value: 'hiperecogenico', label: 'Hiperecogênico', texto: 'hiperecogênico', suspeicao: 'benigno' },
    { value: 'anecogenico', label: 'Anecogênico', texto: 'anecogênico', suspeicao: 'benigno' },
    { value: 'complexo', label: 'Complexo', texto: 'de ecogenicidade complexa', suspeicao: 'suspeito' },
  ] as BIRADSOption[],

  forma: [
    { value: 'oval', label: 'Oval', texto: 'oval', suspeicao: 'benigno' },
    { value: 'redondo', label: 'Redondo', texto: 'redondo', suspeicao: 'benigno' },
    { value: 'irregular', label: 'Irregular', texto: 'irregular', suspeicao: 'suspeito' },
  ] as BIRADSOption[],

  margens: [
    { value: 'circunscrito', label: 'Circunscrito', texto: 'circunscrito', suspeicao: 'benigno' },
    { value: 'indistinto', label: 'Indistinto', texto: 'de margens indistintas', suspeicao: 'suspeito' },
    { value: 'angulado', label: 'Angulado', texto: 'de margens anguladas', suspeicao: 'suspeito' },
    { value: 'microlobulado', label: 'Microlobulado', texto: 'de margens microlobuladas', suspeicao: 'suspeito' },
    { value: 'espiculado', label: 'Espiculado', texto: 'de margens espiculadas', suspeicao: 'alto' },
  ] as BIRADSOption[],

  eixo: [
    { value: 'paralela', label: 'Paralela', texto: 'com orientação paralela à pele', suspeicao: 'benigno' },
    { value: 'nao_paralela', label: 'Não paralela', texto: 'com orientação não paralela à pele', suspeicao: 'suspeito' },
  ] as BIRADSOption[],

  sombra: [
    { value: 'sem', label: 'Sem sombra', texto: 'sem sombra acústica posterior', suspeicao: 'neutro' },
    { value: 'com', label: 'Com sombra', texto: 'com sombra acústica posterior', suspeicao: 'suspeito' },
    { value: 'reforco', label: 'Com reforço', texto: 'com reforço acústico posterior', suspeicao: 'benigno' },
  ] as BIRADSOption[],

  localizacao: [
    { value: '1h', label: '1 hora', texto: 'à 1 hora' },
    { value: '2h', label: '2 horas', texto: 'às 2 horas' },
    { value: '3h', label: '3 horas', texto: 'às 3 horas' },
    { value: '4h', label: '4 horas', texto: 'às 4 horas' },
    { value: '5h', label: '5 horas', texto: 'às 5 horas' },
    { value: '6h', label: '6 horas', texto: 'às 6 horas' },
    { value: '7h', label: '7 horas', texto: 'às 7 horas' },
    { value: '8h', label: '8 horas', texto: 'às 8 horas' },
    { value: '9h', label: '9 horas', texto: 'às 9 horas' },
    { value: '10h', label: '10 horas', texto: 'às 10 horas' },
    { value: '11h', label: '11 horas', texto: 'às 11 horas' },
    { value: '12h', label: '12 horas', texto: 'às 12 horas' },
    { value: 'retroareolar', label: 'Retroareolar', texto: 'na região retroareolar' },
  ] as BIRADSOption[],

  lado: [
    { value: 'direita', label: 'Direita', texto: 'da mama direita' },
    { value: 'esquerda', label: 'Esquerda', texto: 'da mama esquerda' },
  ] as BIRADSOption[],

  estadoNodulo: [
    { value: 'estavel', label: 'Estável', texto: 'estável' },
    { value: 'cresceu', label: 'Cresceu', texto: 'apresentou crescimento' },
    { value: 'diminuiu', label: 'Diminuiu', texto: 'apresentou redução' },
    { value: 'novo', label: 'Novo', texto: 'novo' },
  ] as BIRADSOption[],
}

export const biradsCategories = [
  { value: 0, name: 'Inconclusivo', risco: '-', recommendation: 'Avaliação adicional necessária' },
  { value: 1, name: 'Negativo', risco: '< 0,05%', recommendation: 'Controle de rotina para faixa etária' },
  { value: 2, name: 'Achado benigno', risco: '< 0,05%', recommendation: 'Controle de rotina para faixa etária' },
  { value: 3, name: 'Provavelmente benigno', risco: '> 0% a ≤ 2%', recommendation: 'Controle em 6 meses' },
  { value: '4A', name: 'Baixa suspeita', risco: '> 2% a ≤ 10%', recommendation: 'Estudo histopatológico deve ser considerado' },
  { value: '4B', name: 'Suspeita intermediária', risco: '> 10% a ≤ 50%', recommendation: 'Estudo histopatológico recomendado' },
  { value: '4C', name: 'Alta suspeita', risco: '> 50% a < 95%', recommendation: 'Estudo histopatológico fortemente recomendado' },
  { value: 5, name: 'Altamente sugestivo', risco: '≥ 95%', recommendation: 'Prosseguir com estudo histopatológico' },
  { value: 6, name: 'Malignidade conhecida', risco: '100%', recommendation: 'Tratamento oncológico adequado' },
]

// Calcula tempo de seguimento em meses
export const calcularTempoSeguimento = (dataAnterior: string | null): number => {
  if (!dataAnterior) return 0
  const anterior = new Date(dataAnterior)
  const hoje = new Date()
  const diffMs = hoje.getTime() - anterior.getTime()
  const diffMeses = diffMs / (1000 * 60 * 60 * 24 * 30.44) // média de dias por mês
  return Math.floor(diffMeses)
}

// Formata tempo de seguimento para exibição
export const formatarTempoSeguimento = (meses: number): string => {
  if (meses < 12) {
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
  }
  const anos = Math.floor(meses / 12)
  const mesesRestantes = meses % 12
  if (mesesRestantes === 0) {
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`
  }
  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`
}

// Verifica se tem características benignas típicas
const isCaracteristicasBenignas = (finding: BIRADSFindingData): boolean => {
  return (
    (finding.forma === 'oval' || finding.forma === 'redondo') &&
    finding.eixo === 'paralela' &&
    finding.margens === 'circunscrito'
  )
}

// Helper to get option from dynamic or hardcoded source
const getUSGOption = (category: keyof typeof biradsUSGOptions, value: string, options?: RADSOptionsMap) => {
  if (options && options[category]) {
    return options[category].find(o => o.value === value)
  }
  return biradsUSGOptions[category]?.find(o => o.value === value)
}

// Avalia características suspeitas e retorna categoria 4A/4B/4C/5
const evaluateSuspiciousFeatures = (finding: BIRADSFindingData, options?: RADSOptionsMap): number | string => {
  const forma = getUSGOption('forma', finding.forma, options)
  const margens = getUSGOption('margens', finding.margens, options)
  const eixo = getUSGOption('eixo', finding.eixo, options)

  // Características altamente suspeitas = BI-RADS 5
  if (margens?.suspeicao === 'alto' || 
      (forma?.suspeicao === 'suspeito' && eixo?.suspeicao === 'suspeito')) {
    return 5
  }

  // BI-RADS 4C - múltiplas características suspeitas
  if ([forma?.suspeicao, margens?.suspeicao, eixo?.suspeicao].filter(s => s === 'suspeito').length >= 2) {
    return '4C'
  }

  // BI-RADS 4B - algumas características suspeitas
  if (margens?.suspeicao === 'suspeito' && (forma?.suspeicao === 'suspeito' || eixo?.suspeicao === 'suspeito')) {
    return '4B'
  }

  // BI-RADS 4A - baixa suspeita
  return '4A'
}

export const evaluateBIRADSFinding = (finding: BIRADSFindingData, options?: RADSOptionsMap): number | string => {
  const forma = getUSGOption('forma', finding.forma, options)
  const margens = getUSGOption('margens', finding.margens, options)
  const eixo = getUSGOption('eixo', finding.eixo, options)
  const sombra = getUSGOption('sombra', finding.sombra, options)

  // Se CRESCEU → BI-RADS 4A (upgrade obrigatório)
  if (finding.temComparacao && finding.estadoNodulo === 'cresceu') {
    return '4A'
  }

  // Cisto simples = BI-RADS 2
  if (finding.ecogenicidade === 'anecogenico' && 
      finding.margens === 'circunscrito' && 
      finding.sombra === 'reforco') {
    return 2
  }

  // Características altamente suspeitas = BI-RADS 5
  if (margens?.suspeicao === 'alto' || 
      (forma?.suspeicao === 'suspeito' && eixo?.suspeicao === 'suspeito')) {
    return 5
  }

  // BI-RADS 4C - múltiplas características suspeitas
  if ([forma?.suspeicao, margens?.suspeicao, eixo?.suspeicao].filter(s => s === 'suspeito').length >= 2) {
    return '4C'
  }

  // BI-RADS 4B - algumas características suspeitas
  if (margens?.suspeicao === 'suspeito' && (forma?.suspeicao === 'suspeito' || eixo?.suspeicao === 'suspeito')) {
    return '4B'
  }

  // BI-RADS 4A - baixa suspeita (uma característica suspeita isolada)
  if (forma?.suspeicao === 'suspeito' || margens?.suspeicao === 'suspeito' || 
      eixo?.suspeicao === 'suspeito' || sombra?.suspeicao === 'suspeito') {
    return '4A'
  }

  // Se características benignas
  if (isCaracteristicasBenignas(finding)) {
    // Calcular tempo de seguimento
    const tempoSeguimento = calcularTempoSeguimento(finding.dataExameAnterior)
    
    // Estável por ≥ 24 meses (2 anos) → BI-RADS 2
    if (finding.temComparacao && 
        finding.estadoNodulo === 'estavel' && 
        tempoSeguimento >= 24) {
      return 2
    }
    
    // Estável < 2 anos OU novo/sem comparação → BI-RADS 3
    return 3
  }

  // Default: BI-RADS 3 se não tem características suspeitas claras
  return 3
}

export const calculateBIRADSCategory = (findings: BIRADSFindingData[], options?: RADSOptionsMap): number | string => {
  if (findings.length === 0) return 0

  const categoryOrder = [0, 1, 2, 3, '4A', '4B', '4C', 5, 6]
  let worstIndex = 0

  for (const finding of findings) {
    const category = evaluateBIRADSFinding(finding, options)
    const categoryIndex = categoryOrder.indexOf(category)
    if (categoryIndex > worstIndex) {
      worstIndex = categoryIndex
    }
  }

  return categoryOrder[worstIndex]
}

export const getBIRADSOptionTexto = (category: keyof typeof biradsUSGOptions, value: string, options?: RADSOptionsMap): string => {
  const opt = getUSGOption(category, value, options)
  return opt?.texto ?? ''
}

export const generateBIRADSFindingDescription = (finding: BIRADSFindingData, index: number, options?: RADSOptionsMap): string => {
  const ecogenicidadeTexto = getBIRADSOptionTexto('ecogenicidade', finding.ecogenicidade, options)
  const formaTexto = getBIRADSOptionTexto('forma', finding.forma, options)
  const margensTexto = getBIRADSOptionTexto('margens', finding.margens, options)
  const eixoTexto = getBIRADSOptionTexto('eixo', finding.eixo, options)
  const sombraTexto = getBIRADSOptionTexto('sombra', finding.sombra, options)
  const localizacaoTexto = getBIRADSOptionTexto('localizacao', finding.localizacao, options)
  const ladoTexto = getBIRADSOptionTexto('lado', finding.lado, options)

  const medidasFormatadas = finding.medidas.map(m => formatMeasurement(m)).join(' x ')
  const distPeleFormatada = formatMeasurement(finding.distPele)
  const distPapilaFormatada = formatMeasurement(finding.distPapila)

  let descricao = `N${index + 1}- Nódulo ${ecogenicidadeTexto}, ${formaTexto}, ${margensTexto}, ${eixoTexto}, ${sombraTexto}, medindo ${medidasFormatadas} cm, localizado ${localizacaoTexto} ${ladoTexto}, distando ${distPeleFormatada} cm da pele e ${distPapilaFormatada} cm do complexo areolopapilar.`

  // Adicionar informação de comparação se disponível
  if (finding.temComparacao && finding.dataExameAnterior) {
    const dataFormatada = new Date(finding.dataExameAnterior).toLocaleDateString('pt-BR')
    const tempoMeses = calcularTempoSeguimento(finding.dataExameAnterior)
    const tempoFormatado = formatarTempoSeguimento(tempoMeses)
    
    if (finding.estadoNodulo === 'estavel') {
      descricao += ` Estável em relação ao exame de ${dataFormatada} (${tempoFormatado} de seguimento).`
    } else if (finding.estadoNodulo === 'cresceu') {
      descricao += ` Apresentou crescimento em relação ao exame de ${dataFormatada}.`
    } else if (finding.estadoNodulo === 'diminuiu') {
      descricao += ` Apresentou redução em relação ao exame de ${dataFormatada}.`
    }
  }

  return descricao
}

export const generateBIRADSImpression = (findings: BIRADSFindingData[], biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const lados = [...new Set(findings.map(f => f.lado))]
  const isMultiple = findings.length > 1
  
  // Determinar texto do local (singular/plural)
  let localTexto: string
  let ladoTexto: string
  if (findings.length === 1) {
    localTexto = 'Nódulo'
    ladoTexto = findings[0].lado === 'direita' ? 'na mama direita' : 'na mama esquerda'
  } else if (lados.length === 1) {
    localTexto = 'Nódulos'
    ladoTexto = lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda'
  } else {
    localTexto = 'Nódulos'
    ladoTexto = 'nas mamas direita e esquerda'
  }

  // Verificar se algum achado tem comparação estável ≥ 2 anos (para BI-RADS 2)
  const temComparacaoEstavel = findings.some(f => {
    if (!f.temComparacao || f.estadoNodulo !== 'estavel') return false
    const tempoMeses = calcularTempoSeguimento(f.dataExameAnterior)
    return tempoMeses >= 24
  })

  // Gerar texto de comparação para BI-RADS 2
  let comparacaoTexto = ''
  if (biradsCategory === 2 && temComparacaoEstavel) {
    const achadoEstavel = findings.find(f => {
      if (!f.temComparacao || f.estadoNodulo !== 'estavel') return false
      const tempoMeses = calcularTempoSeguimento(f.dataExameAnterior)
      return tempoMeses >= 24
    })
    if (achadoEstavel?.dataExameAnterior) {
      const dataFormatada = new Date(achadoEstavel.dataExameAnterior).toLocaleDateString('pt-BR')
      const tempoMeses = calcularTempoSeguimento(achadoEstavel.dataExameAnterior)
      const tempoFormatado = formatarTempoSeguimento(tempoMeses)
      comparacaoTexto = `, estável em relação ao exame de ${dataFormatada} (${tempoFormatado} de seguimento)`
    }
  }

  // Gerar impressão baseada na categoria
  const categoryNum = typeof biradsCategory === 'string' ? biradsCategory : biradsCategory.toString()
  
  let impressao: string

  switch (categoryNum) {
    case '1':
      // BI-RADS 1 - Negativo (sem achados)
      impressao = `Estudo ultrassonográfico mamário sem alterações.\nBI-RADS USG: categoria 1.\nNota: A critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.`
      break

    case '2':
      // BI-RADS 2 - Achado benigno (cisto simples ou estável ≥ 2 anos)
      impressao = `${localTexto} ${ladoTexto}${comparacaoTexto}.\nBI-RADS USG: categoria 2.\nNota: A critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.`
      break

    case '3':
      // BI-RADS 3 - Provavelmente benigno
      impressao = `${localTexto} ${ladoTexto} de aspecto provavelmente benigno.\nBI-RADS USG: categoria 3.\nRecomenda-se controle ultrassonográfico em 6 meses.`
      break

    case '4A':
    case '4B':
    case '4C':
      // BI-RADS 4 - Suspeito
      impressao = `${localTexto} mamário ${lados[0] === 'direita' ? 'direito' : (lados[0] === 'esquerda' ? 'esquerdo' : '')} suspeito.\nBI-RADS USG: categoria ${categoryNum}.\nEstudo histopatológico deve ser considerado.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.`
      break

    case '5':
      // BI-RADS 5 - Altamente suspeito
      impressao = `${localTexto} mamário ${lados[0] === 'direita' ? 'direito' : (lados[0] === 'esquerda' ? 'esquerdo' : '')} altamente suspeito.\nBI-RADS USG: categoria 5.\nRecomendo prosseguir investigação com estudo histopatológico.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.`
      break

    case '6':
      // BI-RADS 6 - Malignidade conhecida
      impressao = `${localTexto} ${ladoTexto} com malignidade conhecida.\nBI-RADS USG: categoria 6.\nTratamento oncológico adequado indicado.`
      break

    default:
      // BI-RADS 0 ou outro
      impressao = `${localTexto} ${ladoTexto}.\nBI-RADS USG: categoria ${biradsCategory}.\nAvaliação adicional necessária.`
  }

  return impressao
}

export const createEmptyBIRADSFinding = (): BIRADSFindingData => ({
  ecogenicidade: 'hipoecogenico',
  forma: 'oval',
  margens: 'circunscrito',
  eixo: 'paralela',
  sombra: 'sem',
  localizacao: '1h',
  lado: 'direita',
  medidas: [1.0, 1.0, 1.0],
  distPele: 1.0,
  distPapila: 1.0,
  temComparacao: false,
  dataExameAnterior: null,
  estadoNodulo: 'novo',
})

// ==========================================
// BI-RADS USG EXPANDED DATA STRUCTURES
// ==========================================

export interface BIRADSUSGCisto {
  presente: boolean
  tipo: 'simples' | 'complicado' | 'complexo' | 'microcistos'
  quantidade: 'um' | 'multiplos'
  lado: string
  localizacao: string
  medidas: [number, number, number]
}

export interface BIRADSUSGData {
  // Indicação
  indicacao: {
    tipo: 'rastreamento' | 'rotina' | 'acompanhamento_nodulo' | 'achados_mamograficos' | 'pos_operatorio' | 'pesquisa_colecao' | 'avaliacao_implante' | null
  }
  
  // Cirurgias
  cirurgia: {
    tipo: 'sem_cirurgias' | 'mastectomia' | 'quadrantectomia' | 'mamoplastia'
    lado: string | null
    reconstrucao: 'protese' | 'retalho' | null
  }
  
  // Parênquima
  parenquima: {
    tipo: 'homogeneo_gorduroso' | 'homogeneo_fibroglandular' | 'heterogeneo'
    ecotextura: 'normal' | 'alterada'
    ecotexturaDesc: string
  }
  
  // Cistos
  cistos: BIRADSUSGCisto[]
  cistosPresente: 'ausencia' | 'presente'
  
  // Nódulos (reutiliza BIRADSFindingData[])
  nodulos: BIRADSFindingData[]
  nodulosPresente: 'ausencia' | 'presente'
  
  // Ectasia Ductal
  ectasiaDuctal: {
    presente: boolean
    conteudo: 'sem_conteudo' | 'com_conteudo'
    lado: string
    localizacao: string
    calibre: number
  }
  
  // Distorção Arquitetural
  distorcaoArquitetural: {
    presente: boolean
    tipo: 'sitio_cirurgico' | 'fora_sitio'
    lado: string
    localizacao: string
  }
  
  // Implante Mamário
  implanteMamario: {
    presente: boolean
    posicao: 'retroglandular' | 'retromuscular'
    integridade: 'integros' | 'rotura_intracapsular' | 'rotura_extracapsular'
    lado: string | null
    siliconeDesc: string
  }
  
  // Linfonodomegalia
  linfonodomegalia: {
    tipo: 'ausente' | 'presente_normal' | 'perda_padrao'
    lado: string
    descricao: string
  }
  
  // Exames Comparativos
  comparativo: {
    tipo: 'nao_citar' | 'nao_disponivel' | 'disponivel'
    dataExame: string | null
    evolucao: 'sem_alteracao' | 'nodulo_estavel' | 'nodulo_cresceu' | 'nodulo_diminuiu'
  }
  
  // Achados Adicionais
  achadosAdicionais: string
  
  // Notas
  notas: {
    correlacaoMamografia: boolean
    outraObservacao: string
  }
}

export const biradsUSGExpandedOptions = {
  tipoIndicacao: [
    { value: 'rastreamento', label: 'Rastreamento', texto: 'Rastreamento.' },
    { value: 'rotina', label: 'Rotina', texto: 'Rotina.' },
    { value: 'acompanhamento_nodulo', label: 'Acompanhamento de nódulo', texto: 'Acompanhamento de nódulo.' },
    { value: 'achados_mamograficos', label: 'Achados mamográficos', texto: 'Complementação de achados mamográficos.' },
    { value: 'pos_operatorio', label: 'Pós-operatório', texto: 'Avaliação pós-operatória.' },
    { value: 'pesquisa_colecao', label: 'Pesquisa de coleção', texto: 'Pesquisa de coleção.' },
    { value: 'avaliacao_implante', label: 'Avaliação de implante mamário', texto: 'Avaliação de implante mamário.' },
  ],
  
  tipoCirurgia: [
    { value: 'sem_cirurgias', label: 'Sem cirurgias prévias', texto: '' },
    { value: 'mastectomia', label: 'Mastectomia', texto: 'Antecedente de mastectomia' },
    { value: 'quadrantectomia', label: 'Quadrantectomia', texto: 'Antecedente de quadrantectomia' },
    { value: 'mamoplastia', label: 'Mamoplastia', texto: 'Antecedente de mamoplastia' },
  ],
  
  tipoReconstrucao: [
    { value: 'protese', label: 'Prótese', texto: 'com reconstrução por prótese' },
    { value: 'retalho', label: 'Retalho miocutâneo', texto: 'com reconstrução por retalho miocutâneo' },
  ],
  
  parenquima: [
    { value: 'homogeneo_gorduroso', label: 'Homogêneo - Predomínio gorduroso', texto: 'Parênquima mamário homogêneo, com predomínio de tecido adiposo.' },
    { value: 'homogeneo_fibroglandular', label: 'Homogêneo - Predomínio fibroglandular', texto: 'Parênquima mamário homogêneo, com predomínio de tecido fibroglandular.' },
    { value: 'heterogeneo', label: 'Heterogêneo', texto: 'Parênquima mamário heterogêneo.' },
  ],
  
  tipoCisto: [
    { value: 'simples', label: 'Cisto simples', texto: 'cisto simples', birads: 2 },
    { value: 'complicado', label: 'Cisto complicado', texto: 'cisto complicado', birads: 3 },
    { value: 'complexo', label: 'Cisto complexo', texto: 'cisto complexo', birads: '4A' },
    { value: 'microcistos', label: 'Microcistos agrupados', texto: 'microcistos agrupados', birads: 2 },
  ],
  
  ectasiaConteudo: [
    { value: 'sem_conteudo', label: 'Sem conteúdo sólido', texto: 'sem conteúdo sólido em seu interior' },
    { value: 'com_conteudo', label: 'Com conteúdo sólido', texto: 'com conteúdo sólido em seu interior' },
  ],
  
  implantePosicao: [
    { value: 'retroglandular', label: 'Retroglandular', texto: 'em posição retroglandular' },
    { value: 'retromuscular', label: 'Retromuscular', texto: 'em posição retromuscular' },
  ],
  
  implanteIntegridade: [
    { value: 'integros', label: 'Íntegros', texto: 'apresentando envelope íntegro' },
    { value: 'rotura_intracapsular', label: 'Rotura intracapsular', texto: 'com sinais de rotura intracapsular' },
    { value: 'rotura_extracapsular', label: 'Rotura extracapsular', texto: 'com sinais de rotura extracapsular' },
  ],
  
  linfonodomegalia: [
    { value: 'ausente', label: 'Ausente', texto: '' },
    { value: 'presente_normal', label: 'Presente com morfologia preservada', texto: 'Linfonodos axilares visualizados, com morfologia preservada.' },
    { value: 'perda_padrao', label: 'Com alteração morfológica', texto: 'Linfonodos axilares com alteração de morfologia' },
  ],
  
  comparativoTipo: [
    { value: 'nao_citar', label: 'Não citar comparação', texto: '' },
    { value: 'nao_disponivel', label: 'Exames anteriores não disponíveis', texto: 'Exames anteriores não disponíveis para comparação.' },
    { value: 'disponivel', label: 'Comparação disponível', texto: '' },
  ],
  
  comparativoEvolucao: [
    { value: 'sem_alteracao', label: 'Sem alterações significativas', texto: 'Sem alterações significativas em relação ao exame anterior' },
    { value: 'nodulo_estavel', label: 'Nódulo estável', texto: 'Nódulo estável em relação ao exame anterior' },
    { value: 'nodulo_cresceu', label: 'Nódulo com crescimento', texto: 'Nódulo apresentando crescimento em relação ao exame anterior' },
    { value: 'nodulo_diminuiu', label: 'Nódulo com redução', texto: 'Nódulo apresentando redução em relação ao exame anterior' },
  ],
}

export const createEmptyBIRADSUSGCisto = (): BIRADSUSGCisto => ({
  presente: true,
  tipo: 'simples',
  quantidade: 'um',
  lado: 'direita',
  localizacao: '12h',
  medidas: [0.5, 0.5, 0.5],
})

export const createEmptyBIRADSUSGData = (): BIRADSUSGData => ({
  indicacao: { tipo: 'rastreamento' },
  cirurgia: { tipo: 'sem_cirurgias', lado: null, reconstrucao: null },
  parenquima: { tipo: 'homogeneo_gorduroso', ecotextura: 'normal', ecotexturaDesc: '' },
  cistos: [],
  cistosPresente: 'ausencia',
  nodulos: [],
  nodulosPresente: 'ausencia',
  ectasiaDuctal: { presente: false, conteudo: 'sem_conteudo', lado: 'direita', localizacao: 'retroareolar', calibre: 0 },
  distorcaoArquitetural: { presente: false, tipo: 'sitio_cirurgico', lado: 'direita', localizacao: '' },
  implanteMamario: { presente: false, posicao: 'retroglandular', integridade: 'integros', lado: null, siliconeDesc: '' },
  linfonodomegalia: { tipo: 'ausente', lado: '', descricao: '' },
  comparativo: { tipo: 'nao_citar', dataExame: null, evolucao: 'sem_alteracao' },
  achadosAdicionais: '',
  notas: { correlacaoMamografia: false, outraObservacao: '' },
})

// Helper to get expanded USG option
const getExpandedUSGOption = (category: keyof typeof biradsUSGExpandedOptions, value: string, options?: RADSOptionsMap) => {
  if (options && options[category]) {
    return options[category].find(o => o.value === value)
  }
  return (biradsUSGExpandedOptions as any)[category]?.find((o: any) => o.value === value)
}

// Evaluate BI-RADS USG expanded
export const evaluateBIRADSUSGExpanded = (data: BIRADSUSGData, options?: RADSOptionsMap): number | string => {
  let worstCategory: number | string = 1 // Default negativo
  
  const categoryOrder = [0, 1, 2, 3, '4A', '4B', '4C', 5, 6]
  
  const updateWorst = (cat: number | string) => {
    const currentIdx = categoryOrder.indexOf(worstCategory)
    const newIdx = categoryOrder.indexOf(cat)
    if (newIdx > currentIdx) worstCategory = cat
  }
  
  // Avaliar cistos
  if (data.cistos.length > 0) {
    for (const cisto of data.cistos) {
      const tipoOpt = getExpandedUSGOption('tipoCisto', cisto.tipo, options) as any
      const birads = tipoOpt?.birads_associado || tipoOpt?.birads
      if (birads) updateWorst(typeof birads === 'string' ? (isNaN(parseInt(birads)) ? birads : parseInt(birads)) : birads)
    }
  }
  
  // Avaliar nódulos (usando lógica existente)
  if (data.nodulos.length > 0) {
    const noduloCat = calculateBIRADSCategory(data.nodulos, options)
    updateWorst(noduloCat)
  }
  
  // Ectasia ductal com conteúdo = suspeito
  if (data.ectasiaDuctal.presente && data.ectasiaDuctal.conteudo === 'com_conteudo') {
    updateWorst('4A')
  }
  
  // Distorção fora de sítio cirúrgico = muito suspeito
  if (data.distorcaoArquitetural.presente && data.distorcaoArquitetural.tipo === 'fora_sitio') {
    updateWorst('4B')
  }
  
  // Implante com rotura
  if (data.implanteMamario.presente) {
    if (data.implanteMamario.integridade === 'rotura_extracapsular') {
      updateWorst(0) // Achado que requer avaliação adicional
    }
  }
  
  // Linfonodomegalia com perda de padrão
  if (data.linfonodomegalia.tipo === 'perda_padrao') {
    updateWorst('4A')
  }
  
  // Se comparativo mostra crescimento
  if (data.comparativo.tipo === 'disponivel' && data.comparativo.evolucao === 'nodulo_cresceu') {
    updateWorst('4A')
  }
  
  // Se não há achados, retorna negativo ou achado benigno
  if (data.cistosPresente === 'ausencia' && 
      data.nodulosPresente === 'ausencia' && 
      !data.ectasiaDuctal.presente && 
      !data.distorcaoArquitetural.presente &&
      !data.implanteMamario.presente &&
      data.linfonodomegalia.tipo === 'ausente') {
    return 1 // Negativo
  }
  
  return worstCategory
}

// Generate USG Indicação text
export const generateBIRADSUSGIndicacao = (data: BIRADSUSGData, options?: RADSOptionsMap): string => {
  if (!data.indicacao.tipo) return ''
  const opt = getExpandedUSGOption('tipoIndicacao', data.indicacao.tipo, options)
  return opt?.texto || ''
}

// Generate USG Técnica text
export const generateBIRADSUSGTecnica = (): string => {
  return 'Exame realizado com transdutor linear de alta frequência.'
}

// Generate USG Achados text
export const generateBIRADSUSGAchados = (data: BIRADSUSGData, options?: RADSOptionsMap): string => {
  const achados: string[] = []
  
  // Cirurgia
  if (data.cirurgia.tipo !== 'sem_cirurgias') {
    const cirOpt = getExpandedUSGOption('tipoCirurgia', data.cirurgia.tipo, options)
    if (cirOpt?.texto) {
      let cirTexto = cirOpt.texto
      if (data.cirurgia.lado) {
        cirTexto += ` à ${data.cirurgia.lado}`
      }
      if (data.cirurgia.reconstrucao) {
        const recOpt = getExpandedUSGOption('tipoReconstrucao', data.cirurgia.reconstrucao, options)
        if (recOpt) cirTexto += ` ${recOpt.texto}`
      }
      achados.push(cirTexto + '.')
    }
  }
  
  // Parênquima
  const parOpt = getExpandedUSGOption('parenquima', data.parenquima.tipo, options)
  if (parOpt) achados.push(parOpt.texto)
  
  if (data.parenquima.ecotextura === 'alterada' && data.parenquima.ecotexturaDesc) {
    achados.push(`Ecotextura alterada: ${data.parenquima.ecotexturaDesc}.`)
  }
  
  // Cistos
  if (data.cistos.length > 0) {
    for (const cisto of data.cistos) {
      const tipoOpt = getExpandedUSGOption('tipoCisto', cisto.tipo, options)
      const locOpt = getUSGOption('localizacao', cisto.localizacao, options)
      const ladoOpt = getUSGOption('lado', cisto.lado, options)
      const medidasStr = cisto.medidas.map(m => formatMeasurement(m)).join(' x ')
      
      let cistoTexto = `${tipoOpt?.texto || 'Cisto'}`
      if (cisto.quantidade === 'multiplos') {
        cistoTexto = tipoOpt?.value === 'microcistos' ? 'Microcistos agrupados' : `Múltiplos ${tipoOpt?.texto}s`
      }
      cistoTexto += ` ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}`
      if (cisto.medidas[0] > 0) cistoTexto += `, medindo ${medidasStr} cm`
      achados.push(cistoTexto + '.')
    }
  }
  
  // Nódulos
  if (data.nodulos.length > 0) {
    data.nodulos.forEach((nodulo, idx) => {
      achados.push(generateBIRADSFindingDescription(nodulo, idx, options))
    })
  }
  
  // Ectasia Ductal
  if (data.ectasiaDuctal.presente) {
    const contOpt = getExpandedUSGOption('ectasiaConteudo', data.ectasiaDuctal.conteudo, options)
    const ladoOpt = getUSGOption('lado', data.ectasiaDuctal.lado, options)
    const locOpt = getUSGOption('localizacao', data.ectasiaDuctal.localizacao, options)
    let ectTexto = `Ectasia ductal ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}`
    if (data.ectasiaDuctal.calibre > 0) {
      ectTexto += `, com calibre de ${formatMeasurement(data.ectasiaDuctal.calibre)} mm`
    }
    ectTexto += `, ${contOpt?.texto || ''}`
    achados.push(ectTexto + '.')
  }
  
  // Distorção Arquitetural
  if (data.distorcaoArquitetural.presente) {
    const tipoTexto = data.distorcaoArquitetural.tipo === 'sitio_cirurgico' 
      ? 'em sítio cirúrgico' 
      : 'fora de sítio cirúrgico'
    achados.push(`Distorção arquitetural ${tipoTexto} à ${data.distorcaoArquitetural.lado}${data.distorcaoArquitetural.localizacao ? `, na região ${data.distorcaoArquitetural.localizacao}` : ''}.`)
  }
  
  // Implante Mamário
  if (data.implanteMamario.presente) {
    const posOpt = getExpandedUSGOption('implantePosicao', data.implanteMamario.posicao, options)
    const intOpt = getExpandedUSGOption('implanteIntegridade', data.implanteMamario.integridade, options)
    let impTexto = `Implantes mamários ${posOpt?.texto || ''}`
    if (data.implanteMamario.lado) {
      impTexto = `Implante mamário ${posOpt?.texto || ''} à ${data.implanteMamario.lado}`
    }
    impTexto += `, ${intOpt?.texto || ''}`
    if (data.implanteMamario.siliconeDesc) {
      impTexto += `. ${data.implanteMamario.siliconeDesc}`
    }
    achados.push(impTexto + '.')
  }
  
  // Linfonodomegalia
  const linfOpt = getExpandedUSGOption('linfonodomegalia', data.linfonodomegalia.tipo, options)
  if (linfOpt?.texto) {
    let linfTexto = linfOpt.texto
    if (data.linfonodomegalia.tipo === 'perda_padrao' && data.linfonodomegalia.lado) {
      linfTexto += ` à ${data.linfonodomegalia.lado}`
    }
    if (data.linfonodomegalia.descricao) {
      linfTexto += `. ${data.linfonodomegalia.descricao}`
    }
    achados.push(linfTexto + '.')
  }
  
  // Achados adicionais
  if (data.achadosAdicionais) {
    achados.push(data.achadosAdicionais)
  }
  
  return achados.join('\n')
}

// Generate USG Comparativo text
export const generateBIRADSUSGComparativo = (data: BIRADSUSGData, options?: RADSOptionsMap): string => {
  if (data.comparativo.tipo === 'nao_citar') return ''
  if (data.comparativo.tipo === 'nao_disponivel') {
    return 'Exames anteriores não disponíveis para comparação.'
  }
  if (data.comparativo.tipo === 'disponivel') {
    const evolOpt = getExpandedUSGOption('comparativoEvolucao', data.comparativo.evolucao, options)
    let texto = evolOpt?.texto || ''
    if (data.comparativo.dataExame) {
      const dataFormatada = new Date(data.comparativo.dataExame).toLocaleDateString('pt-BR')
      texto += ` de ${dataFormatada}`
    }
    return texto + '.'
  }
  return ''
}

// Generate USG Impression text
export const generateBIRADSUSGImpression = (data: BIRADSUSGData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const achados: string[] = []
  
  // Cistos
  if (data.cistos.length > 0) {
    const tiposUnicos = [...new Set(data.cistos.map(c => c.tipo))]
    const ladosUnicos = [...new Set(data.cistos.map(c => c.lado))]
    for (const tipo of tiposUnicos) {
      const tipoOpt = getExpandedUSGOption('tipoCisto', tipo, options)
      const quantTipo = data.cistos.filter(c => c.tipo === tipo).length
      let texto = quantTipo > 1 ? `${tipoOpt?.texto}s` : tipoOpt?.texto || ''
      texto = texto.charAt(0).toUpperCase() + texto.slice(1)
      if (ladosUnicos.length === 1) {
        texto += ` ${ladosUnicos[0] === 'direita' ? 'na mama direita' : 'na mama esquerda'}`
      } else {
        texto += ' bilaterais'
      }
      achados.push(texto)
    }
  }
  
  // Nódulos - usar generateBIRADSImpression existente se houver
  if (data.nodulos.length > 0) {
    const noduloImpressao = generateBIRADSImpression(data.nodulos, calculateBIRADSCategory(data.nodulos, options), options)
    // Extrair apenas a primeira linha (sem BI-RADS e nota)
    const primeiraLinha = noduloImpressao.split('\n')[0]
    achados.push(primeiraLinha)
  }
  
  // Ectasia
  if (data.ectasiaDuctal.presente) {
    const texto = data.ectasiaDuctal.conteudo === 'com_conteudo' 
      ? 'Ectasia ductal com conteúdo sólido - requer investigação'
      : 'Ectasia ductal'
    achados.push(texto)
  }
  
  // Distorção
  if (data.distorcaoArquitetural.presente) {
    const texto = data.distorcaoArquitetural.tipo === 'fora_sitio'
      ? 'Distorção arquitetural fora de sítio cirúrgico - requer investigação'
      : 'Distorção arquitetural em sítio cirúrgico'
    achados.push(texto)
  }
  
  // Implante
  if (data.implanteMamario.presente && data.implanteMamario.integridade !== 'integros') {
    achados.push(`Sinais de ${data.implanteMamario.integridade === 'rotura_intracapsular' ? 'rotura intracapsular' : 'rotura extracapsular'} de implante mamário`)
  }
  
  // Linfonodos
  if (data.linfonodomegalia.tipo === 'perda_padrao') {
    achados.push('Linfonodomegalia axilar com alteração morfológica')
  }
  
  // Se não há achados significativos
  if (achados.length === 0) {
    return `Estudo ultrassonográfico mamário sem alterações.\nBI-RADS USG: categoria 1.\nNota: A critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.`
  }
  
  // Categoria info
  const catInfo = biradsCategories.find(c => c.value === biradsCategory || c.value.toString() === biradsCategory.toString())
  let nota = ''
  if (typeof biradsCategory === 'number' && biradsCategory <= 2) {
    nota = '\nNota: A critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.'
  } else if (biradsCategory === 3) {
    nota = '\nRecomenda-se controle ultrassonográfico em 6 meses.'
  } else if (biradsCategory === '4A' || biradsCategory === '4B' || biradsCategory === '4C' || biradsCategory === 5) {
    nota = '\nEstudo histopatológico deve ser considerado.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.'
  }
  
  return `${achados.join('.\n')}.\nBI-RADS USG: categoria ${biradsCategory}.${nota}`
}

// Generate USG Notas text
export const generateBIRADSUSGNotas = (data: BIRADSUSGData): string => {
  const notas: string[] = []
  
  if (data.notas.correlacaoMamografia) {
    notas.push('A ultrassonografia mamária não substitui a mamografia. Recomenda-se correlação mamográfica conforme indicação clínica.')
  }
  
  if (data.notas.outraObservacao) {
    notas.push(data.notas.outraObservacao)
  }
  
  return notas.join('\n')
}

// Generate USG Laudo Completo HTML
export const generateBIRADSUSGLaudoCompletoHTML = (data: BIRADSUSGData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const indicacao = generateBIRADSUSGIndicacao(data, options)
  const tecnica = generateBIRADSUSGTecnica()
  const achados = generateBIRADSUSGAchados(data, options)
  const comparativo = generateBIRADSUSGComparativo(data, options)
  const impressao = generateBIRADSUSGImpression(data, biradsCategory, options)
  const notas = generateBIRADSUSGNotas(data)
  
  let html = `<h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24pt;">ULTRASSONOGRAFIA DAS MAMAS</h2>`
  
  if (indicacao) {
    html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">INDICAÇÃO CLÍNICA</h3>`
    html += `<p style="text-align: justify; margin: 6pt 0;">${indicacao}</p>`
  }
  
  html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">TÉCNICA</h3>`
  html += `<p style="text-align: justify; margin: 6pt 0;">${tecnica}</p>`
  
  html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">ACHADOS</h3>`
  html += `<p style="text-align: justify; margin: 6pt 0;">${achados.replace(/\n/g, '<br>')}</p>`
  
  if (comparativo) {
    html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">ESTUDO COMPARATIVO</h3>`
    html += `<p style="text-align: justify; margin: 6pt 0;">${comparativo}</p>`
  }
  
  html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">IMPRESSÃO DIAGNÓSTICA</h3>`
  html += `<p style="text-align: justify; margin: 6pt 0;">${impressao.replace(/\n/g, '<br>')}</p>`
  
  if (notas) {
    html += `<h3 style="text-transform: uppercase; margin-top: 18pt; margin-bottom: 8pt;">NOTAS</h3>`
    html += `<p style="text-align: justify; margin: 6pt 0;">${notas.replace(/\n/g, '<br>')}</p>`
  }
  
  return html
}

export interface NoduleData {
  composicao: string
  ecogenicidade: string
  formato: string
  margens: string
  focos: string
  localizacao: string
  medidas: [number, number, number]
}

export const tiradOptions = {
  composicao: [
    { value: 'cistico', label: 'Cístico ou quase totalmente cístico', points: 0, texto: 'cístico' },
    { value: 'espongiforme', label: 'Espongiforme', points: 0, texto: 'espongiforme' },
    { value: 'misto', label: 'Misto (cístico e sólido)', points: 1, texto: 'misto (cístico e sólido)' },
    { value: 'solido', label: 'Sólido ou quase totalmente sólido', points: 2, texto: 'sólido' },
  ] as TIRADSOption[],
  
  ecogenicidade: [
    { value: 'anecogenico', label: 'Anecogênico', points: 0, texto: 'anecogênico' },
    { value: 'hiperecogenico', label: 'Hiperecogênico ou isoecogênico', points: 1, texto: 'hiperecogênico' },
    { value: 'isoecogenico', label: 'Isoecogênico', points: 1, texto: 'isoecogênico' },
    { value: 'hipoecogenico', label: 'Hipoecogênico', points: 2, texto: 'hipoecogênico' },
    { value: 'muito_hipoecogenico', label: 'Muito hipoecogênico', points: 3, texto: 'muito hipoecogênico' },
  ] as TIRADSOption[],
  
  formato: [
    { value: 'paralelo', label: 'Mais largo que alto (paralelo)', points: 0, texto: 'de orientação paralela à pele' },
    { value: 'nao_paralelo', label: 'Mais alto que largo (não paralelo)', points: 3, texto: 'de orientação não paralela à pele (mais alto que largo)' },
  ] as TIRADSOption[],
  
  margens: [
    { value: 'bem_definidas', label: 'Lisas ou bem definidas', points: 0, texto: 'margens bem definidas' },
    { value: 'mal_definidas', label: 'Mal definidas', points: 0, texto: 'margens mal definidas' },
    { value: 'lobuladas', label: 'Lobuladas ou irregulares', points: 2, texto: 'margens lobuladas/irregulares' },
    { value: 'extensao_extra', label: 'Extensão extra-tireoidiana', points: 3, texto: 'com extensão extra-tireoidiana' },
  ] as TIRADSOption[],
  
  focos: [
    { value: 'nenhum', label: 'Nenhum ou artefatos em cauda de cometa', points: 0, texto: 'sem focos ecogênicos no seu interior' },
    { value: 'macrocalcificacoes', label: 'Macrocalcificações', points: 1, texto: 'com macrocalcificações' },
    { value: 'perifericas', label: 'Calcificações periféricas (casca de ovo)', points: 2, texto: 'com calcificações periféricas' },
    { value: 'punctiformes', label: 'Focos ecogênicos punctiformes', points: 3, texto: 'com focos ecogênicos punctiformes' },
  ] as TIRADSOption[],
  
  localizacao: [
    { value: 'ld_sup', label: 'Lobo direito - terço superior', texto: 'localizado no terço superior do lobo direito' },
    { value: 'ld_med', label: 'Lobo direito - terço médio', texto: 'localizado no terço médio do lobo direito' },
    { value: 'ld_inf', label: 'Lobo direito - terço inferior', texto: 'localizado no terço inferior do lobo direito' },
    { value: 'le_sup', label: 'Lobo esquerdo - terço superior', texto: 'localizado no terço superior do lobo esquerdo' },
    { value: 'le_med', label: 'Lobo esquerdo - terço médio', texto: 'localizado no terço médio do lobo esquerdo' },
    { value: 'le_inf', label: 'Lobo esquerdo - terço inferior', texto: 'localizado no terço inferior do lobo esquerdo' },
    { value: 'istmo', label: 'Istmo', texto: 'localizado no istmo' },
  ] as (Omit<TIRADSOption, 'points'> & { points?: number })[],
}

export const getTIRADSLevel = (points: number): { level: number; category: string; risk: string } => {
  if (points === 0) return { level: 1, category: 'TR1 - Benigno', risk: '< 2%' }
  if (points === 2) return { level: 2, category: 'TR2 - Não suspeito', risk: '< 2%' }
  if (points === 3) return { level: 3, category: 'TR3 - Levemente suspeito', risk: '5%' }
  if (points >= 4 && points <= 6) return { level: 4, category: 'TR4 - Moderadamente suspeito', risk: '5-20%' }
  return { level: 5, category: 'TR5 - Altamente suspeito', risk: '> 20%' }
}

export const getTIRADSRecommendation = (level: number, maxDimension: number): string => {
  switch (level) {
    case 1:
      return 'Sem necessidade de PAAF ou seguimento'
    case 2:
      return 'Sem necessidade de PAAF ou seguimento'
    case 3:
      if (maxDimension >= 2.5) return 'PAAF recomendada (≥ 2,5 cm)'
      if (maxDimension >= 1.5) return 'Seguimento recomendado (≥ 1,5 cm)'
      return 'Sem necessidade de PAAF ou seguimento (< 1,5 cm)'
    case 4:
      if (maxDimension >= 1.5) return 'PAAF recomendada (≥ 1,5 cm)'
      if (maxDimension >= 1.0) return 'Seguimento recomendado (≥ 1,0 cm)'
      return 'Sem necessidade de PAAF ou seguimento (< 1,0 cm)'
    case 5:
      if (maxDimension >= 1.0) return 'PAAF recomendada (≥ 1,0 cm)'
      if (maxDimension >= 0.5) return 'Seguimento recomendado ou PAAF (≥ 0,5 cm)'
      return 'Seguimento anual pode ser considerado (< 0,5 cm)'
    default:
      return ''
  }
}

// Helper to get TI-RADS option from dynamic or hardcoded source
const getTIRADOption = (category: keyof typeof tiradOptions, value: string, options?: RADSOptionsMap) => {
  if (options && options[category]) {
    return options[category].find(o => o.value === value)
  }
  return tiradOptions[category]?.find(o => o.value === value)
}

export const calculateTIRADSPoints = (nodule: NoduleData, options?: RADSOptionsMap): number => {
  const getPoints = (category: keyof typeof tiradOptions, value: string): number => {
    const opt = getTIRADOption(category, value, options) as any
    // Handle both 'pontos' (from DB) and 'points' (from hardcoded)
    return opt?.pontos ?? opt?.points ?? 0
  }
  
  return (
    getPoints('composicao', nodule.composicao) +
    getPoints('ecogenicidade', nodule.ecogenicidade) +
    getPoints('formato', nodule.formato) +
    getPoints('margens', nodule.margens) +
    getPoints('focos', nodule.focos)
  )
}

export const getOptionTexto = (category: keyof typeof tiradOptions, value: string, options?: RADSOptionsMap): string => {
  const opt = getTIRADOption(category, value, options)
  return opt?.texto ?? ''
}

export const formatMeasurement = (value: number): string => {
  return value.toFixed(1).replace('.', ',')
}

export const generateNoduleDescription = (nodule: NoduleData, index: number, options?: RADSOptionsMap): string => {
  const composicaoTexto = getOptionTexto('composicao', nodule.composicao, options)
  const ecogenicidadeTexto = getOptionTexto('ecogenicidade', nodule.ecogenicidade, options)
  const formatoTexto = getOptionTexto('formato', nodule.formato, options)
  const margensTexto = getOptionTexto('margens', nodule.margens, options)
  const focosTexto = getOptionTexto('focos', nodule.focos, options)
  const localizacaoTexto = getOptionTexto('localizacao', nodule.localizacao, options)
  
  const medidasFormatadas = nodule.medidas.map(m => formatMeasurement(m)).join(' x ')
  
  const points = calculateTIRADSPoints(nodule, options)
  const tirads = getTIRADSLevel(points)
  
  return `N${index + 1} - Nódulo ${composicaoTexto}, ${ecogenicidadeTexto}, ${formatoTexto}, ${margensTexto} e ${focosTexto}, medindo cerca de ${medidasFormatadas} cm, ${localizacaoTexto}. ACR TI-RADS: ${tirads.level}.`
}

export const generateImpression = (noduleCount: number): string => {
  if (noduleCount === 1) {
    return '- Nódulo tireoidiano acima descrito.'
  }
  return '- Nódulos tireoidianos acima descritos.'
}

export const createEmptyNodule = (): NoduleData => ({
  composicao: 'solido',
  ecogenicidade: 'hipoecogenico',
  formato: 'paralelo',
  margens: 'bem_definidas',
  focos: 'nenhum',
  localizacao: 'ld_med',
  medidas: [1.0, 1.0, 1.0],
})

// ============================================
// BI-RADS MAMOGRAFIA (MG) Classification System
// ============================================

export interface BIRADSMGNodulo {
  densidade: string
  forma: string
  margens: string
  medidas: [number, number, number]
  lado: string
  localizacao: string
  temComparacao: boolean
  dataExameAnterior: string | null
  estadoNodulo: 'estavel' | 'cresceu' | 'diminuiu' | 'novo'
}

export interface BIRADSMGCalcificacao {
  tipo: string
  morfologia?: string
  distribuicao?: string
  lado: string
  localizacao: string
}

export interface BIRADSMGData {
  // === INDICAÇÃO CLÍNICA ===
  indicacao: {
    tipo: 'rastreamento' | 'diagnostica'
    motivoDiagnostica?: string
    historiaFamiliar: boolean
    antecedentes: {
      neoplasiaCirurgiaConservadora?: 'direita' | 'esquerda' | null
      neoplasiaMastectomia?: 'direita' | 'esquerda' | null
      mamoplastia: boolean
    }
  }
  
  // === ANÁLISE ===
  pele: 'normal' | 'alterada'
  peleDescricao?: string
  parenquima: string
  
  distorcaoArquitetural: {
    presente: boolean
    tipo?: string
    lado?: string
    localizacao?: string
  }
  assimetria: {
    presente: boolean
    tipo?: string
    lado?: string
    localizacao?: string
  }
  nodulos: BIRADSMGNodulo[]
  calcificacoes: {
    presente: boolean
    tipo?: string
    morfologia?: string
    distribuicao?: string
    lado?: string
    localizacao?: string
  }
  linfonodomegalias: {
    presente: boolean
    lado?: string
    localizacao?: string
  }
  linfonodoIntramamario: {
    presente: boolean
    lado?: string
  }
  
  prolongamentosAxilares: 'normal' | 'alterado'
  prolongamentosDescricao?: string
  
  // === ESTUDO COMPARATIVO ===
  estudoComparativo: {
    tipo: 'sem_alteracoes' | 'nao_disponivel' | 'primeira' | 'diferencas_tecnicas' | 'tamanho_reduzido' | 'incompleto'
    dataExameAnterior?: string
  }
  
  // === NOTAS ===
  notas: {
    densaMamasUS: boolean
    densaMamasCorrelacao: boolean
    outraObservacao?: string
  }
  
  recomendacaoManual?: {
    ativo: boolean
    categoria: string
    lado?: 'direita' | 'esquerda' | 'bilateral'
    mesesControle?: 6 | 12
  }
}

// Interface para opções de recomendação
export interface BIRADSRecomendacaoOption {
  value: string
  label: string
  texto: string
  usaLado?: boolean
  usaMeses?: boolean
}

export const biradsMGOptions = {
  // INDICAÇÃO CLÍNICA
  tipoIndicacao: [
    { value: 'rastreamento', label: 'Mamografia de rastreamento', texto: 'Mamografia de rastreamento.' },
    { value: 'diagnostica', label: 'Mamografia diagnóstica', texto: 'Mamografia diagnóstica' },
  ] as BIRADSOption[],

  antecedentes: [
    { value: 'cirurgia_conservadora_direita', label: 'Neoplasia + Cirurgia conservadora à direita', texto: 'Antecedente de neoplasia mamária e cirurgia conservadora à direita.' },
    { value: 'cirurgia_conservadora_esquerda', label: 'Neoplasia + Cirurgia conservadora à esquerda', texto: 'Antecedente de neoplasia mamária e cirurgia conservadora à esquerda.' },
    { value: 'mastectomia_direita', label: 'Neoplasia + Mastectomia à direita', texto: 'Antecedente de neoplasia mamária e mastectomia à direita.' },
    { value: 'mastectomia_esquerda', label: 'Neoplasia + Mastectomia à esquerda', texto: 'Antecedente de neoplasia mamária e mastectomia à esquerda.' },
    { value: 'mamoplastia', label: 'Antecedente de mamoplastia', texto: 'Antecedente de mamoplastia.' },
  ] as BIRADSOption[],

  // ESTUDO COMPARATIVO
  estudoComparativo: [
    { value: 'sem_alteracoes', label: 'Sem alterações significativas', texto: 'Em relação ao exame anterior de {DATA}, não se observam alterações significativas.' },
    { value: 'nao_disponivel', label: 'Não disponível', texto: 'Exames anteriores não disponíveis para estudo comparativo.' },
    { value: 'primeira', label: 'Primeira mamografia', texto: 'Primeira mamografia.' },
    { value: 'diferencas_tecnicas', label: 'Diferenças técnicas', texto: 'Exame anterior apresentando diferenças técnicas, prejudicando o estudo comparativo.' },
    { value: 'tamanho_reduzido', label: 'Documentação em tamanho reduzido', texto: 'Exame anterior com documentação em tamanho reduzido, prejudicando o estudo comparativo.' },
    { value: 'incompleto', label: 'Documentação incompleta', texto: 'Documentação radiográfica incompleta do exame anterior, impossibilitando o estudo comparativo.' },
  ] as BIRADSOption[],

  // NOTAS
  notas: [
    { value: 'us_densas_palpavel', label: 'US útil em mamas densas', texto: 'Obs.: A ultrassonografia pode ser útil em mamas densas se houver alterações palpáveis ou se a paciente apresentar risco elevado para câncer de mama.' },
    { value: 'us_densas_correlacao', label: 'Baixa sensibilidade em mamas densas', texto: 'Obs.: A mamografia possui baixa sensibilidade em mamas densas. Recomenda-se correlação ultrassonográfica.' },
  ] as BIRADSOption[],

  // RECOMENDAÇÃO MANUAL
  recomendacaoManual: [
    { value: '0-assimetria-compressao', label: 'BI-RADS 0 - Assimetria + compressão', texto: 'Considerar compressão localizada em craniocaudal e mediolateral da assimetria na mama {lado}.', usaLado: true },
    { value: '0-assimetria-ultrassom', label: 'BI-RADS 0 - Assimetria + ultrassom', texto: 'Considerar complementação com estudo ultrassonográfico da mama {lado}.', usaLado: true },
    { value: '0-calcificacao', label: 'BI-RADS 0 - Microcalcificações', texto: 'Considerar incidências magnificadas em craniocaudal e perfil da mama {lado}.', usaLado: true },
    { value: '0-nodulo', label: 'BI-RADS 0 - Nódulo', texto: 'Considerar complementação com estudo ultrassonográfico da mama {lado}.', usaLado: true },
    { value: '1', label: 'BI-RADS 1', texto: 'Na ausência de achados clínicos, considerar controle de rotina de acordo com a faixa etária.' },
    { value: '2', label: 'BI-RADS 2', texto: 'Na ausência de achados clínicos, considerar controle de rotina de acordo com a faixa etária.' },
    { value: '3', label: 'BI-RADS 3', texto: 'Na ausência de achados clínicos, considerar novo controle em {meses} meses.', usaMeses: true },
    { value: '4', label: 'BI-RADS 4', texto: 'Estudo histopatológico deve ser considerado.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.' },
    { value: '5', label: 'BI-RADS 5', texto: 'Recomenda-se prosseguir investigação com estudo histopatológico.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.' },
  ] as BIRADSRecomendacaoOption[],

  // PARÊNQUIMA
  parenquima: [
    { value: 'adiposas', label: 'Mamas predominantemente adiposas', texto: 'Mamas predominantemente adiposas.' },
    { value: 'fibroglandulares', label: 'Densidades fibroglandulares esparsas', texto: 'Mamas com densidades fibroglandulares esparsas.' },
    { value: 'heterogeneamente_densas', label: 'Heterogeneamente densas', texto: 'Mamas heterogeneamente densas, o que pode ocultar pequenos nódulos.' },
    { value: 'extremamente_densas', label: 'Extremamente densas', texto: 'Mamas extremamente densas, o que reduz a sensibilidade mamográfica.' },
  ] as BIRADSOption[],

  distorcaoArquitetural: [
    { value: 'sitio_cirurgico', label: 'Em sítio cirúrgico', texto: 'distorção arquitetural em sítio cirúrgico', suspeicao: 'benigno' },
    { value: 'fora_sitio', label: 'Fora de sítio cirúrgico', texto: 'distorção arquitetural fora de sítio cirúrgico', suspeicao: 'alto' },
    { value: 'rearranjo', label: 'Rearranjo arquitetural', texto: 'rearranjo arquitetural', suspeicao: 'indeterminado' },
  ] as BIRADSOption[],

  assimetria: [
    { value: 'assimetria', label: 'Assimetria', texto: 'assimetria', suspeicao: 'indeterminado' },
    { value: 'focal', label: 'Assimetria focal', texto: 'assimetria focal', suspeicao: 'indeterminado' },
    { value: 'global', label: 'Assimetria global', texto: 'assimetria global', suspeicao: 'benigno' },
    { value: 'em_desenvolvimento', label: 'Assimetria em desenvolvimento', texto: 'assimetria em desenvolvimento', suspeicao: 'suspeito' },
  ] as BIRADSOption[],

  densidade: [
    { value: 'hiperdenso', label: 'Hiperdenso', texto: 'hiperdenso', suspeicao: 'suspeito' },
    { value: 'isodenso', label: 'Isodenso', texto: 'isodenso', suspeicao: 'indeterminado' },
    { value: 'hipodenso', label: 'Hipodenso', texto: 'hipodenso', suspeicao: 'benigno' },
    { value: 'adiposo', label: 'Com conteúdo adiposo', texto: 'com conteúdo adiposo', suspeicao: 'benigno_definitivo' },
  ] as BIRADSOption[],

  formaMG: [
    { value: 'oval', label: 'Oval', texto: 'oval', suspeicao: 'benigno' },
    { value: 'redondo', label: 'Redondo', texto: 'redondo', suspeicao: 'benigno' },
    { value: 'irregular', label: 'Irregular', texto: 'irregular', suspeicao: 'suspeito' },
  ] as BIRADSOption[],

  margensMG: [
    { value: 'circunscrito', label: 'Circunscrito', texto: 'de margens circunscritas', suspeicao: 'benigno' },
    { value: 'obscurecido', label: 'Obscurecido', texto: 'de margens obscurecidas', suspeicao: 'indeterminado' },
    { value: 'microlobulado', label: 'Microlobulado', texto: 'de margens microlobuladas', suspeicao: 'suspeito' },
    { value: 'indistinto', label: 'Indistinto', texto: 'de margens indistintas', suspeicao: 'suspeito' },
    { value: 'espiculado', label: 'Espiculado', texto: 'de margens espiculadas', suspeicao: 'alto' },
  ] as BIRADSOption[],

  calcificacoes: [
    { value: 'benignas', label: 'Calcificações tipicamente benignas', texto: 'Calcificações de características tipicamente benignas', suspeicao: 'benigno' },
    { value: 'benignas_vasculares', label: 'Benignas, algumas vasculares', texto: 'Calcificações de características tipicamente benignas, algumas vasculares', suspeicao: 'benigno' },
    { value: 'vasculares', label: 'Calcificações vasculares', texto: 'Calcificações vasculares', suspeicao: 'benigno' },
    { value: 'leite_calcio', label: 'Aspecto de "leite de cálcio"', texto: 'Calcificações de características tipicamente benignas, algumas assumindo morfologia linear no perfil, sugerindo "leite de cálcio" intracístico', suspeicao: 'benigno' },
    { value: 'mastopatia', label: 'Mastopatia secretória', texto: 'Calcificações compatíveis com mastopatia secretória', suspeicao: 'benigno' },
    { value: 'suspeitas', label: 'Calcificações suspeitas', texto: 'Calcificações suspeitas', suspeicao: 'suspeito' },
  ] as BIRADSOption[],

  morfologiaCalcificacoes: [
    { value: 'amorfa', label: 'Amorfa', texto: 'de morfologia amorfa', suspeicao: 'suspeito' },
    { value: 'grosseira_heterogenea', label: 'Grosseira heterogênea', texto: 'de morfologia grosseira heterogênea', suspeicao: 'indeterminado' },
    { value: 'puntiforme', label: 'Puntiforme', texto: 'de morfologia puntiforme', suspeicao: 'indeterminado' },
    { value: 'pleomorfica', label: 'Pleomórfica fina', texto: 'de morfologia pleomórfica fina', suspeicao: 'alto' },
    { value: 'linear_ramificada', label: 'Linear fina/ramificada', texto: 'de morfologia linear fina/ramificada', suspeicao: 'alto' },
  ] as BIRADSOption[],

  distribuicaoCalcificacoes: [
    { value: 'difusa', label: 'Difusa', texto: 'de distribuição difusa', suspeicao: 'benigno' },
    { value: 'regional', label: 'Regional', texto: 'de distribuição regional', suspeicao: 'indeterminado' },
    { value: 'agrupada', label: 'Agrupada', texto: 'de distribuição agrupada', suspeicao: 'suspeito' },
    { value: 'linear', label: 'Linear', texto: 'de distribuição linear', suspeicao: 'suspeito' },
    { value: 'segmentar', label: 'Segmentar', texto: 'de distribuição segmentar', suspeicao: 'alto' },
  ] as BIRADSOption[],

  localizacaoMG: [
    { value: 'qsl', label: 'Quadrante súpero-lateral', texto: 'no quadrante súpero-lateral' },
    { value: 'qsm', label: 'Quadrante súpero-medial', texto: 'no quadrante súpero-medial' },
    { value: 'qil', label: 'Quadrante ínfero-lateral', texto: 'no quadrante ínfero-lateral' },
    { value: 'qim', label: 'Quadrante ínfero-medial', texto: 'no quadrante ínfero-medial' },
    { value: 'retroareolar', label: 'Retroareolar', texto: 'na região retroareolar' },
    { value: 'prolongamento', label: 'Prolongamento axilar', texto: 'no prolongamento axilar' },
  ] as BIRADSOption[],

  ladoMG: [
    { value: 'direita', label: 'Mama direita', texto: 'da mama direita' },
    { value: 'esquerda', label: 'Mama esquerda', texto: 'da mama esquerda' },
    { value: 'bilateral', label: 'Bilateral', texto: 'bilaterais' },
  ] as BIRADSOption[],

  linfonodomegalias: [
    { value: 'axilar', label: 'Axilar', texto: 'na região axilar' },
    { value: 'intramamario', label: 'Intramamário', texto: 'intramamário' },
  ] as BIRADSOption[],

  recomendacoesBirads0: [
    { value: '0-assimetria-compressao', label: 'Assimetria → Compressão localizada', texto: 'Avaliação adicional com incidências complementares (compressão localizada) recomendada.' },
    { value: '0-assimetria-ultrassom', label: 'Assimetria → Ultrassonografia', texto: 'Avaliação adicional com ultrassonografia mamária recomendada.' },
    { value: '0-calcificacao', label: 'Calcificação → Magnificação', texto: 'Avaliação adicional com magnificação recomendada.' },
    { value: '0-nodulo-usg', label: 'Nódulo → Ultrassonografia', texto: 'Avaliação adicional com ultrassonografia mamária recomendada para caracterização do nódulo.' },
    { value: '0-comparacao', label: 'Necessita comparação', texto: 'Necessária comparação com exames anteriores.' },
  ] as BIRADSOption[],
}

// Helper to get MG option from dynamic or hardcoded source
const getMGOption = (category: keyof typeof biradsMGOptions, value: string, options?: RADSOptionsMap) => {
  if (options && options[category]) {
    return options[category].find(o => o.value === value)
  }
  return (biradsMGOptions as any)[category]?.find((o: any) => o.value === value)
}

// Avaliar nódulo de mamografia
const evaluateMGNodulo = (nodulo: BIRADSMGNodulo, options?: RADSOptionsMap): number | string => {
  const getFormaOpt = getMGOption('formaMG', nodulo.forma, options)
  const getMargensOpt = getMGOption('margensMG', nodulo.margens, options)

  // Se cresceu → 4A
  if (nodulo.temComparacao && nodulo.estadoNodulo === 'cresceu') {
    return '4A'
  }

  // Margens espiculadas → 5
  if (getMargensOpt?.suspeicao === 'alto') {
    return 5
  }

  // Forma irregular + margens suspeitas → 4C
  if (getFormaOpt?.suspeicao === 'suspeito' && getMargensOpt?.suspeicao === 'suspeito') {
    return '4C'
  }

  // Margens indistintas/microlobuladas → 4B
  if (getMargensOpt?.suspeicao === 'suspeito') {
    return '4B'
  }

  // Forma irregular isolada → 4A
  if (getFormaOpt?.suspeicao === 'suspeito') {
    return '4A'
  }

  // NÓDULO COM CONTEÚDO ADIPOSO → BI-RADS 2 DIRETO (lipoma/natureza lipomatosa)
  if (nodulo.densidade === 'adiposo') {
    return 2
  }

  // Características benignas (não adiposo)
  const isBenigno = 
    (nodulo.forma === 'oval' || nodulo.forma === 'redondo') &&
    nodulo.margens === 'circunscrito' &&
    nodulo.densidade === 'hipodenso'

  if (isBenigno) {
    if (nodulo.temComparacao && nodulo.estadoNodulo === 'estavel') {
      const tempoMeses = calcularTempoSeguimento(nodulo.dataExameAnterior)
      if (tempoMeses >= 24) return 2
    }
    return 3
  }

  // Default: provavelmente benigno
  return 3
}

// Avaliar categoria final BI-RADS MG
export const evaluateBIRADSMG = (data: BIRADSMGData, options?: RADSOptionsMap): number | string => {
  // Se tem recomendação manual ativada
  if (data.recomendacaoManual?.ativo && data.recomendacaoManual.categoria) {
    return 0
  }

  const categoryOrder = [0, 1, 2, 3, '4A', '4B', '4C', 5, 6]
  let worstIndex = 1 // Começa com BI-RADS 1 (sem achados)

  // Calcificações suspeitas
  if (data.calcificacoes.presente && data.calcificacoes.tipo === 'suspeitas') {
    const morfOpt = getMGOption('morfologiaCalcificacoes', data.calcificacoes.morfologia || '', options)
    const distOpt = getMGOption('distribuicaoCalcificacoes', data.calcificacoes.distribuicao || '', options)
    
    // Pleomórfica/linear + segmentar/linear → 4C ou 5
    if (morfOpt?.suspeicao === 'alto') {
      if (distOpt?.suspeicao === 'alto') {
        const idx = categoryOrder.indexOf(5)
        worstIndex = Math.max(worstIndex, idx)
      } else {
        const idx = categoryOrder.indexOf('4C')
        worstIndex = Math.max(worstIndex, idx)
      }
    } else if (morfOpt?.suspeicao === 'suspeito') {
      const idx = categoryOrder.indexOf('4B')
      worstIndex = Math.max(worstIndex, idx)
    } else {
      const idx = categoryOrder.indexOf('4A')
      worstIndex = Math.max(worstIndex, idx)
    }
  } else if (data.calcificacoes.presente) {
    // Calcificações benignas
    const idx = categoryOrder.indexOf(2)
    worstIndex = Math.max(worstIndex, idx)
  }

  // Distorção arquitetural
  if (data.distorcaoArquitetural.presente) {
    const tipoOpt = getMGOption('distorcaoArquitetural', data.distorcaoArquitetural.tipo || '', options)
    if (tipoOpt?.suspeicao === 'alto') {
      const idx = categoryOrder.indexOf('4B')
      worstIndex = Math.max(worstIndex, idx)
    } else if (tipoOpt?.suspeicao === 'benigno') {
      const idx = categoryOrder.indexOf(2)
      worstIndex = Math.max(worstIndex, idx)
    }
  }

  // Assimetria
  if (data.assimetria.presente) {
    const tipoOpt = getMGOption('assimetria', data.assimetria.tipo || '', options)
    if (tipoOpt?.suspeicao === 'suspeito') {
      const idx = categoryOrder.indexOf('4A')
      worstIndex = Math.max(worstIndex, idx)
    } else {
      // Assimetria sem comparação → BI-RADS 0
      return 0
    }
  }

  // Nódulos
  for (const nodulo of data.nodulos) {
    const cat = evaluateMGNodulo(nodulo, options)
    const idx = categoryOrder.indexOf(cat)
    worstIndex = Math.max(worstIndex, idx)
  }

  // Linfonodomegalias axilares (sem tumor primário) → suspeito
  if (data.linfonodomegalias.presente) {
    const idx = categoryOrder.indexOf('4A')
    worstIndex = Math.max(worstIndex, idx)
  }

  return categoryOrder[worstIndex]
}

// Gerar texto de achados MG
export const generateBIRADSMGAchados = (data: BIRADSMGData, options?: RADSOptionsMap): string => {
  const sections: string[] = []

  // Pele
  if (data.pele === 'alterada' && data.peleDescricao) {
    sections.push(`Pele: ${data.peleDescricao}`)
  } else {
    sections.push('Pele sem alterações detectáveis ao método.')
  }

  // Parênquima
  const parenquimaOpt = getMGOption('parenquima', data.parenquima, options)
  sections.push(parenquimaOpt?.texto || 'Mamas com densidades fibroglandulares esparsas.')

  // Calcificações (logo após parênquima, antes de outros achados)
  if (data.calcificacoes.presente) {
    const tipoOpt = getMGOption('calcificacoes', data.calcificacoes.tipo || '', options)
    let calcTexto = tipoOpt?.texto || ''
    
    if (data.calcificacoes.tipo === 'suspeitas' && data.calcificacoes.morfologia) {
      const morfOpt = getMGOption('morfologiaCalcificacoes', data.calcificacoes.morfologia || '', options)
      const distOpt = getMGOption('distribuicaoCalcificacoes', data.calcificacoes.distribuicao || '', options)
      const locOpt = getMGOption('localizacaoMG', data.calcificacoes.localizacao || '', options)
      const ladoOpt = getMGOption('ladoMG', data.calcificacoes.lado || '', options)
      calcTexto = `Calcificações ${morfOpt?.texto || ''}, ${distOpt?.texto || ''}, localizadas ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`
    } else {
      const ladoOpt = getMGOption('ladoMG', data.calcificacoes.lado || '', options)
      calcTexto = `${tipoOpt?.texto || ''} ${ladoOpt?.texto || ''}.`
    }
    sections.push(calcTexto)
  }

  // Linfonodo intramamário
  if (data.linfonodoIntramamario.presente) {
    const ladoOpt = getMGOption('ladoMG', data.linfonodoIntramamario.lado || '', options)
    if (data.linfonodoIntramamario.lado === 'bilateral') {
      sections.push('Linfonodos intramamários bilaterais de aspecto habitual.')
    } else {
      sections.push(`Linfonodo intramamário de aspecto habitual ${ladoOpt?.texto?.replace('da mama ', 'à ') || ''}.`)
    }
  }

  // Verificar se há achados suspeitos
  const temAchadosSuspeitos = data.distorcaoArquitetural.presente || 
    data.assimetria.presente || 
    data.nodulos.length > 0 || 
    (data.calcificacoes.presente && data.calcificacoes.tipo === 'suspeitas') ||
    data.linfonodomegalias.presente

  if (!temAchadosSuspeitos) {
    sections.push('Não se observam distorções da arquitetura mamária, nódulos ou calcificações suspeitas.')
  } else {
    // Distorção arquitetural
    if (data.distorcaoArquitetural.presente) {
      const tipoOpt = getMGOption('distorcaoArquitetural', data.distorcaoArquitetural.tipo || '', options)
      const locOpt = getMGOption('localizacaoMG', data.distorcaoArquitetural.localizacao || '', options)
      const ladoOpt = getMGOption('ladoMG', data.distorcaoArquitetural.lado || '', options)
      sections.push(`Observa-se ${tipoOpt?.texto || ''} ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`)
    }

    // Assimetria
    if (data.assimetria.presente) {
      const tipoOpt = getMGOption('assimetria', data.assimetria.tipo || '', options)
      const locOpt = getMGOption('localizacaoMG', data.assimetria.localizacao || '', options)
      const ladoOpt = getMGOption('ladoMG', data.assimetria.lado || '', options)
      sections.push(`Observa-se ${tipoOpt?.texto || ''} ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`)
    }

    // Nódulos
    if (data.nodulos.length > 0) {
      const nodulosTexto = data.nodulos.map((n, i) => {
        const densOpt = getMGOption('densidade', n.densidade, options)
        const formaOpt = getMGOption('formaMG', n.forma, options)
        const margensOpt = getMGOption('margensMG', n.margens, options)
        const locOpt = getMGOption('localizacaoMG', n.localizacao, options)
        const ladoOpt = getMGOption('ladoMG', n.lado, options)
        const medidas = n.medidas.map(m => formatMeasurement(m)).join(' x ')
        
        let texto = `N${i + 1} - Nódulo ${densOpt?.texto || ''}, ${formaOpt?.texto || ''}, ${margensOpt?.texto || ''}, medindo ${medidas} cm, localizado ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`
        
        if (n.temComparacao && n.dataExameAnterior) {
          const dataFormatada = new Date(n.dataExameAnterior).toLocaleDateString('pt-BR')
          const tempoMeses = calcularTempoSeguimento(n.dataExameAnterior)
          const tempoFormatado = formatarTempoSeguimento(tempoMeses)
          
          if (n.estadoNodulo === 'estavel') {
            texto += ` Estável em relação ao exame de ${dataFormatada} (${tempoFormatado} de seguimento).`
          } else if (n.estadoNodulo === 'cresceu') {
            texto += ` Apresentou crescimento em relação ao exame de ${dataFormatada}.`
          } else if (n.estadoNodulo === 'diminuiu') {
            texto += ` Apresentou redução em relação ao exame de ${dataFormatada}.`
          }
        }
        
        return texto
      }).join('\n')
      sections.push(nodulosTexto)
    }

    // Linfonodomegalias
    if (data.linfonodomegalias.presente) {
      const ladoOpt = getMGOption('ladoMG', data.linfonodomegalias.lado || '', options)
      const locOpt = getMGOption('linfonodomegalias', data.linfonodomegalias.localizacao || '', options)
      sections.push(`Linfonodomegalias: Presente ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`)
    }
  }

  // Prolongamentos axilares
  if (data.prolongamentosAxilares === 'alterado' && data.prolongamentosDescricao) {
    sections.push(`Prolongamentos axilares: ${data.prolongamentosDescricao}`)
  } else {
    sections.push('Prolongamentos axilares sem particularidades.')
  }

  return sections.join('\n')
}

// Gerar impressão MG
export const generateBIRADSMGImpression = (data: BIRADSMGData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const categoryNum = typeof biradsCategory === 'string' ? biradsCategory : biradsCategory.toString()
  
  // BI-RADS 0 com recomendação manual
  if (categoryNum === '0' && data.recomendacaoManual?.ativo) {
    const recOpt = getMGOption('recomendacoesBirads0', data.recomendacaoManual?.categoria || '', options)
    return `Estudo mamográfico inconclusivo.\nClassificação: ACR BI-RADS 0.\n${recOpt?.texto || 'Avaliação adicional necessária.'}`
  }

  // Determinar achados para impressão
  const achados: string[] = []
  
  if (data.nodulos.length > 0) {
    // Separar nódulos adiposos (lipomatosos) dos demais
    const nodulosAdiposos = data.nodulos.filter(n => n.densidade === 'adiposo')
    const nodulosNaoAdiposos = data.nodulos.filter(n => n.densidade !== 'adiposo')
    
    // Nódulos adiposos → texto específico "natureza lipomatosa"
    if (nodulosAdiposos.length > 0) {
      const ladosAdiposos = [...new Set(nodulosAdiposos.map(n => n.lado))]
      if (nodulosAdiposos.length === 1) {
        const ladoTexto = ladosAdiposos[0] === 'direita' ? 'à direita' : 'à esquerda'
        achados.push(`Nódulo mamário de provável natureza lipomatosa ${ladoTexto}`)
      } else {
        const ladoTexto = ladosAdiposos.length > 1 ? 'bilaterais' : (ladosAdiposos[0] === 'direita' ? 'à direita' : 'à esquerda')
        achados.push(`Nódulos mamários de provável natureza lipomatosa ${ladoTexto}`)
      }
    }
    
    // Outros nódulos → texto padrão
    if (nodulosNaoAdiposos.length > 0) {
      const lados = [...new Set(nodulosNaoAdiposos.map(n => n.lado))]
      if (nodulosNaoAdiposos.length === 1) {
        achados.push(`Nódulo ${lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda'}`)
      } else {
        achados.push(`Nódulos ${lados.length > 1 ? 'nas mamas direita e esquerda' : (lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda')}`)
      }
    }
  }
  
  if (data.calcificacoes.presente && data.calcificacoes.tipo === 'suspeitas') {
    achados.push('Calcificações suspeitas')
  }
  
  if (data.distorcaoArquitetural.presente && data.distorcaoArquitetural.tipo === 'fora_sitio') {
    achados.push('Distorção arquitetural')
  }
  
  if (data.assimetria.presente && data.assimetria.tipo === 'em_desenvolvimento') {
    achados.push('Assimetria em desenvolvimento')
  }

  const achadosTexto = achados.length > 0 ? achados.join('. ') + '.' : ''

  switch (categoryNum) {
    case '0':
      return `Estudo mamográfico inconclusivo.\nClassificação: ACR BI-RADS 0.\nAvaliação adicional necessária.`

    case '1':
      return `Estudo mamográfico sem alterações.\nClassificação: ACR BI-RADS 1.\nA critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.`

    case '2':
      return `${achadosTexto || 'Achados benignos.'}\nClassificação: ACR BI-RADS 2.\nA critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.`

    case '3':
      return `${achadosTexto}\nClassificação: ACR BI-RADS 3 - Achado provavelmente benigno.\nRecomenda-se controle mamográfico em 6 meses.`

    case '4A':
    case '4B':
    case '4C':
      return `${achadosTexto}\nClassificação: ACR BI-RADS ${categoryNum} - Achado suspeito.\nEstudo histopatológico deve ser considerado.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.`

    case '5':
      return `${achadosTexto}\nClassificação: ACR BI-RADS 5 - Achado altamente sugestivo de malignidade.\nRecomenda-se prosseguir investigação com estudo histopatológico.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.`

    case '6':
      return `Malignidade conhecida.\nClassificação: ACR BI-RADS 6.\nTratamento oncológico adequado indicado.`

    default:
      return `Classificação: ACR BI-RADS ${biradsCategory}.`
  }
}

// Gerar indicação clínica
export const generateBIRADSMGIndicacao = (data: BIRADSMGData, options?: RADSOptionsMap): string => {
  const lines: string[] = []
  
  // Tipo de indicação
  if (data.indicacao.tipo === 'rastreamento') {
    lines.push('Mamografia de rastreamento.')
  } else {
    lines.push(`Mamografia diagnóstica: ${data.indicacao.motivoDiagnostica || ''}.`)
  }
  
  // História familiar
  if (data.indicacao.historiaFamiliar) {
    lines.push('História familiar positiva.')
  }
  
  // Antecedentes
  if (data.indicacao.antecedentes.neoplasiaCirurgiaConservadora) {
    const lado = data.indicacao.antecedentes.neoplasiaCirurgiaConservadora === 'direita' ? 'à direita' : 'à esquerda'
    lines.push(`Antecedente de neoplasia mamária e cirurgia conservadora ${lado}.`)
  }
  if (data.indicacao.antecedentes.neoplasiaMastectomia) {
    const lado = data.indicacao.antecedentes.neoplasiaMastectomia === 'direita' ? 'à direita' : 'à esquerda'
    lines.push(`Antecedente de neoplasia mamária e mastectomia ${lado}.`)
  }
  if (data.indicacao.antecedentes.mamoplastia) {
    lines.push('Antecedente de mamoplastia.')
  }
  
  return lines.join('\n')
}

// Gerar estudo comparativo
export const generateBIRADSMGComparativo = (data: BIRADSMGData, options?: RADSOptionsMap): string => {
  const opt = getMGOption('estudoComparativo', data.estudoComparativo.tipo, options)
  if (!opt) return ''
  
  if (data.estudoComparativo.tipo === 'sem_alteracoes' && data.estudoComparativo.dataExameAnterior) {
    const dataFormatada = new Date(data.estudoComparativo.dataExameAnterior).toLocaleDateString('pt-BR')
    return `Em relação ao exame anterior de ${dataFormatada}, não se observam alterações significativas.`
  }
  
  return opt.texto
}

// Gerar notas
export const generateBIRADSMGNotas = (data: BIRADSMGData, options?: RADSOptionsMap): string => {
  const lines: string[] = []
  
  if (data.notas.densaMamasUS) {
    const opt = getMGOption('notas', 'us_densas_palpavel', options)
    lines.push(opt?.texto || 'Obs.: A ultrassonografia pode ser útil em mamas densas se houver alterações palpáveis ou se a paciente apresentar risco elevado para câncer de mama.')
  }
  if (data.notas.densaMamasCorrelacao) {
    const opt = getMGOption('notas', 'us_densas_correlacao', options)
    lines.push(opt?.texto || 'Obs.: A mamografia possui baixa sensibilidade em mamas densas. Recomenda-se correlação ultrassonográfica.')
  }
  if (data.notas.outraObservacao) {
    lines.push(`Obs.: ${data.notas.outraObservacao}`)
  }
  
  return lines.join('\n')
}

// Gerar recomendação
export const generateBIRADSMGRecomendacao = (data: BIRADSMGData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  // Se recomendação manual ativa
  if (data.recomendacaoManual?.ativo && data.recomendacaoManual.categoria) {
    const opt = getMGOption('recomendacaoManual', data.recomendacaoManual.categoria, options)
    if (opt) {
      let texto = opt.texto
      if (opt.usa_lado && data.recomendacaoManual.lado) {
        const ladoTexto = data.recomendacaoManual.lado === 'bilateral' ? 'bilateralmente' : data.recomendacaoManual.lado
        texto = texto.replace('{lado}', ladoTexto)
      }
      if (opt.usa_meses && data.recomendacaoManual.mesesControle) {
        texto = texto.replace('{meses}', data.recomendacaoManual.mesesControle.toString())
      }
      return texto
    }
  }
  
  // Recomendação automática
  const categoryNum = typeof biradsCategory === 'number' ? biradsCategory : parseInt(biradsCategory.toString().charAt(0))
  
  if (categoryNum === 0) return 'Avaliação adicional necessária.'
  if (categoryNum <= 2) return 'Na ausência de achados clínicos, considerar controle de rotina de acordo com a faixa etária.'
  if (categoryNum === 3) return 'Na ausência de achados clínicos, considerar novo controle em 6 meses.'
  if (categoryNum >= 4) return 'Estudo histopatológico deve ser considerado.\nEm caso de realização de nova mamografia ou ultrassonografia mamária, é necessário trazer exames anteriores.'
  
  return ''
}

// Gerar laudo completo MG (texto simples)
export const generateBIRADSMGLaudoCompleto = (data: BIRADSMGData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const sections: string[] = []
  sections.push('MAMOGRAFIA DIGITAL')
  sections.push(`Indicação clínica:\n${generateBIRADSMGIndicacao(data, options)}`)
  sections.push(`Análise:\n${generateBIRADSMGAchados(data, options)}`)
  const comparativo = generateBIRADSMGComparativo(data, options)
  if (comparativo) sections.push(`Estudo Comparativo:\n${comparativo}`)
  sections.push(`Impressão diagnóstica:\n${generateBIRADSMGImpression(data, biradsCategory, options)}`)
  const recomendacao = generateBIRADSMGRecomendacao(data, biradsCategory, options)
  if (recomendacao) sections.push(`Recomendação:\n${recomendacao}`)
  const notas = generateBIRADSMGNotas(data, options)
  if (notas) sections.push(notas)
  return sections.join('\n\n')
}

// Gerar laudo completo MG com HTML formatado
export const generateBIRADSMGLaudoCompletoHTML = (data: BIRADSMGData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const sections: string[] = []
  
  // Título principal
  sections.push('<h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">MAMOGRAFIA DIGITAL</h2>')
  
  // Indicação clínica
  sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Indicação Clínica:</h3>')
  sections.push(`<p style="text-align: justify;">${generateBIRADSMGIndicacao(data, options).replace(/\n/g, '<br>')}</p>`)
  
  // Análise
  sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Análise:</h3>')
  sections.push(`<p style="text-align: justify;">${generateBIRADSMGAchados(data, options).replace(/\n/g, '<br>')}</p>`)
  
  // Estudo comparativo
  const comparativo = generateBIRADSMGComparativo(data, options)
  if (comparativo) {
    sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Estudo Comparativo:</h3>')
    sections.push(`<p style="text-align: justify;">${comparativo}</p>`)
  }
  
  // Impressão diagnóstica
  sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Impressão Diagnóstica:</h3>')
  sections.push(`<p style="text-align: justify;">${generateBIRADSMGImpression(data, biradsCategory, options).replace(/\n/g, '<br>')}</p>`)
  
  // Recomendação
  const recomendacao = generateBIRADSMGRecomendacao(data, biradsCategory, options)
  if (recomendacao) {
    sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Recomendação:</h3>')
    sections.push(`<p style="text-align: justify;">${recomendacao.replace(/\n/g, '<br>')}</p>`)
  }
  
  // Notas
  const notas = generateBIRADSMGNotas(data, options)
  if (notas) {
    sections.push(`<p style="margin-top: 18px; text-align: justify; font-style: italic;">${notas.replace(/\n/g, '<br>')}</p>`)
  }
  
  return sections.join('')
}

export const createEmptyBIRADSMGNodulo = (): BIRADSMGNodulo => ({
  densidade: 'igual',
  forma: 'oval',
  margens: 'circunscrito',
  medidas: [1.0, 1.0, 1.0],
  lado: 'direita',
  localizacao: 'qsl',
  temComparacao: false,
  dataExameAnterior: null,
  estadoNodulo: 'novo',
})

export const createEmptyBIRADSMGData = (): BIRADSMGData => ({
  indicacao: {
    tipo: 'rastreamento',
    historiaFamiliar: false,
    antecedentes: {
      neoplasiaCirurgiaConservadora: null,
      neoplasiaMastectomia: null,
      mamoplastia: false,
    },
  },
  pele: 'normal',
  parenquima: 'fibroglandulares',
  distorcaoArquitetural: { presente: false },
  assimetria: { presente: false },
  nodulos: [],
  calcificacoes: { presente: false },
  linfonodomegalias: { presente: false },
  linfonodoIntramamario: { presente: false },
  prolongamentosAxilares: 'normal',
  estudoComparativo: {
    tipo: 'sem_alteracoes',
  },
  notas: {
    densaMamasUS: false,
    densaMamasCorrelacao: false,
  },
  recomendacaoManual: {
    ativo: false,
    categoria: '2',
    lado: 'direita',
    mesesControle: 6,
  },
})
