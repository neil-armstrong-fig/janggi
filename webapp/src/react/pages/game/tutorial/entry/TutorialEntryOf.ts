import type {TutorialEntry} from "@src/redux/tutorial/types/TutorialEntry";
import type {TutorialProgress} from "@src/redux/tutorial/types/TutorialProgress";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";

/**
 * Where the tutorial resumes for a player who came part way: the start of the furthest scene they reached. Undefined
 * where there is nothing to resume, and the tutorial starts from its first scene — which resuming the first scene is
 * too, its whole game starting over. A scene since taken out resumes nowhere.
 */
export function tutorialEntryOf({reached}: TutorialProgress): TutorialEntry | undefined {
  if (reached === 0) return undefined;

  const scene = TUTORIAL_SCENES[reached];
  if (scene === undefined) return undefined;

  return {scene: reached, start: scene.start};
}
