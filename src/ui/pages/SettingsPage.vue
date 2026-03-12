<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-800 mb-1">Paramètres</h1>
    <p class="text-sm text-slate-500 mb-8">Configuration de l'application et des valeurs par défaut.</p>

    <!-- Section: API -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>🔗</span> Source de données
      </h2>
      <div class="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Clé API Alpha Vantage</label>
          <p class="text-xs text-slate-400 mb-2">
            Données de marché historiques (gratuit, 25 req/jour).
            <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener"
               class="text-sky-600 hover:underline">
              Obtenir une clé →
            </a>
          </p>
          <div class="flex gap-2">
            <input
              v-model="form.apiKey"
              :type="showApiKey ? 'text' : 'password'"
              placeholder="Ex: OY13IK4DS108AF3Q"
              class="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
            <button
              class="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              @click="showApiKey = !showApiKey"
            >
              {{ showApiKey ? '🙈' : '👁️' }}
            </button>
          </div>
          <div v-if="apiKeyStatus" class="mt-2 text-xs" :class="apiKeyStatus === 'valid' ? 'text-green-600' : 'text-red-500'">
            {{ apiKeyStatus === 'valid' ? '✓ Clé API configurée' : '✗ Clé API vide — les calculs ne fonctionneront pas' }}
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Fiscal defaults -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>⚖️</span> Fiscalité par défaut
      </h2>
      <div class="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Régime fiscal</label>
          <div class="flex gap-2">
            <button
              class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
              :class="form.defaultFiscalRegimeType === 'PFU'
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-medium'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'"
              @click="form.defaultFiscalRegimeType = 'PFU'"
            >
              PFU — Flat Tax 30%
            </button>
            <button
              class="flex-1 px-3 py-2 text-sm rounded-md border transition-colors"
              :class="form.defaultFiscalRegimeType === 'BAREME'
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-medium'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'"
              @click="form.defaultFiscalRegimeType = 'BAREME'"
            >
              Barème progressif
            </button>
          </div>
        </div>

        <div v-if="form.defaultFiscalRegimeType === 'BAREME'">
          <label class="block text-sm font-medium text-slate-700 mb-1">TMI (Taux Marginal d'Imposition)</label>
          <select
            v-model.number="form.defaultTmi"
            class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option :value="0">0%</option>
            <option :value="0.11">11%</option>
            <option :value="0.30">30%</option>
            <option :value="0.41">41%</option>
            <option :value="0.45">45%</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Inflation annuelle hypothétique</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="inflationDisplay"
              type="number"
              step="0.1"
              min="0"
              max="20"
              class="w-24 px-3 py-2 border border-slate-200 rounded-md text-sm text-right font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <span class="text-sm text-slate-400">% / an</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Taux sans risque (Sharpe)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="riskFreeDisplay"
              type="number"
              step="0.1"
              min="0"
              max="20"
              class="w-24 px-3 py-2 border border-slate-200 rounded-md text-sm text-right font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <span class="text-sm text-slate-400">% / an (OAT 10 ans ≈ 3%)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Benchmark -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>📈</span> Benchmark par défaut
      </h2>
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <select
          v-model="form.defaultBenchmark"
          class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option v-for="b in benchmarks" :key="b.ticker" :value="b.ticker">
            {{ b.label }}
          </option>
        </select>
      </div>
    </section>

    <!-- Save button -->
    <div class="flex items-center justify-between">
      <span v-if="saved" class="text-sm text-green-600 transition-opacity">✓ Paramètres sauvegardés</span>
      <span v-else />
      <button
        class="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-sm"
        @click="handleSave"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { loadPreferences, savePreferences } from '@infra/api/apiKeyManager'
import { BENCHMARKS } from '@shared/constants'
import type { UserPreferences } from '@shared/types'

const benchmarks = BENCHMARKS
const showApiKey = ref(false)
const saved = ref(false)

const form = reactive<UserPreferences>({
  defaultFiscalRegimeType: 'PFU',
  defaultTmi: 0.30,
  defaultBenchmark: 'SPY',
  defaultInflationRate: 0.02,
  apiKey: '',
  riskFreeRate: 0.03,
})

const inflationDisplay = computed({
  get: () => +(form.defaultInflationRate * 100).toFixed(1),
  set: (v: number) => { form.defaultInflationRate = v / 100 },
})

const riskFreeDisplay = computed({
  get: () => +(form.riskFreeRate * 100).toFixed(1),
  set: (v: number) => { form.riskFreeRate = v / 100 },
})

const apiKeyStatus = computed(() => {
  if (form.apiKey.trim().length > 0) return 'valid'
  return 'missing'
})

onMounted(async () => {
  const prefs = await loadPreferences()
  Object.assign(form, prefs)
})

async function handleSave() {
  await savePreferences({ ...form })
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>
