import type {DatabaseFunctions} from "@src/database/testing/types/DatabaseFunctions";
import type {RoomToOpen} from "@src/database/types/RoomToOpen";
import type {NewAccount} from "@src/database/types/NewAccount";

/**
 * What every database function must do, written once and run against each set: the in-memory one the route tests lean on,
 * and the real ones over D1. Called from inside a test file with a way to make a fresh store, so a difference between the
 * two is a failing test rather than a route that passes and a deployment that does not.
 */
export function databaseContract(makeStore: () => Promise<DatabaseFunctions>): void {
  let store: DatabaseFunctions;

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

    expect(await store.readPlayerData("user-1")).toBeUndefined();
  });

  it("keeps a first write against version 0, as version 1", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect(await store.writePlayerData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW})).toEqual({
      outcome: "written",
      version: 1,
    });
    expect(await store.readPlayerData("user-1")).toEqual({version: 1, blob: "one"});
  });

  it("keeps a write made against the version it read, and counts it on", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.writePlayerData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});

    expect(await store.writePlayerData({userId: "user-1", blob: "two", expectedVersion: 1, now: LATER})).toEqual({
      outcome: "written",
      version: 2,
    });
    expect(await store.readPlayerData("user-1")).toEqual({version: 2, blob: "two"});
  });

  it("refuses a write made against a version somebody has written past, and keeps what is there", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.writePlayerData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});
    await store.writePlayerData({userId: "user-1", blob: "two", expectedVersion: 1, now: NOW});

    expect(await store.writePlayerData({userId: "user-1", blob: "stale", expectedVersion: 1, now: NOW})).toEqual({
      outcome: "conflict",
      version: 2,
    });
    expect(await store.readPlayerData("user-1")).toEqual({version: 2, blob: "two"});
  });

  it("refuses a first write by someone who thinks there is already data, and one who thinks there is none when there is", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));

    expect((await store.writePlayerData({userId: "user-1", blob: "x", expectedVersion: 3, now: NOW})).outcome).toBe(
      "conflict",
    );

    await store.writePlayerData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});

    expect(await store.writePlayerData({userId: "user-1", blob: "x", expectedVersion: 0, now: NOW})).toEqual({
      outcome: "conflict",
      version: 1,
    });
  });

  it("keeps each player's data to themselves", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.findOrCreateAccount("google-2", account("user-2"));
    await store.writePlayerData({userId: "user-1", blob: "mine", expectedVersion: 0, now: NOW});

    expect(await store.readPlayerData("user-2")).toBeUndefined();
  });

  it("deletes everything kept for a player on deleting the account, and nobody else's", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.findOrCreateAccount("google-2", account("user-2"));
    await store.createSession({idHash: "hash-1", userId: "user-1", expiresAt: LATER});
    await store.createSession({idHash: "hash-2", userId: "user-2", expiresAt: LATER});
    await store.writePlayerData({userId: "user-1", blob: "one", expectedVersion: 0, now: NOW});
    await store.writePlayerData({userId: "user-2", blob: "two", expectedVersion: 0, now: NOW});

    await store.removeAccount("user-1");

    expect(await store.accountOfSession("hash-1", NOW)).toBeUndefined();
    expect(await store.readPlayerData("user-1")).toBeUndefined();
    expect(await store.accountOfSession("hash-2", NOW)).toBeDefined();
    expect(await store.readPlayerData("user-2")).toEqual({version: 1, blob: "two"});
  });

  it("makes a new account for a Google subject whose account was deleted", async () => {
    await store.findOrCreateAccount("google-1", account("user-1"));
    await store.removeAccount("user-1");

    expect((await store.findOrCreateAccount("google-1", account("user-9", "Fresh"))).id).toBe("user-9");
  });

  describe("push subscriptions", () => {
    const phone = {endpoint: "https://push.example/phone", p256dh: "phone-key", auth: "phone-auth"};
    const laptop = {endpoint: "https://push.example/laptop", p256dh: "laptop-key", auth: "laptop-auth"};

    beforeEach(async () => {
      await store.findOrCreateAccount("google-1", account("user-1"));
      await store.findOrCreateAccount("google-2", account("user-2"));
    });

    it("keeps every device an account subscribes, and no one else's", async () => {
      await store.savePushSubscription({userId: "user-1", subscription: phone, now: NOW});
      await store.savePushSubscription({userId: "user-1", subscription: laptop, now: NOW});

      expect(await store.pushSubscriptionsOf("user-1")).toHaveLength(2);
      expect(await store.pushSubscriptionsOf("user-2")).toEqual([]);
    });

    it("replaces a device's keys when it subscribes again, rather than keeping two", async () => {
      await store.savePushSubscription({userId: "user-1", subscription: phone, now: NOW});
      await store.savePushSubscription({userId: "user-1", subscription: {...phone, auth: "new-auth"}, now: LATER});

      expect(await store.pushSubscriptionsOf("user-1")).toEqual([{...phone, auth: "new-auth"}]);
    });

    it("gives a device to whoever signed in on it last", async () => {
      await store.savePushSubscription({userId: "user-1", subscription: phone, now: NOW});
      await store.savePushSubscription({userId: "user-2", subscription: phone, now: LATER});

      expect(await store.pushSubscriptionsOf("user-1")).toEqual([]);
      expect(await store.pushSubscriptionsOf("user-2")).toEqual([phone]);
    });

    it("lets an account remove its own device and leaves its others", async () => {
      await store.savePushSubscription({userId: "user-1", subscription: phone, now: NOW});
      await store.savePushSubscription({userId: "user-1", subscription: laptop, now: NOW});

      await store.removePushSubscription({userId: "user-1", endpoint: phone.endpoint});

      expect(await store.pushSubscriptionsOf("user-1")).toEqual([laptop]);
    });

    it("does not let an account remove a device that is another's", async () => {
      await store.savePushSubscription({userId: "user-1", subscription: phone, now: NOW});

      await store.removePushSubscription({userId: "user-2", endpoint: phone.endpoint});

      expect(await store.pushSubscriptionsOf("user-1")).toEqual([phone]);
    });

    it("deletes an account's devices with the account", async () => {
      await store.savePushSubscription({userId: "user-1", subscription: phone, now: NOW});

      await store.removeAccount("user-1");

      expect(await store.pushSubscriptionsOf("user-1")).toEqual([]);
    });
  });

  describe("rooms", () => {
    const DAY = 24 * 3_600_000;
    const room = (code: string, hostId: string, now = NOW, limit = 10): RoomToOpen => ({
      code,
      hostId,
      now,
      limit,
      staleAfter: DAY,
    });

    beforeEach(async () => {
      await store.findOrCreateAccount("google-1", account("user-1"));
      await store.findOrCreateAccount("google-2", account("user-2"));
    });

    it("opens a room for a host who has none", async () => {
      expect(await store.openRoomRecord(room("CODE0001", "user-1"))).toEqual({kind: "opened"});
    });

    it("holds a host to one room at a time", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1"));

      expect(await store.openRoomRecord(room("CODE0002", "user-1"))).toEqual({kind: "already-open", code: "CODE0001"});
    });

    it("lets a host open another once the first is closed", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1"));
      await store.closeRoomRecord("CODE0001");

      expect(await store.openRoomRecord(room("CODE0002", "user-1"))).toEqual({kind: "opened"});
    });

    it("refuses a code already in use by somebody else", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1"));

      expect(await store.openRoomRecord(room("CODE0001", "user-2"))).toEqual({kind: "code-taken"});
    });

    it("refuses a room when the limit of open rooms is reached", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1", NOW, 1));

      expect(await store.openRoomRecord(room("CODE0002", "user-2", NOW, 1))).toEqual({kind: "full"});
    });

    it("clears a host's room that was never closed once it is a day old", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1"));

      expect(await store.openRoomRecord(room("CODE0002", "user-1", new Date(NOW.getTime() + 25 * 3_600_000)))).toEqual({
        kind: "opened",
      });
    });

    it("keeps a host's room that is younger than the time a record is trusted for", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1"));

      expect(await store.openRoomRecord(room("CODE0002", "user-1", new Date(NOW.getTime() + 23 * 3_600_000)))).toEqual({
        kind: "already-open",
        code: "CODE0001",
      });
    });

    it("closes a room that is not there without complaint", async () => {
      await store.closeRoomRecord("NOSUCH01");
    });

    it("closes a room's record along with its host's account", async () => {
      await store.openRoomRecord(room("CODE0001", "user-1"));
      await store.removeAccount("user-1");

      expect(await store.openRoomRecord(room("CODE0001", "user-2"))).toEqual({kind: "opened"});
    });
  });
}
