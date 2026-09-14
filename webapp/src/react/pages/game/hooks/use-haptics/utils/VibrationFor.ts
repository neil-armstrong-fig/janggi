import type {Cue} from "@src/audio/types/Cue";

/**
 * The buzz a phone gives for one change to the game, in the milliseconds `navigator.vibrate` takes —
 * on, off, on — or nothing where the change is not worth feeling.
 *
 * Read off the same cues the sound is, so a phone on silent tells a player what the speaker would
 * have: a tap for a piece set down, a harder tap for a capture, a stutter for a check, and a long
 * pattern for the end of a game. Where one change makes several sounds, the rarest of them is what is
 * felt — a capture that gives check buzzes as a check.
 *
 * A take-back, a rested turn and a new deal are not felt. A player's own thumb has just done them, and
 * a buzz for correcting yourself is a scold.
 */
export function vibrationFor(cues: readonly Cue[]): readonly number[] | undefined {
  const heard = new Set(cues.map(({name}) => name));

  if (heard.has("checkmate") || heard.has("pointsWin") || heard.has("bikjang")) return ENDING;
  if (heard.has("check")) return CHECK;
  if (heard.has("pieceTaken")) return TAKEN;
  if (heard.has("piecePlaced")) return PLACED;

  return undefined;
}

const PLACED: readonly number[] = [8];
const TAKEN: readonly number[] = [22];
const CHECK: readonly number[] = [30, 40, 30];
const ENDING: readonly number[] = [60, 60, 120];
