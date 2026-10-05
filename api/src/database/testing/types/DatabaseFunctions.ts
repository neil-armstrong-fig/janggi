import type {accountOfSession} from "@src/database/sessions/AccountOfSession";
import type {closeRoomRecord} from "@src/database/rooms/CloseRoomRecord";
import type {createSession} from "@src/database/sessions/CreateSession";
import type {deleteSession} from "@src/database/sessions/DeleteSession";
import type {findOrCreateAccount} from "@src/database/accounts/FindOrCreateAccount";
import type {openRoomRecord} from "@src/database/rooms/OpenRoomRecord";
import type {pushSubscriptionsOf} from "@src/database/push/PushSubscriptionsOf";
import type {readPlayerData} from "@src/database/data/ReadPlayerData";
import type {removeAccount} from "@src/database/accounts/RemoveAccount";
import type {removePushSubscription} from "@src/database/push/RemovePushSubscription";
import type {renameAccount} from "@src/database/accounts/RenameAccount";
import type {savePushSubscription} from "@src/database/push/SavePushSubscription";
import type {writePlayerData} from "@src/database/data/WritePlayerData";

/** The database's functions as one object, for the contract that both the real ones and the in-memory ones must pass. */
export interface DatabaseFunctions {
  readonly findOrCreateAccount: typeof findOrCreateAccount;
  readonly createSession: typeof createSession;
  readonly accountOfSession: typeof accountOfSession;
  readonly deleteSession: typeof deleteSession;
  readonly renameAccount: typeof renameAccount;
  readonly readPlayerData: typeof readPlayerData;
  readonly writePlayerData: typeof writePlayerData;
  readonly removeAccount: typeof removeAccount;
  readonly openRoomRecord: typeof openRoomRecord;
  readonly closeRoomRecord: typeof closeRoomRecord;
  readonly savePushSubscription: typeof savePushSubscription;
  readonly removePushSubscription: typeof removePushSubscription;
  readonly pushSubscriptionsOf: typeof pushSubscriptionsOf;
}
