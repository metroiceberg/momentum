# Project Milestones

## Milestone 0 — Foundation

**Date:** June 29, 2026

Project MOMENTUM officially began.

* Development environment established.
* React, TypeScript, and Vite project created.
* Git repository initialized.
* First commit completed.
* Documentation framework established.
* Product philosophy defined.
* Sprint 0 initiated.

Status: Complete

---

## Milestone 1 — First Light

**Status:** Complete (interface continues to be extended)

The first custom version of MOMENTUM successfully replaces the default Vite application and displays the project's own interface.

Delivered so far:

* **Persistent Mission Anchor (Sidebar)** — an always-visible panel holding the
  current Mission (goal, next step, status) and its action loop
  (Not started → In Progress → Done), per ADR-0001.
* **Begin Today flow** — creates a Mission from a stated next achievable step.
* **Inbox / Capture surface** — captures unstructured thoughts/tasks into a
  simple in-memory list.
* **Inbox → Mission promotion** — a captured item can be promoted into the
  current Mission via a "Make Mission" action.
* **Completed-Mission handling** — a `done` Mission clears the main pane and
  offers "Begin a new mission" while remaining visible in the Mission Anchor.
* **Mission History** — completed Missions are retained in a simple in-memory
  history list so completed work is not lost.

All state is in-memory and owned by `App` (unidirectional flow, ADR-0001). No
persistence, router, or AI layer yet.

---

## Milestone 2 — First Conquest

**Status:** Complete

Establishes the minimum hierarchical progression engine
(**Mountain Range → Mountain → Mole Hill → Mission**) on top of the First Light
Mission Anchor, so a user can experience a full conquest:
Mission complete → advance → **Hill Climbed!** → **Mountain Conquered!**

Delivered:

* **Hierarchy domain model** — `MountainRange`, `Mountain`, `MoleHill`,
  `Mission`, and a `Progression` cursor (`src/services/progression.ts`).
* **Progression engine** — completes the current Mission, advances within a
  Hill, then declares Hill Climbed / Mountain Conquered / Range Conquered as
  the hierarchy is exhausted. Pure and framework-free.
* **Celebration surface** — completing a Hill, Mountain, or the whole Range is
  announced visibly and celebratorily, so progress is felt, not silent.
* **Hierarchy context in the Mission Anchor** — a compact breadcrumb
  (Range › Mountain › Hill) and an in-Hill progress indicator, keeping the
  panel focused on the current actionable Mission (ADR-0001).
* **Seed example Range** — one in-memory Range with named Hills so the full
  conquest is experienceable; Missions remain user-supplied via the existing
  Begin Today / Inbox promotion flows (ADR-0001).
* **Tests** — Vitest unit tests covering every progression branch
  (`src/services/progression.test.ts`).
* **Documentation** — `docs/04_Mission_Engine.md` and
  `docs/adr/0002-mountains-to-mole-hills-progression.md`.

Explicitly out of scope and not implemented: persistence, AI decomposition,
recurring maintenance, rewards, accounts, multi-range management, and a
hierarchy editor.


## Milestone 3 — First Persistence

**Status:** In progress

Introduces the first durable application state without introducing accounts,
backend infrastructure, synchronization, or an external data service.

Delivered so far:

* **Local persistence service** — versioned browser-local storage for the current
  Progression, Mission History, Inbox, and Range completion state.
* **Startup restoration** — MOMENTUM restores the saved application state when
  the browser loads instead of starting from a fresh in-memory session.
* **Automatic saves** — meaningful application-state changes are written back
  to local storage through the application-level state owner in `App`.
* **Graceful fallback** — missing, malformed, unsupported, or inaccessible
  storage falls back to a fresh in-memory session rather than preventing the
  application from starting.
* **Persistence tests** — round-trip, empty-storage, unsupported-version, and
  malformed-data behavior are covered in `src/services/persistence.test.ts`.

Still to come in this milestone:

* Validate the persisted state against the evolving domain model as the
  hierarchy becomes user-owned.
* Decide whether and how persisted state should be reset or migrated when the
  domain schema changes.

Persistence remains intentionally local-only. Accounts, backend storage,
synchronization, multi-device state, and user-owned hierarchy management remain
future work.

---
