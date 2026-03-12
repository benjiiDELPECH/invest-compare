import type { HistoricalPrice } from '@domain/models/PerformanceResult'

/**
 * Port — Source de données de marché
 *
 * Interface que doivent implémenter les adaptateurs (Alpha Vantage, Yahoo, etc.)
 * Le domaine ne connaît pas l'implémentation concrète.
 */
export interface MarketDataPort {
  /**
   * Récupère les prix historiques quotidiens d'un ticker sur une période.
   *
   * @param ticker - Symbole boursier (ex: "AAPL", "SPY", "GLD")
   * @param from - Date de début (ISO 8601)
   * @param to - Date de fin (ISO 8601)
   * @returns Liste de prix triés par date croissante
   */
  getHistoricalPrices(
    ticker: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]>

  /**
   * Vérifie que la source de données est disponible (clé API valide, etc.)
   */
  isAvailable(): Promise<boolean>
}
