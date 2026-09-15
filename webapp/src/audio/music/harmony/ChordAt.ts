import type {Chord} from "@src/audio/music/harmony/types/Chord";

/**
 * The chord the music is in on this step, when each chord lasts `stepsPerChord` steps.
 *
 * **The bass sets the chord and every melody follows it.** Everything is tuned in the one mode, so no
 * note is ever out of key — but a line choosing its notes without listening to the bass would lean on a
 * D over a plucked E, or a B over an A, and be heard as out of step with it. So there is one
 * progression, and the bass plucks the root of whichever chord it is on while every melody leans on
 * the chord's tones.
 *
 * The waiting theme changes chord every bar (`STEPS_PER_WAITING_CHORD`) and the game's music every half
 * round (`STEPS_PER_GAME_CHORD`). Eight chords make a round that sets out from home, leans away through
 * the fifth and the relative minor, and turns home again. Every chord is three notes of 평조 and nothing
 * from outside it, so a chord with no third in the mode stands open on its root, second and fifth, as
 * the music of the court does.
 */
export function chordAt(step: number, stepsPerChord: number): Chord {
  const index = Math.floor(step / stepsPerChord);

  return PROGRESSION[((index % PROGRESSION.length) + PROGRESSION.length) % PROGRESSION.length] ?? HOME;
}

/** How long each chord of the waiting theme lasts, in steps: one of its eight-step bars. */
export const STEPS_PER_WAITING_CHORD = 8;

/** How long each chord of the game's music lasts, in steps: half a round. */
export const STEPS_PER_GAME_CHORD = 12;

/** A, open: A, B and E. */
const HOME: Chord = {root: 0, tones: [0, 1, 3]};

/** D: D, F♯ and A. */
const FOURTH: Chord = {root: 2, tones: [2, 4, 0]};

/** E, open: E, F♯ and B. */
const FIFTH: Chord = {root: 3, tones: [3, 4, 1]};

/** B minor: B, D and F♯. */
const RELATIVE_MINOR: Chord = {root: 1, tones: [1, 2, 4]};

/** The round of chords, two out from home and two back. */
const PROGRESSION: readonly Chord[] = [HOME, FOURTH, HOME, FIFTH, RELATIVE_MINOR, FOURTH, FIFTH, HOME];
