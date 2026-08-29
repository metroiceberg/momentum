# Changelog

All notable changes to MOMENTUM are documented here.

## [Unreleased]

### Added
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
