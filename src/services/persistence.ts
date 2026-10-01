// Browser persistence for the current MOMENTUM session state.
//
// Persistence is intentionally local-only at this milestone: no account,
// backend, sync, or external storage is introduced yet. Transient UI state
// (draft text, forms, celebrations) is deliberately not persisted.

import type { Mission } from './mission'
import type { Progression, MoleHill, MountainRange } from './progression'

const STORAGE_KEY = 'momentum.state'
const STORAGE_VERSION = 1

const MISSION_STATUSES = new Set(['not-started', 'in-progress', 'done'])

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
  if (!isProgression(candidate.progression)) return false
  // History items are rendered directly (nextStep, status) — reject malformed
  // entries so a corrupt saved list cannot crash the History surface.
  if (!Array.isArray(candidate.history) || !candidate.history.every(isMission)) return false
  if (!Array.isArray(candidate.inbox) || !candidate.inbox.every((item) => typeof item === 'string')) return false
  if (typeof candidate.rangeComplete !== 'boolean') return false

  return true
}

/**
 * Validate that a stored Progression is structurally render-safe: resolving
 * its indices must yield a real Mountain and Mole Hill, and its Missions must
 * be well-formed. Anything else is rejected so loaders fall back to a fresh
 * in-memory session rather than crashing at render (graceful fallback).
 */
function isProgression(value: unknown): value is Progression {
  if (!value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>

  if (
    !Number.isInteger(p.mountainIndex) ||
    !Number.isInteger(p.hillIndex) ||
    !Number.isInteger(p.missionIndex) ||
    !isMountainRange(p.range)
  ) {
    return false
  }

  const range = p.range as MountainRange
  const mountain = range.mountains[p.mountainIndex as number]
  if (!mountain) return false
  const hill = mountain.hills[p.hillIndex as number]
  if (!hill) return false

  // `missionIndex` must be a valid position in the current Hill. An empty Hill
  // is valid and points at index 0 (no current Mission yet).
  return hill.missions.length === 0
    ? p.missionIndex === 0
    : (p.missionIndex as number) >= 0 && (p.missionIndex as number) < hill.missions.length
}

function isMountainRange(value: unknown): value is MountainRange {
  if (!value || typeof value !== 'object') return false
  const r = value as Record<string, unknown>
  return (
    typeof r.name === 'string' &&
    Array.isArray(r.mountains) &&
    r.mountains.length > 0 &&
    r.mountains.every(isMountain)
  )
}

function isMountain(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const m = value as Record<string, unknown>
  return Array.isArray(m.hills) && m.hills.length > 0 && m.hills.every(isMoleHill)
}

function isMoleHill(value: unknown): value is MoleHill {
  if (!value || typeof value !== 'object') return false
  const h = value as Record<string, unknown>
  return Array.isArray(h.missions) && h.missions.every(isMission)
}

function isMission(value: unknown): value is Mission {
  if (!value || typeof value !== 'object') return false
  const m = value as Record<string, unknown>
  return (
    typeof m.goal === 'string' &&
    typeof m.nextStep === 'string' &&
    typeof m.status === 'string' &&
    MISSION_STATUSES.has(m.status)
  )
}
