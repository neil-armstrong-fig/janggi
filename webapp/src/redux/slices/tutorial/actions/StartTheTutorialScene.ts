import type {AppThunk} from "@src/redux/AppThunk";
import type {GameState} from "@janggi/engine/types/GameState";
import {inTheTutorial} from "@src/redux/slices/tutorial/selecting/InTheTutorial";
import {playedGameFrom} from "@src/record/PlayedGameFrom";
import {practiceGame} from "@src/redux/shared/practice-game/PracticeGame";
import {tutorialSceneStarted} from "@src/redux/slices/tutorial/actions/TutorialSceneStarted";

/**
 * Puts scene `scene` of the tutorial on the board, from `start`, the position the scene opens on — handed in, since the
 * scenes are the page's (`react/pages/game/tutorial/`). The player's own game stays parked. Nothing outside the tutorial.
 */
export function startTheTutorialScene(scene: number, start: GameState): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    if (!inTheTutorial(state)) return;

    const lesson = {...practiceGame(state.game.opponent), played: playedGameFrom(start)};
    dispatch(tutorialSceneStarted({scene, lesson}));
  };
}
