import type { ComparisonSession } from '@domain/models/ComparisonSession'

/**
 * Port — Persistance des sessions de comparaison
 *
 * Abstraction sur le stockage (IndexedDB, localStorage, etc.)
 */
export interface SessionStoragePort {
  /** Sauvegarde ou met à jour une session */
  save(session: ComparisonSession): Promise<void>

  /** Récupère une session par son ID */
  getById(id: string): Promise<ComparisonSession | undefined>

  /** Liste toutes les sessions sauvegardées */
  getAll(): Promise<ComparisonSession[]>

  /** Supprime une session */
  delete(id: string): Promise<void>
}
