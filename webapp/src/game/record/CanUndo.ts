import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * Whether there is a position to take the game back to.
 *
 * Stands to `undo` as `canPass` stands to `pass` — the question a board asks in order to offer the
 * control, where `undo` is the taking back itself.
 *
 * It does not ask `outcomeOf`, and that is the point rather than an oversight. `canPass` refuses
 * once the game is decided because there is no turn left to rest; a decided game is exactly when a
 * player reaches for undo.
 */
export function canUndo(played: PlayedGame): boolean {
  return played.past.length > 0;
}
