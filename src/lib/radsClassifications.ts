// TI-RADS Classification System (ACR TI-RADS 2017)

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

// Avalia características suspeitas e retorna categoria 4A/4B/4C/5
const evaluateSuspiciousFeatures = (finding: BIRADSFindingData): number | string => {
  const getOption = (category: keyof typeof biradsUSGOptions, value: string) => {
    return biradsUSGOptions[category].find(o => o.value === value)
  }

  const forma = getOption('forma', finding.forma)
  const margens = getOption('margens', finding.margens)
  const eixo = getOption('eixo', finding.eixo)
  const sombra = getOption('sombra', finding.sombra)

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

export const evaluateBIRADSFinding = (finding: BIRADSFindingData): number | string => {
  const getOption = (category: keyof typeof biradsUSGOptions, value: string) => {
    return biradsUSGOptions[category].find(o => o.value === value)
  }

  const forma = getOption('forma', finding.forma)
  const margens = getOption('margens', finding.margens)
  const eixo = getOption('eixo', finding.eixo)
  const sombra = getOption('sombra', finding.sombra)

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

export const calculateBIRADSCategory = (findings: BIRADSFindingData[]): number | string => {
  if (findings.length === 0) return 0

  const categoryOrder = [0, 1, 2, 3, '4A', '4B', '4C', 5, 6]
  let worstIndex = 0

  for (const finding of findings) {
    const category = evaluateBIRADSFinding(finding)
    const categoryIndex = categoryOrder.indexOf(category)
    if (categoryIndex > worstIndex) {
      worstIndex = categoryIndex
    }
  }

  return categoryOrder[worstIndex]
}

export const getBIRADSOptionTexto = (category: keyof typeof biradsUSGOptions, value: string): string => {
  const options = biradsUSGOptions[category]
  const option = options.find(o => o.value === value)
  return option?.texto ?? ''
}

export const generateBIRADSFindingDescription = (finding: BIRADSFindingData, index: number): string => {
  const ecogenicidadeTexto = getBIRADSOptionTexto('ecogenicidade', finding.ecogenicidade)
  const formaTexto = getBIRADSOptionTexto('forma', finding.forma)
  const margensTexto = getBIRADSOptionTexto('margens', finding.margens)
  const eixoTexto = getBIRADSOptionTexto('eixo', finding.eixo)
  const sombraTexto = getBIRADSOptionTexto('sombra', finding.sombra)
  const localizacaoTexto = getBIRADSOptionTexto('localizacao', finding.localizacao)
  const ladoTexto = getBIRADSOptionTexto('lado', finding.lado)

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

export const generateBIRADSImpression = (findings: BIRADSFindingData[], biradsCategory: number | string): string => {
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

export const calculateTIRADSPoints = (nodule: NoduleData): number => {
  const getPoints = (category: keyof typeof tiradOptions, value: string): number => {
    const options = tiradOptions[category]
    const option = options.find(o => o.value === value)
    return option?.points ?? 0
  }
  
  return (
    getPoints('composicao', nodule.composicao) +
    getPoints('ecogenicidade', nodule.ecogenicidade) +
    getPoints('formato', nodule.formato) +
    getPoints('margens', nodule.margens) +
    getPoints('focos', nodule.focos)
  )
}

export const getOptionTexto = (category: keyof typeof tiradOptions, value: string): string => {
  const options = tiradOptions[category]
  const option = options.find(o => o.value === value)
  return option?.texto ?? ''
}

export const formatMeasurement = (value: number): string => {
  return value.toFixed(1).replace('.', ',')
}

export const generateNoduleDescription = (nodule: NoduleData, index: number): string => {
  const composicaoTexto = getOptionTexto('composicao', nodule.composicao)
  const ecogenicidadeTexto = getOptionTexto('ecogenicidade', nodule.ecogenicidade)
  const formatoTexto = getOptionTexto('formato', nodule.formato)
  const margensTexto = getOptionTexto('margens', nodule.margens)
  const focosTexto = getOptionTexto('focos', nodule.focos)
  const localizacaoTexto = getOptionTexto('localizacao', nodule.localizacao)
  
  const medidasFormatadas = nodule.medidas.map(m => formatMeasurement(m)).join(' x ')
  
  const points = calculateTIRADSPoints(nodule)
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
