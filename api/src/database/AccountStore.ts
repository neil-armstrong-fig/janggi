import type {Account} from "@src/database/types/Account";
import type {DataToWrite} from "@src/database/types/DataToWrite";
import type {DataWrite} from "@src/database/types/DataWrite";
import type {NewAccount} from "@src/database/types/NewAccount";
import type {NewSession} from "@src/database/types/NewSession";
import type {PlayerData} from "@src/database/types/PlayerData";

/**
 * Everything the API keeps, as the questions it asks of it. A narrow interface rather than the database, so what a
 * route decides is tested against an in-memory one and what the database does is tested against a real one, apart.
 */
export interface AccountStore {
  /** The account for a Google subject, made with `newAccount` where there is none — the first sign-in. */
  findOrCreateAccount(googleSub: string, newAccount: NewAccount): Promise<Account>;
  createSession(session: NewSession): Promise<void>;
  /** The account a session belongs to, unless it has run out as of `now`. */
  accountOfSession(idHash: string, now: Date): Promise<Account | undefined>;
  deleteSession(idHash: string): Promise<void>;
  renameAccount(userId: string, displayName: string): Promise<void>;
  readData(userId: string): Promise<PlayerData | undefined>;
  /** Keeps the data only if nothing has been written since `expectedVersion`: two devices cannot overwrite each other. */
  writeData(write: DataToWrite): Promise<DataWrite>;
  /** Everything kept for the player: the account, its sessions and its data. */
  deleteAccount(userId: string): Promise<void>;
}
