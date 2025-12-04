export interface CalculatorInput {
  name: string
  label: string
  unit?: string
  type: 'number' | 'date'
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  placeholder?: string
}

export interface CalculatorResult {
  value: number | string
  unit?: string
  interpretation?: string
  color?: 'success' | 'warning' | 'danger'
  formattedText: string
}

export interface RadiologyCalculator {
  id: string
  name: string
  category: 'geral' | 'obstetricia' | 'neuro' | 'cardio' | 'urologia' | 'abdome' | 'vascular' | 'oncologia'
  subcategory?: string
  description: string
  inputs: CalculatorInput[]
  calculate: (values: Record<string, number | string>) => CalculatorResult
  reference?: {
    text: string
    url: string
  }
}

// Helper: Formatação decimal brasileira (vírgula)
const formatBR = (num: number, decimals: number = 1): string => {
  return num.toLocaleString('pt-BR', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })
}

// Funções auxiliares para cálculos
const getDaysBetweenDates = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const interpretVolume = (volume: number, organ: string): { interpretation: string; color: 'success' | 'warning' | 'danger' } => {
  // Interpretação genérica baseada em tamanho
  if (volume < 1) return { interpretation: 'Volume pequeno', color: 'success' }
  if (volume < 10) return { interpretation: 'Volume normal', color: 'success' }
  if (volume < 50) return { interpretation: 'Volume aumentado', color: 'warning' }
  return { interpretation: 'Volume significativamente aumentado', color: 'danger' }
}

export const radiologyCalculators: RadiologyCalculator[] = [
  // 1. Volume Elipsoide
  {
    id: 'volume-ellipsoid',
    name: 'Volume Elipsoide',
    category: 'geral',
    description: 'Cálculo de volume elipsoide (L × W × H × 0,52)',
    inputs: [
      { name: 'length', label: 'Comprimento (L)', unit: 'cm', type: 'number', min: 0.1, max: 50, step: 0.1, defaultValue: 3.0 },
      { name: 'width', label: 'Largura (W)', unit: 'cm', type: 'number', min: 0.1, max: 50, step: 0.1, defaultValue: 2.0 },
      { name: 'height', label: 'Altura (H)', unit: 'cm', type: 'number', min: 0.1, max: 50, step: 0.1, defaultValue: 2.0 }
    ],
    calculate: (values) => {
      const L = values.length as number
      const W = values.width as number
      const H = values.height as number
      const volume = L * W * H * 0.52
      const { interpretation, color } = interpretVolume(volume, 'elipsoide')
      return {
        value: volume,
        unit: 'cm³',
        interpretation,
        color,
        formattedText: `Volume calculado: ${formatBR(volume)} cm³.`
      }
    },
    reference: {
      text: 'Fórmula padrão para volumes elipsoides',
      url: 'https://radiopaedia.org/articles/ellipsoid-volume-formula'
    }
  },

  // 2. Idade Gestacional por DUM
  {
    id: 'gestational-age-lmp',
    name: 'Idade Gestacional (DUM)',
    category: 'obstetricia',
    description: 'Calcula idade gestacional pela Data da Última Menstruação',
    inputs: [
      { name: 'lmp', label: 'Data da Última Menstruação (DUM)', type: 'date', placeholder: 'DD/MM/AAAA' }
    ],
    calculate: (values) => {
      const lmpDate = new Date(values.lmp as string)
      const today = new Date()
      const days = getDaysBetweenDates(lmpDate, today)
      const weeks = Math.floor(days / 7)
      const remainingDays = days % 7
      const gestationalAge = `${weeks} semanas e ${remainingDays} dias`
      
      return {
        value: gestationalAge,
        interpretation: weeks < 37 ? 'Pré-termo' : weeks > 42 ? 'Pós-termo' : 'Termo',
        color: weeks >= 37 && weeks <= 42 ? 'success' : 'warning',
        formattedText: `Idade gestacional pela DUM: ${weeks}+${remainingDays} semanas.`
      }
    },
    reference: {
      text: 'Método Naegele para cálculo de idade gestacional',
      url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date'
    }
  },

  // 3. Peso Fetal Estimado (Hadlock)
  {
    id: 'fetal-weight-hadlock',
    name: 'Peso Fetal (Hadlock)',
    category: 'obstetricia',
    description: 'Estimativa de peso fetal pela fórmula de Hadlock',
    inputs: [
      { name: 'dbp', label: 'DBP (Diâmetro Biparietal)', unit: 'mm', type: 'number', min: 10, max: 150, step: 0.1, defaultValue: 85.0 },
      { name: 'cc', label: 'CC (Circunferência Cefálica)', unit: 'mm', type: 'number', min: 50, max: 500, step: 0.1, defaultValue: 300.0 },
      { name: 'ca', label: 'CA (Circunferência Abdominal)', unit: 'mm', type: 'number', min: 50, max: 500, step: 0.1, defaultValue: 280.0 },
      { name: 'fl', label: 'CF (Comprimento Femoral)', unit: 'mm', type: 'number', min: 10, max: 100, step: 0.1, defaultValue: 65.0 }
    ],
    calculate: (values) => {
      const dbp = values.dbp as number
      const cc = values.cc as number
      const ca = values.ca as number
      const fl = values.fl as number
      
      // Fórmula de Hadlock (log10)
      const logWeight = 1.335 - 0.0034 * ca * fl + 0.0316 * dbp + 0.0457 * ca + 0.1623 * fl
      const weight = Math.pow(10, logWeight)
      
      const interpretation = weight < 2500 ? 'Baixo peso' : weight > 4000 ? 'Macrossomia' : 'Peso adequado'
      const color: 'success' | 'warning' | 'danger' = weight >= 2500 && weight <= 4000 ? 'success' : 'warning'
      
      return {
        value: weight,
        unit: 'g',
        interpretation,
        color,
        formattedText: `Peso fetal estimado (Hadlock): ${formatBR(weight, 0)} g, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Hadlock FP et al. Radiology 1984',
      url: 'https://pubmed.ncbi.nlm.nih.gov/6333079/'
    }
  },

  // 4. Volume Prostático + PSA Density
  {
    id: 'prostate-volume-psa',
    name: 'Volume Prostático + PSA Density',
    category: 'urologia',
    description: 'Volume prostático (elipsoide) e densidade de PSA',
    inputs: [
      { name: 'length', label: 'Comprimento (L)', unit: 'cm', type: 'number', min: 1, max: 10, step: 0.1, defaultValue: 4.0 },
      { name: 'width', label: 'Largura (W)', unit: 'cm', type: 'number', min: 1, max: 10, step: 0.1, defaultValue: 4.5 },
      { name: 'height', label: 'Altura (H)', unit: 'cm', type: 'number', min: 1, max: 10, step: 0.1, defaultValue: 3.5 },
      { name: 'psa', label: 'PSA Total', unit: 'ng/mL', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 4.0 }
    ],
    calculate: (values) => {
      const L = values.length as number
      const W = values.width as number
      const H = values.height as number
      const psa = values.psa as number
      
      const volume = L * W * H * 0.52
      const psaDensity = psa / volume
      
      const interpretation = psaDensity > 0.15 
        ? 'PSA density elevada (suspeito para neoplasia)' 
        : 'PSA density normal'
      const color: 'success' | 'warning' | 'danger' = psaDensity <= 0.15 ? 'success' : 'danger'
      
      return {
        value: volume,
        unit: 'cm³',
        interpretation,
        color,
        formattedText: `Volume prostático: ${formatBR(volume)} cm³, PSA density: ${formatBR(psaDensity, 3)} ng/mL/cm³, ${psaDensity > 0.15 ? 'elevada' : 'normal'}.`
      }
    },
    reference: {
      text: 'Catalona WJ et al. JAMA 1994',
      url: 'https://pubmed.ncbi.nlm.nih.gov/7512908/'
    }
  },

  // 5. Volume do Hematoma (ABC/2)
  {
    id: 'hematoma-abc2',
    name: 'Volume do Hematoma (ABC/2)',
    category: 'neuro',
    description: 'Estimativa de volume de hematoma intracraniano',
    inputs: [
      { name: 'a', label: 'Maior diâmetro (A)', unit: 'cm', type: 'number', min: 0.1, max: 20, step: 0.1, defaultValue: 4.0 },
      { name: 'b', label: 'Diâmetro perpendicular (B)', unit: 'cm', type: 'number', min: 0.1, max: 20, step: 0.1, defaultValue: 3.0 },
      { name: 'c', label: 'Número de cortes × espessura (C)', unit: 'cm', type: 'number', min: 0.1, max: 20, step: 0.1, defaultValue: 2.5 }
    ],
    calculate: (values) => {
      const A = values.a as number
      const B = values.b as number
      const C = values.c as number
      
      const volume = (A * B * C) / 2
      
      const interpretation = volume < 30 
        ? 'Hematoma pequeno' 
        : volume < 60 
        ? 'Hematoma moderado' 
        : 'Hematoma volumoso'
      const color: 'success' | 'warning' | 'danger' = volume < 30 ? 'success' : volume < 60 ? 'warning' : 'danger'
      
      return {
        value: volume,
        unit: 'cm³',
        interpretation,
        color,
        formattedText: `Volume do hematoma (ABC/2): ${formatBR(volume)} cm³, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Kothari RU et al. Stroke 1996',
      url: 'https://pubmed.ncbi.nlm.nih.gov/8610308/'
    }
  },

  // 6. Índice de Evans
  {
    id: 'evans-index',
    name: 'Índice de Evans',
    category: 'neuro',
    description: 'Razão entre cornos frontais e diâmetro biparietal craniano',
    inputs: [
      { name: 'frontalHorns', label: 'Diâmetro dos cornos frontais', unit: 'mm', type: 'number', min: 10, max: 100, step: 0.1, defaultValue: 35.0 },
      { name: 'bpd', label: 'Diâmetro biparietal craniano', unit: 'mm', type: 'number', min: 50, max: 200, step: 0.1, defaultValue: 120.0 }
    ],
    calculate: (values) => {
      const frontalHorns = values.frontalHorns as number
      const bpd = values.bpd as number
      
      const evansIndex = frontalHorns / bpd
      
      const interpretation = evansIndex > 0.3 
        ? 'Aumentado (sugestivo de ventriculomegalia)' 
        : 'Normal'
      const color: 'success' | 'warning' | 'danger' = evansIndex <= 0.3 ? 'success' : 'warning'
      
      return {
        value: evansIndex,
        unit: '',
        interpretation,
        color,
        formattedText: `Índice de Evans: ${formatBR(evansIndex, 2)}, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Evans WA. Arch Neurol Psychiatry 1942',
      url: 'https://radiopaedia.org/articles/evans-index-1'
    }
  },

  // 7. Índice Cardiotorácico
  {
    id: 'cardiothoracic-ratio',
    name: 'Índice Cardiotorácico',
    category: 'cardio',
    description: 'Razão entre diâmetro cardíaco e torácico na radiografia PA',
    inputs: [
      { name: 'cardiacDiameter', label: 'Diâmetro cardíaco', unit: 'cm', type: 'number', min: 5, max: 30, step: 0.1, defaultValue: 14.0 },
      { name: 'thoracicDiameter', label: 'Diâmetro torácico', unit: 'cm', type: 'number', min: 15, max: 50, step: 0.1, defaultValue: 30.0 }
    ],
    calculate: (values) => {
      const cardiac = values.cardiacDiameter as number
      const thoracic = values.thoracicDiameter as number
      
      const ratio = cardiac / thoracic
      
      const interpretation = ratio > 0.5 
        ? 'Cardiomegalia' 
        : 'Área cardíaca normal'
      const color: 'success' | 'warning' | 'danger' = ratio <= 0.5 ? 'success' : 'warning'
      
      return {
        value: ratio,
        unit: '',
        interpretation,
        color,
        formattedText: `Índice cardiotorácico: ${formatBR(ratio, 2)}, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Danzer CS. Am J Med Sci 1919',
      url: 'https://radiopaedia.org/articles/cardiothoracic-ratio'
    }
  },

  // 8. IMC (Índice de Massa Corporal)
  {
    id: 'bmi',
    name: 'IMC',
    category: 'geral',
    description: 'Índice de Massa Corporal (peso/altura²)',
    inputs: [
      { name: 'weight', label: 'Peso', unit: 'kg', type: 'number', min: 20, max: 300, step: 0.1, defaultValue: 70.0 },
      { name: 'height', label: 'Altura', unit: 'm', type: 'number', min: 1.0, max: 2.5, step: 0.01, defaultValue: 1.70 }
    ],
    calculate: (values) => {
      const weight = values.weight as number
      const height = values.height as number
      
      const bmi = weight / (height * height)
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (bmi < 18.5) {
        interpretation = 'Baixo peso'
        color = 'warning'
      } else if (bmi < 25) {
        interpretation = 'Peso normal'
        color = 'success'
      } else if (bmi < 30) {
        interpretation = 'Sobrepeso'
        color = 'warning'
      } else {
        interpretation = 'Obesidade'
        color = 'danger'
      }
      
      return {
        value: bmi,
        unit: 'kg/m²',
        interpretation,
        color,
        formattedText: `IMC: ${formatBR(bmi)} kg/m², ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'OMS - Organização Mundial da Saúde',
      url: 'https://www.who.int/health-topics/obesity'
    }
  },

  // 9. BSA (Body Surface Area - Dubois)
  {
    id: 'bsa-dubois',
    name: 'BSA (Dubois)',
    category: 'geral',
    description: 'Área de Superfície Corporal pela fórmula de Dubois',
    inputs: [
      { name: 'weight', label: 'Peso', unit: 'kg', type: 'number', min: 20, max: 300, step: 0.1, defaultValue: 70.0 },
      { name: 'height', label: 'Altura', unit: 'cm', type: 'number', min: 100, max: 250, step: 1, defaultValue: 170 }
    ],
    calculate: (values) => {
      const weight = values.weight as number
      const height = values.height as number
      
      const bsa = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725)
      
      const interpretation = bsa >= 1.5 && bsa <= 2.0 
        ? 'Dentro da normalidade' 
        : 'Fora da faixa habitual'
      const color: 'success' | 'warning' = bsa >= 1.5 && bsa <= 2.0 ? 'success' : 'warning'
      
      return {
        value: bsa,
        unit: 'm²',
        interpretation,
        color,
        formattedText: `Área de superfície corporal: ${formatBR(bsa, 2)} m².`
      }
    },
    reference: {
      text: 'DuBois D, DuBois EF. Arch Intern Med 1916',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2520314/'
    }
  },

  // 10. TFGe (eGFR CKD-EPI)
  {
    id: 'egfr-ckd-epi',
    name: 'TFGe (CKD-EPI)',
    category: 'geral',
    description: 'Taxa de Filtração Glomerular estimada (CKD-EPI)',
    inputs: [
      { name: 'creatinine', label: 'Creatinina sérica', unit: 'mg/dL', type: 'number', min: 0.1, max: 20, step: 0.1, defaultValue: 1.0 },
      { name: 'age', label: 'Idade', unit: 'anos', type: 'number', min: 18, max: 120, step: 1, defaultValue: 50 }
    ],
    calculate: (values) => {
      const cr = values.creatinine as number
      const age = values.age as number
      
      // Fórmula CKD-EPI simplificada (assumindo sexo masculino, não-negro)
      const kappa = 0.9
      const alpha = -0.411
      const minValue = Math.min(cr / kappa, 1)
      const maxValue = Math.max(cr / kappa, 1)
      
      const egfr = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * Math.pow(0.993, age)
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (egfr >= 90) {
        interpretation = 'Função renal normal (G1)'
        color = 'success'
      } else if (egfr >= 60) {
        interpretation = 'Leve redução (G2)'
        color = 'success'
      } else if (egfr >= 30) {
        interpretation = 'Moderada redução (G3)'
        color = 'warning'
      } else if (egfr >= 15) {
        interpretation = 'Severa redução (G4)'
        color = 'danger'
      } else {
        interpretation = 'Insuficiência renal (G5)'
        color = 'danger'
      }
      
      return {
        value: egfr,
        unit: 'mL/min/1,73m²',
        interpretation,
        color,
        formattedText: `TFGe (CKD-EPI): ${formatBR(egfr)} mL/min/1,73m², ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Levey AS et al. Ann Intern Med 2009',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19414839/'
    }
  },

  // 11. IG por CCN (Crown-Rump Length)
  {
    id: 'gestational-age-crl',
    name: 'IG por CCN',
    category: 'obstetricia',
    description: 'Idade gestacional pelo comprimento cabeça-nádega (Robinson 1975)',
    inputs: [
      { name: 'crl', label: 'CCN (Crown-Rump Length)', unit: 'mm', type: 'number', min: 5, max: 100, step: 0.1, defaultValue: 45.0 }
    ],
    calculate: (values) => {
      const crl = values.crl as number
      
      // Fórmula de Robinson 1975: IG (dias) = 8.052 × √(CRL × 1.037) + 23.73
      const days = 8.052 * Math.sqrt(crl * 1.037) + 23.73
      const weeks = Math.floor(days / 7)
      const remainingDays = Math.round(days % 7)
      
      return {
        value: `${weeks} semanas e ${remainingDays} dias`,
        interpretation: `CCN de ${formatBR(crl)} mm`,
        color: 'success',
        formattedText: `Idade gestacional por CCN: ${weeks}+${remainingDays} semanas.`
      }
    },
    reference: {
      text: 'Robinson HP, Fleming JE. BJOG 1975',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1156108/'
    }
  },

  // 12. DPP (Data Provável do Parto)
  {
    id: 'estimated-due-date',
    name: 'DPP (Data Provável do Parto)',
    category: 'obstetricia',
    description: 'Data provável do parto pela regra de Naegele',
    inputs: [
      { name: 'lmp', label: 'Data da Última Menstruação (DUM)', type: 'date', placeholder: 'DD/MM/AAAA' }
    ],
    calculate: (values) => {
      const lmpDate = new Date(values.lmp as string)
      
      // Regra de Naegele: DUM + 280 dias
      const dppDate = new Date(lmpDate)
      dppDate.setDate(dppDate.getDate() + 280)
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      }
      
      return {
        value: formatDate(dppDate),
        interpretation: 'Regra de Naegele (DUM + 280 dias)',
        color: 'success',
        formattedText: `Data provável do parto: ${formatDate(dppDate)}.`
      }
    },
    reference: {
      text: 'ACOG Committee Opinion 2017',
      url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date'
    }
  },

  // 13. ILA (Índice de Líquido Amniótico)
  {
    id: 'amniotic-fluid-index',
    name: 'ILA (Índice de Líquido Amniótico)',
    category: 'obstetricia',
    description: 'Soma dos 4 quadrantes do líquido amniótico',
    inputs: [
      { name: 'q1', label: 'Quadrante 1', unit: 'cm', type: 'number', min: 0, max: 20, step: 0.1, defaultValue: 4.0 },
      { name: 'q2', label: 'Quadrante 2', unit: 'cm', type: 'number', min: 0, max: 20, step: 0.1, defaultValue: 5.0 },
      { name: 'q3', label: 'Quadrante 3', unit: 'cm', type: 'number', min: 0, max: 20, step: 0.1, defaultValue: 4.5 },
      { name: 'q4', label: 'Quadrante 4', unit: 'cm', type: 'number', min: 0, max: 20, step: 0.1, defaultValue: 4.0 }
    ],
    calculate: (values) => {
      const q1 = values.q1 as number
      const q2 = values.q2 as number
      const q3 = values.q3 as number
      const q4 = values.q4 as number
      
      const ila = q1 + q2 + q3 + q4
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (ila < 5) {
        interpretation = 'Oligoidrâmnio severo'
        color = 'danger'
      } else if (ila < 8) {
        interpretation = 'Oligoidrâmnio limítrofe'
        color = 'warning'
      } else if (ila <= 24) {
        interpretation = 'Normal'
        color = 'success'
      } else {
        interpretation = 'Polidrâmnio'
        color = 'warning'
      }
      
      return {
        value: ila,
        unit: 'cm',
        interpretation,
        color,
        formattedText: `ILA: ${formatBR(ila)} cm, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Phelan JP et al. Am J Obstet Gynecol 1987',
      url: 'https://pubmed.ncbi.nlm.nih.gov/3322321/'
    }
  },

  // 14. Percentil Peso Fetal (INTERGROWTH-21st)
  {
    id: 'fetal-weight-percentile',
    name: 'Percentil Peso Fetal',
    category: 'obstetricia',
    description: 'Percentil e Z-score do peso fetal (INTERGROWTH-21st)',
    inputs: [
      { name: 'weight', label: 'Peso fetal estimado', unit: 'g', type: 'number', min: 500, max: 5000, step: 10, defaultValue: 2500 },
      { name: 'weeks', label: 'Idade gestacional', unit: 'semanas', type: 'number', min: 24, max: 42, step: 1, defaultValue: 37 }
    ],
    calculate: (values) => {
      const weight = values.weight as number
      const weeks = values.weeks as number
      
      // Valores médios aproximados INTERGROWTH-21st (simplificado)
      const meanWeights: Record<number, number> = {
        24: 600, 28: 1000, 32: 1700, 36: 2600, 37: 2850, 38: 3000, 39: 3200, 40: 3400, 41: 3500, 42: 3600
      }
      
      const mean = meanWeights[weeks] || 2500
      const sd = mean * 0.12 // Desvio padrão aproximado (12% do peso médio)
      
      const zScore = (weight - mean) / sd
      
      // Conversão Z-score para percentil (aproximado)
      let percentile = 50
      if (zScore < -2) percentile = 3
      else if (zScore < -1) percentile = 16
      else if (zScore < 0) percentile = 30
      else if (zScore < 1) percentile = 70
      else if (zScore < 2) percentile = 84
      else percentile = 97
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (percentile < 10) {
        interpretation = 'Pequeno para IG (PIG)'
        color = 'warning'
      } else if (percentile > 90) {
        interpretation = 'Grande para IG (GIG)'
        color = 'warning'
      } else {
        interpretation = 'Adequado para IG (AIG)'
        color = 'success'
      }
      
      return {
        value: percentile,
        unit: '',
        interpretation,
        color,
        formattedText: `Peso fetal ${formatBR(weight, 0)} g com ${weeks} semanas: percentil ${percentile}, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'INTERGROWTH-21st Fetal Growth Standards',
      url: 'https://intergrowth21.tghn.org/'
    }
  },

  // 15. Volume Hepático
  {
    id: 'liver-volume',
    name: 'Volume Hepático',
    category: 'abdome',
    description: 'Estimativa de volume hepático',
    inputs: [
      { name: 'length', label: 'Comprimento (craniocaudal)', unit: 'cm', type: 'number', min: 5, max: 30, step: 0.1, defaultValue: 15.0 },
      { name: 'width', label: 'Largura (transverso)', unit: 'cm', type: 'number', min: 5, max: 30, step: 0.1, defaultValue: 20.0 },
      { name: 'height', label: 'Altura (AP)', unit: 'cm', type: 'number', min: 5, max: 20, step: 0.1, defaultValue: 12.0 }
    ],
    calculate: (values) => {
      const L = values.length as number
      const W = values.width as number
      const H = values.height as number
      
      const volume = L * W * H * 0.52
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (volume < 1000) {
        interpretation = 'Volume reduzido'
        color = 'warning'
      } else if (volume <= 1800) {
        interpretation = 'Dentro da normalidade'
        color = 'success'
      } else if (volume <= 2500) {
        interpretation = 'Hepatomegalia leve'
        color = 'warning'
      } else {
        interpretation = 'Hepatomegalia significativa'
        color = 'danger'
      }
      
      return {
        value: volume,
        unit: 'mL',
        interpretation,
        color,
        formattedText: `Volume hepático: ${formatBR(volume, 0)} mL, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Heymsfield SB et al. J Nutr 2014',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24500935/'
    }
  },

  // 16. Volume Esplênico
  {
    id: 'spleen-volume',
    name: 'Volume Esplênico + Índice',
    category: 'abdome',
    description: 'Volume esplênico e índice de esplenomegalia',
    inputs: [
      { name: 'length', label: 'Comprimento', unit: 'cm', type: 'number', min: 5, max: 25, step: 0.1, defaultValue: 11.0 },
      { name: 'width', label: 'Largura', unit: 'cm', type: 'number', min: 3, max: 15, step: 0.1, defaultValue: 7.0 },
      { name: 'depth', label: 'Profundidade', unit: 'cm', type: 'number', min: 3, max: 15, step: 0.1, defaultValue: 4.0 }
    ],
    calculate: (values) => {
      const L = values.length as number
      const W = values.width as number
      const D = values.depth as number
      
      const volume = L * W * D * 0.52
      const splenicIndex = L * W * D
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (volume <= 250) {
        interpretation = 'Dimensões normais'
        color = 'success'
      } else if (volume <= 500) {
        interpretation = 'Esplenomegalia leve'
        color = 'warning'
      } else {
        interpretation = 'Esplenomegalia acentuada'
        color = 'danger'
      }
      
      return {
        value: volume,
        unit: 'mL',
        interpretation,
        color,
        formattedText: `Volume esplênico: ${formatBR(volume, 0)} mL, índice ${formatBR(splenicIndex, 0)}, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Bezerra AS et al. Radiol Bras 2005',
      url: 'https://www.scielo.br/j/rb/a/8YcWHLTMxJjdnzQkHbkRX4F/'
    }
  },

  // 17. Volume Renal
  {
    id: 'kidney-volume',
    name: 'Volume Renal',
    category: 'abdome',
    description: 'Volume renal pela fórmula elipsoide',
    inputs: [
      { name: 'length', label: 'Comprimento', unit: 'cm', type: 'number', min: 5, max: 20, step: 0.1, defaultValue: 11.0 },
      { name: 'width', label: 'Largura', unit: 'cm', type: 'number', min: 3, max: 10, step: 0.1, defaultValue: 5.0 },
      { name: 'depth', label: 'Espessura', unit: 'cm', type: 'number', min: 2, max: 8, step: 0.1, defaultValue: 4.0 }
    ],
    calculate: (values) => {
      const L = values.length as number
      const W = values.width as number
      const D = values.depth as number
      
      const volume = L * W * D * 0.52
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (volume < 80) {
        interpretation = 'Volume reduzido (possível atrofia)'
        color = 'warning'
      } else if (volume <= 180) {
        interpretation = 'Dentro da normalidade'
        color = 'success'
      } else {
        interpretation = 'Volume aumentado'
        color = 'warning'
      }
      
      return {
        value: volume,
        unit: 'mL',
        interpretation,
        color,
        formattedText: `Volume renal: ${formatBR(volume, 0)} mL, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Emamian SA et al. Radiology 1993',
      url: 'https://pubmed.ncbi.nlm.nih.gov/8248734/'
    }
  },

  // 18. Washout Adrenal
  {
    id: 'adrenal-washout',
    name: 'Washout Adrenal',
    category: 'abdome',
    description: 'APW e RPW para caracterização de nódulos adrenais',
    inputs: [
      { name: 'preContrast', label: 'UH sem contraste', unit: 'HU', type: 'number', min: -50, max: 100, step: 1, defaultValue: 30 },
      { name: 'portal', label: 'UH fase portal', unit: 'HU', type: 'number', min: 0, max: 150, step: 1, defaultValue: 80 },
      { name: 'delayed', label: 'UH fase tardia (10-15 min)', unit: 'HU', type: 'number', min: 0, max: 120, step: 1, defaultValue: 50 }
    ],
    calculate: (values) => {
      const pre = values.preContrast as number
      const portal = values.portal as number
      const delayed = values.delayed as number
      
      // APW = (Portal - Delayed) / (Portal - Pre) × 100
      const apw = ((portal - delayed) / (portal - pre)) * 100
      
      // RPW = (Portal - Delayed) / Portal × 100
      const rpw = ((portal - delayed) / portal) * 100
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (apw >= 60 || rpw >= 40) {
        interpretation = 'Compatível com adenoma'
        color = 'success'
      } else if (pre <= 10) {
        interpretation = 'Provável adenoma rico em lipídios'
        color = 'success'
      } else {
        interpretation = 'Indeterminado'
        color = 'warning'
      }
      
      return {
        value: apw,
        unit: '%',
        interpretation,
        color,
        formattedText: `Washout absoluto: ${formatBR(apw)}%, relativo: ${formatBR(rpw)}%, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Caoili EM et al. Radiology 2002',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12091681/'
    }
  },

  // 19. Volume Tireoidiano
  {
    id: 'thyroid-volume',
    name: 'Volume Tireoidiano',
    category: 'geral',
    description: 'Volume total da tireoide (soma dos lobos + istmo)',
    inputs: [
      { name: 'rightLength', label: 'Lobo direito - Comprimento', unit: 'cm', type: 'number', min: 1, max: 8, step: 0.1, defaultValue: 5.0 },
      { name: 'rightWidth', label: 'Lobo direito - Largura', unit: 'cm', type: 'number', min: 1, max: 5, step: 0.1, defaultValue: 2.0 },
      { name: 'rightDepth', label: 'Lobo direito - Espessura', unit: 'cm', type: 'number', min: 1, max: 4, step: 0.1, defaultValue: 2.0 },
      { name: 'leftLength', label: 'Lobo esquerdo - Comprimento', unit: 'cm', type: 'number', min: 1, max: 8, step: 0.1, defaultValue: 5.0 },
      { name: 'leftWidth', label: 'Lobo esquerdo - Largura', unit: 'cm', type: 'number', min: 1, max: 5, step: 0.1, defaultValue: 2.0 },
      { name: 'leftDepth', label: 'Lobo esquerdo - Espessura', unit: 'cm', type: 'number', min: 1, max: 4, step: 0.1, defaultValue: 2.0 }
    ],
    calculate: (values) => {
      const rightVol = (values.rightLength as number) * (values.rightWidth as number) * (values.rightDepth as number) * 0.52
      const leftVol = (values.leftLength as number) * (values.leftWidth as number) * (values.leftDepth as number) * 0.52
      const totalVolume = rightVol + leftVol
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (totalVolume <= 18) {
        interpretation = 'Dentro da normalidade'
        color = 'success'
      } else if (totalVolume <= 25) {
        interpretation = 'Discretamente aumentado'
        color = 'warning'
      } else {
        interpretation = 'Bócio'
        color = 'warning'
      }
      
      return {
        value: totalVolume,
        unit: 'mL',
        interpretation,
        color,
        formattedText: `Volume tireoidiano: ${formatBR(totalVolume)} mL (LD ${formatBR(rightVol)} mL, LE ${formatBR(leftVol)} mL), ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Brunn J et al. Ultrasound Med Biol 1981',
      url: 'https://pubmed.ncbi.nlm.nih.gov/7256012/'
    }
  },

  // 20. Estenose Carotídea (NASCET)
  {
    id: 'carotid-stenosis-nascet',
    name: 'Estenose Carotídea (NASCET)',
    category: 'vascular',
    description: 'Grau de estenose carotídea pelo método NASCET',
    inputs: [
      { name: 'residual', label: 'Diâmetro residual (estenose)', unit: 'mm', type: 'number', min: 0, max: 10, step: 0.1, defaultValue: 2.0 },
      { name: 'normal', label: 'Diâmetro distal normal', unit: 'mm', type: 'number', min: 3, max: 10, step: 0.1, defaultValue: 6.0 }
    ],
    calculate: (values) => {
      const residual = values.residual as number
      const normal = values.normal as number
      
      const stenosis = ((normal - residual) / normal) * 100
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (stenosis < 50) {
        interpretation = 'Estenose leve (<50%)'
        color = 'success'
      } else if (stenosis < 70) {
        interpretation = 'Estenose moderada (50-69%)'
        color = 'warning'
      } else if (stenosis < 99) {
        interpretation = 'Estenose severa (70-99%)'
        color = 'danger'
      } else {
        interpretation = 'Oclusão completa'
        color = 'danger'
      }
      
      return {
        value: stenosis,
        unit: '%',
        interpretation,
        color,
        formattedText: `Estenose carotídea (NASCET): ${formatBR(stenosis, 0)}%, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'NASCET Collaborators. N Engl J Med 1991',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1852179/'
    }
  },

  // 21. Diâmetro Aórtico + Z-score
  {
    id: 'aortic-diameter-zscore',
    name: 'Diâmetro Aórtico + Z-score',
    category: 'vascular',
    description: 'Avaliação de diâmetro aórtico com Z-score',
    inputs: [
      { name: 'diameter', label: 'Diâmetro aórtico', unit: 'mm', type: 'number', min: 10, max: 100, step: 0.1, defaultValue: 30.0 },
      { name: 'bsa', label: 'BSA (Área Superfície Corporal)', unit: 'm²', type: 'number', min: 0.5, max: 3.0, step: 0.01, defaultValue: 1.80 }
    ],
    calculate: (values) => {
      const diameter = values.diameter as number
      const bsa = values.bsa as number
      
      // Valores normais aproximados: diâmetro esperado = 16 × √BSA (aorta ascendente)
      const expectedDiameter = 16 * Math.sqrt(bsa)
      const zScore = (diameter - expectedDiameter) / 2.5 // Desvio padrão aproximado
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (diameter < 40) {
        interpretation = 'Normal'
        color = 'success'
      } else if (diameter < 45) {
        interpretation = 'Ectasia leve'
        color = 'warning'
      } else if (diameter < 55) {
        interpretation = 'Aneurisma'
        color = 'danger'
      } else {
        interpretation = 'Aneurisma volumoso'
        color = 'danger'
      }
      
      return {
        value: diameter,
        unit: 'mm',
        interpretation,
        color,
        formattedText: `Diâmetro aórtico: ${formatBR(diameter)} mm (Z-score ${formatBR(zScore, 2)}), ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Hiratzka LF et al. Circulation 2010',
      url: 'https://www.ahajournals.org/doi/10.1161/CIR.0b013e3181d4739e'
    }
  },

  // 22. Escore de Agatston
  {
    id: 'agatston-score',
    name: 'Escore de Agatston',
    category: 'cardio',
    description: 'Interpretação do escore de cálcio coronariano',
    inputs: [
      { name: 'score', label: 'Escore de cálcio', unit: '', type: 'number', min: 0, max: 5000, step: 1, defaultValue: 100 }
    ],
    calculate: (values) => {
      const score = values.score as number
      
      let interpretation = ''
      let risk = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (score === 0) {
        interpretation = 'Ausência de calcificação'
        risk = 'risco muito baixo'
        color = 'success'
      } else if (score < 100) {
        interpretation = 'Calcificação leve'
        risk = 'risco baixo a moderado'
        color = 'success'
      } else if (score < 400) {
        interpretation = 'Calcificação moderada'
        risk = 'risco moderado a alto'
        color = 'warning'
      } else {
        interpretation = 'Calcificação severa'
        risk = 'risco alto'
        color = 'danger'
      }
      
      return {
        value: score,
        unit: '',
        interpretation: `${interpretation}. ${risk}`,
        color,
        formattedText: `Escore de Agatston: ${formatBR(score, 0)}, ${interpretation.toLowerCase()}, ${risk}.`
      }
    },
    reference: {
      text: 'Agatston AS et al. J Am Coll Cardiol 1990',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2407762/'
    }
  },

  // 23. Índice Bicaudado
  {
    id: 'bicaudate-index',
    name: 'Índice Bicaudado',
    category: 'neuro',
    description: 'Razão para avaliação de atrofia subcortical',
    inputs: [
      { name: 'caudateDistance', label: 'Distância entre núcleos caudados', unit: 'mm', type: 'number', min: 10, max: 50, step: 0.1, defaultValue: 18.0 },
      { name: 'brainWidth', label: 'Largura cerebral (mesmo nível)', unit: 'mm', type: 'number', min: 50, max: 150, step: 0.1, defaultValue: 120.0 }
    ],
    calculate: (values) => {
      const caudateDistance = values.caudateDistance as number
      const brainWidth = values.brainWidth as number
      
      const index = caudateDistance / brainWidth
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (index < 0.15) {
        interpretation = 'Normal'
        color = 'success'
      } else if (index < 0.18) {
        interpretation = 'Limítrofe (possível atrofia leve)'
        color = 'warning'
      } else {
        interpretation = 'Aumentado (atrofia subcortical)'
        color = 'warning'
      }
      
      return {
        value: index,
        unit: '',
        interpretation,
        color,
        formattedText: `Índice bicaudado: ${formatBR(index, 3)}, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Hahn FJ et al. AJNR 1985',
      url: 'https://pubmed.ncbi.nlm.nih.gov/3933954/'
    }
  },

  // 24. RECIST 1.1
  {
    id: 'recist-1-1',
    name: 'RECIST 1.1',
    category: 'oncologia',
    description: 'Soma de lesões alvo para avaliação de resposta tumoral',
    inputs: [
      { name: 'lesion1', label: 'Lesão alvo 1', unit: 'mm', type: 'number', min: 0, max: 200, step: 0.1, defaultValue: 25.0 },
      { name: 'lesion2', label: 'Lesão alvo 2', unit: 'mm', type: 'number', min: 0, max: 200, step: 0.1, defaultValue: 20.0 },
      { name: 'lesion3', label: 'Lesão alvo 3 (opcional)', unit: 'mm', type: 'number', min: 0, max: 200, step: 0.1, defaultValue: 0 },
      { name: 'baseline', label: 'Soma baseline (comparação)', unit: 'mm', type: 'number', min: 0, max: 600, step: 0.1, defaultValue: 50.0 }
    ],
    calculate: (values) => {
      const lesion1 = values.lesion1 as number
      const lesion2 = values.lesion2 as number
      const lesion3 = (values.lesion3 as number) || 0
      const baseline = values.baseline as number
      
      const currentSum = lesion1 + lesion2 + lesion3
      const percentChange = ((currentSum - baseline) / baseline) * 100
      
      let response = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (percentChange <= -30) {
        response = 'Resposta parcial (RP)'
        color = 'success'
      } else if (percentChange <= 20) {
        response = 'Doença estável (DE)'
        color = 'warning'
      } else {
        response = 'Doença progressiva (DP)'
        color = 'danger'
      }
      
      return {
        value: currentSum,
        unit: 'mm',
        interpretation: response,
        color,
        formattedText: `RECIST 1.1: soma ${formatBR(currentSum)} mm (variação ${formatBR(percentChange)}%), ${response.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Eisenhauer EA et al. Eur J Cancer 2009',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19095497/'
    }
  },

  // 25. Volume Ovariano
  {
    id: 'ovarian-volume',
    name: 'Volume Ovariano',
    category: 'geral',
    description: 'Volume ovariano pela fórmula elipsoide',
    inputs: [
      { name: 'length', label: 'Comprimento', unit: 'cm', type: 'number', min: 1, max: 10, step: 0.1, defaultValue: 3.5 },
      { name: 'width', label: 'Largura', unit: 'cm', type: 'number', min: 1, max: 8, step: 0.1, defaultValue: 2.5 },
      { name: 'depth', label: 'Espessura', unit: 'cm', type: 'number', min: 1, max: 8, step: 0.1, defaultValue: 2.0 }
    ],
    calculate: (values) => {
      const L = values.length as number
      const W = values.width as number
      const D = values.depth as number
      
      const volume = L * W * D * 0.52
      
      let interpretation = ''
      let color: 'success' | 'warning' | 'danger' = 'success'
      
      if (volume <= 10) {
        interpretation = 'Dentro da normalidade'
        color = 'success'
      } else if (volume <= 20) {
        interpretation = 'Discretamente aumentado'
        color = 'warning'
      } else {
        interpretation = 'Aumentado'
        color = 'warning'
      }
      
      return {
        value: volume,
        unit: 'cm³',
        interpretation,
        color,
        formattedText: `Volume ovariano: ${formatBR(volume)} cm³, ${interpretation.toLowerCase()}.`
      }
    },
    reference: {
      text: 'Pavlik EJ et al. Ultrasound Obstet Gynecol 2000',
      url: 'https://pubmed.ncbi.nlm.nih.gov/11169286/'
    }
  }
]
