/** A point on the pitch's path: how far from the note's own pitch it is, in cents, at a time. */
export interface PitchKnot {
  readonly seconds: number;
  readonly cents: number;
}

/**
 * The path a plucked string's pitch takes: it starts a hair above the note and settles into it over a few
 * hundredths of a second, and then, as the note dies, sags gently by about a quarter of a semitone. The
 * knots are joined by the caller with exponential ramps, as a pitch is heard to move.
 */
export function pitchPathOf(length: number): PitchKnot[] {
  return [
    {seconds: 0, cents: SETTLE_FROM},
    {seconds: SETTLE_S, cents: 0},
    {seconds: Math.max(length * SAG_FROM, SETTLE_S), cents: 0},
    {seconds: Math.max(length, SETTLE_S), cents: SAG_CENTS},
  ];
}

/** The pluck starts this far above the note, in cents, and settles over `SETTLE_S`. */
const SETTLE_FROM = 12;
const SETTLE_S = 0.08;

/** The sag starts this far through the note. */
const SAG_FROM = 0.45;

/** How far the pitch sags by the end of the note: 0.985 of its frequency. */
const SAG_CENTS = -26;
