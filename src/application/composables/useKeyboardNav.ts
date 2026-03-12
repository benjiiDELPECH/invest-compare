import { onMounted, onUnmounted } from 'vue'

export interface KeyBinding {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

/**
 * Composable — Navigation et raccourcis clavier Excel-like
 *
 * Enregistre les raccourcis clavier globaux et les nettoie au démontage.
 */
export function useKeyboardNav(bindings: KeyBinding[]) {
  function handleKeyDown(event: KeyboardEvent) {
    for (const binding of bindings) {
      const ctrlMatch = binding.ctrl ? (event.ctrlKey || event.metaKey) : true
      const shiftMatch = binding.shift ? event.shiftKey : !event.shiftKey
      const altMatch = binding.alt ? event.altKey : !event.altKey

      if (
        event.key.toLowerCase() === binding.key.toLowerCase() &&
        ctrlMatch &&
        shiftMatch &&
        altMatch
      ) {
        event.preventDefault()
        binding.action()
        return
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return { bindings }
}
