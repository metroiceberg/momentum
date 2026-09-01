// The Mission History surface: a simple in-memory list of completed Missions.
// Presentational — the history list is application-level state owned by App
// (ADR-0001), passed down as props. Renders nothing when there is no history.

import { MISSION_STATUS_LABELS } from '../services/mission'
import type { Mission } from '../services/mission'

interface HistoryProps {
  missions: Mission[]
}

export default function History({ missions }: HistoryProps) {
  if (missions.length === 0) return null

  return (
    <section className="history">
      <h2>History</h2>
      <ul className="history-list">
        {missions.map((mission, index) => (
          <li key={index} className="history-item">
            <span className="history-step">{mission.nextStep}</span>
            <span className="history-status">
              {MISSION_STATUS_LABELS[mission.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
