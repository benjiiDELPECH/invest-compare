/**
 * Types partagés transverses
 */

/** État de chargement pour les appels async */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** Résultat d'un appel async avec gestion d'erreur */
export interface AsyncResult<T> {
  data: T | null
  state: LoadingState
  error: string | null
}

/** Préférences utilisateur persistées */
export interface UserPreferences {
  defaultFiscalRegimeType: 'PFU' | 'BAREME'
  defaultTmi: number
  defaultBenchmark: string
  defaultInflationRate: number
  apiKey: string
  riskFreeRate: number
}

/** Entrée de cache pour les données de marché */
export interface MarketDataCacheEntry {
  key: string // "TICKER:FROM:TO"
  data: Array<{ date: string; close: number }>
  fetchedAt: number // timestamp
}
