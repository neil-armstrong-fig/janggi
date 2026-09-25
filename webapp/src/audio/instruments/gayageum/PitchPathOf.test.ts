import {expect, it} from "vitest";
import {pitchPathOf} from "@src/audio/instruments/gayageum/PitchPathOf";

it("starts a hair above the note", () => {
  expect(pitchPathOf(1)[0]?.cents).toBeGreaterThan(0);
});

it("settles onto the note itself", () => {
  const settled = pitchPathOf(1)[1];

  expect(settled?.cents).toBe(0);
  expect(settled?.seconds).toBeGreaterThan(0);
});

it("holds the note until part-way through, then sags below it by the end", () => {
  const path = pitchPathOf(1);

  expect(path[2]).toEqual({seconds: 0.45, cents: 0});
  expect(path.at(-1)).toEqual({seconds: 1, cents: -26});
});

it("never lets the path run backwards in time, even for a note shorter than its settling", () => {
  const seconds = pitchPathOf(0.03).map(knot => knot.seconds);

  seconds.slice(1).forEach((second, index) => expect(second).toBeGreaterThanOrEqual(seconds[index] ?? 0));
});
