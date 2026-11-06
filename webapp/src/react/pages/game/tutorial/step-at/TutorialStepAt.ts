import type {PlayedGame} from "@src/record/types/PlayedGame";
import type {TutorialStep} from "@src/react/pages/game/tutorial/types/TutorialStep";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";

/**
 * The step of scene `scene` that is up, read off how many turns the record holds — or undefined once the scene's steps
 * have run out. Read off the record rather than kept, so the two can never disagree about where the game has got to:
 * every turn a step takes, a move, a rest, a call or an agreed draw, is one more in it.
 */
export function tutorialStepAt(scene: number, played: PlayedGame): TutorialStep | undefined {
  return TUTORIAL_SCENES[scene]?.steps[played.past.length];
}
