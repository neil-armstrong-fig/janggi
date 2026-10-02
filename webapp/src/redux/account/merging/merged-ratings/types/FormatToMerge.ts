import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {SyncedRatings} from "@src/redux/account/data/types/SyncedRatings";

/** One format's record on two devices, and when the player last started their record again. */
export interface FormatToMerge {
  readonly format: MatchFormat;
  readonly local: SyncedRatings;
  readonly remote: SyncedRatings;
  readonly resetAt: string | undefined;
}
