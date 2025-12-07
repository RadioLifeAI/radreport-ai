// Obstetric calculations for fetal ultrasound reports
// Based on Hadlock formulas (Radiology 1984, 1985)

/**
 * Calculate gestational age from LMP (DUM - Data da Última Menstruação)
 * @param dumDate - Date of last menstrual period
 * @param referenceDate - Date to calculate IG for (defaults to today)
 * @returns weeks and days
 */
export function calculateIGFromDUM(dumDate: Date, referenceDate?: Date): { weeks: number; days: number } {
  const refDate = referenceDate || new Date()
  const diffMs = refDate.getTime() - dumDate.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (totalDays < 0) {
    return { weeks: 0, days: 0 }
  }
  
  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7
  }
}

/**
 * Calculate probable LMP date from ultrasound data
 * @param usgDate - Date of ultrasound exam
 * @param igWeeks - Gestational age at exam (weeks)
 * @param igDays - Gestational age at exam (days)
 * @returns Calculated LMP date
 */
export function calculateDUMFromUSG(usgDate: Date, igWeeks: number, igDays: number): Date {
  const totalDaysAtUSG = (igWeeks * 7) + igDays
  const dumMs = usgDate.getTime() - (totalDaysAtUSG * 24 * 60 * 60 * 1000)
  return new Date(dumMs)
}

/**
 * Calculate Estimated Due Date (DPP - Data Provável do Parto)
 * Using Naegele's rule: LMP + 280 days
 * @param dumDate - Last menstrual period date
 * @returns Expected due date
 */
export function calculateDPP(dumDate: Date): Date {
  const dppMs = dumDate.getTime() + (280 * 24 * 60 * 60 * 1000)
  return new Date(dppMs)
}

/**
 * Estimate gestational age from BPD (Biparietal Diameter) using Hadlock formula
 * Hadlock 1982: GA = 9.54 + 1.482*BPD + 0.1676*BPD²
 * @param bpdCm - BPD in centimeters
 * @returns Gestational age in weeks (decimal)
 */
export function estimateIGFromBPD(bpdCm: number): number {
  if (bpdCm <= 0) return 0
  // Convert to cm for formula
  return 9.54 + 1.482 * bpdCm + 0.1676 * Math.pow(bpdCm, 2)
}

/**
 * Estimate gestational age from FL (Femur Length) using Hadlock formula
 * Hadlock 1984: GA = 10.35 + 2.460*FL + 0.170*FL²
 * @param flCm - Femur length in centimeters
 * @returns Gestational age in weeks (decimal)
 */
export function estimateIGFromFL(flCm: number): number {
  if (flCm <= 0) return 0
  return 10.35 + 2.460 * flCm + 0.170 * Math.pow(flCm, 2)
}

/**
 * Estimate gestational age from HC (Head Circumference) using Hadlock formula
 * Hadlock 1984: GA = 8.96 + 0.540*HC + 0.0003*HC³
 * @param hcCm - Head circumference in centimeters
 * @returns Gestational age in weeks (decimal)
 */
export function estimateIGFromHC(hcCm: number): number {
  if (hcCm <= 0) return 0
  return 8.96 + 0.540 * hcCm + 0.0003 * Math.pow(hcCm, 3)
}

/**
 * Estimate average gestational age from fetal biometry
 * Uses weighted average of BPD and FL (most reliable parameters)
 * @param dbpCm - BPD in cm
 * @param ccCm - HC in cm (not used in average but included for completeness)
 * @param caCm - AC in cm (not used in average but included for completeness)
 * @param cfCm - FL in cm
 * @returns weeks and days
 */
export function estimateIGFromBiometry(
  dbpCm: number, 
  ccCm: number, 
  caCm: number, 
  cfCm: number
): { weeks: number; days: number; totalDays: number } {
  // Use average of BPD and FL (most commonly used in clinical practice)
  const estimates: number[] = []
  
  if (dbpCm > 0) {
    estimates.push(estimateIGFromBPD(dbpCm))
  }
  if (cfCm > 0) {
    estimates.push(estimateIGFromFL(cfCm))
  }
  // Optionally include HC if both DBP and FL are missing
  if (estimates.length === 0 && ccCm > 0) {
    estimates.push(estimateIGFromHC(ccCm))
  }
  
  if (estimates.length === 0) {
    return { weeks: 0, days: 0, totalDays: 0 }
  }
  
  // Average of available estimates
  const avgWeeks = estimates.reduce((a, b) => a + b, 0) / estimates.length
  
  const weeks = Math.floor(avgWeeks)
  const days = Math.round((avgWeeks - weeks) * 7)
  const totalDays = Math.round(avgWeeks * 7)
  
  // Ensure days doesn't exceed 6
  return { 
    weeks: days > 6 ? weeks + 1 : weeks, 
    days: days > 6 ? 0 : days,
    totalDays
  }
}

/**
 * Estimate fetal weight using Hadlock II formula (most commonly used)
 * Log10(EFW) = 1.335 - 0.0034(AC)(FL) + 0.0316(BPD) + 0.0457(AC) + 0.1623(FL)
 * All measurements in cm, weight in grams
 * @param dbpCm - BPD in cm
 * @param ccCm - HC in cm (not used in Hadlock II)
 * @param caCm - AC in cm
 * @param cfCm - FL in cm
 * @returns Estimated fetal weight in grams
 */
export function estimateFetalWeight(
  dbpCm: number, 
  ccCm: number, 
  caCm: number, 
  cfCm: number
): number {
  // Validate all required measurements are positive
  if (dbpCm <= 0 || caCm <= 0 || cfCm <= 0) {
    return 0
  }
  
  // Hadlock II formula
  const logWeight = 1.335 
    - 0.0034 * caCm * cfCm 
    + 0.0316 * dbpCm 
    + 0.0457 * caCm 
    + 0.1623 * cfCm
  
  const weight = Math.pow(10, logWeight)
  
  // Return weight rounded to nearest gram, minimum 50g for validity
  return weight > 50 ? Math.round(weight) : 0
}

/**
 * Calculate fetal weight percentile based on gestational age
 * Uses simplified Hadlock 1991 reference values
 * @param weightGrams - Estimated fetal weight
 * @param gestationalWeeks - Gestational age in weeks
 * @returns Percentile (1-99) or null if invalid
 */
export function estimateWeightPercentile(
  weightGrams: number, 
  gestationalWeeks: number
): number | null {
  if (weightGrams <= 0 || gestationalWeeks < 20 || gestationalWeeks > 42) {
    return null
  }
  
  // Simplified 50th percentile reference (Hadlock)
  // These are approximate median weights for gestational age
  const referenceWeights: Record<number, { p10: number; p50: number; p90: number }> = {
    20: { p10: 249, p50: 300, p90: 366 },
    22: { p10: 375, p50: 460, p90: 560 },
    24: { p10: 530, p50: 660, p90: 800 },
    26: { p10: 715, p50: 900, p90: 1100 },
    28: { p10: 930, p50: 1180, p90: 1450 },
    30: { p10: 1180, p50: 1500, p90: 1850 },
    32: { p10: 1460, p50: 1880, p90: 2320 },
    34: { p10: 1790, p50: 2300, p90: 2850 },
    36: { p10: 2150, p50: 2750, p90: 3400 },
    38: { p10: 2550, p50: 3200, p90: 3900 },
    40: { p10: 2850, p50: 3500, p90: 4200 },
    42: { p10: 3000, p50: 3600, p90: 4300 }
  }
  
  // Round to nearest even week
  const weekRef = Math.round(gestationalWeeks / 2) * 2
  const ref = referenceWeights[Math.min(42, Math.max(20, weekRef))]
  
  if (!ref) return 50 // Default to 50th percentile if no reference
  
  // Estimate percentile based on reference values
  if (weightGrams <= ref.p10) return Math.max(1, Math.round((weightGrams / ref.p10) * 10))
  if (weightGrams >= ref.p90) return Math.min(99, 90 + Math.round(((weightGrams - ref.p90) / ref.p90) * 9))
  
  // Linear interpolation between p10-p50 or p50-p90
  if (weightGrams < ref.p50) {
    return 10 + Math.round(((weightGrams - ref.p10) / (ref.p50 - ref.p10)) * 40)
  } else {
    return 50 + Math.round(((weightGrams - ref.p50) / (ref.p90 - ref.p50)) * 40)
  }
}

/**
 * Determine trimester based on gestational age
 * @param weeks - Gestational age in weeks
 * @returns Trimester description
 */
export function getTrimester(weeks: number): string {
  if (weeks < 14) return '1º trimestre'
  if (weeks < 28) return '2º trimestre'
  return '3º trimestre'
}

/**
 * Determine term status based on gestational age
 * @param weeks - Gestational age in weeks
 * @returns Term status description
 */
export function getTermStatus(weeks: number): string {
  if (weeks < 37) return 'pré-termo'
  if (weeks <= 41) return 'a termo'
  return 'pós-termo'
}

/**
 * Format date in Brazilian format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateBR(date: Date): string {
  return date.toLocaleDateString('pt-BR')
}

/**
 * Parse Brazilian date format (DD/MM/YYYY) to Date object
 * @param dateStr - Date string in DD/MM/YYYY format
 * @returns Date object or null if invalid
 */
export function parseDateBR(dateStr: string): Date | null {
  if (!dateStr) return null
  
  // Try DD/MM/YYYY format
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // JS months are 0-indexed
    const year = parseInt(parts[2], 10)
    const date = new Date(year, month, day)
    if (!isNaN(date.getTime())) return date
  }
  
  // Try ISO format fallback
  const isoDate = new Date(dateStr)
  if (!isNaN(isoDate.getTime())) return isoDate
  
  return null
}
