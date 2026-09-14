import {JANGDAN} from "@src/audio/music/cycle/jangdan/Jangdan";
import {beatAt} from "@src/audio/music/cycle/BeatAt";
import {echoNoteAt} from "@src/audio/music/patterns/EchoNoteAt";
import {expect, it} from "vitest";

const STEPS = JANGDAN.reduce((sum, length) => sum + length, 0);
const LAST_BEAT = STEPS - (JANGDAN.at(-1) ?? 0);

it("answers only where the cycle's last beat begins, while the lead rests", () => {
  for (let step = 0; step < STEPS; step += 1) {
    expect({step, sounds: echoNoteAt(step, 6, 0.7) !== undefined}).toEqual({step, sounds: step === LAST_BEAT});
  }
});

it("takes up the very note the lead was left on", () => {
  expect(echoNoteAt(LAST_BEAT, 6, 0.7)?.degree).toBe(6);
});

it("or answers a step beneath it, closing the phrase downward", () => {
  expect(echoNoteAt(LAST_BEAT, 6, 0.2)?.degree).toBe(5);
});

it("never answers below the foot of the lead's range", () => {
  expect(echoNoteAt(LAST_BEAT, 3, 0.2)?.degree).toBe(3);
});

it("holds its note across the whole of its beat", () => {
  expect(echoNoteAt(LAST_BEAT, 6, 0.7)?.steps).toBe(beatAt(LAST_BEAT).length);
});
