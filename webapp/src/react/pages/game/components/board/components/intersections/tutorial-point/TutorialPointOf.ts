import type {Position, PositionKey} from "@janggi/engine/board/types/Position";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";
import {askedMoveOf} from "@src/react/pages/game/tutorial/asked-move/AskedMoveOf";

/**
 * The one point the tutorial is pointing at: the piece its step asks the player to move, and once that is in hand, where
 * to put it. None while the script answers for the other army, while the step asks for a control, or once it has run
 * out. Outside the tutorial, `tourPoint`:
 * the tour's, which is the only other thing that points at the board.
 */
export function tutorialPointOf(
  tutorial: TutorialSituation | undefined,
  selected: Position | undefined,
  tourPoint: PositionKey | undefined,
): PositionKey | undefined {
  if (tutorial === undefined) return tourPoint;

  const move = askedMoveOf(tutorial, "player");
  if (move === undefined) return undefined;

  if (selected === undefined) {
    return toPositionKey(move.from);
  }

  return toPositionKey(move.to);
}
