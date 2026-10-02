import {
  accountReducer,
  displayNameChanged,
  signInStarted,
  signedIn,
  signedOut,
  syncFailed,
  syncPending,
  syncSucceeded,
  syncTooLarge,
} from "@src/redux/account/AccountSlice";
import {expect, it} from "vitest";
import type {AccountSliceState} from "@src/redux/account/types/AccountSliceState";

const SIGNED_OUT: AccountSliceState = {status: "signed-out", sync: "idle", displayName: undefined};
const SIGNED_IN: AccountSliceState = {status: "signed-in", sync: "synced", displayName: "Kim Yu-sin"};

it("starts signed out, with nothing to sync and no name", () => {
  expect(accountReducer(undefined, {type: "test/initialised"})).toEqual(SIGNED_OUT);
});

it("notes that signing in was asked for", () => {
  expect(accountReducer(SIGNED_OUT, signInStarted()).status).toBe("signing-in");
});

it("is signed in, with nothing synced yet and the name the server gave, once it says who the player is", () => {
  expect(accountReducer({...SIGNED_OUT, status: "signing-in"}, signedIn("Kim Yu-sin"))).toEqual({
    status: "signed-in",
    sync: "idle",
    displayName: "Kim Yu-sin",
  });
});

it("is signed in with no name where the server gave none", () => {
  expect(accountReducer(SIGNED_OUT, signedIn()).displayName).toBeUndefined();
});

it("changes the name and nothing else", () => {
  expect(accountReducer(SIGNED_IN, displayNameChanged("Admiral Yi"))).toEqual({
    ...SIGNED_IN,
    displayName: "Admiral Yi",
  });
});

it("says syncing is paused when it fails, and synced when it next works", () => {
  const paused = accountReducer(SIGNED_IN, syncFailed());

  expect(paused.sync).toBe("paused");
  expect(accountReducer(paused, syncSucceeded()).sync).toBe("synced");
});

it("says the data is too big to sync, which trying again does not change", () => {
  expect(accountReducer(SIGNED_IN, syncTooLarge()).sync).toBe("too-large");
});

it("says syncing is under way once something has changed that is not sent yet", () => {
  expect(accountReducer(SIGNED_IN, syncPending()).sync).toBe("idle");
});

it("stops syncing and forgets the name on signing out", () => {
  expect(accountReducer(SIGNED_IN, signedOut())).toEqual(SIGNED_OUT);
});
