// Unit tests for the Mountain → Mole Hill → Mission progression engine
// (src/services/progression.ts). These encode the Milestone 2 progression
// rules: complete the current Mission, advance within the Hill, then declare
// Hill Climbed / Mountain Conquered / Range Conquered as the hierarchy is
// exhausted.

import { describe, it, expect } from 'vitest'
import {
  createProgression,
  advanceProgression,
  addMission,
  performAction,
  currentMission,
  completedMissionsInHill,
} from './progression'

// A two-Mountain, two-Hill-per-Mountain, two-Mission-per-Hill range gives every
// progression branch an explicit path to test.
function buildRange() {
  return {
    id: 'range-test',
    name: 'Test Range',
    mountains: [
      {
        id: 'm1',
        name: 'Mountain One',
        hills: [
          {
            id: 'h1a',
            name: 'Hill A',
            missions: [
              { goal: 'g', nextStep: 'A1', status: 'not-started' as const },
              { goal: 'g', nextStep: 'A2', status: 'not-started' as const },
            ],
          },
          {
            id: 'h1b',
            name: 'Hill B',
            missions: [
              { goal: 'g', nextStep: 'B1', status: 'not-started' as const },
              { goal: 'g', nextStep: 'B2', status: 'not-started' as const },
            ],
          },
        ],
      },
      {
        id: 'm2',
        name: 'Mountain Two',
        hills: [
          {
            id: 'h2a',
            name: 'Hill C',
            missions: [
              { goal: 'g', nextStep: 'C1', status: 'not-started' as const },
              { goal: 'g', nextStep: 'C2', status: 'not-started' as const },
            ],
          },
          {
            id: 'h2b',
            name: 'Hill D',
            missions: [
              { goal: 'g', nextStep: 'D1', status: 'not-started' as const },
            ],
          },
        ],
      },
    ],
  }
}

describe('createProgression', () => {
  it('starts at the first Mountain, first Hill, first Mission', () => {
    const p = createProgression(buildRange())
    expect(p.mountainIndex).toBe(0)
    expect(p.hillIndex).toBe(0)
    expect(p.missionIndex).toBe(0)
    expect(currentMission(p)?.nextStep).toBe('A1')
  })
})

describe('advanceProgression — advance to next Mission within a Hill', () => {
  it('completes the current Mission and moves to the next in the same Hill', () => {
    const p = createProgression(buildRange())
    const result = advanceProgression(p)

    expect(result.events).toHaveLength(1)
    expect(result.events[0]).toMatchObject({
      type: 'mission-completed',
      mission: { nextStep: 'A1', status: 'done' },
    })
    expect(result.milestones).toHaveLength(0)

    // Advanced one mission, same hill/mountain.
    expect(result.next?.mountainIndex).toBe(0)
    expect(result.next?.hillIndex).toBe(0)
    expect(result.next?.missionIndex).toBe(1)
    expect(currentMission(result.next!)?.nextStep).toBe('A2')
    expect(completedMissionsInHill(result.next!)).toBe(1)
  })
})

describe('advanceProgression — Hill Climbed', () => {
  it('declares Hill Climbed when the last Mission of a Hill completes', () => {
    const p = createProgression(buildRange())
    // Complete A1, then A2 (the last Mission of Hill A).
    const mid = advanceProgression(p).next!
    const result = advanceProgression(mid)

    // Completing A2 yields mission-completed + hill-climbed.
    expect(result.events.map((e) => e.type)).toEqual([
      'mission-completed',
      'hill-climbed',
    ])
    expect(result.milestones).toHaveLength(1)
    expect(result.milestones[0]).toMatchObject({ type: 'hill-climbed', hill: { id: 'h1a' } })

    // Advances to the next Hill's first Mission.
    expect(result.next?.hillIndex).toBe(1)
    expect(result.next?.missionIndex).toBe(0)
    expect(currentMission(result.next!)?.nextStep).toBe('B1')
  })

  it('does not declare a Hill climbed when earlier Missions remain undone', () => {
    // Complete only the first of two Missions — should stay a routine advance.
    const p = createProgression(buildRange())
    const result = advanceProgression(p)
    expect(result.milestones).toHaveLength(0)
  })
})

describe('advanceProgression — Mountain Conquered', () => {
  it('declares Mountain Conquered after the final Hill of a Mountain', () => {
    // Walk to the last Mission of Mountain One: B2.
    let p = createProgression(buildRange())
    p = advanceProgression(p).next! // A1 done -> A2
    p = advanceProgression(p).next! // A2 done -> Hill B, B1 (Hill A climbed)
    expect(currentMission(p)?.nextStep).toBe('B1')

    p = advanceProgression(p).next! // B1 done -> B2

    // Finishing B2 (the last Mission of Hill B, the last Hill of Mountain One)
    // climbs Hill B AND conquers Mountain One at the same time.
    const conquered = advanceProgression(p)
    expect(conquered.milestones.map((e) => e.type)).toEqual([
      'hill-climbed',
      'mountain-conquered',
    ])
    // Advances to Mountain Two, Hill C, Mission C1.
    expect(conquered.next?.mountainIndex).toBe(1)
    expect(conquered.next?.hillIndex).toBe(0)
    expect(currentMission(conquered.next!)?.nextStep).toBe('C1')
  })
})

describe('advanceProgression — Range Conquered', () => {
  it('returns next === null and declares Range Conquered at the very end', () => {
    // Advance through the whole range: A1,A2, B1,B2, C1,C2, D1.
    let p = createProgression(buildRange())
    // A1, A2
    p = advanceProgression(p).next!
    p = advanceProgression(p).next!
    // B1, B2
    p = advanceProgression(p).next!
    p = advanceProgression(p).next!
    // C1, C2
    p = advanceProgression(p).next!
    p = advanceProgression(p).next!
    // D1 (single Mission, last Hill of last Mountain)
    const finalAdvance = advanceProgression(p)

    expect(finalAdvance.milestones.map((e) => e.type)).toEqual([
      'hill-climbed',
      'mountain-conquered',
      'range-complete',
    ])
    expect(finalAdvance.next).toBeNull()
  })
})

describe('addMission', () => {
  it('makes the first Mission in an empty Hill the current one', () => {
    // Build a range whose first hill is empty.
    const range = buildRange()
    range.mountains[0].hills[0].missions = []
    let p = createProgression(range)

    expect(currentMission(p)).toBeUndefined()
    p = addMission(p, { goal: 'g', nextStep: 'Fresh', status: 'not-started' })
    expect(currentMission(p)?.nextStep).toBe('Fresh')
    expect(p.missionIndex).toBe(0)
  })

  it('does not yank focus from an in-progress Mission when another is added', () => {
    const p = createProgression(buildRange()) // current: A1
    const added = addMission(p, { goal: 'g', nextStep: 'Later', status: 'not-started' })

    expect(added.missionIndex).toBe(0)
    expect(currentMission(added)?.nextStep).toBe('A1')
    expect(added.range.mountains[0].hills[0].missions).toHaveLength(3)
  })
})

describe('empty current Hill', () => {
  it('advancing with no current Mission is a no-op', () => {
    const range = buildRange()
    range.mountains[0].hills[0].missions = []
    const p = createProgression(range)
    const result = advanceProgression(p)
    expect(result.events).toHaveLength(0)
    expect(result.next).toBe(p)
  })
})

describe('performAction — Start lifecycle', () => {
  it('moves a not-started Mission to in-progress without advancing the hierarchy', () => {
    const p = createProgression(buildRange()) // current: A1 (not-started)
    const result = performAction(p, 'start')

    // Start must not complete, record, or progress.
    expect(result.completedMission).toBeNull()
    expect(result.milestones).toEqual([])
    expect(result.rangeComplete).toBe(false)

    // The Mission stays the active anchor (cursor unmoved)…
    expect(result.progression.mountainIndex).toBe(0)
    expect(result.progression.hillIndex).toBe(0)
    expect(result.progression.missionIndex).toBe(0)
    // …now in-progress, not done.
    expect(currentMission(result.progression)?.status).toBe('in-progress')
  })

  it('repeated Start keeps the Mission in-progress without completing it', () => {
    let p = createProgression(buildRange())
    p = performAction(p, 'start').progression
    p = performAction(p, 'start').progression
    expect(currentMission(p)?.status).toBe('in-progress')
    expect(currentMission(p)?.nextStep).toBe('A1')
  })

  it('does nothing when the current Hill has no Mission', () => {
    const range = buildRange()
    range.mountains[0].hills[0].missions = []
    const p = createProgression(range)
    const result = performAction(p, 'start')
    expect(result.progression).toBe(p)
    expect(result.completedMission).toBeNull()
  })
})

describe('performAction — Complete lifecycle', () => {
  it('completes an in-progress Mission and advances to the next', () => {
    let p = createProgression(buildRange()) // A1 not-started
    p = performAction(p, 'start').progression // A1 in-progress
    const result = performAction(p, 'complete')

    expect(result.completedMission?.nextStep).toBe('A1')
    expect(result.completedMission?.status).toBe('done')
    // Progression advanced within the Hill (routine, no milestone).
    expect(currentMission(result.progression)?.nextStep).toBe('A2')
    expect(result.milestones).toEqual([])
    expect(result.rangeComplete).toBe(false)
  })

  it('surfaces the Hill Climbed milestone when completing a Hill\'s last Mission', () => {
    // Start+complete A1 -> A2, then complete A2 (climbs Hill A).
    let p = createProgression(buildRange())
    p = performAction(performAction(p, 'start').progression, 'complete').progression
    const result = performAction(p, 'complete')

    expect(result.completedMission?.nextStep).toBe('A2')
    expect(result.milestones.map((e) => e.type)).toEqual(['hill-climbed'])
    expect(currentMission(result.progression)?.nextStep).toBe('B1')
  })

  it('marks the Range complete and keeps the final Mission done at the end', () => {
    // Walk every Mission through the full Start then Complete loop.
    let p = createProgression(buildRange()) // A1
    for (let i = 0; i < 7; i++) {
      p = performAction(p, 'start').progression
      const result = performAction(p, 'complete')
      if (result.rangeComplete) {
        expect(result.completedMission?.nextStep).toBe('D1')
        expect(result.completedMission?.status).toBe('done')
        expect(result.milestones.map((e) => e.type)).toEqual([
          'hill-climbed',
          'mountain-conquered',
          'range-complete',
        ])
        // Terminal view keeps the final Mission marked done.
        expect(currentMission(result.progression)?.status).toBe('done')
        return
      }
      p = result.progression
    }
    throw new Error('expected the Range to complete within 7 Missions')
  })
})
