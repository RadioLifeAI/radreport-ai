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

// ============= CONSTANTS =============

export const liradsUSCategories: Record<string, LIRADSUSCategory> = {
  'US-1': {
    categoria: 'US-1',
    nome: 'Negativo',
    descricao: 'Sem observação ou observação definitivamente benigna',
    risco: 'Normal',
    cor: 'green',
    recomendacao: 'Repetir ultrassonografia de vigilância em 6 meses.'
  },
  'US-2': {
    categoria: 'US-2',
    nome: 'Sublimiar',
    descricao: 'Observação < 10 mm não definitivamente benigna',
    risco: 'Baixo',
    cor: 'yellow',
    recomendacao: 'Repetir ultrassonografia em 3-6 meses, até 2 vezes. Se permanecer < 10 mm ou não visualizada em 2 seguimentos, pode ser recategorizada como US-1.'
  },
  'US-3': {
    categoria: 'US-3',
    nome: 'Positivo',
    descricao: 'Observação ≥ 10 mm não definitivamente benigna, distorção parenquimatosa, ou trombo novo',
    risco: 'Elevado',
    cor: 'red',
    recomendacao: 'Avaliação com TC, RM ou CEUS multifásico para caracterização diagnóstica.'
  }
}

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

function createResult(categoria: string): LIRADSUSResult {
  return {
    categoria,
    categoryInfo: liradsUSCategories[categoria],
    recomendacao: liradsUSCategories[categoria].recomendacao
  }
}

/**
 * Retorna recomendação considerando VIS score e AFP
 */
export function getLIRADSUSRecommendation(
  categoria: string,
  visScore: 'A' | 'B' | 'C',
  afpStatus: string
): string {
  let recomendacao = liradsUSCategories[categoria]?.recomendacao || ''
  
  // VIS-C: Limitações severas
  if (visScore === 'C') {
    recomendacao = 'Limitações severas na visualização (VIS-C). Considerar modalidade alternativa de vigilância (TC ou RM), ou repetir ultrassonografia em até 3 meses. Se permanecer VIS-C, considerar outra modalidade.'
  }
  
  // AFP elevada/crescente sem observação US-3
  if ((afpStatus === 'elevada' || afpStatus === 'crescente') && categoria !== 'US-3') {
    recomendacao += ' AFP elevada ou em crescimento: considerar avaliação com TC ou RM multifásico independente da categoria US.'
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

export function generateLIRADSUSTecnica(): string {
  return 'Exame realizado com transdutor convexo multifrequencial.'
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
      tromboTexto += ' (novo achado)'
    }
    partes.push(tromboTexto + '.')
  } else {
    partes.push('Veias hepáticas e veia porta pérvias.')
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
  const categoryInfo = liradsUSCategories[categoria]
  const partes: string[] = []
  
  partes.push(`- LI-RADS US ${categoria} (${categoryInfo.nome})`)
  
  // Detalhes das observações positivas
  const observacoesPositivas = data.observacoes.filter(o => !isDefinitivelyBenign(o.tipo))
  if (observacoesPositivas.length > 0) {
    observacoesPositivas.forEach(obs => {
      const tipoOpt = options?.tipo_observacao?.find(o => o.value === obs.tipo)
      const locOpt = options?.localizacao_observacao?.find(o => o.value === obs.localizacao)
      partes.push(`- ${tipoOpt?.label || obs.tipo}${locOpt ? ` ${locOpt.texto}` : ''}`)
    })
  }
  
  // Trombose
  if (data.tromboTipo !== 'nenhum' && data.tromboNovo) {
    partes.push('- Trombose vascular nova')
  }
  
  // AFP
  if (data.afpStatus === 'elevada' || data.afpStatus === 'crescente') {
    partes.push('- AFP elevada/crescente - considerar TC/RM multifásico')
  }
  
  return partes.join('\n')
}

export function generateLIRADSUSLaudoCompletoHTML(
  data: LIRADSUSData,
  categoria: string,
  options?: RADSOptionsMap
): string {
  const indicacao = generateLIRADSUSIndicacao(data, options)
  const tecnica = generateLIRADSUSTecnica()
  const achados = generateLIRADSUSAchados(data, options)
  const visualizacao = generateLIRADSUSVisualizacao(data, options)
  const impressao = generateLIRADSUSImpressao(data, categoria, options)
  const recomendacao = getLIRADSUSRecommendation(categoria, data.visScore, data.afpStatus)
  
  const partes = [
    '<p><strong>ULTRASSONOGRAFIA HEPÁTICA - VIGILÂNCIA CHC (LI-RADS US)</strong></p>',
    '<p></p>',
    '<p><strong>INDICAÇÃO:</strong></p>',
    `<p>${indicacao}</p>`,
    '<p></p>',
    '<p><strong>TÉCNICA:</strong></p>',
    `<p>${tecnica}</p>`,
    '<p></p>',
    '<p><strong>ANÁLISE:</strong></p>',
    `<p>${achados}</p>`,
    '<p></p>',
    '<p><strong>QUALIDADE TÉCNICA:</strong></p>',
    `<p>${visualizacao}</p>`,
    '<p></p>',
    '<p><strong>IMPRESSÃO:</strong></p>',
    `<p>${impressao.split('\n').join('</p><p>')}</p>`,
    '<p></p>',
    '<p><strong>RECOMENDAÇÃO:</strong></p>',
    `<p>${recomendacao}</p>`,
  ]
  
  if (data.notas) {
    partes.push('<p></p>')
    partes.push('<p><strong>NOTAS:</strong></p>')
    partes.push(`<p>${data.notas}</p>`)
  }
  
  return partes.join('\n')
}
