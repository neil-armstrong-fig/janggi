import type {GameState} from "@src/game/types/GameState";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * The bookkeeping `playMove` and `restTurn` share: the position that was being played joins `past`,
 * the new one takes its place, and `future` is emptied.
 *
 * That last part is the whole of what makes a record a record rather than a tree. Once play goes
 * somewhere new, whatever `undo` had set aside for `redo` is a branch nobody returned to, and
 * keeping it would offer a player a move from a game they are no longer in.
 *
 * Not part of the engine's public surface — it is reached only through `playMove` and `restTurn`,
 * the way `positionAfter` is reached only through `applyMove` and `pass`.
 */
export function advanced(played: PlayedGame, game: GameState): PlayedGame {
  return {
    past: [...played.past, played.present],
    present: game,
    future: [],
  };
}
