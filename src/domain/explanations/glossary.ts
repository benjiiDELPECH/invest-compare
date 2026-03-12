/**
 * Glossaire — Définitions des termes financiers et fiscaux
 *
 * Chaque terme est expliqué de manière accessible,
 * sans jargon inutile.
 */
export interface GlossaryEntry {
  readonly term: string
  readonly definition: string
  readonly category: 'fiscal' | 'finance' | 'risque'
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    term: 'PFU',
    definition:
      'Prélèvement Forfaitaire Unique, dit « Flat Tax ». Taux unique de 30% sur les revenus du capital (plus-values, dividendes, intérêts). Introduit en 2018, appliqué par défaut sauf option pour le barème.',
    category: 'fiscal',
  },
  {
    term: 'TMI',
    definition:
      'Taux Marginal d\'Imposition. Le taux d\'impôt sur le revenu applicable à la dernière tranche de votre revenu. Plus vos revenus sont élevés, plus le TMI est haut (0%, 11%, 30%, 41%, 45%).',
    category: 'fiscal',
  },
  {
    term: 'PS (Prélèvements Sociaux)',
    definition:
      'Contributions sociales prélevées sur les revenus du capital : CSG (9.2%), CRDS (0.5%), prélèvement de solidarité (7.5%). Total : 17.2%. S\'ajoutent à l\'IR quelle que soit l\'option choisie.',
    category: 'fiscal',
  },
  {
    term: 'Plus-value',
    definition:
      'Gain réalisé lors de la vente d\'un titre. Plus-value = prix de vente − prix d\'achat − frais. Si négatif, c\'est une moins-value.',
    category: 'finance',
  },
  {
    term: 'CAGR',
    definition:
      'Compound Annual Growth Rate — Taux de Croissance Annuel Composé. Rendement annuel constant qui, appliqué avec intérêts composés, reproduit la performance totale sur la période.',
    category: 'finance',
  },
  {
    term: 'Ratio de Sharpe',
    definition:
      'Mesure du rendement excédentaire par unité de risque. Un Sharpe de 1 signifie que pour chaque unité de risque prise, vous gagnez 1 unité de rendement au-dessus du taux sans risque.',
    category: 'risque',
  },
  {
    term: 'Drawdown',
    definition:
      'Baisse maximale entre un pic et un creux. Mesure la pire perte temporaire subie. Un drawdown de −50% est psychologiquement et mathématiquement dévastateur : il faut +100% pour s\'en remettre.',
    category: 'risque',
  },
  {
    term: 'Volatilité',
    definition:
      'Mesure de la variabilité des rendements. Plus la volatilité est élevée, plus les prix fluctuent. Annualisée en multipliant la volatilité quotidienne par √252.',
    category: 'risque',
  },
  {
    term: 'Benchmark',
    definition:
      'Indice de référence contre lequel on compare la performance d\'un investissement. Le S&P 500 (SPY) est le benchmark le plus courant pour les actions.',
    category: 'finance',
  },
  {
    term: 'Taux sans risque',
    definition:
      'Rendement théorique d\'un placement sans aucun risque de perte. En pratique, on utilise le taux des obligations d\'État (OAT 10 ans pour la France, environ 3% en 2025).',
    category: 'finance',
  },
  {
    term: 'Intérêts composés',
    definition:
      'Les gains sont réinvestis et génèrent eux-mêmes des gains. Effet « boule de neige ». La différence entre intérêts simples et composés est colossale sur longue période.',
    category: 'finance',
  },
]
