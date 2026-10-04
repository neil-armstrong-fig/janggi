// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {beforeEach, expect, it, vi} from "vitest";
import type {AppStore} from "@src/redux/Store";
import {actInGame} from "@src/redux/online/acting/ActInGame";
import {createStore} from "@src/redux/Store";
import {friendConnecting, friendStarted, friendWaiting} from "@src/redux/online/FriendSlice";
import {friendRoom} from "@src/redux/online/FriendRoom";
import {moved} from "@src/redux/game/GameSlice";

vi.mock("@src/redux/online/FriendRoom", () => ({friendRoom: {open: vi.fn(), close: vi.fn(), send: vi.fn()}}));

const SOLDIER_FORWARD = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}} as const;
let store: AppStore;

beforeEach(() => {
  store = createStore(undefined);
  vi.mocked(friendRoom.send).mockClear();
});

it("does the game's own action at once, where there is no friend", () => {
  store.dispatch(actInGame({kind: "move", move: SOLDIER_FORWARD}, moved(SOLDIER_FORWARD)));

  expect(store.getState().game.played.present.sideToMove).toBe("han");
  expect(friendRoom.send).not.toHaveBeenCalled();
});

it("does the game's own action at once, while the room waits for a friend", () => {
  store.dispatch(friendConnecting("ABCD2345"));
  store.dispatch(friendWaiting());
  const before = store.getState().game;

  store.dispatch(actInGame({kind: "move", move: SOLDIER_FORWARD}, moved(SOLDIER_FORWARD)));

  expect(store.getState().game).not.toBe(before);
  expect(friendRoom.send).not.toHaveBeenCalled();
});

it("only sends it to the room, and changes nothing here, in a game with a friend", () => {
  store.dispatch(friendConnecting("ABCD2345"));
  store.dispatch(friendStarted());
  const before = store.getState().game;

  store.dispatch(actInGame({kind: "move", move: SOLDIER_FORWARD}, moved(SOLDIER_FORWARD)));

  expect(store.getState().game).toBe(before);
  expect(friendRoom.send).toHaveBeenCalledWith({kind: "act", action: {kind: "move", move: SOLDIER_FORWARD}});
});
