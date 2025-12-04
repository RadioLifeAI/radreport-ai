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
    { value: 'alta', label: 'Alta densidade', texto: 'de alta densidade', suspeicao: 'suspeito' },
    { value: 'igual', label: 'Igual densidade', texto: 'de igual densidade', suspeicao: 'indeterminado' },
    { value: 'baixa', label: 'Baixa densidade', texto: 'de baixa densidade', suspeicao: 'benigno' },
    { value: 'gordura', label: 'Conteúdo gorduroso', texto: 'com conteúdo gorduroso', suspeicao: 'benigno' },
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

// Avaliar nódulo de mamografia
const evaluateMGNodulo = (nodulo: BIRADSMGNodulo): number | string => {
  const getDensidadeOpt = biradsMGOptions.densidade.find(o => o.value === nodulo.densidade)
  const getFormaOpt = biradsMGOptions.formaMG.find(o => o.value === nodulo.forma)
  const getMargensOpt = biradsMGOptions.margensMG.find(o => o.value === nodulo.margens)

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

  // Características benignas
  const isBeningno = 
    (nodulo.forma === 'oval' || nodulo.forma === 'redondo') &&
    nodulo.margens === 'circunscrito' &&
    (nodulo.densidade === 'baixa' || nodulo.densidade === 'gordura')

  if (isBeningno) {
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
export const evaluateBIRADSMG = (data: BIRADSMGData): number | string => {
  // Se tem recomendação manual ativada
  if (data.recomendacaoManual?.ativo && data.recomendacaoManual.categoria) {
    return 0
  }

  const categoryOrder = [0, 1, 2, 3, '4A', '4B', '4C', 5, 6]
  let worstIndex = 1 // Começa com BI-RADS 1 (sem achados)

  // Calcificações suspeitas
  if (data.calcificacoes.presente && data.calcificacoes.tipo === 'suspeitas') {
    const morfOpt = biradsMGOptions.morfologiaCalcificacoes.find(o => o.value === data.calcificacoes.morfologia)
    const distOpt = biradsMGOptions.distribuicaoCalcificacoes.find(o => o.value === data.calcificacoes.distribuicao)
    
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
    const tipoOpt = biradsMGOptions.distorcaoArquitetural.find(o => o.value === data.distorcaoArquitetural.tipo)
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
    const tipoOpt = biradsMGOptions.assimetria.find(o => o.value === data.assimetria.tipo)
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
    const cat = evaluateMGNodulo(nodulo)
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
export const generateBIRADSMGAchados = (data: BIRADSMGData): string => {
  const sections: string[] = []

  // Pele
  if (data.pele === 'alterada' && data.peleDescricao) {
    sections.push(`Pele: ${data.peleDescricao}`)
  } else {
    sections.push('Pele sem alterações detectáveis ao método.')
  }

  // Parênquima
  const parenquimaOpt = biradsMGOptions.parenquima.find(o => o.value === data.parenquima)
  sections.push(parenquimaOpt?.texto || 'Mamas com densidades fibroglandulares esparsas.')

  // Calcificações (logo após parênquima, antes de outros achados)
  if (data.calcificacoes.presente) {
    const tipoOpt = biradsMGOptions.calcificacoes.find(o => o.value === data.calcificacoes.tipo)
    let calcTexto = tipoOpt?.texto || ''
    
    if (data.calcificacoes.tipo === 'suspeitas' && data.calcificacoes.morfologia) {
      const morfOpt = biradsMGOptions.morfologiaCalcificacoes.find(o => o.value === data.calcificacoes.morfologia)
      const distOpt = biradsMGOptions.distribuicaoCalcificacoes.find(o => o.value === data.calcificacoes.distribuicao)
      const locOpt = biradsMGOptions.localizacaoMG.find(o => o.value === data.calcificacoes.localizacao)
      const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === data.calcificacoes.lado)
      calcTexto = `Calcificações ${morfOpt?.texto || ''}, ${distOpt?.texto || ''}, localizadas ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`
    } else {
      const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === data.calcificacoes.lado)
      calcTexto = `${tipoOpt?.texto || ''} ${ladoOpt?.texto || ''}.`
    }
    sections.push(calcTexto)
  }

  // Linfonodo intramamário
  if (data.linfonodoIntramamario.presente) {
    const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === data.linfonodoIntramamario.lado)
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
      const tipoOpt = biradsMGOptions.distorcaoArquitetural.find(o => o.value === data.distorcaoArquitetural.tipo)
      const locOpt = biradsMGOptions.localizacaoMG.find(o => o.value === data.distorcaoArquitetural.localizacao)
      const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === data.distorcaoArquitetural.lado)
      sections.push(`Observa-se ${tipoOpt?.texto || ''} ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`)
    }

    // Assimetria
    if (data.assimetria.presente) {
      const tipoOpt = biradsMGOptions.assimetria.find(o => o.value === data.assimetria.tipo)
      const locOpt = biradsMGOptions.localizacaoMG.find(o => o.value === data.assimetria.localizacao)
      const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === data.assimetria.lado)
      sections.push(`Observa-se ${tipoOpt?.texto || ''} ${locOpt?.texto || ''} ${ladoOpt?.texto || ''}.`)
    }

    // Nódulos
    if (data.nodulos.length > 0) {
      const nodulosTexto = data.nodulos.map((n, i) => {
        const densOpt = biradsMGOptions.densidade.find(o => o.value === n.densidade)
        const formaOpt = biradsMGOptions.formaMG.find(o => o.value === n.forma)
        const margensOpt = biradsMGOptions.margensMG.find(o => o.value === n.margens)
        const locOpt = biradsMGOptions.localizacaoMG.find(o => o.value === n.localizacao)
        const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === n.lado)
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
      const ladoOpt = biradsMGOptions.ladoMG.find(o => o.value === data.linfonodomegalias.lado)
      const locOpt = biradsMGOptions.linfonodomegalias.find(o => o.value === data.linfonodomegalias.localizacao)
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
export const generateBIRADSMGImpression = (data: BIRADSMGData, biradsCategory: number | string): string => {
  const categoryNum = typeof biradsCategory === 'string' ? biradsCategory : biradsCategory.toString()
  
  // BI-RADS 0 com recomendação manual
  if (categoryNum === '0' && data.recomendacaoManual?.ativo) {
    const recOpt = biradsMGOptions.recomendacoesBirads0.find(o => o.value === data.recomendacaoManual?.categoria)
    return `Estudo mamográfico inconclusivo.\nClassificação: ACR BI-RADS 0.\n${recOpt?.texto || 'Avaliação adicional necessária.'}`
  }

  // Determinar achados para impressão
  const achados: string[] = []
  
  if (data.nodulos.length > 0) {
    const lados = [...new Set(data.nodulos.map(n => n.lado))]
    if (data.nodulos.length === 1) {
      achados.push(`Nódulo ${lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda'}`)
    } else {
      achados.push(`Nódulos ${lados.length > 1 ? 'nas mamas direita e esquerda' : (lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda')}`)
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
export const generateBIRADSMGIndicacao = (data: BIRADSMGData): string => {
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
export const generateBIRADSMGComparativo = (data: BIRADSMGData): string => {
  const opt = biradsMGOptions.estudoComparativo.find(o => o.value === data.estudoComparativo.tipo)
  if (!opt) return ''
  
  if (data.estudoComparativo.tipo === 'sem_alteracoes' && data.estudoComparativo.dataExameAnterior) {
    const dataFormatada = new Date(data.estudoComparativo.dataExameAnterior).toLocaleDateString('pt-BR')
    return `Em relação ao exame anterior de ${dataFormatada}, não se observam alterações significativas.`
  }
  
  return opt.texto
}

// Gerar notas
export const generateBIRADSMGNotas = (data: BIRADSMGData): string => {
  const lines: string[] = []
  
  if (data.notas.densaMamasUS) {
    lines.push('Obs.: A ultrassonografia pode ser útil em mamas densas se houver alterações palpáveis ou se a paciente apresentar risco elevado para câncer de mama.')
  }
  if (data.notas.densaMamasCorrelacao) {
    lines.push('Obs.: A mamografia possui baixa sensibilidade em mamas densas. Recomenda-se correlação ultrassonográfica.')
  }
  if (data.notas.outraObservacao) {
    lines.push(`Obs.: ${data.notas.outraObservacao}`)
  }
  
  return lines.join('\n')
}

// Gerar recomendação
export const generateBIRADSMGRecomendacao = (data: BIRADSMGData, biradsCategory: number | string): string => {
  // Se recomendação manual ativa
  if (data.recomendacaoManual?.ativo && data.recomendacaoManual.categoria) {
    const opt = biradsMGOptions.recomendacaoManual.find(o => o.value === data.recomendacaoManual!.categoria)
    if (opt) {
      let texto = opt.texto
      if (opt.usaLado && data.recomendacaoManual.lado) {
        const ladoTexto = data.recomendacaoManual.lado === 'bilateral' ? 'bilateralmente' : data.recomendacaoManual.lado
        texto = texto.replace('{lado}', ladoTexto)
      }
      if (opt.usaMeses && data.recomendacaoManual.mesesControle) {
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
export const generateBIRADSMGLaudoCompleto = (data: BIRADSMGData, biradsCategory: number | string): string => {
  const sections: string[] = []
  sections.push('MAMOGRAFIA DIGITAL')
  sections.push(`Indicação clínica:\n${generateBIRADSMGIndicacao(data)}`)
  sections.push(`Análise:\n${generateBIRADSMGAchados(data)}`)
  const comparativo = generateBIRADSMGComparativo(data)
  if (comparativo) sections.push(`Estudo Comparativo:\n${comparativo}`)
  sections.push(`Impressão diagnóstica:\n${generateBIRADSMGImpression(data, biradsCategory)}`)
  const recomendacao = generateBIRADSMGRecomendacao(data, biradsCategory)
  if (recomendacao) sections.push(`Recomendação:\n${recomendacao}`)
  const notas = generateBIRADSMGNotas(data)
  if (notas) sections.push(notas)
  return sections.join('\n\n')
}

// Gerar laudo completo MG com HTML formatado
export const generateBIRADSMGLaudoCompletoHTML = (data: BIRADSMGData, biradsCategory: number | string): string => {
  const sections: string[] = []
  
  // Título principal
  sections.push('<h2 style="text-align: center; text-transform: uppercase; margin-bottom: 24px;">MAMOGRAFIA DIGITAL</h2>')
  
  // Indicação clínica
  sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Indicação Clínica:</h3>')
  sections.push(`<p style="text-align: justify;">${generateBIRADSMGIndicacao(data).replace(/\n/g, '<br>')}</p>`)
  
  // Análise
  sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Análise:</h3>')
  sections.push(`<p style="text-align: justify;">${generateBIRADSMGAchados(data).replace(/\n/g, '<br>')}</p>`)
  
  // Estudo comparativo
  const comparativo = generateBIRADSMGComparativo(data)
  if (comparativo) {
    sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Estudo Comparativo:</h3>')
    sections.push(`<p style="text-align: justify;">${comparativo}</p>`)
  }
  
  // Impressão diagnóstica
  sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Impressão Diagnóstica:</h3>')
  sections.push(`<p style="text-align: justify;">${generateBIRADSMGImpression(data, biradsCategory).replace(/\n/g, '<br>')}</p>`)
  
  // Recomendação
  const recomendacao = generateBIRADSMGRecomendacao(data, biradsCategory)
  if (recomendacao) {
    sections.push('<h3 style="text-transform: uppercase; margin-top: 18px; margin-bottom: 8px;">Recomendação:</h3>')
    sections.push(`<p style="text-align: justify;">${recomendacao.replace(/\n/g, '<br>')}</p>`)
  }
  
  // Notas
  const notas = generateBIRADSMGNotas(data)
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
