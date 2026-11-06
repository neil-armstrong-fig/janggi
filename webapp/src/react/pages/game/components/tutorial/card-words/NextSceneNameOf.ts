import type {TutorialMessages} from "@src/language/tutorial/tutorial-messages/TutorialMessages";
import type {TutorialScene} from "@src/react/pages/game/tutorial/types/TutorialScene";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";

/**
 * What the card's Next goes on to, by name, once the scene's steps have run out: the scene after it, or after the last,
 * the closing card. Undefined while a step is still up, when there is no Next.
 */
export function nextSceneNameOf(
  situation: TutorialSituation,
  next: TutorialScene | undefined,
  tutorial: TutorialMessages,
): string | undefined {
  if (situation.step !== undefined) return undefined;

  if (next === undefined) return tutorial.closing.name;

  return tutorial.scenes[next.name].name;
}
