import type { Investment } from './Investment'
import type { FiscalRegime } from './FiscalRegime'

/**
 * ComparisonSession — Aggregate Root
 *
 * Une session de comparaison regroupe N investissements,
 * un benchmark de référence et un régime fiscal.
 */
export interface ComparisonSession {
  readonly id: string
  readonly name: string
  readonly createdAt: string // ISO 8601
  readonly updatedAt: string // ISO 8601
  readonly investments: readonly Investment[]
  /** Ticker du benchmark (ex: "SPY", "GLD", "IWDA.AS") */
  readonly benchmarkTicker: string
  readonly fiscalRegime: FiscalRegime
  /** Taux d'inflation annuel moyen hypothétique (ex: 0.02 = 2%) */
  readonly inflationRate: number
}

export function createSession(
  partial: Partial<ComparisonSession> = {}
): ComparisonSession {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? crypto.randomUUID(),
    name: partial.name ?? `Comparaison du ${new Date().toLocaleDateString('fr-FR')}`,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
    investments: partial.investments ?? [],
    benchmarkTicker: partial.benchmarkTicker ?? 'SPY',
    fiscalRegime: partial.fiscalRegime ?? { type: 'PFU', tmi: 0 },
    inflationRate: partial.inflationRate ?? 0.02,
  }
}

export function addInvestmentToSession(
  session: ComparisonSession,
  investment: Investment
): ComparisonSession {
  return {
    ...session,
    investments: [...session.investments, investment],
    updatedAt: new Date().toISOString(),
  }
}

export function removeInvestmentFromSession(
  session: ComparisonSession,
  investmentId: string
): ComparisonSession {
  return {
    ...session,
    investments: session.investments.filter((i) => i.id !== investmentId),
    updatedAt: new Date().toISOString(),
  }
}

export function updateInvestmentInSession(
  session: ComparisonSession,
  investmentId: string,
  updates: Partial<Investment>
): ComparisonSession {
  return {
    ...session,
    investments: session.investments.map((i) =>
      i.id === investmentId ? { ...i, ...updates } : i
    ),
    updatedAt: new Date().toISOString(),
  }
}
