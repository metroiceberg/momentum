# MOMENTUM — Work in Progress

## Product Language: Mountains to Mole Hills

### Concept

MOMENTUM uses a mountain-and-hill metaphor to describe the user's movement from overwhelm to action and, ultimately, progress.

- **Mountains to Mole Hills** — the things that currently feel large, overwhelming, or difficult. MOMENTUM helps reduce a perceived mountain to a manageable piece without minimizing the difficulty the user is experiencing.
- **Mission** — an individual achievable step toward the mole hill. A Mission is not the entire mountain; it is the concrete action immediately in front of the user.
- **Mission Anchor** — the persistent representation of the current Mission and its next achievable step, keeping the user's attention on what can be acted upon now.
- **Hills Climbed** — the record of completed Missions, framed as evidence of progress rather than an archive of finished tasks.

### Conceptual Flow

**Mountain → Mole Hill → Mission → Action → Hill Climbed**

The user does not need to climb the entire mountain at once. MOMENTUM helps identify the hill immediately in front of them and supports taking the next achievable step.

### Product Principle

MOMENTUM should acknowledge that something may genuinely feel like a mountain. The purpose of reducing it to a mole hill is not to dismiss the user's difficulty, but to find a piece that can be moved now.

### Current Status

This is the **WIP product concept** that Milestone 2 ("First Conquest") began to
implement as a vertical slice. The terminology and model here drive the
implementation:

- The **hierarchy** (Mountain Range → Mountain → Mole Hill → Mission) is
  implemented in `src/services/progression.ts` as the Mission Engine domain
  model.
- The **progression flow** — Mission → Hill Climbed → Mountain Conquered — is
  implemented and surfaced through the Mission Anchor (ADR-0001).

See `docs/04_Mission_Engine.md` and
`docs/adr/0002-mountains-to-mole-hills-progression.md` for the implemented
model and its decisions.

