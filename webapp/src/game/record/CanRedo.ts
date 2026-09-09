import type {PlayedGame} from "@src/game/record/types/PlayedGame";

/**
 * Whether `undo` has set a position aside to go back into.
 *
 * Stands to `redo` as `canUndo` stands to `undo`. It answers false again the moment play goes
 * somewhere new, because `playMove` and `restTurn` empty `future` — a branch nobody returned to is
 * not a move still on offer.
 */
export function canRedo(played: PlayedGame): boolean {
  return played.future.length > 0;
}
