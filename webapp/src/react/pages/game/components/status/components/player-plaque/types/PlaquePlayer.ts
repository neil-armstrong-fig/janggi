import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";
import type {UnlockStep} from "@src/redux/progress/unlocks/types/UnlockStep";

/** The bot playing an army, at the strength it was chosen to play at. */
interface Bot {
  readonly kind: "bot";
  readonly elo: BotElo;
}

/**
 * The player playing an army against the bot, with their own rating in the format being played, the XP
 * they have earned, and what that XP is working towards. The rating is of this format alone; the XP is
 * everything they have played.
 */
interface Player {
  readonly kind: "player";
  readonly elo: number;
  readonly xp: number;
  /** The next rung of the unlock ladder, or undefined once everything is open. */
  readonly nextUnlock: UnlockStep | undefined;
}

/**
 * Who a plaque says is playing its army, in a game against the bot. A game between two people at one
 * device has nobody to name: both armies are played at the same screen, and neither is rated.
 */
export type PlaquePlayer = Bot | Player;
