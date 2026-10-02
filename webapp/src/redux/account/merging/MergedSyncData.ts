import type {SyncData} from "@src/redux/account/data/types/SyncData";
import {mergedProgress} from "@src/redux/account/merging/merged-progress/MergedProgress";
import {mergedRatings} from "@src/redux/account/merging/merged-ratings/MergedRatings";
import {mergedStyles} from "@src/redux/account/merging/merged-styles/MergedStyles";

/**
 * What this device holds and what the server holds, as one — the first thing signing in does, and then every sync
 * after it. Each part settles the way its own kind of thing should: progress climbs, the record keeps every game,
 * styles follow their last change or deletion, and the preferences are whichever were chosen most recently.
 *
 * Preferences are taken whole rather than a choice at a time. A player who changes the board on one device and the
 * sound on another is rare, and mixing the two halves of a look they never chose together is a worse way to be wrong
 * than losing the older of two changes.
 */
export function mergedSyncData(local: SyncData, remote: SyncData): SyncData {
  return {
    progress: mergedProgress(local.progress, remote.progress),
    styles: mergedStyles(local.styles, remote.styles),
    ratings: mergedRatings(local.ratings, remote.ratings),
    preferences: remote.preferences.at > local.preferences.at ? remote.preferences : local.preferences,
  };
}
