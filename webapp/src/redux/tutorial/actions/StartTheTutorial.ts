import type {AppThunk} from "@src/redux/AppThunk";
import type {TutorialEntry} from "@src/redux/tutorial/types/TutorialEntry";
import {canStartTheTutorial} from "@src/redux/tutorial/selecting/CanStartTheTutorial";
import {clockHeldAt} from "@src/redux/tutorial/parking/ClockHeldAt";
import {playedGameFrom} from "@src/record/PlayedGameFrom";
import {tutorialGame} from "@src/redux/tutorial/lesson/TutorialGame";
import {tutorialStarted} from "@src/redux/tutorial/actions/TutorialStarted";

/**
 * Parks the player's own game and its clock, and puts the tutorial's game on the board: its first scene, or the scene
 * `entry` names, from the position it opens on — handed in to resume, since the scenes are the page's
 * (`react/pages/game/tutorial/`). Nothing, where it may not start.
 */
export function startTheTutorial(entry?: TutorialEntry): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    if (!canStartTheTutorial(state)) return;

    const parked = {game: state.game, clock: clockHeldAt(state.clock, Date.now())};
    const lesson = tutorialGame(state.game.opponent);

    if (entry === undefined) {
      dispatch(tutorialStarted({scene: 0, lesson, parked}));
      return;
    }

    dispatch(tutorialStarted({scene: entry.scene, lesson: {...lesson, played: playedGameFrom(entry.start)}, parked}));
  };
}
