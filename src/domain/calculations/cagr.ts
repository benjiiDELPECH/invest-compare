/**
 * CAGR — Compound Annual Growth Rate
 * Taux de Croissance Annuel Composé
 *
 * Le CAGR lisse la performance sur la période pour donner un taux
 * de croissance annuel constant qui aurait produit le même résultat.
 *
 * Formule :
 *   CAGR = (V_final / V_initial)^(1/n) - 1
 *
 * où n = nombre d'années (peut être fractionnaire).
 *
 * Exemple :
 *   10 000€ → 16 105€ en 5 ans
 *   CAGR = (16105/10000)^(1/5) - 1 = 0.10 = 10%/an
 *
 * Interprétation :
 *   "Si mon investissement avait crû de manière parfaitement régulière,
 *   il aurait progressé de X% chaque année."
 *
 * ⚠️ Le CAGR masque la volatilité. Deux investissements avec le même CAGR
 * peuvent avoir des parcours radicalement différents.
 */
export function cagr(
  initialValue: number,
  finalValue: number,
  years: number
): number {
  if (initialValue <= 0) {
    throw new Error('La valeur initiale doit être strictement positive.')
  }
  if (years <= 0) {
    throw new Error('La durée doit être strictement positive.')
  }
  return Math.pow(finalValue / initialValue, 1 / years) - 1
}
