import type { HistoricalPrice } from '@domain/models/PerformanceResult'
import type { MarketDataPort } from '@domain/ports/MarketDataPort'
import { MARKET_DATA_CACHE_TTL_MS } from '@shared/constants'
import type { MarketDataCacheEntry } from '@shared/types'
import { getDB } from '../storage/schema'

/**
 * Cache de données de marché
 *
 * Wraps un MarketDataPort et ajoute une couche de cache IndexedDB
 * avec un TTL de 24h. Réduit les appels API (crucial avec 25/jour).
 *
 * Stratégie :
 * 1. Vérifier le cache IndexedDB
 * 2. Si hit + TTL valide → retourner le cache
 * 3. Sinon → appeler l'adapter, stocker en cache, retourner
 */
export class MarketDataCache implements MarketDataPort {
  constructor(private readonly inner: MarketDataPort) {}

  async getHistoricalPrices(
    ticker: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]> {
    const cacheKey = `${ticker}:${from}:${to}`

    // 1. Check cache
    const cached = await this.getCached(cacheKey)
    if (cached) return cached

    // 2. Fetch from upstream
    const prices = await this.inner.getHistoricalPrices(ticker, from, to)

    // 3. Store in cache
    await this.setCached(cacheKey, prices)

    return prices
  }

  async isAvailable(): Promise<boolean> {
    return this.inner.isAvailable()
  }

  private async getCached(key: string): Promise<HistoricalPrice[] | null> {
    try {
      const db = await getDB()
      const entry = await db.get('market-cache', key)
      if (!entry) return null

      const age = Date.now() - entry.fetchedAt
      if (age > MARKET_DATA_CACHE_TTL_MS) {
        await db.delete('market-cache', key)
        return null
      }

      return entry.data
    } catch {
      return null
    }
  }

  private async setCached(key: string, data: HistoricalPrice[]): Promise<void> {
    try {
      const db = await getDB()
      const entry: MarketDataCacheEntry = {
        key,
        data: data.map((p) => ({ date: p.date, close: p.close })),
        fetchedAt: Date.now(),
      }
      await db.put('market-cache', entry)
    } catch {
      // Cache write failure is non-critical
    }
  }
}
