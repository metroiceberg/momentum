# Changelog

All notable changes to MOMENTUM are documented here.

## [Unreleased]

### Added
- **Inbox / Capture surface** (extends First Light): capture an unstructured
  thought or task into a simple in-memory inbox list. Capture-only for now —
  no persistence, promotion-to-mission, or processing. Application-level
  inbox state is owned by `App` (consistent with ADR-0001); the Mission
  Anchor (Sidebar) is unchanged.
