<template>
  <div class="status-bar">
    <span>{{ investmentCount }} investissement(s)</span>
    <span>|</span>
    <span>{{ regimeLabel }}</span>
    <span class="ml-auto text-xs text-slate-400">
      <kbd class="kbd">Ctrl+N</kbd> Nouvelle ligne
      <kbd class="kbd ml-2">Ctrl+S</kbd> Sauvegarder
      <kbd class="kbd ml-2">Ctrl+E</kbd> Exporter CSV
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const investmentCount = computed(() => 0) // Will be wired up via provide/inject
const regimeLabel = computed(() => {
  return 'PFU 30%'
})
</script>
