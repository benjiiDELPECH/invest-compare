/**
 * Rendement réel ajusté de l'inflation
 *
 * L'inflation érode silencieusement le pouvoir d'achat.
 * Un rendement nominal de 8% avec 3% d'inflation donne
 * un rendement RÉEL d'environ 4.85%, pas 5%.
 *
 * Formule exacte (Fisher) :
 *   R_réel = (1 + R_nominal) / (1 + π) - 1
 *
 * Approximation courante (mais inexacte) :
 *   R_réel ≈ R_nominal - π
 *
 * On utilise la formule exacte de Fisher.
 *
 * Exemple :
 *   Rendement nominal : 8% (0.08)
 *   Inflation : 3% (0.03)
 *   R_réel = 1.08 / 1.03 - 1 = 0.04854 = 4.85%
 *   (et non 5% avec l'approximation)
 */
export function realReturn(nominalReturn: number, inflationRate: number): number {
  if (inflationRate <= -1) {
    throw new Error('Le taux d\'inflation doit être supérieur à -100%.')
  }
  return (1 + nominalReturn) / (1 + inflationRate) - 1
}

/**
 * Ajuste une valeur finale pour l'inflation sur une période.
 *
 * Formule :
 *   V_réelle = V_nominale / (1 + π)^n
 */
export function inflationAdjustedValue(
  nominalValue: number,
  inflationRate: number,
  years: number
): number {
  return nominalValue / Math.pow(1 + inflationRate, years)
}
