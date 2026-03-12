import { ref, readonly } from 'vue'
import { FORMULAS, getFormulaById, type FormulaEntry } from '@domain/explanations/formulaRegistry'
import { GLOSSARY, type GlossaryEntry } from '@domain/explanations/glossary'

/**
 * Composable — Volet pédagogique / explications
 *
 * Gère l'affichage contextuel des formules et du glossaire.
 */
export function useExplanations() {
  const activeFormula = ref<FormulaEntry | null>(null)
  const isPanelOpen = ref(false)

  function showFormula(formulaId: string) {
    const formula = getFormulaById(formulaId)
    if (formula) {
      activeFormula.value = formula
      isPanelOpen.value = true
    }
  }

  function closePanel() {
    isPanelOpen.value = false
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  function searchGlossary(query: string): GlossaryEntry[] {
    const lower = query.toLowerCase()
    return GLOSSARY.filter(
      (entry) =>
        entry.term.toLowerCase().includes(lower) ||
        entry.definition.toLowerCase().includes(lower)
    )
  }

  return {
    allFormulas: FORMULAS,
    glossary: GLOSSARY,
    activeFormula: readonly(activeFormula),
    isPanelOpen: readonly(isPanelOpen),
    showFormula,
    closePanel,
    togglePanel,
    searchGlossary,
  }
}
