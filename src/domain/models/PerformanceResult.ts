/**
 * PerformanceResult — Value Object
 *
 * Résultat complet du calcul de performance d'un investissement.
 * Chaque champ est accompagné de son explication.
 */
export interface PerformanceResult {
  /** Identifiant de l'investissement source */
  readonly investmentId: string

  /** Prix d'entrée (par unité) */
  readonly entryPrice: number
  /** Prix de sortie (par unité) */
  readonly exitPrice: number
  /** Nombre d'unités achetées */
  readonly unitsBought: number

  /** Valeur finale brute (avant frais et taxes) */
  readonly grossValue: number
  /** Rendement brut en % */
  readonly grossReturnPercent: number

  /** Montant des frais de courtage */
  readonly brokerFeesAmount: number
  /** Montant des frais de gestion cumulés */
  readonly managementFeesAmount: number
  /** Valeur nette (après frais, avant taxes) */
  readonly netValue: number
  /** Rendement net en % */
  readonly netReturnPercent: number

  /** Plus-value nette (base imposable) */
  readonly taxableGain: number
  /** Montant de l'impôt */
  readonly taxAmount: number
  /** Valeur net-net (après frais ET taxes) */
  readonly netNetValue: number
  /** Rendement net-net en % */
  readonly netNetReturnPercent: number

  /** CAGR — Taux de croissance annuel composé */
  readonly cagr: number

  /** Série de prix historiques pour les charts */
  readonly priceHistory: readonly HistoricalPrice[]
}

export interface HistoricalPrice {
  readonly date: string // ISO 8601
  readonly close: number
}
