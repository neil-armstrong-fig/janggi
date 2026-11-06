import type {Move} from "@janggi/engine/types/Move";
import type {TutorialControl} from "@src/react/pages/game/tutorial/types/TutorialControl";

/** A turn made on the board. */
export interface MoveTurn {
  readonly kind: "move";
  readonly move: Move;
}

/**
 * A turn made with a control under the board. A draw is one turn of the player's: they offer it, and the script accepts it
 * for Han, which is what puts it in the record.
 */
export interface ControlTurn {
  readonly kind: TutorialControl;
}

/** What one step of the tutorial has its army do. */
export type TutorialTurn = MoveTurn | ControlTurn;
