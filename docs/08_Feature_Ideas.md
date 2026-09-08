# MOMENTUM — Work in Progress

## Product Language: Mountains to Mole Hills

### Concept

MOMENTUM uses a mountain-and-hill metaphor to describe the user's movement from overwhelm to action and, ultimately, progress.

- **Mountain Range** — the overarching challenge or collection of major challenges. A statement such as “I want to clean my apartment” may represent a Mountain Range rather than a single Mountain, because the apartment contains multiple rooms or areas that can each become their own Mountain.
- **Mountain** — a major area of accomplishment within a Mountain Range. For example, “Clean the kitchen” can be a Mountain within the larger goal of cleaning the apartment.
- **Mole Hill** — a meaningful, bounded objective within a Mountain. For example, “Clear the kitchen counter” can be a Mole Hill within the kitchen Mountain.
- **Mission** — an individual achievable step toward completing a Mole Hill. A Mission is the concrete action immediately in front of the user.
- **Action** — the behavioral interaction with a Mission. In the initial model, this is expected to be represented by the Mission's execution state rather than as a separate domain entity: **Start → Complete**.
- **Mission Anchor** — the persistent representation of the current Mission and its next achievable step, keeping the user's attention on what can be acted upon now.

### Hierarchy

**Mountain Range → Mountain → Mole Hill → Mission → Action**

A Mountain Range may contain multiple Mountains. A Mountain may contain multiple Mole Hills. A Mole Hill may contain multiple Missions. The structure is intended to be flexible rather than a rigid project plan; users should be able to add, remove, rename, or otherwise adjust meaningful chunks as circumstances change.

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
- **The user retains authority over completion.** MOMENTUM supports judgment rather than replacing it.
- **Forward momentum matters more than maintaining a perfect task database.** Blocked or impossible Missions should eventually be replaceable or reworked rather than becoming dead ends.
- **The Mission Anchor stays focused on the current Mission.** The full hierarchy provides context, but the immediate experience remains: here is what you are doing now; Start; do it; Complete.
- **Victory deserves recognition.** “Hill Climbed!”, “Mountain Conquered!”, and “Mountain Range Conquered!” are progress states and moments of closure, not merely database status changes.

### Product Principle

MOMENTUM should acknowledge that something may genuinely feel like a mountain. The purpose of reducing it to a mole hill is not to dismiss the user's difficulty, but to find a piece that can be moved now.

### Current Status

This remains a **WIP product concept**. The terminology, hierarchy, completion model, and closure behavior are being documented before implementation. The next design checkpoint is to define the minimum viable data model for **Mountain Range, Mountain, Mole Hill, and Mission**, including their relationships and the minimum lifecycle required to support this model.
