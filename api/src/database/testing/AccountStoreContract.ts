import type {AccountStore} from "@src/database/AccountStore";
import type {NewAccount} from "@src/database/types/NewAccount";

/**
 * What every `AccountStore` must do, written once and run against each: the in-memory one the route tests lean on, and
 * the real one over D1. Called from inside a test file with a way to make a fresh store, so a difference between the
 * two is a failing test rather than a route that passes and a deployment that does not.
 */
export function accountStoreContract(makeStore: () => Promise<AccountStore>): void {
  let store: AccountStore;

  beforeEach(async () => {
    store = await makeStore();
  });

  const NOW = new Date("2026-10-01T12:00:00Z");
  const LATER = new Date("2026-10-02T12:00:00Z");
  const account = (id: string, displayName = "Kim Yu-sin"): NewAccount => ({id, displayName, now: NOW});

  it("makes an account for a Google subject it has not seen", async () => {
    expect(await store.findOrCreateAccount("google-1", account("user-1"))).toEqual({
      id: "user-1",
      displayName: "Kim Yu-sin",
    });
  });

  it("gives the same account back to the same Google subject, and does not make another", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect(await store.findOrCreateAccount("google-1", account("user-2", "Someone Else"))).toEqual({
      id: "user-1",
      displayName: "Kim Yu-sin",
    });
  });

  it("keeps two Google subjects' accounts apart", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect((await store.findOrCreateAccount("google-2", account("user-2"))).id).toBe("user-2");
  });

  it("finds the account of a session that has not run out", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.createSession({idHash: "hash", userId: "user-1", expiresAt: LATER});

    expect(await store.accountOfSession("hash", NOW)).toEqual({id: "user-1", displayName: "Kim Yu-sin"});
  });

  it("finds no account for a session that has run out, nor for one it never made", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.createSession({idHash: "hash", userId: "user-1", expiresAt: NOW});

    expect(await store.accountOfSession("hash", NOW)).toBeUndefined();
    expect(await store.accountOfSession("unknown", NOW)).toBeUndefined();
  });

  it("ends a session when it is deleted", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.createSession({idHash: "hash", userId: "user-1", expiresAt: LATER});

    await store.deleteSession("hash");

    expect(await store.accountOfSession("hash", NOW)).toBeUndefined();
  });

  it("renames an account", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.createSession({idHash: "hash", userId: "user-1", expiresAt: LATER});

    await store.renameAccount("user-1", "Admiral Yi");

    expect((await store.accountOfSession("hash", NOW))?.displayName).toBe("Admiral Yi");
  });

  it("has no data for a player who has written none", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect(await store.readData("user-1")).toBeUndefined();
  });

  it("keeps a first write against version 0, as version 1", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect(await store.writeData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW})).toEqual({
      outcome: "written",
      version: 1,
    });
    expect(await store.readData("user-1")).toEqual({version: 1, blob: "one"});
  });

  it("keeps a write made against the version it read, and counts it on", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.writeData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});

    expect(await store.writeData({userId: "user-1", blob: "two", expectedVersion: 1, now: LATER})).toEqual({
      outcome: "written",
      version: 2,
    });
    expect(await store.readData("user-1")).toEqual({version: 2, blob: "two"});
  });

  it("refuses a write made against a version somebody has written past, and keeps what is there", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.writeData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});
    await store.writeData({userId: "user-1", blob: "two", expectedVersion: 1, now: NOW});

    expect(await store.writeData({userId: "user-1", blob: "stale", expectedVersion: 1, now: NOW})).toEqual({
      outcome: "conflict",
      version: 2,
    });
    expect(await store.readData("user-1")).toEqual({version: 2, blob: "two"});
  });

  it("refuses a first write by someone who thinks there is already data, and one who thinks there is none when there is", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect((await store.writeData({userId: "user-1", blob: "x", expectedVersion: 3, now: NOW})).outcome).toBe(
      "conflict",
    );

    await store.writeData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});

    expect(await store.writeData({userId: "user-1", blob: "x", expectedVersion: 0, now: NOW})).toEqual({
      outcome: "conflict",
      version: 1,
    });
  });

  it("keeps each player's data to themselves", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.findOrCreateAccount("google-2", account("user-2"));
    await store.writeData({userId: "user-1", blob: "mine", expectedVersion: 0, now: NOW});

    expect(await store.readData("user-2")).toBeUndefined();
  });

  it("deletes everything kept for a player on deleting the account, and nobody else's", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.findOrCreateAccount("google-2", account("user-2"));
    await store.createSession({idHash: "hash-1", userId: "user-1", expiresAt: LATER});
    await store.createSession({idHash: "hash-2", userId: "user-2", expiresAt: LATER});
    await store.writeData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});
    await store.writeData({userId: "user-2", blob: "two", expectedVersion: 0, now: NOW});

    await store.deleteAccount("user-1");

    expect(await store.accountOfSession("hash-1", NOW)).toBeUndefined();
    expect(await store.readData("user-1")).toBeUndefined();
    expect(await store.accountOfSession("hash-2", NOW)).toBeDefined();
    expect(await store.readData("user-2")).toEqual({version: 1, blob: "two"});
  });

  it("makes a new account for a Google subject whose account was deleted", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.deleteAccount("user-1");

    expect((await store.findOrCreateAccount("google-1", account("user-9", "Fresh"))).id).toBe("user-9");
  });
}
