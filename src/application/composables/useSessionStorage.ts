import { ref, readonly } from 'vue'
import type { ComparisonSession } from '@domain/models/ComparisonSession'
import type { SessionStoragePort } from '@domain/ports/SessionStoragePort'
import { IndexedDBAdapter } from '@infra/storage/IndexedDBAdapter'

/**
 * Composable — CRUD des sessions dans IndexedDB
 */
const storage: SessionStoragePort = new IndexedDBAdapter()

export function useSessionStorage() {
  const sessions = ref<ComparisonSession[]>([])
  const loading = ref(false)

  async function loadAll() {
    loading.value = true
    try {
      sessions.value = await storage.getAll()
    } finally {
      loading.value = false
    }
  }

  async function save(session: ComparisonSession) {
    await storage.save(session)
    await loadAll()
  }

  async function loadById(id: string): Promise<ComparisonSession | undefined> {
    return storage.getById(id)
  }

  async function remove(id: string) {
    await storage.delete(id)
    await loadAll()
  }

  return {
    sessions: readonly(sessions),
    loading: readonly(loading),
    loadAll,
    save,
    loadById,
    remove,
  }
}
