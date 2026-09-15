import {STEPS_PER_WAITING_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import {expect, it} from "vitest";
import {waitingNoteAt} from "@src/audio/music/patterns/WaitingNoteAt";

const THEME = Array.from({length: 64}, (_, step) => step);

it("plucks the same theme each time round", () => {
  for (const step of THEME) expect(waitingNoteAt(step + 64, 1)).toEqual(waitingNoteAt(step, 1));
});

it("leaves passing notes out on a low fill, and never a note the line leans on", () => {
  const sparse = THEME.filter(step => waitingNoteAt(step, 0));
  const full = THEME.filter(step => waitingNoteAt(step, 1));

  expect(sparse.length).toBeGreaterThan(0);
  expect(sparse.length).toBeLessThan(full.length);
  for (const step of sparse) expect(waitingNoteAt(step, 0)).toEqual(waitingNoteAt(step, 1));
});

it("plucks a passing note more softly than the notes it passes between", () => {
  const passing = THEME.find(step => waitingNoteAt(step, 1) && !waitingNoteAt(step, 0)) ?? -1;

  expect(waitingNoteAt(passing, 1)?.weight).toBeLessThan(waitingNoteAt(0, 1)?.weight ?? 0);
});

/** So the line breathes, and never crowds a player reading the settings. */
it("lets each phrase ring out through its last bar rather than plucking more", () => {
  for (const step of [...range(25, 32), ...range(57, 64)]) expect(waitingNoteAt(step, 1)).toBeUndefined();
});

it("leans only on tones of the chord the bass is plucking under it", () => {
  for (const step of THEME.filter(at => waitingNoteAt(at, 0))) {
    const degree = waitingNoteAt(step, 0)?.degree ?? -1;

    expect({step, tone: chordAt(step, STEPS_PER_WAITING_CHORD).tones.includes(degree % 5)}).toEqual({step, tone: true});
  }
});

it("comes home to the root at the end of the theme", () => {
  const last = THEME.filter(step => waitingNoteAt(step, 1)).at(-1) ?? -1;

  expect(waitingNoteAt(last, 1)?.degree).toBe(0);
});

it("stays within two octaves of the root", () => {
  for (const step of THEME) {
    const degree = waitingNoteAt(step, 1)?.degree ?? 0;

    expect(degree).toBeGreaterThanOrEqual(0);
    expect(degree).toBeLessThan(10);
  }
});

function range(from: number, to: number): number[] {
  return Array.from({length: to - from}, (_, index) => from + index);
}
