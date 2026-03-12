import { computed, type Ref } from 'vue'
import type { Investment } from '@domain/models/Investment'
import type { FiscalRegime } from '@domain/models/FiscalRegime'
import type { HistoricalPrice, PerformanceResult } from '@domain/models/PerformanceResult'
import { computePerformance } from '@app/usecases/ComputePerformance'
import { sharpeRatio } from '@domain/calculations/sharpeRatio'
import { maxDrawdown } from '@domain/calculations/drawdown'
import { realReturn } from '@domain/calculations/inflationAdjusted'
import { DEFAULT_RISK_FREE_RATE } from '@shared/constants'

/**
 * Composable — Bridge réactif vers les calculs du domaine
 *
 * Prend des données réactives en entrée, produit des résultats réactifs.
 */
export function useCalculations(
  investments: Ref<readonly Investment[]>,
  priceHistories: Ref<Map<string, HistoricalPrice[]>>,
  fiscalRegime: Ref<FiscalRegime>,
  inflationRate: Ref<number>
) {
  const results = computed<PerformanceResult[]>(() => {
    const out: PerformanceResult[] = []
    for (const inv of investments.value) {
      const prices = priceHistories.value.get(inv.id)
      if (!prices || prices.length < 2) continue
      try {
        out.push(computePerformance(inv, prices, fiscalRegime.value))
      } catch {
        // Skip investments with invalid data
      }
    }
    return out
  })

  const enrichedResults = computed(() =>
    results.value.map((r) => {
      const sharpe = sharpeRatio(r.cagr, DEFAULT_RISK_FREE_RATE, r.priceHistory)
      const mdd = maxDrawdown(r.priceHistory)
      const realRet = realReturn(r.netNetReturnPercent, inflationRate.value)
      return { ...r, sharpe, maxDrawdown: mdd, realReturn: realRet }
    })
  )

  const bestPerformer = computed(() => {
    if (enrichedResults.value.length === 0) return null
    return enrichedResults.value.reduce((best, curr) =>
      curr.netNetReturnPercent > best.netNetReturnPercent ? curr : best
    )
  })

  return {
    results,
    enrichedResults,
    bestPerformer,
  }
}
