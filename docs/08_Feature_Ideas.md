# MOMENTUM — Work in Progress

## Product Language: Mountains to Mole Hills

### Concept

MOMENTUM uses a mountain-and-hill metaphor to describe the user's movement from overwhelm to action, and ultimately progress.

- **Mountain Range** — the overarching challenge or collection of major challenges. A statement such as “I want to clean my apartment” may represent a Mountain Range rather than a single Mountain, because the apartment contains multiple rooms or areas that can each become their own Mountain.
- **Mountain** — a single project that could reasonably be completed in approximately **1–2 hours of focused effort**. A Mountain is a practical scope boundary, not a timer or a requirement that the user finish it in one uninterrupted session. For example, “Clean the kitchen” may be a Mountain within the larger goal of cleaning the apartment.
- **Mole Hill** — a meaningful, bounded objective within a Mountain. For example, “Clear the kitchen counter” can be a Mole Hill within the kitchen Mountain.
- **Mission** — an individual achievable step toward completing a Mole Hill. A Mission is the concrete action immediately in front of the user.
- **Action** — the behavioral interaction with a Mission. In the initial model, this is expected to be represented by the Mission's execution state rather than as a separate domain entity: **Start → Complete**.
- **Mission Anchor** — the persistent representation of the current Mission and its next achievable step, keeping the user's attention on what can be acted upon now.

### Hierarchy

**Mountain Range → Mountain → Mole Hill → Mission → Action**

A Mountain Range may contain multiple Mountains. A Mountain may contain multiple Mole Hills. A Mole Hill may contain multiple Missions. The structure is intended to be flexible rather than a rigid project plan; users should be able to add, remove, rename, or otherwise adjust meaningful chunks as circumstances change.

The **1–2 hour Mountain boundary is a scope guideline rather than a hard constraint**. A project that would normally require substantially more sustained effort should generally be decomposed into smaller Mountains or otherwise reconsidered. Conversely, a smaller project may remain a Mountain when treating it as a separate project is useful to the user. The goal is to keep a Mountain cognitively manageable and meaningfully completable, not to impose artificial precision.

### Completion Model

Completion propagates upward through the hierarchy:

1. The user starts and completes a Mission.
2. When all Missions belonging to a Mole Hill are complete, MOMENTUM recognizes **Hill Climbed!**
3. When all Mole Hills belonging to a Mountain are complete, MOMENTUM recognizes **Mountain Conquered!**
4. When all Mountains belonging to a Mountain Range are complete, MOMENTUM recognizes **Mountain Range Conquered!**

Completion is user-declared. MOMENTUM assists with structure and progress tracking but does not independently determine whether the user's real-world objective has been accomplished.

### Closure Principle

Completion should create **closure**, not immediately create another obligation.

After a Mountain Range is conquered, the user should be given a choice such as:

> **MOUNTAIN RANGE CONQUERED!**
>
> You did it.
>
> **Is there anything else, or should we plan for tomorrow?**

The intent is to celebrate completion without forcing the user immediately back into a productivity loop. “Plan for tomorrow” represents preparation and deliberate closure, not pressure to begin the next task immediately.

### Conceptual Flow

**Mountain Range → Mountain → Mole Hill → Mission → Action → Hill Climbed → Mountain Conquered → Mountain Range Conquered**

The user does not need to climb the entire mountain range at once. MOMENTUM helps identify the meaningful hill and the next achievable Mission immediately in front of them, then recognizes progress as they move upward through the hierarchy.

### Product Principles Emerging from the Model

- **The user's intention establishes the direction; MOMENTUM helps provide structure.** The system may eventually assist with decomposition, including AI-assisted decomposition, but understanding the hierarchy should not be a prerequisite for using the product.
- **The hierarchy is scaffolding, not bureaucracy.** It exists to reduce cognitive load and can change as the user's understanding of the problem changes.
- **A Mountain should represent a cognitively manageable project.** The approximate 1–2 hour scope provides a useful practical boundary without turning MOMENTUM into a time-management system.
- **The user retains authority over completion.** MOMENTUM supports judgment rather than replacing it.
- **Forward momentum matters more than maintaining a perfect task database.** Blocked or impossible Missions should eventually be replaceable or reworked rather than becoming dead ends.
- **The Mission Anchor stays focused on the current Mission.** The full hierarchy provides context, but the immediate experience remains: here is what you are doing now; Start; do it; Complete.
- **Victory deserves recognition.** “Hill Climbed!”, “Mountain Conquered!”, and “Mountain Range Conquered!” are progress states and moments of closure, not merely database status changes.

### Product Principle

MOMENTUM should acknowledge that something may genuinely feel like a mountain. The purpose of reducing it to a mole hill is not to dismiss the user's difficulty, but to find a piece that can be moved now.


## Domain Model — Design Checkpoint

The hierarchy is intended to reduce cognitive scope progressively until the user has a next action that is actionable and achievable. The user does not need to understand or construct the hierarchy in advance; MOMENTUM may help decompose an overwhelming statement into progressively smaller, workable entities.

### World as Context

“The World” is conceptual framing for where MOMENTUM operates: the user's life, circumstances, responsibilities, projects, and goals. **World is not a domain entity and is not modeled or stored by the application.** Mountain Range is the highest-level modeled entity.

### Recursive Mountain Ranges

A **Mountain Range may contain Mountains and/or smaller Mountain Ranges**. Mountain Range retains the same meaning regardless of scale; there is no separate “sub-range” entity or fixed maximum nesting depth.

This allows an initially overwhelming statement such as “I need to fix my life” to begin as a large Mountain Range and be decomposed into smaller Mountain Ranges before individual Mountains are introduced.

Conceptually:

**World (context) → Mountain Range → [Mountain Range → …] and/or Mountain → Mole Hill → Mission**

Scale does not change semantics. Recursive ranges exist to reduce scope until the work is appropriately represented as Mountains.

### Mountain

A **Mountain** is a single project that could reasonably be completed in approximately **1–2 hours of focused effort**. The boundary is a practical scope guideline, not a timer or hard requirement.

A Mountain provides project-level context and contains Mole Hills. Its completion is derived from the completion of its Mole Hills rather than requiring an independent completion status.

### Mole Hill

A **Mole Hill** is a bounded objective within a Mountain composed of an **ordered progression of Missions**.

The ordering is meaningful: completing the current Mission clears, enables, or facilitates the next Mission. The Mole Hill therefore represents a path through a bounded objective rather than merely a collection of related tasks.

A Mole Hill is cleared when its final Mission is completed.

### Mission

A **Mission** is simply the **next actionable, achievable step toward clearing the current Mole Hill**.

A Mission represents the user's current position in the Mole Hill's ordered progression. The user does not need to manage the entire sequence at once; MOMENTUM keeps attention on the Mission immediately in front of them.

### Mission Execution Extensions — Future Design

The Mission model should eventually distinguish **the nature of the work** from the Mission's place in the hierarchy. These capabilities are intentionally future design work and are **not part of the current Milestone 3 implementation**.

#### Mission Work Type

When appropriate, MOMENTUM may ask whether a Mission is a **huge task** or **maintenance**.

- **Maintenance** — routine work that does not need a dedicated work-session timer. The user starts the Mission, performs the work, and completes it.
- **Huge task** — a Mission whose work is conceptually straightforward but potentially large in physical or accumulated volume. The Mission should not be artificially split into additional Missions merely because the work takes multiple sessions.

This classification describes **how the Mission should be approached**, not a new hierarchy level and not a replacement for the user's judgment. Future AI assistance may eventually infer or suggest the classification through conversation rather than requiring the user to make a technical distinction.

#### Work Sessions

For a huge task, MOMENTUM may begin a bounded work session automatically when the Mission starts. A Pomodoro-style work interval is the initial conceptual model; exact duration, configurability, and break behavior remain design questions for later implementation.

The intended interaction is:

**Start → Work Session → Continue → Work Session → Continue → … → Complete**

**Continue** means that the same Mission remains active and another work session begins. It does not advance the hierarchy and does not represent partial completion.

The purpose is to accommodate volume without turning time management into another source of cognitive overhead.

#### Pause and Mission Switching

A long-running Mission should also be pausable without being considered incomplete or failed.

**Pause** means: *stop working on this Mission for now; preserve it for later.* A Mission may be paused because the user needs a break, wants to work on something else, or is finished working for the day.

When a Mission is paused, MOMENTUM may offer the user an opportunity to switch to another available Mission. The user remains in control of that choice; the system should not require them to finish an onerous Mission before allowing productive movement elsewhere.

The intended interaction may therefore become:

**Start → Work → Pause → Switch to another Mission → Work → Complete → Return to paused Mission later**

Pausing does not advance the hierarchy. **Complete** remains the only action that advances progression.

A daily stopping point is simply a contextual reason for pausing rather than a separate Mission state. For example, after a long day of work, MOMENTUM may acknowledge substantial progress and offer to pause the current work for the day.

#### Sustainable Momentum Principle

MOMENTUM should optimize for **sustainable forward movement**, not maximum uninterrupted productivity. The system should allow the user to change focus, take breaks, stop for the day, and return later without treating those decisions as failure.

This preserves a critical distinction:

- **Continue** — keep working on the same Mission.
- **Pause** — stop working on the same Mission for now.
- **Complete** — declare the Mission finished and allow progression.

The hierarchy remains stable while the user's execution context changes.

### Progression Rules

Mission progression follows a simple decision tree:

1. A Mission's action is completed.
2. MOMENTUM checks whether the current Mole Hill has another Mission.
3. If another Mission exists, it becomes the current Mission.
4. If no Mission remains, the Mole Hill is cleared and MOMENTUM recognizes **Hill Climbed!**

Mountain progression follows the same pattern:

1. A Mole Hill is cleared.
2. MOMENTUM checks whether the current Mountain has another Mole Hill.
3. If another Mole Hill exists, it becomes the next objective.
4. If no Mole Hills remain, the Mountain is completed and MOMENTUM recognizes **Mountain Conquered!**

Mountain Range progression follows the same recursive principle. When a child Mountain or child Mountain Range is completed, its parent determines whether another sibling can be tackled. If no child work remains, completion propagates upward to the parent. This continues until the relevant top-level Mountain Range is conquered.

**Progression continues sideways; completion propagates upward.**

### Initial Stabilization Before Maintenance

MOMENTUM's first purpose is to help the user **triage and stabilize an initial Mountain Range**. The initial implementation should focus on helping the user conquer that Range before introducing maintenance behavior or requiring them to manage multiple active Ranges simultaneously.

Once a Range is sufficiently under control, MOMENTUM can begin supporting **maintenance of the current Ranges**.

Maintenance does not require a separate hierarchy. It can be represented by turning appropriate lowest-level Mountains into **recurring Mole Hills**. These Mole Hills retain the same semantics as ordinary Mole Hills but recur after being cleared so that established areas of life remain maintained.

The intended progression is therefore:

**Overwhelm → Triage → Stabilization → Conquest → Maintenance**

Maintenance is a later capability, not part of the initial conquest model.

### Product Reward Possibility

Future idea only: if MOMENTUM reaches sufficient scale, partnerships could potentially provide optional monthly rewards that allow users to treat themselves for sustained maintenance of their MOMENTUM. This is intentionally outside the current product scope and should remain a preserved possibility rather than an implementation requirement.

### Domain Model Principle

The hierarchy exists to progressively reduce cognitive scope until the user can say, **“I can do that.”**

The system should preserve the simplicity of the progression:

**Complete → Check → Advance or Celebrate**

The hierarchy provides context. The sequence provides direction. The current Mission provides action. Completion provides closure and progression.

### Current Status

### Current Status

This is the **WIP product concept** that Milestone 2 ("First Conquest") began to
implement as a vertical slice. The **hierarchy** (Mountain Range → Mountain →
Mole Hill → Mission), **completion progression**, and **Mission lifecycle**
(Start → Complete; only Complete advances the hierarchy) ship in
`src/services/progression.ts` and the Mission Anchor (ADR-0001). See
`docs/04_Mission_Engine.md` and
`docs/adr/0002-mountains-to-mole-hills-progression.md` for the implemented model
and its decisions. Recursive Mountain Ranges, recurring Mole Hills
(maintenance), and the reward possibility remain future work.
