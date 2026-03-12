<template>
  <div class="flex-1 overflow-auto">
    <!-- Loading overlay -->
    <div v-if="loading" class="flex items-center justify-center py-8 text-slate-400">
      <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Calcul en cours...
    </div>

    <!-- Spreadsheet-style table -->
    <table v-if="investments.length > 0" class="w-full border-collapse text-sm">
      <thead>
        <tr class="bg-grid-header text-xs text-slate-600 uppercase tracking-wider">
          <th class="px-3 py-2 text-left border border-grid-border w-8">#</th>
          <th class="px-3 py-2 text-left border border-grid-border">Ticker</th>
          <th class="px-3 py-2 text-left border border-grid-border">Label</th>
          <th class="px-3 py-2 text-right border border-grid-border">Montant (€)</th>
          <th class="px-3 py-2 text-center border border-grid-border">Entrée</th>
          <th class="px-3 py-2 text-center border border-grid-border">Sortie</th>
          <th class="px-3 py-2 text-right border border-grid-border">Courtage %</th>
          <th class="px-3 py-2 text-right border border-grid-border">Gestion %</th>
          <!-- Computed columns -->
          <th
            class="px-3 py-2 text-right border border-grid-border bg-sky-50 cursor-pointer hover:bg-sky-100"
            title="Cliquez pour voir la formule"
            @click="$emit('show-formula', 'gross-return')"
          >
            Brut %
          </th>
          <th
            class="px-3 py-2 text-right border border-grid-border bg-sky-50 cursor-pointer hover:bg-sky-100"
            @click="$emit('show-formula', 'net-return')"
          >
            Net %
          </th>
          <th
            class="px-3 py-2 text-right border border-grid-border bg-emerald-50 cursor-pointer hover:bg-emerald-100"
            @click="$emit('show-formula', 'net-net-pfu')"
          >
            Net-Net %
          </th>
          <th
            class="px-3 py-2 text-right border border-grid-border bg-emerald-50 cursor-pointer hover:bg-emerald-100"
            @click="$emit('show-formula', 'cagr')"
          >
            CAGR %
          </th>
          <th class="px-3 py-2 text-right border border-grid-border bg-emerald-50">Val. Finale</th>
          <th class="px-3 py-2 text-center border border-grid-border w-10">×</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(inv, index) in investments"
          :key="inv.id"
          class="hover:bg-grid-hover transition-colors"
          :class="{ 'bg-yellow-50': selectedRow === inv.id }"
          @click="selectedRow = inv.id"
        >
          <td class="px-3 py-1.5 border border-grid-border text-slate-400 text-xs">{{ index + 1 }}</td>
          <td class="px-3 py-1.5 border border-grid-border">
            <input
              :value="inv.ticker"
              class="w-full bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1 font-mono text-xs uppercase"
              @change="emitUpdate(inv.id, 'ticker', ($event.target as HTMLInputElement).value.toUpperCase())"
            />
          </td>
          <td class="px-3 py-1.5 border border-grid-border">
            <input
              :value="inv.label"
              class="w-full bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1"
              @change="emitUpdate(inv.id, 'label', ($event.target as HTMLInputElement).value)"
            />
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right">
            <input
              :value="inv.amountInvested"
              type="number"
              class="w-full bg-transparent text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1 font-mono"
              @change="emitUpdate(inv.id, 'amountInvested', Number(($event.target as HTMLInputElement).value))"
            />
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-center">
            <input
              :value="inv.entryDate"
              type="date"
              class="bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1 text-xs"
              @change="emitUpdate(inv.id, 'entryDate', ($event.target as HTMLInputElement).value)"
            />
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-center">
            <input
              :value="inv.exitDate"
              type="date"
              class="bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1 text-xs"
              @change="emitUpdate(inv.id, 'exitDate', ($event.target as HTMLInputElement).value)"
            />
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right">
            <input
              :value="inv.brokerFeePercent"
              type="number"
              step="0.1"
              class="w-16 bg-transparent text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1 font-mono text-xs"
              @change="emitUpdate(inv.id, 'brokerFeePercent', Number(($event.target as HTMLInputElement).value))"
            />
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right">
            <input
              :value="inv.managementFeePercent"
              type="number"
              step="0.1"
              class="w-16 bg-transparent text-right focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 rounded px-1 font-mono text-xs"
              @change="emitUpdate(inv.id, 'managementFeePercent', Number(($event.target as HTMLInputElement).value))"
            />
          </td>

          <!-- Computed cells (read-only) -->
          <td class="px-3 py-1.5 border border-grid-border text-right font-mono text-xs bg-sky-50"
              :class="resultClass(getResult(inv.id)?.grossReturnPercent)">
            {{ formatResultPercent(getResult(inv.id)?.grossReturnPercent) }}
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right font-mono text-xs bg-sky-50"
              :class="resultClass(getResult(inv.id)?.netReturnPercent)">
            {{ formatResultPercent(getResult(inv.id)?.netReturnPercent) }}
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right font-mono text-xs bg-emerald-50 font-semibold"
              :class="resultClass(getResult(inv.id)?.netNetReturnPercent)">
            {{ formatResultPercent(getResult(inv.id)?.netNetReturnPercent) }}
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right font-mono text-xs bg-emerald-50"
              :class="resultClass(getResult(inv.id)?.cagr)">
            {{ formatResultPercent(getResult(inv.id)?.cagr) }}
          </td>
          <td class="px-3 py-1.5 border border-grid-border text-right font-mono text-xs bg-emerald-50 font-semibold">
            {{ getResult(inv.id) ? formatEur(getResult(inv.id)!.netNetValue) : '—' }}
          </td>

          <td class="px-3 py-1.5 border border-grid-border text-center">
            <button
              class="text-slate-300 hover:text-red-500 transition-colors"
              title="Supprimer"
              @click.stop="$emit('remove-investment', inv.id)"
            >✕</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state -->
    <div v-else-if="!loading" class="flex flex-col items-center justify-center py-16 text-slate-400">
      <p class="text-sm">Aucun investissement. Appuyez sur <kbd class="kbd">Ctrl+N</kbd> pour ajouter une ligne.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Investment } from '@domain/models/Investment'
import type { PerformanceResult } from '@domain/models/PerformanceResult'
import { formatEur, formatPercent } from '@shared/formatters'

const props = defineProps<{
  investments: readonly Investment[]
  results: readonly PerformanceResult[]
  loading: boolean
}>()

const emit = defineEmits<{
  'update-investment': [id: string, updates: Partial<Investment>]
  'remove-investment': [id: string]
  'show-formula': [formulaId: string]
}>()

const selectedRow = ref<string | null>(null)

function getResult(investmentId: string): PerformanceResult | undefined {
  return props.results.find((r) => r.investmentId === investmentId)
}

function emitUpdate(id: string, field: keyof Investment, value: string | number) {
  emit('update-investment', id, { [field]: value } as Partial<Investment>)
}

function formatResultPercent(value: number | undefined): string {
  if (value === undefined) return '—'
  return formatPercent(value)
}

function resultClass(value: number | undefined): string {
  if (value === undefined) return ''
  if (value > 0) return 'cell-positive'
  if (value < 0) return 'cell-negative'
  return ''
}
</script>
