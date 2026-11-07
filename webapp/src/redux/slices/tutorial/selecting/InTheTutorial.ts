import type {RootState} from "@src/redux/Store";

/** Whether the tutorial has the board. */
export function inTheTutorial(state: RootState): boolean {
  return state.tutorial.parked !== undefined;
}
