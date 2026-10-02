// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {ACCOUNT_STORAGE_KEY} from "@src/redux/account/storage/AccountStorageKey";
import {createStore} from "@src/redux/Store";
import type {AppStore} from "@src/redux/Store";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/** A device that last closed as `status`, opening against a server that answers each call with `answer`. */
async function openedAs(status: string, answer: (path: string) => Promise<Response>): Promise<AppStore> {
  const storage = {
    getItem: (key: string) => (key === ACCOUNT_STORAGE_KEY ? JSON.stringify({status, sync: "idle"}) : null),
    setItem: () => undefined,
  } as unknown as Storage;
  vi.stubGlobal("fetch", (url: string) => answer(new URL(url).pathname));

  const store = createStore(storage);
  await vi.runAllTimersAsync();

  return store;
}

const dataless = (path: string): Promise<Response> =>
  Promise.resolve(
    path === "/api/me" ? Response.json({displayName: "Kim Yu-sin"}) : Response.json({version: 0, blob: null}),
  );

it("is signed in once the server says who the player is", async () => {
  const store = await openedAs("signing-in", dataless);

  expect(store.getState().account.status).toBe("signed-in");
});

it("is called what the server calls the player", async () => {
  const store = await openedAs("signing-in", dataless);

  expect(store.getState().account.displayName).toBe("Kim Yu-sin");
});

it("carries on with no name where the server's answer has none", async () => {
  const store = await openedAs("signing-in", path =>
    Promise.resolve(path === "/api/me" ? Response.json({}) : Response.json({version: 0, blob: null})),
  );

  expect(store.getState().account.status).toBe("signed-in");
  expect(store.getState().account.displayName).toBeUndefined();
});

it("syncs straight after it is signed in", async () => {
  const store = await openedAs("signed-in", dataless);

  expect(store.getState().account.sync).toBe("synced");
});

it("is signed out where the server says nobody is signed in", async () => {
  const store = await openedAs("signed-in", () => Promise.resolve(new Response(null, {status: 401})));

  expect(store.getState().account.status).toBe("signed-out");
});

it("keeps a player who was signed in signed in when the server cannot be reached, with syncing paused", async () => {
  const store = await openedAs("signed-in", () => Promise.reject(new TypeError("offline")));

  expect(store.getState().account).toEqual({status: "signed-in", sync: "paused"});
});

it("returns a sign-in that was never finished to signed out when the server cannot be reached", async () => {
  const store = await openedAs("signing-in", () => Promise.reject(new TypeError("offline")));

  expect(store.getState().account.status).toBe("signed-out");
});

it("makes no call at all on a device that is signed out", async () => {
  const answer = vi.fn(dataless);

  await openedAs("signed-out", answer);

  expect(answer).not.toHaveBeenCalled();
});
