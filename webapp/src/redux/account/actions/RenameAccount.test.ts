// @vitest-environment jsdom
import "@src/testing/SetupDomTest";
import {afterEach, expect, it, vi} from "vitest";
import {createStore} from "@src/redux/Store";
import type {AppStore} from "@src/redux/Store";
import {renameAccount} from "@src/redux/account/actions/RenameAccount";
import {signedIn} from "@src/redux/account/AccountSlice";

interface Sent {
  readonly method: string;
  readonly body: unknown;
}

let sent: Sent[] = [];

afterEach(() => {
  sent = [];
});

function signedInAs(name: string, answer: () => Promise<Response>): AppStore {
  vi.stubGlobal("fetch", (_url: string, init?: RequestInit) => {
    sent.push({
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
    });

    return answer();
  });

  const store = createStore(undefined);
  store.dispatch(signedIn(name));

  return store;
}

it("asks the server to change the name, tidied, and then shows what the server answered", async () => {
  const store = signedInAs("Kim Yu-sin", () => Promise.resolve(Response.json({displayName: "Admiral Yi"})));

  const result = await store.dispatch(renameAccount("  Admiral   Yi "));

  expect(sent).toEqual([{method: "PATCH", body: {displayName: "Admiral Yi"}}]);
  expect(result.accepted).toBe(true);
  expect(store.getState().account.displayName).toBe("Admiral Yi");
});

it("refuses a name that cannot be one without asking the server, and says why", async () => {
  const store = signedInAs("Kim Yu-sin", () => Promise.resolve(Response.json({})));

  const result = await store.dispatch(renameAccount("a".repeat(99)));

  expect(sent).toEqual([]);
  expect(result).toEqual({accepted: false, message: expect.stringContaining("1 to 24 characters")});
  expect(store.getState().account.displayName).toBe("Kim Yu-sin");
});

it("keeps the name it had when the server refuses the new one", async () => {
  const store = signedInAs("Kim Yu-sin", () => Promise.resolve(new Response(undefined, {status: 400})));

  const result = await store.dispatch(renameAccount("Admiral Yi"));

  expect(result).toEqual({accepted: false, message: expect.stringContaining("not allowed")});
  expect(store.getState().account.displayName).toBe("Kim Yu-sin");
});

it("shows the name that was asked for where the server's answer does not say what it kept", async () => {
  const store = signedInAs("Kim Yu-sin", () => Promise.resolve(Response.json({})));

  await store.dispatch(renameAccount("Admiral Yi"));

  expect(store.getState().account.displayName).toBe("Admiral Yi");
});

it("keeps the name it had, and says so, when the server cannot be reached", async () => {
  const store = signedInAs("Kim Yu-sin", () => Promise.reject(new TypeError("offline")));

  const result = await store.dispatch(renameAccount("Admiral Yi"));

  expect(result).toEqual({accepted: false, message: expect.stringContaining("Could not change")});
  expect(store.getState().account.displayName).toBe("Kim Yu-sin");
});

it("keeps the name it had when the server fails", async () => {
  const store = signedInAs("Kim Yu-sin", () => Promise.resolve(new Response(undefined, {status: 503})));

  expect((await store.dispatch(renameAccount("Admiral Yi"))).accepted).toBe(false);
  expect(store.getState().account.displayName).toBe("Kim Yu-sin");
});
