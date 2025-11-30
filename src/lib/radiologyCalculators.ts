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
  category: 'geral' | 'obstetricia' | 'neuro' | 'cardio' | 'urologia'
  subcategory?: string
  description: string
  inputs: CalculatorInput[]
  calculate: (values: Record<string, number | string>) => CalculatorResult
  reference?: {
    text: string
    url: string
  }
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
        formattedText: `Volume calculado: ${volume.toFixed(1)} cm³ (fórmula elipsoide: L × W × H × 0,52 = ${L.toFixed(1)} × ${W.toFixed(1)} × ${H.toFixed(1)} × 0,52).`
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
        formattedText: `Idade gestacional pela DUM: ${gestationalAge} (${weeks}+${remainingDays}).`
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
        formattedText: `Peso fetal estimado (Hadlock): ${weight.toFixed(0)} g. ${interpretation}.`
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
        formattedText: `Volume prostático: ${volume.toFixed(1)} cm³. PSA density: ${psaDensity.toFixed(3)} ng/mL/cm³. ${interpretation}.`
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
        formattedText: `Volume do hematoma (ABC/2): ${volume.toFixed(1)} cm³. ${interpretation}.`
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
        ? 'Índice de Evans aumentado (sugestivo de ventriculomegalia)' 
        : 'Índice de Evans normal'
      const color: 'success' | 'warning' | 'danger' = evansIndex <= 0.3 ? 'success' : 'warning'
      
      return {
        value: evansIndex,
        unit: '',
        interpretation,
        color,
        formattedText: `Índice de Evans: ${evansIndex.toFixed(2)} (${(evansIndex * 100).toFixed(0)}%). ${interpretation}.`
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
        ? 'Cardiomegalia (índice cardiotorácico aumentado)' 
        : 'Área cardíaca normal'
      const color: 'success' | 'warning' | 'danger' = ratio <= 0.5 ? 'success' : 'warning'
      
      return {
        value: ratio,
        unit: '',
        interpretation,
        color,
        formattedText: `Índice cardiotorácico: ${ratio.toFixed(2)} (${(ratio * 100).toFixed(0)}%). ${interpretation}.`
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
        formattedText: `IMC: ${bmi.toFixed(1)} kg/m². ${interpretation}.`
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
        ? 'ASC dentro da normalidade' 
        : 'ASC fora da faixa habitual'
      const color: 'success' | 'warning' = bsa >= 1.5 && bsa <= 2.0 ? 'success' : 'warning'
      
      return {
        value: bsa,
        unit: 'm²',
        interpretation,
        color,
        formattedText: `Área de superfície corporal (Dubois): ${bsa.toFixed(2)} m². ${interpretation}.`
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
        interpretation = 'Função renal normal (Estágio 1)'
        color = 'success'
      } else if (egfr >= 60) {
        interpretation = 'Leve redução da função renal (Estágio 2)'
        color = 'success'
      } else if (egfr >= 30) {
        interpretation = 'Moderada redução da função renal (Estágio 3)'
        color = 'warning'
      } else if (egfr >= 15) {
        interpretation = 'Severa redução da função renal (Estágio 4)'
        color = 'danger'
      } else {
        interpretation = 'Insuficiência renal terminal (Estágio 5)'
        color = 'danger'
      }
      
      return {
        value: egfr,
        unit: 'mL/min/1,73m²',
        interpretation,
        color,
        formattedText: `TFGe (CKD-EPI): ${egfr.toFixed(1)} mL/min/1,73m². ${interpretation}.`
      }
    },
    reference: {
      text: 'Levey AS et al. Ann Intern Med 2009',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19414839/'
    }
  }
]
