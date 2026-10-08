# Changelog

All notable changes to MOMENTUM are documented here.

## [Unreleased]

### Design
- **Persistence policy (ADR-0004):** documented that while MOMENTUM is pre-1.0
  and the domain model is under active development, persisted state that is
  missing, malformed, structurally invalid, or incompatible with the current
  storage version is rejected and replaced by fresh application state. Formal
  state migrations are deferred until the domain model stabilizes. No
  implementation change — the existing graceful-fallback behavior already
  follows this policy.
- **Jungle and Colony product metaphor:** documented the evolution of MOMENTUM's
  product language from Mountains / Conquest to a broader Jungle / Colony model
  — Jungle (persistent complexity), Territory, Taming / Clearing, **Colony
  Established**, and Maintenance as continued stewardship. The decision is
  recorded in ADR-0003. This is a product-language/design direction only; the
  implemented Mountain hierarchy, progression engine, persistence, and UI remain
  unchanged, and domain-term renaming is deferred until the concept is fully
  designed.
- **Mountains to Mole Hills domain model:** documented the recursive Mountain Range model, Mountain/Mole Hill/Mission definitions, ordered Mission progression, upward completion propagation, stabilization-before-maintenance lifecycle, and recurring Mole Hills as the future maintenance mechanism. The World remains conceptual context rather than an application entity.
- **Future reward possibility:** preserved the idea of optional partner rewards for sustained MOMENTUM maintenance as a future possibility, explicitly outside current implementation scope.


### Added
- **Hierarchical progression (Milestone 2 — First Conquest)**: introduces the
  Mountain Range → Mountain → Mole Hill → Mission domain model and a pure
  progression engine (`src/services/progression.ts`). Completing the current
  Mission advances within a Hill; exhausting a Hill declares **Hill Climbed!**,
  exhausting a Mountain declares **Mountain Conquered!**, and exhausting the
  whole Range declares it conquered. A Celebration surface makes each milestone
  visible.
- **Hierarchy context in the Mission Anchor**: the Sidebar now shows a compact
  breadcrumb (Range › Mountain › Hill) and an in-Hill progress indicator while
  remaining focused on the current actionable Mission (ADR-0001).
- **Seed example Range**: one in-memory Range with named Hills
  (`src/services/demoRange.ts`) so the full conquest is experienceable without
  persistence or an editor; Missions remain user-supplied through the existing
  Begin Today / Inbox promotion flows.
- **Unit tests for the progression engine** (`src/services/progression.test.ts`)
  via Vitest (new devDependency).

### Changed
- **Sidebar (Mission Anchor)**: extended to carry hierarchy breadcrumb and
  hill-progress context; the current-Mission focus and action loop are
  unchanged.

### Fixed
- **Mission lifecycle (Start vs Complete)**: clicking **Start** on a not-started
  Mission now moves it to **In progress** without advancing the hierarchy or
  recording it to History. Only **Complete** (in-progress → done) invokes the
  progression engine, records the Mission to History, and can trigger a
  Hill/Mountain/Range milestone. An in-progress Mission remains the active
  Mission Anchor. Added `performAction`/`setCurrentMissionStatus` in
  `src/services/progression.ts` to centralize and unit-test the lifecycle.

- **Mission History** (extends First Light): completed Missions are retained in
  a simple in-memory history list shown in the main pane, so completed work is
  not lost. History state is owned by `App` (ADR-0001); the Mission Anchor and
  its behavior are unchanged.
- **Inbox → Mission promotion** (extends First Light): each captured Inbox item
  has a "Make Mission" action that establishes the captured text as the current
  Mission's next achievable step (`goal: 'Today'`, `status: 'not-started'`,
  consistent with the Begin Today flow) and removes the promoted item from the
  Inbox. Application-level mission and inbox state remain owned by `App`
  (ADR-0001); the Mission Anchor reflects the new Mission through the existing
  unidirectional state flow.

### Changed
- **Inbox / Capture surface** (extends First Light): capture an unstructured
  thought or task into a simple in-memory inbox list. In-memory only — no
  persistence, processing, or categorization. Application-level inbox state is
  owned by `App` (consistent with ADR-0001); the Mission Anchor (Sidebar) is
  unchanged.

### Fixed
- **Completed Mission main-pane presentation**: a `done` Mission no longer shows
  "Today's next step" or its completed step in the main pane; the pane instead
  offers "Begin a new mission". The Mission Anchor still shows the completed
  Mission with its `Done` status, and the Mission remains in application state.
