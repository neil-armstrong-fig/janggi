import {ApiHarness} from "@src/router/testing/ApiHarness";
import {afterEach, beforeEach, expect, it} from "vitest";
import {gameRoomsStub} from "@src/router/testing/GameRoomsStub";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

let api: ApiHarness;
let rooms: ReturnType<typeof gameRoomsStub>;
const UPGRADE = {Upgrade: "websocket", Connection: "Upgrade"};

beforeEach(() => {
  api = new ApiHarness();
  rooms = gameRoomsStub();
  workerEnvironment.GAME_ROOMS = rooms.namespace;
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GAME_ROOMS");
});

it("hands a player's upgrade to the room named by the code, saying whose it is", async () => {
  const cookie = await api.signIn("google-2");

  const response = await api.send("GET", "/api/rooms/ABCD2345/socket", {cookie, headers: UPGRADE});

  expect(response.status).toBe(200);
  const [code, input] = rooms.roomCalled.mock.calls[0] ?? [];
  expect(code).toBe("ABCD2345");
  expect((input as Request).headers.get("X-Account-Id")).toBe(await api.accountIdOf(cookie));
});

it("answers what the room answers", async () => {
  rooms.roomCalled.mockResolvedValueOnce(new Response(null, {status: 404}));

  expect(
    (await api.send("GET", "/api/rooms/ABCD2345/socket", {cookie: await api.signIn("google-2"), headers: UPGRADE}))
      .status,
  ).toBe(404);
});

it("needs a signed-in player, and does not reach the room without one", async () => {
  expect((await api.send("GET", "/api/rooms/ABCD2345/socket", {headers: UPGRADE})).status).toBe(401);
  expect(rooms.roomCalled).not.toHaveBeenCalled();
});

it("refuses an upgrade a page of another site asked for, whatever session it carries", async () => {
  const cookie = await api.signIn("google-2");

  const response = await api.send("GET", "/api/rooms/ABCD2345/socket", {
    cookie,
    origin: "https://evil.example",
    headers: UPGRADE,
  });

  expect(response.status).toBe(403);
  expect(rooms.roomCalled).not.toHaveBeenCalled();
});

it("refuses an upgrade with no origin", async () => {
  const cookie = await api.signIn("google-2");

  expect((await api.send("GET", "/api/rooms/ABCD2345/socket", {cookie, origin: null, headers: UPGRADE})).status).toBe(
    403,
  );
});

it.each(["/api/rooms/SHORT/socket", "/api/rooms/0000000O/socket", "/api/me", "/api/nothing", "/"])(
  "answers 404 to an upgrade for %s, which is no room's socket",
  async path => {
    const cookie = await api.signIn("google-2");

    expect((await api.send("GET", path, {cookie, headers: UPGRADE})).status).toBe(404);
    expect(rooms.roomCalled).not.toHaveBeenCalled();
  },
);

it("answers 404 to an upgrade made with any method but GET", async () => {
  const cookie = await api.signIn("google-2");

  expect((await api.send("POST", "/api/rooms/ABCD2345/socket", {cookie, headers: UPGRADE})).status).toBe(404);
});

it("does not treat the same path without an upgrade as a socket: it is not an HTTP route either, so 404", async () => {
  const cookie = await api.signIn("google-2");

  expect((await api.send("GET", "/api/rooms/ABCD2345/socket", {cookie})).status).toBe(404);
  expect(rooms.roomCalled).not.toHaveBeenCalled();
});
