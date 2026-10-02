import type {AccountStatus} from "@src/redux/account/types/AccountStatus";
import type {SyncState} from "@src/redux/account/types/SyncState";

/**
 * Whether the player is signed in with Google, and whether their progress is being kept in step with the server.
 *
 * Kept on the device, so a page that opens knows whether to ask the server who it is — and, being unable to
 * ask, a signed-out player's page never does. The name is kept so it can be shown before the server has answered, or
 * with no connection. Nothing else about the account is stored here: the session is the server's cookie, and what
 * was last sent is worked out afresh each time (`syncNow`).
 */
export interface AccountSliceState {
  readonly status: AccountStatus;
  readonly sync: SyncState;
  /** What the player is called, given them when the account was made and theirs to change; undefined until the server has said. */
  readonly displayName: string | undefined;
}
