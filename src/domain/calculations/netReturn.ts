/**
 * Rendement net (après frais, avant impôts)
 *
 * Le rendement net déduit les frais réels de l'investisseur :
 * - Frais de courtage (à l'achat et à la vente)
 * - Frais de gestion annuels (prélevés sur l'encours)
 *
 * Formule :
 *   Frais_courtage = montant × taux_courtage × 2 (aller-retour)
 *   Frais_gestion  = montant × taux_gestion_annuel × nombre_années
 *   V_net = V_brut - Frais_courtage - Frais_gestion
 *   R_net = (V_net - montant_investi) / montant_investi
 *
 * Hypothèse simplificatrice : les frais de gestion sont calculés
 * sur le montant initial (pas sur la valeur fluctuante).
 * En réalité, ils sont prélevés quotidiennement sur la VL.
 * Cette simplification sous-estime légèrement les frais en cas de hausse.
 */

export interface NetReturnInput {
  /** Montant investi en € */
  amountInvested: number
  /** Valeur brute finale (après performance du marché) */
  grossValue: number
  /** Frais de courtage en décimal (0.005 = 0.5%) */
  brokerFeeRate: number
  /** Frais de gestion annuels en décimal (0.002 = 0.2%) */
  managementFeeRate: number
  /** Durée de détention en années */
  holdingYears: number
}

export interface NetReturnResult {
  /** Frais de courtage totaux (aller + retour) */
  brokerFeesAmount: number
  /** Frais de gestion cumulés */
  managementFeesAmount: number
  /** Total des frais */
  totalFees: number
  /** Valeur nette finale */
  netValue: number
  /** Rendement net en décimal */
  netReturnPercent: number
}

export function computeNetReturn(input: NetReturnInput): NetReturnResult {
  // Courtage aller-retour : on paie à l'achat ET à la vente
  const brokerFeesAmount = input.amountInvested * input.brokerFeeRate * 2

  // Gestion annuelle × nombre d'années
  const managementFeesAmount =
    input.amountInvested * input.managementFeeRate * input.holdingYears

  const totalFees = brokerFeesAmount + managementFeesAmount
  const netValue = input.grossValue - totalFees
  const netReturnPercent = (netValue - input.amountInvested) / input.amountInvested

  return {
    brokerFeesAmount,
    managementFeesAmount,
    totalFees,
    netValue,
    netReturnPercent,
  }
}
