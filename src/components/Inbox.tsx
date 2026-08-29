// The Capture / Inbox surface: a low-friction input for capturing an
// unstructured thought or task and displaying it in a simple list.
// Owns only its local draft-input state; the inbox list itself is
// application-level state owned by App (ADR-0001), passed down as props.

import { useState } from 'react'

interface InboxProps {
  items: string[]
  onAdd: (text: string) => void
}

export default function Inbox({ items, onAdd }: InboxProps) {
  const [draft, setDraft] = useState('')
  const canCapture = draft.trim().length > 0

  function handleSubmit() {
    if (canCapture) {
      onAdd(draft.trim())
      setDraft('')
    }
  }

  return (
    <section className="inbox">
      <h2>Inbox</h2>
      <form
        className="inbox-capture"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Capture a thought or task…"
          aria-label="Capture a thought or task"
        />
        <button type="submit" disabled={!canCapture}>
          Capture
        </button>
      </form>
      {items.length > 0 ? (
        <ul className="inbox-list">
        {items.map((item, index) => (
          <li key={index} className="inbox-item">
            {item}
          </li>
        ))}
        </ul>
      ) : (
        <p className="inbox-empty">Nothing captured yet.</p>
      )}
    </section>
  )
}
