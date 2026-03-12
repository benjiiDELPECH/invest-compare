import { ref, readonly } from 'vue'
import { createPFU, createBareme, type FiscalRegime, type FiscalRegimeType, TMI_BRACKETS } from '@domain/models/FiscalRegime'

/**
 * Composable — Choix et configuration du régime fiscal
 */
export function useFiscalRegime() {
  const regime = ref<FiscalRegime>(createPFU())

  function setType(type: FiscalRegimeType) {
    if (type === 'PFU') {
      regime.value = createPFU()
    } else {
      regime.value = createBareme(regime.value.tmi || 0.30)
    }
  }

  function setTmi(rate: number) {
    regime.value = createBareme(rate)
  }

  return {
    regime: readonly(regime),
    tmiBrackets: TMI_BRACKETS,
    setType,
    setTmi,
  }
}
