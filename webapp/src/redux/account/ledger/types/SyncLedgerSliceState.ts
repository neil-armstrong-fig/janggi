import type {DeletedStyle} from "@src/redux/account/ledger/types/DeletedStyle";
import type {StyleStamp} from "@src/redux/account/ledger/types/StyleStamp";

/**
 * When things last changed on this device, and what was deleted — what the sync needs to settle two devices that
 * each changed something, and which cannot be read off the slices themselves.
 *
 * Kept always, signed in or not, so a change made while signed out counts when the player does sign in. It is only
 * bookkeeping on the device: nothing is sent anywhere until the player signs in.
 */
export interface SyncLedgerSliceState {
  /** Each of the player's own boards, by name — which is what a name picks out locally. */
  readonly boards: Readonly<Record<string, StyleStamp>>;
  readonly pieceSets: Readonly<Record<string, StyleStamp>>;
  readonly deleted: readonly DeletedStyle[];
  /** When the preferences last changed, whichever of them. */
  readonly preferencesAt: number;
  /** When the player last started their record again, as the ISO time its games are told apart from by. */
  readonly ratingsResetAt: string | undefined;
}
