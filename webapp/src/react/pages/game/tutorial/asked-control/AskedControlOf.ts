import type {TutorialControl} from "@src/react/pages/game/tutorial/types/TutorialControl";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";

/** The control under the board the tutorial's step asks the player to press now, or undefined where it asks for none. */
export function askedControlOf(situation: TutorialSituation | undefined): TutorialControl | undefined {
  const step = situation?.step;
  if (step?.actor !== "player" || step.turn.kind === "move") return undefined;

  return step.turn.kind;
}
