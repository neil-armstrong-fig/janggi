/**
 * Which way a record moved between two readings of it.
 *
 * `advanced` is a turn played, `takenBack` one undone, and `replayed` one redone. `dealt` is anything
 * else — a new game, a format or a setup chosen — where no single turn leads from one to the other.
 */
export type ChangeDirection = "advanced" | "takenBack" | "replayed" | "dealt";
