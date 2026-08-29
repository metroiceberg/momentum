//Root application component.
// Coordinates the major sections of the application and owns the
// application-level mission state (ADR-0001), distributing it downward.

import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { advanceStatus } from './services/mission'
import type { Mission } from './services/mission'

function App() {
  const [mission, setMission] = useState<Mission | null>(null)
  const [draft, setDraft] = useState('')
  const [showForm, setShowForm] = useState(false)

  function handleBegin(nextStep: string) {
    setMission({ goal: 'Today', nextStep, status: 'not-started' })
    setDraft('')
    setShowForm(false)
  }

  function handleAdvance() {
    setMission((current) =>
      current ? { ...current, status: advanceStatus(current.status) } : current
    )
  }

  function handleNewMission() {
    setMission(null)
    setShowForm(true)
  }

  const canSubmit = draft.trim().length > 0

  return (
    <>
      <Header title="MOMENTUM" />
      <div className="layout">
        <Sidebar mission={mission} onAdvance={handleAdvance} />
        <main className="content">
          {mission ? (
            <section>
              <h2>Today's next step</h2>
              <p className="content-step">{mission.nextStep}</p>
              <button onClick={handleNewMission}>Begin a new mission</button>
            </section>
          ) : (
            <section>
              <h2>Begin Today</h2>
              {showForm ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (canSubmit) handleBegin(draft.trim())
                  }}
                >
                  <label htmlFor="next-step">What's your next achievable step?</label>
                  <input
                    id="next-step"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="e.g. Take a 10-minute walk"
                  />
                  <button type="submit" disabled={!canSubmit}>
                    Set my next step
                  </button>
                </form>
              ) : (
                <button onClick={() => setShowForm(true)}>Begin Today</button>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default App
