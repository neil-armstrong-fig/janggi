import {afterEach, beforeEach, expect, it} from "vitest";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";
import {forwardToRoom} from "@src/router/websocket/room-socket/ForwardToRoom";
import {gameRoomsStub} from "@src/router/testing/GameRoomsStub";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

let rooms: ReturnType<typeof gameRoomsStub>;
const CODE = "ABCD2345" as FriendCode;
const ACCOUNT = {id: "user-2", displayName: "Yi"};

beforeEach(() => {
  rooms = gameRoomsStub();
  workerEnvironment.GAME_ROOMS = rooms.namespace;
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GAME_ROOMS");
});

function upgrade(): Request {
  return new Request("https://api.test/api/rooms/ABCD2345/socket", {
    headers: {Upgrade: "websocket", Cookie: "session=secret"},
  });
}

it("hands the room named by the code the upgrade, saying whose it is", async () => {
  await forwardToRoom(upgrade(), ACCOUNT, CODE);

  expect(rooms.roomCalled).toHaveBeenCalledTimes(1);
  const [code, input] = rooms.roomCalled.mock.calls[0] ?? [];
  expect(code).toBe(CODE);
  expect((input as Request).url).toBe("https://game-room/socket");
  expect((input as Request).headers.get("X-Account-Id")).toBe("user-2");
  expect((input as Request).headers.get("Upgrade")).toBe("websocket");
});

it("answers what the room answers", async () => {
  rooms.roomCalled.mockResolvedValueOnce(new Response(null, {status: 404}));

  expect((await forwardToRoom(upgrade(), ACCOUNT, CODE)).status).toBe(404);
});

it("does not let the player name themselves: the account header the room reads is the one the Worker set", async () => {
  const forged = new Request("https://api.test/api/rooms/ABCD2345/socket", {
    headers: {Upgrade: "websocket", "X-Account-Id": "somebody-else"},
  });

  await forwardToRoom(forged, ACCOUNT, CODE);

  expect((rooms.roomCalled.mock.calls[0]?.[1] as Request).headers.get("X-Account-Id")).toBe("user-2");
});
