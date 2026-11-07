import type {TutorialProgress} from "@src/redux/slices/tutorial/types/TutorialProgress";

/** The progress once scene `scene` has been started: the furthest reached, so going back to an earlier one loses nothing. */
export function withSceneReached(progress: TutorialProgress, scene: number): TutorialProgress {
  if (scene <= progress.reached) return progress;

  return {...progress, reached: scene};
}
