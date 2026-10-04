/** How long a room waits, in milliseconds, before each of its deadlines (`docs/online-play.md`, "Staying, leaving, coming back"). */
export interface RoomTimings {
  /** A room the friend never came to. */
  readonly unjoined: number;
  /** A player who has gone, before the game is given to the one who stayed; and, if both have gone, before the room is let go. */
  readonly away: number;
  /** A finished room, so both players are still told how it ended if one of them reconnects. */
  readonly finished: number;
}
