import {ApiHarness} from "@src/router/testing/ApiHarness";
import {MAX_OPEN_ROOMS} from "@src/router/http/routes/open-room/limits/MaxOpenRooms";
import {beforeEach, afterEach, expect, it, vi} from "vitest";
import {gameRoomsStub} from "@src/router/testing/GameRoomsStub";
import {jsonOf} from "@src/router/testing/JsonOf";
import {mintFriendCode} from "@src/router/http/routes/open-room/friend-code/MintFriendCode";
import {parseFriendCode} from "@janggi/shared/janggi/online/friend-code/ParseFriendCode";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

// Minting is tested apart; here each draw is a code the test hands out in turn.
vi.mock("@src/router/http/routes/open-room/friend-code/MintFriendCode");

let api: ApiHarness;
let rooms: ReturnType<typeof gameRoomsStub>;

beforeEach(() => {
  api = new ApiHarness();
  rooms = gameRoomsStub();
  workerEnvironment.GAME_ROOMS = rooms.namespace;

  let minted = 0;
  vi.mocked(mintFriendCode).mockImplementation(() => `AAAA${2222 + ++minted}` as FriendCode);
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GAME_ROOMS");
});

/** What the Worker asked rooms to be made as, by the room it asked. */
function roomsMade(): Record<string, unknown> {
  return Object.fromEntries(
    rooms.roomCalled.mock.calls.map(([code, input, init]) => [
      code,
      {input: String(input), body: JSON.parse(String(init?.body))},
    ]),
  );
}

it("opening a room gives the host a friend code, and makes the room on the side they chose, for the longest time", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("POST", "/api/rooms", {cookie, body: {side: "han"}});
  const {code} = (await jsonOf(response)) as {code: string};

  expect(response.status).toBe(201);
  expect(parseFriendCode(code)).toBe(code);
  expect(roomsMade()).toEqual({
    [code]: {input: "https://game-room/open", body: {code, hostSide: "han", awayDays: 30}},
  });
});

it("opening a room lets the host choose how many days both may be away", async () => {
  const cookie = await api.signIn("google-1");

  const response = await api.send("POST", "/api/rooms", {cookie, body: {side: "cho", awayDays: 3}});
  const {code} = (await jsonOf(response)) as {code: string};

  expect(roomsMade()[code]).toMatchObject({body: {hostSide: "cho", awayDays: 3}});
});

it.each([[2], [0], [-1], ["7"], [null], [1000]])(
  "opening a room refuses %j days away, which is not a choice",
  async awayDays => {
    const cookie = await api.signIn("google-1");

    expect((await api.send("POST", "/api/rooms", {cookie, body: {side: "han", awayDays}})).status).toBe(400);
    expect(rooms.roomCalled).not.toHaveBeenCalled();
  },
);

it("opening a room needs a signed-in player", async () => {
  expect((await api.send("POST", "/api/rooms", {body: {side: "han"}})).status).toBe(401);
});

it("opening a room refuses a request that does not come from the site", async () => {
  const cookie = await api.signIn("google-1");

  expect(
    (await api.send("POST", "/api/rooms", {cookie, origin: "https://evil.example", body: {side: "han"}})).status,
  ).toBe(403);
});

it.each([
  ["no side", {}],
  ["a side that is not one", {side: "blue"}],
  ["a side that is not text", {side: 1}],
])("opening a room refuses %s", async (_what, body) => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("POST", "/api/rooms", {cookie, body})).status).toBe(400);
  expect(rooms.roomCalled).not.toHaveBeenCalled();
});

it("opening a room refuses a body that is not JSON, or is far too long", async () => {
  const cookie = await api.signIn("google-1");

  expect((await api.send("POST", "/api/rooms", {cookie, rawBody: "{"})).status).toBe(400);
  expect(
    (await api.send("POST", "/api/rooms", {cookie, rawBody: `{"side":"han","x":"${"a".repeat(2_000)}"}`})).status,
  ).toBe(400);
});

it("opening a second room while one is open is refused with the first's code, and the first stays", async () => {
  const cookie = await api.signIn("google-1");
  const first = (await jsonOf(await api.send("POST", "/api/rooms", {cookie, body: {side: "han"}}))) as {code: string};

  const second = await api.send("POST", "/api/rooms", {cookie, body: {side: "cho"}});

  expect(second.status).toBe(409);
  expect(await jsonOf(second)).toEqual({code: first.code});
  expect(rooms.roomCalled).toHaveBeenCalledTimes(1);
});

it("two players each get their own room and their own code", async () => {
  const first = await api.send("POST", "/api/rooms", {cookie: await api.signIn("google-1"), body: {side: "han"}});
  const second = await api.send("POST", "/api/rooms", {cookie: await api.signIn("google-2"), body: {side: "han"}});

  expect(second.status).toBe(201);
  expect(((await jsonOf(first)) as {code: string}).code).not.toBe(((await jsonOf(second)) as {code: string}).code);
});

it("draws another code where the one drawn is taken", async () => {
  vi.mocked(mintFriendCode).mockReset();
  vi.mocked(mintFriendCode)
    .mockReturnValueOnce("TAKEN222" as FriendCode)
    .mockReturnValue("FREE2222" as FriendCode);
  await api.database.openRoomRecord({
    code: "TAKEN222",
    hostId: "somebody",
    now: api.clock,
    limit: MAX_OPEN_ROOMS,
    staleAfter: 1,
  });

  const response = await api.send("POST", "/api/rooms", {cookie: await api.signIn("google-1"), body: {side: "han"}});

  expect(await jsonOf(response)).toEqual({code: "FREE2222"});
});

it("opening a room is refused once there are as many open as there may be", async () => {
  for (let player = 0; player < MAX_OPEN_ROOMS; player++) {
    await api.database.openRoomRecord({
      code: `FULL${player}`,
      hostId: `nobody-${player}`,
      now: api.clock,
      limit: MAX_OPEN_ROOMS,
      staleAfter: 1,
    });
  }
  const cookie = await api.signIn("google-1");

  expect((await api.send("POST", "/api/rooms", {cookie, body: {side: "han"}})).status).toBe(503);
});

it("opening a room is rate-limited by account", async () => {
  const cookie = await api.signIn("google-1");
  api.limits.refuse("room", await api.accountIdOf(cookie));

  expect((await api.send("POST", "/api/rooms", {cookie, body: {side: "han"}})).status).toBe(429);
});

it.each([
  ["cannot be reached", () => rooms.roomCalled.mockRejectedValueOnce(new Error("The room could not be made"))],
  ["answers with an error", () => rooms.roomCalled.mockResolvedValueOnce(new Response(null, {status: 500}))],
])("a room that %s is forgotten, so the host may try again", async (_how, breakTheRoom) => {
  const cookie = await api.signIn("google-1");
  breakTheRoom();

  expect((await api.send("POST", "/api/rooms", {cookie, body: {side: "han"}})).status).toBe(502);
  expect((await api.send("POST", "/api/rooms", {cookie, body: {side: "han"}})).status).toBe(201);
});
