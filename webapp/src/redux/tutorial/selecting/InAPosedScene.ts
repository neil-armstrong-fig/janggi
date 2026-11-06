import type {RootState} from "@src/redux/Store";
import {inTheTutorial} from "@src/redux/tutorial/selecting/InTheTutorial";

/**
 * Whether the tutorial has one of its posed scenes on the board — any after the whole game, each set up as a position
 * rather than played to from the start.
 */
export function inAPosedScene(state: RootState): boolean {
  return inTheTutorial(state) && state.tutorial.scene > 0;
}
