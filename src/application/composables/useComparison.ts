import { ref, readonly, computed } from 'vue'
import type { ComparisonSession } from '@domain/models/ComparisonSession'
import {
  createSession,
  addInvestmentToSession,
  removeInvestmentFromSession,
  updateInvestmentInSession,
} from '@domain/models/ComparisonSession'
import type { Investment } from '@domain/models/Investment'
import type { FiscalRegime } from '@domain/models/FiscalRegime'

/**
 * Composable — Gestion de la session de comparaison courante
 *
 * State réactif centralisé pour la session active.
 * Aucune logique métier : délègue tout au domaine.
 */
export function useComparison() {
  const session = ref<ComparisonSession>(createSession())
  const isDirty = ref(false)

  function initSession(existing?: ComparisonSession) {
    session.value = existing ?? createSession()
    isDirty.value = false
  }

  function addInvestment(investment: Investment) {
    session.value = addInvestmentToSession(session.value, investment)
    isDirty.value = true
  }

  function removeInvestment(investmentId: string) {
    session.value = removeInvestmentFromSession(session.value, investmentId)
    isDirty.value = true
  }

  function updateInvestment(investmentId: string, updates: Partial<Investment>) {
    session.value = updateInvestmentInSession(session.value, investmentId, updates)
    isDirty.value = true
  }

  function setSessionName(name: string) {
    session.value = { ...session.value, name, updatedAt: new Date().toISOString() }
    isDirty.value = true
  }

  function setBenchmark(ticker: string) {
    session.value = { ...session.value, benchmarkTicker: ticker, updatedAt: new Date().toISOString() }
    isDirty.value = true
  }

  function setFiscalRegime(regime: FiscalRegime) {
    session.value = { ...session.value, fiscalRegime: regime, updatedAt: new Date().toISOString() }
    isDirty.value = true
  }

  function setInflationRate(rate: number) {
    session.value = { ...session.value, inflationRate: rate, updatedAt: new Date().toISOString() }
    isDirty.value = true
  }

  function markSaved() {
    isDirty.value = false
  }

  const investments = computed(() => session.value.investments)
  const investmentCount = computed(() => session.value.investments.length)

  return {
    session: readonly(session),
    isDirty: readonly(isDirty),
    investments,
    investmentCount,
    initSession,
    addInvestment,
    removeInvestment,
    updateInvestment,
    setSessionName,
    setBenchmark,
    setFiscalRegime,
    setInflationRate,
    markSaved,
  }
}
