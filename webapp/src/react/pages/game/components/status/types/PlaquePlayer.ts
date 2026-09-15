import type {BotElo} from "@janggi/shared/janggi/settings/BotElo";

/** The bot playing an army, at the strength it was chosen to play at. */
interface Bot {
  readonly kind: "bot";
  readonly elo: BotElo;
}

/** The player playing an army against the bot, with their own rating in the format being played. */
interface Player {
  readonly kind: "player";
  readonly elo: number;
}

/**
 * Who a plaque says is playing its army, in a game against the bot. A game between two people at one
 * device has nobody to name: both armies are played at the same screen, and neither is rated.
 */
export type PlaquePlayer = Bot | Player;
