/**
 * PI-RADS v2.1 Classification System
 * Prostate Imaging Reporting and Data System
 * 
 * Based on ACR PI-RADS® v2.1 (2019)
 */

// ============================================
// INTERFACES
// ============================================

export interface PIRADSLesao {
  id: string
  zona: 'pz' | 'tz' | 'afms' // Peripheral Zone, Transition Zone, Anterior Fibromuscular Stroma
  setor: string // ACR sector (e.g., 'base_posterior_direita')
  lado: 'direita' | 'esquerda' | 'linha_media'
  nivel: 'base' | 'medio' | 'apice'
  medidas: [number, number, number] // mm - three dimensions
  t2wScore: 1 | 2 | 3 | 4 | 5
  dwiScore: 1 | 2 | 3 | 4 | 5
  dcePositivo: boolean | null // null = not evaluated
  epe: 'nao' | 'suspeita' | 'definitiva' // Extraprostatic Extension
  invasaoSV: boolean // Seminal Vesicle Invasion
  lesaoIndice: boolean // Is this the index lesion?
}

export interface PIRADSData {
  // Indication
  indicacao: string
  psaTotal: number
  psaData: string
  biopsiaPreviaPositiva: boolean
  biopsiaPreviaNegativa: boolean
  biopsiaPrevia: string
  gleason: string
  vigilanciaAtiva: boolean
  
  // Prostate
  prostataMedidas: [number, number, number] // C×L×P cm
  prostataVolume: number // cm³ (calculated)
  psaDensity: number // ng/mL/cm³ (calculated)
  zonaCentral: string
  protrusaoVesical: number // mm
  hemorragia: boolean
  hemorragiaDescricao: string
  
  // Technique
  campoMagnetico: '1.5T' | '3.0T'
  bobinaEndorretal: boolean
  dwiAdequado: boolean
  dceAdequado: boolean
  qualidadeEstudo: string
  
  // Lesions
  lesoes: PIRADSLesao[]
  
  // Additional findings
  extensaoExtraprostática: string
  feixesNeurovasculares: string
  vesiculasSeminais: string
  linfonodos: string
  osso: string
  bexiga: string
  uretraMembranosa: number // mm
  achadosIncidentais: string
  
  // Comparison
  estudoComparativo: string
  dataExameAnterior: string
  
  // Override
  recomendacaoManual: string
  notas: string
}

// ============================================
// CONSTANTS
// ============================================

export const piradsCategories = [
  { value: 1, label: 'PI-RADS 1', description: 'Muito baixo - Improvável câncer clinicamente significativo', risk: '~2%', color: 'green' },
  { value: 2, label: 'PI-RADS 2', description: 'Baixo - Improvável câncer clinicamente significativo', risk: '~4%', color: 'green' },
  { value: 3, label: 'PI-RADS 3', description: 'Intermediário - Presença de câncer clinicamente significativo é incerta', risk: '~20%', color: 'yellow' },
  { value: 4, label: 'PI-RADS 4', description: 'Alto - Provável câncer clinicamente significativo', risk: '~52%', color: 'orange' },
  { value: 5, label: 'PI-RADS 5', description: 'Muito alto - Altamente provável câncer clinicamente significativo', risk: '~89%', color: 'red' },
]

export const ACR_PIRADS_REFERENCE = {
  title: 'ACR PI-RADS® v2.1',
  year: 2019,
  source: 'American College of Radiology',
  url: 'https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/PI-RADS'
}

// ACR 38-zone prostate sectors
export const prostateSectors = [
  // Base
  { value: 'base_anterior_direita', label: 'Base - Anterior Direita', zona: 'tz' },
  { value: 'base_anterior_esquerda', label: 'Base - Anterior Esquerda', zona: 'tz' },
  { value: 'base_posterior_direita', label: 'Base - Posterior Direita', zona: 'pz' },
  { value: 'base_posterior_esquerda', label: 'Base - Posterior Esquerda', zona: 'pz' },
  { value: 'base_posterolateral_direita', label: 'Base - Póstero-lateral Direita', zona: 'pz' },
  { value: 'base_posterolateral_esquerda', label: 'Base - Póstero-lateral Esquerda', zona: 'pz' },
  { value: 'base_posteromedial_direita', label: 'Base - Póstero-medial Direita', zona: 'pz' },
  { value: 'base_posteromedial_esquerda', label: 'Base - Póstero-medial Esquerda', zona: 'pz' },
  // Mid-gland
  { value: 'medio_anterior_direita', label: 'Terço Médio - Anterior Direita', zona: 'tz' },
  { value: 'medio_anterior_esquerda', label: 'Terço Médio - Anterior Esquerda', zona: 'tz' },
  { value: 'medio_posterior_direita', label: 'Terço Médio - Posterior Direita', zona: 'pz' },
  { value: 'medio_posterior_esquerda', label: 'Terço Médio - Posterior Esquerda', zona: 'pz' },
  { value: 'medio_posterolateral_direita', label: 'Terço Médio - Póstero-lateral Direita', zona: 'pz' },
  { value: 'medio_posterolateral_esquerda', label: 'Terço Médio - Póstero-lateral Esquerda', zona: 'pz' },
  { value: 'medio_posteromedial_direita', label: 'Terço Médio - Póstero-medial Direita', zona: 'pz' },
  { value: 'medio_posteromedial_esquerda', label: 'Terço Médio - Póstero-medial Esquerda', zona: 'pz' },
  // Apex
  { value: 'apice_anterior_direita', label: 'Ápice - Anterior Direita', zona: 'tz' },
  { value: 'apice_anterior_esquerda', label: 'Ápice - Anterior Esquerda', zona: 'tz' },
  { value: 'apice_posterior_direita', label: 'Ápice - Posterior Direita', zona: 'pz' },
  { value: 'apice_posterior_esquerda', label: 'Ápice - Posterior Esquerda', zona: 'pz' },
  { value: 'apice_posterolateral_direita', label: 'Ápice - Póstero-lateral Direita', zona: 'pz' },
  { value: 'apice_posterolateral_esquerda', label: 'Ápice - Póstero-lateral Esquerda', zona: 'pz' },
  // Central zone / AFMS
  { value: 'afms_base', label: 'AFMS - Base', zona: 'afms' },
  { value: 'afms_medio', label: 'AFMS - Terço Médio', zona: 'afms' },
  { value: 'afms_apice', label: 'AFMS - Ápice', zona: 'afms' },
  { value: 'zona_central', label: 'Zona Central', zona: 'tz' },
]

// ============================================
// T2W SCORING
// ============================================

export const t2wScoresPZ = [
  { value: 1, label: 'T2W 1', texto: 'Intensidade de sinal hiperintenso homogêneo (normal)' },
  { value: 2, label: 'T2W 2', texto: 'Hipointensidade linear ou em forma de cunha ou hipointensidade difusa leve, geralmente com margem indistinta' },
  { value: 3, label: 'T2W 3', texto: 'Intensidade de sinal heterogênea ou não circunscrita, arredondada, hipointensidade moderada (não se enquadra em 2, 4 ou 5)' },
  { value: 4, label: 'T2W 4', texto: 'Foco/massa hipointensa moderadamente homogênea circunscrita, confinada à próstata e < 1,5 cm' },
  { value: 5, label: 'T2W 5', texto: 'Igual a 4, mas ≥ 1,5 cm na maior dimensão ou extensão extraprostática/invasiva definida' },
]

export const t2wScoresTZ = [
  { value: 1, label: 'T2W 1', texto: 'Aparência normal da TZ (raro) ou nódulo redondo completamente encapsulado ("nódulo típico")' },
  { value: 2, label: 'T2W 2', texto: 'Nódulo predominantemente encapsulado ou nódulo circunscrito homogêneo sem cápsula ("nódulo atípico") ou área homogênea levemente hipointensa entre nódulos' },
  { value: 3, label: 'T2W 3', texto: 'Área com intensidade de sinal heterogênea com margens obscuras (não se qualifica como 2, 4 ou 5)' },
  { value: 4, label: 'T2W 4', texto: 'Forma lenticular ou não circunscrita, homogênea, moderadamente hipointensa e < 1,5 cm' },
  { value: 5, label: 'T2W 5', texto: 'Igual a 4, mas ≥ 1,5 cm na maior dimensão ou extensão extraprostática/invasiva definida' },
]

// ============================================
// DWI SCORING (Universal)
// ============================================

export const dwiScores = [
  { value: 1, label: 'DWI 1', texto: 'Não há anormalidade na DWI ou na imagem de alto valor b' },
  { value: 2, label: 'DWI 2', texto: 'Hipointensidade linear ou em forma de cunha no ADC e/ou hiperintensidade linear ou em forma de cunha na imagem de alto valor b' },
  { value: 3, label: 'DWI 3', texto: 'Lesão focal (discreta e diferente do fundo) hipointensa no ADC e/ou hiperintensa na imagem de alto valor b; pode ser marcadamente hipointensa no ADC ou marcadamente hiperintensa no alto b, mas não ambos' },
  { value: 4, label: 'DWI 4', texto: 'Lesão focal marcadamente hipointensa no ADC e marcadamente hiperintensa na imagem de alto valor b; < 1,5 cm' },
  { value: 5, label: 'DWI 5', texto: 'Igual a 4, mas ≥ 1,5 cm na maior dimensão ou com extensão extraprostática/comportamento invasivo definitivo' },
]

// ============================================
// DCE ASSESSMENT
// ============================================

export const dceAssessment = [
  { value: 'negativo', label: 'DCE (−)', texto: 'Sem realce precoce ou simultâneo, ou realce multifocal difuso não correspondendo a achado focal em T2W/DWI, ou realce correspondendo a HPB' },
  { value: 'positivo', label: 'DCE (+)', texto: 'Realce focal, mais precoce que ou contemporâneo ao realce de tecidos prostáticos normais adjacentes, e corresponde a achado suspeito em T2W e/ou DWI' },
  { value: 'nao_avaliado', label: 'Não avaliado', texto: 'DCE não realizado ou inadequado para avaliação' },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createEmptyPIRADSLesao(): PIRADSLesao {
  return {
    id: Math.random().toString(36).substring(2, 9),
    zona: 'pz',
    setor: 'medio_posterolateral_direita',
    lado: 'direita',
    nivel: 'medio',
    medidas: [0, 0, 0],
    t2wScore: 1,
    dwiScore: 1,
    dcePositivo: null,
    epe: 'nao',
    invasaoSV: false,
    lesaoIndice: false,
  }
}

export function createEmptyPIRADSData(): PIRADSData {
  return {
    // Indication
    indicacao: '',
    psaTotal: 0,
    psaData: '',
    biopsiaPreviaPositiva: false,
    biopsiaPreviaNegativa: false,
    biopsiaPrevia: '',
    gleason: '',
    vigilanciaAtiva: false,
    
    // Prostate
    prostataMedidas: [0, 0, 0],
    prostataVolume: 0,
    psaDensity: 0,
    zonaCentral: '',
    protrusaoVesical: 0,
    hemorragia: false,
    hemorragiaDescricao: '',
    
    // Technique
    campoMagnetico: '3.0T',
    bobinaEndorretal: false,
    dwiAdequado: true,
    dceAdequado: true,
    qualidadeEstudo: 'satisfatoria',
    
    // Lesions
    lesoes: [],
    
    // Additional findings
    extensaoExtraprostática: 'nao_identificada',
    feixesNeurovasculares: 'preservados',
    vesiculasSeminais: 'normais',
    linfonodos: 'sem_linfonodopatia',
    osso: 'sem_lesoes',
    bexiga: 'normal',
    uretraMembranosa: 0,
    achadosIncidentais: '',
    
    // Comparison
    estudoComparativo: 'primeiro_exame',
    dataExameAnterior: '',
    
    // Override
    recomendacaoManual: '',
    notas: '',
  }
}

export function calculateProstateVolume(medidas: [number, number, number]): number {
  // V = L × W × H × 0.52 (ellipsoid formula)
  const [l, w, h] = medidas
  return l * w * h * 0.52
}

export function calculatePSADensity(psa: number, volume: number): number {
  if (volume <= 0) return 0
  return psa / volume
}

export function formatMeasurement(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function getLargestDimension(lesao: PIRADSLesao): number {
  return Math.max(...lesao.medidas)
}

// ============================================
// PI-RADS EVALUATION LOGIC
// ============================================

/**
 * Evaluate PI-RADS for Peripheral Zone lesion
 * In PZ: DWI is the dominant sequence
 */
export function evaluatePIRADSPZ(lesao: PIRADSLesao): 1 | 2 | 3 | 4 | 5 {
  const dwiScore = lesao.dwiScore
  
  // DWI 1 or 2 → PI-RADS 1 or 2
  if (dwiScore <= 2) {
    return dwiScore as 1 | 2
  }
  
  // DWI 3 → can be upgraded by positive DCE
  if (dwiScore === 3) {
    return lesao.dcePositivo === true ? 4 : 3
  }
  
  // DWI 4 or 5 → PI-RADS 4 or 5
  return dwiScore as 4 | 5
}

/**
 * Evaluate PI-RADS for Transition Zone lesion
 * In TZ: T2W is the dominant sequence
 */
export function evaluatePIRADSTZ(lesao: PIRADSLesao): 1 | 2 | 3 | 4 | 5 {
  const t2wScore = lesao.t2wScore
  
  // T2W 1 or 2 → PI-RADS 1 or 2
  if (t2wScore <= 2) {
    return t2wScore as 1 | 2
  }
  
  // T2W 3 → can be upgraded by DWI ≥4
  if (t2wScore === 3) {
    return lesao.dwiScore >= 4 ? 4 : 3
  }
  
  // T2W 4 or 5 → PI-RADS 4 or 5
  return t2wScore as 4 | 5
}

/**
 * Evaluate PI-RADS for AFMS lesion
 * AFMS lesions use PZ criteria (DWI dominant)
 */
export function evaluatePIRADSAFMS(lesao: PIRADSLesao): 1 | 2 | 3 | 4 | 5 {
  return evaluatePIRADSPZ(lesao)
}

/**
 * Evaluate a single lesion based on its zone
 */
export function evaluateLesion(lesao: PIRADSLesao): 1 | 2 | 3 | 4 | 5 {
  switch (lesao.zona) {
    case 'pz':
      return evaluatePIRADSPZ(lesao)
    case 'tz':
      return evaluatePIRADSTZ(lesao)
    case 'afms':
      return evaluatePIRADSAFMS(lesao)
    default:
      return 1
  }
}

/**
 * Calculate global PI-RADS category (highest among all lesions)
 */
export function evaluatePIRADS(data: PIRADSData): 1 | 2 | 3 | 4 | 5 {
  if (data.lesoes.length === 0) {
    return 1
  }
  
  let maxScore: 1 | 2 | 3 | 4 | 5 = 1
  
  for (const lesao of data.lesoes) {
    const score = evaluateLesion(lesao)
    if (score > maxScore) {
      maxScore = score
    }
  }
  
  return maxScore
}

/**
 * Get the index lesion (highest PI-RADS, largest size as tiebreaker)
 */
export function getIndexLesion(data: PIRADSData): PIRADSLesao | null {
  if (data.lesoes.length === 0) return null
  
  // Find lesion marked as index, or calculate automatically
  const markedIndex = data.lesoes.find(l => l.lesaoIndice)
  if (markedIndex) return markedIndex
  
  // Auto-determine: highest PI-RADS, then largest size
  let indexLesao = data.lesoes[0]
  let indexScore = evaluateLesion(indexLesao)
  let indexSize = getLargestDimension(indexLesao)
  
  for (let i = 1; i < data.lesoes.length; i++) {
    const lesao = data.lesoes[i]
    const score = evaluateLesion(lesao)
    const size = getLargestDimension(lesao)
    
    if (score > indexScore || (score === indexScore && size > indexSize)) {
      indexLesao = lesao
      indexScore = score
      indexSize = size
    }
  }
  
  return indexLesao
}

// ============================================
// TEXT GENERATION FUNCTIONS
// ============================================

function getZonaLabel(zona: string): string {
  switch (zona) {
    case 'pz': return 'zona periférica'
    case 'tz': return 'zona de transição'
    case 'afms': return 'estroma fibromuscular anterior'
    default: return zona
  }
}

function getSetorLabel(setor: string): string {
  const sector = prostateSectors.find(s => s.value === setor)
  return sector?.label.toLowerCase() || setor
}

function getLadoLabel(lado: string): string {
  switch (lado) {
    case 'direita': return 'direita'
    case 'esquerda': return 'esquerda'
    case 'linha_media': return 'linha média'
    default: return lado
  }
}

export function generatePIRADSTecnica(data: PIRADSData): string {
  const partes: string[] = []
  
  partes.push(`Aquisições multiplanares e multisequenciais da pelve de acordo com as recomendações do PI-RADS antes e após a injeção endovenosa do meio de contraste paramagnético em aparelho de ${data.campoMagnetico}${data.bobinaEndorretal ? ' com bobina endorretal' : ''}.`)
  partes.push('Aquisições dedicadas em 3 planos nas ponderações T2, axiais em difusão e mapa ADC, axial 3D dinâmico em perfusão e axial pós contraste da pelve.')
  
  return partes.join(' ')
}

export function generatePIRADSIndicacao(data: PIRADSData): string {
  const partes: string[] = []
  
  if (data.psaTotal > 0) {
    partes.push(`PSA sérico${data.psaData ? ` medido em ${data.psaData}` : ''}: ${formatMeasurement(data.psaTotal)} ng/mL.`)
  }
  
  if (data.biopsiaPreviaPositiva && data.gleason) {
    partes.push(`Biópsia prévia indicou adenocarcinoma de próstata ${data.gleason}.`)
  } else if (data.biopsiaPreviaNegativa) {
    partes.push('Biópsia prévia negativa.')
  }
  
  if (data.vigilanciaAtiva) {
    partes.push('Paciente em vigilância ativa.')
  }
  
  if (data.biopsiaPrevia) {
    partes.push(data.biopsiaPrevia)
  }
  
  return partes.join(' ')
}

export function generatePIRADSProstata(data: PIRADSData): string {
  const partes: string[] = []
  
  // Volume
  const volume = data.prostataVolume > 0 ? data.prostataVolume : calculateProstateVolume(data.prostataMedidas)
  const [c, l, p] = data.prostataMedidas
  
  if (c > 0 && l > 0 && p > 0) {
    partes.push(`Tamanho: ${formatMeasurement(c)} x ${formatMeasurement(l)} x ${formatMeasurement(p)} cm, com volume estimado em ${formatMeasurement(volume)} cm³ (Vr.: 20 - 30 cm³).`)
  }
  
  // PSA Density
  if (data.psaTotal > 0 && volume > 0) {
    const psad = calculatePSADensity(data.psaTotal, volume)
    partes.push(`Densidade do PSA: ${formatMeasurement(psad)} ng/mL/cm³.`)
  }
  
  // Protrusão vesical
  if (data.protrusaoVesical > 0) {
    partes.push(`Protrusão abaulando o assoalho vesical em cerca de ${formatMeasurement(data.protrusaoVesical)} mm.`)
  }
  
  // Hemorragia
  if (data.hemorragia) {
    partes.push(data.hemorragiaDescricao || 'Sinais de hemorragia pós-biópsia.')
  } else {
    partes.push('Hemorragia: Não evidenciada.')
  }
  
  return partes.join(' ')
}

export function generatePIRADSLesaoTexto(lesao: PIRADSLesao, index: number): string {
  const partes: string[] = []
  const score = evaluateLesion(lesao)
  const maxDim = getLargestDimension(lesao)
  
  const zonaLabel = lesao.zona === 'pz' ? 'Zona periférica' : lesao.zona === 'tz' ? 'Zona transicional' : 'Estroma fibromuscular anterior'
  const setorLabel = getSetorLabel(lesao.setor)
  
  // T2W description
  const t2wDesc = lesao.zona === 'pz' 
    ? t2wScoresPZ.find(s => s.value === lesao.t2wScore)?.texto 
    : t2wScoresTZ.find(s => s.value === lesao.t2wScore)?.texto
  
  // DWI description
  const dwiDesc = dwiScores.find(s => s.value === lesao.dwiScore)?.texto
  
  // DCE
  const dceLabel = lesao.dcePositivo === true ? '+' : lesao.dcePositivo === false ? '-' : 'não avaliado'
  
  if (lesao.zona === 'pz') {
    // For PZ lesions
    if (score >= 4) {
      partes.push(`- Nódulo com hipossinal em T2, restrição a difusão e ${lesao.dcePositivo ? 'realce precoce pelo meio de contraste' : 'sem realce precoce significativo'}, localizado no setor ${setorLabel}, medindo ${formatMeasurement(maxDim)} mm (T2: ${lesao.t2wScore}; DWI: ${lesao.dwiScore}; DCE${dceLabel})`)
      
      if (lesao.epe === 'definitiva') {
        partes.push(`. Há extensão extraprostática definida`)
      } else if (lesao.epe === 'suspeita') {
        partes.push(`. Há ampla base de contato com a margem prostática, sugerindo possível extensão extraprostática`)
      }
      
      partes.push(` - PI-RADS ${score}.`)
    } else {
      partes.push(`- ${zonaLabel}: ${t2wDesc?.toLowerCase() || 'sem alterações significativas'} (T2: ${lesao.t2wScore}, DWI: ${lesao.dwiScore}, DCE: ${dceLabel}) PI-RADS ${score}.`)
    }
  } else {
    // For TZ lesions
    if (score >= 4) {
      partes.push(`- ${zonaLabel}: lesão com ${t2wDesc?.toLowerCase()}, localizada no setor ${setorLabel}, medindo ${formatMeasurement(maxDim)} mm (T2: ${lesao.t2wScore}; DWI: ${lesao.dwiScore}; DCE${dceLabel}) - PI-RADS ${score}.`)
    } else {
      partes.push(`- ${zonaLabel}: ${t2wDesc?.toLowerCase() || 'sem alterações significativas'} (T2: ${lesao.t2wScore}, DWI: ${lesao.dwiScore}, DCE: ${dceLabel}) PI-RADS ${score}.`)
    }
  }
  
  return partes.join('')
}

export function generatePIRADSRelatorio(data: PIRADSData): string {
  const partes: string[] = []
  
  // Quality
  const qualidadeMap: Record<string, string> = {
    'otima': 'Ótima',
    'satisfatoria': 'Satisfatória',
    'limitada': 'Limitada',
    'inadequada': 'Inadequada',
  }
  partes.push(`- Qualidade: ${qualidadeMap[data.qualidadeEstudo] || 'Satisfatória'}.`)
  
  // Prostate
  partes.push(`- ${generatePIRADSProstata(data)}`)
  
  // Lesions by zone
  const pzLesoes = data.lesoes.filter(l => l.zona === 'pz')
  const tzLesoes = data.lesoes.filter(l => l.zona === 'tz')
  const afmsLesoes = data.lesoes.filter(l => l.zona === 'afms')
  
  // TZ findings
  if (tzLesoes.length === 0) {
    partes.push(`- Zona transicional: sinais de hiperplasia difusa desta zona, sem lesões infiltrativas suspeitas.`)
  } else {
    for (const lesao of tzLesoes) {
      partes.push(generatePIRADSLesaoTexto(lesao, 0))
    }
  }
  
  // PZ findings
  if (pzLesoes.length === 0) {
    partes.push(`- Zona periférica: sem lesões focais suspeitas identificadas.`)
  } else {
    for (let i = 0; i < pzLesoes.length; i++) {
      partes.push(generatePIRADSLesaoTexto(pzLesoes[i], i))
    }
  }
  
  // AFMS findings
  if (afmsLesoes.length > 0) {
    for (const lesao of afmsLesoes) {
      partes.push(generatePIRADSLesaoTexto(lesao, 0))
    }
  }
  
  // Additional findings
  const epeMap: Record<string, string> = {
    'nao_identificada': 'Não identificada',
    'suspeita': 'Suspeita de extensão extraprostática',
    'definitiva': 'Extensão extraprostática definida',
  }
  partes.push(`- Extensão extraprostática: ${epeMap[data.extensaoExtraprostática] || 'Não identificada'}.`)
  
  partes.push(`- Feixes neurovasculares: ${data.feixesNeurovasculares === 'preservados' ? 'Preservados, sem sinais de envolvimento' : data.feixesNeurovasculares}.`)
  partes.push(`- Vesículas seminais: ${data.vesiculasSeminais === 'normais' ? 'Sem alterações' : data.vesiculasSeminais}.`)
  partes.push(`- Linfonodos: ${data.linfonodos === 'sem_linfonodopatia' ? 'Sem linfonodopatia suspeita' : data.linfonodos}.`)
  partes.push(`- ${data.osso === 'sem_lesoes' ? 'Não há sinais de lesões ósseas destrutivas' : data.osso}.`)
  partes.push(`- Bexiga: ${data.bexiga === 'normal' ? 'com moderada repleção, conteúdo homogêneo e paredes de espessura normal' : data.bexiga}.`)
  
  if (data.uretraMembranosa > 0) {
    partes.push(` A uretra membranosa se estende por ${formatMeasurement(data.uretraMembranosa)} mm.`)
  }
  
  if (data.achadosIncidentais) {
    partes.push(`- ${data.achadosIncidentais}`)
  }
  
  return partes.join('\n')
}

export function generatePIRADSImpressao(data: PIRADSData, piradsScore: number): string {
  const partes: string[] = []
  const category = piradsCategories.find(c => c.value === piradsScore)
  
  partes.push(`Categoria global PI-RADS: ${piradsScore} para a lesão na ${data.lesoes.length > 0 ? getZonaLabel(data.lesoes[0].zona) : 'próstata'}${category ? `, ${category.description.toLowerCase()}` : ''}.`)
  
  if (piradsScore >= 3) {
    partes.push('Sugere-se, a critério clínico, correlação com estudo anatomo-patológico.')
  }
  
  return partes.join(' ')
}

export function generatePIRADSRecomendacao(data: PIRADSData, piradsScore: number): string {
  if (data.recomendacaoManual) {
    return data.recomendacaoManual
  }
  
  switch (piradsScore) {
    case 1:
    case 2:
      return 'Seguimento clínico de acordo com as diretrizes institucionais.'
    case 3:
      return 'Considerar biópsia guiada por fusão RM/US ou acompanhamento com RM em 6-12 meses, a critério clínico.'
    case 4:
    case 5:
      return 'Biópsia guiada por fusão RM/US é recomendada para confirmação histopatológica.'
    default:
      return ''
  }
}

export function generatePIRADSComparativo(data: PIRADSData): string {
  if (data.estudoComparativo === 'primeiro_exame') {
    return 'Primeiro exame de RM da próstata.'
  }
  
  if (data.dataExameAnterior) {
    return `Comparado com RM da próstata de ${data.dataExameAnterior}.`
  }
  
  return ''
}

export function generatePIRADSNotas(data: PIRADSData): string {
  const partes: string[] = []
  
  if (data.notas) {
    partes.push(data.notas)
  }
  
  return partes.join('\n')
}

export function generatePIRADSCategoriasReferencia(): string {
  return `PI‐RADS v2.1 Categorias de avaliação
PI-RADS 1 – Muito Baixo: Improvável que haja um câncer clinicamente significativo presente.
PI-RADS 2 – Baixo: Improvável que haja um câncer clinicamente significativo presente.
PI-RADS 3 – Intermediário: A presença de câncer clinicamente significativo é incerta. Sugere-se, a critério clínico, correlação com estudo anatomo-patológico.
PI-RADS 4 – Alto: É provável que haja um câncer clinicamente significativo presente. Sugere-se, a critério clínico, correlação com estudo anatomo-patológico.
PI-RADS 5 – Muito alto: É altamente provável que haja um câncer clinicamente significativo presente. Sugere-se, a critério clínico, correlação com estudo anatomo-patológico.`
}

export function generatePIRADSLaudoCompletoHTML(data: PIRADSData, piradsScore: number): string {
  const indicacao = generatePIRADSIndicacao(data)
  const tecnica = generatePIRADSTecnica(data)
  const comparativo = generatePIRADSComparativo(data)
  const relatorio = generatePIRADSRelatorio(data)
  const impressao = generatePIRADSImpressao(data, piradsScore)
  const recomendacao = generatePIRADSRecomendacao(data, piradsScore)
  const notas = generatePIRADSNotas(data)
  const categorias = generatePIRADSCategoriasReferencia()

  return `<p><strong>RESSONÂNCIA MAGNÉTICA MULTIPARAMÉTRICA DA PRÓSTATA</strong></p>
<p></p>
<p><strong>INDICAÇÃO:</strong></p>
<p>${indicacao}</p>
<p></p>
<p><strong>TÉCNICA:</strong></p>
<p>${tecnica}</p>
<p></p>
${comparativo ? `<p><strong>COMPARAÇÃO:</strong></p>
<p>${comparativo}</p>
<p></p>` : ''}
<p><strong>RELATÓRIO:</strong></p>
<p>${relatorio.replace(/\n/g, '</p><p>')}</p>
<p></p>
<p><strong>IMPRESSÃO:</strong></p>
<p>${impressao}</p>
<p></p>
${recomendacao ? `<p><strong>RECOMENDAÇÃO:</strong></p>
<p>${recomendacao}</p>
<p></p>` : ''}
${notas ? `<p><strong>OBSERVAÇÕES:</strong></p>
<p>${notas.replace(/\n/g, '</p><p>')}</p>
<p></p>` : ''}
<p style="font-size: 10px; color: #666;">${categorias.replace(/\n/g, '<br>')}</p>`
}
