<template>
  <div>
    <h3 class="text-xs font-semibold text-slate-500 uppercase mb-2">Drawdown</h3>
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
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import type { PerformanceResult } from '@domain/models/PerformanceResult'
import { drawdownSeries } from '@domain/calculations/drawdown'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend)

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const props = defineProps<{
  results: readonly PerformanceResult[]
  labels: Record<string, string>
}>()

const chartData = computed(() => {
  if (props.results.length === 0) return null

  const firstResult = props.results[0]!
  const ddSeries = drawdownSeries(firstResult.priceHistory)
  const step = Math.max(1, Math.floor(ddSeries.length / 30))
  const dateLabels = ddSeries.filter((_: unknown, i: number) => i % step === 0).map((p) => p.date)

  const datasets = props.results.map((r: PerformanceResult, idx: number) => {
    const dd = drawdownSeries(r.priceHistory)
    const sampled = dd.filter((_: unknown, i: number) => i % step === 0).map((p) => p.drawdownPercent * 100)

    return {
      label: props.labels[r.investmentId] ?? r.investmentId,
      data: sampled,
      borderColor: COLORS[idx % COLORS.length],
      backgroundColor: `${COLORS[idx % COLORS.length]}20`,
      borderWidth: 1.5,
      pointRadius: 0,
      fill: true,
      tension: 0.3,
    }
  })

  return { labels: dateLabels, datasets }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } },
  },
  scales: {
    x: { display: true, ticks: { maxRotation: 45, font: { size: 10 } } },
    y: {
      display: true,
      title: { display: true, text: 'Drawdown %', font: { size: 10 } },
      ticks: { font: { size: 10 } },
    },
  },
}
</script>
