import type {Chord} from "@src/audio/music/harmony/types/Chord";
import {chordToneNear} from "@src/audio/music/harmony/ChordToneNear";
import {expect, it} from "vitest";

/** A, open: A, B and E. */
const HOME: Chord = {root: 0, tones: [0, 1, 3]};

it("keeps a degree that is already in the chord, in its own octave", () => {
  expect(chordToneNear(8, HOME, 1)).toBe(8);
  expect(chordToneNear(6, HOME, -1)).toBe(6);
});

it("otherwise bends it onto the nearest tone, the way the line was leaning", () => {
  expect(chordToneNear(7, HOME, 1)).toBe(8);
  expect(chordToneNear(7, HOME, -1)).toBe(6);
});

it("crosses into the next octave where that is nearest", () => {
  expect(chordToneNear(9, HOME, 1)).toBe(10);
});
