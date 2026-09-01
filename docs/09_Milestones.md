# Project Milestones

## Milestone 0 — Foundation

**Date:** June 29, 2026

Project MOMENTUM officially began.

* Development environment established.
* React, TypeScript, and Vite project created.
* Git repository initialized.
* First commit completed.
* Documentation framework established.
* Product philosophy defined.
* Sprint 0 initiated.

Status: Complete

---

## Milestone 1 — First Light

**Status:** Complete (interface continues to be extended)

The first custom version of MOMENTUM successfully replaces the default Vite application and displays the project's own interface.

Delivered so far:

* **Persistent Mission Anchor (Sidebar)** — an always-visible panel holding the
  current Mission (goal, next step, status) and its action loop
  (Not started → In Progress → Done), per ADR-0001.
* **Begin Today flow** — creates a Mission from a stated next achievable step.
* **Inbox / Capture surface** — captures unstructured thoughts/tasks into a
  simple in-memory list.
* **Inbox → Mission promotion** — a captured item can be promoted into the
  current Mission via a "Make Mission" action.
* **Completed-Mission handling** — a `done` Mission clears the main pane and
  offers "Begin a new mission" while remaining visible in the Mission Anchor.
* **Mission History** — completed Missions are retained in a simple in-memory
  history list so completed work is not lost.

All state is in-memory and owned by `App` (unidirectional flow, ADR-0001). No
persistence, router, or AI layer yet.
