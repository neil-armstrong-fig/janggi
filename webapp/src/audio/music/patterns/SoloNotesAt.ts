import type {Meter, Rhythm} from "@src/audio/music/rhythm/types/Rhythm";
import {STEPS_PER_GAME_CHORD, chordAt} from "@src/audio/music/harmony/ChordAt";
import type {SoloNote} from "@src/audio/music/patterns/types/SoloNote";
import type {SoloPlan} from "@src/audio/music/patterns/types/SoloPlan";
import {chordToneNear} from "@src/audio/music/harmony/ChordToneNear";

/** One note of a motif, placed within the twelve steps of a chord. */
interface MotifNote {
  /** Which step of the chord it is plucked on; a fraction plucks it part way through, for a quick run. */
  readonly at: number;
  /** How many degrees of 평조 above or below the chord's root, in the soloist's register. */
  readonly tone: number;
  readonly steps: number;
  /** Whether the line leans on it — which is bent onto a tone of the chord — or passes through. */
  readonly lean: boolean;
}

type Motif = readonly MotifNote[];

/**
 * The strings the soloist plucks on this step, in the manner of 가야금 산조.
 *
 * **It plays motifs, not a wandering line.** A phrase lasts four chords. The soloist makes a call on the
 * first, repeats it over the second — the same rhythm and contour, moved onto the new chord — answers
 * it with a different motif on the third, and closes on the fourth with a cadence that comes to rest on
 * the chord's root. That call, repeat, answer and close is what lets a listener follow the playing: they
 * hear a figure, hear it again, and hear it answered. `plan` is which motifs the phrase is built from,
 * rolled fresh for each phrase by `phrasePlanFor`.
 *
 * Motifs are written for the 장단's meter — in twos for 중모리, in threes for the others — so the solo
 * sits in the rhythm it is played over. Their quick runs fall part way through a step. **Every note the
 * line leans on is a tone of the chord the bass is plucking** (`chordToneNear`); only the brief passing
 * notes between them step outside it.
 */
export function soloNotesAt(step: number, rhythm: Rhythm, plan: SoloPlan): readonly SoloNote[] {
  const inChord = ((step % STEPS_PER_GAME_CHORD) + STEPS_PER_GAME_CHORD) % STEPS_PER_GAME_CHORD;
  const chord = chordAt(step, STEPS_PER_GAME_CHORD);
  const anchor = chord.root + ANCHOR;

  return motifFor(step, rhythm.meter, plan)
    .filter(note => Math.floor(note.at) === inChord)
    .map((note, index) => ({
      degree: note.lean ? chordToneNear(anchor + note.tone, chord, note.tone) : anchor + note.tone,
      offset: note.at - Math.floor(note.at),
      steps: note.steps,
      weight: (note.lean ? LEANING_WEIGHT : PASSING_WEIGHT) + (inChord === 0 && index === 0 ? DOWNBEAT_ACCENT : 0),
      leaning: note.lean,
    }));
}

function motifFor(step: number, meter: Meter, plan: SoloPlan): Motif {
  const chordIndex = Math.floor(step / STEPS_PER_GAME_CHORD);
  const place = ((chordIndex % CHORDS_PER_PHRASE) + CHORDS_PER_PHRASE) % CHORDS_PER_PHRASE;

  if (place === CLOSE) return CADENCES[meter];

  return MOTIFS[meter][place === ANSWER ? plan.answer : plan.call] ?? CADENCES[meter];
}

/** How many motifs there are to build a phrase from, in either meter. */
export const MOTIF_COUNT = 4;

/** How many steps a phrase lasts: four chords, two rounds. */
export const STEPS_PER_PHRASE = STEPS_PER_GAME_CHORD * 4;

const CHORDS_PER_PHRASE = 4;

/** Where in the phrase the answer is played, and where it closes; the call is played on both before. */
const ANSWER = 2;
const CLOSE = 3;

/** The chord's root in the soloist's register — an octave above the bass's root. */
const ANCHOR = 5;

const LEANING_WEIGHT = 0.62;
const PASSING_WEIGHT = 0.4;

/** The first note of a chord is struck a little harder, so the phrase is heard to begin. */
const DOWNBEAT_ACCENT = 0.12;

function lean(at: number, tone: number, steps: number): MotifNote {
  return {at, tone, steps, lean: true};
}

function pass(at: number, tone: number, steps: number): MotifNote {
  return {at, tone, steps, lean: false};
}

/** The motifs, for each meter: a rising call, a turn, a run down from the top, and a long leaning note. */
const MOTIFS: Record<Meter, readonly Motif[]> = {
  duple: [
    [lean(0, 0, 3), pass(3, 1, 0.5), pass(3.5, 2, 0.5), lean(4, 3, 4), pass(8, 2, 2), lean(10, 0, 2)],
    [lean(0, 2, 2), pass(2, 3, 1), pass(3, 2, 1), lean(4, 0, 3), pass(7, -1, 1), lean(8, 0, 4)],
    [lean(0, 4, 2), pass(2, 3, 0.5), pass(2.5, 2, 0.5), pass(3, 1, 1), lean(4, 2, 5), pass(9, 1, 1), lean(10, 0, 2)],
    [lean(0, 0, 6), pass(6, 1, 1), pass(7, 2, 1), lean(8, 3, 4)],
  ],
  triple: [
    [lean(0, 0, 2), pass(2, 1, 1), lean(3, 2, 3), lean(6, 3, 2), pass(8, 2, 1), lean(9, 0, 3)],
    [lean(0, 3, 3), pass(3, 2, 2), pass(5, 1, 1), lean(6, 2, 3), lean(9, 0, 3)],
    [lean(0, 0, 1), pass(1, 1, 1), pass(2, 2, 1), lean(3, 3, 3), lean(6, 4, 2), pass(8, 3, 1), lean(9, 2, 3)],
    [lean(0, 2, 5), pass(5, 1, 1), lean(6, 0, 2), pass(8, -1, 1), lean(9, 0, 3)],
  ],
};

/** The close of every phrase: down onto the root, and held. */
const CADENCES: Record<Meter, Motif> = {
  duple: [lean(0, 2, 2), pass(2, 1, 2), lean(4, 0, 8)],
  triple: [lean(0, 2, 2), pass(2, 1, 1), lean(3, 0, 9)],
};
