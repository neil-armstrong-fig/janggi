import type {Move} from "@src/game/types/Move";

/**
 * How long a piece is shown travelling, in milliseconds: a little longer the further it goes.
 *
 * Around Lichess's default of 200ms for a single step, which is where a move reads as a move rather
 * than a teleport without keeping a player waiting — and a flight in a turn-based game is watched
 * every single time, sixty-odd times a game. A chariot sent the length of the board takes longer so it
 * is seen to travel, and never more than a third of a second however far it goes.
 *
 * Distance is counted in points along the longer axis, so a step down a palace diagonal is one point,
 * as a step along a line is.
 */
export function flightDuration(move: Move): number {
  const distance = Math.max(Math.abs(move.to.file - move.from.file), Math.abs(move.to.rank - move.from.rank));

  return Math.min(LONGEST_MS, SHORTEST_MS + distance * PER_POINT_MS);
}

const SHORTEST_MS = 170;
const PER_POINT_MS = 25;
const LONGEST_MS = 320;
