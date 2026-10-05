import {accountOfSession} from "@src/database/sessions/AccountOfSession";
import {afterAll, vi} from "vitest";
import {closeRoomRecord} from "@src/database/rooms/CloseRoomRecord";
import {createSession} from "@src/database/sessions/CreateSession";
import {databaseContract} from "@src/database/testing/DatabaseContract";
import {deleteSession} from "@src/database/sessions/DeleteSession";
import {findOrCreateAccount} from "@src/database/accounts/FindOrCreateAccount";
import {openRoomRecord} from "@src/database/rooms/OpenRoomRecord";
import {pushSubscriptionsOf} from "@src/database/push/PushSubscriptionsOf";
import {readPlayerData} from "@src/database/data/ReadPlayerData";
import {removeAccount} from "@src/database/accounts/RemoveAccount";
import {removePushSubscription} from "@src/database/push/RemovePushSubscription";
import {renameAccount} from "@src/database/accounts/RenameAccount";
import {savePushSubscription} from "@src/database/push/SavePushSubscription";
import {writePlayerData} from "@src/database/data/WritePlayerData";

/**
 * The real database functions, against a real D1: wrangler's local one, which is the same SQLite the deployed database runs,
 * with the migrations Drizzle generated applied to it. Not a fake of D1, so a statement D1 refuses fails here.
 *
 * Every test file has the database functions mocked (`SetupApiTests`); this one puts the real ones back, and replaces the one
 * thing they share — the client over the Worker's binding — with one over its own local D1.
 */
vi.unmock("@src/database/accounts/FindOrCreateAccount");
vi.unmock("@src/database/accounts/RemoveAccount");
vi.unmock("@src/database/accounts/RenameAccount");
vi.unmock("@src/database/sessions/AccountOfSession");
vi.unmock("@src/database/sessions/CreateSession");
vi.unmock("@src/database/sessions/DeleteSession");
vi.unmock("@src/database/data/ReadPlayerData");
vi.unmock("@src/database/data/WritePlayerData");
vi.unmock("@src/database/rooms/OpenRoomRecord");
vi.unmock("@src/database/rooms/CloseRoomRecord");
vi.unmock("@src/database/push/SavePushSubscription");
vi.unmock("@src/database/push/RemovePushSubscription");
vi.unmock("@src/database/push/PushSubscriptionsOf");

const local = vi.hoisted(() => ({
  platform: undefined as undefined | {env: {DB: D1Database}; dispose: () => Promise<void>},
}));

vi.mock("@src/database/Database", async () => {
  const {readFileSync, readdirSync} = await import("node:fs");
  const {resolve} = await import("node:path");
  const {drizzle} = await import("drizzle-orm/d1");
  const {getPlatformProxy} = await import("wrangler");

  const platform = await getPlatformProxy<{DB: D1Database}>({persist: false});
  local.platform = platform;

  const folder = resolve(import.meta.dirname, "../../../migrations");
  for (const file of readdirSync(folder)
    .filter(name => name.endsWith(".sql"))
    .sort()) {
    for (const statement of readFileSync(resolve(folder, file), "utf8").split("--> statement-breakpoint")) {
      await platform.env.DB.prepare(statement.trim()).run();
    }
  }

  return {database: drizzle(platform.env.DB)};
});

afterAll(async () => {
  await local.platform?.dispose();
});

databaseContract(async () => {
  await local.platform?.env.DB.prepare("DELETE FROM users").run();

  return {
    findOrCreateAccount,
    createSession,
    accountOfSession,
    deleteSession,
    renameAccount,
    readPlayerData,
    writePlayerData,
    removeAccount,
    openRoomRecord,
    closeRoomRecord,
    savePushSubscription,
    removePushSubscription,
    pushSubscriptionsOf,
  };
});
