<template>
  <div>
    <h3 class="text-xs font-semibold text-slate-500 uppercase mb-2">Performance comparée</h3>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" class="max-h-56" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { PerformanceResult } from '@domain/models/PerformanceResult'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler)

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const props = defineProps<{
  results: readonly PerformanceResult[]
  labels: Record<string, string>
}>()

const chartData = computed(() => {
  if (props.results.length === 0) return null

  // Use longest price history for x-axis labels
  const longestHistory = props.results.reduce((longest, r) =>
    r.priceHistory.length > longest.priceHistory.length ? r : longest
  )
  const dateLabels = longestHistory.priceHistory
    .filter((_, i) => i % Math.max(1, Math.floor(longestHistory.priceHistory.length / 30)) === 0)
    .map((p) => p.date)

  const datasets = props.results.map((r, idx) => {
    // Normalize prices to base 100 for comparison
    const basePrice = r.priceHistory[0]?.close ?? 1
    const normalized = r.priceHistory
      .filter((_, i) => i % Math.max(1, Math.floor(r.priceHistory.length / 30)) === 0)
      .map((p) => (p.close / basePrice) * 100)

    return {
      label: props.labels[r.investmentId] ?? r.investmentId,
      data: normalized,
      borderColor: COLORS[idx % COLORS.length],
      backgroundColor: `${COLORS[idx % COLORS.length]}15`,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      fill: false,
    }
  })

  return { labels: dateLabels, datasets }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: {
      callbacks: {
        label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
          `${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toFixed(1)}`,
      },
    },
  },
  scales: {
    x: { display: true, ticks: { maxRotation: 45, font: { size: 10 } } },
    y: {
      display: true,
      title: { display: true, text: 'Base 100', font: { size: 10 } },
      ticks: { font: { size: 10 } },
    },
  },
}
</script>
