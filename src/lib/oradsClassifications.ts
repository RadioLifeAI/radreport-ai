/**
 * O-RADS US v2022 - Ovarian-Adnexal Reporting and Data System Ultrasound
 * Based on ACR O-RADS US v2022 Classification
 */

// ============= TYPES =============

export type StatusMenopausal = 'pre' | 'pos' | 'incerto'

export type TipoLesaoORADS = 
  | 'cisto_simples'
  | 'cisto_unilocular_nao_simples'
  | 'cisto_bilocular'
  | 'cisto_multilocular'
  | 'cisto_unilocular_irregular'
  | 'cisto_bilocular_irregular'
  | 'solido'
  | 'lesao_tipica_benigna'
  | 'nenhuma'

export type ColorScore = 1 | 2 | 3 | 4

export type LesaoTipicaBenigna = 
  | 'cisto_hemorragico'
  | 'cisto_dermoide'
  | 'endometrioma'
  | 'cisto_paraovarian'
  | 'cisto_inclusao_peritoneal'
  | 'hidrossalpinge'

export interface ORADSLesao {
  tipo: TipoLesaoORADS
  tamanho: number // maior diâmetro em cm
  paredeInterna?: 'lisa' | 'irregular'
  septacao?: 'lisa' | 'irregular' | 'ausente'
  componenteSolido: boolean
  numeroPapilas?: number // 1-3 ou >=4
  colorScore: ColorScore
  sombra?: boolean // shadowing (para lesões sólidas)
  contornoExterno?: 'liso' | 'irregular'
  lesaoTipica?: LesaoTipicaBenigna
  localizacao: 'ovario_direito' | 'ovario_esquerdo' | 'paraovarian' | 'tubaria'
}

export interface OvarianData {
  presente: boolean
  localizacao: string
  mx: number
  my: number
  mz: number
  volume?: number
  ecogenicidade: string
  lesoes: ORADSLesao[]
}

export interface NoduloMiometrial {
  localizacao: string
  mx: number
  my: number
  mz: number
  ecogenicidade: string
  contornos: string
  subtipo?: string
}

export interface ORADSUSData {
  // Paciente
  statusMenopausal: StatusMenopausal
  idade?: number
  dum?: string
  
  // Útero
  utero: {
    posicao: 'anteversoflexao' | 'retroversoflexao' | 'medioversao'
    forma: 'regular' | 'irregular' | 'globoso'
    contornos: 'regulares' | 'irregulares' | 'lobulados'
    simetria: 'simetrico' | 'assimetrico'
    ecotextura: 'homogenea' | 'heterogenea'
    zonaJuncional: 'regular' | 'irregular' | 'espessada'
    mx: number
    my: number
    mz: number
    volume?: number
    nodulos: NoduloMiometrial[]
  }
  
  // Endométrio
  endometrio: {
    aspecto: 'uniforme' | 'heterogeneo' | 'espessado' | 'atrofico'
    linhaMedia: 'linear' | 'irregular' | 'nao_visualizada'
    juncao: 'regular' | 'irregular'
    espessura: number // em mm
    polipoEndometrial?: boolean
    liquidoIntrauterino?: boolean
  }
  
  // Ovários
  ovarioDireito: OvarianData
  ovarioEsquerdo: OvarianData
  
  // Achados associados
  liquidoLivre: {
    presente: boolean
    quantidade?: 'pequena' | 'moderada' | 'grande'
    localizacao?: string
    aspecto?: 'anecoico' | 'ecos_finos' | 'heterogeneo'
  }
  
  ascite: boolean
  nodulosPeritoneais: boolean
  
  // Região anexial
  regiaoAnexial: {
    direita: string
    esquerda: string
  }
  
  // Comparativo
  comparativo?: {
    temEstudoAnterior: boolean
    dataAnterior?: string
    conclusaoAnterior?: string
    evolucao?: 'estavel' | 'aumento' | 'reducao' | 'novo'
  }
  
  // Notas
  notas?: string
  indicacao?: string
}

export interface ORADSCategory {
  score: number
  name: string
  risco: string
  riscoNumerico: string
  cor: string
  recomendacao: string
}

export interface ORADSResult {
  score: number
  category: ORADSCategory
  lesao: ORADSLesao | null
  recomendacao: string
}

// ============= CONSTANTS (FALLBACK) =============

export const oradsCategories: Record<number, ORADSCategory> = {
  0: {
    score: 0,
    name: 'O-RADS 0',
    risco: 'Avaliação Incompleta',
    riscoNumerico: 'N/A',
    cor: 'gray',
    recomendacao: 'Avaliação incompleta devido a limitações técnicas. Recomenda-se complementação com ultrassonografia transvaginal dedicada, ressonância magnética pélvica ou avaliação por especialista em ultrassonografia ginecológica para adequada caracterização da lesão anexial.'
  },
  1: {
    score: 1,
    name: 'O-RADS 1',
    risco: 'Normal',
    riscoNumerico: '0%',
    cor: 'green',
    recomendacao: 'Ovários de aspecto normal, sem lesões focais identificadas. Risco de malignidade virtualmente nulo. Não há necessidade de seguimento específico por imagem.'
  },
  2: {
    score: 2,
    name: 'O-RADS 2',
    risco: 'Quase Certamente Benigno',
    riscoNumerico: '<1%',
    cor: 'green',
    recomendacao: 'Lesão com características quase certamente benignas, com risco de malignidade inferior a 1%. Seguimento ultrassonográfico conforme tamanho da lesão e status menopausal: cistos simples ≤3cm em pré-menopausa não requerem seguimento; cistos simples >3cm e ≤5cm em pós-menopausa e lesões típicas benignas podem ser acompanhados em 12 meses.'
  },
  3: {
    score: 3,
    name: 'O-RADS 3',
    risco: 'Baixo Risco de Malignidade',
    riscoNumerico: '1-10%',
    cor: 'yellow',
    recomendacao: 'Lesão com baixo risco de malignidade (1-10%). Se manejo conservador for escolhido, recomenda-se seguimento ultrassonográfico em 6 meses para avaliar estabilidade ou resolução. Para lesões sólidas, considerar avaliação por especialista em ultrassonografia ginecológica ou ressonância magnética pélvica para melhor caracterização.'
  },
  4: {
    score: 4,
    name: 'O-RADS 4',
    risco: 'Risco Intermediário de Malignidade',
    riscoNumerico: '10-50%',
    cor: 'orange',
    recomendacao: 'Lesão com risco intermediário de malignidade (10-50%). Recomenda-se avaliação complementar por especialista em ultrassonografia ginecológica ou ressonância magnética pélvica para melhor caracterização. O manejo deve ser conduzido por ginecologista com suporte de oncologia ginecológica ou exclusivamente por oncologista ginecológico, considerando-se o contexto clínico e fatores de risco individuais.'
  },
  5: {
    score: 5,
    name: 'O-RADS 5',
    risco: 'Alto Risco de Malignidade',
    riscoNumerico: '≥50%',
    cor: 'red',
    recomendacao: 'Lesão com alto risco de malignidade (≥50%). Encaminhamento mandatório para oncologista ginecológico para planejamento terapêutico. Avaliação complementar por ressonância magnética pélvica e/ou tomografia computadorizada de abdome e pelve para estadiamento pode ser considerada conforme indicação do especialista.'
  }
}

export const colorScoreDescriptions: Record<ColorScore, string> = {
  1: 'Color Score 1 - Sem fluxo vascular detectável ao estudo Doppler colorido',
  2: 'Color Score 2 - Fluxo vascular mínimo detectável, com escassos spots de cor',
  3: 'Color Score 3 - Fluxo vascular moderado, com múltiplos vasos identificáveis',
  4: 'Color Score 4 - Fluxo vascular intenso, com vascularização proeminente'
}

export const lesoesTipicasBenignas: Record<LesaoTipicaBenigna, {
  nome: string
  caracteristicas: string[]
  limiteSize: number
  descricaoCompleta: string
}> = {
  cisto_hemorragico: {
    nome: 'Cisto Hemorrágico',
    caracteristicas: [
      'Padrão rendilhado/reticular fino característico',
      'Ecos internos móveis (coágulo retraído)',
      'Ausência de vascularização interna ao Doppler',
      'Parede fina regular sem componente sólido'
    ],
    limiteSize: 10,
    descricaoCompleta: 'Formação cística com padrão de ecos internos rendilhado/reticular fino, característico de conteúdo hemorrágico em organização, com parede fina regular e ausência de vascularização interna ao estudo Doppler colorido, compatível com cisto hemorrágico.'
  },
  cisto_dermoide: {
    nome: 'Cisto Dermoide (Teratoma Maduro)',
    caracteristicas: [
      'Linhas/pontos ecogênicos (artefato em cauda de cometa)',
      'Nódulo de Rokitansky (proeminência ecogênica mural)',
      'Sombra acústica posterior',
      'Interface gordura-líquido (nível)'
    ],
    limiteSize: 10,
    descricaoCompleta: 'Formação cística com componente ecogênico apresentando sombra acústica posterior, associado a linhas/pontos ecogênicos internos e/ou nódulo mural de Rokitansky, características típicas de teratoma cístico maduro (cisto dermoide).'
  },
  endometrioma: {
    nome: 'Endometrioma',
    caracteristicas: [
      'Aspecto homogêneo em "vidro fosco" (ground glass)',
      'Ecos internos de baixa amplitude uniformemente distribuídos',
      'Ausência de vascularização interna ao Doppler',
      'Parede fina regular, podendo haver focos ecogênicos murais'
    ],
    limiteSize: 10,
    descricaoCompleta: 'Formação cística com conteúdo homogêneo de ecos de baixa amplitude uniformemente distribuídos, conferindo aspecto característico em "vidro fosco", com parede fina regular e ausência de vascularização interna, compatível com endometrioma.'
  },
  cisto_paraovarian: {
    nome: 'Cisto Paraovariano',
    caracteristicas: [
      'Localização extraovariana (entre ovário e tuba)',
      'Cisto simples unilocular anecóico',
      'Parede fina imperceptível',
      'Ovário ipsilateral visualizado separadamente'
    ],
    limiteSize: 10,
    descricaoCompleta: 'Formação cística simples, anecóica, de parede fina imperceptível, localizada em topografia extraovariana, com ovário ipsilateral identificado separadamente, compatível com cisto paraovariano.'
  },
  cisto_inclusao_peritoneal: {
    nome: 'Cisto de Inclusão Peritoneal',
    caracteristicas: [
      'Formato irregular/moldado às estruturas adjacentes',
      'Pode envolver o ovário',
      'Paredes finas sem componente sólido',
      'Geralmente associado a história cirúrgica ou inflamatória pélvica'
    ],
    limiteSize: 10,
    descricaoCompleta: 'Coleção líquida de formato irregular, moldando-se às estruturas pélvicas adjacentes, com paredes finas e sem componente sólido, em contexto de história cirúrgica ou inflamatória pélvica prévia, compatível com cisto de inclusão peritoneal.'
  },
  hidrossalpinge: {
    nome: 'Hidrossalpinge',
    caracteristicas: [
      'Estrutura tubular alongada e tortuosa',
      'Pregas mucosas incompletas (sinal da roda dentada)',
      'Conteúdo anecóico',
      'Estrutura separada do ovário'
    ],
    limiteSize: 10,
    descricaoCompleta: 'Estrutura tubular alongada e tortuosa, de conteúdo anecóico, apresentando projeções murais correspondentes a pregas mucosas incompletas (sinal da roda dentada), separada do ovário ipsilateral, compatível com hidrossalpinge.'
  }
}

// ============= DATABASE HELPERS =============

export type ORADSOptions = Record<string, Array<{ value: string; label: string; texto: string }>>

/**
 * Helper para buscar categoria O-RADS do banco de dados com fallback
 */
export function getORADSCategoryFromDB(score: number, options?: ORADSOptions): ORADSCategory {
  const catOpt = options?.orads_categoria?.find(o => o.value === String(score))
  if (catOpt?.texto) {
    // Parse texto do banco: "Risco - Descrição (percentual)"
    const parts = catOpt.texto.split(' - ')
    // Regex melhorado para capturar padrões como "<1%", "1-10%", "≥50%", etc.
    const riscoMatch = catOpt.texto.match(/[<>≥≤]?\d+(?:[,-]\d+)?%/)
    return {
      score,
      name: catOpt.label || `O-RADS ${score}`,
      risco: parts[0] || oradsCategories[score]?.risco || '',
      riscoNumerico: riscoMatch?.[0] || oradsCategories[score]?.riscoNumerico || '',
      cor: score === 0 ? 'gray' : score <= 2 ? 'green' : score === 3 ? 'yellow' : score === 4 ? 'orange' : 'red',
      recomendacao: '' // Será preenchido por getORADSRecommendationFromDB
    }
  }
  return oradsCategories[score]
}

/**
 * Helper para buscar recomendação O-RADS do banco de dados com fallback
 */
export function getORADSRecommendationFromDB(score: number, options?: ORADSOptions): string {
  const recOpt = options?.recomendacao?.find(o => o.value === `orads_${score}`)
  if (recOpt?.texto) {
    return recOpt.texto
  }
  return oradsCategories[score]?.recomendacao || ''
}

/**
 * Helper para buscar descrição de Color Score do banco de dados com fallback
 */
export function getColorScoreDescriptionFromDB(cs: ColorScore, options?: ORADSOptions): string {
  const csOpt = options?.color_score?.find(o => o.value === String(cs))
  if (csOpt?.texto) {
    return csOpt.texto
  }
  return colorScoreDescriptions[cs]
}

/**
 * Helper para buscar texto de lesão típica benigna do banco de dados com fallback
 * Mapeia valores do código para valores do banco de dados
 */
export function getLesaoTipicaTextoFromDB(tipo: LesaoTipicaBenigna, options?: ORADSOptions): string {
  // Mapa de conversão entre valores do código e valores do banco
  const valorMap: Record<LesaoTipicaBenigna, string> = {
    'cisto_hemorragico': 'hemorragico',
    'cisto_dermoide': 'dermoide',
    'endometrioma': 'endometrioma',
    'cisto_paraovarian': 'cisto_paratubal',
    'cisto_inclusao_peritoneal': 'cisto_peritoneal',
    'hidrossalpinge': 'hidrossalpinge'
  }
  
  const valorBanco = valorMap[tipo] || tipo
  const opt = options?.lesao_tipica?.find(o => o.value === valorBanco)
  if (opt?.texto) {
    return opt.texto
  }
  return lesoesTipicasBenignas[tipo]?.descricaoCompleta || lesoesTipicasBenignas[tipo]?.nome || ''
}

/**
 * Helper para buscar texto de técnica do banco de dados com fallback
 */
export function getTecnicaFromDB(options?: ORADSOptions): string {
  const tecOpt = options?.tecnica?.find(o => o.value === 'padrao')
  if (tecOpt?.texto) {
    return tecOpt.texto
  }
  // Fallback profissional
  return 'Exame de ultrassonografia transvaginal realizado com transdutor endocavitário multifrequencial de alta resolução (5-9 MHz), com avaliação pélvica completa em modos bidimensional e Doppler colorido/espectral, seguindo protocolo ACR O-RADS US v2022 (Ovarian-Adnexal Reporting and Data System).'
}

// ============= EVALUATION ALGORITHM =============

/**
 * Avalia uma lesão ovariana e retorna o score O-RADS
 * Baseado no algoritmo ACR O-RADS US v2022
 */
export function evaluateORADS(lesao: ORADSLesao, statusMenopausal: StatusMenopausal, options?: ORADSOptions): ORADSResult {
  const { tipo, tamanho, componenteSolido, colorScore, paredeInterna, septacao, numeroPapilas, sombra, contornoExterno, lesaoTipica } = lesao
  
  // O-RADS 5: Alto risco (≥50%)
  // Presença de ascite e/ou nodulosidade peritoneal são avaliados separadamente
  
  // Lesão sólida com contorno irregular - O-RADS 5
  if (tipo === 'solido' && contornoExterno === 'irregular') {
    return createResult(5, lesao, options)
  }
  
  // Lesão sólida com contorno liso e CS4 - O-RADS 5
  if (tipo === 'solido' && contornoExterno === 'liso' && colorScore === 4) {
    return createResult(5, lesao, options)
  }
  
  // Cisto uni/bilocular com componente sólido e ≥4 projeções papilares - O-RADS 5
  if ((tipo === 'cisto_unilocular_nao_simples' || tipo === 'cisto_bilocular') && componenteSolido && (numeroPapilas ?? 0) >= 4) {
    return createResult(5, lesao, options)
  }
  
  // Cisto bi/multilocular com componente sólido e CS 3-4 - O-RADS 5
  if ((tipo === 'cisto_bilocular' || tipo === 'cisto_multilocular') && componenteSolido && colorScore >= 3) {
    return createResult(5, lesao, options)
  }
  
  // O-RADS 4: Risco intermediário (10-50%)
  
  // Cisto unilocular com componente sólido, 1-3 projeções papilares - O-RADS 4
  if (tipo === 'cisto_unilocular_nao_simples' && componenteSolido && (numeroPapilas ?? 0) >= 1 && (numeroPapilas ?? 0) <= 3) {
    return createResult(4, lesao, options)
  }
  
  // Cisto multilocular com componente sólido e CS 1-2 - O-RADS 4
  if (tipo === 'cisto_multilocular' && componenteSolido && colorScore <= 2) {
    return createResult(4, lesao, options)
  }
  
  // Cisto multilocular sem componente sólido, >10cm, parede lisa, CS 1-3 - O-RADS 4
  if (tipo === 'cisto_multilocular' && !componenteSolido && tamanho > 10 && paredeInterna === 'lisa' && colorScore <= 3) {
    return createResult(4, lesao, options)
  }
  
  // Cisto multilocular sem componente sólido, parede lisa, CS 4 - O-RADS 4
  if (tipo === 'cisto_multilocular' && !componenteSolido && paredeInterna === 'lisa' && colorScore === 4) {
    return createResult(4, lesao, options)
  }
  
  // Cisto multilocular sem componente sólido, parede/septação irregular - O-RADS 4
  if (tipo === 'cisto_multilocular' && !componenteSolido && (paredeInterna === 'irregular' || septacao === 'irregular')) {
    return createResult(4, lesao, options)
  }
  
  // Lesão sólida sem sombra, contorno liso, CS 2-3 - O-RADS 4
  if (tipo === 'solido' && !sombra && contornoExterno === 'liso' && colorScore >= 2 && colorScore <= 3) {
    return createResult(4, lesao, options)
  }
  
  // Cisto bilocular irregular sem componente sólido - O-RADS 4
  if (tipo === 'cisto_bilocular_irregular' && !componenteSolido) {
    return createResult(4, lesao, options)
  }
  
  // O-RADS 3: Baixo risco (1-10%)
  
  // Lesão típica benigna ≥10cm - O-RADS 3
  if (tipo === 'lesao_tipica_benigna' && tamanho >= 10) {
    return createResult(3, lesao, options)
  }
  
  // Cisto unilocular ou bilocular >10cm (simples ou não) - O-RADS 3
  if ((tipo === 'cisto_simples' || tipo === 'cisto_unilocular_nao_simples' || tipo === 'cisto_bilocular') && tamanho > 10) {
    return createResult(3, lesao, options)
  }
  
  // Cisto multilocular <10cm, parede lisa, CS 1-3 - O-RADS 3
  if (tipo === 'cisto_multilocular' && tamanho < 10 && paredeInterna === 'lisa' && colorScore <= 3) {
    return createResult(3, lesao, options)
  }
  
  // Lesão sólida com sombra, contorno liso, CS 1 - O-RADS 3
  if (tipo === 'solido' && sombra && contornoExterno === 'liso' && colorScore === 1) {
    return createResult(3, lesao, options)
  }
  
  // Lesão sólida sem sombra, contorno liso, CS 1 - O-RADS 3 (CORREÇÃO: lógica impossível removida)
  if (tipo === 'solido' && !sombra && contornoExterno === 'liso' && colorScore === 1) {
    return createResult(3, lesao, options)
  }
  
  // Cisto unilocular irregular - O-RADS 3
  if (tipo === 'cisto_unilocular_irregular') {
    return createResult(3, lesao, options)
  }
  
  // O-RADS 2: Quase certamente benigno (<1%)
  
  // Cisto simples ≤10cm - O-RADS 2
  if (tipo === 'cisto_simples' && tamanho <= 10) {
    return createResult(2, lesao, options)
  }
  
  // Cisto não-simples unilocular liso ou cisto bilocular liso ≤10cm - O-RADS 2
  if ((tipo === 'cisto_unilocular_nao_simples' || tipo === 'cisto_bilocular') && paredeInterna === 'lisa' && tamanho <= 10) {
    return createResult(2, lesao, options)
  }
  
  // Lesão típica benigna <10cm - O-RADS 2
  if (tipo === 'lesao_tipica_benigna' && tamanho < 10) {
    return createResult(2, lesao, options)
  }
  
  // Fallback - se não se encaixa em nenhuma categoria
  return createResult(2, lesao, options)
}

function createResult(score: number, lesao: ORADSLesao, options?: ORADSOptions): ORADSResult {
  const category = getORADSCategoryFromDB(score, options)
  const recomendacao = getORADSRecommendationFromDB(score, options)
  return {
    score,
    category,
    lesao,
    recomendacao
  }
}

/**
 * Avalia achados associados que indicam O-RADS 5
 */
export function hasHighRiskAssociatedFindings(data: ORADSUSData): boolean {
  return data.ascite || data.nodulosPeritoneais
}

/**
 * Retorna recomendação de seguimento baseada no O-RADS e status menopausal
 */
export function getORADSFollowUp(
  score: number,
  tamanho: number,
  tipoLesao: TipoLesaoORADS,
  statusMenopausal: StatusMenopausal
): string {
  if (score === 1) {
    return 'Sem necessidade de seguimento.'
  }
  
  if (score === 2) {
    // Cisto simples
    if (tipoLesao === 'cisto_simples') {
      if (tamanho <= 3) {
        return statusMenopausal === 'pre' 
          ? 'Achado fisiológico (O-RADS 1). Sem necessidade de seguimento.'
          : 'Sem necessidade de seguimento.'
      }
      if (tamanho <= 5) {
        return statusMenopausal === 'pre'
          ? 'Sem necessidade de seguimento.'
          : 'Seguimento ultrassonográfico em 1 ano.'
      }
      if (tamanho <= 10) {
        return 'Seguimento ultrassonográfico em 1 ano.'
      }
    }
    
    // Cisto não-simples unilocular liso ou bilocular liso
    if (tipoLesao === 'cisto_unilocular_nao_simples' || tipoLesao === 'cisto_bilocular') {
      if (tamanho <= 3) {
        return statusMenopausal === 'pre'
          ? 'Sem necessidade de seguimento.'
          : 'Seguimento ultrassonográfico em 1 ano.'
      }
      return 'Seguimento ultrassonográfico em 6 meses.'
    }
    
    // Lesões típicas benignas
    if (tipoLesao === 'lesao_tipica_benigna') {
      return 'Considerar encaminhamento ginecológico para casos que necessitem seguimento por imagem.'
    }
    
    return 'Considerar encaminhamento ginecológico para seguimento.'
  }
  
  if (score === 3) {
    return 'Se não excisado cirurgicamente, seguimento ultrassonográfico em 6 meses. Se lesão sólida, considerar avaliação por especialista em ultrassom ou RM pélvica.'
  }
  
  if (score === 4) {
    return 'Avaliação por especialista em ultrassom ou RM pélvica. Manejo por ginecologista com suporte de oncologia ginecológica ou exclusivamente por oncologista ginecológico.'
  }
  
  if (score === 5) {
    return 'Encaminhamento para oncologista ginecológico.'
  }
  
  return ''
}

// ============= TEXT GENERATION =============

const formatBR = (num: number, decimals: number = 1): string => {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export function generateORADSTecnica(options?: ORADSOptions): string {
  return getTecnicaFromDB(options)
}

export function generateORADSUteroTexto(data: ORADSUSData, options?: ORADSOptions): string {
  const { utero } = data
  
  const posicaoMap: Record<string, string> = {
    'anteversoflexao': 'anteversão e anteflexão',
    'retroversoflexao': 'retroversão e retroflexão',
    'medioversao': 'médio versão'
  }
  
  let texto = `Útero em ${posicaoMap[utero.posicao] || utero.posicao}`
  texto += `, apresentando forma ${utero.forma === 'regular' ? 'e contornos regulares' : `${utero.forma} com contornos ${utero.contornos}`}.`
  texto += ` As paredes são ${utero.simetria === 'simetrico' ? 'simétricas' : 'assimétricas'}`
  texto += ` e a ecotextura miometrial é ${utero.ecotextura}`
  texto += `, com zona juncional ${utero.zonaJuncional}.`
  
  const volume = utero.volume || (utero.mx * utero.my * utero.mz * 0.52)
  texto += ` Mede ${formatBR(utero.mx)} x ${formatBR(utero.my)} x ${formatBR(utero.mz)} cm (volume estimado de ${formatBR(volume)} cm³).`
  
  // Nódulos miometriais
  if (utero.nodulos && utero.nodulos.length > 0) {
    texto += '\n\n'
    utero.nodulos.forEach((nodulo, i) => {
      const volNodulo = nodulo.mx * nodulo.my * nodulo.mz * 0.52
      texto += `Nódulo miometrial ${nodulo.subtipo ? `(${nodulo.subtipo}) ` : ''}${nodulo.localizacao}, ${nodulo.ecogenicidade}, com contornos ${nodulo.contornos}, medindo ${formatBR(nodulo.mx)} x ${formatBR(nodulo.my)} x ${formatBR(nodulo.mz)} cm (volume ~${formatBR(volNodulo)} cm³).`
      if (i < utero.nodulos.length - 1) texto += '\n'
    })
  }
  
  return texto
}

export function generateORADSEndometrioTexto(data: ORADSUSData, options?: ORADSOptions): string {
  const { endometrio, statusMenopausal } = data
  
  let texto = `O eco endometrial é ${endometrio.aspecto}`
  texto += `, com linha média ${endometrio.linhaMedia}`
  texto += `, junção endométrio-miométrio ${endometrio.juncao}`
  texto += ` e apresentando espessura de ${formatBR(endometrio.espessura, 0)} mm.`
  
  // Interpretação da espessura
  if (statusMenopausal === 'pos' && endometrio.espessura > 5) {
    texto += ' Espessura endometrial acima do esperado para status pós-menopausal, recomendando-se correlação clínica.'
  }
  
  if (endometrio.polipoEndometrial) {
    texto += ' Observa-se imagem intracavitária ecogênica sugestiva de pólipo endometrial.'
  }
  
  if (endometrio.liquidoIntrauterino) {
    texto += ' Nota-se pequena quantidade de líquido na cavidade uterina.'
  }
  
  return texto
}

export function generateORADSOvarioTexto(ovario: OvarianData, lado: 'direito' | 'esquerdo', options?: ORADSOptions): string {
  if (!ovario.presente) {
    return `Ovário ${lado} não visualizado no estudo atual / ausente cirurgicamente.`
  }
  
  const volume = ovario.volume || (ovario.mx * ovario.my * ovario.mz * 0.52)
  
  let texto = `Ovário ${lado} localizado em ${ovario.localizacao || 'topografia parauterina habitual'}`
  texto += `, com ecogenicidade parenquimatosa ${ovario.ecogenicidade || 'habitual'}`
  texto += `, medindo ${formatBR(ovario.mx)} x ${formatBR(ovario.my)} x ${formatBR(ovario.mz)} cm`
  texto += ` (volume estimado de ${formatBR(volume)} cm³).`
  
  // Lesões
  if (ovario.lesoes && ovario.lesoes.length > 0) {
    texto += '\n\n'
    ovario.lesoes.forEach((lesao, i) => {
      texto += generateLesaoTexto(lesao, i + 1, options)
      if (i < ovario.lesoes.length - 1) texto += '\n'
    })
  }
  
  return texto
}

function generateLesaoTexto(lesao: ORADSLesao, numero: number, options?: ORADSOptions): string {
  // Tentar buscar do banco primeiro
  if (lesao.tipo === 'lesao_tipica_benigna' && lesao.lesaoTipica) {
    const textoCompleto = getLesaoTipicaTextoFromDB(lesao.lesaoTipica, options)
    if (textoCompleto && textoCompleto !== lesoesTipicasBenignas[lesao.lesaoTipica]?.nome) {
      return `Lesão ${numero}: ${textoCompleto} Medindo ${formatBR(lesao.tamanho)} cm no maior diâmetro.`
    }
  }

  const tipoMapFallback: Record<TipoLesaoORADS, string> = {
    'cisto_simples': 'Formação cística de conteúdo anecóico, paredes finas e imperceptíveis, sem septações ou componentes sólidos (cisto simples)',
    'cisto_unilocular_nao_simples': 'Formação cística unilocular não-simples, com conteúdo parcialmente ecogênico ou paredes discretamente espessadas',
    'cisto_bilocular': 'Formação cística bilocular, com septação única completa dividindo a lesão em dois compartimentos',
    'cisto_multilocular': 'Formação cística multilocular, com múltiplas septações internas dividindo a lesão em três ou mais compartimentos',
    'cisto_unilocular_irregular': 'Formação cística unilocular com irregularidade da parede interna',
    'cisto_bilocular_irregular': 'Formação cística bilocular com irregularidade de parede interna ou septação',
    'solido': 'Lesão predominantemente sólida',
    'lesao_tipica_benigna': lesao.lesaoTipica ? lesoesTipicasBenignas[lesao.lesaoTipica]?.nome : 'Lesão com características típicas de benignidade',
    'nenhuma': ''
  }
  
  let texto = `Lesão ${numero}: ${tipoMapFallback[lesao.tipo]}`
  texto += `, medindo ${formatBR(lesao.tamanho)} cm no maior diâmetro`
  
  if (lesao.paredeInterna) {
    texto += `, com parede interna ${lesao.paredeInterna === 'lisa' ? 'lisa e regular' : 'irregular'}`
  }
  
  if (lesao.septacao && lesao.septacao !== 'ausente') {
    texto += `, septações ${lesao.septacao === 'lisa' ? 'finas e regulares' : 'irregulares ou espessadas'}`
  }
  
  if (lesao.componenteSolido) {
    texto += `, apresentando componente sólido interno`
    if (lesao.numeroPapilas) {
      texto += ` com ${lesao.numeroPapilas} ${lesao.numeroPapilas === 1 ? 'projeção papilar' : 'projeções papilares'}`
    }
  }
  
  // Color Score com descrição completa
  const csDesc = getColorScoreDescriptionFromDB(lesao.colorScore, options)
  texto += `. Ao estudo Doppler colorido: ${csDesc}`
  
  if (lesao.tipo === 'solido') {
    texto += lesao.sombra ? '. Observa-se sombra acústica posterior' : '. Sem sombra acústica posterior'
    texto += `, com contorno externo ${lesao.contornoExterno === 'liso' ? 'liso e regular' : 'irregular'}`
  }
  
  texto += '.'
  
  return texto
}

export function generateORADSLiquidoLivreTexto(data: ORADSUSData, options?: ORADSOptions): string {
  const { liquidoLivre } = data
  
  if (!liquidoLivre.presente) {
    return 'Não se observa líquido livre na cavidade pélvica.'
  }
  
  const quantidadeMap: Record<string, string> = {
    'pequena': 'pequena',
    'moderada': 'moderada',
    'grande': 'grande'
  }
  
  let texto = `Identifica-se ${quantidadeMap[liquidoLivre.quantidade || 'pequena'] || ''} quantidade de líquido livre`
  if (liquidoLivre.localizacao) {
    texto += ` ${liquidoLivre.localizacao}`
  } else {
    texto += ' no fundo de saco posterior'
  }
  if (liquidoLivre.aspecto) {
    const aspectoMap: Record<string, string> = {
      'anecoico': ', de aspecto anecóico compatível com líquido simples',
      'ecos_finos': ', com ecos finos de permeio sugestivos de conteúdo proteináceo ou hemorrágico',
      'heterogeneo': ', de aspecto heterogêneo'
    }
    texto += aspectoMap[liquidoLivre.aspecto] || ''
  }
  texto += '.'
  
  return texto
}

export function generateORADSRegiaoAnexialTexto(data: ORADSUSData, options?: ORADSOptions): string {
  const { regiaoAnexial, ovarioDireito, ovarioEsquerdo } = data
  
  const direitaSemLesao = !ovarioDireito.lesoes || ovarioDireito.lesoes.length === 0
  const esquerdaSemLesao = !ovarioEsquerdo.lesoes || ovarioEsquerdo.lesoes.length === 0
  
  if (direitaSemLesao && esquerdaSemLesao && !regiaoAnexial.direita && !regiaoAnexial.esquerda) {
    return 'Não se identificam massas sólidas ou císticas em topografia anexial, além das estruturas ovarianas descritas.'
  }
  
  let texto = ''
  if (regiaoAnexial.direita) {
    texto += `Região anexial direita: ${regiaoAnexial.direita}`
  }
  if (regiaoAnexial.esquerda) {
    if (texto) texto += '\n'
    texto += `Região anexial esquerda: ${regiaoAnexial.esquerda}`
  }
  
  return texto || 'Regiões anexiais sem alterações adicionais às estruturas ovarianas descritas.'
}

export function generateORADSImpressao(data: ORADSUSData, options?: ORADSOptions): string {
  const impressoes: string[] = []
  
  // Avaliar todas as lesões
  const todasLesoes = [
    ...data.ovarioDireito.lesoes.map(l => ({ ...l, lado: 'direito' as const })),
    ...data.ovarioEsquerdo.lesoes.map(l => ({ ...l, lado: 'esquerdo' as const }))
  ]
  
  if (todasLesoes.length === 0 && !data.ascite && !data.nodulosPeritoneais) {
    // Verificar útero
    if (data.utero.nodulos && data.utero.nodulos.length > 0) {
      const numNodulos = data.utero.nodulos.length
      if (numNodulos === 1) {
        impressoes.push('- Útero miomatoso (leiomioma uterino único).')
      } else {
        impressoes.push(`- Útero miomatoso (${numNodulos} leiomiomas uterinos).`)
      }
    }
    
    // Verificar endométrio
    if (data.statusMenopausal === 'pos' && data.endometrio.espessura > 5) {
      impressoes.push('- Espessamento endometrial em paciente pós-menopausa, recomendando-se correlação clínica e, se indicado, avaliação histológica.')
    }
    
    if (data.endometrio.polipoEndometrial) {
      impressoes.push('- Imagem intracavitária sugestiva de pólipo endometrial, recomendando-se correlação histeroscópica.')
    }
    
    if (impressoes.length === 0) {
      return 'Estudo ultrassonográfico transvaginal dentro dos limites da normalidade. Ovários e anexos sem lesões focais.'
    }
    
    return impressoes.join('\n')
  }
  
  // Achados de alto risco
  if (data.ascite || data.nodulosPeritoneais) {
    const achados = [
      data.ascite ? 'ascite' : '', 
      data.nodulosPeritoneais ? 'nodularidade peritoneal' : ''
    ].filter(Boolean).join(' e ')
    impressoes.push(`- Achados associados de alto risco identificados (${achados}), elevando a classificação para O-RADS 5 independentemente das características da lesão ovariana.`)
  }
  
  // Lesões ovarianas com classificação O-RADS - descrição profissional
  todasLesoes.forEach((lesao) => {
    const result = evaluateORADS(lesao, data.statusMenopausal, options)
    const category = getORADSCategoryFromDB(result.score, options)
    const recomendacao = getORADSRecommendationFromDB(result.score, options)
    const ladoTexto = lesao.lado === 'direito' ? 'direita' : 'esquerda'
    
    // Descrição profissional da lesão
    let descLesao = ''
    if (lesao.tipo === 'lesao_tipica_benigna' && lesao.lesaoTipica) {
      descLesao = lesoesTipicasBenignas[lesao.lesaoTipica]?.nome || 'lesão com características típicas benignas'
    } else {
      const tipoMap: Record<TipoLesaoORADS, string> = {
        'cisto_simples': 'cisto simples',
        'cisto_unilocular_nao_simples': 'cisto unilocular não-simples',
        'cisto_bilocular': 'cisto bilocular',
        'cisto_multilocular': 'cisto multilocular',
        'cisto_unilocular_irregular': 'cisto unilocular com irregularidade parietal',
        'cisto_bilocular_irregular': 'cisto bilocular irregular',
        'solido': 'lesão sólida',
        'lesao_tipica_benigna': 'lesão típica benigna',
        'nenhuma': ''
      }
      descLesao = tipoMap[lesao.tipo]
    }
    
    impressoes.push(`- Lesão anexial ${ladoTexto} (${descLesao}, ${formatBR(lesao.tamanho)} cm): ${category.name} - ${category.risco} (${category.riscoNumerico}).`)
  })
  
  // Adicionar recomendação baseada no maior O-RADS
  const maxScore = Math.max(...todasLesoes.map(l => evaluateORADS(l, data.statusMenopausal, options).score))
  if (maxScore >= 3) {
    const recomendacao = getORADSRecommendationFromDB(data.ascite || data.nodulosPeritoneais ? 5 : maxScore, options)
    impressoes.push('')
    impressoes.push(`RECOMENDAÇÃO: ${recomendacao}`)
  }
  
  // Útero
  if (data.utero.nodulos && data.utero.nodulos.length > 0) {
    const numNodulos = data.utero.nodulos.length
    impressoes.push(`- Adicionalmente: útero miomatoso (${numNodulos} ${numNodulos === 1 ? 'nódulo' : 'nódulos'}).`)
  }
  
  return impressoes.join('\n')
}

export function generateORADSComparativoTexto(data: ORADSUSData, options?: ORADSOptions): string {
  if (!data.comparativo?.temEstudoAnterior) {
    return ''
  }
  
  const { dataAnterior, evolucao, conclusaoAnterior } = data.comparativo
  
  let texto = 'Em comparação com estudo ultrassonográfico'
  if (dataAnterior) {
    const dataFormatada = new Date(dataAnterior).toLocaleDateString('pt-BR')
    texto += ` de ${dataFormatada}`
  } else {
    texto += ' anterior'
  }
  
  const evolucaoMap: Record<string, string> = {
    'estavel': ', observa-se estabilidade dos achados',
    'aumento': ', observa-se aumento dimensional das lesões previamente descritas',
    'reducao': ', observa-se redução dimensional das lesões previamente descritas',
    'novo': ', identificam-se novos achados não presentes no estudo anterior'
  }
  
  texto += evolucaoMap[evolucao || 'estavel'] || ''
  texto += '.'
  
  if (conclusaoAnterior) {
    texto += ` Conclusão prévia: "${conclusaoAnterior}".`
  }
  
  return texto
}

export function generateORADSLaudoCompletoHTML(data: ORADSUSData, options?: ORADSOptions): string {
  let html = '<p><strong>ULTRASSONOGRAFIA TRANSVAGINAL - PROTOCOLO O-RADS US v2022</strong></p>'
  html += '<p></p>'
  
  // Indicação (se preenchida)
  if (data.indicacao) {
    html += '<p><strong>INDICAÇÃO CLÍNICA:</strong></p>'
    html += `<p>${data.indicacao}</p>`
    html += '<p></p>'
  }
  
  // Técnica
  html += '<p><strong>TÉCNICA:</strong></p>'
  html += `<p>${generateORADSTecnica(options)}</p>`
  html += '<p></p>'
  
  // Análise
  html += '<p><strong>ANÁLISE:</strong></p>'
  
  // Útero
  html += `<p>${generateORADSUteroTexto(data, options)}</p>`
  html += '<p></p>'
  
  // Endométrio
  html += `<p>${generateORADSEndometrioTexto(data, options)}</p>`
  html += '<p></p>'
  
  // Ovários
  html += `<p>${generateORADSOvarioTexto(data.ovarioDireito, 'direito', options)}</p>`
  html += '<p></p>'
  html += `<p>${generateORADSOvarioTexto(data.ovarioEsquerdo, 'esquerdo', options)}</p>`
  html += '<p></p>'
  
  // Região anexial
  html += `<p>${generateORADSRegiaoAnexialTexto(data, options)}</p>`
  html += '<p></p>'
  
  // Líquido livre
  html += `<p>${generateORADSLiquidoLivreTexto(data, options)}</p>`
  html += '<p></p>'
  
  // Comparativo (se houver)
  if (data.comparativo?.temEstudoAnterior) {
    html += '<p><strong>ESTUDO COMPARATIVO:</strong></p>'
    html += `<p>${generateORADSComparativoTexto(data, options)}</p>`
    html += '<p></p>'
  }
  
  // Impressão
  html += '<p><strong>IMPRESSÃO DIAGNÓSTICA:</strong></p>'
  html += `<p>${generateORADSImpressao(data, options).replace(/\n/g, '</p><p>')}</p>`
  
  // Notas
  if (data.notas) {
    html += '<p></p>'
    html += '<p><strong>OBSERVAÇÕES:</strong></p>'
    html += `<p>${data.notas}</p>`
  }
  
  return html
}

// ============= HELPERS =============

export function calcularVolumeOvariano(mx: number, my: number, mz: number): number {
  return mx * my * mz * 0.52
}

export function calcularVolumeUterino(mx: number, my: number, mz: number): number {
  return mx * my * mz * 0.52
}

export function interpretarVolumeOvariano(volume: number, statusMenopausal: StatusMenopausal): {
  interpretation: string
  color: 'success' | 'warning' | 'danger'
} {
  if (statusMenopausal === 'pos') {
    // Pós-menopausa: ovário <2cm³ é normal
    if (volume <= 2) return { interpretation: 'Volume ovariano normal para pós-menopausa', color: 'success' }
    if (volume <= 5) return { interpretation: 'Volume ovariano discretamente aumentado para pós-menopausa', color: 'warning' }
    return { interpretation: 'Volume ovariano aumentado para pós-menopausa', color: 'danger' }
  }
  
  // Pré-menopausa: 3-10cm³ é normal
  if (volume < 3) return { interpretation: 'Volume ovariano reduzido', color: 'warning' }
  if (volume <= 10) return { interpretation: 'Volume ovariano normal', color: 'success' }
  if (volume <= 20) return { interpretation: 'Volume ovariano aumentado', color: 'warning' }
  return { interpretation: 'Volume ovariano significativamente aumentado', color: 'danger' }
}

export function interpretarEspessuraEndometrial(espessura: number, statusMenopausal: StatusMenopausal, faseCiclo?: string): {
  interpretation: string
  color: 'success' | 'warning' | 'danger'
} {
  if (statusMenopausal === 'pos') {
    if (espessura <= 4) return { interpretation: 'Espessura endometrial normal para pós-menopausa', color: 'success' }
    if (espessura <= 5) return { interpretation: 'Espessura endometrial no limite superior para pós-menopausa', color: 'warning' }
    return { interpretation: 'Espessamento endometrial em pós-menopausa - avaliação necessária', color: 'danger' }
  }
  
  // Pré-menopausa varia com fase do ciclo
  if (espessura <= 4) return { interpretation: 'Endométrio fino (fase menstrual/proliferativa inicial)', color: 'success' }
  if (espessura <= 8) return { interpretation: 'Espessura endometrial normal (fase proliferativa)', color: 'success' }
  if (espessura <= 14) return { interpretation: 'Espessura endometrial normal (fase secretora)', color: 'success' }
  if (espessura <= 16) return { interpretation: 'Espessura endometrial no limite superior', color: 'warning' }
  return { interpretation: 'Espessamento endometrial para avaliação', color: 'danger' }
}

// Default empty data structure
export function createEmptyORADSData(): ORADSUSData {
  return {
    statusMenopausal: '' as any, // Empty for placeholder
    utero: {
      posicao: '' as any,
      forma: '' as any,
      contornos: '' as any,
      simetria: '' as any,
      ecotextura: '' as any,
      zonaJuncional: '' as any,
      mx: 0,
      my: 0,
      mz: 0,
      nodulos: []
    },
    endometrio: {
      aspecto: '' as any,
      linhaMedia: '' as any,
      juncao: '' as any,
      espessura: 0
    },
    ovarioDireito: {
      presente: true,
      localizacao: '',
      mx: 0,
      my: 0,
      mz: 0,
      ecogenicidade: '',
      lesoes: []
    },
    ovarioEsquerdo: {
      presente: true,
      localizacao: '',
      mx: 0,
      my: 0,
      mz: 0,
      ecogenicidade: '',
      lesoes: []
    },
    liquidoLivre: {
      presente: false
    },
    ascite: false,
    nodulosPeritoneais: false,
    regiaoAnexial: {
      direita: '',
      esquerda: ''
    }
  }
}
