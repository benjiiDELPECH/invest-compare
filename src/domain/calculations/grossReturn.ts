/**
 * Rendement brut (Gross Return)
 *
 * La mesure la plus simple de la performance d'un investissement :
 * combien a varié le prix entre l'achat et la vente, en pourcentage.
 *
 * Formule :
 *   R_brut = (V_final - V_initial) / V_initial
 *
 * Exemple :
 *   Achat à 100€, vente à 150€ → (150 - 100) / 100 = 0.50 = +50%
 *
 * ⚠️ Cette mesure ne tient compte ni des frais, ni de la fiscalité,
 * ni de l'inflation. C'est un point de départ, pas une conclusion.
 */
export function grossReturn(entryPrice: number, exitPrice: number): number {
  if (entryPrice <= 0) {
    throw new Error('Le prix d\'entrée doit être strictement positif.')
  }
  return (exitPrice - entryPrice) / entryPrice
}

/**
 * Valeur brute finale d'un investissement.
 *
 * Formule :
 *   V_brut = montant_investi × (1 + R_brut)
 */
export function grossValue(amountInvested: number, entryPrice: number, exitPrice: number): number {
  return amountInvested * (1 + grossReturn(entryPrice, exitPrice))
}
