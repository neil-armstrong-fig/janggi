import type {Move} from "@janggi/engine/types/Move";
import type {PlayedGame} from "@src/record/types/PlayedGame";
import {advanced} from "@src/record/utils/Advanced";
import {applyMove} from "@janggi/engine/ApplyMove";

/**
 * The record after a move. `applyMove` decides whether it is legal and what the game looks like
 * afterwards; everything added here is the keeping of what came before.
 *
 * **Throws** exactly when `applyMove` throws, and the error is its, unwrapped — an illegal move is a
 * bug at the call site either way, and a second sentence in front of the engine's own would only
 * bury the reason.
 */
export function playMove(played: PlayedGame, move: Move): PlayedGame {
  return advanced(played, applyMove(played.present, move));
}
