/** Something read from outside that turned out to be what it claimed. */
export interface Accepted<Value> {
  readonly kind: "accepted";
  readonly value: Value;
}

/** Something read from outside that did not, and what was wrong with it. */
export interface Refused {
  readonly kind: "refused";
  /** Said the way a player fixing the JSON by hand would want to be told — where, and what it should be. */
  readonly reason: string;
}

/**
 * A style read from a key or typed into the editor, checked. Refused with a reason rather than as a bare
 * undefined, because the player who pasted it or wrote it is waiting to hear what to fix.
 */
export type Checked<Value> = Accepted<Value> | Refused;
