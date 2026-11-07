import type {RatingsSliceState} from "@src/redux/slices/ratings/types/RatingsSliceState";
import {RATINGS_STORAGE_KEY} from "@src/redux/slices/ratings/storage/RatingsStorageKey";
import {ratingsFrom} from "@src/redux/slices/ratings/ratings-from/RatingsFrom";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";

/** The ratings kept on the device, or a fresh start; `ratingsFrom` says what is kept of what is found. */
export function loadRatings(storage: Pick<Storage, "getItem"> | undefined): RatingsSliceState {
  return ratingsFrom(readJson(storage, RATINGS_STORAGE_KEY));
}
