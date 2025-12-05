/**
 * LI-RADS US Surveillance v2024 - Classification System
 * Based on ACR LI-RADS US Surveillance v2024 Core
 */

import { RADSOptionsMap, RADSOption } from '@/hooks/useRADSOptions'

// ============= TYPES =============

export interface LIRADSUSObservacao {
  tipo: string
  tamanho: number // mm
  localizacao: string
  segmento?: string
  ecogenicidade?: string
  novo: boolean
  cresceu: boolean
}

export interface LIRADSUSData {
  // Paciente/Risco
  populacaoRisco: string
  etiologiaCirrose?: string
  childPugh?: string
  elegivelTransplante: boolean
  afpStatus: string
  afpValor?: number
  imc?: number // IMC (BMI) para avaliação de fatores de risco VIS-C
  
  // Parênquima Hepático
  aspectoParenquima: string
  tamanhoFigado: string
  contornosFigado?: string
  esteatose?: string
  
  // Extra-hepático
  esplenomegalia?: string
  tamanhoBaco?: number
  ascite?: string
  
  // Observações (até 3)
  observacoes: LIRADSUSObservacao[]
  
  // Trombose
  tromboTipo: string
  tromboLocalizacao?: string
  tromboNovo: boolean
  
  // Visualização
  visScore: 'A' | 'B' | 'C'
  limitacoesVIS: string[]
  
  // Comparativo
  temComparativo: boolean
  dataExameAnterior?: string
  comparativoResultado?: string
  resultadoAnterior?: string
  
  // Notas
  notas?: string
}

export interface LIRADSUSCategory {
  categoria: string
  nome: string
  descricao: string
  risco: string
  cor: string
  recomendacao: string
}

export interface LIRADSUSResult {
  categoria: string
  categoryInfo: LIRADSUSCategory
  recomendacao: string
}

// ============= CONSTANTS (Fallback Hardcoded) =============

export const liradsUSCategories: Record<string, LIRADSUSCategory> = {
  'US-1': {
    categoria: 'US-1',
    nome: 'Negativo',
    descricao: 'Exame ultrassonográfico de vigilância sem identificação de observações focais suspeitas ou com observações definitivamente benignas (cisto simples, hemangioma típico, esteatose focal).',
    risco: 'Normal',
    cor: 'green',
    recomendacao: 'Manter vigilância ultrassonográfica conforme protocolo institucional, com intervalo de 6 meses.'
  },
  'US-2': {
    categoria: 'US-2',
    nome: 'Sublimiar',
    descricao: 'Observação focal inferior a 10 mm, não caracterizada como definitivamente benigna. Achado requer seguimento ultrassonográfico de curto prazo para avaliar estabilidade.',
    risco: 'Baixo',
    cor: 'yellow',
    recomendacao: 'Repetir ultrassonografia de vigilância em intervalo de 3 a 6 meses, podendo ser realizada até 2 vezes consecutivas. Caso a observação permaneça inferior a 10 mm ou não seja mais identificada em 2 exames consecutivos de seguimento, pode ser recategorizada como US-1 (Negativo).'
  },
  'US-3': {
    categoria: 'US-3',
    nome: 'Positivo',
    descricao: 'Observação focal igual ou superior a 10 mm não definitivamente benigna, distorção arquitetural parenquimatosa focal, ou trombo vascular novo identificado.',
    risco: 'Elevado',
    cor: 'red',
    recomendacao: 'Avaliação diagnóstica complementar com tomografia computadorizada multifásica, ressonância magnética hepatobiliar ou ultrassonografia com contraste (CEUS) para caracterização da lesão segundo critérios LI-RADS CT/MRI diagnóstico.'
  }
}

// Fallback para técnica (hardcoded)
const TECNICA_FALLBACK = 'Exame realizado com transdutor convexo multifrequencial (2-5 MHz), utilizando técnica padrão para avaliação hepática de vigilância conforme protocolo ACR LI-RADS US Surveillance v2024.'

// Fallbacks para VIS-C (hardcoded)
const VIS_C_FALLBACKS = {
  semFatoresRisco: 'Limitações moderadas a severas na avaliação ultrassonográfica hepática (categoria de visualização C - VIS-C). Recomenda-se repetição do exame ultrassonográfico em prazo máximo de 3 meses. Caso persista classificação VIS-C no exame subsequente, considerar modalidade alternativa de vigilância, como tomografia computadorizada de baixa dose ou ressonância magnética abreviada do fígado.',
  comFatoresRisco: 'Limitações moderadas a severas na avaliação ultrassonográfica hepática (categoria de visualização C - VIS-C), associadas à presença de fatores de risco para recorrência de limitação técnica (cirrose por esteatohepatite metabólica/alcoólica, classificação Child-Pugh B ou C, ou índice de massa corporal igual ou superior a 35 kg/m²). Considerando alta probabilidade de limitação técnica persistente em exame ultrassonográfico subsequente, recomenda-se avaliar indicação de modalidade alternativa de vigilância (tomografia computadorizada de baixa dose ou ressonância magnética abreviada) sem necessidade de aguardar repetição do exame ultrassonográfico.'
}

// Fallback para AFP positivo (hardcoded)
const AFP_POSITIVO_FALLBACK = 'Considerando nível sérico de alfa-fetoproteína elevado (≥ 20 ng/mL) ou com curva ascendente, na ausência de observação focal categorizável como US-3, a ultrassonografia com contraste (CEUS) apresenta utilidade limitada sem correlato morfológico identificável. Recomenda-se avaliação diagnóstica complementar com tomografia computadorizada multifásica ou ressonância magnética hepatobiliar para investigação de carcinoma hepatocelular.'

// Fallback para veias pérvias (hardcoded)
const VEIA_PERVIA_FALLBACK = 'Sistema venoso hepático (veias hepáticas e veia porta principal com suas ramificações) exibindo fluxo presente e patência preservada ao estudo Doppler colorido.'

// ============= EVALUATION ALGORITHM =============

const TIPOS_BENIGNOS = ['nenhuma', 'cisto_simples', 'hemangioma', 'esteatose_focal']

function isDefinitivelyBenign(tipo: string): boolean {
  return TIPOS_BENIGNOS.includes(tipo)
}

/**
 * Avalia LI-RADS US Surveillance baseado no algoritmo ACR v2024
 */
export function evaluateLIRADSUS(data: LIRADSUSData): LIRADSUSResult {
  // VIS-C: Avaliação incompleta - não pode categorizar adequadamente
  // Nota: VIS-C não é uma categoria oficial, mas indica necessidade de repetir ou mudar modalidade
  
  // Verificar trombose nova (upgrade para US-3)
  if (data.tromboTipo !== 'nenhum' && data.tromboNovo) {
    return createResult('US-3')
  }
  
  // Verificar observações
  const observacoesNaoBenignas = data.observacoes.filter(obs => !isDefinitivelyBenign(obs.tipo))
  
  // Se não há observações ou todas são definitivamente benignas
  if (observacoesNaoBenignas.length === 0) {
    return createResult('US-1')
  }
  
  // Verificar se há observações ≥ 10mm
  const observacoesMaiores = observacoesNaoBenignas.filter(obs => obs.tamanho >= 10)
  
  // Verificar distorção parenquimatosa
  const temDistorcao = observacoesNaoBenignas.some(obs => obs.tipo === 'distorcao')
  
  // US-3: Observação ≥ 10mm não benigna, distorção, ou trombo novo
  if (observacoesMaiores.length > 0 || temDistorcao) {
    return createResult('US-3')
  }
  
  // US-2: Observação < 10mm não definitivamente benigna
  if (observacoesNaoBenignas.length > 0) {
    return createResult('US-2')
  }
  
  // Fallback
  return createResult('US-1')
}

function createResult(categoria: string, options?: RADSOptionsMap): LIRADSUSResult {
  const categoryInfo = getLIRADSUSCategoryFromDB(categoria, options)
  return {
    categoria,
    categoryInfo,
    recomendacao: categoryInfo.recomendacao
  }
}

/**
 * Busca categoria do banco de dados com fallback para hardcoded
 */
export function getLIRADSUSCategoryFromDB(categoria: string, options?: RADSOptionsMap): LIRADSUSCategory {
  const catOpt = options?.lirads_categoria?.find(o => o.value === categoria)
  if (catOpt) {
    // Extrair risco e cor baseado na categoria
    const riscoMap: Record<string, string> = { 'US-1': 'Normal', 'US-2': 'Baixo', 'US-3': 'Elevado' }
    const corMap: Record<string, string> = { 'US-1': 'green', 'US-2': 'yellow', 'US-3': 'red' }
    
    // Buscar recomendação do banco
    const recOpt = options?.lirads_recomendacao?.find(o => o.value === categoria)
    
    return {
      categoria,
      nome: catOpt.label.includes(' - ') ? catOpt.label.split(' - ')[1] : catOpt.label,
      descricao: catOpt.texto,
      risco: riscoMap[categoria] || 'Indeterminado',
      cor: corMap[categoria] || 'gray',
      recomendacao: recOpt?.texto || liradsUSCategories[categoria]?.recomendacao || ''
    }
  }
  // Fallback hardcoded
  return liradsUSCategories[categoria] || liradsUSCategories['US-1']
}

/**
 * Verifica fatores de risco para VIS-C repetido (ACR v2024)
 * - Cirrose por MASH/álcool
 * - Child-Pugh B ou C
 * - IMC ≥ 35 kg/m²
 */
export function hasVISCRiskFactors(data: LIRADSUSData): boolean {
  const etiologia = data.etiologiaCirrose?.toLowerCase() || ''
  const etiologiaRisco = ['mash', 'masld', 'nash', 'nafld', 'alcool', 'etilica', 'alcoolica'].some(
    e => etiologia.includes(e)
  )
  const childPughRisco = data.childPugh === 'B' || data.childPugh === 'C'
  const imcRisco = (data.imc || 0) >= 35
  
  return etiologiaRisco || childPughRisco || imcRisco
}

/**
 * Retorna recomendação considerando VIS score, AFP e fatores de risco (ACR v2024)
 */
export function getLIRADSUSRecommendation(
  categoria: string,
  visScore: 'A' | 'B' | 'C',
  afpStatus: string,
  data?: Partial<LIRADSUSData>,
  options?: RADSOptionsMap
): string {
  // Buscar recomendação da categoria do banco primeiro
  const recOpt = options?.lirads_recomendacao?.find(o => o.value === categoria)
  let recomendacao = recOpt?.texto || liradsUSCategories[categoria]?.recomendacao || ''
  
  // VIS-C: Diferenciar baseado em fatores de risco (ACR v2024)
  if (visScore === 'C' && categoria !== 'US-3') {
    const temFatoresRisco = data ? hasVISCRiskFactors(data as LIRADSUSData) : false
    
    if (temFatoresRisco) {
      // Buscar texto do banco para VIS-C com fatores de risco
      const visCComRiscoOpt = options?.vis_c_recomendacao?.find(o => o.value === 'com_fatores_risco')
      recomendacao = visCComRiscoOpt?.texto || VIS_C_FALLBACKS.comFatoresRisco
    } else {
      // Buscar texto do banco para VIS-C sem fatores de risco
      const visCsemRiscoOpt = options?.vis_c_recomendacao?.find(o => o.value === 'sem_fatores_risco')
      recomendacao = visCsemRiscoOpt?.texto || VIS_C_FALLBACKS.semFatoresRisco
    }
  }
  
  // AFP positivo (≥20 ng/mL ou crescente) sem US-3: CEUS não indicado (ACR v2024)
  const afpValor = data?.afpValor
  const afpPositivo = (afpValor && afpValor >= 20) || afpStatus === 'elevada' || afpStatus === 'crescente'
  
  if (afpPositivo && categoria !== 'US-3') {
    // Buscar texto do banco para AFP positivo
    const afpOpt = options?.afp_positivo_texto?.find(o => o.value === 'afp_elevada_sem_us3')
    recomendacao += ' ' + (afpOpt?.texto || AFP_POSITIVO_FALLBACK)
  }
  
  return recomendacao
}

// ============= TEXT GENERATION =============

const formatBR = (num: number, decimals: number = 1): string => {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export function generateLIRADSUSTecnica(options?: RADSOptionsMap): string {
  // Buscar técnica do banco
  const tecnicaOpt = options?.tecnica?.find(o => o.value === 'padrao')
  return tecnicaOpt?.texto || TECNICA_FALLBACK
}

export function generateLIRADSUSIndicacao(data: LIRADSUSData, options?: RADSOptionsMap): string {
  const populacaoOpt = options?.populacao_risco?.find(o => o.value === data.populacaoRisco)
  const populacaoTexto = populacaoOpt?.texto || 'paciente de alto risco para carcinoma hepatocelular'
  
  let texto = `Vigilância de carcinoma hepatocelular em ${populacaoTexto}`
  
  if (data.etiologiaCirrose && data.populacaoRisco === 'cirrose') {
    const etiologiaOpt = options?.etiologia_cirrose?.find(o => o.value === data.etiologiaCirrose)
    if (etiologiaOpt) {
      texto += `, ${etiologiaOpt.texto}`
    }
  }
  
  if (data.childPugh) {
    texto += `, ${data.childPugh}`
  }
  
  texto += '.'
  
  return texto
}

export function generateLIRADSUSAchados(data: LIRADSUSData, options?: RADSOptionsMap): string {
  const partes: string[] = []
  
  // Parênquima
  const aspectoOpt = options?.aspecto_parenquima?.find(o => o.value === data.aspectoParenquima)
  const tamanhoOpt = options?.tamanho_figado?.find(o => o.value === data.tamanhoFigado)
  const contornosOpt = options?.contornos_figado?.find(o => o.value === data.contornosFigado)
  const esteatoseOpt = options?.esteatose?.find(o => o.value === data.esteatose)
  
  let parenquima = aspectoOpt?.texto || 'parênquima hepático de ecotextura habitual'
  if (tamanhoOpt) {
    parenquima += `, de ${tamanhoOpt.texto}`
  }
  if (contornosOpt) {
    parenquima += `, ${contornosOpt.texto}`
  }
  partes.push(parenquima + '.')
  
  // Esteatose
  if (data.esteatose && data.esteatose !== 'ausente' && esteatoseOpt) {
    partes.push(esteatoseOpt.texto.charAt(0).toUpperCase() + esteatoseOpt.texto.slice(1) + '.')
  }
  
  // Observações
  if (data.observacoes.length === 0 || data.observacoes.every(o => o.tipo === 'nenhuma')) {
    partes.push('Sem observações focais identificadas.')
  } else {
    data.observacoes.forEach((obs, idx) => {
      if (obs.tipo === 'nenhuma') return
      
      const tipoOpt = options?.tipo_observacao?.find(o => o.value === obs.tipo)
      const locOpt = options?.localizacao_observacao?.find(o => o.value === obs.localizacao)
      const ecoOpt = options?.ecogenicidade_observacao?.find(o => o.value === obs.ecogenicidade)
      
      let obsTexto = tipoOpt?.texto || obs.tipo
      if (obs.tamanho > 0) {
        obsTexto += ` medindo ${formatBR(obs.tamanho)} mm`
      }
      if (locOpt) {
        obsTexto += `, ${locOpt.texto}`
      }
      if (ecoOpt) {
        obsTexto += `, ${ecoOpt.texto}`
      }
      
      if (obs.novo) {
        obsTexto += ' (nova)'
      } else if (obs.cresceu) {
        obsTexto += ' (com aumento dimensional)'
      }
      
      partes.push(`Observação ${idx + 1}: ${obsTexto}.`)
    })
  }
  
  // Trombose
  if (data.tromboTipo && data.tromboTipo !== 'nenhum') {
    const tromboTipoOpt = options?.trombo_tipo?.find(o => o.value === data.tromboTipo)
    const tromboLocOpt = options?.trombo_localizacao?.find(o => o.value === data.tromboLocalizacao)
    
    let tromboTexto = tromboTipoOpt?.texto || 'trombose vascular'
    if (tromboLocOpt) {
      tromboTexto += `, ${tromboLocOpt.texto}`
    }
    if (data.tromboNovo) {
      tromboTexto += ' (novo achado, não identificado em exame anterior)'
    }
    partes.push(tromboTexto.charAt(0).toUpperCase() + tromboTexto.slice(1) + '.')
  } else {
    // Buscar texto de veias pérvias do banco
    const veiaOpt = options?.veia_pervia?.find(o => o.value === 'normal')
    partes.push(veiaOpt?.texto || VEIA_PERVIA_FALLBACK)
  }
  
  // Extra-hepático: Esplenomegalia
  if (data.esplenomegalia === 'presente') {
    let esplenoTexto = 'Esplenomegalia'
    if (data.tamanhoBaco) {
      esplenoTexto += ` (${formatBR(data.tamanhoBaco)} cm)`
    }
    partes.push(esplenoTexto + '.')
  }
  
  // Extra-hepático: Ascite
  const asciteOpt = options?.ascite?.find(o => o.value === data.ascite)
  if (data.ascite && data.ascite !== 'ausente' && asciteOpt) {
    partes.push(asciteOpt.texto.charAt(0).toUpperCase() + asciteOpt.texto.slice(1) + '.')
  }
  
  return partes.join(' ')
}

export function generateLIRADSUSVisualizacao(data: LIRADSUSData, options?: RADSOptionsMap): string {
  const visOpt = options?.vis_score?.find(o => o.value === data.visScore)
  let texto = `Visualização VIS-${data.visScore}: ${visOpt?.texto || ''}`
  
  if (data.limitacoesVIS.length > 0 && data.visScore !== 'A') {
    const limitacoes = data.limitacoesVIS
      .map(l => options?.limitacao_vis?.find(o => o.value === l)?.texto || l)
      .join(', ')
    texto += ` Limitações: ${limitacoes}.`
  }
  
  return texto
}

export function generateLIRADSUSImpressao(
  data: LIRADSUSData,
  categoria: string,
  options?: RADSOptionsMap
): string {
  // Buscar categoria do banco ou usar fallback
  const categoryInfo = getLIRADSUSCategoryFromDB(categoria, options)
  const partes: string[] = []
  
  // Linha principal com classificação
  partes.push(`Ultrassonografia hepática de vigilância classificada como LI-RADS ${categoria} (${categoryInfo.nome}): ${categoryInfo.descricao}`)
  
  // Detalhes das observações positivas
  const observacoesPositivas = data.observacoes.filter(o => !isDefinitivelyBenign(o.tipo))
  if (observacoesPositivas.length > 0) {
    partes.push('')
    partes.push('Achados relevantes:')
    observacoesPositivas.forEach((obs, idx) => {
      const tipoOpt = options?.tipo_observacao?.find(o => o.value === obs.tipo)
      const locOpt = options?.localizacao_observacao?.find(o => o.value === obs.localizacao)
      const ecoOpt = options?.ecogenicidade_observacao?.find(o => o.value === obs.ecogenicidade)
      
      let obsTexto = `- ${tipoOpt?.texto || tipoOpt?.label || obs.tipo}`
      if (obs.tamanho > 0) {
        obsTexto += `, medindo ${formatBR(obs.tamanho)} mm`
      }
      if (locOpt) {
        obsTexto += `, localizada ${locOpt.texto}`
      }
      if (ecoOpt) {
        obsTexto += `, ${ecoOpt.texto}`
      }
      if (obs.novo) {
        obsTexto += ' (achado novo, não identificado em exame anterior)'
      } else if (obs.cresceu) {
        obsTexto += ' (apresentando aumento dimensional em relação ao exame anterior)'
      }
      partes.push(obsTexto)
    })
  }
  
  // Trombose
  if (data.tromboTipo !== 'nenhum' && data.tromboNovo) {
    const tromboTipoOpt = options?.trombo_tipo?.find(o => o.value === data.tromboTipo)
    const tromboLocOpt = options?.trombo_localizacao?.find(o => o.value === data.tromboLocalizacao)
    let tromboDesc = tromboTipoOpt?.texto || 'trombose vascular'
    if (tromboLocOpt) {
      tromboDesc += ` ${tromboLocOpt.texto}`
    }
    partes.push(`- ${tromboDesc.charAt(0).toUpperCase() + tromboDesc.slice(1)} (achado novo)`)
  }
  
  // AFP
  if (data.afpStatus === 'elevada' || data.afpStatus === 'crescente') {
    const afpValorTexto = data.afpValor ? ` (${formatBR(data.afpValor, 1)} ng/mL)` : ''
    partes.push('')
    partes.push(`Nota: Nível sérico de alfa-fetoproteína ${data.afpStatus === 'crescente' ? 'em curva ascendente' : 'elevado'}${afpValorTexto}. Avaliação diagnóstica complementar recomendada independente da categoria LI-RADS US.`)
  }
  
  return partes.join('\n')
}

export function generateLIRADSUSLaudoCompletoHTML(
  data: LIRADSUSData,
  categoria: string,
  options?: RADSOptionsMap
): string {
  const indicacao = generateLIRADSUSIndicacao(data, options)
  const tecnica = generateLIRADSUSTecnica(options)
  const achados = generateLIRADSUSAchados(data, options)
  const visualizacao = generateLIRADSUSVisualizacao(data, options)
  const recomendacao = getLIRADSUSRecommendation(categoria, data.visScore, data.afpStatus, data, options)
  const impressao = generateLIRADSUSImpressao(data, categoria, options)
  
  const partes = [
    '<p><strong>ULTRASSONOGRAFIA HEPÁTICA - VIGILÂNCIA DE CARCINOMA HEPATOCELULAR</strong></p>',
    '<p><strong>ACR LI-RADS US Surveillance v2024</strong></p>',
    '<p></p>',
    '<p><strong>INDICAÇÃO CLÍNICA:</strong></p>',
    `<p>${indicacao}</p>`,
    '<p></p>',
    '<p><strong>TÉCNICA:</strong></p>',
    `<p>${tecnica}</p>`,
    '<p></p>',
    '<p><strong>ANÁLISE DESCRITIVA:</strong></p>',
    `<p>${achados}</p>`,
    '<p></p>',
    '<p><strong>QUALIDADE TÉCNICA / VISUALIZAÇÃO:</strong></p>',
    `<p>${visualizacao}</p>`,
    '<p></p>',
    '<p><strong>IMPRESSÃO DIAGNÓSTICA:</strong></p>',
    `<p>${impressao.split('\n').join('</p><p>')}</p>`,
    '<p></p>',
    '<p><strong>RECOMENDAÇÃO:</strong></p>',
    `<p>${recomendacao}</p>`,
  ]
  
  if (data.notas) {
    partes.push('<p></p>')
    partes.push('<p><strong>OBSERVAÇÕES ADICIONAIS:</strong></p>')
    partes.push(`<p>${data.notas}</p>`)
  }
  
  return partes.join('\n')
}
