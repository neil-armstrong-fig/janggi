// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {beforeEach, expect, it, vi} from "vitest";
import type {AppStore} from "@src/redux/Store";
import {createStore} from "@src/redux/Store";
import {enterFriendRoom} from "@src/redux/slices/online/actions/entering/EnterFriendRoom";
import {friendRoom} from "@src/redux/slices/online/FriendRoom";
import {leaveTheTutorial} from "@src/redux/slices/tutorial/actions/LeaveTheTutorial";
import {startTheTutorial} from "@src/redux/slices/tutorial/actions/StartTheTutorial";

vi.mock("@src/redux/slices/online/FriendRoom", () => ({friendRoom: {open: vi.fn(), close: vi.fn(), send: vi.fn()}}));

const VISIT = {code: "ABCD2345", introduction: {displayName: "Kim"}, returning: false};
let store: AppStore;

beforeEach(() => {
  store = createStore(undefined);
  vi.mocked(friendRoom.open).mockClear();
});

it("goes into the room straight away outside the tutorial", () => {
  store.dispatch(enterFriendRoom(VISIT));

  expect(friendRoom.open).toHaveBeenCalledWith(VISIT, expect.anything());
});

it("holds a room back while the tutorial has the board, saying so, and leaves the tutorial where it is", () => {
  store.dispatch(startTheTutorial());
  store.dispatch(enterFriendRoom(VISIT));

  expect(friendRoom.open).not.toHaveBeenCalled();
  expect(store.getState().friend.code).toBeUndefined();
  expect(store.getState().tutorial.parked).toBeDefined();
  expect(store.getState().toast.message).toBeDefined();
});

it("goes into the room held back once the tutorial is left", () => {
  store.dispatch(startTheTutorial());
  store.dispatch(enterFriendRoom(VISIT));
  store.dispatch(leaveTheTutorial());

  expect(friendRoom.open).toHaveBeenCalledWith(VISIT, expect.anything());
  expect(store.getState().friend.code).toBe("ABCD2345");
});

it("goes into a room held back only once", () => {
  store.dispatch(startTheTutorial());
  store.dispatch(enterFriendRoom(VISIT));
  store.dispatch(leaveTheTutorial());
  store.dispatch(startTheTutorial());
  store.dispatch(leaveTheTutorial());

  expect(friendRoom.open).toHaveBeenCalledTimes(1);
});
