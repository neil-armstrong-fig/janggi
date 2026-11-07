/** What a change to the player's styles needs to be given: the time, and a way to make an id. */
export interface StampingContext {
  readonly now: number;
  readonly newId: () => string;
}
