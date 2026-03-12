<template>
  <div class="p-4 border-b border-slate-100">
    <h3 class="text-xs font-semibold text-slate-500 uppercase mb-3">⚖️ Régime fiscal</h3>

    <!-- PFU vs Barème -->
    <div class="flex gap-2 mb-3">
      <button
        class="flex-1 px-3 py-1.5 text-xs rounded-md border transition-colors"
        :class="regime.type === 'PFU'
          ? 'bg-sky-50 border-sky-300 text-sky-700 font-medium'
          : 'border-slate-200 text-slate-500 hover:bg-slate-50'"
        @click="$emit('update:regime-type', 'PFU')"
      >
        PFU 30%
      </button>
      <button
        class="flex-1 px-3 py-1.5 text-xs rounded-md border transition-colors"
        :class="regime.type === 'BAREME'
          ? 'bg-sky-50 border-sky-300 text-sky-700 font-medium'
          : 'border-slate-200 text-slate-500 hover:bg-slate-50'"
        @click="$emit('update:regime-type', 'BAREME')"
      >
        Barème IR
      </button>
    </div>

    <!-- TMI selector (only for Barème) -->
    <div v-if="regime.type === 'BAREME'" class="mb-3">
      <label class="text-xs text-slate-500 mb-1 block">TMI (Taux Marginal)</label>
      <select
        :value="regime.tmi"
        class="w-full text-sm border border-slate-200 rounded px-2 py-1"
        @change="$emit('update:tmi', Number(($event.target as HTMLSelectElement).value))"
      >
        <option :value="0">0%</option>
        <option :value="0.11">11%</option>
        <option :value="0.30">30%</option>
        <option :value="0.41">41%</option>
        <option :value="0.45">45%</option>
      </select>
    </div>

    <!-- Résumé fiscal -->
    <div class="text-xs text-slate-500 bg-slate-50 rounded p-2">
      <template v-if="regime.type === 'PFU'">
        <strong>Flat Tax :</strong> IR 12.8% + PS 17.2% = <strong>30%</strong>
      </template>
      <template v-else>
        <strong>Barème :</strong> TMI {{ (regime.tmi * 100).toFixed(0) }}% + PS 17.2% =
        <strong>{{ ((regime.tmi + 0.172) * 100).toFixed(1) }}%</strong>
      </template>
    </div>

    <!-- Inflation -->
    <div class="mt-4">
      <label class="text-xs text-slate-500 mb-1 block">Inflation annuelle hypothétique</label>
      <div class="flex items-center gap-2">
        <input
          :value="(inflationRate * 100).toFixed(1)"
          type="number"
          step="0.1"
          min="0"
          max="20"
          class="w-20 text-sm border border-slate-200 rounded px-2 py-1 text-right font-mono"
          @change="$emit('update:inflation', Number(($event.target as HTMLInputElement).value) / 100)"
        />
        <span class="text-xs text-slate-400">%/an</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FiscalRegime, FiscalRegimeType } from '@domain/models/FiscalRegime'

defineProps<{
  regime: FiscalRegime
  inflationRate: number
}>()

defineEmits<{
  'update:regime-type': [type: FiscalRegimeType]
  'update:tmi': [rate: number]
  'update:inflation': [rate: number]
}>()
</script>
