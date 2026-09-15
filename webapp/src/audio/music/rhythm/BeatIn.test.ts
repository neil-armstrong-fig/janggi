import {JAJINMORI, JUNGMORI} from "@src/audio/music/rhythm/rhythms/Rhythms";
import {expect, it} from "vitest";
import {beatIn} from "@src/audio/music/rhythm/BeatIn";

const ROUND = Array.from({length: 24}, (_, step) => step);

it("begins a beat of 중모리 on every second step", () => {
  expect(ROUND.filter(step => beatIn(JUNGMORI, step).onset)).toEqual(ROUND.filter(step => step % 2 === 0));
});

it("begins a beat of a twelve-step 장단 on every third step", () => {
  expect(ROUND.filter(step => beatIn(JAJINMORI, step).onset)).toEqual(ROUND.filter(step => step % 3 === 0));
});

it("knows the last beat of the cycle", () => {
  expect(beatIn(JAJINMORI, 10)).toEqual({index: 3, onset: false, length: 3, last: true});
  expect(beatIn(JUNGMORI, 22).last).toBe(true);
});
