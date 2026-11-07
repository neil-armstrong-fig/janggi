import {PROGRESS_STORAGE_KEY} from "@src/redux/slices/progress/storage/ProgressStorageKey";
import type {ProgressSliceState} from "@src/redux/slices/progress/types/ProgressSliceState";
import type {RatingsSliceState} from "@src/redux/slices/ratings/types/RatingsSliceState";
import {freshProgress} from "@src/redux/slices/progress/fresh-progress/FreshProgress";
import {progressEarnedIn} from "@src/redux/slices/progress/storage/progress-earned-in/ProgressEarnedIn";
import {progressFrom} from "@src/redux/slices/progress/progress-from/ProgressFrom";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";

/**
 * The progress kept on the device.
 *
 * Where there is none — the first time a version of the app with progress in it opens — the player is
 * credited with every game already in their record, so nobody who has been playing the bot starts
 * again from nothing. What is kept but is not progress at all starts fresh instead: crediting the
 * record then would hand out a second helping every time the stored value was broken.
 */
export function loadProgress(
  storage: Pick<Storage, "getItem"> | undefined,
  ratings: RatingsSliceState,
): ProgressSliceState {
  const stored = readJson(storage, PROGRESS_STORAGE_KEY);
  if (stored === undefined) return progressEarnedIn(ratings);

  return progressFrom(stored) ?? freshProgress();
}
