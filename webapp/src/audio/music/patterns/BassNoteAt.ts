import type {BassNote} from "@src/audio/music/patterns/types/BassNote";
import type {Chord} from "@src/audio/music/harmony/types/Chord";
import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";
import {STEPS_PER_GAME_CHORD, STEPS_PER_WAITING_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import {STEPS_PER_ROUND} from "@src/audio/music/rhythm/rhythms/Rhythms";

/** One pluck of a figure: which tone of the chord it takes, how long it rings, and how hard. */
interface Pluck {
  readonly tone: (chord: Chord) => number;
  readonly steps: number;
  readonly weight: number;
}

/** A figure the bass walks: its plucks by step, how many steps it cycles over, and the chord it is on. */
interface Walk {
  readonly figure: ReadonlyMap<number, Pluck>;
  readonly length: number;
  readonly chord: Chord;
}

/**
 * The low string the bass plucks on this step, or nothing.
 *
 * The ground the rest of the music stands on. It plucks the root of the chord the music is in
 * (`chordAt`) where each chord begins, answers it lightly an octave up on a beat before the next, and
 * picks up into the next chord with its fifth. Every pluck is a tone of the chord, so the bass sets it
 * for the melodies.
 *
 * Under the waiting theme it walks one figure over the theme's bars. Once a game is under way it walks
 * the figure of the 장단 the music is in — in twos for 중모리, in threes for the others — and **every
 * pluck falls where a beat begins**, locked with the soloist. The syncopation is the drum's to play: a
 * bass that also landed between the beats doubled the drum's off-beat strokes and made the groove lurch.
 */
export function bassNoteAt(step: number, underWay: boolean, rhythm: Rhythm): BassNote | undefined {
  if (!underWay) {
    const chord = chordAt(step, STEPS_PER_WAITING_CHORD);

    return pluckOn(step, {figure: WAITING, length: WAITING_STEPS, chord});
  }

  const figure = rhythm.meter === "duple" ? DUPLE : TRIPLE;
  const chord = chordAt(step, STEPS_PER_GAME_CHORD);

  return pluckOn(step, {figure, length: STEPS_PER_ROUND, chord});
}

function pluckOn(step: number, {figure, length, chord}: Walk): BassNote | undefined {
  const pluck = figure.get(((step % length) + length) % length);
  if (!pluck) return undefined;

  return {degree: pluck.tone(chord), steps: pluck.steps, weight: pluck.weight};
}

const DEGREES_PER_OCTAVE = 5;

const root = (chord: Chord): number => chord.root;
const octave = (chord: Chord): number => chord.root + DEGREES_PER_OCTAVE;
/** The fifth is three degrees of 평조 above the root, and in every chord of the progression. */
const fifth = (chord: Chord): number => chord.root + 3;

/** The figure under the waiting theme, by step of its sixteen-step cycle; its chord changes every eight. */
const WAITING_STEPS = 16;
const WAITING: ReadonlyMap<number, Pluck> = new Map([
  [0, {tone: root, steps: 8, weight: 0.7}],
  [6, {tone: octave, steps: 2, weight: 0.3}],
  [8, {tone: root, steps: 6, weight: 0.55}],
  [11, {tone: octave, steps: 3, weight: 0.28}],
  [14, {tone: fifth, steps: 3, weight: 0.38}],
]);

/** The figure in 중모리, by step of the round, on its two-step beats; the chord changes every twelve. */
const DUPLE: ReadonlyMap<number, Pluck> = new Map([
  [0, {tone: root, steps: 10, weight: 0.7}],
  [6, {tone: octave, steps: 4, weight: 0.3}],
  [12, {tone: root, steps: 8, weight: 0.55}],
  [18, {tone: octave, steps: 3, weight: 0.28}],
  [22, {tone: fifth, steps: 2, weight: 0.38}],
]);

/** The figure in the twelve-step 장단, by step of the round, on their three-step beats. */
const TRIPLE: ReadonlyMap<number, Pluck> = new Map([
  [0, {tone: root, steps: 6, weight: 0.7}],
  [6, {tone: octave, steps: 2, weight: 0.3}],
  [9, {tone: fifth, steps: 3, weight: 0.36}],
  [12, {tone: root, steps: 6, weight: 0.6}],
  [18, {tone: octave, steps: 2, weight: 0.28}],
  [21, {tone: fifth, steps: 3, weight: 0.36}],
]);
