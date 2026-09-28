// The progression celebration surface. Rendered when the user reaches a
// milestone (Hill Climbed / Mountain Conquered / Range Conquered) so the
// achievement is visible and felt, rather than silently passing.
//
// Minimal and focused: it only explains what was achieved and offers the next
// step. Presentational — the milestone events are driven from App-level
// Progression state (ADR-0001).

import type { ProgressionEvent } from '../services/progression'

interface CelebrationProps {
  milestones: ProgressionEvent[]
  onContinue: () => void
  /** True when there is no next Mission (the whole Range is conquered). */
  rangeComplete: boolean
}

function describe(event: ProgressionEvent): { heading: string; detail: string } {
  switch (event.type) {
    case 'hill-climbed':
      return {
        heading: 'Hill Climbed!',
        detail: `You climbed the “${event.hill.name}” hill in ${event.mountain.name}.`,
      }
    case 'mountain-conquered':
      return {
        heading: 'Mountain Conquered!',
        detail: `You conquered ${event.mountain.name}.`,
      }
    case 'range-complete':
      return {
        heading: 'Mountain Range Conquered!',
        detail: `You conquered the whole ${event.range.name} range.`,
      }
    default:
      return { heading: '', detail: '' }
  }
}

export default function Celebration({ milestones, onContinue, rangeComplete }: CelebrationProps) {
  const entries = milestones.filter((e) => e.type !== 'mission-completed')
  if (entries.length === 0) return null

  return (
    <section className="celebration">
      {entries.map((event) => {
        const { heading, detail } = describe(event)
        return (
          <div key={event.type} className="celebration-entry">
            <h2 className="celebration-heading">{heading}</h2>
            <p className="celebration-detail">{detail}</p>
          </div>
        )
      })}
      <button className="celebration-action" onClick={onContinue}>
        {rangeComplete ? 'Start over' : 'Continue'}
      </button>
    </section>
  )
}
