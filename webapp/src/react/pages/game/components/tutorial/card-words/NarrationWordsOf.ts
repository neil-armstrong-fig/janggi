import type {TutorialNarrationWords} from "@src/language/tutorial/types/TutorialNarrationWords";
import type {TutorialSceneWords} from "@src/language/tutorial/tutorial-scene-words/TutorialSceneWords";
import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";

/**
 * What the card says where the tutorial has got to: the words for the step that is up, at its place in the scene, or the
 * scene's ending once its steps have run out.
 */
export function narrationWordsOf(words: TutorialSceneWords, situation: TutorialSituation): TutorialNarrationWords {
  if (situation.step === undefined) return words.ending;

  return words.steps[situation.number - 1] ?? words.ending;
}
