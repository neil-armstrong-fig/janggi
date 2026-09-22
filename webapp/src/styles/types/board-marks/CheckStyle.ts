/**
 * How a check is marked: the line from each attacker to the general, and the rings round both.
 *
 * Part of the board's style because one red does not read on every board — it all but vanishes on a
 * lacquer-red one — for the same reason the last move's marks are.
 */
export interface CheckStyle {
  /** Any CSS colour, from which the rings' translucent fills are made as well. */
  readonly colour: string;
}
