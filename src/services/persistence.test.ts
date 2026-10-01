import { describe, it, expect } from 'vitest'
import {
  createPersistedState,
  loadPersistedState,
  savePersistedState,
} from './persistence'
import { createProgression } from './progression'

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
})
