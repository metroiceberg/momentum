# ADR-0003: Jungle and Colony Product Metaphor

- **Status:** Accepted
- **Date:** 2026-08-25
- **Decision maker:** Eric Moteberg (human maintainer)

## Problem

The Mountain / Mole Hill / Conquest metaphor was valuable when MOMENTUM began.
It demonstrated how an enormous, *finite* problem (a Mountain) can be reduced to
a bounded, actionable objective (a Mole Hill), and then completed (Conquered).
As the product model expanded beyond finite physical projects toward ongoing
systems, habits, relationships, and maintenance, the metaphor's framing of
completion as *conquest* — and therefore *permanent finish* — became limiting.

## Context

- The Mountain metaphor frames the environment as a *defeatable enemy* and work
  as reaching a *victory state* after which one moves on. This fits a finite
  project: an apartment can be cleaned, a kitchen can be reorganized, a mountain
  can be climbed.
- MOMENTUM must also represent continuing realities: habits, health and
  wellness, relationships, and the maintenance of previously stabilized areas.
  None of these is "finished." Each must be sustained over time.
- The discovery that drove this evolution: **physical projects, habits and
  systems, relationships, and other life domains all share a maintenance
  characteristic.** They are surrounded by persistent complexity and require
  ongoing stewardship rather than a single, final victory.
- The Mountain metaphor remains historically valuable (see ADR-0002 and
  Milestone 2). Its contribution — reducing an enormous, overwhelming problem
  to a bounded, actionable objective — is carried forward and preserved.

## Options Considered

### Option A — Retain the Mountain metaphor, retrofit maintenance onto it
Keep "Mountain Range → Mountain → Mole Hill" and represent maintenance as
recurring Mole Hills that re-clear after completion.

- **Pros:** Preserves the implemented domain language; a structurally coherent
  way to express recurring work.
- **Cons:** The "conquest" framing treats the environment as a permanently
  defeatable enemy and completion as a terminal victory. It does not naturally
  communicate that the world around a user is persistent complexity to be
  *tamed and stewarded*. Maintenance reads as "re-doing what was already won"
  rather than "caring for what was established."

### Option B — Broaden the product metaphor to Jungle / Colony *(selected)*
Introduce a broader conceptual frame: the **Jungle** (persistent, complex,
partially untamed life/problem space) within which the user carves out
**Territories**, brings them under control (**Taming / Clearing**), reaches a
stable, livable state (**Colony Established**), and sustains them
(**Maintenance**).

- **Pros:** Naturally models persistent complexity and ongoing systems; frames
  completion as "established and maintained" rather than "finished forever";
  covers habits, relationships, and other domains, not only finite projects;
  preserves the finite-project insight (reduce overwhelm to a bounded,
  actionable objective).
- **Cons:** New terminology that does not yet match the implemented domain
  model; requires care to distinguish product language from implementation.

## Decision

Adopt the **Jungle / Colony** product metaphor as MOMENTUM's current conceptual
direction:

- **Jungle** — the larger, complex, partially untamed area of life/problem
  space.
- **Territory** — a meaningful area within that Jungle that can be addressed.
- **Taming / Clearing** — the work of bringing a Territory under control.
- **Colony Established** — the Territory has reached a sufficiently stable,
  livable, sustainable state.
- **Maintenance** — ongoing work that prevents the Jungle from reclaiming
  established Territory.

The key conceptual insight:

> We don't conquer the Jungle. We tame enough of it to establish places where
> life can function.

Maintenance is not evidence that previous work failed. The Jungle naturally
grows back. Maintenance is the **continued stewardship** of territory that has
already been brought under control.

## Why the Jungle Metaphor Was Selected

1. **It represents persistent complexity.** The Jungle is not an enemy that can
   be permanently defeated; it is the persistent complexity surrounding the
   user's life. Progress means making more of it navigable and livable.
2. **Colony Established is a better completion state for maintainable things.**
   A Colony is established and then maintained — it is not "finished forever."
   This matches habits, systems, and relationships that require ongoing
   stewardship.
3. **It generalizes beyond finite projects.** Physical projects, health and
   wellness, and interpersonal relationships all fit; the hierarchy stays
   adaptive rather than forcing identical structures onto every domain.
4. **It preserves the Mountain metaphor's key contribution.** The useful insight
   — transform an overwhelming part of life into a bounded, actionable
   objective — is retained, just reframed as taming territory rather than
   conquering a mountain.

## Important Scope Note

This is initially a **product-language / design decision**, not an
implementation or domain-schema rewrite.

The currently implemented domain model — **Mountain Range → Mountain → Mole Hill
→ Mission** — and its TypeScript types, progression engine, persistence, and UI
remain **unchanged** as part of this decision (see `docs/04_Mission_Engine.md`).
Domain terminology may be reconsidered separately, once the Jungle/Colony
concept has been fully designed.

## Consequences / Accepted Tradeoffs

- Product documentation (`docs/08_Feature_Ideas.md`) now uses Jungle/Colony
  language for the current conceptual direction.
- The existing Mountain hierarchy remains valid until it is deliberately
  reconsidered.
- No application code, UI, persistence, tests, or dependencies change as a
  result of this decision.

## Future Considerations

- After the concept is fully designed, evaluate whether the domain hierarchy and
  TypeScript terminology should be renamed to align with the Jungle/Colony
  model. That is deliberately out of scope for this decision.
- Design Maintenance as a first-class but non-bureaucratic capability, so it
  does not become another overwhelming project-management system.
