<template>
  <span class="inline-flex items-center gap-1 text-xs text-slate-400">
    <kbd class="kbd">{{ displayKey }}</kbd>
    <span v-if="label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  keys: string // e.g. "Ctrl+N"
  label?: string
}>()

const displayKey = computed(() => {
  // Convert modifier names for macOS display
  return props.keys
    .replace('Ctrl', '⌘')
    .replace('Alt', '⌥')
    .replace('Shift', '⇧')
})
</script>
