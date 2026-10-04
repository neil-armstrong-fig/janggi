import type {Outcome} from "@janggi/engine/types/Outcome";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * How a room's game ended, kept as data so a rating can later be fed from it. A player who stays away past the grace
 * period is recorded as having resigned: the other player's screen has one way to end that way, not two.
 */
export type RoomResult =
  {readonly kind: "played"; readonly outcome: Outcome} | {readonly kind: "resigned"; readonly winner: Side};
