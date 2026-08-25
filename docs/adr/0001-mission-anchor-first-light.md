# ADR-0001: First Light Interface and Sidebar Responsibility

- **Status:** Accepted
- **Date:** 2026-08-25
- **Decision maker:** Eric Moteberg (human maintainer)

## Problem

MOMENTUM is a behavioral-activation companion built around a "Mission Engine": its purpose is to help the user identify and act on their *next achievable step* rather than pursue perfection. The project has completed Milestone 0 (Foundation) and now faces Milestone 1 ("First Light") — replacing the placeholder Vite interface with MOMENTUM's own first real surface.

The immediate design question is: **what should the First Light interface be, and what responsibility should the planned Sidebar own?** The repository's history notes that the next objective is "defining the responsibility of the Sidebar before writing any implementation."

## Context

- The app is currently a minimal scaffold: a `Header`, a "Build 0.0.1a" label, and a non-functional "Begin Today" button. No router, no state layer, no domain model.
- Empty scaffolding directories (`navigation/`, `pages/`, `screens/`, `services/`, `hooks/`) signal future structure but no committed design.
- A documented engineering principle: *components should own the information other components depend upon*, with `App` owning application-level state and distributing it downward (unidirectional data flow).
- The product thesis is behavioral activation: reduce friction to starting, keep the next step visible and actionable.

## Options Considered

### Option A — Sidebar as Navigation (classic app shell)
A conventional two-pane layout where the Sidebar is a persistent navigation rail (Today · Missions · History · Settings), with "Today" as the default view.

- **UX:** Familiar wayfinding; users always know where they are.
- **Architecture:** Requires a router or view-state switch; the Sidebar owns current-view selection.
- **Advantages:** Scalable, conventional, clear separation; matches reserved `navigation/`/`pages/` dirs.
- **Drawbacks:** Infrastructure-first rather than behavior-first; navigation solves an organization problem the app does not yet have; risk of shipping a hollow shell of empty stubs.

### Option B — Sidebar as Persistent Mission Anchor (selected)
The Sidebar is not navigation — it is the heart of the app: a persistent, always-visible panel holding the user's *current mission / next achievable step* and its status. The main pane holds the "Begin Today" flow that creates or advances that step.

- **UX:** The single most important thing — the user's stated next step — is permanently on screen.
- **Architecture:** The Sidebar is a stateful mission component reading the current mission from app-level state owned by `App`; introduces the first domain model (`Mission`) and unidirectional state flow. No router needed yet.
- **Advantages:** Directly embodies the thesis; introduces the first meaningful domain model and state flow; gives the Sidebar a purpose rather than a list of links.
- **Drawbacks:** Risk of a passive/static panel if the action loop is not wired; no navigation yet (some rework later); requires careful live-state design.

### Option C — Sidebar as Capture / Intention Inbox
The Sidebar is a low-friction input surface for capturing thoughts and candidate next steps; the main pane surfaces the *chosen* next step and the "Begin Today" action.

- **UX:** Emphasizes capture → clarify → act; lowers the barrier to starting.
- **Architecture:** The Sidebar owns a capture-list state; promoting an item lifts it into the mission state owned by `App` — the first two coupled state models and inter-component interaction.
- **Advantages:** Strong fit on the entry side of the thesis; gives the Sidebar an active input responsibility.
- **Drawbacks:** Capture alone does not create momentum; requires the promotion-to-action loop to be meaningful; most complex of the three for a first feature; risk of a dust-collecting inbox.

## Decision

Select **Option B — the Sidebar as a Persistent Mission Anchor** for First Light.

## Why B Was Selected

1. **It is the thesis made concrete.** Behavioral activation is about keeping the next step visible and actionable; a persistent mission anchor makes that the very first thing the user sees and interacts with.
2. **It introduces the right foundation.** The first real domain model (the `Mission`) and the documented unidirectional state flow are the building blocks every later feature depends on.
3. **It avoids the key risks of the alternatives** — the hollow-shell risk of A (infrastructure without behavior) and the two-model complexity of C (capture without an action loop).
4. **It gives the Sidebar a genuine purpose** consistent with the project's component-responsibility principle, rather than a generic navigation role.

## Consequences / Accepted Tradeoffs

- **No navigation layer yet.** The app will add a router or view layer later as features grow; this is accepted rework rather than premature infrastructure.
- **Risk of a passive panel.** Mitigated by wiring the "Begin Today" action loop so the Sidebar reflects live mission state (Not started → In progress → Done), not a static label.
- **First feature is stateful.** The Sidebar depends on app-level mission state, requiring a deliberate state model and clear ownership in `App`.
- **Option C is deferred, not rejected.** A capture/inbox surface is a natural second milestone that feeds the mission anchor once the action loop is established.

## Future Considerations

- Define the `Mission` data shape (`goal`, `nextStep`, `status`) and where state lives before implementation.
- Decide how "Begin Today" creates vs. advances a mission in the First Light scope.
- Revisit navigation and capture surfaces in subsequent milestones.
