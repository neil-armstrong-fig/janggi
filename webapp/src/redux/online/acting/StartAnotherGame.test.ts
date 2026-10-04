// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {beforeEach, expect, it, vi} from "vitest";
import type {AppStore} from "@src/redux/Store";
import {createStore} from "@src/redux/Store";
import {firstGame} from "@src/redux/game/first-game/FirstGame";
import {friendConnecting, friendStarted, localGameStashed} from "@src/redux/online/FriendSlice";
import {moved} from "@src/redux/game/GameSlice";
import {startAnotherGame} from "@src/redux/online/acting/StartAnotherGame";

vi.mock("@src/redux/online/FriendRoom", () => ({friendRoom: {open: vi.fn(), close: vi.fn(), send: vi.fn()}}));

let store: AppStore;

beforeEach(() => {
  store = createStore(undefined);
});

it("deals a fresh game, where the game was not with a friend", () => {
  store.dispatch(moved({from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}));

  store.dispatch(startAnotherGame());

  expect(store.getState().game.played.past).toHaveLength(0);
});

it("leaves the room, and puts the player's own game back, where it was", () => {
  const own = firstGame();
  store.dispatch(friendConnecting("ABCD2345"));
  store.dispatch(friendStarted());
  store.dispatch(localGameStashed(own));

  store.dispatch(startAnotherGame());

  expect(store.getState().friend.code).toBeUndefined();
  expect(store.getState().game).toBe(own);
});
