import type {TutorialProgress} from "@src/redux/slices/tutorial/types/TutorialProgress";
import type {TutorialSliceState} from "@src/redux/slices/tutorial/types/TutorialSliceState";

/** The state of a page that has not started the tutorial, or has left it: only how far the player had come. */
export function noTutorial(progress: TutorialProgress): TutorialSliceState {
  return {parked: undefined, scene: 0, progress, heldVisit: undefined};
}
