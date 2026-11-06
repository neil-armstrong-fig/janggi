import type {PositionKey} from "@janggi/engine/board/types/Position";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";
import {toPositionKey} from "@janggi/engine/board/PositionKeys";

/**
 * The point the tutorial's step tells of the board refusing a move to — where the repetition rule holds the move back —
 * so the board can mark it. None outside the tutorial, or on a step that tells of no such move.
 */
export function heldBackKeyOf(tutorial: TutorialSituation | undefined): PositionKey | undefined {
  const heldBack = tutorial?.step?.heldBack;
  if (heldBack === undefined) return undefined;

  return toPositionKey(heldBack.to);
}
