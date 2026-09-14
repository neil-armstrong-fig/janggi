import type {EchoNote} from "@src/audio/music/patterns/types/EchoNote";
import {beatAt} from "@src/audio/music/cycle/BeatAt";

/**
 * The note the echo answers with on this step, or nothing.
 *
 * It sounds only on the last beat of the cycle, while the lead rests — 연음, one instrument taking up
 * the phrase where another breathes — and takes up the note the lead was left on: sometimes that very
 * note, sometimes the step beneath it, so the answer can close the phrase downward. It is held across
 * its beat, and the lead comes back in on the next cycle's first.
 *
 * `turn` decides which, between nought and one, handed in for the reason `leadNoteAt`'s rolls are.
 */
export function echoNoteAt(step: number, leadDegree: number, turn: number): EchoNote | undefined {
  const beat = beatAt(step);
  if (!beat.onset || !beat.last) return undefined;

  const degree = turn < FALL_BELOW ? Math.max(LOWEST, leadDegree - 1) : leadDegree;

  return {degree, steps: beat.length};
}

/** A turn below this answers a step beneath the lead's note; at or above it, on the note itself. */
const FALL_BELOW = 0.5;

/** The foot of the lead's range, which the echo never answers below. */
const LOWEST = 3;
