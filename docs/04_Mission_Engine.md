# Mission Engine — Mountains to Mole Hills

The Mission Engine is MOMENTUM's core progression model. It answers two
questions continuously:

1. **What is the user's current actionable Mission?** — the next step to act on
   now (the Mission Anchor, ADR-0001).
2. **What progress does completing it make?** — how a single Mission moves the
   user through the hierarchy toward an achieved goal (Milestone 2).

This document describes the domain model and the progression rules implemented
in `src/services/progression.ts`. It is intentionally implementation-flavored:
the product language lives in `docs/08_Feature_Ideas.md`, and the interface
philosophy in `docs/adr/0001-mission-anchor-first-light.md`.

## Terminology: Implementation vs Product Language

The product metaphor evolved after this engine was implemented. It is important
to distinguish three things:

- **Current implementation terminology (this document).** The implemented domain
  model and its TypeScript types are **Mountain Range → Mountain → Mole Hill →
  Mission**. This is what lives in `src/`, what the progression engine
  operates on, and what the UI renders. It is unchanged by the product-metaphor
  evolution and remains the source of truth for the implemented behavior.
- **Current product-language direction.** The conceptual/product language has
  evolved to a **Jungle / Colony** model — Jungle, Territory, Taming / Clearing,
  **Colony Established**, and Maintenance (see `docs/08_Feature_Ideas.md` and
  `docs/adr/0003-jungle-and-colony-product-metaphor.md`). This is a design
  direction for where MOMENTUM is going conceptually.
- **Future domain-model reconsideration.** Whether and how the implemented
  hierarchy and TypeScript terminology should be renamed to align with the
  Jungle/Colony concept is deliberately deferred. It will be considered only
  after the concept has been fully designed. No TypeScript rename happens as
  part of this documentation.

In short: the Mountain hierarchy is what is built; Jungle/Colony is where the
product language is heading; aligning the two is a future decision.

## Domain Model

The hierarchy is four levels deep, from the broadest container to the single
actionable step:

```
Mountain Range
└── Mountain
    └── Mole Hill
        └── Mission
```

| Type            | Meaning                                                              |
| --------------- | ------------------------------------------------------------------- |
| `MountainRange` | A broad endeavor; the largest container.                            |
| `Mountain`      | A large, potentially overwhelming goal within the range.            |
| `MoleHill`      | A manageable piece of a Mountain. Reducing a Mountain to a Mole Hill |
|                 | is the core psychological move of MOMENTUM.                         |
| `Mission`       | An individual achievable step — the user's next actionable step.    |

A `Progression` is the current position in the hierarchy: which Mountain, Hill,
and Mission the user is pointed at. It is the minimal live state MOMENTUM needs
to both show the current actionable Mission and know what comes next.

Missions are the only user-supplied content. Mountains and Mole Hills provide
structure and progression; a Mission becomes part of a Hill when the user states
it (Begin Today, or promoting an Inbox item). MOMENTUM does not decompose work
automatically.

**Explicit non-goals (Milestone 2 scope):** no persistence, no AI
decomposition, no hierarchy editor, no multi-range management, no recurring
maintenance, no accounts. The model lives entirely in memory, owned by `App`
per ADR-0001.

## Progression Rules

Progression is a pure rule set (`advanceProgression`) with no side effects:

1. **Complete the current Mission.** The Mission's status becomes `done`.
2. **Advance to the next Mission** in the current Hill when one exists.
3. **Hill Climbed!** When all Missions in a Mole Hill are complete, the Hill is
   declared climbed and the user advances to the next Mole Hill.
4. **Mountain Conquered!** When all Mole Hills in a Mountain are complete, the
   Mountain is declared conquered and the user advances to the next Mountain.
5. **Range Conquered!** When all Mountains in the Range are complete, the final
   transition marks the whole Range conquered.

A single advance can cascade: finishing the last Mission of a Mountain's final
Hill simultaneously climbs that Hill *and* conquers the Mountain. Every
transition is reported as an event (`ProgressionEvent`) so the UI can make each
milestone visible and celebratory rather than quietly passing over it.

## Mission Lifecycle (Start vs Complete)

Only completion drives the progression rules above. The full user-facing
lifecycle of a single Mission is:

```
not-started ──Start──▶ in-progress ──Complete──▶ done ──▶ progression engine
```

- **Start** (`not-started` → `in-progress`) is a routine transition: the
  hierarchy does not move, the Mission is not recorded to History, and the
  Mission remains the active Mission Anchor while it is being worked.
- **Complete** (`in-progress` → `done`) is the only action that invokes
  `advanceProgression`; it records the Mission to History and may cascade into
  Hill/Mountain/Range milestones.

This decision is centralized in `performAction` (`src/services/progression.ts`)
so it can be unit-tested independently of the React wiring (`progression.test.ts`).

## Progression Events

| Event                | Meaning                                            |
| -------------------- | -------------------------------------------------- |
| `mission-completed`  | A Mission was finished (routine progress).         |
| `hill-climbed`       | A Mole Hill's Missions are all complete.           |
| `mountain-conquered` | A Mountain's Hills are all complete.               |
| `range-complete`     | The whole Range is complete; no next step remains. |

`mission-completed` feeds the retained History; `hill-climbed` and above are
celebratory milestones surfaced through the `Celebration` surface.

## Design Decisions

- **Structure is seeded, Missions are user-supplied.** Because there is neither
  persistence nor an editor yet, a single example Range is seeded
  (`src/services/demoRange.ts`) so the full conquest can be exercised end to
  end, while the user still provides every Mission themselves. This preserves
  the First Light capture-and-act thesis (ADR-0001).
- **The Mission Anchor stays focused on the current actionable Mission.** The
  hierarchy appears only as a compact breadcrumb and a small in-Hill progress
  indicator. Completion is celebrated but the interface is not converted into a
  project-management dashboard.
- **Pure engine in `progression.ts`.** The progression rules are framework-free
  and unit-tested in `progression.test.ts`, independent of React state.

See `docs/adr/0002-mountains-to-mole-hills-progression.md` for the decision
record.
