import {SITE} from "@src/router/testing/SiteOrigin";
import {afterEach, beforeEach, vi} from "vitest";
import {testDatabase} from "@src/database/testing/TestDatabase";
import {testGoogle} from "@src/router/http/routes/sign-in/google/testing/TestGoogle";
import {testLimits} from "@src/router/http/routes/rate-limit/testing/TestLimits";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * Runs before every test file (`vitest.config.ts`). The Worker's code calls plain functions that reach out — to D1, to Google, to
 * Cloudflare's rate limits — and here each is replaced by an in-memory one, so a test of a route runs the real route over a world
 * it controls. A test of one of those functions themselves puts the real one back with `vi.unmock`.
 *
 * Also: time stands still at a day a test can move (`vi.setSystemTime`), `Math.random` is 0 so a generated name is one name, and
 * the origins the API trusts are the site and the dev server.
 */
vi.mock("@src/database/accounts/FindOrCreateAccount", async () => ({
  findOrCreateAccount: (await import("@src/database/testing/TestDatabase")).testDatabase.findOrCreateAccount,
}));
vi.mock("@src/database/accounts/RemoveAccount", async () => ({
  removeAccount: (await import("@src/database/testing/TestDatabase")).testDatabase.removeAccount,
}));
vi.mock("@src/database/accounts/RenameAccount", async () => ({
  renameAccount: (await import("@src/database/testing/TestDatabase")).testDatabase.renameAccount,
}));
vi.mock("@src/database/sessions/AccountOfSession", async () => ({
  accountOfSession: (await import("@src/database/testing/TestDatabase")).testDatabase.accountOfSession,
}));
vi.mock("@src/database/sessions/CreateSession", async () => ({
  createSession: (await import("@src/database/testing/TestDatabase")).testDatabase.createSession,
}));
vi.mock("@src/database/sessions/DeleteSession", async () => ({
  deleteSession: (await import("@src/database/testing/TestDatabase")).testDatabase.deleteSession,
}));
vi.mock("@src/database/data/ReadPlayerData", async () => ({
  readPlayerData: (await import("@src/database/testing/TestDatabase")).testDatabase.readPlayerData,
}));
vi.mock("@src/database/data/WritePlayerData", async () => ({
  writePlayerData: (await import("@src/database/testing/TestDatabase")).testDatabase.writePlayerData,
}));
vi.mock("@src/database/rooms/OpenRoomRecord", async () => ({
  openRoomRecord: (await import("@src/database/testing/TestDatabase")).testDatabase.openRoomRecord,
}));
vi.mock("@src/database/rooms/CloseRoomRecord", async () => ({
  closeRoomRecord: (await import("@src/database/testing/TestDatabase")).testDatabase.closeRoomRecord,
}));
vi.mock("@src/router/http/routes/sign-in/google/GoogleAuthorizationUrl", async () => ({
  googleAuthorizationUrl: (await import("@src/router/http/routes/sign-in/google/testing/TestGoogle")).testGoogle
    .authorizationUrl,
}));
vi.mock("@src/router/http/routes/sign-in/google/GoogleSubjectOf", async () => ({
  googleSubjectOf: (await import("@src/router/http/routes/sign-in/google/testing/TestGoogle")).testGoogle.subjectOf,
}));
vi.mock("@src/router/http/routes/rate-limit/LoginAllowed", async () => ({
  loginAllowed: (await import("@src/router/http/routes/rate-limit/testing/TestLimits")).testLimits.allowedBy("login"),
}));
vi.mock("@src/router/http/routes/rate-limit/DataWriteAllowed", async () => ({
  dataWriteAllowed: (await import("@src/router/http/routes/rate-limit/testing/TestLimits")).testLimits.allowedBy(
    "data",
  ),
}));
vi.mock("@src/router/http/routes/rate-limit/RoomOpeningAllowed", async () => ({
  roomOpeningAllowed: (await import("@src/router/http/routes/rate-limit/testing/TestLimits")).testLimits.allowedBy(
    "room",
  ),
}));

beforeEach(() => {
  testDatabase.reset();
  testGoogle.reset();
  testLimits.reset();
  workerEnvironment.ALLOWED_ORIGINS = `${SITE},http://localhost:3000`;
  vi.useFakeTimers({toFake: ["Date"], now: new Date("2026-10-01T12:00:00Z")});
  vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  Reflect.deleteProperty(workerEnvironment, "ALLOWED_ORIGINS");
});
