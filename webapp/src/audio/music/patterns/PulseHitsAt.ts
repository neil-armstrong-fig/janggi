import type {DrumHit} from "@src/audio/music/patterns/types/DrumHit";
import {beatAt} from "@src/audio/music/cycle/BeatAt";

/**
 * The slow drum strokes under the game once the first pieces have come off, spread across the long
 * 장단 cycle rather than beating out a bar: both heads struck together to open each cycle, the low head
 * alone half way through it, and — once the game has properly opened up — a light stroke of the bright
 * head as the last beat comes round, which is what makes a slow cycle lean towards the next.
 */
export function pulseHitsAt(step: number, tension: number): readonly DrumHit[] {
  const beat = beatAt(step);
  if (!beat.onset) return NOTHING;

  if (beat.index === 0) return OPENING;
  if (beat.index === MIDDLE_BEAT) return [{head: "gung", weight: 0.55}];
  if (beat.last && tension >= LEANS_FORWARD_AT) return [{head: "chae", weight: 0.35}];

  return NOTHING;
}

/** Both heads at once — the stroke a cycle opens on. */
const OPENING: readonly DrumHit[] = [
  {head: "gung", weight: 0.9},
  {head: "chae", weight: 0.5},
];

/** The beat that begins the second half of the cycle. */
const MIDDLE_BEAT = 3;

const LEANS_FORWARD_AT = 0.3;

const NOTHING: readonly DrumHit[] = [];
