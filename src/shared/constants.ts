import type { UserPreferences } from './types'

/** Benchmarks disponibles */
export const BENCHMARKS = [
  { ticker: 'SPY', label: 'S&P 500 (SPY)', category: 'indice' },
  { ticker: 'IWDA.L', label: 'MSCI World (IWDA)', category: 'indice' },
  { ticker: 'GLD', label: 'Or (GLD)', category: 'matière première' },
  { ticker: 'QQQ', label: 'Nasdaq 100 (QQQ)', category: 'indice' },
  { ticker: 'EFA', label: 'MSCI EAFE (EFA)', category: 'indice' },
  { ticker: 'BND', label: 'US Bonds (BND)', category: 'obligation' },
] as const

/** Taux sans risque par défaut (OAT FR 10 ans, ~3% en 2025) */
export const DEFAULT_RISK_FREE_RATE = 0.03

/** TTL du cache de données de marché (24 heures en ms) */
export const MARKET_DATA_CACHE_TTL_MS = 24 * 60 * 60 * 1000

/** Préférences par défaut */
export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultFiscalRegimeType: 'PFU',
  defaultTmi: 0.30,
  defaultBenchmark: 'SPY',
  defaultInflationRate: 0.02,
  apiKey: '',
  riskFreeRate: DEFAULT_RISK_FREE_RATE,
}

/** Base URL Alpha Vantage */
export const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

/** Nom de la base IndexedDB */
export const IDB_NAME = 'invest-compare-db'
export const IDB_VERSION = 1
