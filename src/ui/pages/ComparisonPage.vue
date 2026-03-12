<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <GridToolbar
      :session-name="session.name"
      :benchmark="session.benchmarkTicker"
      :is-dirty="isDirty"
      @update:session-name="setSessionName"
      @update:benchmark="setBenchmark"
      @add-investment="handleAddInvestment"
      @save="handleSave"
      @export-csv="handleExport"
      @compute="handleCompute"
    />

    <div class="flex flex-1 overflow-hidden">
      <!-- Main grid area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <InvestmentGrid
          :investments="session.investments"
          :results="enrichedResults"
          :loading="computing"
          @update-investment="updateInvestment"
          @remove-investment="removeInvestment"
          @show-formula="showFormula"
        />

        <!-- Charts -->
        <div v-if="enrichedResults.length > 0" class="border-t border-slate-200 p-4 bg-white shrink-0">
          <div class="grid grid-cols-2 gap-4 max-h-64">
            <PerformanceChart
              :results="enrichedResults"
              :labels="investmentLabels"
            />
            <DrawdownChart
              :results="enrichedResults"
              :labels="investmentLabels"
            />
          </div>
        </div>
      </div>

      <!-- Side panel: Fiscal + Explanations -->
      <div v-if="isPanelOpen" class="w-80 border-l border-slate-200 bg-white overflow-y-auto shrink-0">
        <FiscalPanel
          :regime="session.fiscalRegime"
          :inflation-rate="session.inflationRate"
          @update:regime-type="handleRegimeType"
          @update:tmi="handleTmi"
          @update:inflation="setInflationRate"
        />
        <ExplanationPanel
          :formula="activeFormula"
          :glossary="glossary"
          @close="closePanel"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useComparison } from '@app/composables/useComparison'
import { useMarketData } from '@app/composables/useMarketData'
import { useFiscalRegime } from '@app/composables/useFiscalRegime'
import { useExplanations } from '@app/composables/useExplanations'
import { useSessionStorage } from '@app/composables/useSessionStorage'
import { useKeyboardNav } from '@app/composables/useKeyboardNav'
import { computePerformance } from '@app/usecases/ComputePerformance'
import { exportToCsv, downloadCsv } from '@app/usecases/ExportComparison'
import { createInvestment } from '@domain/models/Investment'
import { sharpeRatio } from '@domain/calculations/sharpeRatio'
import { maxDrawdown } from '@domain/calculations/drawdown'
import { realReturn } from '@domain/calculations/inflationAdjusted'
import { DEFAULT_RISK_FREE_RATE } from '@shared/constants'
import type { HistoricalPrice, PerformanceResult } from '@domain/models/PerformanceResult'
import type { FiscalRegimeType } from '@domain/models/FiscalRegime'
import GridToolbar from '@ui/components/grid/GridToolbar.vue'
import InvestmentGrid from '@ui/components/grid/InvestmentGrid.vue'
import PerformanceChart from '@ui/components/charts/PerformanceChart.vue'
import DrawdownChart from '@ui/components/charts/DrawdownChart.vue'
import FiscalPanel from '@ui/components/panels/FiscalPanel.vue'
import ExplanationPanel from '@ui/components/panels/ExplanationPanel.vue'

const route = useRoute()
const {
  session, isDirty, addInvestment, removeInvestment,
  updateInvestment, setSessionName, setBenchmark,
  setFiscalRegime, setInflationRate, initSession, markSaved,
} = useComparison()
const { fetchPrices } = useMarketData()
const { regime, setType: setRegimeType, setTmi } = useFiscalRegime()
const { activeFormula, isPanelOpen, showFormula, closePanel, togglePanel, glossary } = useExplanations()
const { save, loadById } = useSessionStorage()

const computing = ref(false)
const enrichedResults = ref<Array<PerformanceResult & { sharpe: number; maxDrawdown: number; realReturn: number }>>([])
const priceHistories = ref<Map<string, HistoricalPrice[]>>(new Map())

const investmentLabels = computed(() => {
  const labels: Record<string, string> = {}
  for (const inv of session.value.investments) {
    labels[inv.id] = inv.label
  }
  return labels
})

// Load session if ID in route
onMounted(async () => {
  const id = route.params.id as string | undefined
  if (id) {
    const existing = await loadById(id)
    if (existing) {
      initSession(existing)
      await handleCompute()
    }
  }
})

// Sync fiscal regime
watch(regime, (newRegime) => {
  setFiscalRegime(newRegime)
})

function handleAddInvestment() {
  addInvestment(createInvestment({ ticker: 'AAPL', label: 'Apple' }))
}

async function handleSave() {
  await save(session.value)
  markSaved()
}

async function handleCompute() {
  if (session.value.investments.length === 0) return

  computing.value = true
  const results: Array<PerformanceResult & { sharpe: number; maxDrawdown: number; realReturn: number }> = []

  try {
    // Fetch all price histories
    const allInvestments = [...session.value.investments]

    // Add benchmark as a virtual investment for comparison
    const benchmarkInv = createInvestment({
      ticker: session.value.benchmarkTicker,
      label: `Benchmark (${session.value.benchmarkTicker})`,
      amountInvested: session.value.investments[0]?.amountInvested ?? 10_000,
      entryDate: session.value.investments[0]?.entryDate ?? '2020-01-01',
      exitDate: session.value.investments[0]?.exitDate ?? new Date().toISOString().slice(0, 10),
      brokerFeePercent: 0.1,
      managementFeePercent: 0.03,
    })

    for (const inv of [...allInvestments, benchmarkInv]) {
      try {
        const prices = await fetchPrices(inv.ticker, inv.entryDate, inv.exitDate)
        priceHistories.value.set(inv.id, prices)

        if (prices.length >= 2) {
          const result = computePerformance(inv, prices, session.value.fiscalRegime)
          const sharpe = sharpeRatio(result.cagr, DEFAULT_RISK_FREE_RATE, prices)
          const mdd = maxDrawdown(prices)
          const real = realReturn(result.netNetReturnPercent, session.value.inflationRate)
          results.push({ ...result, sharpe, maxDrawdown: mdd, realReturn: real })
        }
      } catch (err) {
        console.warn(`Impossible de charger ${inv.ticker}:`, err)
      }
    }

    enrichedResults.value = results
  } finally {
    computing.value = false
  }
}

function handleExport() {
  if (enrichedResults.value.length === 0) return
  const csv = exportToCsv(enrichedResults.value, investmentLabels.value)
  downloadCsv(csv, `${session.value.name}.csv`)
}

function handleRegimeType(type: FiscalRegimeType) {
  setRegimeType(type)
}

function handleTmi(rate: number) {
  setTmi(rate)
}

// Keyboard shortcuts
useKeyboardNav([
  { key: 'n', ctrl: true, action: handleAddInvestment, description: 'Ajouter un investissement' },
  { key: 's', ctrl: true, action: handleSave, description: 'Sauvegarder' },
  { key: 'e', ctrl: true, action: handleExport, description: 'Exporter CSV' },
  { key: '/', ctrl: true, action: togglePanel, description: 'Panneau explicatif' },
  { key: 'Enter', ctrl: true, action: handleCompute, description: 'Lancer les calculs' },
])
</script>
