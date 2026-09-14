import {GYEMYEONJO} from "@src/audio/modes/Gyemyeonjo";
import {PYEONGJO} from "@src/audio/modes/Pyeongjo";
import {expect, it} from "vitest";
import {pitchOf} from "@src/audio/modes/PitchOf";

const ROOT = 220;

it("puts the first degree on the root", () => {
  expect(pitchOf(ROOT, PYEONGJO, 0)).toBeCloseTo(ROOT);
});

it("comes round to the root an octave up after all five notes", () => {
  expect(pitchOf(ROOT, PYEONGJO, 5)).toBeCloseTo(ROOT * 2);
});

it("walks below the root for a degree below nought", () => {
  expect(pitchOf(ROOT, PYEONGJO, -5)).toBeCloseTo(ROOT / 2);
  expect(pitchOf(ROOT, PYEONGJO, -1)).toBeCloseTo(ROOT * 2 ** (-3 / 12));
});

it("only ever climbs as the degree does", () => {
  const pitches = Array.from({length: 21}, (_, index) => pitchOf(ROOT, GYEMYEONJO, index - 10));

  pitches.slice(1).forEach((pitch, index) => expect(pitch).toBeGreaterThan(pitches[index] ?? Infinity));
});

/** The two modes differ where it matters: 계면조's second note is a minor third, 평조's a whole tone. */
it("sets the check theme's mode a minor third above the root, where the game's own has a whole tone", () => {
  expect(pitchOf(ROOT, GYEMYEONJO, 1)).toBeCloseTo(ROOT * 2 ** (3 / 12));
  expect(pitchOf(ROOT, PYEONGJO, 1)).toBeCloseTo(ROOT * 2 ** (2 / 12));
});
