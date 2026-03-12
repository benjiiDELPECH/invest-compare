/**
 * Registre de formules — Volet pédagogique
 *
 * Chaque formule utilisée dans l'application est documentée ici
 * avec son expression KaTeX, son explication en français, et un exemple.
 */
export interface FormulaEntry {
  readonly id: string
  readonly name: string
  readonly latex: string
  readonly explanation: string
  readonly example: string
  readonly caveats?: string
}

export const FORMULAS: readonly FormulaEntry[] = [
  {
    id: 'gross-return',
    name: 'Rendement brut',
    latex: 'R_{brut} = \\frac{V_{final} - V_{initial}}{V_{initial}}',
    explanation:
      'Le rendement brut mesure la variation pure du prix, sans aucune déduction. C\'est le point de départ de toute analyse, mais jamais la conclusion : il ignore les frais, les impôts et l\'inflation.',
    example:
      'Achat à 100€, vente à 150€ → R = (150 − 100) / 100 = +50%',
  },
  {
    id: 'cagr',
    name: 'CAGR — Taux de Croissance Annuel Composé',
    latex: 'CAGR = \\left(\\frac{V_{final}}{V_{initial}}\\right)^{\\frac{1}{n}} - 1',
    explanation:
      'Le CAGR lisse la performance sur la durée. Il donne le taux constant qui, appliqué chaque année avec intérêts composés, aurait transformé la valeur initiale en valeur finale.',
    example:
      '10 000€ → 16 105€ en 5 ans → CAGR = (16105/10000)^(1/5) − 1 = 10%/an',
    caveats:
      'Le CAGR masque la volatilité. Deux investissements avec le même CAGR peuvent avoir des parcours radicalement différents.',
  },
  {
    id: 'net-return',
    name: 'Rendement net (après frais)',
    latex: 'R_{net} = \\frac{V_{brut} - F_{courtage} - F_{gestion}}{V_{initial}} - 1',
    explanation:
      'Le rendement net déduit les frais de courtage (aller-retour) et les frais de gestion annuels. C\'est ce qui reste avant l\'impôt.',
    example:
      'V_brut = 15 000€, courtage = 100€, gestion = 200€ → V_net = 14 700€',
  },
  {
    id: 'net-net-pfu',
    name: 'Net-Net — PFU (Flat Tax 30%)',
    latex: 'R_{nn} = R_{net} - \\max(0, PV_{nette}) \\times 0.30',
    explanation:
      'Le PFU (Prélèvement Forfaitaire Unique) taxe les plus-values à 30% : 12.8% d\'impôt sur le revenu + 17.2% de prélèvements sociaux. Simple et automatique depuis 2018.',
    example:
      'Plus-value nette de 4 700€ → Impôt = 4 700 × 0.30 = 1 410€',
  },
  {
    id: 'net-net-bareme',
    name: 'Net-Net — Barème progressif',
    latex: 'R_{nn} = R_{net} - \\max(0, PV_{nette}) \\times (TMI + 0.172)',
    explanation:
      'Le barème progressif applique votre TMI (Taux Marginal d\'Imposition) au lieu du taux forfaitaire de 12.8%. Les prélèvements sociaux (17.2%) s\'ajoutent toujours. Avantageux si votre TMI est inférieur à 12.8% (tranches 0% ou 11%).',
    example:
      'TMI 11% + PS 17.2% = 28.2% → Impôt = 4 700 × 0.282 = 1 325.40€',
  },
  {
    id: 'real-return',
    name: 'Rendement réel (ajusté de l\'inflation)',
    latex: 'R_{réel} = \\frac{1 + R_{nominal}}{1 + \\pi} - 1',
    explanation:
      'La formule de Fisher donne le rendement réel exact, ajusté de l\'érosion du pouvoir d\'achat. L\'approximation courante (R − π) sous-estime l\'impact pour des taux élevés.',
    example:
      'Nominal 8%, inflation 3% → Réel = 1.08/1.03 − 1 = 4.85% (pas 5%)',
  },
  {
    id: 'sharpe-ratio',
    name: 'Ratio de Sharpe',
    latex: 'S = \\frac{R_p - R_f}{\\sigma_p}',
    explanation:
      'Le ratio de Sharpe mesure le rendement excédentaire (au-dessus du taux sans risque) par unité de volatilité. Plus il est élevé, meilleur est le rapport rendement/risque.',
    example:
      'Rendement 12%, taux sans risque 3%, volatilité 15% → Sharpe = (12−3)/15 = 0.60',
    caveats:
      'Le Sharpe suppose des rendements normalement distribués, ce qui est rarement exact. Il pénalise la volatilité haussière autant que baissière.',
  },
  {
    id: 'max-drawdown',
    name: 'Maximum Drawdown',
    latex: 'MDD = \\min_t \\frac{P_t - \\max_{s \\leq t} P_s}{\\max_{s \\leq t} P_s}',
    explanation:
      'Le drawdown maximal mesure la pire chute entre un pic et un creux. Un drawdown de −50% nécessite un gain de +100% pour revenir à l\'équilibre. Les pertes sont asymétriques.',
    example:
      'Pic à 120€, creux à 80€ → MDD = (80 − 120) / 120 = −33.3%',
  },
  {
    id: 'volatility',
    name: 'Volatilité annualisée',
    latex: '\\sigma_{annuel} = \\sigma_{quotidien} \\times \\sqrt{252}',
    explanation:
      'La volatilité mesure la dispersion des rendements quotidiens, annualisée par √252 (nombre de jours de bourse par an). Plus elle est élevée, plus l\'investissement est "agité".',
    example:
      'Écart-type quotidien de 1.2% → Volatilité annuelle = 1.2% × √252 ≈ 19%',
  },
]

export function getFormulaById(id: string): FormulaEntry | undefined {
  return FORMULAS.find((f) => f.id === id)
}
