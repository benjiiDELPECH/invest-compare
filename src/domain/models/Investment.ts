/**
 * Investment — Value Object
 *
 * Représente un investissement unique : un ticker, un montant investi,
 * une période, et les frais associés.
 */
export interface Investment {
  /** Identifiant unique (UUID v4) */
  readonly id: string
  /** Symbole boursier (ex: AAPL, MSFT, GLD) */
  readonly ticker: string
  /** Nom lisible (ex: "Apple Inc.") */
  readonly label: string
  /** Montant investi en euros */
  readonly amountInvested: number
  /** Date d'entrée (achat) */
  readonly entryDate: string // ISO 8601: "2020-01-15"
  /** Date de sortie (vente / fin d'analyse) */
  readonly exitDate: string // ISO 8601: "2025-01-15"
  /** Frais de courtage en % (ex: 0.5 = 0.5%) */
  readonly brokerFeePercent: number
  /** Frais de gestion annuels en % (ex: 0.2 = 0.2%) */
  readonly managementFeePercent: number
}

export function createInvestment(
  partial: Partial<Investment> & Pick<Investment, 'ticker'>
): Investment {
  return {
    id: partial.id ?? crypto.randomUUID(),
    ticker: partial.ticker,
    label: partial.label ?? partial.ticker,
    amountInvested: partial.amountInvested ?? 10_000,
    entryDate: partial.entryDate ?? new Date().toISOString().slice(0, 10),
    exitDate: partial.exitDate ?? new Date().toISOString().slice(0, 10),
    brokerFeePercent: partial.brokerFeePercent ?? 0.5,
    managementFeePercent: partial.managementFeePercent ?? 0.2,
  }
}

export function investmentHoldingYears(inv: Investment): number {
  const entry = new Date(inv.entryDate)
  const exit = new Date(inv.exitDate)
  const diffMs = exit.getTime() - entry.getTime()
  return diffMs / (365.25 * 24 * 60 * 60 * 1000)
}
