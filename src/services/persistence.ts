// Browser persistence for the current MOMENTUM session state.
//
// Persistence is intentionally local-only at this milestone: no account,
// backend, sync, or external storage is introduced yet. Transient UI state
// (draft text, forms, celebrations) is deliberately not persisted.

import type { Mission } from './mission'
import type { Progression } from './progression'

const STORAGE_KEY = 'momentum.state'
const STORAGE_VERSION = 1

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface PersistedState {
  version: number
  progression: Progression
  history: Mission[]
  inbox: string[]
  rangeComplete: boolean
}

export function loadPersistedState(storage: StorageLike | null = browserStorage()): PersistedState | null {
  if (!storage) return null

  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isPersistedState(parsed)) return null

    return parsed
  } catch {
    // Corrupt, unavailable, or inaccessible storage should never prevent the
    // application from starting with a fresh in-memory state.
    return null
  }
}

export function savePersistedState(
  state: PersistedState,
  storage: StorageLike | null = browserStorage(),
): void {
  if (!storage) return

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Persistence is an enhancement at this milestone. A storage failure must
    // not interrupt the user's active session.
  }
}

export function createPersistedState(
  progression: Progression,
  history: Mission[],
  inbox: string[],
  rangeComplete: boolean,
): PersistedState {
  return {
    version: STORAGE_VERSION,
    progression,
    history,
    inbox,
    rangeComplete,
  }
}

function browserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  if (candidate.version !== STORAGE_VERSION) return false
  if (!candidate.progression || typeof candidate.progression !== 'object') return false
  if (!Array.isArray(candidate.history)) return false
  if (!Array.isArray(candidate.inbox) || !candidate.inbox.every((item) => typeof item === 'string')) return false
  if (typeof candidate.rangeComplete !== 'boolean') return false

  const progression = candidate.progression as Record<string, unknown>
  return (
    typeof progression.mountainIndex === 'number' &&
    typeof progression.hillIndex === 'number' &&
    typeof progression.missionIndex === 'number' &&
    Number.isInteger(progression.mountainIndex) &&
    Number.isInteger(progression.hillIndex) &&
    Number.isInteger(progression.missionIndex) &&
    progression.range !== null &&
    typeof progression.range === 'object'
  )
}
