// ACR Lung-RADS v2022 Classification System
// Reference: American College of Radiology Lung CT Screening Reporting and Data System

export interface LungRADSNodulo {
  id: string
  tipo: 'solido' | 'part_solid' | 'ggn' | 'cisto' | 'via_aerea' | ''
  diametroLongo: number // mm
  diametroCurto: number // mm
  componenteSolido?: number // mm (para part-solid)
  margem: string
  forma: string
  localizacao: string
  posicao: string
  viaAerea: string
  calcificacao: string
  cistoTipo?: string
  cistoEvolucao?: string
  novo: boolean
  crescimento: boolean // ≥1.5mm
  velocidadeCrescimento?: 'lento' | 'rapido' // <400 dias ou ≥400 dias para dobrar
}

export interface LungRADSData {
  // Paciente
  indicacao: string
  historicoTabagismo: string
  cargaTabagica: string
  anosAbstinencia?: number
  
  // Nódulos (até 5)
  nodulos: LungRADSNodulo[]
  
  // Achados adicionais
  achadosAdicionais: string[]
  achadosInflamatorios: string[]
  
  // Parênquima
  enfisema: boolean
  fibrose: boolean
  bronquiectasias: boolean
  outrosAchadosParenquima?: string
  
  // Linfonodos
  linfadenopatia: string
  tamanhoLinfonodo?: number
  localizacaoLinfonodo?: string
  
  // Comparativo
  temComparativo: boolean
  dataExameAnterior?: string
  comparativoResultado: string
  
  // Categoria
  categoriaManual?: string
  modificadorS: boolean
  motivoS?: string
  
  // Notas
  notas?: string
}

export interface LungRADSCategory {
  codigo: string
  nome: string
  descricao: string
  cor: string
  corBg: string
  recomendacao: string
  probabilidadeMalignidade: string
}

export interface LungRADSResult {
  categoria: LungRADSCategory
  noduloDominante?: LungRADSNodulo
  justificativa: string
  alertas: string[]
}

// Categorias Lung-RADS v2022 - Descrições profissionais com fallback
export const lungRADSCategories: Record<string, LungRADSCategory> = {
  '0': {
    codigo: '0',
    nome: 'Lung-RADS 0',
    descricao: 'Exame incompleto ou tecnicamente inadequado. Achados inflamatórios ou infecciosos ativos que impedem a avaliação adequada, ou ausência de exame anterior necessário para comparação.',
    cor: 'text-gray-700 dark:text-gray-300',
    corBg: 'bg-gray-50 dark:bg-gray-900 border-2 border-gray-400',
    recomendacao: 'Repetir o exame após resolução do processo inflamatório/infeccioso ou obter exames anteriores para comparação. Considerar TCBD em 1-3 meses para reavaliação.',
    probabilidadeMalignidade: 'N/A'
  },
  '1': {
    codigo: '1',
    nome: 'Lung-RADS 1',
    descricao: 'Exame negativo. Sem nódulos pulmonares identificados ou presença apenas de nódulos com características definitivamente benignas (calcificações benignas padrão central, difusa, lamelar ou em pipoca, ou conteúdo adiposo).',
    cor: 'text-green-700 dark:text-green-300',
    corBg: 'bg-green-50 dark:bg-green-950 border-2 border-green-500',
    recomendacao: 'Manter rastreamento anual com tomografia computadorizada de baixa dose (TCBD) conforme protocolo institucional.',
    probabilidadeMalignidade: '<1%'
  },
  '2': {
    codigo: '2',
    nome: 'Lung-RADS 2',
    descricao: 'Achados benignos ou provavelmente benignos. Inclui: nódulos sólidos <6 mm (baseline ou estáveis), nódulos juxtapleurais <10 mm de margens lisas, nódulos em vidro fosco <30 mm, nódulos peribronquiais <10 mm de margens lisas, ou nódulos com características benignas estáveis por ≥3 meses.',
    cor: 'text-green-700 dark:text-green-300',
    corBg: 'bg-green-50 dark:bg-green-950 border-2 border-green-500',
    recomendacao: 'Manter rastreamento anual com tomografia computadorizada de baixa dose (TCBD). Não há necessidade de seguimento adicional a curto prazo.',
    probabilidadeMalignidade: '<1%'
  },
  '3': {
    codigo: '3',
    nome: 'Lung-RADS 3',
    descricao: 'Achados provavelmente benignos. Inclui: nódulos sólidos ≥6 mm e <8 mm (baseline), nódulos parcialmente sólidos novos <6 mm de componente sólido, nódulos em vidro fosco ≥30 mm, ou nódulos persistentes em seguimento.',
    cor: 'text-yellow-700 dark:text-yellow-300',
    corBg: 'bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-500',
    recomendacao: 'TCBD de controle em 6 meses para avaliar estabilidade. Se estável após 6 meses, continuar rastreamento anual.',
    probabilidadeMalignidade: '1-2%'
  },
  '4A': {
    codigo: '4A',
    nome: 'Lung-RADS 4A',
    descricao: 'Achados suspeitos. Inclui: nódulos sólidos ≥8 mm e <15 mm (baseline), nódulos sólidos novos ≥4 mm e <6 mm, nódulos parcialmente sólidos com componente sólido ≥6 mm e <8 mm, ou nódulos estáveis com crescimento recente.',
    cor: 'text-orange-700 dark:text-orange-300',
    corBg: 'bg-orange-50 dark:bg-orange-950 border-2 border-orange-500',
    recomendacao: 'TCBD de controle em 3 meses. PET-CT pode ser considerado se componente sólido ≥8 mm. Discussão multidisciplinar recomendada.',
    probabilidadeMalignidade: '5-15%'
  },
  '4B': {
    codigo: '4B',
    nome: 'Lung-RADS 4B',
    descricao: 'Achados muito suspeitos para malignidade. Inclui: nódulos sólidos ≥15 mm, nódulos sólidos novos ≥6 mm, nódulos parcialmente sólidos com componente sólido ≥8 mm, ou nódulos endobronquiais novos.',
    cor: 'text-red-700 dark:text-red-300',
    corBg: 'bg-red-50 dark:bg-red-950 border-2 border-red-500',
    recomendacao: 'TC de tórax com contraste endovenoso e PET-CT recomendados. Considerar biópsia por amostragem tecidual. Discussão em equipe multidisciplinar oncológica.',
    probabilidadeMalignidade: '>15%'
  },
  '4X': {
    codigo: '4X',
    nome: 'Lung-RADS 4X',
    descricao: 'Achados altamente suspeitos com características adicionais de alto risco. Inclui nódulos categoria 4A ou 4B associados a: margens espiculadas, linfadenopatia mediastinal/hilar suspeita (≥15 mm), nódulos satélites, ou invasão de estruturas adjacentes.',
    cor: 'text-red-800 dark:text-red-200',
    corBg: 'bg-red-100 dark:bg-red-900 border-2 border-red-600',
    recomendacao: 'TC de tórax com contraste endovenoso, PET-CT e biópsia por amostragem tecidual indicados. Correlação clínica obrigatória. Encaminhamento para equipe de oncologia torácica.',
    probabilidadeMalignidade: '>15%'
  }
}

// Funções auxiliares
export function calcularDiametroMedio(longo: number, curto: number): number {
  return (longo + curto) / 2
}

export function isBenignCalcification(calcificacao: string): boolean {
  const benignPatterns = [
    'central',
    'difusa',
    'lamelar',
    'popcorn',
    'concentrica'
  ]
  return benignPatterns.some(p => calcificacao.toLowerCase().includes(p))
}

export function isJuxtapleuralBenign(nodulo: LungRADSNodulo): boolean {
  // Nódulo juxtapleural <10mm com margens lisas é benigno
  const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
  return (
    nodulo.localizacao.includes('juxtapleural') &&
    diametroMedio < 10 &&
    (nodulo.margem === 'lisa' || nodulo.margem === 'bem_definida')
  )
}

// Classificação por tipo de nódulo
export function classificarSolido(nodulo: LungRADSNodulo, isBaseline: boolean): string {
  const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
  
  // Calcificação benigna → Categoria 2
  if (isBenignCalcification(nodulo.calcificacao)) {
    return '2'
  }
  
  // Juxtapleural benigno → Categoria 2
  if (isJuxtapleuralBenign(nodulo)) {
    return '2'
  }
  
  // Nódulo novo
  if (nodulo.novo) {
    if (diametroMedio < 4) return '3'
    if (diametroMedio < 6) return '4A'
    return '4B'
  }
  
  // Crescimento significativo (≥1.5mm)
  if (nodulo.crescimento) {
    if (nodulo.velocidadeCrescimento === 'rapido') return '4B'
    return '4A'
  }
  
  // Baseline (primeiro exame)
  if (isBaseline) {
    if (diametroMedio < 6) return '2'
    if (diametroMedio < 8) return '3'
    if (diametroMedio < 15) return '4A'
    return '4B'
  }
  
  // Seguimento (não baseline)
  if (diametroMedio < 6) return '2'
  if (diametroMedio < 8) return '3'
  if (diametroMedio < 15) return '4A'
  return '4B'
}

export function classificarPartSolid(nodulo: LungRADSNodulo, isBaseline: boolean): string {
  const componenteSolido = nodulo.componenteSolido || 0
  const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
  
  // Nódulo novo
  if (nodulo.novo) {
    if (diametroMedio < 6) return '3'
    if (componenteSolido < 6) return '4A'
    return '4B'
  }
  
  // Crescimento do componente sólido
  if (nodulo.crescimento) {
    if (componenteSolido >= 4) return '4B'
    return '4A'
  }
  
  // Por tamanho do componente sólido
  if (componenteSolido < 6) return '3'
  if (componenteSolido < 8) return '4A'
  return '4B'
}

export function classificarGGN(nodulo: LungRADSNodulo, isBaseline: boolean): string {
  const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
  
  // Novo GGN
  if (nodulo.novo) {
    if (diametroMedio < 30) return '2'
    return '3'
  }
  
  // Crescimento ou desenvolvimento de componente sólido
  if (nodulo.crescimento) {
    return '4A'
  }
  
  // Por tamanho
  if (diametroMedio < 30) return '2'
  return '3'
}

export function classificarCisto(nodulo: LungRADSNodulo): string {
  const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
  
  // Cisto simples → benigno
  if (nodulo.cistoTipo === 'simples') return '2'
  
  // Cisto com parede espessa ou septações
  if (nodulo.cistoTipo === 'parede_espessa' || nodulo.cistoTipo === 'multilocular') {
    if (nodulo.novo || nodulo.crescimento) return '4B'
    return '4A'
  }
  
  // Cisto com componente sólido → suspeito
  if (nodulo.cistoTipo === 'componente_solido') {
    return '4B'
  }
  
  // Cisto atípico sem outras características
  if (diametroMedio < 10) return '3'
  return '4A'
}

export function classificarViaAerea(nodulo: LungRADSNodulo): string {
  const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
  
  // Nódulo peribronquial
  if (nodulo.viaAerea === 'peribronquial') {
    if (diametroMedio < 10 && !nodulo.crescimento) return '2'
    if (nodulo.crescimento) return '4A'
    return '3'
  }
  
  // Nódulo endobronquial
  if (nodulo.viaAerea === 'endobronquial') {
    if (nodulo.novo || nodulo.crescimento) return '4A'
    return '3'
  }
  
  return '3'
}

// Comparar categorias (retorna a maior)
export function compararCategoria(cat1: string, cat2: string): string {
  const ordem = ['1', '2', '3', '4A', '4B', '4X']
  const idx1 = ordem.indexOf(cat1)
  const idx2 = ordem.indexOf(cat2)
  return idx1 >= idx2 ? cat1 : cat2
}

// Verificar se deve fazer upgrade para 4X
export function shouldUpgradeTo4X(data: LungRADSData, categoria: string): boolean {
  // Se já é 4A ou 4B, pode virar 4X se tiver achados adicionais suspeitos
  if (categoria !== '4A' && categoria !== '4B') return false
  
  // Linfadenopatia suspeita
  if (data.linfadenopatia === 'suspeita' || data.linfadenopatia === 'patologica') {
    return true
  }
  
  // Linfonodo ≥15mm
  if (data.tamanhoLinfonodo && data.tamanhoLinfonodo >= 15) {
    return true
  }
  
  // Nódulos com características de alto risco
  const noduloSuspeito = data.nodulos.some(n => 
    n.margem === 'espiculada' ||
    n.forma === 'irregular'
  )
  
  return noduloSuspeito
}

// Avaliação principal Lung-RADS
export function evaluateLungRADS(data: LungRADSData): LungRADSResult {
  const alertas: string[] = []
  const isBaseline = !data.temComparativo
  
  // Verificar se há achados inflamatórios → categoria 0
  if (data.achadosInflamatorios && data.achadosInflamatorios.length > 0) {
    if (data.achadosInflamatorios.includes('pneumonia') || 
        data.achadosInflamatorios.includes('infeccao_ativa')) {
      alertas.push('Achado inflamatório ativo detectado - categoria 0 até resolução')
      return {
        categoria: lungRADSCategories['0'],
        justificativa: 'Achado inflamatório/infeccioso requer seguimento após tratamento',
        alertas
      }
    }
  }
  
  // Se não há nódulos → categoria 1 ou 2
  if (!data.nodulos || data.nodulos.length === 0 || 
      data.nodulos.every(n => n.tipo === '' || n.diametroLongo === 0)) {
    // Sem nódulos identificados
    if (data.enfisema || data.fibrose || data.bronquiectasias) {
      return {
        categoria: lungRADSCategories['2'],
        justificativa: 'Sem nódulos; alterações parenquimatosas benignas',
        alertas: ['Alterações parenquimatosas identificadas - considerar modificador S']
      }
    }
    return {
      categoria: lungRADSCategories['1'],
      justificativa: 'Exame negativo, sem nódulos pulmonares',
      alertas: []
    }
  }
  
  // Avaliar cada nódulo
  let categoriaMaisAlta = '1'
  let noduloDominante: LungRADSNodulo | undefined
  
  for (const nodulo of data.nodulos) {
    if (!nodulo.tipo || nodulo.diametroLongo === 0) continue
    
    let categoriaNodulo = '1'
    
    switch (nodulo.tipo) {
      case 'solido':
        categoriaNodulo = classificarSolido(nodulo, isBaseline)
        break
      case 'part_solid':
        categoriaNodulo = classificarPartSolid(nodulo, isBaseline)
        break
      case 'ggn':
        categoriaNodulo = classificarGGN(nodulo, isBaseline)
        break
      case 'cisto':
        categoriaNodulo = classificarCisto(nodulo)
        break
      case 'via_aerea':
        categoriaNodulo = classificarViaAerea(nodulo)
        break
    }
    
    // Alertas específicos
    const diametroMedio = calcularDiametroMedio(nodulo.diametroLongo, nodulo.diametroCurto)
    if (diametroMedio >= 7 && diametroMedio <= 8) {
      alertas.push(`Nódulo ${nodulo.id}: tamanho limítrofe (${diametroMedio.toFixed(1)}mm) - considerar nova medição`)
    }
    
    if (nodulo.margem === 'espiculada') {
      alertas.push(`Nódulo ${nodulo.id}: margem espiculada - característica suspeita`)
    }
    
    // Comparar e atualizar dominante
    if (compararCategoria(categoriaNodulo, categoriaMaisAlta) === categoriaNodulo) {
      categoriaMaisAlta = categoriaNodulo
      noduloDominante = nodulo
    }
  }
  
  // Verificar upgrade para 4X
  if (shouldUpgradeTo4X(data, categoriaMaisAlta)) {
    categoriaMaisAlta = '4X'
    alertas.push('Categoria elevada para 4X devido a achados adicionais suspeitos')
  }
  
  // Categoria manual override
  if (data.categoriaManual && data.categoriaManual !== 'auto') {
    categoriaMaisAlta = data.categoriaManual
    alertas.push(`Categoria definida manualmente: ${data.categoriaManual}`)
  }
  
  // Modificador S
  if (data.modificadorS) {
    alertas.push(`Modificador S aplicado: ${data.motivoS || 'achado clinicamente significativo'}`)
  }
  
  const justificativa = noduloDominante
    ? `Baseado em nódulo ${noduloDominante.tipo} de ${calcularDiametroMedio(noduloDominante.diametroLongo, noduloDominante.diametroCurto).toFixed(1)}mm`
    : 'Classificação baseada na avaliação global'
  
  return {
    categoria: lungRADSCategories[categoriaMaisAlta] || lungRADSCategories['1'],
    noduloDominante,
    justificativa,
    alertas
  }
}

// Obter recomendação baseada na categoria
export function getLungRADSRecommendation(categoria: string): string {
  return lungRADSCategories[categoria]?.recomendacao || 
    'Continuar rastreamento conforme protocolo institucional'
}

// Criar nódulo vazio
export function createEmptyNodulo(id: string): LungRADSNodulo {
  return {
    id,
    tipo: '',
    diametroLongo: 0,
    diametroCurto: 0,
    componenteSolido: undefined,
    margem: '',
    forma: '',
    localizacao: '',
    posicao: '',
    viaAerea: '',
    calcificacao: '',
    cistoTipo: undefined,
    cistoEvolucao: undefined,
    novo: false,
    crescimento: false,
    velocidadeCrescimento: undefined
  }
}

// Estado inicial
export function initialLungRADSData(): LungRADSData {
  return {
    indicacao: '',
    historicoTabagismo: '',
    cargaTabagica: '',
    anosAbstinencia: undefined,
    nodulos: [createEmptyNodulo('1')],
    achadosAdicionais: [],
    achadosInflamatorios: [],
    enfisema: false,
    fibrose: false,
    bronquiectasias: false,
    outrosAchadosParenquima: undefined,
    linfadenopatia: '',
    tamanhoLinfonodo: undefined,
    localizacaoLinfonodo: undefined,
    temComparativo: false,
    dataExameAnterior: undefined,
    comparativoResultado: '',
    categoriaManual: undefined,
    modificadorS: false,
    motivoS: undefined,
    notas: undefined
  }
}

// ============= FUNÇÕES DE GERAÇÃO DE TEXTO =============

export function generateIndicacaoTexto(data: LungRADSData, options?: Record<string, any>): string {
  const parts: string[] = []
  
  // Indicação - buscar do banco primeiro
  if (data.indicacao) {
    const indicacaoOption = options?.indicacao_exame?.find(
      (opt: { value: string; texto: string }) => opt.value === data.indicacao
    )
    if (indicacaoOption?.texto) {
      parts.push(indicacaoOption.texto)
    } else {
      // Fallback hardcoded
      const indicacaoMap: Record<string, string> = {
        'rastreamento': 'Rastreamento de câncer de pulmão',
        'seguimento_nodulo': 'Seguimento de nódulo pulmonar',
        'pos_tratamento': 'Acompanhamento pós-tratamento oncológico',
        'sintomatico': 'Avaliação de paciente sintomático',
        'incidental': 'Achado incidental em exame prévio'
      }
      parts.push(indicacaoMap[data.indicacao] || data.indicacao)
    }
  }
  
  // Histórico de tabagismo - buscar do banco
  if (data.historicoTabagismo) {
    const tabagismoOption = options?.historico_tabagismo?.find(
      (opt: { value: string; texto: string }) => opt.value === data.historicoTabagismo
    )
    if (tabagismoOption?.texto) {
      parts.push(tabagismoOption.texto)
    } else {
      // Fallback hardcoded
      const tabagismoMap: Record<string, string> = {
        'ativo': 'Tabagista ativo',
        'ex_menos_15': 'Ex-tabagista há menos de 15 anos',
        'ex_mais_15': 'Ex-tabagista há mais de 15 anos',
        'nunca': 'Não tabagista',
        'passivo': 'Exposição passiva ao tabaco'
      }
      parts.push(tabagismoMap[data.historicoTabagismo] || data.historicoTabagismo)
    }
  }
  
  // Carga tabágica - buscar do banco
  if (data.cargaTabagica) {
    const cargaOption = options?.carga_tabagica?.find(
      (opt: { value: string; texto: string }) => opt.value === data.cargaTabagica
    )
    if (cargaOption?.texto) {
      parts.push(cargaOption.texto)
    } else {
      // Fallback hardcoded
      const cargaMap: Record<string, string> = {
        'menos_20': 'Carga tabágica inferior a 20 anos-maço',
        '20_30': 'Carga tabágica de 20 a 30 anos-maço',
        '30_mais': 'Carga tabágica superior a 30 anos-maço'
      }
      if (cargaMap[data.cargaTabagica]) {
        parts.push(cargaMap[data.cargaTabagica])
      }
    }
  }
  
  return parts.join('. ') + (parts.length > 0 ? '.' : '')
}

export function generateNoduloTexto(nodulo: LungRADSNodulo, options?: Record<string, any>): string {
  if (!nodulo.tipo || nodulo.diametroLongo === 0) return ''
  
  const parts: string[] = []
  
  // Tipo - buscar do banco primeiro
  const tipoOption = options?.tipo_nodulo?.find(
    (opt: { value: string; texto: string }) => opt.value === nodulo.tipo
  )
  if (tipoOption?.texto) {
    parts.push(tipoOption.texto)
  } else {
    // Fallback hardcoded
    const tipoMap: Record<string, string> = {
      'solido': 'Nódulo sólido',
      'part_solid': 'Nódulo parcialmente sólido',
      'ggn': 'Opacidade em vidro fosco (GGN)',
      'cisto': 'Cisto pulmonar',
      'via_aerea': 'Nódulo relacionado à via aérea'
    }
    parts.push(tipoMap[nodulo.tipo] || 'Nódulo')
  }
  
  // Localização - buscar texto descritivo do banco
  if (nodulo.localizacao) {
    const segmentoOption = options?.segmento_nodulo?.find(
      (opt: { value: string; texto: string }) => opt.value === nodulo.localizacao
    )
    if (segmentoOption?.texto) {
      parts.push(segmentoOption.texto)
    } else {
      // Fallback para mapa local (valores antigos)
      const locMap: Record<string, string> = {
        'lsd': 'no lobo superior direito',
        'lmd': 'no lobo médio',
        'lid': 'no lobo inferior direito',
        'lse': 'no lobo superior esquerdo',
        'lingula': 'na língula',
        'lie': 'no lobo inferior esquerdo',
        'apice_direito': 'no ápice pulmonar direito',
        'apice_esquerdo': 'no ápice pulmonar esquerdo',
        'juxtapleural': 'em localização juxtapleural',
        'periférico': 'de localização periférica',
        'central': 'de localização central'
      }
      parts.push(locMap[nodulo.localizacao] || `no ${nodulo.localizacao}`)
    }
  }
  
  // Medidas
  if (nodulo.diametroLongo === nodulo.diametroCurto) {
    parts.push(`medindo ${nodulo.diametroLongo.toFixed(1).replace('.', ',')} mm`)
  } else {
    parts.push(`medindo ${nodulo.diametroLongo.toFixed(1).replace('.', ',')} x ${nodulo.diametroCurto.toFixed(1).replace('.', ',')} mm`)
  }
  
  // Componente sólido (para part-solid)
  if (nodulo.tipo === 'part_solid' && nodulo.componenteSolido) {
    parts.push(`com componente sólido de ${nodulo.componenteSolido.toFixed(1).replace('.', ',')} mm`)
  }
  
  // Margem - buscar do banco
  if (nodulo.margem) {
    const margemOption = options?.margem_nodulo?.find(
      (opt: { value: string; texto: string }) => opt.value === nodulo.margem
    )
    if (margemOption?.texto) {
      parts.push(margemOption.texto)
    } else {
      // Fallback hardcoded
      const margemMap: Record<string, string> = {
        'lisa': 'de margens lisas',
        'bem_definida': 'de margens bem definidas',
        'lobulada': 'de margens lobuladas',
        'irregular': 'de margens irregulares',
        'espiculada': 'de margens espiculadas'
      }
      parts.push(margemMap[nodulo.margem] || `margem ${nodulo.margem}`)
    }
  }
  
  // Calcificação - buscar do banco
  if (nodulo.calcificacao && nodulo.calcificacao !== 'ausente') {
    const calcOption = options?.calcificacao?.find(
      (opt: { value: string; texto: string }) => opt.value === nodulo.calcificacao
    )
    if (calcOption?.texto) {
      parts.push(`com ${calcOption.texto}`)
    } else {
      // Fallback hardcoded
      const calcMap: Record<string, string> = {
        'central': 'calcificação central',
        'difusa': 'calcificação difusa',
        'lamelar': 'calcificação lamelar',
        'popcorn': 'calcificação em pipoca',
        'excentrica': 'calcificação excêntrica',
        'puntiforme': 'calcificações puntiformes'
      }
      parts.push(`com ${calcMap[nodulo.calcificacao] || `calcificação ${nodulo.calcificacao}`}`)
    }
  }
  
  // Status (novo/crescimento)
  if (nodulo.novo) {
    parts.push('(novo)')
  } else if (nodulo.crescimento) {
    parts.push('(em crescimento)')
  }
  
  return parts.join(' ') + '.'
}

export function generateParenquimaTexto(data: LungRADSData, options?: Record<string, any>): string {
  const parts: string[] = []
  
  // Sem achados parenquimatosos
  if (!data.enfisema && !data.fibrose && !data.bronquiectasias && !data.outrosAchadosParenquima) {
    const normalOption = options?.parenquima?.find(
      (opt: { value: string; texto: string }) => opt.value === 'normal'
    )
    return normalOption?.texto || 'Parênquima pulmonar de aspecto habitual, sem opacidades ou consolidações focais.'
  }
  
  // Enfisema - buscar do banco
  if (data.enfisema) {
    const enfisemaOption = options?.parenquima?.find(
      (opt: { value: string; texto: string }) => opt.value === 'enfisema_moderado'
    )
    parts.push(enfisemaOption?.texto || 'Alterações enfisematosas pulmonares, caracterizadas por áreas de hipoatenuação com redução da trama vascular.')
  }
  
  // Fibrose - buscar do banco
  if (data.fibrose) {
    const fibroseOption = options?.parenquima?.find(
      (opt: { value: string; texto: string }) => opt.value === 'fibrose'
    )
    parts.push(fibroseOption?.texto || 'Alterações fibróticas pulmonares, com distorção arquitetural e opacidades reticulares.')
  }
  
  // Bronquiectasias - buscar do banco
  if (data.bronquiectasias) {
    const bronqOption = options?.parenquima?.find(
      (opt: { value: string; texto: string }) => opt.value === 'bronquiectasias'
    )
    parts.push(bronqOption?.texto || 'Bronquiectasias, caracterizadas por dilatações brônquicas permanentes.')
  }
  
  // Outros achados livres
  if (data.outrosAchadosParenquima) {
    parts.push(data.outrosAchadosParenquima)
  }
  
  return parts.join(' ') + '.'
}

export function generateLinfonodosTexto(data: LungRADSData, options?: Record<string, any>): string {
  if (!data.linfadenopatia || data.linfadenopatia === 'ausente') {
    return 'Linfonodos mediastinais e hilares de dimensões normais.'
  }
  
  // Buscar texto do banco primeiro
  const linfOption = options?.linfadenopatia?.find(
    (opt: { value: string; texto: string }) => opt.value === data.linfadenopatia
  )
  
  let texto: string
  if (linfOption?.texto) {
    texto = linfOption.texto
  } else {
    // Fallback hardcoded
    const linfMap: Record<string, string> = {
      'reacional': 'Linfonodos mediastinais/hilares de aspecto reacional',
      'aumentados': 'Linfonodos mediastinais/hilares aumentados',
      'suspeita': 'Linfadenopatia mediastinal suspeita',
      'patologica': 'Linfadenopatia mediastinal de aspecto patológico'
    }
    texto = linfMap[data.linfadenopatia] || 'Linfonodos identificados'
  }
  
  if (data.tamanhoLinfonodo) {
    texto += `, o maior medindo ${data.tamanhoLinfonodo.toFixed(1).replace('.', ',')} mm`
  }
  
  // Localização - buscar texto descritivo da estação linfonodal
  if (data.localizacaoLinfonodo) {
    const linfonodoOption = options?.localizacao_linfonodo?.find(
      (opt: { value: string; texto: string }) => opt.value === data.localizacaoLinfonodo
    )
    if (linfonodoOption?.texto) {
      texto += `, ${linfonodoOption.texto}`
    } else {
      // Fallback formatando o valor técnico
      texto += `, localizado na ${data.localizacaoLinfonodo.replace('estacao_', 'Estação ').toUpperCase()}`
    }
  }
  
  return texto + '.'
}

// Helper para formatar data no padrão brasileiro
function formatarDataBR(data: string): string {
  if (!data) return 'data não especificada'
  try {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  } catch {
    return data
  }
}

// Helper para obter localização genérica (lobo) a partir do segmento
function getLocalizacaoGenerica(localizacao: string): string {
  const loboMap: Record<string, string> = {
    // Pulmão direito - lobo superior
    's1_d': 'no lobo superior direito',
    's2_d': 'no lobo superior direito',
    's3_d': 'no lobo superior direito',
    // Pulmão direito - lobo médio
    's4_d': 'no lobo médio',
    's5_d': 'no lobo médio',
    // Pulmão direito - lobo inferior
    's6_d': 'no lobo inferior direito',
    's7_d': 'no lobo inferior direito',
    's8_d': 'no lobo inferior direito',
    's9_d': 'no lobo inferior direito',
    's10_d': 'no lobo inferior direito',
    // Pulmão esquerdo - lobo superior
    's1_2_e': 'no lobo superior esquerdo',
    's3_e': 'no lobo superior esquerdo',
    // Pulmão esquerdo - língula
    's4_e': 'na língula',
    's5_e': 'na língula',
    // Pulmão esquerdo - lobo inferior
    's6_e': 'no lobo inferior esquerdo',
    's7_8_e': 'no lobo inferior esquerdo',
    's9_e': 'no lobo inferior esquerdo',
    's10_e': 'no lobo inferior esquerdo',
    // Localizações genéricas antigas
    'lsd': 'no lobo superior direito',
    'lmd': 'no lobo médio',
    'lid': 'no lobo inferior direito',
    'lse': 'no lobo superior esquerdo',
    'lingula': 'na língula',
    'lie': 'no lobo inferior esquerdo'
  }
  
  return loboMap[localizacao] || ''
}

export function generateComparativoTexto(data: LungRADSData, options?: Record<string, any>): string {
  if (!data.temComparativo) {
    return 'Sem exame anterior disponível para comparação (exame baseline).'
  }
  
  const dataFormatada = formatarDataBR(data.dataExameAnterior)
  let texto = `Em comparação com tomografia computadorizada de tórax realizada em ${dataFormatada}`
  
  // Filtrar nódulos válidos
  const nodulosValidos = data.nodulos.filter(n => n.tipo && n.diametroLongo > 0)
  
  if (nodulosValidos.length > 0) {
    const descricoes: string[] = []
    
    nodulosValidos.forEach((nodulo) => {
      const loc = getLocalizacaoGenerica(nodulo.localizacao)
      const tipoNodulo = nodulo.tipo === 'solido' ? 'sólido' : 
                         nodulo.tipo === 'part_solid' ? 'parcialmente sólido' :
                         nodulo.tipo === 'ggn' ? 'em vidro fosco' : ''
      
      if (nodulo.novo) {
        if (loc) {
          descricoes.push(`identificou-se novo nódulo ${tipoNodulo} ${loc}`.trim())
        } else {
          descricoes.push(`identificou-se novo nódulo ${tipoNodulo}`.trim())
        }
      } else if (nodulo.crescimento) {
        if (loc) {
          descricoes.push(`o nódulo ${tipoNodulo} ${loc} apresentou crescimento significativo (≥1,5 mm)`.trim())
        } else {
          descricoes.push(`o nódulo ${tipoNodulo} apresentou crescimento significativo (≥1,5 mm)`.trim())
        }
      } else {
        if (loc) {
          descricoes.push(`o nódulo ${tipoNodulo} ${loc} encontra-se estável, sem alterações dimensionais significativas`.trim())
        } else {
          descricoes.push(`o nódulo ${tipoNodulo} encontra-se estável, sem alterações dimensionais significativas`.trim())
        }
      }
    })
    
    if (descricoes.length === 1) {
      texto += `, ${descricoes[0]}.`
    } else {
      texto += `: ${descricoes.join('; ')}.`
    }
  } else {
    // Sem nódulos específicos, usar resultado geral
    const resultMap: Record<string, string> = {
      'estavel': ', observam-se achados estáveis, sem alterações significativas.',
      'melhora': ', observa-se melhora dos achados previamente descritos.',
      'piora': ', observa-se progressão dos achados.',
      'novo_achado': ', identificam-se novos achados.',
      'resolucao': ', houve resolução dos achados previamente descritos.',
      'diminuicao': ', observa-se redução dos achados previamente descritos.',
      'aumento': ', observa-se aumento dos achados previamente descritos.'
    }
    texto += resultMap[data.comparativoResultado] || ', sem alterações significativas.'
  }
  
  return texto
}

export function generateImpressaoTexto(result: LungRADSResult, data: LungRADSData, options?: Record<string, any>): string {
  const parts: string[] = []
  
  // Categoria principal - buscar do banco primeiro
  const categoriaOption = options?.categoria?.find(
    (opt: { value: string; texto: string }) => opt.value === result.categoria.codigo
  )
  if (categoriaOption?.texto) {
    parts.push(categoriaOption.texto)
  } else {
    // Fallback usando dados do objeto categoria
    parts.push(`${result.categoria.nome}: ${result.categoria.descricao}.`)
  }
  
  // Justificativa
  if (result.justificativa) {
    parts.push(result.justificativa + '.')
  }
  
  // Modificador S
  if (data.modificadorS && data.motivoS) {
    parts.push(`Modificador S: ${data.motivoS}.`)
  }
  
  // Probabilidade
  if (result.categoria.probabilidadeMalignidade !== 'N/A') {
    parts.push(`Probabilidade de malignidade: ${result.categoria.probabilidadeMalignidade}.`)
  }
  
  return parts.join(' ')
}

export function generateRecomendacaoTexto(result: LungRADSResult, options?: Record<string, any>): string {
  // Converter código para formato do banco: "1" → "cat_1", "4A" → "cat_4a"
  const valorBanco = `cat_${result.categoria.codigo.toLowerCase()}`
  
  // Buscar do banco primeiro com valor convertido
  const recomendacaoOption = options?.recomendacao?.find(
    (opt: { value: string; texto: string }) => opt.value === valorBanco
  )
  if (recomendacaoOption?.texto) {
    return recomendacaoOption.texto
  }
  
  // Fallback: tentar buscar com código original (para compatibilidade)
  const recomendacaoOriginal = options?.recomendacao?.find(
    (opt: { value: string; texto: string }) => opt.value === result.categoria.codigo
  )
  if (recomendacaoOriginal?.texto) {
    return recomendacaoOriginal.texto
  }
  
  // Fallback final usando dados do objeto categoria
  return result.categoria.recomendacao + '.'
}
