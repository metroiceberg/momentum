// Domain model and progression rules for the Mountains-to-Mole-Hills hierarchy
// (docs/08_Feature_Ideas.md).
//
// A Mountain Range contains Mountains; each Mountain contains Mole Hills; each
// Mole Hill contains Missions (the user's next achievable steps, per ADR-0001).
//
// This module is intentionally a pure, framework-free rule set: it only encodes
// the hierarchy types and the rules for advancing through them. The live
// Progression state is owned by App (ADR-0001). There is no persistence, AI
// decomposition, or hierarchy editor here — a Mission becomes part of a hill
// when the user states it (Begin Today / Inbox promotion).

import type { Mission } from './mission'

export interface MoleHill {
  /** Stable identifier for the hill. */
  id: string
  /** Human-readable name. */
  name: string
  /** The achievable steps that must be completed before the hill is climbed. */
  missions: Mission[]
}

export interface Mountain {
  id: string
  name: string
  hills: MoleHill[]
}

export interface MountainRange {
  id: string
  name: string
  mountains: Mountain[]
}

/**
 * The current position in the hierarchy. Everything needed to answer "what is
 * the user's current actionable Mission and what comes next".
 */
export interface Progression {
  range: MountainRange
  /** Index of the current Mountain within range.mountains. */
  mountainIndex: number
  /** Index of the current Mole Hill within that Mountain's hills. */
  hillIndex: number
  /** Index of the current Mission within that Hill's missions. */
  missionIndex: number
}

/** Start a progression at the first Mountain, first Hill, first Mission. */
export function createProgression(range: MountainRange): Progression {
  return { range, mountainIndex: 0, hillIndex: 0, missionIndex: 0 }
}

export function mountainOf(p: Progression): Mountain {
  return p.range.mountains[p.mountainIndex]
}

export function hillOf(p: Progression): MoleHill {
  return mountainOf(p).hills[p.hillIndex]
}

/**
 * The user's current actionable Mission, if the current Hill has one.
 * A Hill with no Missions yet has no current Mission (Begin Today flow).
 */
export function currentMission(p: Progression): Mission | undefined {
  return hillOf(p).missions[p.missionIndex]
}

/** Number of Missions in the current Hill already marked done. */
export function completedMissionsInHill(p: Progression): number {
  return hillOf(p).missions.filter((m) => m.status === 'done').length
}

/** Number of Missions in the current Hill. */
export function missionsInHill(p: Progression): number {
  return hillOf(p).missions.length
}

/**
 * Milestones surfaced to the user when progression reaches them.
 * `mission-completed` is routine progress; the others are celebratory.
 */
export type ProgressionEvent =
  | { type: 'mission-completed'; mission: Mission }
  | { type: 'hill-climbed'; hill: MoleHill; mountain: Mountain }
  | { type: 'mountain-conquered'; mountain: Mountain; range: MountainRange }
  | { type: 'range-complete'; range: MountainRange }

export interface AdvanceResult {
  /**
   * The Progression after this advance, or null when the final Mission of the
   * final Mountain has been completed (the whole Range is conquered).
   */
  next: Progression | null
  /** Every event produced by this single advance, in order. */
  events: ProgressionEvent[]
  /** Subset of `events` that are milestones (hill-climbed and above). */
  milestones: ProgressionEvent[]
}

/**
 * Advance one step through the hierarchy: complete the current Mission, then
 * apply the progression rules:
 *
 * 1. Move to the next Mission in the current Hill when one exists.
 * 2. When all Missions in the Mole Hill are complete, declare the Hill climbed
 *    and move to the next Hill.
 * 3. When all Hills in the Mountain are complete, declare the Mountain
 *    conquered and move to the next Mountain.
 * 4. Continue through the Range; the final Mission yields a Range-complete
 *    milestone and `next === null`.
 *
 * A single advance may cascade (e.g. finishing a Mountain's last Mission climbs
 * its last Hill and conquers the Mountain at the same time); every transition
 * is reported in `events`/`milestones`.
 */
export function advanceProgression(p: Progression): AdvanceResult {
  const mission = currentMission(p)
  if (!mission) return { next: p, events: [], milestones: [] }

  const completed: Mission = { ...mission, status: 'done' }
  const events: ProgressionEvent[] = [
    { type: 'mission-completed', mission: completed },
  ]
  const milestones: ProgressionEvent[] = []

  // Reflect the completed Mission in a new Range (pure update).
  const nextRange = withMissionDone(p.range, p.mountainIndex, p.hillIndex, p.missionIndex)

  // 1. A next Mission exists within this Hill.
  if (p.missionIndex < hillOf(p).missions.length - 1) {
    return {
      next: {
        range: nextRange,
        mountainIndex: p.mountainIndex,
        hillIndex: p.hillIndex,
        missionIndex: p.missionIndex + 1,
      },
      events,
      milestones,
    }
  }

  // 2. The Hill is now complete.
  const hill = hillOf(p)
  const mountain = mountainOf(p)
  const climbed: ProgressionEvent = { type: 'hill-climbed', hill, mountain }
  events.push(climbed)
  milestones.push(climbed)

  if (p.hillIndex < mountain.hills.length - 1) {
    return {
      next: {
        range: nextRange,
        mountainIndex: p.mountainIndex,
        hillIndex: p.hillIndex + 1,
        missionIndex: 0,
      },
      events,
      milestones,
    }
  }

  // 3. The Mountain is now complete.
  const conquered: ProgressionEvent = { type: 'mountain-conquered', mountain, range: p.range }
  events.push(conquered)
  milestones.push(conquered)

  if (p.mountainIndex < p.range.mountains.length - 1) {
    return {
      next: {
        range: nextRange,
        mountainIndex: p.mountainIndex + 1,
        hillIndex: 0,
        missionIndex: 0,
      },
      events,
      milestones,
    }
  }

  // 4. The whole Range is complete.
  const rangeDone: ProgressionEvent = { type: 'range-complete', range: p.range }
  events.push(rangeDone)
  milestones.push(rangeDone)
  return { next: null, events, milestones }
}

/**
 * Add a Mission to the current Hill. Returns a new Progression; the input is
 * not mutated.
 *
 * If the Hill had no current actionable Mission yet, the new Mission becomes
 * current. Otherwise the existing current Mission stays focused so adding a
 * Mission never yanks focus away from an in-progress step.
 */
export function addMission(p: Progression, mission: Mission): Progression {
  const hill = hillOf(p)
  const missions = [...hill.missions, mission]
  const hills = mountainOf(p).hills.map((h, i) =>
    i === p.hillIndex ? { ...h, missions } : h,
  )
  const mountains = p.range.mountains.map((m, i) =>
    i === p.mountainIndex ? { ...m, hills } : m,
  )
  const range: MountainRange = { ...p.range, mountains }
  const wasEmpty = hill.missions.length === 0
  return {
    range,
    mountainIndex: p.mountainIndex,
    hillIndex: p.hillIndex,
    missionIndex: wasEmpty ? missions.length - 1 : p.missionIndex,
  }
}

/** Return a copy of `range` with the Mission at the given position marked done. */
function withMissionDone(
  range: MountainRange,
  mountainIndex: number,
  hillIndex: number,
  missionIndex: number,
): MountainRange {
  const missions = range.mountains[mountainIndex].hills[hillIndex].missions.map(
    (m, i) => (i === missionIndex ? { ...m, status: 'done' as const } : m),
  )
  const hills = range.mountains[mountainIndex].hills.map((h, i) =>
    i === hillIndex ? { ...h, missions } : h,
  )
  const mountains = range.mountains.map((m, i) =>
    i === mountainIndex ? { ...m, hills } : m,
  )
  return { ...range, mountains }
}
