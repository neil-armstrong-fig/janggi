/**
 * Thrown by a `Reading` at the first field that is not what a style needs, and caught by `checkedBy`,
 * which turns it into a refusal. Its message is the reason a player is shown.
 */
export class RefusedReading extends Error {
  override readonly name = "RefusedReading";
}
