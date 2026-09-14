import type {BotDuty} from "@src/react/pages/game/types/BotDuty";
import type {Opponent} from "@src/redux/game/types/Opponent";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {SetupPhase} from "@src/game/setups/types/SetupPhase";
import {canPlace} from "@src/game/setups/CanPlace";
import {isArranged} from "@src/game/setups/IsArranged";
import {opponentOf} from "@src/game/utils/OpponentOf";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Whether the game is waiting on the bot, and for what — or undefined when it is the player's turn,
 * the game is over, or there is no bot.
 *
 * One question with several askers: the bot is told to act by it, the board closes on it, the Pass
 * and Bikjang controls grey out on it, and the turn line says the bot is thinking. Derived from the
 * position every time rather than kept as a flag, so none of them can disagree about whose turn it is.
 *
 * In a scored game `canPlace` is the whole of the laying-out rule: Han may not revise, and Cho's answer
 * arranges the board, so a bot that has laid out is never asked to again.
 */
export function botDutyFor(played: PlayedGame, phase: SetupPhase, opponent: Opponent): BotDuty | undefined {
  if (opponent.name !== "Bot") return undefined;

  const botSide = opponentOf(opponent.playerSide);

  if (!isArranged(phase)) return canPlace(phase, botSide) ? {kind: "layOut", side: botSide} : undefined;

  const game = played.present;
  if (game.sideToMove !== botSide || outcomeOf(game).kind !== "undecided") return undefined;

  return {kind: "play"};
}
