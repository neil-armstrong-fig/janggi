import type {DrumHit} from "@src/audio/music/patterns/types/DrumHit";

/**
 * The fuller drumming of a fight at its height, across the whole of the 장단 cycle: the low head on
 * the two strong beats, the bright head on the others, and lighter strokes filling in between them.
 *
 * It thickens rather than switching on. While the game is only a little tense just the strongest
 * strokes of the figure are played; the quieter ones join as tension climbs, until the whole figure is
 * sounding — and every stroke is struck harder the tenser the game is.
 */
export function percussionHitsAt(step: number, tension: number): readonly DrumHit[] {
  const stroke = FIGURE[((step % FIGURE.length) + FIGURE.length) % FIGURE.length];
  if (!stroke || stroke.weight < QUIETEST_KEPT_WHEN_CALM - QUIETEST_KEPT_RANGE * tension) return NOTHING;

  return [{head: stroke.head, weight: stroke.weight * (0.6 + 0.4 * tension)}];
}

/**
 * One cycle of the figure, a stroke or a rest on each of its sixteen steps. Its strokes on steps 0, 4,
 * 6, 8, 11 and 14 fall where the beats of `JANGDAN` begin; the rest fill in between them.
 */
const FIGURE: readonly (DrumHit | undefined)[] = [
  {head: "gung", weight: 0.85},
  undefined,
  {head: "chae", weight: 0.3},
  undefined,
  {head: "chae", weight: 0.5},
  undefined,
  {head: "chae", weight: 0.35},
  undefined,
  {head: "gung", weight: 0.6},
  undefined,
  {head: "chae", weight: 0.25},
  {head: "chae", weight: 0.45},
  undefined,
  {head: "chae", weight: 0.2},
  {head: "chae", weight: 0.55},
  undefined,
];

/** Only strokes at least this heavy are played while the game is calm — the two on the strong beats. */
const QUIETEST_KEPT_WHEN_CALM = 0.6;

/** How far that bar falls as the game grows tense, which by the end lets every stroke through. */
const QUIETEST_KEPT_RANGE = 0.4;

const NOTHING: readonly DrumHit[] = [];
