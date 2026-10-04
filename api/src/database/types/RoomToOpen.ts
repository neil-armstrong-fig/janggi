/** A room to record as open, if the host has none and there is space. */
export interface RoomToOpen {
  readonly code: string;
  readonly hostId: string;
  readonly now: Date;
  /** How long, in milliseconds, a host's record is trusted: older is a room that never reported closing, and is cleared. */
  readonly staleAfter: number;
  /** The most rooms that may be open at once, across everyone. */
  readonly limit: number;
}
