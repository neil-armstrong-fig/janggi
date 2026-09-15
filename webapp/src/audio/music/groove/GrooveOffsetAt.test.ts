import {expect, it} from "vitest";
import {grooveOffsetAt} from "@src/audio/music/groove/GrooveOffsetAt";

const LOOSENESSES = [0, 0.3, 0.7, 1];

it("plays an on-step all but on time, loosened by no more than a hair", () => {
  for (const looseness of LOOSENESSES) expect(grooveOffsetAt(4, looseness, true)).toBeLessThan(0.02);
});

it("swings every off-step late where the rhythm swings, whatever the looseness", () => {
  for (const looseness of LOOSENESSES) {
    expect(grooveOffsetAt(5, looseness, true)).toBeGreaterThan(grooveOffsetAt(4, 1, true));
  }
});

it("plays the off-steps straight where the rhythm does not swing", () => {
  expect(grooveOffsetAt(5, 0, false)).toBe(0);
});

it("loosens a step by how loose it is handed", () => {
  expect(grooveOffsetAt(4, 1, true)).toBeGreaterThan(grooveOffsetAt(4, 0, true));
});

/** A note booked early could fall before the clock reaches it; one booked too late would trip the next. */
it("never plays a step early, nor so late it runs into the next", () => {
  for (let step = 0; step < 16; step += 1) {
    for (const looseness of LOOSENESSES) {
      expect(grooveOffsetAt(step, looseness, true)).toBeGreaterThanOrEqual(0);
      expect(grooveOffsetAt(step, looseness, true)).toBeLessThan(0.5);
    }
  }
});
