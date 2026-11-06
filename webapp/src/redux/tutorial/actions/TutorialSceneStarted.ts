import type {GameSliceState} from "@src/redux/game/types/GameSliceState";
import {createAction} from "@reduxjs/toolkit";

/** A scene of the tutorial brought to the board, in place of the one before it. */
export interface TutorialSceneStart {
  /** Which scene, counting from nought. */
  readonly scene: number;
  readonly lesson: GameSliceState;
}

/** The tutorial moved on to another scene: the game and tutorial slices answer it. Dispatched by `startTheTutorialScene`. */
export const tutorialSceneStarted = createAction<TutorialSceneStart>("tutorial/sceneStarted");
