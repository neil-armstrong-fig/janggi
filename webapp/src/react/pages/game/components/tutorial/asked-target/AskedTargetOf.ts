import type {TutorialControl} from "@src/react/pages/game/tutorial/types/TutorialControl";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";
import {askedControlOf} from "@src/react/pages/game/tutorial/asked-control/AskedControlOf";
import {askedMoveOf} from "@src/react/pages/game/tutorial/asked-move/AskedMoveOf";

/** What the tutorial rings for the player to tap: a point on the board, for a move, or one of the controls under it. */
export type TutorialTarget = "point" | TutorialControl;

/** What the step asks the player to tap now, or undefined where it asks nothing of them. */
export function askedTargetOf(situation: TutorialSituation | undefined): TutorialTarget | undefined {
  if (askedMoveOf(situation, "player") !== undefined) return "point";

  return askedControlOf(situation);
}
