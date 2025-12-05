// BI-RADS RM Classification System (ACR BI-RADS MRI 5th Edition)
import { RADSOptionsMap } from '@/hooks/useRADSOptions'
import { biradsCategories, formatMeasurement, calcularTempoSeguimento, formatarTempoSeguimento } from './radsClassifications'

export { formatMeasurement }

export const ACR_BIRADS_RM_REFERENCE = "ACR BI-RADS® Atlas - Breast MRI. v2025 ed. Reston, VA: American College of Radiology; 2025."

// ==========================================
// BI-RADS RM INTERFACES
// ==========================================

export interface BIRADSRMFoco {
  presente: boolean
  localizacao: string
  lado: 'direita' | 'esquerda'
}

export interface BIRADSRMMassa {
  forma: string
  margens: string
  realceInterno: string
  localizacao: string
  lado: 'direita' | 'esquerda'
  medidas: [number, number, number]
  cineticaInicial: string
  cineticaTardia: string
  temComparacao: boolean
  dataExameAnterior: string | null
  estadoMassa: 'estavel' | 'cresceu' | 'diminuiu' | 'novo'
}

export interface BIRADSRMNME {
  presente: boolean
  distribuicao: string
  padraoInterno: string
  localizacao: string
  lado: 'direita' | 'esquerda'
  extensao: number
  cineticaInicial: string
  cineticaTardia: string
}

export interface BIRADSRMAchadosAdicionais {
  cistoSimples: boolean
  linfonodoReacional: boolean
  linfonodoSuspeito: boolean
  linfonodoDescricao?: string
  implanteIntegro: boolean
  implanteRoturaIntra: boolean
  implanteRoturaExtra: boolean
  implanteDescricao?: string
}

export interface BIRADSRMData {
  // Indicação
  indicacao: string
  indicacaoOutras?: string
  
  // Background
  composicaoParenquima: string
  bpe: string
  
  // Técnica
  campoMagnetico: '1.5T' | '3.0T'
  bobinaDedicada: boolean
  contrastado: boolean
  
  // Achados
  focos: BIRADSRMFoco[]
  massas: BIRADSRMMassa[]
  nmes: BIRADSRMNME[]
  achadosAdicionais: BIRADSRMAchadosAdicionais
  
  // Comparativo
  estudoComparativo: string
  dataExameAnterior?: string
  
  // Override
  recomendacaoManual?: string
  notas?: string
}

// ==========================================
// FACTORY FUNCTIONS
// ==========================================

export const createEmptyBIRADSRMMassa = (): BIRADSRMMassa => ({
  forma: 'oval',
  margens: 'circunscrito',
  realceInterno: 'homogeneo',
  localizacao: 'qse_10h',
  lado: 'direita',
  medidas: [1.0, 1.0, 1.0],
  cineticaInicial: 'medio',
  cineticaTardia: 'tipo_2',
  temComparacao: false,
  dataExameAnterior: null,
  estadoMassa: 'novo',
})

export const createEmptyBIRADSRMNME = (): BIRADSRMNME => ({
  presente: false,
  distribuicao: 'focal',
  padraoInterno: 'homogeneo',
  localizacao: 'qse_10h',
  lado: 'direita',
  extensao: 1.0,
  cineticaInicial: 'medio',
  cineticaTardia: 'tipo_2',
})

export const createEmptyBIRADSRMData = (): BIRADSRMData => ({
  indicacao: 'rastreamento',
  composicaoParenquima: 'acr_c',
  bpe: 'minimo',
  campoMagnetico: '1.5T',
  bobinaDedicada: true,
  contrastado: true,
  focos: [],
  massas: [],
  nmes: [],
  achadosAdicionais: {
    cistoSimples: false,
    linfonodoReacional: false,
    linfonodoSuspeito: false,
    implanteIntegro: false,
    implanteRoturaIntra: false,
    implanteRoturaExtra: false,
  },
  estudoComparativo: 'primeiro_exame',
})

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getRMOption = (categoria: string, value: string, options?: RADSOptionsMap) => {
  if (options && options[categoria]) {
    return options[categoria].find(o => o.value === value)
  }
  return undefined
}

const getTexto = (categoria: string, value: string, options?: RADSOptionsMap): string => {
  const opt = getRMOption(categoria, value, options)
  return opt?.texto ?? value
}

// ==========================================
// EVALUATION FUNCTIONS
// ==========================================

export const evaluateBIRADSRMMassa = (massa: BIRADSRMMassa, options?: RADSOptionsMap): number | string => {
  const formaOpt = getRMOption('massaForma', massa.forma, options)
  const margensOpt = getRMOption('massaMargens', massa.margens, options)
  const cineticaTardia = massa.cineticaTardia

  // Cresceu → 4A
  if (massa.temComparacao && massa.estadoMassa === 'cresceu') {
    return '4A'
  }

  // Margens espiculadas → BI-RADS 5
  if (margensOpt?.suspeicao === 'alto' || massa.margens === 'espiculado') {
    return 5
  }

  // Curva tipo III (washout) + forma irregular → BI-RADS 5
  if (cineticaTardia === 'tipo_3' && massa.forma === 'irregular') {
    return 5
  }

  // Curva tipo III → mínimo 4B
  if (cineticaTardia === 'tipo_3') {
    if (formaOpt?.suspeicao === 'suspeito' || margensOpt?.suspeicao === 'suspeito') {
      return '4C'
    }
    return '4B'
  }

  // Forma irregular + margens suspeitas → 4C
  if (formaOpt?.suspeicao === 'suspeito' && margensOpt?.suspeicao === 'suspeito') {
    return '4C'
  }

  // Margens irregulares isoladas → 4B
  if (margensOpt?.suspeicao === 'suspeito') {
    return '4B'
  }

  // Forma irregular isolada → 4A
  if (formaOpt?.suspeicao === 'suspeito') {
    return '4A'
  }

  // Curva tipo II com massa circunscrita → 3
  if (cineticaTardia === 'tipo_2' && massa.margens === 'circunscrito') {
    return 3
  }

  // Massa circunscrita + curva tipo I → BI-RADS 2 (provavelmente benigna)
  if (massa.margens === 'circunscrito' && cineticaTardia === 'tipo_1') {
    if (massa.temComparacao && massa.estadoMassa === 'estavel') {
      const tempoMeses = calcularTempoSeguimento(massa.dataExameAnterior)
      if (tempoMeses >= 24) return 2
    }
    return 3
  }

  return 3
}

export const evaluateBIRADSRMNME = (nme: BIRADSRMNME, options?: RADSOptionsMap): number | string => {
  const distribuicao = nme.distribuicao
  const padrao = nme.padraoInterno
  const cineticaTardia = nme.cineticaTardia

  // Linear ou segmentar + padrão agrupado/anéis → 4C
  if ((distribuicao === 'linear' || distribuicao === 'segmentar') && 
      (padrao === 'agrupado' || padrao === 'aneis_agrupados')) {
    return '4C'
  }

  // Segmentar + qualquer padrão → 4B
  if (distribuicao === 'segmentar') {
    return '4B'
  }

  // Linear + washout → 4B
  if (distribuicao === 'linear' && cineticaTardia === 'tipo_3') {
    return '4B'
  }

  // Linear → 4A
  if (distribuicao === 'linear') {
    return '4A'
  }

  // Regional + washout → 4A
  if (distribuicao === 'regional' && cineticaTardia === 'tipo_3') {
    return '4A'
  }

  // Focal com plateau/washout → 3
  if (distribuicao === 'focal') {
    return 3
  }

  return 3
}

export const evaluateBIRADSRM = (data: BIRADSRMData, options?: RADSOptionsMap): number | string => {
  // Se tem recomendação manual
  if (data.recomendacaoManual) {
    return parseInt(data.recomendacaoManual) || 0
  }

  const categoryOrder = [0, 1, 2, 3, '4A', '4B', '4C', 5, 6]
  let worstIndex = 1 // Começa com BI-RADS 1

  // Avaliar massas
  for (const massa of data.massas) {
    const cat = evaluateBIRADSRMMassa(massa, options)
    const idx = categoryOrder.indexOf(cat)
    worstIndex = Math.max(worstIndex, idx)
  }

  // Avaliar NMEs
  for (const nme of data.nmes) {
    if (nme.presente) {
      const cat = evaluateBIRADSRMNME(nme, options)
      const idx = categoryOrder.indexOf(cat)
      worstIndex = Math.max(worstIndex, idx)
    }
  }

  // Focos isolados sem achados suspeitos → considerar 3
  if (data.focos.some(f => f.presente) && worstIndex < categoryOrder.indexOf(3)) {
    worstIndex = categoryOrder.indexOf(3)
  }

  // Achados adicionais
  if (data.achadosAdicionais.linfonodoSuspeito) {
    const idx = categoryOrder.indexOf('4A')
    worstIndex = Math.max(worstIndex, idx)
  }

  if (data.achadosAdicionais.implanteRoturaIntra || data.achadosAdicionais.implanteRoturaExtra) {
    // Rotura de implante é achado importante mas não aumenta categoria
    if (worstIndex < categoryOrder.indexOf(2)) {
      worstIndex = categoryOrder.indexOf(2)
    }
  }

  // Se apenas cistos simples ou linfonodos reacionais → 2
  if (data.achadosAdicionais.cistoSimples && worstIndex < categoryOrder.indexOf(2)) {
    worstIndex = categoryOrder.indexOf(2)
  }

  return categoryOrder[worstIndex]
}

// ==========================================
// GENERATION FUNCTIONS
// ==========================================

export const generateBIRADSRMTecnica = (data: BIRADSRMData, options?: RADSOptionsMap): string => {
  const partes: string[] = []
  
  partes.push(`Estudo de ressonância magnética das mamas realizado em equipamento de ${data.campoMagnetico}`)
  
  if (data.bobinaDedicada) {
    partes.push('com bobina dedicada')
  }
  
  if (data.contrastado) {
    partes.push('Foram obtidas sequências ponderadas em T1 e T2, com estudo dinâmico após administração endovenosa de contraste paramagnético (gadolínio), com subtração e reconstruções multiplanares.')
  } else {
    partes.push('Foram obtidas sequências ponderadas em T1 e T2, sem administração de contraste.')
  }

  return partes.join(', ').replace(', Foram', '. Foram')
}

export const generateBIRADSRMIndicacao = (data: BIRADSRMData, options?: RADSOptionsMap): string => {
  const texto = getTexto('indicacao', data.indicacao, options)
  if (data.indicacaoOutras) {
    return `${texto}. ${data.indicacaoOutras}`
  }
  return texto || 'Ressonância magnética das mamas.'
}

export const generateBIRADSRMBackground = (data: BIRADSRMData, options?: RADSOptionsMap): string => {
  const parenquima = getTexto('composicaoParenquima', data.composicaoParenquima, options)
  const bpe = getTexto('bpe', data.bpe, options)
  
  return `${parenquima}. Realce de fundo do parênquima: ${bpe}.`
}

export const generateBIRADSRMAchados = (data: BIRADSRMData, options?: RADSOptionsMap): string => {
  const partes: string[] = []

  // Background
  partes.push(generateBIRADSRMBackground(data, options))

  // Focos
  const focosPresentes = data.focos.filter(f => f.presente)
  if (focosPresentes.length > 0) {
    for (const foco of focosPresentes) {
      const loc = getTexto('localizacao', foco.localizacao, options)
      const lado = foco.lado === 'direita' ? 'mama direita' : 'mama esquerda'
      partes.push(`Foco de realce ${loc} da ${lado}.`)
    }
  }

  // Massas
  if (data.massas.length > 0) {
    data.massas.forEach((massa, idx) => {
      const numero = data.massas.length > 1 ? `M${idx + 1} - ` : ''
      const forma = getTexto('massaForma', massa.forma, options)
      const margens = getTexto('massaMargens', massa.margens, options)
      const realce = getTexto('massaRealceInterno', massa.realceInterno, options)
      const loc = getTexto('localizacao', massa.localizacao, options)
      const lado = massa.lado === 'direita' ? 'mama direita' : 'mama esquerda'
      const medidas = massa.medidas.map(m => formatMeasurement(m)).join(' x ')
      const cineticaI = getTexto('cineticaFaseInicial', massa.cineticaInicial, options)
      const cineticaT = getTexto('cineticaFaseTardia', massa.cineticaTardia, options)
      
      let desc = `${numero}Massa ${forma}, ${margens}, com realce interno ${realce}, medindo ${medidas} cm, ${loc} da ${lado}.`
      desc += ` Cinética: realce ${cineticaI} na fase inicial, com ${cineticaT} na fase tardia.`
      
      if (massa.temComparacao && massa.dataExameAnterior) {
        const dataFormatada = new Date(massa.dataExameAnterior).toLocaleDateString('pt-BR')
        const tempoMeses = calcularTempoSeguimento(massa.dataExameAnterior)
        const tempoFormatado = formatarTempoSeguimento(tempoMeses)
        
        if (massa.estadoMassa === 'estavel') {
          desc += ` Estável em relação ao exame de ${dataFormatada} (${tempoFormatado}).`
        } else if (massa.estadoMassa === 'cresceu') {
          desc += ` Apresentou crescimento em relação ao exame de ${dataFormatada}.`
        } else if (massa.estadoMassa === 'diminuiu') {
          desc += ` Apresentou redução em relação ao exame de ${dataFormatada}.`
        }
      }
      
      partes.push(desc)
    })
  }

  // NME
  const nmesPresentes = data.nmes.filter(n => n.presente)
  if (nmesPresentes.length > 0) {
    for (const nme of nmesPresentes) {
      const dist = getTexto('nmeDistribuicao', nme.distribuicao, options)
      const padrao = getTexto('nmePadraoInterno', nme.padraoInterno, options)
      const loc = getTexto('localizacao', nme.localizacao, options)
      const lado = nme.lado === 'direita' ? 'mama direita' : 'mama esquerda'
      const cineticaI = getTexto('cineticaFaseInicial', nme.cineticaInicial, options)
      const cineticaT = getTexto('cineticaFaseTardia', nme.cineticaTardia, options)
      
      let desc = `Realce não nodular de distribuição ${dist}, padrão interno ${padrao}, ${loc} da ${lado}, com extensão de ${formatMeasurement(nme.extensao)} cm.`
      desc += ` Cinética: realce ${cineticaI} na fase inicial, com ${cineticaT} na fase tardia.`
      partes.push(desc)
    }
  }

  // Achados adicionais
  const adicionais: string[] = []
  if (data.achadosAdicionais.cistoSimples) {
    adicionais.push('Cisto(s) simples.')
  }
  if (data.achadosAdicionais.linfonodoReacional) {
    adicionais.push('Linfonodo(s) axilar(es) de aspecto reacional.')
  }
  if (data.achadosAdicionais.linfonodoSuspeito) {
    const desc = data.achadosAdicionais.linfonodoDescricao || 'Linfonodo(s) axilar(es) de aspecto suspeito.'
    adicionais.push(desc)
  }
  if (data.achadosAdicionais.implanteIntegro) {
    adicionais.push('Implantes mamários de silicone de aspecto íntegro bilateralmente.')
  }
  if (data.achadosAdicionais.implanteRoturaIntra) {
    const desc = data.achadosAdicionais.implanteDescricao || 'Sinais de rotura intracapsular de implante mamário.'
    adicionais.push(desc)
  }
  if (data.achadosAdicionais.implanteRoturaExtra) {
    const desc = data.achadosAdicionais.implanteDescricao || 'Sinais de rotura extracapsular de implante mamário.'
    adicionais.push(desc)
  }
  
  if (adicionais.length > 0) {
    partes.push(adicionais.join(' '))
  }

  // Se não há achados significativos
  if (partes.length === 1 && data.massas.length === 0 && focosPresentes.length === 0 && nmesPresentes.length === 0) {
    partes.push('Ausência de focos, massas ou realce não nodular suspeito.')
  }

  return partes.join('\n\n')
}

export const generateBIRADSRMComparativo = (data: BIRADSRMData, options?: RADSOptionsMap): string => {
  if (!data.estudoComparativo || data.estudoComparativo === 'primeiro_exame') {
    return 'Primeiro exame de ressonância magnética das mamas.'
  }
  
  const texto = getTexto('estudoComparativo', data.estudoComparativo, options)
  
  if (data.dataExameAnterior && data.estudoComparativo === 'sem_alteracoes') {
    const dataFormatada = new Date(data.dataExameAnterior).toLocaleDateString('pt-BR')
    return `Em relação ao exame anterior de ${dataFormatada}, não se observam alterações significativas.`
  }
  
  return texto || ''
}

export const generateBIRADSRMImpressao = (data: BIRADSRMData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const categoryNum = typeof biradsCategory === 'string' ? biradsCategory : biradsCategory.toString()
  const partes: string[] = []

  // Achados principais
  if (data.massas.length > 0) {
    const lados = [...new Set(data.massas.map(m => m.lado))]
    const ladoTexto = lados.length > 1 ? 'nas mamas' : (lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda')
    const quantidade = data.massas.length === 1 ? 'Massa' : 'Massas'
    partes.push(`${quantidade} ${ladoTexto}.`)
  }

  const nmesPresentes = data.nmes.filter(n => n.presente)
  if (nmesPresentes.length > 0) {
    const lados = [...new Set(nmesPresentes.map(n => n.lado))]
    const ladoTexto = lados.length > 1 ? 'nas mamas' : (lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda')
    partes.push(`Realce não nodular ${ladoTexto}.`)
  }

  const focosPresentes = data.focos.filter(f => f.presente)
  if (focosPresentes.length > 0) {
    const lados = [...new Set(focosPresentes.map(f => f.lado))]
    const ladoTexto = lados.length > 1 ? 'bilaterais' : (lados[0] === 'direita' ? 'na mama direita' : 'na mama esquerda')
    const quantidade = focosPresentes.length === 1 ? 'Foco de realce' : 'Focos de realce'
    partes.push(`${quantidade} ${ladoTexto}.`)
  }

  // Achados adicionais relevantes
  if (data.achadosAdicionais.linfonodoSuspeito) {
    partes.push('Linfonodomegalia axilar suspeita.')
  }
  if (data.achadosAdicionais.implanteRoturaIntra || data.achadosAdicionais.implanteRoturaExtra) {
    partes.push('Sinais de rotura de implante mamário.')
  }

  // Se não há achados
  if (partes.length === 0) {
    partes.push('Estudo de ressonância magnética das mamas sem achados suspeitos.')
  }

  // Categoria BI-RADS
  partes.push(`\nBI-RADS RM: categoria ${categoryNum}.`)

  return partes.join('\n')
}

export const generateBIRADSRMRecomendacao = (data: BIRADSRMData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const categoryNum = typeof biradsCategory === 'string' ? biradsCategory : biradsCategory.toString()

  switch (categoryNum) {
    case '0':
      return 'Avaliação adicional necessária.'
    case '1':
      return 'A critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.'
    case '2':
      return 'A critério clínico, sugere-se controle de rotina de acordo com o indicado para a faixa etária.'
    case '3':
      return 'Considerar controle por ressonância magnética em 6 meses.'
    case '4A':
    case '4B':
    case '4C':
      return 'Estudo histopatológico deve ser considerado.\nEm caso de realização de novo exame de imagem mamária, é necessário trazer exames anteriores.'
    case '5':
      return 'Recomenda-se prosseguir investigação com estudo histopatológico.\nEm caso de realização de novo exame de imagem mamária, é necessário trazer exames anteriores.'
    case '6':
      return 'Tratamento oncológico adequado indicado.'
    default:
      return ''
  }
}

export const generateBIRADSRMNotas = (data: BIRADSRMData, options?: RADSOptionsMap): string => {
  return data.notas || ''
}

export const generateBIRADSRMLaudoCompletoHTML = (data: BIRADSRMData, biradsCategory: number | string, options?: RADSOptionsMap): string => {
  const tecnica = generateBIRADSRMTecnica(data, options)
  const indicacao = generateBIRADSRMIndicacao(data, options)
  const achados = generateBIRADSRMAchados(data, options)
  const comparativo = generateBIRADSRMComparativo(data, options)
  const impressao = generateBIRADSRMImpressao(data, biradsCategory, options)
  const recomendacao = generateBIRADSRMRecomendacao(data, biradsCategory, options)
  const notas = generateBIRADSRMNotas(data, options)

  let html = `<h3><strong>RESSONÂNCIA MAGNÉTICA DAS MAMAS</strong></h3>`
  
  html += `<p><strong>INDICAÇÃO:</strong><br>${indicacao}</p>`
  html += `<p><strong>TÉCNICA:</strong><br>${tecnica}</p>`
  html += `<p><strong>RELATÓRIO:</strong><br>${achados.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
  
  if (comparativo) {
    html += `<p><strong>ESTUDO COMPARATIVO:</strong><br>${comparativo}</p>`
  }
  
  html += `<p><strong>IMPRESSÃO:</strong><br>${impressao.replace(/\n/g, '<br>')}</p>`
  html += `<p><strong>RECOMENDAÇÃO:</strong><br>${recomendacao.replace(/\n/g, '<br>')}</p>`
  
  if (notas) {
    html += `<p><strong>NOTA:</strong><br>${notas}</p>`
  }

  return html
}

export { biradsCategories }
