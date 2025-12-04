// TI-RADS Classification System (ACR TI-RADS 2017)

export interface TIRADSOption {
  value: string
  label: string
  points: number
  texto: string
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
