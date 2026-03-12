import { ref, readonly } from 'vue'
import type { HistoricalPrice } from '@domain/models/PerformanceResult'
import type { MarketDataPort } from '@domain/ports/MarketDataPort'
import { AlphaVantageAdapter } from '@infra/api/AlphaVantageAdapter'
import { MarketDataCache } from '@infra/cache/MarketDataCache'
import type { LoadingState } from '@shared/types'

/**
 * Composable — Récupération des données de marché
 *
 * Fournit un accès réactif aux données de marché via l'adapter cache.
 * Gère les états de chargement et les erreurs.
 */

// Singleton : un seul adapter partagé dans toute l'app
const adapter: MarketDataPort = new MarketDataCache(new AlphaVantageAdapter())

// Cache mémoire par session (évite les appels IndexedDB inutiles)
const memoryCache = new Map<string, HistoricalPrice[]>()

export function useMarketData() {
  const state = ref<LoadingState>('idle')
  const error = ref<string | null>(null)

  async function fetchPrices(
    ticker: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]> {
    const cacheKey = `${ticker}:${from}:${to}`

    // Memory cache hit
    const cached = memoryCache.get(cacheKey)
    if (cached) return cached

    state.value = 'loading'
    error.value = null

    try {
      const prices = await adapter.getHistoricalPrices(ticker, from, to)
      memoryCache.set(cacheKey, prices)
      state.value = 'success'
      return prices
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      error.value = message
      state.value = 'error'
      throw err
    }
  }

  async function checkAvailability(): Promise<boolean> {
    return adapter.isAvailable()
  }

  function clearMemoryCache() {
    memoryCache.clear()
  }

  return {
    state: readonly(state),
    error: readonly(error),
    fetchPrices,
    checkAvailability,
    clearMemoryCache,
  }
}
