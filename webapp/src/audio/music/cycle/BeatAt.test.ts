import {JANGDAN} from "@src/audio/music/cycle/jangdan/Jangdan";
import {beatAt} from "@src/audio/music/cycle/BeatAt";
import {expect, it} from "vitest";

const STEPS = JANGDAN.reduce((sum, length) => sum + length, 0);

it("opens every cycle on the first beat", () => {
  expect(beatAt(0)).toEqual({index: 0, onset: true, length: 4, last: false});
  expect(beatAt(STEPS)).toEqual(beatAt(0));
});

it("holds a beat for its whole length before the next begins", () => {
  for (const step of [1, 2, 3]) expect(beatAt(step)).toEqual({index: 0, onset: false, length: 4, last: false});

  expect(beatAt(4)).toMatchObject({index: 1, onset: true});
});

it("is made of beats of more than one length, so the cycle is uneven", () => {
  expect(new Set(JANGDAN).size).toBeGreaterThan(1);
});

it("begins each beat of the cycle exactly once, in order", () => {
  const onsets = Array.from({length: STEPS}, (_, step) => beatAt(step)).filter(({onset}) => onset);

  expect(onsets.map(({index}) => index)).toEqual(JANGDAN.map((_, index) => index));
});

it("marks the cycle's final beat, and no other", () => {
  expect(beatAt(STEPS - 1)).toMatchObject({index: JANGDAN.length - 1, last: true});
  expect(beatAt(STEPS - 3)).toMatchObject({last: false});
});

it("counts a step before the music began back into the cycle", () => {
  expect(beatAt(-1)).toEqual(beatAt(STEPS - 1));
});
