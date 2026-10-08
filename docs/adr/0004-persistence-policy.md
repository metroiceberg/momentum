# ADR-0004: Persistence Policy — Reject Incompatible State While Pre-1.0

- **Status:** Accepted
- **Date:** 2026-08-25
- **Decision maker:** Eric Moteberg (human maintainer)

## Problem

MOMENTUM now persists application state to local browser storage (Milestone 3).
The domain model remains under active development, so the storage schema is
expected to change. MOMENTUM must decide what happens when stored state is
missing, malformed, structurally invalid, or produced by an older/incompatible
storage version — and whether to invest in formal state migrations.

## Context

- The application is pre-1.0. Frequent changes to the domain model and the
  persisted schema are expected during this period.
- Persisted state that cannot be safely loaded must never block startup or
  crash the application; a clean fresh session is always preferable.
- The current implementation already stores a version (`STORAGE_VERSION`) with
  the saved state.
- Formal migrations add complexity proportional to schema evolution. That
  complexity is only justified once preserving existing persisted state across
  schema changes actually matters to users.

## Decision

**While MOMENTUM is pre-1.0 and the domain model remains under active
development:**

- Persisted state that is **missing, malformed, structurally invalid, or
  incompatible with the current storage version** is **rejected and replaced by
  fresh application state**.
- **Formal state migrations are deferred** until the domain model stabilizes and
  preserving existing persisted state justifies the additional complexity.

## Why

- **Safe, simple startup.** Rejecting incompatible state keeps loading trivial
  and robust: there is no code path that can crash the application on startup
  or render an inconsistent UI from bad persisted state.
- **The cost/benefit favors rejection pre-1.0.** There is no large base of
  irreplaceable user data yet; building and maintaining migrations now would add
  complexity for little present value.
- **A future migration path is preserved.** The stored `version` field means a
  deliberate, versioned migration layer can be introduced later without
  redesigning the storage format.

## Consequences

- `loadPersistedState` returns `null` for missing, malformed, structurally
  invalid, or version-incompatible state, and `App` falls back to a fresh
  in-memory session (graceful fallback, ADR-0002/ADR-0003 architecture
  unchanged).
- No migration code is implemented at this stage.
- During the pre-1.0 period, existing persisted state may be discarded when the
  schema changes. This is an accepted tradeoff of the policy.

## Future Considerations

- Revisit migrations when the domain model stabilizes and preserving existing
  user data justifies the complexity (post-1.0).
- Keep the stored `version` field accurate whenever the schema changes, so a
  future migration layer has a reliable signal of which format it is reading.
