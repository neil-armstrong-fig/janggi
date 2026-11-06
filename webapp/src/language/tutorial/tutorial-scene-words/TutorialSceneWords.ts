import type {TutorialNarrationWords} from "@src/language/tutorial/types/TutorialNarrationWords";

/** One scene of the tutorial in words: its name, what the card says at each of its steps, and once it is over. */
export interface TutorialSceneWords {
  readonly name: string;
  /**
   * One for each step of the scene, in its order, the player's and the other army's alike. `TutorialScenes.test.ts`
   * holds every language to the scene's own count, since a step added to one without the other would shift every word
   * after it.
   */
  readonly steps: readonly TutorialNarrationWords[];
  readonly ending: TutorialNarrationWords;
}
