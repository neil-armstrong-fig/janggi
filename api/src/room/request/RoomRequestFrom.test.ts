import {expect, it} from "vitest";
import {roomRequestFrom} from "@src/room/request/RoomRequestFrom";

const ROOM = "https://game-room";

function open(body: unknown, method = "POST"): Request {
  if (typeof body === "string") return new Request(`${ROOM}/open`, {method, body});

  return new Request(`${ROOM}/open`, {method, body: JSON.stringify(body)});
}

it("reads a request to make a room", async () => {
  expect(await roomRequestFrom(open({code: "ABCD2345", hostSide: "han", awayDays: 7}))).toEqual({
    kind: "open",
    code: "ABCD2345",
    hostSide: "han",
    awayDays: 7,
  });
});

it.each([
  ["a side that is not one", {code: "ABCD2345", hostSide: "blue", awayDays: 7}],
  ["a time that is not a choice", {code: "ABCD2345", hostSide: "han", awayDays: 2}],
  ["a time that is text", {code: "ABCD2345", hostSide: "han", awayDays: "7"}],
  ["no code", {hostSide: "han", awayDays: 7}],
  ["a code that is not text", {code: 5, hostSide: "han", awayDays: 7}],
  ["an empty code", {code: "", hostSide: "han", awayDays: 7}],
  ["a body that is not an object", "[]"],
  ["a body that is not JSON", "{"],
])("calls a request to make a room with %s malformed", async (_what, body) => {
  expect(await roomRequestFrom(open(body))).toEqual({kind: "malformed"});
});

it("does not take a room being made by any method but POST", async () => {
  expect(await roomRequestFrom(open({code: "ABCD2345", hostSide: "han", awayDays: 7}, "PUT"))).toEqual({
    kind: "unknown",
  });
});

it("reads a request for a player's socket, with the account the Worker named", async () => {
  const request = new Request(`${ROOM}/socket`, {headers: {"X-Account-Id": "user-1"}});

  expect(await roomRequestFrom(request)).toEqual({kind: "socket", accountId: "user-1"});
});

it("has no socket for a request that names no account", async () => {
  expect(await roomRequestFrom(new Request(`${ROOM}/socket`))).toEqual({kind: "unknown"});
  expect(await roomRequestFrom(new Request(`${ROOM}/socket`, {headers: {"X-Account-Id": ""}}))).toEqual({
    kind: "unknown",
  });
});

it("has nothing for any other path", async () => {
  expect(await roomRequestFrom(new Request(`${ROOM}/anything`))).toEqual({kind: "unknown"});
  expect(await roomRequestFrom(new Request(`${ROOM}/`))).toEqual({kind: "unknown"});
});
