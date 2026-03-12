<template>
  <div class="flex items-center gap-3 px-4 py-2 bg-white border-b border-slate-200">
    <!-- Session name -->
    <input
      :value="sessionName"
      class="text-sm font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none px-1 py-0.5 w-48 transition-colors"
      @input="$emit('update:session-name', ($event.target as HTMLInputElement).value)"
      @keydown.enter="($event.target as HTMLInputElement).blur()"
    />

    <div class="h-4 w-px bg-slate-200" />

    <!-- Actions -->
    <button
      class="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors"
      title="Ajouter un investissement (Ctrl+N)"
      @click="$emit('add-investment')"
    >
      <span>＋</span> Ajouter
    </button>

    <button
      class="flex items-center gap-1 px-3 py-1 text-sm text-sky-600 hover:bg-sky-50 rounded transition-colors font-medium"
      title="Lancer les calculs (Ctrl+Enter)"
      @click="$emit('compute')"
    >
      ▶ Calculer
    </button>

    <div class="h-4 w-px bg-slate-200" />

    <!-- Benchmark selector -->
    <label class="flex items-center gap-1 text-xs text-slate-500">
      Benchmark:
      <select
        :value="benchmark"
        class="text-sm border border-slate-200 rounded px-2 py-0.5 bg-white"
        @change="$emit('update:benchmark', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="b in benchmarks" :key="b.ticker" :value="b.ticker">
          {{ b.label }}
        </option>
      </select>
    </label>

    <div class="flex-1" />

    <!-- Right actions -->
    <button
      class="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded transition-colors"
      :class="{ 'text-sky-600 font-medium': isDirty }"
      title="Sauvegarder (Ctrl+S)"
      @click="$emit('save')"
    >
      💾 {{ isDirty ? 'Sauvegarder*' : 'Sauvegardé' }}
    </button>

    <button
      class="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded transition-colors"
      title="Exporter CSV (Ctrl+E)"
      @click="$emit('export-csv')"
    >
      📥 Export
    </button>
  </div>
</template>

<script setup lang="ts">
import { BENCHMARKS } from '@shared/constants'

defineProps<{
  sessionName: string
  benchmark: string
  isDirty: boolean
}>()

defineEmits<{
  'update:session-name': [name: string]
  'update:benchmark': [ticker: string]
  'add-investment': []
  'save': []
  'export-csv': []
  'compute': []
}>()

const benchmarks = BENCHMARKS
</script>
