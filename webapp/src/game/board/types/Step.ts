/**
 * One move of one point, as a direction rather than a destination: which way the file goes and
 * which way the rank goes.
 *
 * A direction rather than a named compass point because that is what the rules are written in — a
 * chariot slides along a step until something stops it, and a horse takes one step then another.
 * What the line looks like on screen is the board's problem, and it turns a step back into a name.
 *
 * **Not a `Position`, though the two look alike.** A position is a point on the board and its file
 * and rank are unions of the nine and ten literals that exist; a step is a delta, and `-1` and `0`
 * are ordinary values for it. Reusing `Position` here would mean widening those unions to `number`,
 * which is exactly what stops an off-board coordinate compiling anywhere else. `pointAfterStep` is
 * the one place a step is turned back into a point, and the one place that can fail.
 */
export interface Step {
  readonly fileStep: number;
  readonly rankStep: number;
}
