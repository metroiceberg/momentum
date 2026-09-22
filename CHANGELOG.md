# Changelog

All notable changes to MOMENTUM are documented here.

## [Unreleased]

### Design
- **Mountains to Mole Hills domain model:** documented the recursive Mountain Range model, Mountain/Mole Hill/Mission definitions, ordered Mission progression, upward completion propagation, stabilization-before-maintenance lifecycle, and recurring Mole Hills as the future maintenance mechanism. The World remains conceptual context rather than an application entity.
- **Future reward possibility:** preserved the idea of optional partner rewards for sustained MOMENTUM maintenance as a future possibility, explicitly outside current implementation scope.


### Added
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
