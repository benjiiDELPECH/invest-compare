<template>
  <div class="formula-block">
    <div class="flex items-center justify-between mb-2">
      <h4 class="text-sm font-semibold text-slate-700">{{ formula.name }}</h4>
    </div>

    <!-- LaTeX formula rendered via KaTeX -->
    <div class="text-center py-3" v-html="renderedLatex" />

    <!-- Explanation -->
    <p class="text-sm text-slate-600 mt-2 leading-relaxed">
      {{ formula.explanation }}
    </p>

    <!-- Example -->
    <div class="mt-2 px-3 py-2 bg-white rounded border border-slate-200 text-xs text-slate-500">
      <strong>Exemple :</strong> {{ formula.example }}
    </div>

    <!-- Caveats -->
    <div
      v-if="formula.caveats"
      class="mt-2 px-3 py-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-700"
    >
      ⚠️ {{ formula.caveats }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'
import type { FormulaEntry } from '@domain/explanations/formulaRegistry'

const props = defineProps<{
  formula: FormulaEntry
}>()

const renderedLatex = computed(() => {
  try {
    return katex.renderToString(props.formula.latex, {
      throwOnError: false,
      displayMode: true,
    })
  } catch {
    return `<code>${props.formula.latex}</code>`
  }
})
</script>
