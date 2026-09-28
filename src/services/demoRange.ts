// Demo data for the Milestone 2 vertical slice.
//
// MOMENTUM has no persistence or hierarchy editor yet (both out of scope for
// this milestone), so a single example Mountain Range is seeded in memory so
// the full conquest experience — Mission → Hill Climbed → Mountain Conquered —
// can actually be exercised end to end. The user still supplies the Missions
// themselves (Begin Today / Inbox promotion); the seeded structure provides the
// Mountains and Mole Hills that give progress its shape.
//
// This is explicitly example data and will be replaced by real persistence and
// user-modelled ranges in a later milestone.

import type { MountainRange } from './progression'

export function createDemoRange(): MountainRange {
  return {
    id: 'range-first-ascent',
    name: 'My First Ascent',
    mountains: [
      {
        id: 'mountain-first',
        name: 'Mountain One',
        hills: [
          { id: 'hill-begin', name: 'Begin', missions: [] },
          { id: 'hill-build', name: 'Build', missions: [] },
          { id: 'hill-finish', name: 'Finish', missions: [] },
        ],
      },
    ],
  }
}
