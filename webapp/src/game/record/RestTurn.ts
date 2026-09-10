import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {advanced} from "@src/game/record/utils/Advanced";
import {pass} from "@src/game/passing/Pass";

/**
 * The record after a rested turn — 한수쉼, and `pass`'s counterpart to `playMove`.
 *
 * It is a separate verb for the same reason `pass` is separate from `applyMove`: a rested turn is
 * not a move. What it leaves behind is a position like any other, though, which is why `undo` can
 * take one back without ever knowing it was a pass it was undoing.
 *
 * **Throws** exactly when `pass` throws, and the caller should have asked `canPass` first.
 */
export function restTurn(played: PlayedGame): PlayedGame {
  return advanced(played, pass(played.present));
}
