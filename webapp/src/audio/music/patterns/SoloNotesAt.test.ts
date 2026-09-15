import {JAJINMORI, JUNGJUNGMORI, JUNGMORI} from "@src/audio/music/rhythm/rhythms/Rhythms";
import {STEPS_PER_GAME_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";
import type {SoloPlan} from "@src/audio/music/patterns/types/SoloPlan";
import {beatIn} from "@src/audio/music/rhythm/BeatIn";
import {expect, it} from "vitest";
import {soloNotesAt} from "@src/audio/music/patterns/SoloNotesAt";

const PHRASES = Array.from({length: 96}, (_, step) => step);
const PLANS: readonly SoloPlan[] = [
  {call: 0, answer: 1},
  {call: 1, answer: 3},
  {call: 2, answer: 0},
  {call: 3, answer: 2},
];

it("leans only on tones of the chord the bass is plucking", () => {
  for (const rhythm of [JUNGMORI, JUNGJUNGMORI, JAJINMORI]) {
    for (const plan of PLANS) {
      for (const step of PHRASES) {
        for (const note of soloNotesAt(step, rhythm, plan).filter(played => played.leaning)) {
          const tone = chordAt(step, STEPS_PER_GAME_CHORD).tones.includes(note.degree % 5);

          expect({rhythm: rhythm.name, step, tone}).toEqual({rhythm: rhythm.name, step, tone: true});
        }
      }
    }
  }
});

/** A figure heard, and heard again, is what lets a listener follow the playing. */
it("repeats its call over the second chord of the phrase", () => {
  for (const rhythm of [JUNGMORI, JAJINMORI]) {
    for (const plan of PLANS) expect(shapeOver(rhythm, plan, 1)).toEqual(shapeOver(rhythm, plan, 0));
  }
});

it("answers the call with a different motif on the third chord", () => {
  for (const rhythm of [JUNGMORI, JAJINMORI]) {
    for (const plan of PLANS) expect(shapeOver(rhythm, plan, 2)).not.toEqual(shapeOver(rhythm, plan, 0));
  }
});

it("closes every phrase on a long note of the chord's root", () => {
  for (const plan of PLANS) {
    const close = PHRASES.slice(36, 48).flatMap(step => soloNotesAt(step, JUNGMORI, plan));
    const longest = close.reduce((held, note) => (note.steps > held.steps ? note : held));

    expect(longest.degree % 5).toBe(chordAt(36, STEPS_PER_GAME_CHORD).root);
  }
});

it("plays quick runs part way through a step", () => {
  const offsets = PHRASES.flatMap(step => soloNotesAt(step, JUNGMORI, {call: 0, answer: 2}).map(note => note.offset));

  expect(offsets.some(offset => offset > 0)).toBe(true);
  expect(offsets.every(offset => offset >= 0 && offset < 1)).toBe(true);
});

it("leans on its notes where the 장단's beats begin", () => {
  for (const rhythm of [JUNGMORI, JAJINMORI]) {
    for (const plan of PLANS) {
      const leansOn = PHRASES.filter(step =>
        soloNotesAt(step, rhythm, plan).some(played => played.leaning && played.offset === 0),
      );

      for (const step of leansOn) {
        expect({rhythm: rhythm.name, step, onset: beatIn(rhythm, step).onset}).toEqual({
          rhythm: rhythm.name,
          step,
          onset: true,
        });
      }
    }
  }
});

/** When each note of one chord's worth of solo falls, and how long it rings — its rhythm, without its pitches. */
function shapeOver(rhythm: Rhythm, plan: SoloPlan, chord: number): readonly string[] {
  return PHRASES.slice(chord * 12, chord * 12 + 12).flatMap(step =>
    soloNotesAt(step, rhythm, plan).map(note => `${(step % 12) + note.offset}:${note.steps}`),
  );
}
