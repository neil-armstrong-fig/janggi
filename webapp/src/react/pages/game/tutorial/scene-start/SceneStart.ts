import type {GameState} from "@janggi/engine/types/GameState";
import type {PlacedPiece} from "@janggi/engine/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";

/**
 * A scene's opening position: `pieces` where they stand, a casual game with `sideToMove` to play, and no history, as a game
 * just dealt has.
 */
export function sceneStart(pieces: readonly PlacedPiece[], sideToMove: Side): GameState {
  return {
    pieces,
    sideToMove,
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    drawAgreed: false,
  };
}
