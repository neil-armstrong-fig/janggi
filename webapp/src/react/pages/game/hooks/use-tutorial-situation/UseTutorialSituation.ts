import type {TutorialSituation} from "@src/react/pages/game/tutorial/types/TutorialSituation";
import {inTheTutorial} from "@src/redux/slices/tutorial/selecting/InTheTutorial";
import {tutorialStepAt} from "@src/react/pages/game/tutorial/step-at/TutorialStepAt";
import {useAppSelector} from "@src/redux/Hooks";

/** Where the tutorial has got to, or undefined where it does not have the board. One answer for the board, the card and the script's replies. */
export function useTutorialSituation(): TutorialSituation | undefined {
  const played = useAppSelector(state => state.game.played);
  const tutorial = useAppSelector(inTheTutorial);
  const scene = useAppSelector(state => state.tutorial.scene);
  if (!tutorial) return undefined;

  return {scene, step: tutorialStepAt(scene, played), number: played.past.length + 1};
}
