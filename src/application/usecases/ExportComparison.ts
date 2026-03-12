import type { PerformanceResult } from '@domain/models/PerformanceResult'

/**
 * Use Case — Export d'une comparaison en CSV
 *
 * Génère un fichier CSV avec toutes les métriques calculées.
 */
export function exportToCsv(
  results: readonly PerformanceResult[],
  labels: Record<string, string>
): string {
  const headers = [
    'Ticker',
    'Montant Investi (€)',
    'Prix Entrée (€)',
    'Prix Sortie (€)',
    'Rendement Brut (%)',
    'Frais Courtage (€)',
    'Frais Gestion (€)',
    'Rendement Net (%)',
    'Impôt (€)',
    'Rendement Net-Net (%)',
    'Valeur Finale (€)',
    'CAGR (%)',
  ]

  const rows = results.map((r) => [
    labels[r.investmentId] ?? r.investmentId,
    r.unitsBought * r.entryPrice,
    r.entryPrice,
    r.exitPrice,
    (r.grossReturnPercent * 100).toFixed(2),
    r.brokerFeesAmount.toFixed(2),
    r.managementFeesAmount.toFixed(2),
    (r.netReturnPercent * 100).toFixed(2),
    r.taxAmount.toFixed(2),
    (r.netNetReturnPercent * 100).toFixed(2),
    r.netNetValue.toFixed(2),
    (r.cagr * 100).toFixed(2),
  ])

  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.join(';')),
  ].join('\n')

  return csvContent
}

/**
 * Déclenche le téléchargement d'un fichier CSV dans le navigateur.
 */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
