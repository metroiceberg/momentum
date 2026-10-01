// Root application component.
// Coordinates the major sections of the application and owns the
// application-level progression state (ADR-0001), distributing it downward.

import { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Inbox from './components/Inbox'
import History from './components/History'
import Celebration from './components/Celebration'
import {
  createProgression,
  addMission,
  performAction,
  currentMission,
  mountainOf,
  hillOf,
  completedMissionsInHill,
  missionsInHill,
} from './services/progression'
import { createDemoRange } from './services/demoRange'
import type { Mission } from './services/mission'
import type { MissionAction, ProgressionEvent } from './services/progression'
import { createPersistedState, loadPersistedState, savePersistedState } from './services/persistence'

/// A fresh default progression used when no persisted application state exists.
function freshProgression() {
  return createProgression(createDemoRange())
}

function App() {
  const [persistedState] = useState(loadPersistedState)
  const [progression, setProgression] = useState(
    () => persistedState?.progression ?? freshProgression(),
  )
  const [history, setHistory] = useState<Mission[]>(() => persistedState?.history ?? [])
  const [inbox, setInbox] = useState<string[]>(() => persistedState?.inbox ?? [])
  const [draft, setDraft] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [celebration, setCelebration] = useState<ProgressionEvent[] | null>(null)
  const [rangeComplete, setRangeComplete] = useState(
    () => persistedState?.rangeComplete ?? false,
  )

  useEffect(() => {
    savePersistedState(createPersistedState(progression, history, inbox, rangeComplete))
  }, [progression, history, inbox, rangeComplete])

  const mission = currentMission(progression) ?? null
  const mountain = mountainOf(progression)
  const hill = hillOf(progression)
  const breadcrumb = `${progression.range.name} › ${mountain.name} › ${hill.name}`

  const totalInHill = missionsInHill(progression)
  const doneInHill = completedMissionsInHill(progression)
  const hillProgress =
    totalInHill > 0 ? `${doneInHill} of ${totalInHill} missions in this hill` : 'New hill'

  function handleBegin(nextStep: string) {
    setProgression((p) =>
      addMission(p, { goal: 'Today', nextStep, status: 'not-started' }),
    )
    setDraft('')
    setShowForm(false)
  }

  function handleAdvance() {
    const m = currentMission(progression)
    if (!m) return
    const action: MissionAction = m.status === 'not-started' ? 'start' : 'complete'
    const result = performAction(progression, action)
    if (result.completedMission) {
      setHistory((current) => [...current, result.completedMission!])
    }
    setProgression(result.progression)
    if (result.rangeComplete) {
      setRangeComplete(true)
    }
    if (result.milestones.length > 0) {
      setCelebration(result.milestones)
    }
  }

  function handleContinue() {
    if (rangeComplete) {
      setProgression(freshProgression())
      setRangeComplete(false)
    }
    setCelebration(null)
  }

  function handleCapture(text: string) {
    setInbox((current) => [...current, text])
  }

  function handleMakeMission(index: number) {
    const text = inbox[index]
    if (text === undefined) return
    setProgression((p) =>
      addMission(p, { goal: 'Today', nextStep: text, status: 'not-started' }),
    )
    setInbox((current) => current.filter((_, i) => i !== index))
  }

  const canSubmit = draft.trim().length > 0
  const advanceLabel =
    mission === null ? null : mission.status === 'not-started' ? 'Start' : 'Mark done'

  return (
    <>
      <Header title="MOMENTUM" />
      <div className="layout">
        <Sidebar
          breadcrumb={breadcrumb}
          hillProgress={hillProgress}
          mission={mission}
          onAdvance={handleAdvance}
        />
        <main className="content">
          {celebration ? (
            <Celebration
              milestones={celebration}
              onContinue={handleContinue}
              rangeComplete={rangeComplete}
            />
          ) : mission ? (
            <section>
              <h2>Today's next step</h2>
              <p className="content-step">{mission.nextStep}</p>
              <p className="content-progress">{hillProgress}</p>
              <button onClick={handleAdvance}>{advanceLabel}</button>
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
          <Inbox items={inbox} onAdd={handleCapture} onMakeMission={handleMakeMission} />
          <History missions={history} />
        </main>
      </div>
    </>
  )
}

export default App
