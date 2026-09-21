import type {BotEngineStatus} from "@src/redux/bot-engine/types/BotEngineStatus";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Whether the game is being held until the bot's engine can be searched: the bot is the opponent, the
 * game is still undecided, and the engine is not ready — still loading, or failed.
 *
 * A game against the bot is rated from its first move, and a player who made that move against an engine
 * that never came would be left in a rated game with nobody to answer. So the board closes and a notice
 * says why, until the engine is up. It is the same shape as `botAwaitsGoAhead` — a hold on the game that
 * is not the bot's turn — and asked beside it, because it holds the player's move as well as the bot's.
 *
 * The status is passed in rather than read: it is what this page has managed to start, which is not part
 * of a game and is not kept with one.
 */
export function botEngineHoldsPlay(played: PlayedGame, opponent: Opponent, status: BotEngineStatus): boolean {
  if (opponent.name !== "Bot" || status === "ready") return false;

  return outcomeOf(played.present).kind === "undecided";
}
