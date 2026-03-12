import type { HistoricalPrice } from '@domain/models/PerformanceResult'
import type { MarketDataPort } from '@domain/ports/MarketDataPort'
import { ALPHA_VANTAGE_BASE_URL } from '@shared/constants'
import { getApiKey } from './apiKeyManager'

/**
 * Adapter — Alpha Vantage API
 *
 * API gratuite avec 25 requêtes/jour (clé gratuite).
 * Endpoint utilisé : TIME_SERIES_DAILY (full output).
 *
 * Documentation : https://www.alphavantage.co/documentation/
 *
 * ⚠️ Limitations :
 * - 25 requêtes/jour (free tier)
 * - Données end-of-day uniquement
 * - Certains tickers non-US peuvent ne pas être disponibles
 */
export class AlphaVantageAdapter implements MarketDataPort {
  async getHistoricalPrices(
    ticker: string,
    from: string,
    to: string
  ): Promise<HistoricalPrice[]> {
    const apiKey = await getApiKey()
    if (!apiKey) {
      throw new Error(
        'Clé API Alpha Vantage manquante. Configurez-la dans les paramètres.'
      )
    }

    const url = new URL(ALPHA_VANTAGE_BASE_URL)
    url.searchParams.set('function', 'TIME_SERIES_DAILY')
    url.searchParams.set('symbol', ticker)
    url.searchParams.set('outputsize', 'full')
    url.searchParams.set('apikey', apiKey)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Erreur API Alpha Vantage: ${response.status}`)
    }

    const data = await response.json()

    // Vérification des erreurs API
    if (data['Error Message']) {
      throw new Error(`Ticker inconnu : ${ticker}`)
    }
    if (data['Note']) {
      throw new Error('Limite d\'appels API atteinte. Réessayez demain.')
    }

    const timeSeries = data['Time Series (Daily)'] as
      | Record<string, Record<string, string>>
      | undefined

    if (!timeSeries) {
      throw new Error(`Pas de données disponibles pour ${ticker}`)
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    const prices: HistoricalPrice[] = Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        close: parseFloat(values['4. close'] ?? '0'),
      }))
      .filter((p) => {
        const d = new Date(p.date)
        return d >= fromDate && d <= toDate
      })
      .sort((a, b) => a.date.localeCompare(b.date))

    return prices
  }

  async isAvailable(): Promise<boolean> {
    const apiKey = await getApiKey()
    return apiKey.length > 0
  }
}
