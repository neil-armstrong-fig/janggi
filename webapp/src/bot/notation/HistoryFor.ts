import type {GameState} from "@src/game/types/GameState";
import type {History} from "@src/bot/notation/types/History";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import type {Transition} from "@src/game/record/types/Transition";
import {fenOf} from "@src/bot/notation/FenOf";
import {transitionBetween} from "@src/game/record/TransitionBetween";
import {uciOf} from "@src/bot/notation/UciOf";
import {uciPassFor} from "@src/bot/notation/UciPassFor";

/**
 * A record written the way the engine is best shown it: the last position nothing can come back to,
 * and the turns since, so it can see a repetition coming rather than being handed a position with no
 * past.
 *
 * It walks back from the present only as far as the most recent capture — a capture cannot be undone
 * by playing on, the same reasoning that empties `GameState.seen` — so the list stays a handful of
 * moves rather than the whole game.
 *
 * The record keeps positions rather than moves, so each turn is read back off the two positions either
 * side of it with `transitionBetween`, exactly as the board's motion reads it.
 */
export function historyFor(played: PlayedGame): History {
  const positions = [...played.past, played.present];
  const moves: string[] = [];
  let start = played.present;

  for (let index = positions.length - 1; index > 0; index -= 1) {
    const before = positions[index - 1];
    const after = positions[index];
    if (!before || !after) break;

    const transition = transitionBetween(before, after);
    if (!isReversible(transition)) break;

    moves.unshift(uciOfTransition(before, transition));
    start = before;
  }

  return {fen: fenOf(start), moves};
}

function isReversible(transition: Transition | undefined): transition is Transition {
  if (!transition || transition.kind === "bikjangCalled") return false;

  return transition.kind === "passed" || transition.taken === undefined;
}

function uciOfTransition(before: GameState, transition: Transition): string {
  return transition.kind === "moved" ? uciOf(transition.move) : uciPassFor(before);
}
