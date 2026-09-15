import {JAJINMORI, JUNGJUNGMORI, JUNGMORI, RHYTHMS} from "@src/audio/music/rhythm/rhythms/Rhythms";
import {STEPS_PER_GAME_CHORD, STEPS_PER_WAITING_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import {bassNoteAt} from "@src/audio/music/patterns/BassNoteAt";
import {beatIn} from "@src/audio/music/rhythm/BeatIn";
import {expect, it} from "vitest";

const STEPS = Array.from({length: 96}, (_, step) => step);

it("plucks the root of each chord of the waiting theme where the chord begins", () => {
  for (const step of [0, 8, 16, 40]) {
    expect(bassNoteAt(step, false, JUNGMORI)?.degree).toBe(chordAt(step, STEPS_PER_WAITING_CHORD).root);
  }
});

it("plucks the root of each chord of the game where the chord begins, in every 장단", () => {
  for (const rhythm of RHYTHMS) {
    for (const step of [0, 12, 24, 36]) {
      expect(bassNoteAt(step, true, rhythm)?.degree).toBe(chordAt(step, STEPS_PER_GAME_CHORD).root);
    }
  }
});

it("answers the root lightly an octave up", () => {
  for (const rhythm of [JUNGMORI, JAJINMORI]) {
    const answer = bassNoteAt(6, true, rhythm);

    expect(answer?.degree).toBe(chordAt(6, STEPS_PER_GAME_CHORD).root + 5);
    expect(answer?.weight).toBeLessThan(bassNoteAt(0, true, rhythm)?.weight ?? 0);
  }
});

it("picks up into the next chord before it changes", () => {
  expect(bassNoteAt(22, true, JUNGMORI)).toBeDefined();
  expect(bassNoteAt(9, true, JUNGJUNGMORI)).toBeDefined();
  expect(bassNoteAt(21, true, JAJINMORI)).toBeDefined();
});

/** So the bass still sets the chord the melodies lean on, however it moves. */
it("plucks only tones of the chord it is in, waiting or in a game", () => {
  for (const step of STEPS) {
    const waiting = bassNoteAt(step, false, JUNGMORI)?.degree;
    if (waiting !== undefined) expect(chordAt(step, STEPS_PER_WAITING_CHORD).tones).toContain(waiting % 5);

    for (const rhythm of RHYTHMS) {
      const played = bassNoteAt(step, true, rhythm)?.degree;
      if (played !== undefined) expect(chordAt(step, STEPS_PER_GAME_CHORD).tones).toContain(played % 5);
    }
  }
});

/** The syncopation is the drum's; a bass landing between the beats as well made the groove lurch. */
it("plucks only where a beat of the 장단 begins, locked with the soloist", () => {
  for (const rhythm of RHYTHMS) {
    for (const step of STEPS.filter(at => bassNoteAt(at, true, rhythm))) {
      expect({rhythm: rhythm.name, step, onset: beatIn(rhythm, step).onset}).toEqual({
        rhythm: rhythm.name,
        step,
        onset: true,
      });
    }
  }
});
