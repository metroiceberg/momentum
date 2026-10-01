import { describe, it, expect } from 'vitest'
import {
  createPersistedState,
  loadPersistedState,
  savePersistedState,
} from './persistence'
import { createProgression } from './progression'
import type { Progression } from './progression'

function buildProgression() {
  return createProgression({
    id: 'range-test',
    name: 'Test Range',
    mountains: [
      {
        id: 'mountain-test',
        name: 'Test Mountain',
        hills: [
          { id: 'hill-test', name: 'Test Hill', missions: [] },
        ],
      },
    ],
  })
}

function createMemoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('persistence', () => {
  it('saves and loads the application state', () => {
    const storage = createMemoryStorage()
    const progression = buildProgression()
    const state = createPersistedState(
      progression,
      [{ goal: 'Today', nextStep: 'Walk', status: 'done' }],
      ['Call the bank'],
      false,
    )

    savePersistedState(state, storage)

    expect(loadPersistedState(storage)).toEqual(state)
  })

  it('returns null when no saved state exists', () => {
    expect(loadPersistedState(createMemoryStorage())).toBeNull()
  })

  it('ignores an unsupported persistence version', () => {
    const storage = createMemoryStorage()
    storage.setItem(
      'momentum.state',
      JSON.stringify({ version: 999, progression: {}, history: [], inbox: [], rangeComplete: false }),
    )

    expect(loadPersistedState(storage)).toBeNull()
  })

  it('survives malformed stored JSON by returning null', () => {
    const storage = createMemoryStorage()
    storage.setItem('momentum.state', '{not-json')

    expect(loadPersistedState(storage)).toBeNull()
  })

  it('falls back when the stored range cannot resolve a Mountain', () => {
    const storage = createMemoryStorage()
    const progression = buildProgression()
    progression.range.mountains = []

    storage.setItem(
      'momentum.state',
      JSON.stringify(createPersistedState(progression, [], [], false)),
    )

    expect(loadPersistedState(storage)).toBeNull()
  })

  it('falls back when a History entry is malformed', () => {
    const storage = createMemoryStorage()
    storage.setItem(
      'momentum.state',
      JSON.stringify({ version: 1, progression: buildProgression(), history: [null], inbox: [], rangeComplete: false }),
    )

    expect(loadPersistedState(storage)).toBeNull()
  })

  it('falls back when missionIndex is out of bounds for the current Hill', () => {
    const storage = createMemoryStorage()
    const progression: Progression = {
      ...buildProgression(),
      range: {
        id: 'r',
        name: 'R',
        mountains: [
          {
            id: 'm',
            name: 'M',
            hills: [
              {
                id: 'h',
                name: 'H',
                missions: [{ goal: 'g', nextStep: 's', status: 'not-started' as const }],
              },
            ],
          },
        ],
      },
      missionIndex: 5,
    }

    storage.setItem(
      'momentum.state',
      JSON.stringify(createPersistedState(progression, [], [], false)),
    )

    expect(loadPersistedState(storage)).toBeNull()
  })

  it('loads a valid state whose current Hill has a Mission', () => {
    const storage = createMemoryStorage()
    const progression: Progression = {
      ...buildProgression(),
      range: {
        id: 'r',
        name: 'R',
        mountains: [
          {
            id: 'm',
            name: 'M',
            hills: [
              {
                id: 'h',
                name: 'H',
                missions: [{ goal: 'g', nextStep: 's', status: 'not-started' as const }],
              },
            ],
          },
        ],
      },
    }

    const state = createPersistedState(progression, [], [], false)
    savePersistedState(state, storage)

    expect(loadPersistedState(storage)).toEqual(state)
  })
})
