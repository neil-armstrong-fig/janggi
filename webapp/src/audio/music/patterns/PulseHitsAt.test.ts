import {beatAt} from "@src/audio/music/cycle/BeatAt";
import {expect, it} from "vitest";
import {pulseHitsAt} from "@src/audio/music/patterns/PulseHitsAt";

it("opens every cycle by striking both heads together", () => {
  const opening = [
    {head: "gung", weight: 0.9},
    {head: "chae", weight: 0.5},
  ];

  expect(pulseHitsAt(0, 0.2)).toEqual(opening);
  expect(pulseHitsAt(16, 0.2)).toEqual(opening);
});

it("strikes the low head alone, and more softly, half way through the cycle", () => {
  expect(beatAt(8)).toMatchObject({index: 3, onset: true});
  expect(pulseHitsAt(8, 0.2)).toEqual([{head: "gung", weight: 0.55}]);
});

it("adds a light stroke on the last beat only once the game has opened up", () => {
  expect(pulseHitsAt(14, 0.1)).toEqual([]);
  expect(pulseHitsAt(14, 0.5)).toEqual([{head: "chae", weight: 0.35}]);
});

it("strikes nothing on the cycle's other beats", () => {
  for (const step of [4, 6, 11]) expect(pulseHitsAt(step, 1)).toEqual([]);
});

it("strikes nothing between beats", () => {
  for (let step = 0; step < 16; step += 1) {
    if (!beatAt(step).onset) expect({step, hits: pulseHitsAt(step, 1)}).toEqual({step, hits: []});
  }
});
