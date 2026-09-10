import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {advanced} from "@src/game/record/utils/Advanced";
import {callBikjang} from "@src/game/bikjang/CallBikjang";

/**
 * The record after a bikjang is called — `callBikjang`'s counterpart to `playMove` and `restTurn`.
 *
 * A call moves nothing, but it leaves a position behind like anything else does: the one before the
 * game stopped. That is what lets the call be taken back, which matters more here than it does for
 * a move — undo is what a player reaches for *because* the game is over.
 *
 * Named `callBikjangIn` rather than `callBikjang` for the practical reason `playMove` is not called
 * `applyMove`: the engine already exports that name for the same act on a bare position, and a file
 * needing both would have to rename one at the import.
 *
 * **Throws** exactly when `callBikjang` throws, and the caller should have asked `canCallBikjang`.
 */
export function callBikjangIn(played: PlayedGame): PlayedGame {
  return advanced(played, callBikjang(played.present));
}
