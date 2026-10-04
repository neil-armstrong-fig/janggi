// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import type {AppStore} from "@src/redux/Store";
import {createFriendRoom} from "@src/redux/online/actions/entering/CreateFriendRoom";
import {createStore} from "@src/redux/Store";
import {friendRoom} from "@src/redux/online/FriendRoom";

vi.mock("@src/redux/online/FriendRoom", () => ({friendRoom: {open: vi.fn(), close: vi.fn(), send: vi.fn()}}));

const INTRODUCTION = {displayName: "Kim"};
let store: AppStore;

beforeEach(() => {
  store = createStore(undefined);
  vi.mocked(friendRoom.open).mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function serverAnswers(status: number, body: unknown): ReturnType<typeof vi.fn> {
  const fetcher = vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), {status})));
  vi.stubGlobal("fetch", fetcher);

  return fetcher;
}

it("asks for a room on the chosen side, kept for the days chosen, and sits down in it", async () => {
  const fetcher = serverAnswers(201, {code: "ABCD2345"});

  await store.dispatch(createFriendRoom({side: "han", awayDays: 7}, INTRODUCTION));

  expect(JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body))).toEqual({side: "han", awayDays: 7});
  expect(friendRoom.open).toHaveBeenCalledWith(
    {code: "ABCD2345", introduction: INTRODUCTION, returning: false},
    expect.anything(),
  );
  expect(store.getState().friend.code).toBe("ABCD2345");
});

it("goes back to the room a host already has, whose code the server gives, as a returning player", async () => {
  serverAnswers(409, {code: "WXYZ2345"});

  await store.dispatch(createFriendRoom({side: "han", awayDays: 7}, INTRODUCTION));

  expect(friendRoom.open).toHaveBeenCalledWith(
    {code: "WXYZ2345", introduction: INTRODUCTION, returning: true},
    expect.anything(),
  );
});

it.each([[503], [429], [502], [400]])(
  "says only that a code could not be made when the server answers %i",
  async status => {
    serverAnswers(status, {});

    await store.dispatch(createFriendRoom({side: "han", awayDays: 7}, INTRODUCTION));

    expect(store.getState().friend).toMatchObject({createFailed: true, code: undefined});
    expect(friendRoom.open).not.toHaveBeenCalled();
  },
);

it("says so, in the same way, when the server cannot be reached at all", async () => {
  vi.stubGlobal("fetch", () => Promise.reject(new TypeError("offline")));

  await store.dispatch(createFriendRoom({side: "han", awayDays: 7}, INTRODUCTION));

  expect(store.getState().friend.createFailed).toBe(true);
});

it("does not take a code the server sent that is not one", async () => {
  serverAnswers(201, {code: "nope"});

  await store.dispatch(createFriendRoom({side: "han", awayDays: 7}, INTRODUCTION));

  expect(store.getState().friend.createFailed).toBe(true);
});
