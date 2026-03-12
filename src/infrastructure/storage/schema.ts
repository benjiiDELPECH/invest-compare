import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { IDB_NAME, IDB_VERSION } from '@shared/constants'
import type { ComparisonSession } from '@domain/models/ComparisonSession'
import type { MarketDataCacheEntry, UserPreferences } from '@shared/types'

/**
 * Schéma IndexedDB versionné
 *
 * 3 object stores :
 * - sessions       → ComparisonSession (clé: id)
 * - market-cache   → Cache des prix historiques (clé: key)
 * - preferences    → Préférences utilisateur (clé unique: 'default')
 */
export interface InvestCompareDB extends DBSchema {
  sessions: {
    key: string
    value: ComparisonSession
    indexes: {
      'by-updated': string
    }
  }
  'market-cache': {
    key: string
    value: MarketDataCacheEntry
  }
  preferences: {
    key: string
    value: UserPreferences
  }
}

let dbInstance: IDBPDatabase<InvestCompareDB> | null = null

export async function getDB(): Promise<IDBPDatabase<InvestCompareDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<InvestCompareDB>(IDB_NAME, IDB_VERSION, {
    upgrade(db) {
      // Sessions
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
        sessionStore.createIndex('by-updated', 'updatedAt')
      }

      // Cache de données de marché
      if (!db.objectStoreNames.contains('market-cache')) {
        db.createObjectStore('market-cache', { keyPath: 'key' })
      }

      // Préférences
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences')
      }
    },
  })

  return dbInstance
}
