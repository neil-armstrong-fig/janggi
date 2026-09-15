import type {Rhythm, RhythmName} from "@src/audio/music/rhythm/types/Rhythm";
import type {DrumHit} from "@src/audio/music/patterns/types/DrumHit";
import {STEPS_PER_ROUND} from "@src/audio/music/rhythm/rhythms/Rhythms";

/** How a 장단 is drummed: the strokes of its figure, and the ghost strokes that join as it grows tense. */
interface Figure {
  readonly strokes: ReadonlyMap<number, readonly DrumHit[]>;
  readonly ghosts: ReadonlyMap<number, readonly DrumHit[]>;
}

/**
 * What the 장구 strikes on this step of the round, in the 장단 the music is in.
 *
 * Each 장단 has its own figure, so a change of 장단 is heard in the drum first: both heads together to
 * open the cycle, the low head on its other strong beats, and light strokes of the bright head landing
 * off the beat, which is where the groove comes from. Once the game is past the middle of a 장단's
 * stretch of tension, quieter ghost strokes fill the gaps. And where the music is about to turn into
 * another 장단 — `turning` — the last steps of the round are a short fill that climbs into it, so a change
 * is announced rather than simply arriving.
 */
export function jangguHitsAt(step: number, rhythm: Rhythm, tension: number, turning: boolean): readonly DrumHit[] {
  const inRound = ((step % STEPS_PER_ROUND) + STEPS_PER_ROUND) % STEPS_PER_ROUND;
  const fill = FILL.get(inRound - (STEPS_PER_ROUND - FILL_STEPS));
  if (turning && fill) return fill;

  const cycle = rhythm.beats.reduce((sum, length) => sum + length, 0);
  const inCycle = inRound % cycle;
  const {strokes, ghosts} = FIGURES[rhythm.name];

  const stroke = strokes.get(inCycle);
  if (stroke) return stroke;

  const {from, to} = rhythm.tension;
  if ((tension - from) / (to - from) >= GHOSTS_FROM) return ghosts.get(inCycle) ?? NOTHING;

  return NOTHING;
}

const NOTHING: readonly DrumHit[] = [];

/** Both heads together: the stroke every cycle opens on. */
const OPENING: readonly DrumHit[] = [
  {head: "gung", weight: 0.9},
  {head: "chae", weight: 0.5},
];

const gung = (weight: number): readonly DrumHit[] => [{head: "gung", weight}];
const chae = (weight: number): readonly DrumHit[] => [{head: "chae", weight}];

/** How far through a 장단's stretch of tension the ghost strokes join. */
const GHOSTS_FROM = 0.5;

const FIGURES: Record<RhythmName, Figure> = {
  jungmori: {
    strokes: new Map([
      [0, OPENING],
      [4, gung(0.45)],
      [6, chae(0.35)],
      [8, chae(0.3)],
      [9, chae(0.18)],
      [12, gung(0.6)],
      [16, chae(0.35)],
      [18, gung(0.4)],
      [20, chae(0.3)],
      [21, chae(0.18)],
    ]),
    ghosts: new Map([
      [3, chae(0.13)],
      [11, chae(0.13)],
      [15, chae(0.13)],
      [23, chae(0.13)],
    ]),
  },
  jungjungmori: {
    strokes: new Map([
      [0, OPENING],
      [2, chae(0.2)],
      [3, chae(0.35)],
      [6, gung(0.5)],
      [8, chae(0.2)],
      [9, chae(0.35)],
    ]),
    ghosts: new Map([
      [5, chae(0.14)],
      [11, chae(0.14)],
    ]),
  },
  jajinmori: {
    strokes: new Map([
      [0, OPENING],
      [3, chae(0.4)],
      [5, chae(0.22)],
      [6, gung(0.6)],
      [9, chae(0.4)],
      [11, chae(0.25)],
    ]),
    ghosts: new Map([
      [2, chae(0.15)],
      [7, chae(0.15)],
      [8, chae(0.15)],
    ]),
  },
};

/** The fill that climbs into a new 장단, over the round's last steps. */
const FILL_STEPS = 3;
const FILL: ReadonlyMap<number, readonly DrumHit[]> = new Map([
  [0, chae(0.35)],
  [1, chae(0.45)],
  [
    2,
    [
      {head: "gung", weight: 0.6},
      {head: "chae", weight: 0.45},
    ],
  ],
]);
