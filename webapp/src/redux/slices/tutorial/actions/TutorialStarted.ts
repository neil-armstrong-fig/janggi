import type {GameSliceState} from "@src/redux/slices/game/types/GameSliceState";
import type {ParkedPlay} from "@src/redux/shared/parking/types/ParkedPlay";
import {createAction} from "@reduxjs/toolkit";

/** The tutorial's game, brought to the board, and what was there before it. */
export interface TutorialStart {
  /** Which scene it starts on, counting from nought: the first, or the one resumed. */
  readonly scene: number;
  readonly lesson: GameSliceState;
  readonly parked: ParkedPlay;
}

/** The tutorial took the board: the game, clock and tutorial slices each answer it. Dispatched by `startTheTutorial`. */
export const tutorialStarted = createAction<TutorialStart>("tutorial/started");
