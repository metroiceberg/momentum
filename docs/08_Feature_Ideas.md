# MOMENTUM — Work in Progress

## Product Language: Jungle and Colony

### The Core Idea

> MOMENTUM is not trying to finish everything in a person's life. It helps
> transform overwhelming or amorphous parts of life into manageable territory,
> establish sustainable order where possible, and maintain that order over time.

> The Jungle is not an enemy that can be permanently defeated. It is the
> persistent complexity surrounding the user's life. Progress means making more
> of it navigable and livable.

### Concept

MOMENTUM uses a jungle-and-colony metaphor to describe the user's movement from
overwhelm to action, sustainable order, and ultimately progress.

- **Jungle** — the larger, complex, partially untamed area of life/problem
  space. The Jungle is the persistent complexity surrounding the user, not a
  thing that can be permanently removed.
- **Territory** — a meaningful area within that Jungle that can be addressed. A
  Territory may be a project, part of a project, a habit, a system, a
  relationship, or a domain of responsibility.
- **Taming / Clearing** — the work of bringing a Territory under control and
  making it navigable and livable.
- **Colony Established** — the Territory has reached a sufficiently stable,
  livable, sustainable state. This is a meaningful completion state that
  intentionally transitions into maintenance, not a claim that the work is
  finished forever.
- **Maintenance** — ongoing work that prevents the Jungle from reclaiming
  established Territory.

**The key insight:**

> We don't conquer the Jungle. We tame enough of it to establish places where
> life can function.

Maintenance is not evidence that previous work failed. The Jungle naturally
grows back. Maintenance is the **continued stewardship** of territory that has
already been brought under control. This is why MOMENTUM favors sustainable
forward movement over a permanent, one-time victory.

### Why the Metaphor Evolved

The **Mountain / Mole Hill / Conquest** metaphor demonstrated how an enormous,
finite problem can be reduced to a bounded, actionable objective. That insight
remains valuable and is carried forward.

Further design exploration showed that MOMENTUM must also naturally represent
**ongoing systems** — habits, relationships, health and wellness, and the
maintenance of already-stabilized areas. Those are not "finished" once
addressed; they require continued stewardship. The Jungle/Colony model
represents that reality: the surrounding world is persistent complexity, and
the user's work is to carve out and maintain livable order within it.

See `docs/adr/0003-jungle-and-colony-product-metaphor.md` for the full decision.

### Hierarchy Is Adaptive

The structure of the Jungle is not rigid. A Territory may be large or small, and
different Territories may have different internal structures. MOMENTUM should
not force identical structures onto every Territory; the hierarchy is
**scaffolding, not bureaucracy**. It exists to reduce cognitive load and can
change as the user's understanding of the problem changes.

Where useful, the model remains recursive and scale-aware: a broad, overwhelming
area can be decomposed into smaller Territories of varying depth until the work
is appropriately represented as concrete, actionable objectives.

### Completion and Closure

Completion is **user-declared**. MOMENTUM assists with structure and progress
tracking but does not independently determine whether the user's real-world
objective has been accomplished.

When a Territory is brought under control, MOMENTUM recognizes **Colony
Established**. The intended flow is:

**Mission complete → objective cleared → Colony Established → Maintenance**

Completion should create **closure**, not immediately create another
obligation. After a Colony is Established, the user should be given a choice
such as:

> **COLONY ESTABLISHED!**
>
> You did it.
>
> **Is there anything else, should we plan for tomorrow, or set up maintenance?**

The intent is to celebrate the achievement without forcing the user immediately
back into a productivity loop. Establishing a Colony is a moment of closure that
naturally leads into maintenance — not pressure to begin the next task at once.

### Design Examples

These examples show how the model adapts to very different parts of life.

**Clean the Apartment**

* **Jungle:** Clean the Apartment.
* **Territories** may include Entryway, Kitchen, Living Room, Hallway,
  Bathroom, Bedrooms, and others.
* Different Territories may have different internal structures. A kitchen might
  require several meaningful objectives; a small entryway might need only one.
* Once brought into a sustainable condition, an area can be considered a
  **Colony Established**.
* Later cleaning is **maintenance**, not starting over.

**Health & Wellness**

* Areas such as sleep, movement, nutrition, and medical/preventive care.
* These demonstrate that the model applies to **habits and systems**, not only
  physical projects.
* Establishment naturally leads into maintenance — caring for these areas is
  ongoing, not a single finished task.

**Interpersonal Relationships**

* Areas such as family, friendships, and professional relationships.
* These demonstrate that the model applies to **ongoing relationships**.
* A relationship can reach a stable, livable state without being "finished."
* Maintenance is inherent to the domain.

The hierarchy should remain adaptive: do not rigidly force identical structures
onto these examples or onto the user's life.

### Product Principles

- **The user's intention establishes the direction; MOMENTUM provides
  structure.** The system may eventually assist with decomposition, including
  AI-assisted decomposition, but understanding the internal hierarchy should not
  be a prerequisite for using the product.
- **The hierarchy is scaffolding, not bureaucracy.** It exists to reduce
  cognitive load and can change as the user's understanding of the problem
  changes.
- **The user retains authority over completion.** MOMENTUM supports judgment
  rather than replacing it.
- **The Mission Anchor stays focused on the current actionable Mission.** The
  full structure provides context, but the immediate experience remains: here is
  what you are doing now; Start; do it; Complete.
- **Sustainable forward movement matters more than maximum uninterrupted
  productivity.** The user can change focus, take breaks, and return later
  without those decisions being treated as failure.
- **Maintenance should not become another overwhelming project-management
  system.** Caring for established territory should stay lightweight and
  integrated, not spawn a second burden.
- **The user should not need to understand the internal hierarchy to use
  MOMENTUM.** MOMENTUM helps decompose an overwhelming statement into
  progressively smaller, workable pieces; the structure is the system's job, not
  a prerequisite for the user.
- **Victory deserves recognition.** Reaching a livable, sustainable state is a
  real moment of closure and should be celebrated as such.
- **MOMENTUM acknowledges genuine difficulty.** Something may genuinely feel
  overwhelming. The purpose of taming it is not to dismiss the user's difficulty
  but to find a piece that can be moved now.

### The Role of the Mission and the Mission Anchor

A **Mission** is the individual achievable step immediately in front of the
user — the concrete action that tames today's piece of a Territory.

The **Mission Anchor** is the persistent representation of the current Mission
and its next achievable step, keeping the user's attention on what can be acted
upon now.

The implemented Mission lifecycle is **Start → Complete**:

- **Start** (`not-started` → `in-progress`) keeps the Mission active and does
  not advance the structure.
- **Complete** (`in-progress` → `done`) is the action that advances progression.

Future design work (not yet implemented) may extend execution context without
changing the hierarchy:

- **Continue** — keep working on the same Mission.
- **Pause** — stop working on this Mission for now; preserve it for later. A
  pause is not incomplete or failed.
- **Work sessions** — bounded intervals (e.g. a Pomodoro-style model) for
  Mission work that is large in volume.

The hierarchy remains stable while the user's execution context changes.

### Relationship to the Currently Implemented Domain Model

The **Jungle/Colony model is the current product-language direction.** It is
being evolved as concept and language first.

The **currently implemented domain model** remains:

**Mountain Range → Mountain → Mole Hill → Mission → Action**

That is what is implemented in `src/services/progression.ts` and surfaced
through the Mission Anchor (ADR-0001). It is intentionally **not renamed** as
part of this conceptual evolution. The existing hierarchy and its implementation
remain valid unless and until the domain model is deliberately reconsidered,
after the Jungle/Colony concept has been fully designed (see
`docs/adr/0003-jungle-and-colony-product-metaphor.md`).

### Stabilization Before Maintenance

MOMENTUM's first purpose is to help the user **triage and stabilize an initial
area/territory**. The initial implementation should focus on helping the user
bring that territory under control before introducing maintenance behavior or
requiring them to manage many territories at once.

Once a Territory is sufficiently established, MOMENTUM can begin supporting
**maintenance of established territory**. The intended progression is:

**Overwhelm → Triage → Stabilization → Colony Established → Maintenance**

Maintenance is a later capability, not part of the initial implementation.

### Product Reward Possibility

Future idea only: if MOMENTUM reaches sufficient scale, partnerships could
potentially provide optional monthly rewards that allow users to treat
themselves for sustained maintenance of their MOMENTUM. This is intentionally
outside the current product scope and should remain a preserved possibility
rather than an implementation requirement.

### Current Status

The **Jungle/Colony** model is the current conceptual/product-language direction
(ADR-0003), evolved from the Mountain/Conquest metaphor. The **implemented**
vertical slice and its domain model remain the Mountain hierarchy:
Milestone 2 established **Mountain Range → Mountain → Mole Hill → Mission** with
the Mission lifecycle and completion progression in `src/services/progression.ts`
(see `docs/04_Mission_Engine.md` and
`docs/adr/0002-mountains-to-mole-hills-progression.md`). Local persistence was
added in Milestone 3. Recursive structures, maintenance, and the reward
possibility remain future work.
