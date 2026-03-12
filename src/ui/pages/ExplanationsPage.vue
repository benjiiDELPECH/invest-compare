<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-2">📚 Comprendre les calculs</h1>
    <p class="text-slate-500 mb-8">
      Transparence totale : chaque formule utilisée dans InvestCompare est documentée ici.
    </p>

    <!-- Formulas -->
    <section class="space-y-4 mb-12">
      <h2 class="text-lg font-semibold text-slate-700 border-b pb-2">Formules</h2>
      <FormulaBlock
        v-for="formula in allFormulas"
        :key="formula.id"
        :formula="formula"
      />
    </section>

    <!-- Glossary -->
    <section>
      <h2 class="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Glossaire</h2>
      <div class="space-y-3">
        <div
          v-for="entry in glossary"
          :key="entry.term"
          class="p-3 bg-white rounded-lg border border-slate-200"
        >
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-slate-800">{{ entry.term }}</span>
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="categoryClass(entry.category)"
            >
              {{ entry.category }}
            </span>
          </div>
          <p class="text-sm text-slate-600">{{ entry.definition }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useExplanations } from '@app/composables/useExplanations'
import FormulaBlock from '@ui/components/shared/FormulaBlock.vue'

const { allFormulas, glossary } = useExplanations()

function categoryClass(category: string): string {
  const classes: Record<string, string> = {
    fiscal: 'bg-purple-100 text-purple-700',
    finance: 'bg-sky-100 text-sky-700',
    risque: 'bg-orange-100 text-orange-700',
  }
  return classes[category] ?? 'bg-gray-100 text-gray-700'
}
</script>
