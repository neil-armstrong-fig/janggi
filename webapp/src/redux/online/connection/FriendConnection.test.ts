import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {FakeSocket} from "@src/redux/online/connection/testing/FakeSocket";
import {FriendConnection} from "@src/redux/online/connection/FriendConnection";
import type {FriendRoomHandlers} from "@src/redux/online/connection/types/FriendRoomHandlers";
import type {FriendRoomVisit} from "@src/redux/online/connection/types/FriendRoomVisit";

const FIRST_TRY: FriendRoomVisit = {code: "ABCD2345", introduction: {displayName: "Kim"}, returning: false};
const COMING_BACK: FriendRoomVisit = {...FIRST_TRY, returning: true};
const WAITING = JSON.stringify({kind: "waiting"});

let sockets: FakeSocket[];
let connection: FriendConnection;
let handlers: FriendRoomHandlers;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", FakeSocket);
  sockets = [];
  connection = new FriendConnection(url => {
    const socket = new FakeSocket(url);
    sockets.push(socket);

    return socket as unknown as WebSocket;
  });
  handlers = {onMessage: vi.fn(), onConnected: vi.fn(), onReconnecting: vi.fn(), onRefused: vi.fn(), onGaveUp: vi.fn()};
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("opens the room's socket at the server, as a WebSocket", () => {
  connection.open(FIRST_TRY, handlers);

  expect(sockets[0]?.url).toMatch(/^wss?:\/\/.*\/api\/rooms\/ABCD2345\/socket$/);
});

it("introduces the player as the first thing it says", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();

  expect(sockets[0]?.sent).toEqual([JSON.stringify({kind: "introduce", introduction: {displayName: "Kim"}})]);
});

it("hands on what the room says", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);

  expect(handlers.onMessage).toHaveBeenCalledWith({kind: "waiting"});
});

it("does not hand on what is not a message from the room", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says("{nonsense");
  sockets[0]?.says(JSON.stringify({kind: "teleport"}));

  expect(handlers.onMessage).not.toHaveBeenCalled();
});

it("says a room is not there when its socket closes before it has said a word, on a first try, and does not try again", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.drops();
  vi.advanceTimersByTime(60_000);

  expect(handlers.onRefused).toHaveBeenCalledOnce();
  expect(sockets).toHaveLength(1);
});

it("tries again when a socket closes after the room has spoken, and introduces the player again on the new one", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);
  sockets[0]?.drops();
  vi.advanceTimersByTime(250);
  sockets[1]?.opens();

  expect(handlers.onRefused).not.toHaveBeenCalled();
  expect(sockets).toHaveLength(2);
  expect(sockets[1]?.sent).toEqual([JSON.stringify({kind: "introduce", introduction: {displayName: "Kim"}})]);
});

it("waits longer between tries while the room cannot be reached", () => {
  connection.open(COMING_BACK, handlers);
  sockets[0]?.drops();
  vi.advanceTimersByTime(249);
  expect(sockets).toHaveLength(1);
  vi.advanceTimersByTime(1);
  expect(sockets).toHaveLength(2);

  sockets[1]?.drops();
  vi.advanceTimersByTime(499);
  expect(sockets).toHaveLength(2);
  vi.advanceTimersByTime(1);
  expect(sockets).toHaveLength(3);
});

it("never waits longer than a quarter of a minute", () => {
  connection.open(COMING_BACK, handlers);
  for (let attempt = 0; attempt < 8; attempt++) {
    sockets.at(-1)?.drops();
    vi.advanceTimersByTime(15_000);
  }

  expect(sockets.length).toBeGreaterThan(8);
});

it("treats a returning player's closed socket as a drop, not a missing room", () => {
  connection.open(COMING_BACK, handlers);
  sockets[0]?.drops();

  expect(handlers.onRefused).not.toHaveBeenCalled();
});

it("gives up on a room a returning player never reaches", () => {
  connection.open(COMING_BACK, handlers);
  for (let attempt = 0; attempt < 12; attempt++) {
    sockets.at(-1)?.drops();
    vi.advanceTimersByTime(15_000);
  }

  expect(handlers.onGaveUp).toHaveBeenCalledOnce();
});

it("waits the first wait again, not the longest, once the room has been heard from", () => {
  connection.open(COMING_BACK, handlers);
  for (let attempt = 0; attempt < 6; attempt++) {
    sockets.at(-1)?.drops();
    vi.advanceTimersByTime(15_000);
  }
  sockets.at(-1)?.opens();
  sockets.at(-1)?.says(WAITING);
  const tries = sockets.length;

  sockets.at(-1)?.drops();
  vi.advanceTimersByTime(250);

  expect(sockets).toHaveLength(tries + 1);
});

it("is not told of a refusal by a socket it has let go of", () => {
  const first = {
    onMessage: vi.fn(),
    onConnected: vi.fn(),
    onReconnecting: vi.fn(),
    onRefused: vi.fn(),
    onGaveUp: vi.fn(),
  };
  connection.open(FIRST_TRY, first);
  connection.open({...FIRST_TRY, code: "WXYZ2345"}, handlers);

  sockets[0]?.drops();

  expect(first.onRefused).not.toHaveBeenCalled();
  expect(handlers.onRefused).not.toHaveBeenCalled();
});

it("sends what the player does while the socket is up, and not while it is down", () => {
  connection.open(FIRST_TRY, handlers);
  connection.send({kind: "choose-setup", setup: "Left Elephant"});
  sockets[0]?.opens();
  sockets[0]?.sent.splice(0);
  connection.send({kind: "choose-setup", setup: "Left Elephant"});

  expect(sockets[0]?.sent).toEqual([JSON.stringify({kind: "choose-setup", setup: "Left Elephant"})]);
});

it("lets go of a room, and does not hear from it or try to return to it", () => {
  connection.open(COMING_BACK, handlers);
  sockets[0]?.opens();
  connection.close();
  sockets[0]?.says(WAITING);
  sockets[0]?.drops();
  vi.advanceTimersByTime(60_000);

  expect(handlers.onMessage).not.toHaveBeenCalled();
  expect(sockets).toHaveLength(1);
});

it("ends the room it had when it is opened at another", () => {
  connection.open(FIRST_TRY, handlers);
  connection.open({...FIRST_TRY, code: "WXYZ2345"}, handlers);
  sockets[0]?.says(WAITING);

  expect(handlers.onMessage).not.toHaveBeenCalled();
  expect(sockets[1]?.url).toContain("WXYZ2345");
});

it("takes a room that says it is not there at its word on a first try, and does not try again", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.drops(4404);
  vi.advanceTimersByTime(60_000);

  expect(handlers.onRefused).toHaveBeenCalledOnce();
  expect(sockets).toHaveLength(1);
});

it("gives up at once on a room that says it is not there, for a player returning to it", () => {
  connection.open(COMING_BACK, handlers);
  sockets[0]?.drops(4404);
  vi.advanceTimersByTime(60_000);

  expect(handlers.onGaveUp).toHaveBeenCalledOnce();
  expect(handlers.onRefused).not.toHaveBeenCalled();
  expect(sockets).toHaveLength(1);
});

it("gives up at once on a room let go while the player was in it, and does not take it for a drop", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);
  sockets[0]?.drops(4404);
  vi.advanceTimersByTime(60_000);

  expect(handlers.onGaveUp).toHaveBeenCalledOnce();
  expect(sockets).toHaveLength(1);
});

it("says it is connected when the room first speaks, and not again for each word", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);
  sockets[0]?.says(WAITING);

  expect(handlers.onConnected).toHaveBeenCalledOnce();
});

it("says it is reconnecting on a drop, and connected again when the room speaks", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);
  sockets[0]?.drops();

  expect(handlers.onReconnecting).toHaveBeenCalledOnce();

  vi.advanceTimersByTime(15_000);
  sockets[1]?.opens();
  sockets[1]?.says(WAITING);

  expect(handlers.onConnected).toHaveBeenCalledTimes(2);
});

it("introduces the player in the look they wear now when it comes back after a drop", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);
  connection.wear({boardKey: "new"});
  sockets[0]?.drops();
  vi.advanceTimersByTime(15_000);
  sockets[1]?.opens();

  expect(sockets[0]?.sent.at(-1)).toEqual(JSON.stringify({kind: "update-look", look: {boardKey: "new"}}));
  expect(sockets[1]?.sent).toEqual([
    JSON.stringify({kind: "introduce", introduction: {displayName: "Kim", boardKey: "new"}}),
  ]);
});

it("tries the room again at once when told to, rather than waiting out the pause after a drop", () => {
  connection.open(COMING_BACK, handlers);
  sockets[0]?.drops();
  vi.advanceTimersByTime(250);
  sockets[1]?.drops();

  connection.retryNow();

  expect(sockets).toHaveLength(3);
});

it("does not try again a second time when the pause it cut short runs out", () => {
  connection.open(COMING_BACK, handlers);
  sockets[0]?.drops();

  connection.retryNow();
  vi.advanceTimersByTime(15_000);

  expect(sockets).toHaveLength(2);
});

it("leaves a socket that is up alone when told to try again", () => {
  connection.open(FIRST_TRY, handlers);
  sockets[0]?.opens();
  sockets[0]?.says(WAITING);

  connection.retryNow();

  expect(sockets).toHaveLength(1);
});
