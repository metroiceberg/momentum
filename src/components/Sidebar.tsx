// The persistent Mission Anchor (ADR-0001): an always-visible representation
// of the user's current mission / next achievable step and its status.

import { MISSION_STATUS_LABELS } from '../services/mission'
import type { Mission } from '../services/mission'

interface SidebarProps {
  mission: Mission | null
  onAdvance: () => void
}

export default function Sidebar({ mission, onAdvance }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2>Mission</h2>
      {mission ? (
        <>
          <p className="mission-goal">{mission.goal}</p>
          <p className="mission-step">{mission.nextStep}</p>
          <p className="mission-status">{MISSION_STATUS_LABELS[mission.status]}</p>
          {mission.status !== 'done' && (
            <button onClick={onAdvance}>
              {mission.status === 'not-started' ? 'Start' : 'Mark done'}
            </button>
          )}
        </>
      ) : (
        <p className="mission-empty">
          No mission yet. Begin Today to set your next step.
        </p>
      )}
    </aside>
  )
}
