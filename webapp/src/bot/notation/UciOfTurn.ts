import type {BotTurn} from "@src/bot/types/BotTurn";
import type {GameState} from "@src/game/types/GameState";
import {uciOf} from "@src/bot/notation/UciOf";
import {uciPassFor} from "@src/bot/notation/UciPassFor";

/**
 * A turn the bot may take, in the engine's notation — how it is offered in `searchmoves`.
 *
 * A bikjang call has no spelling: it is decided before the engine is asked anything, and never offered
 * to it.
 */
export function uciOfTurn(state: GameState, turn: BotTurn): string {
  switch (turn.kind) {
    case "move":
      return uciOf(turn.move);
    case "pass":
      return uciPassFor(state);
    case "callBikjang":
      throw new Error("A bikjang call is decided before the engine is asked, and never offered to it");
  }
}
