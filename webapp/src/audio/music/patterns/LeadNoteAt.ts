import type {LeadNote} from "@src/audio/music/patterns/types/LeadNote";
import type {Slide} from "@src/audio/instruments/types/Slide";
import {beatAt} from "@src/audio/music/cycle/BeatAt";

/**
 * The note the lead starts on this step, or nothing where it is still holding the note before, or
 * resting.
 *
 * In the manner of 수제천's piri: one long note to each beat of the cycle, held for the whole of the
 * beat, the line moving by no more than a step — and often not moving at all, the same note taken on
 * into the next beat as though the player were leaning on it. Many notes are scooped into from below or
 * let fall away at their end, which is what makes a line that slow sing rather than sit.
 *
 * It rests through the cycle's last beat, every cycle, and leaves that beat to the echo — one
 * instrument taking up the phrase where another breathes, which is what 연음 names.
 *
 * The melody is generated, and is this game's own; nothing here is transcribed from 수제천. `turn`
 * decides where the line goes and `ornament` how the note is shaped, each between nought and one,
 * handed in so the line can be tested — the music itself hands in `Math.random()`.
 */
export function leadNoteAt(step: number, previous: number, turn: number, ornament: number): LeadNote | undefined {
  const beat = beatAt(step);
  if (!beat.onset || beat.last) return undefined;

  const move = turn < HOLD_BELOW ? 0 : turn < DOWN_BELOW ? -1 : 1;
  const onward = previous + move;
  const degree = onward < LOWEST || onward > HIGHEST ? previous - move : onward;

  return {degree, steps: beat.length, slide: slideFor(ornament)};
}

function slideFor(ornament: number): Slide {
  if (ornament < SCOOP_BELOW) return "scoop";
  if (ornament >= FALL_FROM) return "fall";

  return "none";
}

/** A turn below this holds the note it was on; below `DOWN_BELOW` it steps down; above, it steps up. */
const HOLD_BELOW = 0.25;
const DOWN_BELOW = 0.6;

/** The lead's range, in degrees of the mode — the middle of the reed's voice. */
const LOWEST = 3;
const HIGHEST = 9;

/** An ornament below this scoops into the note; at or above `FALL_FROM` the note falls away. */
const SCOOP_BELOW = 0.3;
const FALL_FROM = 0.8;
