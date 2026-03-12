/**
 * Ratio de Sharpe
 *
 * Mesure le rendement excédentaire par unité de risque.
 * Plus le Sharpe est élevé, meilleur est le rapport rendement/risque.
 *
 * Formule :
 *   S = (R_p - R_f) / σ_p
 *
 * où :
 *   R_p = rendement annualisé du portefeuille
 *   R_f = taux sans risque (ex: OAT 10 ans, ~3%)
 *   σ_p = écart-type annualisé des rendements
 *
 * Interprétation :
 *   S < 1    → Rendement insuffisant pour le risque pris
 *   1 ≤ S < 2 → Bon rapport rendement/risque
 *   S ≥ 2    → Excellent
 *   S ≥ 3    → Exceptionnel (rare sur longue période)
 *
 * Calcul de la volatilité :
 *   1. Calculer les rendements quotidiens : r_i = (P_i - P_{i-1}) / P_{i-1}
 *   2. Calculer l'écart-type des r_i
 *   3. Annualiser : σ_annuel = σ_quotidien × √252 (252 jours de bourse)
 */
import type { HistoricalPrice } from '@domain/models/PerformanceResult'

const TRADING_DAYS_PER_YEAR = 252

export function dailyReturns(prices: readonly HistoricalPrice[]): number[] {
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1]!.close
    const curr = prices[i]!.close
    if (prev > 0) {
      returns.push((curr - prev) / prev)
    }
  }
  return returns
}

export function standardDeviation(values: readonly number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const squaredDiffs = values.map((v) => (v - mean) ** 2)
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

export function annualizedVolatility(prices: readonly HistoricalPrice[]): number {
  const returns = dailyReturns(prices)
  return standardDeviation(returns) * Math.sqrt(TRADING_DAYS_PER_YEAR)
}

export function sharpeRatio(
  annualizedReturn: number,
  riskFreeRate: number,
  prices: readonly HistoricalPrice[]
): number {
  const vol = annualizedVolatility(prices)
  if (vol === 0) return 0
  return (annualizedReturn - riskFreeRate) / vol
}
