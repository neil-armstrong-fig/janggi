import type {Opponent} from "@src/redux/game/types/Opponent";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * Whether the pieces and words are turned to face Han's player, which is the player's preference *and* a
 * question of who is playing and whose move it is: only a person sat across the device is looking from
 * Han's end, and only while it is Han's move. It turns back when Cho's move comes round, so nobody has
 * to go back into the settings between turns. Only what is read is turned; the board stays where it is.
 *
 * Against the bot there is no one across the table, so the preference is set aside rather than lost.
 */
export function boardFlippedForHan(flipBoardForHan: boolean, opponent: Opponent, sideToMove: Side): boolean {
  return flipBoardForHan && opponent.name === "Human" && sideToMove === "han";
}
