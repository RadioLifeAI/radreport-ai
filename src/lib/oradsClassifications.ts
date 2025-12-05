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

// ============= CONSTANTS =============

export const oradsCategories: Record<number, ORADSCategory> = {
  0: {
    score: 0,
    name: 'O-RADS 0',
    risco: 'Avaliação Incompleta',
    riscoNumerico: 'N/A',
    cor: 'gray',
    recomendacao: 'Completar avaliação com exame adicional ou técnica alternativa.'
  },
  1: {
    score: 1,
    name: 'O-RADS 1',
    risco: 'Normal',
    riscoNumerico: '0%',
    cor: 'green',
    recomendacao: 'Ovário normal, sem lesão identificada. Nenhum seguimento necessário.'
  },
  2: {
    score: 2,
    name: 'O-RADS 2',
    risco: 'Quase Certamente Benigno',
    riscoNumerico: '<1%',
    cor: 'green',
    recomendacao: 'Risco de malignidade muito baixo. Seguimento conforme características e status menopausal.'
  },
  3: {
    score: 3,
    name: 'O-RADS 3',
    risco: 'Baixo Risco de Malignidade',
    riscoNumerico: '1-10%',
    cor: 'yellow',
    recomendacao: 'Se não excisado cirurgicamente, seguimento ultrassonográfico em 6 meses. Se lesão sólida, considerar avaliação por especialista ou RM.'
  },
  4: {
    score: 4,
    name: 'O-RADS 4',
    risco: 'Risco Intermediário de Malignidade',
    riscoNumerico: '10-50%',
    cor: 'orange',
    recomendacao: 'Revisão por especialista em ultrassom ou RM. Manejo por ginecologista com suporte de oncologia ginecológica ou exclusivamente por oncologista ginecológico.'
  },
  5: {
    score: 5,
    name: 'O-RADS 5',
    risco: 'Alto Risco de Malignidade',
    riscoNumerico: '≥50%',
    cor: 'red',
    recomendacao: 'Encaminhamento para oncologista ginecológico.'
  }
}

export const colorScoreDescriptions: Record<ColorScore, string> = {
  1: 'CS 1 - Sem fluxo detectável',
  2: 'CS 2 - Fluxo mínimo',
  3: 'CS 3 - Fluxo moderado',
  4: 'CS 4 - Fluxo intenso'
}

export const lesoesTipicasBenignas: Record<LesaoTipicaBenigna, {
  nome: string
  caracteristicas: string[]
  limiteSize: number
}> = {
  cisto_hemorragico: {
    nome: 'Cisto Hemorrágico',
    caracteristicas: [
      'Padrão rendilhado/reticular fino',
      'Ecos internos móveis',
      'Sem vascularização interna',
      'Parede fina regular'
    ],
    limiteSize: 10
  },
  cisto_dermoide: {
    nome: 'Cisto Dermoide (Teratoma Maduro)',
    caracteristicas: [
      'Linhas/pontos ecogênicos (cabelo)',
      'Nódulo de Rokitansky',
      'Sombra acústica',
      'Interface gordura-líquido'
    ],
    limiteSize: 10
  },
  endometrioma: {
    nome: 'Endometrioma',
    caracteristicas: [
      'Aspecto de "vidro fosco" homogêneo',
      'Ecos internos de baixa amplitude',
      'Sem vascularização interna',
      'Parede fina regular'
    ],
    limiteSize: 10
  },
  cisto_paraovarian: {
    nome: 'Cisto Paraovariano',
    caracteristicas: [
      'Separado do ovário',
      'Cisto simples unilocular',
      'Parede fina imperceptível',
      'Adjacente ao ovário ipsilateral'
    ],
    limiteSize: 10
  },
  cisto_inclusao_peritoneal: {
    nome: 'Cisto de Inclusão Peritoneal',
    caracteristicas: [
      'Formato irregular/moldado',
      'Contém ovário',
      'Paredes finas',
      'História de cirurgia/inflamação'
    ],
    limiteSize: 10
  },
  hidrossalpinge: {
    nome: 'Hidrossalpinge',
    caracteristicas: [
      'Estrutura tubular alongada',
      'Pregas mucosas incompletas',
      'Sinal da roda dentada',
      'Separada do ovário'
    ],
    limiteSize: 10
  }
}

// ============= EVALUATION ALGORITHM =============

/**
 * Avalia uma lesão ovariana e retorna o score O-RADS
 * Baseado no algoritmo ACR O-RADS US v2022
 */
export function evaluateORADS(lesao: ORADSLesao, statusMenopausal: StatusMenopausal): ORADSResult {
  const { tipo, tamanho, componenteSolido, colorScore, paredeInterna, septacao, numeroPapilas, sombra, contornoExterno, lesaoTipica } = lesao
  
  // O-RADS 5: Alto risco (≥50%)
  // Presença de ascite e/ou nodulosidade peritoneal são avaliados separadamente
  
  // Lesão sólida com contorno irregular - O-RADS 5
  if (tipo === 'solido' && contornoExterno === 'irregular') {
    return createResult(5, lesao)
  }
  
  // Lesão sólida com contorno liso e CS4 - O-RADS 5
  if (tipo === 'solido' && contornoExterno === 'liso' && colorScore === 4) {
    return createResult(5, lesao)
  }
  
  // Cisto uni/bilocular com componente sólido e ≥4 projeções papilares - O-RADS 5
  if ((tipo === 'cisto_unilocular_nao_simples' || tipo === 'cisto_bilocular') && componenteSolido && (numeroPapilas ?? 0) >= 4) {
    return createResult(5, lesao)
  }
  
  // Cisto bi/multilocular com componente sólido e CS 3-4 - O-RADS 5
  if ((tipo === 'cisto_bilocular' || tipo === 'cisto_multilocular') && componenteSolido && colorScore >= 3) {
    return createResult(5, lesao)
  }
  
  // O-RADS 4: Risco intermediário (10-50%)
  
  // Cisto unilocular com componente sólido, 1-3 projeções papilares - O-RADS 4
  if (tipo === 'cisto_unilocular_nao_simples' && componenteSolido && (numeroPapilas ?? 0) >= 1 && (numeroPapilas ?? 0) <= 3) {
    return createResult(4, lesao)
  }
  
  // Cisto multilocular com componente sólido e CS 1-2 - O-RADS 4
  if (tipo === 'cisto_multilocular' && componenteSolido && colorScore <= 2) {
    return createResult(4, lesao)
  }
  
  // Cisto multilocular sem componente sólido, >10cm, parede lisa, CS 1-3 - O-RADS 4
  if (tipo === 'cisto_multilocular' && !componenteSolido && tamanho > 10 && paredeInterna === 'lisa' && colorScore <= 3) {
    return createResult(4, lesao)
  }
  
  // Cisto multilocular sem componente sólido, parede lisa, CS 4 - O-RADS 4
  if (tipo === 'cisto_multilocular' && !componenteSolido && paredeInterna === 'lisa' && colorScore === 4) {
    return createResult(4, lesao)
  }
  
  // Cisto multilocular sem componente sólido, parede/septação irregular - O-RADS 4
  if (tipo === 'cisto_multilocular' && !componenteSolido && (paredeInterna === 'irregular' || septacao === 'irregular')) {
    return createResult(4, lesao)
  }
  
  // Lesão sólida sem sombra, contorno liso, CS 2-3 - O-RADS 4
  if (tipo === 'solido' && !sombra && contornoExterno === 'liso' && colorScore >= 2 && colorScore <= 3) {
    return createResult(4, lesao)
  }
  
  // Cisto bilocular irregular sem componente sólido - O-RADS 4
  if (tipo === 'cisto_bilocular_irregular' && !componenteSolido) {
    return createResult(4, lesao)
  }
  
  // O-RADS 3: Baixo risco (1-10%)
  
  // Lesão típica benigna ≥10cm - O-RADS 3
  if (tipo === 'lesao_tipica_benigna' && tamanho >= 10) {
    return createResult(3, lesao)
  }
  
  // Cisto unilocular ou bilocular >10cm (simples ou não) - O-RADS 3
  if ((tipo === 'cisto_simples' || tipo === 'cisto_unilocular_nao_simples' || tipo === 'cisto_bilocular') && tamanho > 10) {
    return createResult(3, lesao)
  }
  
  // Cisto multilocular <10cm, parede lisa, CS 1-3 - O-RADS 3
  if (tipo === 'cisto_multilocular' && tamanho < 10 && paredeInterna === 'lisa' && colorScore <= 3) {
    return createResult(3, lesao)
  }
  
  // Lesão sólida com sombra, contorno liso, CS 1 - O-RADS 3
  if (tipo === 'solido' && sombra && contornoExterno === 'liso' && colorScore === 1) {
    return createResult(3, lesao)
  }
  
  // Lesão sólida sem sombra, contorno liso, CS 2-3 com sombra - O-RADS 3
  if (tipo === 'solido' && !sombra && contornoExterno === 'liso' && colorScore >= 2 && colorScore <= 3 && sombra) {
    return createResult(3, lesao)
  }
  
  // Cisto unilocular irregular - O-RADS 3
  if (tipo === 'cisto_unilocular_irregular') {
    return createResult(3, lesao)
  }
  
  // O-RADS 2: Quase certamente benigno (<1%)
  
  // Cisto simples ≤10cm - O-RADS 2
  if (tipo === 'cisto_simples' && tamanho <= 10) {
    return createResult(2, lesao)
  }
  
  // Cisto não-simples unilocular liso ou cisto bilocular liso ≤10cm - O-RADS 2
  if ((tipo === 'cisto_unilocular_nao_simples' || tipo === 'cisto_bilocular') && paredeInterna === 'lisa' && tamanho <= 10) {
    return createResult(2, lesao)
  }
  
  // Lesão típica benigna <10cm - O-RADS 2
  if (tipo === 'lesao_tipica_benigna' && tamanho < 10) {
    return createResult(2, lesao)
  }
  
  // Fallback - se não se encaixa em nenhuma categoria
  return createResult(2, lesao)
}

function createResult(score: number, lesao: ORADSLesao): ORADSResult {
  return {
    score,
    category: oradsCategories[score],
    lesao,
    recomendacao: oradsCategories[score].recomendacao
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

export function generateORADSTecnica(): string {
  return 'Exame realizado com transdutor endocavitário multifrequencial.'
}

export function generateORADSUteroTexto(data: ORADSUSData): string {
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

export function generateORADSEndometrioTexto(data: ORADSUSData): string {
  const { endometrio, statusMenopausal } = data
  
  let texto = `O eco endometrial é ${endometrio.aspecto}`
  texto += `, com linha média ${endometrio.linhaMedia}`
  texto += `, junção endométrio-miométrio ${endometrio.juncao}`
  texto += ` e apresentando espessura de ${formatBR(endometrio.espessura, 0)} mm.`
  
  // Interpretação da espessura
  if (statusMenopausal === 'pos' && endometrio.espessura > 5) {
    texto += ' Espessura endometrial acima do esperado para status pós-menopausal.'
  }
  
  if (endometrio.polipoEndometrial) {
    texto += ' Observa-se imagem sugestiva de pólipo endometrial.'
  }
  
  if (endometrio.liquidoIntrauterino) {
    texto += ' Presença de líquido na cavidade uterina.'
  }
  
  return texto
}

export function generateORADSOvarioTexto(ovario: OvarianData, lado: 'direito' | 'esquerdo'): string {
  if (!ovario.presente) {
    return `Ovário ${lado} não visualizado / ausente.`
  }
  
  const volume = ovario.volume || (ovario.mx * ovario.my * ovario.mz * 0.52)
  
  let texto = `Ovário ${lado} localizado em ${ovario.localizacao || 'situação parauterina'}`
  texto += `, com ecogenicidade parenquimatosa ${ovario.ecogenicidade || 'habitual'}`
  texto += `, medindo ${formatBR(ovario.mx)} x ${formatBR(ovario.my)} x ${formatBR(ovario.mz)} cm`
  texto += ` e apresentando volume estimado de ${formatBR(volume)} cm³.`
  
  // Lesões
  if (ovario.lesoes && ovario.lesoes.length > 0) {
    texto += '\n\n'
    ovario.lesoes.forEach((lesao, i) => {
      texto += generateLesaoTexto(lesao, i + 1)
      if (i < ovario.lesoes.length - 1) texto += '\n'
    })
  }
  
  return texto
}

function generateLesaoTexto(lesao: ORADSLesao, numero: number): string {
  const tipoMap: Record<TipoLesaoORADS, string> = {
    'cisto_simples': 'Cisto simples',
    'cisto_unilocular_nao_simples': 'Cisto unilocular não-simples',
    'cisto_bilocular': 'Cisto bilocular',
    'cisto_multilocular': 'Cisto multilocular',
    'cisto_unilocular_irregular': 'Cisto unilocular com parede irregular',
    'cisto_bilocular_irregular': 'Cisto bilocular irregular',
    'solido': 'Lesão sólida',
    'lesao_tipica_benigna': lesoesTipicasBenignas[lesao.lesaoTipica!]?.nome || 'Lesão típica benigna',
    'nenhuma': ''
  }
  
  let texto = `Lesão ${numero}: ${tipoMap[lesao.tipo]}`
  texto += `, medindo ${formatBR(lesao.tamanho)} cm no maior diâmetro`
  
  if (lesao.paredeInterna) {
    texto += `, parede interna ${lesao.paredeInterna}`
  }
  
  if (lesao.componenteSolido) {
    texto += `, com componente sólido`
    if (lesao.numeroPapilas) {
      texto += ` (${lesao.numeroPapilas} ${lesao.numeroPapilas === 1 ? 'projeção papilar' : 'projeções papilares'})`
    }
  }
  
  texto += `, ${colorScoreDescriptions[lesao.colorScore]}`
  
  if (lesao.tipo === 'solido') {
    texto += lesao.sombra ? ', com sombra acústica' : ', sem sombra acústica'
    texto += `, contorno externo ${lesao.contornoExterno}`
  }
  
  texto += '.'
  
  return texto
}

export function generateORADSLiquidoLivreTexto(data: ORADSUSData): string {
  const { liquidoLivre } = data
  
  if (!liquidoLivre.presente) {
    return 'Ausência de líquido livre na cavidade pélvica.'
  }
  
  let texto = `Presença de ${liquidoLivre.quantidade || ''} quantidade de líquido livre`
  if (liquidoLivre.localizacao) {
    texto += ` ${liquidoLivre.localizacao}`
  }
  if (liquidoLivre.aspecto) {
    const aspectoMap: Record<string, string> = {
      'anecoico': 'de aspecto anecóico (simples)',
      'ecos_finos': 'com ecos finos de permeio',
      'heterogeneo': 'de aspecto heterogêneo'
    }
    texto += `, ${aspectoMap[liquidoLivre.aspecto] || liquidoLivre.aspecto}`
  }
  texto += '.'
  
  return texto
}

export function generateORADSRegiaoAnexialTexto(data: ORADSUSData): string {
  const { regiaoAnexial, ovarioDireito, ovarioEsquerdo } = data
  
  const direitaSemLesao = !ovarioDireito.lesoes || ovarioDireito.lesoes.length === 0
  const esquerdaSemLesao = !ovarioEsquerdo.lesoes || ovarioEsquerdo.lesoes.length === 0
  
  if (direitaSemLesao && esquerdaSemLesao && !regiaoAnexial.direita && !regiaoAnexial.esquerda) {
    return 'Não se observam massas císticas ou sólidas na topografia anexial.'
  }
  
  let texto = ''
  if (regiaoAnexial.direita) {
    texto += `Região anexial direita: ${regiaoAnexial.direita}`
  }
  if (regiaoAnexial.esquerda) {
    if (texto) texto += '\n'
    texto += `Região anexial esquerda: ${regiaoAnexial.esquerda}`
  }
  
  return texto || 'Regiões anexiais sem alterações adicionais.'
}

export function generateORADSImpressao(data: ORADSUSData): string {
  const impressoes: string[] = []
  
  // Avaliar todas as lesões
  const todasLesoes = [
    ...data.ovarioDireito.lesoes.map(l => ({ ...l, lado: 'direito' })),
    ...data.ovarioEsquerdo.lesoes.map(l => ({ ...l, lado: 'esquerdo' }))
  ]
  
  if (todasLesoes.length === 0 && !data.ascite && !data.nodulosPeritoneais) {
    // Verificar útero
    if (data.utero.nodulos && data.utero.nodulos.length > 0) {
      const numNodulos = data.utero.nodulos.length
      impressoes.push(`- Útero miomatoso (${numNodulos} ${numNodulos === 1 ? 'nódulo' : 'nódulos'}).`)
    }
    
    // Verificar endométrio
    if (data.statusMenopausal === 'pos' && data.endometrio.espessura > 5) {
      impressoes.push('- Espessamento endometrial para avaliação clínica.')
    }
    
    if (data.endometrio.polipoEndometrial) {
      impressoes.push('- Imagem sugestiva de pólipo endometrial.')
    }
    
    if (impressoes.length === 0) {
      return 'Estudo sem alterações significativas.'
    }
    
    return impressoes.join('\n')
  }
  
  // Achados de alto risco
  if (data.ascite || data.nodulosPeritoneais) {
    impressoes.push('- Achados associados de alto risco (O-RADS 5): ' + 
      [data.ascite ? 'ascite' : '', data.nodulosPeritoneais ? 'nodularidade peritoneal' : ''].filter(Boolean).join(', ') + '.')
  }
  
  // Lesões ovarianas com classificação O-RADS
  todasLesoes.forEach((lesao, i) => {
    const result = evaluateORADS(lesao, data.statusMenopausal)
    const tipoDesc = lesao.tipo === 'lesao_tipica_benigna' && lesao.lesaoTipica 
      ? lesoesTipicasBenignas[lesao.lesaoTipica].nome 
      : lesao.tipo.replace(/_/g, ' ')
    impressoes.push(`- Lesão anexial ${lesao.localizacao === 'ovario_direito' ? 'direita' : 'esquerda'} (${tipoDesc}): ${result.category.name} - ${result.category.risco}.`)
  })
  
  // Útero
  if (data.utero.nodulos && data.utero.nodulos.length > 0) {
    impressoes.push(`- Útero miomatoso.`)
  }
  
  return impressoes.join('\n')
}

export function generateORADSLaudoCompletoHTML(data: ORADSUSData): string {
  let html = '<p><strong>ULTRASSONOGRAFIA TRANSVAGINAL</strong></p>'
  html += '<p></p>'
  
  // Técnica
  html += '<p><strong>TÉCNICA:</strong></p>'
  html += `<p>${generateORADSTecnica()}</p>`
  html += '<p></p>'
  
  // Análise
  html += '<p><strong>ANÁLISE:</strong></p>'
  
  // Útero
  html += `<p>${generateORADSUteroTexto(data)}</p>`
  html += '<p></p>'
  
  // Endométrio
  html += `<p>${generateORADSEndometrioTexto(data)}</p>`
  html += '<p></p>'
  
  // Ovários
  html += `<p>${generateORADSOvarioTexto(data.ovarioDireito, 'direito')}</p>`
  html += '<p></p>'
  html += `<p>${generateORADSOvarioTexto(data.ovarioEsquerdo, 'esquerdo')}</p>`
  html += '<p></p>'
  
  // Região anexial
  html += `<p>${generateORADSRegiaoAnexialTexto(data)}</p>`
  html += '<p></p>'
  
  // Líquido livre
  html += `<p>${generateORADSLiquidoLivreTexto(data)}</p>`
  html += '<p></p>'
  
  // Impressão
  html += '<p><strong>IMPRESSÃO DIAGNÓSTICA:</strong></p>'
  html += `<p>${generateORADSImpressao(data).replace(/\n/g, '</p><p>')}</p>`
  
  // Notas
  if (data.notas) {
    html += '<p></p>'
    html += '<p><strong>NOTAS:</strong></p>'
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
    statusMenopausal: 'pre',
    utero: {
      posicao: 'anteversoflexao',
      forma: 'regular',
      contornos: 'regulares',
      simetria: 'simetrico',
      ecotextura: 'homogenea',
      zonaJuncional: 'regular',
      mx: 0,
      my: 0,
      mz: 0,
      nodulos: []
    },
    endometrio: {
      aspecto: 'uniforme',
      linhaMedia: 'linear',
      juncao: 'regular',
      espessura: 0
    },
    ovarioDireito: {
      presente: true,
      localizacao: 'situação parauterina',
      mx: 0,
      my: 0,
      mz: 0,
      ecogenicidade: 'habitual',
      lesoes: []
    },
    ovarioEsquerdo: {
      presente: true,
      localizacao: 'situação parauterina',
      mx: 0,
      my: 0,
      mz: 0,
      ecogenicidade: 'habitual',
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
