/**
 * Maximum Drawdown
 *
 * Le drawdown mesure la pire perte subie entre un pic et un creux.
 * C'est une mesure du risque psychologique : combien auriez-vous
 * vu fondre votre portefeuille au pire moment ?
 *
 * Formule :
 *   Pour chaque point t :
 *     pic_t = max(P_0, P_1, ..., P_t)
 *     drawdown_t = (P_t - pic_t) / pic_t
 *   Max Drawdown = min(drawdown_t) pour tout t
 *
 * Exemple :
 *   Prix : 100 → 120 → 80 → 110
 *   Pic à 120, creux à 80
 *   Drawdown = (80 - 120) / 120 = -33.3%
 *
 * Un drawdown de -50% nécessite un gain de +100% pour revenir à l'équilibre.
 * C'est pourquoi les pertes sont asymétriques et plus "chères" que les gains.
 */
import type { HistoricalPrice } from '@domain/models/PerformanceResult'

export interface DrawdownPoint {
  date: string
  drawdownPercent: number
}

export function drawdownSeries(prices: readonly HistoricalPrice[]): DrawdownPoint[] {
  if (prices.length === 0) return []

  let peak = prices[0]!.close
  const series: DrawdownPoint[] = []

  for (const price of prices) {
    if (price.close > peak) {
      peak = price.close
    }
    const dd = peak > 0 ? (price.close - peak) / peak : 0
    series.push({ date: price.date, drawdownPercent: dd })
  }

  return series
}

export function maxDrawdown(prices: readonly HistoricalPrice[]): number {
  const series = drawdownSeries(prices)
  if (series.length === 0) return 0
  return Math.min(...series.map((p) => p.drawdownPercent))
}
