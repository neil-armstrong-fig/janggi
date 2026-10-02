import type {ProgressSliceState} from "@src/redux/progress/types/ProgressSliceState";
import type {SyncedPreferences} from "@src/redux/account/data/types/SyncedPreferences";
import type {SyncedRatings} from "@src/redux/account/data/types/SyncedRatings";
import type {SyncedStyles} from "@src/redux/account/data/types/SyncedStyles";

/**
 * Everything the server keeps for a player, as one document: their progress, their own styles, their record
 * against the bot, and how they like the game drawn and heard.
 *
 * **Not the save key**, which is a smaller thing a player copies and pastes and deliberately leaves the record
 * out. This is private to the player's account; nobody else's styles reach them through it.
 *
 * Not in it: the game on the board, and a game still being rated — both belong to the device they are on.
 */
export interface SyncData {
  readonly progress: ProgressSliceState;
  readonly styles: SyncedStyles;
  readonly ratings: SyncedRatings;
  readonly preferences: SyncedPreferences;
}
