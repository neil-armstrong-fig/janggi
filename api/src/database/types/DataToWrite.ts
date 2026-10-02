/** A write of the player's data, and the version the writer had read when they decided to make it. */
export interface DataToWrite {
  readonly userId: string;
  readonly blob: string;
  /** 0 for a player with nothing kept yet. */
  readonly expectedVersion: number;
  readonly now: Date;
}
