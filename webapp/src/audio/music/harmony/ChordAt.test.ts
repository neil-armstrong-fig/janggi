import {STEPS_PER_GAME_CHORD, STEPS_PER_WAITING_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import {expect, it} from "vitest";

const ROUND = Array.from({length: 96}, (_, step) => step);

it("holds each chord for as many steps as it is counted in", () => {
  expect(chordAt(7, STEPS_PER_WAITING_CHORD)).toEqual(chordAt(0, STEPS_PER_WAITING_CHORD));
  expect(chordAt(8, STEPS_PER_WAITING_CHORD)).not.toEqual(chordAt(0, STEPS_PER_WAITING_CHORD));
  expect(chordAt(11, STEPS_PER_GAME_CHORD)).toEqual(chordAt(0, STEPS_PER_GAME_CHORD));
  expect(chordAt(12, STEPS_PER_GAME_CHORD)).not.toEqual(chordAt(0, STEPS_PER_GAME_CHORD));
});

it("sets out from home, and comes home again by the end of the progression", () => {
  expect(chordAt(0, STEPS_PER_GAME_CHORD).root).toBe(0);
  expect(chordAt(95, STEPS_PER_GAME_CHORD).root).toBe(0);
  for (const step of ROUND)
    expect(chordAt(step + 96, STEPS_PER_GAME_CHORD)).toEqual(chordAt(step, STEPS_PER_GAME_CHORD));
});

it("builds every chord from three notes of the mode, its root among them", () => {
  for (const step of ROUND) {
    const {root, tones} = chordAt(step, STEPS_PER_GAME_CHORD);

    expect(tones).toHaveLength(3);
    expect(tones).toContain(root);
    for (const tone of tones) expect(tone >= 0 && tone < 5).toBe(true);
  }
});
