import type {Side} from "@janggi/shared/janggi/pieces/Side";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";

/** The army whose side of the board the card's words are about: the step's that is up, or once they have run out, the ending's. */
export function lookAtOf(scene: TutorialScene, situation: TutorialSituation): Side | undefined {
  if (situation.step === undefined) return scene.endingLookAt;

  return situation.step.lookAt;
}
