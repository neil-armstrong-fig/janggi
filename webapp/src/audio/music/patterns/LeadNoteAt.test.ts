import {JANGDAN} from "@src/audio/music/cycle/jangdan/Jangdan";
import {beatAt} from "@src/audio/music/cycle/BeatAt";
import {expect, it} from "vitest";
import {leadNoteAt} from "@src/audio/music/patterns/LeadNoteAt";

const STEPS = JANGDAN.reduce((sum, length) => sum + length, 0);
const TURNS = Array.from({length: 100}, (_, index) => index / 100);

it("starts a note only where a beat begins", () => {
  for (let step = 0; step < STEPS; step += 1) {
    const {onset, last} = beatAt(step);

    expect({step, sounds: leadNoteAt(step, 5, 0.5, 0.5) !== undefined}).toEqual({step, sounds: onset && !last});
  }
});

it("rests through the last beat of every cycle, leaving it to the echo", () => {
  const lastBeat = STEPS - (JANGDAN.at(-1) ?? 0);

  expect(leadNoteAt(lastBeat, 5, 0.5, 0.5)).toBeUndefined();
  expect(leadNoteAt(lastBeat + STEPS, 5, 0.5, 0.5)).toBeUndefined();
});

it("holds each note for the whole of its beat", () => {
  expect(leadNoteAt(0, 5, 0.5, 0.5)?.steps).toBe(JANGDAN[0]);
  expect(leadNoteAt(8, 5, 0.5, 0.5)?.steps).toBe(beatAt(8).length);
});

it("moves by no more than a step from the note before", () => {
  for (const turn of TURNS) expect(Math.abs((leadNoteAt(0, 5, turn, 0.5)?.degree ?? 99) - 5)).toBeLessThanOrEqual(1);
});

it("sometimes holds the very note it was on", () => {
  expect(leadNoteAt(0, 5, 0.1, 0.5)?.degree).toBe(5);
});

it("goes both down and up, depending on the turn", () => {
  expect(leadNoteAt(0, 5, 0.4, 0.5)?.degree).toBe(4);
  expect(leadNoteAt(0, 5, 0.8, 0.5)?.degree).toBe(6);
});

it("turns back at either end of its range rather than leaving it", () => {
  expect(leadNoteAt(0, 3, 0.4, 0.5)?.degree).toBe(4);
  expect(leadNoteAt(0, 9, 0.8, 0.5)?.degree).toBe(8);
});

it("scoops into some notes, lets others fall away, and plays the rest plain", () => {
  expect(leadNoteAt(0, 5, 0.5, 0.1)?.slide).toBe("scoop");
  expect(leadNoteAt(0, 5, 0.5, 0.5)?.slide).toBe("none");
  expect(leadNoteAt(0, 5, 0.5, 0.9)?.slide).toBe("fall");
});
