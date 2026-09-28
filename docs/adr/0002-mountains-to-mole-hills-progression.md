# ADR-0002: Mountains-to-Mole-Hills Progression — First Conquest

- **Status:** Accepted
- **Date:** 2026-08-25
- **Decision maker:** (proposed by Zide Assist for human review)

## Problem

Milestone 1 (First Light) shipped a single-Mission prototype: the user states
one next step, works it, and it is recorded to history. Milestone 2 ("First
Conquest") asks for a functioning hierarchical vertical slice —
**Mountain Range → Mountain → Mole Hill → Mission → Complete → Advance → Hill
Climbed → Mountain Conquered** — while keeping the Mission Anchor focused on
the current actionable Mission and explicitly excluding persistence, AI
decomposition, a hierarchy editor, and multi-range management.

The design question is: **how should the hierarchy be created and progressed
given those constraints, without turning the interface into a project-management
dashboard or discarding the First Light capture-and-act behavior?**

## Context

- The product language in `docs/08_Feature_Ideas.md` positions the Mission as
  "the concrete action immediately in front of the user," and reducing a
  Mountain to a Mole Hill as the core psychological move.
- ADR-0001 established the Sidebar as a persistent Mission Anchor over a
  unidirectional state flow owned by `App`, with Missions created by the user
  ("Begin Today", later also Inbox promotion).
- There is no persistence, no router, and no data model beyond `Mission`.
- The milestone explicitly forbids persistence, an editor, and unnecessary
  dependencies, yet still requires the full conquest to be *experienceable*.

## Options Considered

### Option A — Fully seeded demonstration hierarchy
Seed a fixed Range with concrete Mountains, Hills, and pre-written Missions.

- **Pros:** Deterministic and easy to test; the whole conquest plays out
  automatically.
- **Cons:** Discards the user's own next-step thesis at the heart of ADR-0001;
  ships pre-written (fake) actions.

### Option B — User-supplied Missions inside a seeded hierarchy *(selected)*
Seed only the *structure* (one Range with several named Hills), and let the
user provide every Mission through the existing Begin Today / Inbox promotion
flows. Completing Missions fills and then climbs each Hill.

- **Pros:** Preserves the capture-and-act thesis; the hierarchy is real but the
  content is always the user's; no editor or persistence needed; progression
  rules remain pure and testable.
- **Cons:** The user must populate enough Missions to feel a full conquest; some
  structure is example data that later persistence will replace.

### Option C — Full dynamic editor plus progression
Add a hierarchy editor to create/modify Ranges, Mountains, and Hills, then wire
progression on top.

- **Pros:** Most capable.
- **Cons:** Explicitly out of scope ("no complex hierarchy editor", "no
  unnecessary … architectural rewrites"); risks turning the Mission Anchor into
  a dashboard.

## Decision

Adopt **Option B**: a single in-memory seeded Range provides the Mountains and
Mole Hills that give progress its shape, while every Mission is supplied by the
user. The hierarchy adds context and progression; the Mission Anchor remains
focused on the current actionable Mission, with the hierarchy surfaced only as a
breadcrumb and a small in-Hill progress indicator.

## Why B Was Selected

1. **It honors both constraints.** It makes the full conquest experienceable
   (the milestone's explicit goal) without adding persistence, an editor, or a
   dashboard-like surface.
2. **It preserves First Light.** Missions are still the user's own next steps,
   created exactly as before (Begin Today / Inbox promotion), per ADR-0001.
3. **It keeps progression pure.** The rule set lives in a framework-free module
   and is unit-testable independent of React state.

## Consequences / Accepted Tradeoffs

- **Example structure is seeded and in-memory.** `createDemoRange()` in
  `src/services/demoRange.ts` supplies a single example Range; it is clearly
  demo data that real persistence/user-modelled ranges will replace.
- **Empty Hills initially.** Because Hills seed with no Missions, the first-run
  experience is still "Begin Today," matching First Light.
- **No navigation layer.** As with ADR-0001, accepted rework.
- **Vitest was added as the only new dependency** to satisfy Milestone 2's
  explicit testing requirement; it is a scoped devDependency for the pure
  progression engine.

## Future Considerations

- Real persistence and user-modelled ranges will replace the seeded structure.
- A future hierarchy editor (explicitly deferred) should build on the same
  `Progression` types without changing the progression rules.
- Revisit whether multiple concurrent Ranges should be supported once
  persistence exists.
