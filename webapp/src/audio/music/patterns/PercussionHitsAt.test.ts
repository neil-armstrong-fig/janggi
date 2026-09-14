import {beatAt} from "@src/audio/music/cycle/BeatAt";
import {expect, it} from "vitest";
import {percussionHitsAt} from "@src/audio/music/patterns/PercussionHitsAt";

it("keeps the low stroke that opens the cycle however calm the game", () => {
  expect(percussionHitsAt(0, 0)[0]?.head).toBe("gung");
});

it("plays only the two strong beats while the game is calm, each where a beat begins", () => {
  const struck = stepsStruck(0);

  expect(struck).toEqual([0, 8]);
  expect(struck.every(step => beatAt(step).onset)).toBe(true);
});

it("thickens as the game grows tense", () => {
  expect(stepsStruck(0.5).length).toBeGreaterThan(stepsStruck(0).length);
  expect(stepsStruck(1).length).toBeGreaterThan(stepsStruck(0.5).length);
});

it("strikes on every beat of the cycle once the game is as tense as it gets", () => {
  const struck = stepsStruck(1);

  for (let step = 0; step < 16; step += 1) {
    if (beatAt(step).onset) expect({step, struck: struck.includes(step)}).toEqual({step, struck: true});
  }
});

it("strikes each stroke harder the tenser the game", () => {
  expect(percussionHitsAt(0, 1)[0]?.weight ?? 0).toBeGreaterThan(percussionHitsAt(0, 0)[0]?.weight ?? 0);
});

it("repeats the same figure every cycle", () => {
  for (let step = 0; step < 16; step += 1)
    expect(percussionHitsAt(step + 32, 0.7)).toEqual(percussionHitsAt(step, 0.7));
});

function stepsStruck(tension: number): number[] {
  return Array.from({length: 16}, (_, step) => step).filter(step => percussionHitsAt(step, tension).length > 0);
}
