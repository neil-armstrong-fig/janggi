import type {AppThunk} from "@src/redux/AppThunk";
import {TUTORIAL_XP} from "@src/redux/progress/xp/TutorialXp";
import {inTheTutorial} from "@src/redux/tutorial/selecting/InTheTutorial";
import {tutorialClosed} from "@src/redux/tutorial/actions/TutorialClosed";
import {tutorialCompleted} from "@src/redux/tutorial/actions/TutorialCompleted";

/**
 * Puts up the tutorial's closing card, numbered `scene` (one past its last scene, which the page knows and the store does
 * not), over the board the last scene left. Reaching it completes the tutorial, and **the first completion on the device
 * earns its XP**; a second earns nothing, so playing it again is no way up. Nothing outside the tutorial.
 */
export function closeTheTutorial(scene: number): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    if (!inTheTutorial(state)) return;

    dispatch(tutorialClosed(scene));
    if (!state.tutorial.progress.completed) dispatch(tutorialCompleted(TUTORIAL_XP));
  };
}
