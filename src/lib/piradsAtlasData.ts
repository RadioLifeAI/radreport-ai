// PI-RADS v2.1 Atlas Data - Reference Images and Descriptions
// Based on ACR PI-RADS v2.1 guidelines

export interface PIRADSAtlasOption {
  score: number
  label: string
  shortLabel: string
  description: string
  detailedDescription: string
  color: string
}

// T2W Scoring for Peripheral Zone (PZ)
export const t2wPZAtlas: PIRADSAtlasOption[] = [
  {
    score: 1,
    label: 'Normal',
    shortLabel: 'Normal',
    description: 'Intensidade de sinal hiperintenso homogêneo (normal)',
    detailedDescription: 'Sinal T2 uniformemente hiperintenso, característico de tecido glandular normal da zona periférica. Aspecto homogêneo sem áreas focais de hipossinal.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 2,
    label: 'Linear/Cunha',
    shortLabel: 'Linear',
    description: 'Hipointensidade linear ou em forma de cunha, ou hipointensidade difusa leve',
    detailedDescription: 'Hipointensidade em T2 com padrão linear ou em forma de cunha, geralmente com margens indistintas. Pode representar alterações inflamatórias, fibróticas ou atrofia. Também inclui hipointensidade difusa leve.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 3,
    label: 'Heterogêneo',
    shortLabel: 'Heterog.',
    description: 'Intensidade de sinal heterogênea ou hipointensidade arredondada não circunscrita',
    detailedDescription: 'Sinal heterogêneo que não se enquadra nas categorias 2, 4 ou 5. Pode ser hipointensidade moderada arredondada, não circunscrita. Achado equívoco que requer correlação com DWI.',
    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-400'
  },
  {
    score: 4,
    label: 'Focal <1,5cm',
    shortLabel: '<1,5cm',
    description: 'Foco/massa hipointenso circunscrito, homogêneo, confinado à próstata e <1,5 cm',
    detailedDescription: 'Lesão focal com hipossinal moderado homogêneo, circunscrita, confinada à próstata. Dimensão máxima menor que 1,5 cm na maior dimensão. Achado suspeito para malignidade.',
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-400'
  },
  {
    score: 5,
    label: 'Focal ≥1,5cm ou EPE',
    shortLabel: '≥1,5cm/EPE',
    description: 'Igual ao score 4, porém ≥1,5 cm ou com extensão extraprostática/invasiva definida',
    detailedDescription: 'Lesão focal com as mesmas características do score 4, porém com dimensão máxima ≥1,5 cm, OU apresentando sinais de extensão extraprostática ou comportamento invasivo definido.',
    color: 'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-400'
  }
]

// T2W Scoring for Transition Zone (TZ)
export const t2wTZAtlas: PIRADSAtlasOption[] = [
  {
    score: 1,
    label: 'Normal/Nódulo Típico',
    shortLabel: 'Normal',
    description: 'TZ normal (raro) OU nódulo redondo completamente encapsulado ("nódulo típico")',
    detailedDescription: 'Aparência normal da zona de transição (rara) ou presença de nódulo redondo, completamente encapsulado, característico de hiperplasia prostática benigna ("nódulo típico de HPB").',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 2,
    label: 'Nódulo Atípico',
    shortLabel: 'Atípico',
    description: 'Nódulo predominantemente encapsulado OU nódulo circunscrito homogêneo sem cápsula',
    detailedDescription: 'Nódulo predominantemente encapsulado ("nódulo atípico") OU nódulo circunscrito homogêneo sem cápsula evidente OU área homogênea levemente hipointensa entre os nódulos de HPB.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 3,
    label: 'Heterogêneo',
    shortLabel: 'Heterog.',
    description: 'Área com intensidade de sinal heterogênea com margens obscurecidas',
    detailedDescription: 'Área com intensidade de sinal heterogênea e margens obscurecidas/indistintas. Inclui lesões que não se qualificam como 2, 4 ou 5. Achado indeterminado que requer correlação com DWI.',
    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-400'
  },
  {
    score: 4,
    label: 'Lenticular <1,5cm',
    shortLabel: '<1,5cm',
    description: 'Forma lenticular ou não circunscrita, homogênea, moderadamente hipointensa e <1,5 cm',
    detailedDescription: 'Lesão de forma lenticular (ou não circunscrita), hipointensidade moderada homogênea, confinada à próstata, com dimensão máxima <1,5 cm. Aspecto característico de carcinoma "apagado" ou PIRAD indeterminado.',
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-400'
  },
  {
    score: 5,
    label: 'Lenticular ≥1,5cm ou EPE',
    shortLabel: '≥1,5cm/EPE',
    description: 'Igual ao score 4, porém ≥1,5 cm ou com extensão extraprostática/invasiva definida',
    detailedDescription: 'Lesão com as mesmas características do score 4, porém com dimensão máxima ≥1,5 cm na maior dimensão, OU apresentando sinais definitivos de extensão extraprostática ou comportamento invasivo.',
    color: 'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-400'
  }
]

// DWI/ADC Scoring (universal for all zones)
export const dwiAtlas: PIRADSAtlasOption[] = [
  {
    score: 1,
    label: 'Normal',
    shortLabel: 'Normal',
    description: 'Sem anormalidade na DWI ou na imagem de alto valor b',
    detailedDescription: 'ADC e imagens de alto valor b normais. Sem áreas focais de restrição à difusão. Sinal homogêneo compatível com tecido glandular normal.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 2,
    label: 'Linear/Cunha',
    shortLabel: 'Linear',
    description: 'Hipointensidade linear/cunha no ADC e/ou hiperintensidade linear/cunha no alto b',
    detailedDescription: 'Padrão linear ou em forma de cunha de hipossinal no mapa ADC e/ou hipersinal na imagem de alto valor b. Aspecto típico de alterações inflamatórias, prostatite ou fibrose.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 3,
    label: 'Focal Discreto',
    shortLabel: 'Focal',
    description: 'Lesão focal (discreta) hipointensa no ADC e/ou hiperintensa focal no alto b',
    detailedDescription: 'Lesão focal discreta, diferente do tecido circundante. Pode ser marcadamente hipointensa no ADC OU marcadamente hiperintensa no alto valor b, mas NÃO ambos simultaneamente. Achado equívoco.',
    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-400'
  },
  {
    score: 4,
    label: 'Marcado <1,5cm',
    shortLabel: 'Marc.<1,5',
    description: 'Lesão focal marcadamente hipointensa no ADC E marcadamente hiperintensa no alto b; <1,5 cm',
    detailedDescription: 'Lesão focal com restrição marcada: marcadamente hipointensa no mapa ADC E marcadamente hiperintensa na imagem de alto valor b. Dimensão máxima <1,5 cm. Alta suspeita para malignidade.',
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-400'
  },
  {
    score: 5,
    label: 'Marcado ≥1,5cm ou EPE',
    shortLabel: 'Marc.≥1,5',
    description: 'Igual ao score 4, porém ≥1,5 cm ou com extensão extraprostática/invasiva',
    detailedDescription: 'Lesão focal com restrição marcada (como score 4), porém com dimensão ≥1,5 cm na maior dimensão OU com sinais definitivos de extensão extraprostática ou comportamento invasivo.',
    color: 'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-400'
  }
]

// DCE Assessment
export const dceAtlas: PIRADSAtlasOption[] = [
  {
    score: 0,
    label: 'Negativo (-)',
    shortLabel: 'DCE (−)',
    description: 'Sem realce precoce ou simultâneo, ou realce difuso multifocal, ou realce de HPB',
    detailedDescription: 'DCE negativo: (1) Sem realce precoce ou simultâneo ao tecido prostático normal adjacente; (2) Realce difuso multifocal NÃO correspondendo a achado focal em T2W/DWI; (3) Realce focal correspondendo a lesão com características de HPB em T2W (incluindo HPB "extrudida" para PZ).',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 1,
    label: 'Positivo (+)',
    shortLabel: 'DCE (+)',
    description: 'Realce focal, precoce/contemporâneo, correspondendo a achado suspeito em T2W/DWI',
    detailedDescription: 'DCE positivo: Realce FOCAL que é mais precoce ou contemporâneo ao realce do tecido prostático normal adjacente, E que corresponde a um achado suspeito identificado em T2W e/ou DWI. Aumenta suspeita de malignidade.',
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-400'
  }
]

// PI-RADS Category Interpretation
export const piradsInterpretation: PIRADSAtlasOption[] = [
  {
    score: 1,
    label: 'PI-RADS 1 - Muito Baixo',
    shortLabel: 'PI-RADS 1',
    description: 'Muito baixa probabilidade de câncer clinicamente significativo (~2%)',
    detailedDescription: 'Improvável que haja câncer clinicamente significativo presente. As imagens podem mostrar alterações que são geralmente consideradas não suspeitas.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 2,
    label: 'PI-RADS 2 - Baixo',
    shortLabel: 'PI-RADS 2',
    description: 'Baixa probabilidade de câncer clinicamente significativo (~4%)',
    detailedDescription: 'Improvável que haja câncer clinicamente significativo presente. As imagens podem mostrar alterações que são geralmente consideradas não suspeitas.',
    color: 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
  },
  {
    score: 3,
    label: 'PI-RADS 3 - Intermediário',
    shortLabel: 'PI-RADS 3',
    description: 'Presença de câncer clinicamente significativo é incerta (~20%)',
    detailedDescription: 'A presença de câncer clinicamente significativo é incerta. As imagens apresentam achados que não permitem uma distinção clara entre benignidade e malignidade. Sugere-se, a critério clínico, correlação com estudo anatomopatológico.',
    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-400'
  },
  {
    score: 4,
    label: 'PI-RADS 4 - Alto',
    shortLabel: 'PI-RADS 4',
    description: 'Alta probabilidade de câncer clinicamente significativo (~52%)',
    detailedDescription: 'É provável que haja câncer clinicamente significativo presente. As imagens mostram achados que são suspeitos de malignidade. Sugere-se, a critério clínico, correlação com estudo anatomopatológico.',
    color: 'bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-400'
  },
  {
    score: 5,
    label: 'PI-RADS 5 - Muito Alto',
    shortLabel: 'PI-RADS 5',
    description: 'Muito alta probabilidade de câncer clinicamente significativo (~89%)',
    detailedDescription: 'É altamente provável que haja câncer clinicamente significativo presente. As imagens apresentam achados que são altamente suspeitos de malignidade. Sugere-se, a critério clínico, correlação com estudo anatomopatológico.',
    color: 'bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-400'
  }
]

// Scoring algorithm explanation
export const scoringAlgorithm = {
  pz: {
    title: 'Zona Periférica (PZ)',
    dominant: 'DWI',
    description: 'Na zona periférica, o DWI é a sequência DOMINANTE. O score T2W é secundário.',
    rules: [
      'DWI score 1-2 → PI-RADS = DWI score',
      'DWI score 3 + DCE(−) → PI-RADS 3',
      'DWI score 3 + DCE(+) → PI-RADS 4 (upgrade)',
      'DWI score 4-5 → PI-RADS = DWI score'
    ]
  },
  tz: {
    title: 'Zona de Transição (TZ)',
    dominant: 'T2W',
    description: 'Na zona de transição, o T2W é a sequência DOMINANTE. O score DWI modifica.',
    rules: [
      'T2W score 1-2 → PI-RADS = T2W score',
      'T2W score 3 + DWI ≤3 → PI-RADS 3',
      'T2W score 3 + DWI ≥4 → PI-RADS 4 (upgrade)',
      'T2W score 4-5 → PI-RADS = T2W score'
    ]
  },
  afms: {
    title: 'Estroma Fibromuscular Anterior (AFMS)',
    dominant: 'Avaliação combinada',
    description: 'O AFMS é avaliado comparando com músculos pélvicos. Normalmente: T2W hipointenso simétrico, sem restrição DWI, sem realce DCE.',
    rules: [
      'AFMS normal: simétrico, hipointenso em T2W similar aos músculos',
      'Lesão suspeita: aumento assimétrico ou massa focal',
      'Sinais de malignidade: hipersinal T2W (vs músculo), restrição DWI, realce DCE'
    ]
  }
}
