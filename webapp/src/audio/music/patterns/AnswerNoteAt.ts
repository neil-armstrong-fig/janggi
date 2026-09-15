import {STEPS_PER_GAME_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import type {AnswerNote} from "@src/audio/music/patterns/types/AnswerNote";

/**
 * The long note the answering flute takes up on this step, or nothing.
 *
 * The 대금 does not play the solo's quick figures. It breathes a long note under them where a phrase
 * turns — the chord's fifth under the second half of the repeated call, and the chord's root under the
 * cadence that closes the phrase — so the solo's phrases are heard to arrive somewhere. Both are tones
 * of the chord the bass is plucking.
 */
export function answerNoteAt(step: number): AnswerNote | undefined {
  const inChord = ((step % STEPS_PER_GAME_CHORD) + STEPS_PER_GAME_CHORD) % STEPS_PER_GAME_CHORD;
  const chordIndex = Math.floor(step / STEPS_PER_GAME_CHORD);
  const place = ((chordIndex % CHORDS_PER_PHRASE) + CHORDS_PER_PHRASE) % CHORDS_PER_PHRASE;
  const {root} = chordAt(step, STEPS_PER_GAME_CHORD);

  if (inChord !== ENTERS_ON) return undefined;
  if (place === REPEAT) return {degree: root + FIFTH, steps: 6};
  if (place === CLOSE) return {degree: root, steps: 6};

  return undefined;
}

/**
 * The step of the chord the flute breathes in on: half way through, which begins a beat whether the
 * 장단 is counted in twos or in threes, and falls under the cadence once it has come to rest.
 */
const ENTERS_ON = 6;

const CHORDS_PER_PHRASE = 4;

/** The chord of the phrase the call is repeated over, and the one the phrase closes on. */
const REPEAT = 1;
const CLOSE = 3;

/** Three degrees of 평조 above a chord's root is its fifth. */
const FIFTH = 3;
