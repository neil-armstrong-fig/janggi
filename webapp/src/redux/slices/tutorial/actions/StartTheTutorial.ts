import {restorePractice} from "@src/redux/slices/onboarding/practice/actions/RestorePractice";
import type {AppThunk} from "@src/redux/AppThunk";
import type {TutorialEntry} from "@src/redux/slices/tutorial/types/TutorialEntry";
import {canStartTheTutorial} from "@src/redux/slices/tutorial/selecting/CanStartTheTutorial";
import {clockHeldAt} from "@src/redux/shared/parking/ClockHeldAt";
import {playedGameFrom} from "@src/record/PlayedGameFrom";
import {practiceGame} from "@src/redux/shared/practice-game/PracticeGame";
import {tutorialStarted} from "@src/redux/slices/tutorial/actions/TutorialStarted";

/**
 * Parks the player's own game and its clock, and puts the tutorial's game on the board: its first scene, or the scene
 * `entry` names, from the position it opens on — handed in to resume, since the scenes are the page's
 * (`react/pages/game/tutorial/`). Nothing, where it may not start.
 */
export function startTheTutorial(entry?: TutorialEntry): AppThunk {
  return (dispatch, getState) => {
    if (!canStartTheTutorial(getState())) return;

    dispatch(restorePractice());
    const state = getState();

    const parked = {game: state.game, clock: clockHeldAt(state.clock, Date.now())};
    const lesson = practiceGame(state.game.opponent);

    if (entry === undefined) {
      dispatch(tutorialStarted({scene: 0, lesson, parked}));
      return;
    }

    dispatch(tutorialStarted({scene: entry.scene, lesson: {...lesson, played: playedGameFrom(entry.start)}, parked}));
  };
}
