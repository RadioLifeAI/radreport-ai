/**
 * O-RADS MRI v2020 - Ovarian-Adnexal Reporting and Data System MRI
 * Based on ACR O-RADS MRI v2020 Classification
 * Reference: Thomassin-Naggara I, et al. Radiology 2020
 */

// ============= TYPES =============

export type StatusMenopausal = 'pre' | 'pos' | 'incerto'

export type FluidContent = 
  | 'simple'           // Anecóico/T2 brilhante, T1 baixo
  | 'proteinaceous'    // T1 intermediário/alto, T2 intermediário
  | 'hemorrhagic'      // T1 alto (shading em T2)
  | 'mucinous'         // T2 intermediário com pontos T2 baixos
  | 'endometriotic'    // T1 alto, T2 shading
  | 'lipid'            // T1 alto (suprime em fat-sat)

export type SolidTissueType = 
  | 'none'
  | 'papillary_projection'
  | 'mural_nodule'
  | 'irregular_septation'
  | 'irregular_wall'
  | 'large_solid'

export type T2Signal = 
  | 'hyperintense'     // Brilhante
  | 'intermediate'     // Intermediário
  | 'hypointense'      // Hipointenso
  | 'dark_t2_dark_dwi' // Homogeneamente escuro em T2 E DWI (fibroma/thecoma)

export type DWISignal = 
  | 'restricted'       // Restrição (alto em DWI, baixo em ADC)
  | 'non_restricted'   // Sem restrição
  | 'dark'             // Escuro em DWI (T2 dark/DWI dark lesion)
  | 'variable'         // Variável/heterogêneo

export type DCECurve = 
  | 'low_risk'         // Tipo 1 - captação gradual/plateau
  | 'intermediate_risk' // Tipo 2 - captação rápida, plateau
  | 'high_risk'        // Tipo 3 - captação rápida, washout
  | 'not_performed'    // DCE não realizado

export type EnhancementVsMyometrium = 
  | 'less_than'        // Menor que miométrio em 30-40s
  | 'equal_to'         // Igual ao miométrio em 30-40s
  | 'more_than'        // Maior que miométrio em 30-40s

export type WallType = 
  | 'thin_smooth'      // Fina e lisa
  | 'thick_smooth'     // Espessa e lisa
  | 'thin_irregular'   // Fina irregular
  | 'thick_irregular'  // Espessa irregular
  | 'no_wall'          // Parede imperceptível

export type SeptationType = 
  | 'none'
  | 'smooth'           // Lisa
  | 'irregular'        // Irregular

export type TipoLesaoMRI = 
  | 'cisto_unilocular'
  | 'cisto_multilocular'
  | 'lesao_solida'
  | 'lesao_lipidica'
  | 'tuba_dilatada'
  | 'cisto_paraovarian'
  | 'foliculo'
  | 'cisto_hemorragico'
  | 'corpo_luteo'
  | 'nenhuma'

export interface ORADSMRILesao {
  id: string
  tipo: TipoLesaoMRI
  tamanho: number // maior diâmetro em cm
  conteudoFluido: FluidContent
  tecidoSolido: SolidTissueType
  sinalT1: 'hypointense' | 'isointense' | 'hyperintense'
  sinalT2: T2Signal
  sinalDWI: DWISignal
  curvaDCE: DCECurve
  enhancementVsMyometrium?: EnhancementVsMyometrium
  paredeEnhancement: boolean
  parede: WallType
  septacao: SeptationType
  lipidContent: boolean
  rokitanskyEnhancement: boolean
  localizacao: 'ovario_direito' | 'ovario_esquerdo' | 'paraovarian' | 'tubaria'
}

export interface OvarianDataMRI {
  presente: boolean
  localizacao: string
  mx: number
  my: number
  mz: number
  volume?: number
  sinalT2: string
  lesoes: ORADSMRILesao[]
}

export interface NoduloMiometrialMRI {
  localizacao: string
  mx: number
  my: number
  mz: number
  sinalT2: string
  enhancement: string
  subtipo?: string
}

export interface ORADSMRIData {
  // Paciente
  statusMenopausal: StatusMenopausal
  idade?: number
  dum?: string
  indicacao?: string
  
  // Técnica
  tecnica: {
    campo: '1.5T' | '3T'
    contraste: boolean
    sequencias: string[]
    dceRealizado: boolean
  }
  
  // Útero
  utero: {
    presente: boolean
    posicao: 'anteversoflexao' | 'retroversoflexao' | 'medioversao'
    forma: 'regular' | 'irregular' | 'globoso'
    mx: number
    my: number
    mz: number
    sinalT2: 'homogeneo' | 'heterogeneo'
    zonaJuncional: 'regular' | 'irregular' | 'espessada'
    nodulos: NoduloMiometrialMRI[]
  }
  
  // Endométrio
  endometrio: {
    espessura: number
    sinalT2: 'normal' | 'espessado' | 'heterogeneo'
    distensao: boolean
    massaIntracavitaria: boolean
  }
  
  // Ovários
  ovarioDireito: OvarianDataMRI
  ovarioEsquerdo: OvarianDataMRI
  
  // Achados Associados
  ascite: boolean
  asciteQuantidade?: 'pequena' | 'moderada' | 'grande'
  nodulosPeritoneais: boolean
  nodulosMesentéricos: boolean
  nodulosOmentais: boolean
  omental_caking: boolean
  
  // Linfonodos
  linfonodos: {
    presentes: boolean
    localizacao?: string
    tamanho?: number
    caracteristicas?: string
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
}

export interface ORADSMRICategory {
  score: number
  name: string
  risco: string
  riscoNumerico: string
  cor: string
  recomendacao: string
}

export interface ORADSMRIResult {
  score: number
  category: ORADSMRICategory
  lesao: ORADSMRILesao | null
  recomendacao: string
  justificativa: string
}

// ============= CONSTANTS (FALLBACK) =============

export const oradsMRICategories: Record<number, ORADSMRICategory> = {
  0: {
    score: 0,
    name: 'O-RADS MRI 0',
    risco: 'Avaliação Incompleta',
    riscoNumerico: 'N/A',
    cor: 'gray',
    recomendacao: 'Avaliação incompleta. Recomendam-se sequências adicionais ou repetição do exame com protocolo completo incluindo estudo dinâmico pós-contraste para adequada caracterização da lesão anexial.'
  },
  1: {
    score: 1,
    name: 'O-RADS MRI 1',
    risco: 'Normal',
    riscoNumerico: '0%',
    cor: 'green',
    recomendacao: 'Ovários de aspecto normal ou achados fisiológicos (folículos, corpo lúteo, cisto hemorrágico ≤3cm em pré-menopausa). Risco de malignidade virtualmente nulo. Não há necessidade de seguimento específico por imagem.'
  },
  2: {
    score: 2,
    name: 'O-RADS MRI 2',
    risco: 'Quase Certamente Benigno',
    riscoNumerico: '<0.5%',
    cor: 'green',
    recomendacao: 'Lesão com características quase certamente benignas, com risco de malignidade inferior a 0,5%. Seguimento por imagem pode ser considerado conforme tamanho e contexto clínico. Lesões típicas benignas (endometrioma, teratoma) não requerem seguimento se estáveis.'
  },
  3: {
    score: 3,
    name: 'O-RADS MRI 3',
    risco: 'Baixo Risco de Malignidade',
    riscoNumerico: '~5%',
    cor: 'yellow',
    recomendacao: 'Lesão com baixo risco de malignidade (~5%). Seguimento por ressonância magnética em 6-12 meses para avaliar estabilidade ou resolução. Para lesões com tecido sólido apresentando curva de captação de baixo risco, considerar discussão multidisciplinar.'
  },
  4: {
    score: 4,
    name: 'O-RADS MRI 4',
    risco: 'Risco Intermediário de Malignidade',
    riscoNumerico: '~50%',
    cor: 'orange',
    recomendacao: 'Lesão com risco intermediário de malignidade (~50%). Recomenda-se discussão multidisciplinar com oncologista ginecológico. Considerar estadiamento complementar (TC tórax/abdome) conforme contexto clínico. Planejamento cirúrgico deve considerar abordagem oncológica.'
  },
  5: {
    score: 5,
    name: 'O-RADS MRI 5',
    risco: 'Alto Risco de Malignidade',
    riscoNumerico: '~90%',
    cor: 'red',
    recomendacao: 'Lesão com alto risco de malignidade (~90%). Encaminhamento mandatório para oncologista ginecológico. Estadiamento completo (TC tórax/abdome ou PET-CT) recomendado. Presença de carcinomatose peritoneal indica doença avançada.'
  }
}

export const dceDescriptions: Record<DCECurve, string> = {
  'low_risk': 'Curva Tipo 1 (baixo risco): captação gradual progressiva ou plateau',
  'intermediate_risk': 'Curva Tipo 2 (risco intermediário): captação rápida inicial com plateau',
  'high_risk': 'Curva Tipo 3 (alto risco): captação rápida inicial com washout',
  'not_performed': 'Estudo dinâmico pós-contraste não realizado'
}

export const solidTissueDescriptions: Record<SolidTissueType, string> = {
  'none': 'Sem tecido sólido identificável',
  'papillary_projection': 'Projeção papilar com realce',
  'mural_nodule': 'Nódulo mural com realce',
  'irregular_septation': 'Septação irregular com realce',
  'irregular_wall': 'Parede irregular com realce',
  'large_solid': 'Componente sólido volumoso com realce'
}

// ============= DATABASE HELPERS =============

export type ORADSMRIOptions = Record<string, Array<{ value: string; label: string; texto: string }>>

export function getORADSMRICategoryFromDB(score: number, options?: ORADSMRIOptions): ORADSMRICategory {
  const catOpt = options?.orads_mri_categoria?.find(o => o.value === String(score))
  if (catOpt?.texto) {
    const parts = catOpt.texto.split(' - ')
    const riscoMatch = catOpt.texto.match(/[<>≥≤~]?\d+(?:[,.-]\d+)?%/)
    return {
      score,
      name: catOpt.label || `O-RADS MRI ${score}`,
      risco: parts[0] || oradsMRICategories[score]?.risco || '',
      riscoNumerico: riscoMatch?.[0] || oradsMRICategories[score]?.riscoNumerico || '',
      cor: score === 0 ? 'gray' : score <= 2 ? 'green' : score === 3 ? 'yellow' : score === 4 ? 'orange' : 'red',
      recomendacao: ''
    }
  }
  return oradsMRICategories[score]
}

export function getORADSMRIRecommendationFromDB(score: number, options?: ORADSMRIOptions): string {
  const recOpt = options?.orads_mri_recomendacao?.find(o => o.value === `orads_mri_${score}`)
  if (recOpt?.texto) {
    return recOpt.texto
  }
  return oradsMRICategories[score]?.recomendacao || ''
}

export function getDCEDescriptionFromDB(curve: DCECurve, options?: ORADSMRIOptions): string {
  const opt = options?.curva_dce?.find(o => o.value === curve)
  if (opt?.texto) {
    return opt.texto
  }
  return dceDescriptions[curve]
}

export function getTecnicaMRIFromDB(options?: ORADSMRIOptions): string {
  const tecOpt = options?.tecnica?.find(o => o.value === 'padrao')
  if (tecOpt?.texto) {
    return tecOpt.texto
  }
  return 'Exame de ressonância magnética da pelve realizado em equipamento de alto campo, com sequências ponderadas em T1, T2 nos planos axial e sagital, difusão (DWI) com mapa de ADC, e estudo dinâmico pós-contraste com análise de curvas tempo-intensidade, seguindo protocolo ACR O-RADS MRI v2020.'
}

// ============= EVALUATION ALGORITHM =============

/**
 * Avalia uma lesão ovariana por RM e retorna o score O-RADS MRI
 * Baseado no algoritmo ACR O-RADS MRI v2020
 */
export function evaluateORADSMRI(
  lesao: ORADSMRILesao, 
  statusMenopausal: StatusMenopausal,
  options?: ORADSMRIOptions
): ORADSMRIResult {
  const { 
    tipo, 
    tamanho, 
    conteudoFluido, 
    tecidoSolido, 
    sinalT2, 
    curvaDCE, 
    enhancementVsMyometrium,
    paredeEnhancement,
    parede,
    septacao,
    lipidContent,
    rokitanskyEnhancement
  } = lesao

  // ==========================================
  // O-RADS MRI 1: Normal / Fisiológico
  // ==========================================
  
  // Folículo ≤3cm em pré-menopausa
  if (tipo === 'foliculo' && tamanho <= 3 && statusMenopausal === 'pre') {
    return createMRIResult(1, lesao, 'Folículo fisiológico ≤3cm em pré-menopausa', options)
  }
  
  // Cisto hemorrágico ≤3cm em pré-menopausa
  if (tipo === 'cisto_hemorragico' && tamanho <= 3 && statusMenopausal === 'pre') {
    return createMRIResult(1, lesao, 'Cisto hemorrágico ≤3cm em pré-menopausa', options)
  }
  
  // Corpo lúteo ≤3cm em pré-menopausa
  if (tipo === 'corpo_luteo' && tamanho <= 3 && statusMenopausal === 'pre') {
    return createMRIResult(1, lesao, 'Corpo lúteo fisiológico ≤3cm em pré-menopausa', options)
  }

  // ==========================================
  // O-RADS MRI 5: Alto Risco (verificar primeiro)
  // ==========================================
  
  // Tecido sólido com curva de alto risco (exceto dark T2/dark DWI)
  if (tecidoSolido !== 'none' && sinalT2 !== 'dark_t2_dark_dwi' && curvaDCE === 'high_risk') {
    return createMRIResult(5, lesao, 'Tecido sólido com curva DCE de alto risco (Tipo 3)', options)
  }
  
  // Se DCE não realizado: tecido sólido com enhancement > miométrio em 30-40s
  if (tecidoSolido !== 'none' && sinalT2 !== 'dark_t2_dark_dwi' && 
      curvaDCE === 'not_performed' && enhancementVsMyometrium === 'more_than') {
    return createMRIResult(5, lesao, 'Tecido sólido com realce maior que miométrio em 30-40s (DCE não realizado)', options)
  }

  // ==========================================
  // O-RADS MRI 4: Risco Intermediário
  // ==========================================
  
  // Tecido sólido com curva de risco intermediário (exceto dark T2/dark DWI)
  if (tecidoSolido !== 'none' && sinalT2 !== 'dark_t2_dark_dwi' && curvaDCE === 'intermediate_risk') {
    return createMRIResult(4, lesao, 'Tecido sólido com curva DCE de risco intermediário (Tipo 2)', options)
  }
  
  // Se DCE não realizado: tecido sólido com enhancement ≤ miométrio em 30-40s
  if (tecidoSolido !== 'none' && sinalT2 !== 'dark_t2_dark_dwi' && 
      curvaDCE === 'not_performed' && 
      (enhancementVsMyometrium === 'less_than' || enhancementVsMyometrium === 'equal_to')) {
    return createMRIResult(4, lesao, 'Tecido sólido com realce menor ou igual ao miométrio em 30-40s (DCE não realizado)', options)
  }
  
  // Lesão lipídica com grande volume de tecido sólido com realce
  if (lipidContent && tecidoSolido === 'large_solid') {
    return createMRIResult(4, lesao, 'Lesão lipídica com componente sólido volumoso com realce', options)
  }

  // ==========================================
  // O-RADS MRI 3: Baixo Risco
  // ==========================================
  
  // Cisto unilocular com conteúdo proteináceo/hemorrágico/mucinoso + parede lisa com realce, sem tecido sólido
  if (tipo === 'cisto_unilocular' && 
      (conteudoFluido === 'proteinaceous' || conteudoFluido === 'hemorrhagic' || conteudoFluido === 'mucinous') &&
      (parede === 'thin_smooth' || parede === 'thick_smooth') && 
      paredeEnhancement && 
      tecidoSolido === 'none') {
    return createMRIResult(3, lesao, 'Cisto unilocular com conteúdo proteináceo/hemorrágico/mucinoso, parede lisa com realce, sem tecido sólido', options)
  }
  
  // Cisto multilocular com septações/parede lisa com realce, sem tecido sólido
  if (tipo === 'cisto_multilocular' && 
      !lipidContent &&
      septacao === 'smooth' && 
      (parede === 'thin_smooth' || parede === 'thick_smooth') &&
      tecidoSolido === 'none') {
    return createMRIResult(3, lesao, 'Cisto multilocular com septações lisas, sem tecido sólido', options)
  }
  
  // Tecido sólido (exceto dark T2/dark DWI) com curva de baixo risco
  if (tecidoSolido !== 'none' && sinalT2 !== 'dark_t2_dark_dwi' && curvaDCE === 'low_risk') {
    return createMRIResult(3, lesao, 'Tecido sólido com curva DCE de baixo risco (Tipo 1)', options)
  }
  
  // Tuba dilatada com conteúdo não-simples, parede fina
  if (tipo === 'tuba_dilatada' && conteudoFluido !== 'simple' && parede === 'thin_smooth' && tecidoSolido === 'none') {
    return createMRIResult(3, lesao, 'Tuba dilatada com conteúdo não-simples, parede fina, sem tecido sólido', options)
  }
  
  // Tuba dilatada com conteúdo simples, parede espessa lisa
  if (tipo === 'tuba_dilatada' && conteudoFluido === 'simple' && parede === 'thick_smooth' && tecidoSolido === 'none') {
    return createMRIResult(3, lesao, 'Tuba dilatada com conteúdo simples, parede espessa lisa, sem tecido sólido', options)
  }

  // ==========================================
  // O-RADS MRI 2: Quase Certamente Benigno
  // ==========================================
  
  // Cisto unilocular (qualquer conteúdo) sem realce de parede, sem tecido sólido
  if (tipo === 'cisto_unilocular' && !paredeEnhancement && tecidoSolido === 'none') {
    return createMRIResult(2, lesao, 'Cisto unilocular sem realce de parede, sem tecido sólido', options)
  }
  
  // Cisto unilocular simple/endometriotic com parede lisa com realce, sem tecido sólido
  if (tipo === 'cisto_unilocular' && 
      (conteudoFluido === 'simple' || conteudoFluido === 'endometriotic') &&
      (parede === 'thin_smooth' || parede === 'thick_smooth') && 
      paredeEnhancement && 
      tecidoSolido === 'none') {
    return createMRIResult(2, lesao, 'Cisto unilocular simples ou endometriótico com parede lisa, sem tecido sólido', options)
  }
  
  // Lesão lipídica sem tecido sólido com realce (ou apenas Rokitansky com mínimo realce)
  if (lipidContent && (tecidoSolido === 'none' || (rokitanskyEnhancement && tecidoSolido !== 'large_solid'))) {
    return createMRIResult(2, lesao, 'Lesão lipídica (teratoma) sem tecido sólido com realce significativo', options)
  }
  
  // Lesão sólida com "dark T2/dark DWI" (homogeneamente hipointenso) - fibroma/thecoma
  if (sinalT2 === 'dark_t2_dark_dwi') {
    return createMRIResult(2, lesao, 'Lesão sólida homogeneamente hipointensa em T2 e DWI (padrão fibroma/tecoma)', options)
  }
  
  // Tuba dilatada com conteúdo simples, parede fina lisa, pregas endossalpíneas visíveis
  if (tipo === 'tuba_dilatada' && conteudoFluido === 'simple' && parede === 'thin_smooth' && tecidoSolido === 'none') {
    return createMRIResult(2, lesao, 'Tuba dilatada com conteúdo simples, parede fina, sem tecido sólido (hidrossalpinge)', options)
  }
  
  // Cisto paraovariano
  if (tipo === 'cisto_paraovarian' && tecidoSolido === 'none') {
    return createMRIResult(2, lesao, 'Cisto paraovariano típico', options)
  }

  // ==========================================
  // Fallback - se não se encaixa em nenhuma categoria específica
  // ==========================================
  return createMRIResult(2, lesao, 'Lesão não classificada especificamente, presumida benigna', options)
}

function createMRIResult(score: number, lesao: ORADSMRILesao, justificativa: string, options?: ORADSMRIOptions): ORADSMRIResult {
  const category = getORADSMRICategoryFromDB(score, options)
  const recomendacao = getORADSMRIRecommendationFromDB(score, options)
  return {
    score,
    category,
    lesao,
    recomendacao,
    justificativa
  }
}

/**
 * Avalia achados associados que indicam O-RADS MRI 5
 */
export function hasHighRiskAssociatedFindingsMRI(data: ORADSMRIData): boolean {
  return data.nodulosPeritoneais || data.nodulosMesentéricos || data.nodulosOmentais || data.omental_caking || 
         (data.ascite && (data.asciteQuantidade === 'moderada' || data.asciteQuantidade === 'grande'))
}

// ============= FACTORY FUNCTIONS =============

export function createEmptyLesaoMRI(localizacao: 'ovario_direito' | 'ovario_esquerdo' = 'ovario_direito'): ORADSMRILesao {
  return {
    id: crypto.randomUUID(),
    tipo: 'cisto_unilocular',
    tamanho: 0,
    conteudoFluido: 'simple',
    tecidoSolido: 'none',
    sinalT1: 'hypointense',
    sinalT2: 'hyperintense',
    sinalDWI: 'non_restricted',
    curvaDCE: 'not_performed',
    paredeEnhancement: false,
    parede: 'thin_smooth',
    septacao: 'none',
    lipidContent: false,
    rokitanskyEnhancement: false,
    localizacao
  }
}

export function createEmptyORADSMRIData(): ORADSMRIData {
  return {
    statusMenopausal: 'pre',
    tecnica: {
      campo: '1.5T',
      contraste: true,
      sequencias: ['T1', 'T2', 'DWI', 'DCE'],
      dceRealizado: true
    },
    utero: {
      presente: true,
      posicao: 'anteversoflexao',
      forma: 'regular',
      mx: 0, my: 0, mz: 0,
      sinalT2: 'homogeneo',
      zonaJuncional: 'regular',
      nodulos: []
    },
    endometrio: {
      espessura: 0,
      sinalT2: 'normal',
      distensao: false,
      massaIntracavitaria: false
    },
    ovarioDireito: {
      presente: true,
      localizacao: 'parauterina',
      mx: 0, my: 0, mz: 0,
      sinalT2: 'normal',
      lesoes: []
    },
    ovarioEsquerdo: {
      presente: true,
      localizacao: 'parauterina',
      mx: 0, my: 0, mz: 0,
      sinalT2: 'normal',
      lesoes: []
    },
    ascite: false,
    nodulosPeritoneais: false,
    nodulosMesentéricos: false,
    nodulosOmentais: false,
    omental_caking: false,
    linfonodos: {
      presentes: false
    }
  }
}

// ============= VOLUME CALCULATIONS =============

export function calcularVolumeOvarianoMRI(mx: number, my: number, mz: number): number {
  if (!mx || !my || !mz) return 0
  return mx * my * mz * 0.52
}

export function calcularVolumeUterinoMRI(mx: number, my: number, mz: number): number {
  if (!mx || !my || !mz) return 0
  return mx * my * mz * 0.52
}

// ============= TEXT GENERATION =============

const formatBR = (num: number, decimals: number = 1): string => {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export function generateORADSMRITecnica(data: ORADSMRIData, options?: ORADSMRIOptions): string {
  const { tecnica } = data
  
  const seqText = tecnica.sequencias.join(', ')
  let texto = `Exame de ressonância magnética da pelve realizado em equipamento de ${tecnica.campo}, `
  texto += `com sequências ponderadas em ${seqText}`
  
  if (tecnica.contraste) {
    texto += ', com administração de meio de contraste paramagnético endovenoso (gadolínio)'
    if (tecnica.dceRealizado) {
      texto += ' e estudo dinâmico pós-contraste com análise de curvas tempo-intensidade'
    }
  }
  
  texto += ', seguindo protocolo ACR O-RADS MRI v2020.'
  
  return texto
}

export function generateORADSMRIUteroTexto(data: ORADSMRIData, options?: ORADSMRIOptions): string {
  const { utero } = data
  
  if (!utero.presente) {
    return 'Útero não visualizado / ausente cirurgicamente.'
  }
  
  const posicaoMap: Record<string, string> = {
    'anteversoflexao': 'anteversão e anteflexão',
    'retroversoflexao': 'retroversão e retroflexão',
    'medioversao': 'médio versão'
  }
  
  let texto = `Útero em ${posicaoMap[utero.posicao] || utero.posicao}`
  texto += `, de forma ${utero.forma}`
  texto += `, apresentando sinal T2 miometrial ${utero.sinalT2}`
  texto += ` e zona juncional ${utero.zonaJuncional}.`
  
  if (utero.mx > 0 && utero.my > 0 && utero.mz > 0) {
    const volume = calcularVolumeUterinoMRI(utero.mx, utero.my, utero.mz)
    texto += ` Mede ${formatBR(utero.mx)} x ${formatBR(utero.my)} x ${formatBR(utero.mz)} cm (volume estimado de ${formatBR(volume)} cm³).`
  }
  
  // Nódulos miometriais
  if (utero.nodulos && utero.nodulos.length > 0) {
    texto += '\n\n'
    utero.nodulos.forEach((nodulo, i) => {
      const volNodulo = nodulo.mx * nodulo.my * nodulo.mz * 0.52
      texto += `Nódulo miometrial ${nodulo.subtipo ? `(${nodulo.subtipo}) ` : ''}${nodulo.localizacao}, com sinal ${nodulo.sinalT2} em T2 e ${nodulo.enhancement}, medindo ${formatBR(nodulo.mx)} x ${formatBR(nodulo.my)} x ${formatBR(nodulo.mz)} cm (volume ~${formatBR(volNodulo)} cm³).`
      if (i < utero.nodulos.length - 1) texto += '\n'
    })
  }
  
  return texto
}

export function generateORADSMRIEndometrioTexto(data: ORADSMRIData, options?: ORADSMRIOptions): string {
  const { endometrio, statusMenopausal } = data
  
  let texto = `O endométrio apresenta espessura de ${formatBR(endometrio.espessura, 0)} mm`
  texto += `, com sinal ${endometrio.sinalT2} em T2.`
  
  if (statusMenopausal === 'pos' && endometrio.espessura > 5) {
    texto += ' Espessura endometrial acima do esperado para status pós-menopausal, recomendando-se correlação clínica.'
  }
  
  if (endometrio.distensao) {
    texto += ' Observa-se distensão da cavidade endometrial.'
  }
  
  if (endometrio.massaIntracavitaria) {
    texto += ' Nota-se imagem intracavitária sugestiva de massa/pólipo endometrial.'
  }
  
  return texto
}

export function generateORADSMRIOvarioTexto(ovario: OvarianDataMRI, lado: 'direito' | 'esquerdo', options?: ORADSMRIOptions): string {
  if (!ovario.presente) {
    return `Ovário ${lado} não visualizado no estudo atual / ausente cirurgicamente.`
  }
  
  const volume = ovario.volume || calcularVolumeOvarianoMRI(ovario.mx, ovario.my, ovario.mz)
  
  let texto = `Ovário ${lado} localizado em topografia ${ovario.localizacao || 'parauterina habitual'}`
  texto += `, com sinal parenquimatoso ${ovario.sinalT2 || 'habitual'} em T2`
  
  if (ovario.mx > 0 && ovario.my > 0 && ovario.mz > 0) {
    texto += `, medindo ${formatBR(ovario.mx)} x ${formatBR(ovario.my)} x ${formatBR(ovario.mz)} cm`
    texto += ` (volume estimado de ${formatBR(volume)} cm³).`
  } else {
    texto += '.'
  }
  
  // Lesões
  if (ovario.lesoes && ovario.lesoes.length > 0) {
    texto += '\n\n'
    ovario.lesoes.forEach((lesao, i) => {
      texto += generateLesaoMRITexto(lesao, i + 1, options)
      if (i < ovario.lesoes.length - 1) texto += '\n'
    })
  }
  
  return texto
}

function generateLesaoMRITexto(lesao: ORADSMRILesao, numero: number, options?: ORADSMRIOptions): string {
  const tipoMap: Record<TipoLesaoMRI, string> = {
    'cisto_unilocular': 'Formação cística unilocular',
    'cisto_multilocular': 'Formação cística multilocular',
    'lesao_solida': 'Lesão predominantemente sólida',
    'lesao_lipidica': 'Lesão com componente lipídico (teratoma)',
    'tuba_dilatada': 'Tuba uterina dilatada',
    'cisto_paraovarian': 'Cisto paraovariano',
    'foliculo': 'Folículo ovariano',
    'cisto_hemorragico': 'Cisto hemorrágico',
    'corpo_luteo': 'Corpo lúteo',
    'nenhuma': ''
  }
  
  const conteudoMap: Record<FluidContent, string> = {
    'simple': 'conteúdo de sinal líquido simples (T1 baixo, T2 alto)',
    'proteinaceous': 'conteúdo proteináceo (T1 intermediário/alto, T2 intermediário)',
    'hemorrhagic': 'conteúdo hemorrágico (T1 alto com shading em T2)',
    'mucinous': 'conteúdo mucinoso (T2 intermediário com focos T2 baixos)',
    'endometriotic': 'conteúdo endometriótico (T1 alto, T2 shading)',
    'lipid': 'conteúdo lipídico (T1 alto com supressão em fat-sat)'
  }
  
  let texto = `Lesão ${numero}: ${tipoMap[lesao.tipo]}, `
  texto += `medindo ${formatBR(lesao.tamanho)} cm no maior diâmetro, `
  texto += `apresentando ${conteudoMap[lesao.conteudoFluido]}.`
  
  // Sinais de imagem
  texto += ` Sinal T1 ${lesao.sinalT1 === 'hyperintense' ? 'hiperintenso' : lesao.sinalT1 === 'hypointense' ? 'hipointenso' : 'isointenso'}`
  texto += `, T2 ${lesao.sinalT2 === 'hyperintense' ? 'hiperintenso' : lesao.sinalT2 === 'hypointense' ? 'hipointenso' : lesao.sinalT2 === 'dark_t2_dark_dwi' ? 'homogeneamente hipointenso (dark T2)' : 'de sinal intermediário'}`
  texto += `, ${lesao.sinalDWI === 'restricted' ? 'com restrição à difusão' : lesao.sinalDWI === 'dark' ? 'sem sinal em DWI (dark DWI)' : 'sem restrição à difusão'}.`
  
  // Tecido sólido
  if (lesao.tecidoSolido !== 'none') {
    texto += ` Apresenta ${solidTissueDescriptions[lesao.tecidoSolido]}.`
  }
  
  // Curva DCE
  if (lesao.curvaDCE !== 'not_performed' && lesao.tecidoSolido !== 'none') {
    texto += ` ${getDCEDescriptionFromDB(lesao.curvaDCE, options)}.`
  }
  
  // Parede
  const paredeMap: Record<WallType, string> = {
    'thin_smooth': 'parede fina e lisa',
    'thick_smooth': 'parede espessa e lisa',
    'thin_irregular': 'parede fina irregular',
    'thick_irregular': 'parede espessa irregular',
    'no_wall': 'parede imperceptível'
  }
  texto += ` ${paredeMap[lesao.parede].charAt(0).toUpperCase() + paredeMap[lesao.parede].slice(1)}`
  texto += lesao.paredeEnhancement ? ' com realce após contraste.' : ' sem realce significativo.'
  
  return texto
}

export function generateORADSMRIAchadosAssociados(data: ORADSMRIData, options?: ORADSMRIOptions): string {
  const achados: string[] = []
  
  if (data.ascite) {
    achados.push(`Ascite ${data.asciteQuantidade || 'presente'}`)
  }
  
  if (data.nodulosPeritoneais) {
    achados.push('Nodularidade peritoneal')
  }
  
  if (data.nodulosMesentéricos) {
    achados.push('Nódulos mesentéricos')
  }
  
  if (data.nodulosOmentais || data.omental_caking) {
    achados.push(data.omental_caking ? 'Espessamento omental (omental caking)' : 'Nódulos omentais')
  }
  
  if (data.linfonodos.presentes) {
    let lnTexto = 'Linfonodomegalia'
    if (data.linfonodos.localizacao) lnTexto += ` em ${data.linfonodos.localizacao}`
    if (data.linfonodos.tamanho) lnTexto += ` (${formatBR(data.linfonodos.tamanho)} cm)`
    achados.push(lnTexto)
  }
  
  if (achados.length === 0) {
    return 'Sem achados associados significativos. Ausência de ascite ou nodularidade peritoneal/mesentérica/omental.'
  }
  
  return achados.join('. ') + '.'
}

export function generateORADSMRIImpressao(
  data: ORADSMRIData, 
  maxScore: number, 
  results: ORADSMRIResult[],
  options?: ORADSMRIOptions
): string {
  const category = getORADSMRICategoryFromDB(maxScore, options)
  
  let texto = ''
  
  // Lesões e seus scores
  if (results.length > 0) {
    results.forEach((result, i) => {
      const ladoText = result.lesao?.localizacao === 'ovario_direito' ? 'ovário direito' :
                       result.lesao?.localizacao === 'ovario_esquerdo' ? 'ovário esquerdo' :
                       result.lesao?.localizacao === 'paraovarian' ? 'região paraovariana' : 'região tubária'
      texto += `- Lesão em ${ladoText}: ${result.category.name} (${result.category.riscoNumerico} risco de malignidade) - ${result.justificativa}\n`
    })
  } else {
    texto += `- ${category.name}: ${category.risco}\n`
  }
  
  // Achados de alto risco
  if (hasHighRiskAssociatedFindingsMRI(data)) {
    texto += '\n- ACHADOS DE ALTO RISCO: '
    const highRisk: string[] = []
    if (data.nodulosPeritoneais) highRisk.push('nodularidade peritoneal')
    if (data.nodulosMesentéricos) highRisk.push('nódulos mesentéricos')
    if (data.nodulosOmentais) highRisk.push('nódulos omentais')
    if (data.omental_caking) highRisk.push('espessamento omental (omental caking)')
    if (data.ascite && (data.asciteQuantidade === 'moderada' || data.asciteQuantidade === 'grande')) {
      highRisk.push(`ascite ${data.asciteQuantidade}`)
    }
    texto += highRisk.join(', ') + ' → O-RADS MRI 5 independente da classificação da lesão'
  }
  
  return texto.trim()
}

export function generateORADSMRILaudoCompletoHTML(data: ORADSMRIData, options?: ORADSMRIOptions): string {
  // Calculate all lesion scores
  const allLesions = [
    ...data.ovarioDireito.lesoes.map(l => ({ lesao: l, lado: 'direito' as const })),
    ...data.ovarioEsquerdo.lesoes.map(l => ({ lesao: l, lado: 'esquerdo' as const }))
  ]
  
  const results = allLesions.map(({ lesao }) => evaluateORADSMRI(lesao, data.statusMenopausal, options))
  
  // Determine max score
  let maxScore = 1
  if (hasHighRiskAssociatedFindingsMRI(data)) {
    maxScore = 5
  } else if (results.length > 0) {
    maxScore = Math.max(...results.map(r => r.score))
  }
  
  const category = getORADSMRICategoryFromDB(maxScore, options)
  const recomendacao = getORADSMRIRecommendationFromDB(maxScore, options)
  
  let html = '<p><strong>RESSONÂNCIA MAGNÉTICA DA PELVE - PROTOCOLO O-RADS MRI</strong></p>'
  
  // Indicação
  if (data.indicacao) {
    html += `<p><strong>INDICAÇÃO CLÍNICA:</strong> ${data.indicacao}</p>`
  }
  
  // Técnica
  html += `<p><strong>TÉCNICA:</strong><br/>${generateORADSMRITecnica(data, options)}</p>`
  
  // Relatório
  html += '<p><strong>RELATÓRIO:</strong></p>'
  
  // Útero
  html += `<p><em>Útero:</em><br/>${generateORADSMRIUteroTexto(data, options)}</p>`
  
  // Endométrio
  html += `<p><em>Endométrio:</em><br/>${generateORADSMRIEndometrioTexto(data, options)}</p>`
  
  // Ovários
  html += `<p><em>Ovário direito:</em><br/>${generateORADSMRIOvarioTexto(data.ovarioDireito, 'direito', options)}</p>`
  html += `<p><em>Ovário esquerdo:</em><br/>${generateORADSMRIOvarioTexto(data.ovarioEsquerdo, 'esquerdo', options)}</p>`
  
  // Achados associados
  html += `<p><em>Achados associados:</em><br/>${generateORADSMRIAchadosAssociados(data, options)}</p>`
  
  // Comparativo
  if (data.comparativo?.temEstudoAnterior) {
    html += `<p><em>Estudo comparativo:</em><br/>`
    html += `Comparado com exame de ${data.comparativo.dataAnterior || 'data não especificada'}. `
    html += `Evolução: ${data.comparativo.evolucao || 'não especificada'}.`
    if (data.comparativo.conclusaoAnterior) {
      html += ` Conclusão anterior: ${data.comparativo.conclusaoAnterior}`
    }
    html += '</p>'
  }
  
  // Impressão
  html += '<p><strong>IMPRESSÃO:</strong></p>'
  html += `<p>${generateORADSMRIImpressao(data, maxScore, results, options).replace(/\n/g, '<br/>')}</p>`
  
  // Classificação final destacada
  html += `<p><strong>Classificação Final: ${category.name}</strong> - ${category.risco} (Risco: ${category.riscoNumerico})</p>`
  
  // Recomendação
  html += `<p><strong>RECOMENDAÇÃO:</strong><br/>${recomendacao}</p>`
  
  // Notas
  if (data.notas) {
    html += `<p><strong>NOTAS:</strong><br/>${data.notas}</p>`
  }
  
  return html
}
