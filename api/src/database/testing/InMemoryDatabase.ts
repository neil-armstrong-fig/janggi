import type {Account} from "@src/database/types/Account";
import type {DataToWrite} from "@src/database/types/DataToWrite";
import type {DataWrite} from "@src/database/types/DataWrite";
import type {NewAccount} from "@src/database/types/NewAccount";
import type {NewSession} from "@src/database/types/NewSession";
import type {PlayerData} from "@src/database/types/PlayerData";
import type {PushSubscription} from "@src/database/types/PushSubscription";
import type {RoomOpening} from "@src/database/types/RoomOpening";
import type {RoomToOpen} from "@src/database/types/RoomToOpen";
import type {SubscriptionToRemove} from "@src/database/types/SubscriptionToRemove";
import type {SubscriptionToSave} from "@src/database/types/SubscriptionToSave";

/**
 * The database's functions, in memory, for the tests of what the routes decide: a class because it holds state — the accounts,
 * sessions, data and rooms a test has made. `SetupApiTests` makes each database function this one's, so a route under test
 * runs unchanged. Held to the same rules as the real functions by the same contract (`DatabaseContract`), so it cannot quietly
 * allow what the database would refuse.
 *
 * Each is an arrow property, so a function module can hand out `testDatabase.findOrCreateAccount` as it stands.
 */
export class InMemoryDatabase {
  private readonly accounts = new Map<string, Account>();
  private readonly accountBySub = new Map<string, string>();
  private readonly sessions = new Map<string, NewSession>();
  private readonly data = new Map<string, PlayerData>();
  private readonly rooms = new Map<string, {readonly hostId: string; readonly createdAt: Date}>();
  private readonly subscriptions = new Map<
    string,
    {readonly userId: string; readonly subscription: PushSubscription}
  >();

  findOrCreateAccount = (googleSub: string, newAccount: NewAccount): Promise<Account> => {
    const known = this.accountBySub.get(googleSub);
    if (known !== undefined) {
      const existing = this.accounts.get(known);
      if (existing) return Promise.resolve(existing);
    }

    const account = {id: newAccount.id, displayName: newAccount.displayName};
    this.accounts.set(account.id, account);
    this.accountBySub.set(googleSub, account.id);

    return Promise.resolve(account);
  };

  createSession = (session: NewSession): Promise<void> => {
    this.sessions.set(session.idHash, session);

    return Promise.resolve();
  };

  accountOfSession = (idHash: string, now: Date): Promise<Account | undefined> => {
    const session = this.sessions.get(idHash);
    if (session === undefined || session.expiresAt <= now) return Promise.resolve(undefined);

    return Promise.resolve(this.accounts.get(session.userId));
  };

  deleteSession = (idHash: string): Promise<void> => {
    this.sessions.delete(idHash);

    return Promise.resolve();
  };

  renameAccount = (userId: string, displayName: string): Promise<void> => {
    const account = this.accounts.get(userId);
    if (account) this.accounts.set(userId, {...account, displayName});

    return Promise.resolve();
  };

  readPlayerData = (userId: string): Promise<PlayerData | undefined> => {
    return Promise.resolve(this.data.get(userId));
  };

  writePlayerData = ({userId, blob, expectedVersion}: DataToWrite): Promise<DataWrite> => {
    const held = this.data.get(userId)?.version ?? 0;
    if (held !== expectedVersion) return Promise.resolve({outcome: "conflict", version: held});

    this.data.set(userId, {version: held + 1, blob});

    return Promise.resolve({outcome: "written", version: held + 1});
  };

  removeAccount = (userId: string): Promise<void> => {
    this.accounts.delete(userId);
    this.data.delete(userId);
    [...this.subscriptions].forEach(([endpoint, held]) => {
      if (held.userId === userId) this.subscriptions.delete(endpoint);
    });
    [...this.rooms].forEach(([code, room]) => {
      if (room.hostId === userId) this.rooms.delete(code);
    });
    [...this.sessions].forEach(([idHash, session]) => {
      if (session.userId === userId) this.sessions.delete(idHash);
    });
    [...this.accountBySub].forEach(([sub, id]) => {
      if (id === userId) this.accountBySub.delete(sub);
    });

    return Promise.resolve();
  };

  openRoomRecord = ({code, hostId, now, limit, staleAfter}: RoomToOpen): Promise<RoomOpening> => {
    [...this.rooms].forEach(([held, room]) => {
      if (room.hostId === hostId && room.createdAt.getTime() < now.getTime() - staleAfter) this.rooms.delete(held);
    });

    const held = [...this.rooms].find(([, room]) => room.hostId === hostId);
    if (held) return Promise.resolve({kind: "already-open", code: held[0]});
    if (this.rooms.has(code)) return Promise.resolve({kind: "code-taken"});
    if (this.rooms.size >= limit) return Promise.resolve({kind: "full"});

    this.rooms.set(code, {hostId, createdAt: now});

    return Promise.resolve({kind: "opened"});
  };

  closeRoomRecord = (code: string): Promise<void> => {
    this.rooms.delete(code);

    return Promise.resolve();
  };

  savePushSubscription = ({userId, subscription}: SubscriptionToSave): Promise<void> => {
    this.subscriptions.set(subscription.endpoint, {userId, subscription});

    return Promise.resolve();
  };

  removePushSubscription = ({userId, endpoint}: SubscriptionToRemove): Promise<void> => {
    if (this.subscriptions.get(endpoint)?.userId === userId) this.subscriptions.delete(endpoint);

    return Promise.resolve();
  };

  pushSubscriptionsOf = (userId: string): Promise<readonly PushSubscription[]> => {
    const held = [...this.subscriptions.values()].filter(each => each.userId === userId);

    return Promise.resolve(held.map(each => each.subscription));
  };

  /** Forgets everything: each test starts from an empty database. */
  reset = (): void => {
    this.accounts.clear();
    this.accountBySub.clear();
    this.sessions.clear();
    this.data.clear();
    this.rooms.clear();
    this.subscriptions.clear();
  };
}
