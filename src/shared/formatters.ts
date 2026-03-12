/**
 * Formatters — Fonctions d'affichage pures
 */

const eurFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** 12 345,67 € */
export function formatEur(value: number): string {
  return eurFormatter.format(value)
}

/** +12,34 % (avec signe) */
export function formatPercent(value: number): string {
  const formatted = percentFormatter.format(value)
  return value > 0 ? `+${formatted}` : formatted
}

/** 15/01/2020 */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

/** Couleur CSS selon le signe d'une valeur */
export function signColor(value: number): string {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-500'
}

/** Abrège un nombre : 1 234 567 → "1.23M" */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}
