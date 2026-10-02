import type {Account} from "@src/database/types/Account";
import type {AccountStore} from "@src/database/AccountStore";
import type {DataToWrite} from "@src/database/types/DataToWrite";
import type {DataWrite} from "@src/database/types/DataWrite";
import type {NewAccount} from "@src/database/types/NewAccount";
import type {NewSession} from "@src/database/types/NewSession";
import type {PlayerData} from "@src/database/types/PlayerData";

/**
 * An `AccountStore` that keeps everything in memory, for the tests of what the routes decide. Held to the same rules
 * as the real one by the same contract test (`AccountStoreContract`), so it cannot quietly allow what the database
 * would refuse.
 */
export class InMemoryAccountStore implements AccountStore {
  private readonly accounts = new Map<string, Account>();
  private readonly accountBySub = new Map<string, string>();
  private readonly sessions = new Map<string, NewSession>();
  private readonly data = new Map<string, PlayerData>();

  findOrCreateAccount(googleSub: string, newAccount: NewAccount): Promise<Account> {
    const known = this.accountBySub.get(googleSub);
    const existing = known === undefined ? undefined : this.accounts.get(known);
    if (existing) return Promise.resolve(existing);

    const account = {id: newAccount.id, displayName: newAccount.displayName};
    this.accounts.set(account.id, account);
    this.accountBySub.set(googleSub, account.id);

    return Promise.resolve(account);
  }

  createSession(session: NewSession): Promise<void> {
    this.sessions.set(session.idHash, session);

    return Promise.resolve();
  }

  accountOfSession(idHash: string, now: Date): Promise<Account | undefined> {
    const session = this.sessions.get(idHash);
    const live = session !== undefined && session.expiresAt > now;

    return Promise.resolve(live ? this.accounts.get(session.userId) : undefined);
  }

  deleteSession(idHash: string): Promise<void> {
    this.sessions.delete(idHash);

    return Promise.resolve();
  }

  renameAccount(userId: string, displayName: string): Promise<void> {
    const account = this.accounts.get(userId);
    if (account) this.accounts.set(userId, {...account, displayName});

    return Promise.resolve();
  }

  readData(userId: string): Promise<PlayerData | undefined> {
    return Promise.resolve(this.data.get(userId));
  }

  writeData({userId, blob, expectedVersion}: DataToWrite): Promise<DataWrite> {
    const held = this.data.get(userId)?.version ?? 0;
    if (held !== expectedVersion) return Promise.resolve({outcome: "conflict", version: held});

    this.data.set(userId, {version: held + 1, blob});

    return Promise.resolve({outcome: "written", version: held + 1});
  }

  deleteAccount(userId: string): Promise<void> {
    this.accounts.delete(userId);
    this.data.delete(userId);
    [...this.sessions].forEach(([idHash, session]) => {
      if (session.userId === userId) this.sessions.delete(idHash);
    });
    [...this.accountBySub].forEach(([sub, id]) => {
      if (id === userId) this.accountBySub.delete(sub);
    });

    return Promise.resolve();
  }
}
