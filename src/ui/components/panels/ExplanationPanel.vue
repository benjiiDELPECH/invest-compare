<template>
  <div class="p-4">
    <h3 class="text-xs font-semibold text-slate-500 uppercase mb-3">📖 Explications</h3>

    <!-- Active formula -->
    <div v-if="formula" class="mb-4">
      <FormulaBlock :formula="formula" />
    </div>

    <div v-else class="text-xs text-slate-400 italic mb-4">
      Cliquez sur un en-tête de colonne calculée pour voir la formule associée.
    </div>

    <!-- Glossary summary -->
    <div class="space-y-2">
      <details v-for="entry in glossary.slice(0, 5)" :key="entry.term" class="group">
        <summary class="text-xs font-medium text-slate-600 cursor-pointer hover:text-sky-600">
          {{ entry.term }}
        </summary>
        <p class="text-xs text-slate-500 mt-1 ml-2">{{ entry.definition }}</p>
      </details>
      <router-link
        to="/learn"
        class="block text-xs text-sky-600 hover:underline mt-2"
      >
        Voir tout le glossaire →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormulaEntry } from '@domain/explanations/formulaRegistry'
import type { GlossaryEntry } from '@domain/explanations/glossary'
import FormulaBlock from '@ui/components/shared/FormulaBlock.vue'

defineProps<{
  formula: FormulaEntry | null
  glossary: readonly GlossaryEntry[]
}>()

defineEmits<{
  close: []
}>()
</script>
