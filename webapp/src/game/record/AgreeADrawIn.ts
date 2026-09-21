import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {advanced} from "@src/game/record/utils/Advanced";
import {agreeADraw} from "@src/game/drawing/AgreeADraw";

/**
 * The record after a draw is agreed — `agreeADraw`'s counterpart to `playMove`, `restTurn` and
 * `callBikjangIn`.
 *
 * An agreement moves nothing, but it leaves a position behind like anything else does: the one before
 * the game stopped. That is what lets it be taken back, which matters here as it does for a call —
 * undo is what a player reaches for *because* the game is over.
 *
 * **Throws** exactly when `agreeADraw` throws, and the caller should have asked `canAgreeADraw`.
 */
export function agreeADrawIn(played: PlayedGame): PlayedGame {
  return advanced(played, agreeADraw(played.present));
}
