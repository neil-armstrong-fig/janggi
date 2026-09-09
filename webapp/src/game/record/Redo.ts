import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * The game one ply forward again: the nearest position `undo` set aside stands once more, and the
 * one being left rejoins `past`.
 *
 * It only ever puts back a position this record itself played, so nothing is re-decided and no rule
 * is asked twice. `undo` and `redo` are each other's inverse for that reason — the same values move
 * between the same two lists.
 *
 * **Throws** when there is nothing to play again, for the same reason `undo` throws when there is
 * nothing to take back: the caller has just been told by `canRedo`.
 */
export function redo(played: PlayedGame): PlayedGame {
  const [next, ...rest] = played.future;
  if (!next) throw new Error("Nothing has been taken back, so there is nothing to play again");

  return {
    past: [...played.past, played.present],
    present: next,
    future: rest,
  };
}
