import {afterAll, beforeAll} from "vitest";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {drizzle} from "drizzle-orm/d1";
import {getPlatformProxy} from "wrangler";
import type {PlatformProxy} from "wrangler";
import {DrizzleAccountStore} from "@src/database/DrizzleAccountStore";
import {accountStoreContract} from "@src/database/testing/AccountStoreContract";

/**
 * The real store, against a real D1: wrangler's local one, which is the same SQLite the deployed database runs, with
 * the migrations Drizzle generated applied to it. Not a fake of D1, so a statement D1 refuses fails here.
 */
let platform: PlatformProxy<{DB: D1Database}>;

beforeAll(async () => {
  platform = await getPlatformProxy<{DB: D1Database}>({persist: false});

  const migration = readFileSync(resolve(import.meta.dirname, "../../migrations/0000_init.sql"), "utf8");
  for (const statement of migration.split("--> statement-breakpoint")) {
    await platform.env.DB.prepare(statement.trim()).run();
  }
}, 60_000);

afterAll(async () => {
  await platform.dispose();
});

accountStoreContract(async () => {
  await platform.env.DB.prepare("DELETE FROM users").run();

  return new DrizzleAccountStore(drizzle(platform.env.DB));
});
