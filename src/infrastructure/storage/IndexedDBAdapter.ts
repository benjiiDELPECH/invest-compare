import type { ComparisonSession } from '@domain/models/ComparisonSession'
import type { SessionStoragePort } from '@domain/ports/SessionStoragePort'
import { getDB } from './schema'

/**
 * Adapter — IndexedDB pour la persistance des sessions
 *
 * Implémente SessionStoragePort en utilisant IndexedDB via la lib `idb`.
 */
export class IndexedDBAdapter implements SessionStoragePort {
  async save(session: ComparisonSession): Promise<void> {
    const db = await getDB()
    await db.put('sessions', session)
  }

  async getById(id: string): Promise<ComparisonSession | undefined> {
    const db = await getDB()
    return db.get('sessions', id)
  }

  async getAll(): Promise<ComparisonSession[]> {
    const db = await getDB()
    // Triées par date de modification décroissante
    const all = await db.getAllFromIndex('sessions', 'by-updated')
    return all.reverse()
  }

  async delete(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('sessions', id)
  }
}
