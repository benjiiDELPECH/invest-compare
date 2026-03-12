import type { Investment } from '@domain/models/Investment'
import { investmentHoldingYears } from '@domain/models/Investment'
import type { FiscalRegime } from '@domain/models/FiscalRegime'
import type { HistoricalPrice, PerformanceResult } from '@domain/models/PerformanceResult'
import { grossReturn, grossValue } from '@domain/calculations/grossReturn'
import { computeNetReturn } from '@domain/calculations/netReturn'
import { computeNetNetReturn } from '@domain/calculations/netNetReturn'
import { cagr } from '@domain/calculations/cagr'

/**
 * Use Case — Calcul complet de la performance d'un investissement
 *
 * Orchestre tous les calculs du domaine pour produire un PerformanceResult.
 * Fonction pure : données en entrée → résultat en sortie.
 */
export function computePerformance(
  investment: Investment,
  priceHistory: readonly HistoricalPrice[],
  fiscalRegime: FiscalRegime
): PerformanceResult {
  if (priceHistory.length < 2) {
    throw new Error('Il faut au moins 2 points de prix pour calculer la performance.')
  }

  const entryPrice = priceHistory[0]!.close
  const exitPrice = priceHistory[priceHistory.length - 1]!.close
  const years = investmentHoldingYears(investment)
  const unitsBought = investment.amountInvested / entryPrice

  // 1. Brut
  const grossRet = grossReturn(entryPrice, exitPrice)
  const grossVal = grossValue(investment.amountInvested, entryPrice, exitPrice)

  // 2. Net (après frais)
  const netResult = computeNetReturn({
    amountInvested: investment.amountInvested,
    grossValue: grossVal,
    brokerFeeRate: investment.brokerFeePercent / 100,
    managementFeeRate: investment.managementFeePercent / 100,
    holdingYears: years,
  })

  // 3. Net-Net (après impôts)
  const netNetResult = computeNetNetReturn({
    amountInvested: investment.amountInvested,
    netValue: netResult.netValue,
    fiscalRegime,
  })

  // 4. CAGR sur le net-net
  const cagrValue = years > 0
    ? cagr(investment.amountInvested, netNetResult.netNetValue, years)
    : 0

  return {
    investmentId: investment.id,
    entryPrice,
    exitPrice,
    unitsBought,
    grossValue: grossVal,
    grossReturnPercent: grossRet,
    brokerFeesAmount: netResult.brokerFeesAmount,
    managementFeesAmount: netResult.managementFeesAmount,
    netValue: netResult.netValue,
    netReturnPercent: netResult.netReturnPercent,
    taxableGain: netNetResult.taxableGain,
    taxAmount: netNetResult.taxAmount,
    netNetValue: netNetResult.netNetValue,
    netNetReturnPercent: netNetResult.netNetReturnPercent,
    cagr: cagrValue,
    priceHistory,
  }
}
