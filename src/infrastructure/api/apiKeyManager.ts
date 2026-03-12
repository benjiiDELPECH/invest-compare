import { DEFAULT_PREFERENCES } from '@shared/constants'
import type { UserPreferences } from '@shared/types'
import { getDB } from '../storage/schema'

/**
 * Gestionnaire de clé API et préférences utilisateur
 *
 * Stocke dans IndexedDB les préférences persistantes.
 */
export async function loadPreferences(): Promise<UserPreferences> {
  const db = await getDB()
  const prefs = await db.get('preferences', 'default')
  return prefs ?? { ...DEFAULT_PREFERENCES }
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  const db = await getDB()
  await db.put('preferences', prefs, 'default')
}

export async function getApiKey(): Promise<string> {
  const prefs = await loadPreferences()
  return prefs.apiKey
}

export async function setApiKey(key: string): Promise<void> {
  const prefs = await loadPreferences()
  await savePreferences({ ...prefs, apiKey: key })
}
