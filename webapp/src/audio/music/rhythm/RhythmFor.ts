import {JAJINMORI, RHYTHMS} from "@src/audio/music/rhythm/rhythms/Rhythms";
import type {Rhythm} from "@src/audio/music/rhythm/types/Rhythm";

/**
 * The 장단 the game's music is in for how tense the game is: 중모리 while it is calm, 중중모리 as the
 * fight opens, and 자진모리 at its height. The music only moves to it at the start of a round.
 */
export function rhythmFor(tension: number): Rhythm {
  return RHYTHMS.find(rhythm => tension < rhythm.tension.to) ?? JAJINMORI;
}
