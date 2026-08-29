// Domain model for the Mission Engine's core concept: a user's next
// achievable step and its progress through the behavioral-activation loop
// (ADR-0001).

export type MissionStatus = 'not-started' | 'in-progress' | 'done'

export interface Mission {
  /** The broader goal the next step belongs to. */
  goal: string
  /** The concrete next achievable step. */
  nextStep: string
  /** Current progress through the loop. */
  status: MissionStatus
}

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
}

/** Advance a mission to the next status in the loop. */
export function advanceStatus(status: MissionStatus): MissionStatus {
  if (status === 'not-started') return 'in-progress'
  return 'done'
}
