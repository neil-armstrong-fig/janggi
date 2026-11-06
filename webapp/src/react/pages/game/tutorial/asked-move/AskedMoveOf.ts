import type {Move} from "@janggi/engine/types/Move";
import type {TutorialActor} from "@src/react/pages/game/tutorial/types/TutorialActor";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";

/**
 * The move the tutorial's step has `actor` make now, or undefined where the step is the other's, is not a move, or there
 * is none.
 */
export function askedMoveOf(situation: TutorialSituation | undefined, actor: TutorialActor): Move | undefined {
  const step = situation?.step;
  if (step?.actor !== actor || step.turn.kind !== "move") return undefined;

  return step.turn.move;
}
