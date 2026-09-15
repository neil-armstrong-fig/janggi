import type {Mood} from "@src/audio/types/Mood";
import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";

/**
 * How long one step of the music lasts, in seconds, for how the game feels and the 장단 it is in.
 *
 * The waiting theme drifts at an unhurried pace of its own while a game is being set up, and does not
 * hurry whatever it is handed: nothing is at stake yet.
 *
 * The game's own music moves at the pace of its 장단 (`RHYTHMS`) — each quicker than the one before it —
 * and quickens a little within it as the game grows tense, so the build is heard both as the 장단
 * changing and as the playing pressing on.
 *
 * The check theme keeps a pace of its own, quickening with tension too. It is the pace the check theme
 * was written at, and is kept exactly.
 */
export function secondsPerStep({tension, inCheck, underWay}: Mood, rhythm: Rhythm): number {
  if (inCheck) return 60 / (CHECK_CALM_BPM + (CHECK_TENSE_BPM - CHECK_CALM_BPM) * tension) / 2;

  if (!underWay) return 60 / WAITING_BPM / 2;

  const {calm, tense} = rhythm.stepSeconds;

  return calm + (tense - calm) * progressThrough(rhythm, tension);
}

/** How far through its 장단's stretch of tension the game is, from nought to one. */
function progressThrough({tension: {from, to}}: Rhythm, tension: number): number {
  return Math.min(1, Math.max(0, (tension - from) / (to - from)));
}

/** Beats a minute for the waiting theme. */
const WAITING_BPM = 48;

/** Beats a minute for the check theme, at the opening and at its tensest. */
const CHECK_CALM_BPM = 74;
const CHECK_TENSE_BPM = 96;
