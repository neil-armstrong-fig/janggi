import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {OpponentName} from "@janggi/shared/janggi/settings/OpponentName";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {SideChoiceName} from "@janggi/shared/janggi/settings/SideChoiceName";

/**
 * Who the other army is played by, and — against the bot — how strongly, and which army is the
 * player's.
 *
 * The bot's strength and the side choice are kept whoever the opponent is, so switching back to the
 * bot finds them as they were left. Like the format, all of it is dealt: changing any of it starts a
 * fresh game, and it locks once play has begun.
 */
export interface Opponent {
  readonly name: OpponentName;
  readonly botElo: BotElo;
  readonly sideChoice: SideChoiceName;
  /**
   * The army the player has in the game on the board. A choice of Random is settled into one of the
   * two when the game is dealt, so this is always definite. Meaningless against a human, where both
   * armies are the player's.
   */
  readonly playerSide: Side;
}
