<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Mes comparaisons</h1>
        <p class="text-sm text-slate-500 mt-1">
          Comparez vos investissements vs S&amp;P 500, Or, MSCI World.
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-sm"
        @click="createNew"
      >
        <span class="text-lg">+</span>
        Nouvelle comparaison
      </button>
    </div>

    <!-- API key prompt -->
    <div
      v-if="!hasApiKey"
      class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
    >
      <h3 class="font-medium text-amber-800 mb-2">🔑 Clé API requise</h3>
      <p class="text-sm text-amber-700 mb-3">
        InvestCompare utilise Alpha Vantage (gratuit) pour les données de marché.
        <a href="https://www.alphavantage.co/support/#api-key" target="_blank" class="underline">
          Obtenez votre clé gratuite ici.
        </a>
      </p>
      <div class="flex gap-2">
        <input
          v-model="apiKeyInput"
          type="text"
          placeholder="Collez votre clé API..."
          class="flex-1 px-3 py-1.5 border border-amber-300 rounded text-sm"
          @keydown.enter="saveKey"
        />
        <button
          class="px-4 py-1.5 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
          @click="saveKey"
        >
          Enregistrer
        </button>
      </div>
    </div>

    <!-- Saved sessions -->
    <div v-if="sessions.length > 0" class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer"
        @click="openSession(session.id)"
      >
        <div>
          <h3 class="font-medium text-slate-800">{{ session.name }}</h3>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ session.investments.length }} investissement(s) ·
            Benchmark: {{ session.benchmarkTicker }} ·
            Modifié le {{ formatDate(session.updatedAt) }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            class="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Supprimer"
            @click.stop="deleteSession(session.id)"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="text-center py-20 text-slate-400"
    >
      <div class="text-5xl mb-4">📊</div>
      <p class="text-lg">Aucune comparaison sauvegardée</p>
      <p class="text-sm mt-1">Créez votre première comparaison pour commencer.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStorage } from '@app/composables/useSessionStorage'
import { getApiKey, setApiKey } from '@infra/api/apiKeyManager'
import { formatDate } from '@shared/formatters'

const router = useRouter()
const { sessions, loadAll, remove } = useSessionStorage()

const hasApiKey = ref(false)
const apiKeyInput = ref('')

onMounted(async () => {
  await loadAll()
  const key = await getApiKey()
  hasApiKey.value = key.length > 0
})

function createNew() {
  router.push({ name: 'compare' })
}

function openSession(id: string) {
  router.push({ name: 'compare', params: { id } })
}

async function deleteSession(id: string) {
  if (confirm('Supprimer cette comparaison ?')) {
    await remove(id)
  }
}

async function saveKey() {
  if (apiKeyInput.value.trim()) {
    await setApiKey(apiKeyInput.value.trim())
    hasApiKey.value = true
  }
}
</script>
