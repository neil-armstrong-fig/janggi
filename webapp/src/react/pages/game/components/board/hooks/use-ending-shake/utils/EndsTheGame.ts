import type {GameMoment} from "@src/react/pages/game/types/GameMoment";
import type {GameState} from "@src/game/types/GameState";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Whether a change is the one that brought the game to its end, whatever ended it: the game is decided
 * now, and the change played a turn — or played one again — rather than taking one back or dealing a
 * fresh game.
 *
 * A take-back into a position that is still decided is a player stepping back through an ending, not
 * the game ending again.
 */
export function endsTheGame(moment: GameMoment, game: GameState): boolean {
  if (moment.direction === "takenBack" || moment.direction === "dealt") return false;

  return outcomeOf(game).kind !== "undecided";
}
