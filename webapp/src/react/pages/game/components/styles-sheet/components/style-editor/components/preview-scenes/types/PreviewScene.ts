import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {Position} from "@src/game/board/types/Position";
import type {Threat} from "@src/react/pages/game/components/board/types/Threat";

/**
 * A position to show a style in — a real one, which the engine could have reached — and what a player
 * would be doing in it: the piece in hand, if there is one, and the move that led there.
 */
export interface PreviewScene {
  readonly game: GameState;
  /** The point of the piece in hand, if one is. */
  readonly held: Position | undefined;
  readonly lastMove: Move | undefined;
  /** The check on the board, if there is one. */
  readonly threat: Threat | undefined;
}
