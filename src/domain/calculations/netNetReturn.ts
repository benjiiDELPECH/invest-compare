/**
 * Rendement Net-Net (après frais ET après impôts)
 *
 * C'est le chiffre qui compte vraiment : ce qui reste dans votre poche.
 *
 * 🇫🇷 Fiscalité française des plus-values mobilières :
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Option 1 — PFU (Flat Tax) : 30%
 *   • IR : 12.8%
 *   • PS : 17.2% (CSG 9.2% + CRDS 0.5% + PS 7.5%)
 *   • Total : 30%
 *   • Simple, appliqué par défaut.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Option 2 — Barème progressif :
 *   • IR au TMI (0%, 11%, 30%, 41%, 45%)
 *   • PS : 17.2% (toujours)
 *   • Avantageux si TMI < 12.8% (tranche 0% ou 11%)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Formule :
 *   Plus-value nette = V_net - montant_investi  (si > 0, sinon pas d'impôt)
 *   Impôt = max(0, plus_value_nette) × taux_effectif
 *   V_net_net = V_net - Impôt
 *   R_net_net = (V_net_net - montant_investi) / montant_investi
 *
 * Note : En cas de moins-value, pas d'impôt. Les moins-values sont
 * reportables 10 ans (non modélisé ici pour simplifier).
 */

import { effectiveTaxRate, type FiscalRegime } from '@domain/models/FiscalRegime'

export interface NetNetReturnInput {
  amountInvested: number
  netValue: number
  fiscalRegime: FiscalRegime
}

export interface NetNetReturnResult {
  /** Plus-value nette (base imposable), 0 si perte */
  taxableGain: number
  /** Taux effectif appliqué */
  effectiveRate: number
  /** Montant d'impôt */
  taxAmount: number
  /** Valeur finale net-net */
  netNetValue: number
  /** Rendement net-net en décimal */
  netNetReturnPercent: number
}

export function computeNetNetReturn(input: NetNetReturnInput): NetNetReturnResult {
  const gain = input.netValue - input.amountInvested
  // On n'impose que les plus-values positives
  const taxableGain = Math.max(0, gain)
  const rate = effectiveTaxRate(input.fiscalRegime)
  const taxAmount = taxableGain * rate
  const netNetValue = input.netValue - taxAmount
  const netNetReturnPercent = (netNetValue - input.amountInvested) / input.amountInvested

  return {
    taxableGain,
    effectiveRate: rate,
    taxAmount,
    netNetValue,
    netNetReturnPercent,
  }
}
