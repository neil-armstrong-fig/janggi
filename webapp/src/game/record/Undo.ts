import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * The game one ply earlier: the position most recently left behind stands again, and the one being
 * left goes to the front of `future` in case `redo` wants it back.
 *
 * One ply, not one round. A move and a rested turn each leave a position behind and are taken back
 * the same way, without this having to know which it undid; a player wanting both halves of a round
 * presses it twice.
 *
 * **It works on a game that is over**, and nothing here asks `outcomeOf`. `applyMove` and `pass`
 * both refuse once the game is decided, and undo must not: taking back the move that just delivered
 * 외통, or the second of the two rested turns that just settled the game on points, is the ordinary
 * reason to reach for it rather than an edge of it. Nothing is recomputed to do that — the position
 * being restored was legal when it was played and is the same value still.
 *
 * **Throws** when there is nothing to take back, exactly as `pass` throws when there is no turn left
 * to rest, and for the same reason: the caller has just been told by `canUndo`.
 */
export function undo(played: PlayedGame): PlayedGame {
  const previous = played.past.at(-1);
  if (!previous) throw new Error("The game has not been played from, so there is nothing to take back");

  return {
    past: played.past.slice(0, -1),
    present: previous,
    future: [played.present, ...played.future],
  };
}
