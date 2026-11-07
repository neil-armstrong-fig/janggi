import type {File, Rank} from "@janggi/engine/board/types/Position";
import type {GameState} from "@janggi/engine/types/GameState";

/** What stands on a point, as `<side>-<type>`, or undefined where nothing does. */
export function positionOf(game: GameState, file: File | number, rank: Rank | number): string | undefined {
  const piece = game.pieces.find(placed => placed.position.file === file && placed.position.rank === rank);
  if (piece === undefined) {
    return undefined;
  }

  return `${piece.piece.side}-${piece.piece.type}`;
}
