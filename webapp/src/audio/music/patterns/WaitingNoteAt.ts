import type {WaitingNote} from "@src/audio/music/patterns/types/WaitingNote";

/** One pluck written into the theme. */
interface Pluck {
  readonly degree: number;
  readonly steps: number;
  /** A passing note between the ones the line leans on, and so one that may be left out. */
  readonly passing: boolean;
}

/**
 * The string the waiting theme plucks on this step, or nothing.
 *
 * The waiting theme is what plays before a game is under way, while a player is still choosing how it
 * will go: a 가야금 in 평조 over a soft bass, slow and spaced — music to set a board out to rather than
 * to think over. Two phrases take turns. The first climbs and settles part way down; the second answers
 * it and comes home to the root the bass is plucking. Each ends on a long note left ringing through
 * its last bar, so the line breathes and never crowds a player reading the settings.
 *
 * Every note the line leans on is a tone of the chord the bass is plucking under it (`chordAt`), so the
 * theme and the bass are heard as one piece. Only the brief passing notes step outside the chord.
 *
 * The phrases keep their shape, so the theme is recognisable each time round; what changes is the
 * passing notes between the ones the line leans on. `fill` decides whether one is plucked, between
 * nought and one, handed in for the reason every pattern's rolls are.
 */
export function waitingNoteAt(step: number, fill: number): WaitingNote | undefined {
  const pluck = THEME.get(((step % THEME_STEPS) + THEME_STEPS) % THEME_STEPS);
  if (!pluck || (pluck.passing && fill < PASSING_FROM)) return undefined;

  return {degree: pluck.degree, steps: pluck.steps, weight: pluck.passing ? PASSING_WEIGHT : LEANING_WEIGHT};
}

/** How long the theme is, in steps: two phrases of four eight-step bars. */
const THEME_STEPS = 64;

/** The theme, by the step each string is plucked on. Every other step is a rest. */
const THEME: ReadonlyMap<number, Pluck> = new Map([
  // The call: up to the top of the line, and part way down again. Over A, D, A and E.
  [0, {degree: 5, steps: 3, passing: false}],
  [2, {degree: 6, steps: 1, passing: true}],
  [3, {degree: 8, steps: 5, passing: false}],
  [8, {degree: 9, steps: 3, passing: false}],
  [11, {degree: 8, steps: 1, passing: true}],
  [12, {degree: 7, steps: 4, passing: false}],
  [16, {degree: 5, steps: 3, passing: false}],
  [19, {degree: 4, steps: 1, passing: true}],
  [20, {degree: 3, steps: 8, passing: false}],

  // The answer: a shorter climb, and all the way down to the root. Over B minor, D, E and A.
  [32, {degree: 4, steps: 3, passing: false}],
  [34, {degree: 5, steps: 1, passing: true}],
  [35, {degree: 6, steps: 5, passing: false}],
  [40, {degree: 7, steps: 3, passing: false}],
  [43, {degree: 6, steps: 1, passing: true}],
  [44, {degree: 5, steps: 4, passing: false}],
  [48, {degree: 4, steps: 3, passing: false}],
  [50, {degree: 3, steps: 1, passing: true}],
  [51, {degree: 1, steps: 5, passing: false}],
  [56, {degree: 0, steps: 8, passing: false}],
]);

/** A fill at or above this plucks the passing notes; below it they are left out. */
const PASSING_FROM = 0.35;

const LEANING_WEIGHT = 0.6;
const PASSING_WEIGHT = 0.35;
