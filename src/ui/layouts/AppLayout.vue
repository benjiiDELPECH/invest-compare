<template>
  <div class="flex flex-col h-screen">
    <!-- Top bar -->
    <header class="flex items-center justify-between h-10 px-4 bg-slate-800 text-white text-sm shrink-0">
      <div class="flex items-center gap-4">
        <router-link to="/" class="font-bold tracking-wide hover:text-sky-300 transition-colors">
          📊 InvestCompare
        </router-link>
        <nav class="flex gap-3 text-slate-300">
          <router-link to="/" class="hover:text-white transition-colors" active-class="text-white font-medium">
            Comparaisons
          </router-link>
          <router-link to="/learn" class="hover:text-white transition-colors" active-class="text-white font-medium">
            Apprendre
          </router-link>
        </nav>
      </div>
      <div class="flex items-center gap-3 text-slate-400 text-xs">
        <router-link to="/settings" class="hover:text-white transition-colors" active-class="text-white">
          ⚙️
        </router-link>
        <span>
          <kbd class="kbd">Ctrl+/</kbd> Aide
        </span>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 overflow-auto bg-gray-50">
      <slot />
    </main>

    <!-- Status bar -->
    <StatusBar />
  </div>
</template>

<script setup lang="ts">
import StatusBar from '@ui/components/shared/StatusBar.vue'
</script>
