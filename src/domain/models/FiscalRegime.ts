/**
 * FiscalRegime — Value Object
 *
 * Modélise le régime fiscal français applicable aux plus-values mobilières.
 *
 * 🇫🇷 Deux options :
 *
 * 1. PFU (Prélèvement Forfaitaire Unique) — "Flat Tax"
 *    → 30% = IR 12.8% + PS 17.2%
 *    → Simple, appliqué par défaut depuis 2018.
 *
 * 2. Barème progressif de l'IR + Prélèvements Sociaux
 *    → TMI (Taux Marginal d'Imposition) variable : 0%, 11%, 30%, 41%, 45%
 *    → + PS 17.2% (fixe)
 *    → Permet l'abattement pour durée de détention sur titres acquis avant 2018.
 */

export type FiscalRegimeType = 'PFU' | 'BAREME'

export interface FiscalRegime {
  readonly type: FiscalRegimeType
  /**
   * Taux Marginal d'Imposition — uniquement pertinent pour BAREME.
   * Ignoré en mode PFU.
   */
  readonly tmi: number
}

/** Taux IR dans le PFU */
export const PFU_IR_RATE = 0.128

/** Prélèvements sociaux (identiques PFU et Barème) */
export const PRELEVEMENTS_SOCIAUX_RATE = 0.172

/** Taux total PFU = 30% */
export const PFU_TOTAL_RATE = PFU_IR_RATE + PRELEVEMENTS_SOCIAUX_RATE

/** Tranches TMI 2025 (barème progressif IR) */
export const TMI_BRACKETS = [
  { label: '0%', rate: 0 },
  { label: '11%', rate: 0.11 },
  { label: '30%', rate: 0.30 },
  { label: '41%', rate: 0.41 },
  { label: '45%', rate: 0.45 },
] as const

export function createPFU(): FiscalRegime {
  return { type: 'PFU', tmi: 0 }
}

export function createBareme(tmi: number): FiscalRegime {
  return { type: 'BAREME', tmi }
}

/**
 * Calcule le taux effectif d'imposition sur les plus-values.
 *
 * PFU : 30% flat
 * Barème : TMI + 17.2% PS
 */
export function effectiveTaxRate(regime: FiscalRegime): number {
  if (regime.type === 'PFU') {
    return PFU_TOTAL_RATE
  }
  return regime.tmi + PRELEVEMENTS_SOCIAUX_RATE
}
