# ADR-0005: Area of Life / Domain Model

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision maker:** Eric Moteberg (human maintainer, with Cipher)

## Supersedes

This decision **supersedes the structural role** of ADR-0003 (Jungle / Colony
product metaphor). ADR-0003 is preserved intact as historical evolution, but the
Jungle / Colony language is now treated as an earlier conceptual exploration
rather than the structural domain model. See the "Evolution" section below.

## Problem

Design exploration moved beyond the Jungle / Colony metaphor. MOMENTUM needs a
conceptual model that describes the steady state of a person's life across
broad, meaningful areas that are sustained over time — not merely the one-time
taming of finite territory. The model must reconcile ongoing Areas of Life with
bounded Projects and with the already-established Mission as the immediate
actionable unit, without forcing a rigid taxonomy onto the user's life.

## Decision

Adopt the **Area of Life / Domain** model as MOMENTUM's current conceptual
domain model (design/documentation only — no implementation change).

### Area of Life

An **Area of Life** is a broad, meaningful part of a user's life (for example
Home, Finances, Health & Wellness, Relationships, Career, Learning, Creative
Life).

An Area of Life has one of two area-level states:

- **Taming** — establishing a sustainable, manageable operating system for the
  area.
- **Tamed** — the area has a functioning system and can be sustained.

Taming / Tamed is **not a completion percentage**. An area becomes Tamed when
its underlying system is sufficiently functional to sustain itself. A Tamed Area
can return to Taming if its underlying system no longer works, or if
circumstances have changed enough that the existing system must be
re-established or reconfigured.

Individual Projects or troubled Domains do **not** automatically cause the whole
Area to return to Taming. State belongs to the smallest meaningful unit (see
System Principles).

### Domain

**Domains** exist in both Area states. A Domain is an organizational /
operational boundary within an Area of Life.

During Area Taming, individual Domains may themselves be in Taming and require
Projects / Missions to establish a workable system. Once a Domain is
sufficiently established, its operating state can become **Maintenance**.
Domains may also be in **Stasis** when intentional non-intervention is
appropriate.

A Domain may contain other Domains / Sub-Domains when additional structure
reduces cognitive load. Nested Domains are not a requirement; structure should
be user-meaningful and earn its existence.

Domains are organizational / operational boundaries — not necessarily physical
divisions, mutually exclusive systems, or independent systems. Different Areas
of Life may use very different Domain structures, and different users may define
them differently. MOMENTUM must not force a taxonomy merely because one is
possible. A Domain should generally be recognizable, meaningfully bounded,
operable, and actionable. Structure exists to reduce cognitive load, never to
create it.

### Project

A **Project** is a bounded intervention / change within a Domain.

Projects are **not** mutually exclusive with Domain Maintenance. A Domain can
simultaneously be in Maintenance and have an active Project. Maintenance can
discover something that warrants a Project.

A Project may be one-time or recurring. A recurring Project may be a periodic
Reset, for example:

- Kitchen → Cleaning → annual deep-clean refrigerator / freezer
- Garage → Organization → periodic "Garage Reset"

Recurrence is a property of a Project, **not** a separate hierarchy level or a
special Project type.

Projects contain **Missions**; Missions remain the immediate actionable unit.
Not every observation needs to become a Project — small observations may simply
become Missions. Repeated Projects can reveal that the Domain's underlying
maintenance / organization system needs improvement.

### Maintenance

**Maintenance** is the operating mechanism by which an established Domain is
sustained and observed. It is not merely a static checklist.

During Maintenance:

- Nothing may need attention → continue normally.
- A small issue may produce a Mission.
- A finite larger issue may produce a Project.
- A recurring systemic issue may indicate the Domain's maintenance system
  should be redesigned.

Maintenance must remain lightweight and must not become a second
project-management burden.

### Stasis

**Stasis** means intentional non-intervention because nothing currently
warrants action. It is not neglect, failure, or task debt.

Contextual events, cadence, use, or direct observation may prompt reassessment.
Reassessment does not automatically create work; the user remains the authority.

## System Principles

- **The system observes; the user decides.** MOMENTUM can surface friction, but
  it should not invent friction.
- **The user should not need to understand the internal hierarchy to use
  MOMENTUM.** The hierarchy / model is scaffolding, not bureaucracy.
- **A Project does not destabilize a Tamed Area simply because it exists.**
- **State belongs to the smallest meaningful unit.** Larger-scale state changes
  (e.g. an Area returning to Taming) occur only when the larger system itself
  needs re-establishment or reconfiguration.
- **The model should describe reality flexibly** rather than force reality into
  a rigid taxonomy.

## Examples

**Home (Tamed):**
- Home → Tamed
- Kitchen → Maintenance + Project: replace faucet
- Guest Room → Stasis
- Garage → Maintenance + recurring Project: Garage Reset

**Home during initial Taming:**
- Home → Taming
- Kitchen → Taming → Projects / Missions
- Garage → Taming → Projects / Missions

As individual Domains stabilize, they move to Maintenance while the Area may
remain Taming until the overall system is sufficiently established.

**Nested structure:**
- Home → Kitchen → Cleaning → Maintenance / Projects
- Home → Kitchen → Organization → Maintenance / Projects

**Pressure-tested Areas:** Finances, Health & Wellness, Relationships, Career,
Learning, and Creative Life have all been pressure-tested conceptually. They
demonstrate that Domains can overlap in influence and need not be independent;
dependencies are relationships, not necessarily hierarchy.

## Why This Model

1. **It names the steady state.** Area of Life (Taming / Tamed), Domain states,
   and Maintenance give MOMENTUM a vocabulary for the ongoing, sustainable shape
   of a person's life, not just the finite taming of territory.
2. **It keeps state at the smallest meaningful unit.** A Project or a troubled
   Domain does not un-settle an entire Area, matching how a real life actually
   works.
3. **It preserves the Mission as the immediate actionable unit** while placing
   it in context (Project → Mission), without adding a burdensome hierarchy.
4. **It is flexible by design.** Nesting is optional, recurrence is a Project
   property rather than a special type, and Domains need not be independent or
   consistent across Areas — reducing cognitive load instead of creating it.
5. **It is faithful to the user's actual life**, describing reality flexibly
   rather than forcing reality into a rigid taxonomy.

## Evolution

The **Mountain / Conquest** metaphor (ADR-0002) and the **Jungle / Colony**
metaphor (ADR-0003) each contributed durable ideas. The Mountain insight —
reduce an overwhelming objective to a bounded, actionable unit — is carried into
the Mission. The Jungle / Colony insight — persistent complexity is tamed and
then stewarded via maintenance — is carried into the Area states, Domains, and
Maintenance. The Area of Life / Domain model now supersedes the structural role
of the Jungle / Colony metaphor. **ADR-0003 is preserved intact as historical
evolution and is not deleted or rewritten.**

## Consequences

- `docs/08_Feature_Ideas.md` now presents the Area of Life / Domain model as the
  current conceptual direction, with the Jungle / Colony language reframed as
  earlier exploration.
- **No application code, TypeScript types, persistence, UI, or tests change** as
  a result of this decision. The implemented Mountain hierarchy
  (**Mountain Range → Mountain → Mole Hill → Mission**) and its implementation
  remain unchanged and are not prematurely renamed.
- The new model is described in conceptual / design terms only; it is not yet
  implemented.

## Future Considerations

- Determine when and how the conceptual model (Area of Life / Domain / Project /
  Maintenance / Stasis) maps onto or replaces the implemented Mountain
  hierarchy. That mapping is deliberately out of scope for this decision.
- Design an implementation for Projects and recurring Projects, and for Domain
  Maintenance / Stasis, that remains lightweight and user-directed.
- Keep the stored persistence `version` (ADR-0004) accurate when any future
  schema change reflects this model.
