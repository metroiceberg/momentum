// The persistent Mission Anchor (ADR-0001): an always-visible representation
// of the user's current mission / next achievable step and its status.
//
// Milestone 2 keeps this focused on the current actionable Mission; the
// Mountain > Hill context is shown only as a compact breadcrumb + progress
// indicator, so the hierarchy supports progression without turning the panel
// into a project-management dashboard.

import { MISSION_STATUS_LABELS } from '../services/mission'
import type { Mission } from '../services/mission'

interface SidebarProps {
  /** Compact hierarchy context, e.g. "Mountain One › Build". */
  breadcrumb: string
  /** "1 of 3" style progress within the current hill. */
  hillProgress: string
  /** The user's current actionable Mission, or null when the hill is empty. */
  mission: Mission | null
  onAdvance: () => void
}

export default function Sidebar({
  breadcrumb,
  hillProgress,
  mission,
  onAdvance,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2>Mission</h2>
      <p className="mission-breadcrumb">
        {breadcrumb} · <span className="mission-hill-progress">{hillProgress}</span>
      </p>
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
          No mission here yet. Begin Today to set your next step.
        </p>
      )}
    </aside>
  )
}
