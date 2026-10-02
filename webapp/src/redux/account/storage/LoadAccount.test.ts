import {expect, it} from "vitest";
import {ACCOUNT_STORAGE_KEY} from "@src/redux/account/storage/AccountStorageKey";
import {loadAccount} from "@src/redux/account/storage/LoadAccount";

function storageHolding(value: string | undefined): Pick<Storage, "getItem"> {
  return {getItem: key => (key === ACCOUNT_STORAGE_KEY && value !== undefined ? value : null)};
}

it("is signed out on a device that has never kept anything", () => {
  expect(loadAccount(storageHolding(undefined))).toEqual({status: "signed-out", sync: "idle", displayName: undefined});
});

it("is signed out where there is no storage at all", () => {
  expect(loadAccount(undefined)).toEqual({status: "signed-out", sync: "idle", displayName: undefined});
});

it("comes back signed in, with nothing synced yet", () => {
  expect(loadAccount(storageHolding('{"status":"signed-in","sync":"paused"}'))).toEqual({
    status: "signed-in",
    sync: "idle",
  });
});

it("comes back to a sign-in that was under way", () => {
  expect(loadAccount(storageHolding('{"status":"signing-in","sync":"idle"}')).status).toBe("signing-in");
});

it("is signed out for a status the app does not have", () => {
  expect(loadAccount(storageHolding('{"status":"admin"}')).status).toBe("signed-out");
});

it("is signed out for what is not an object, or not JSON", () => {
  expect(loadAccount(storageHolding('"signed-in"')).status).toBe("signed-out");
  expect(loadAccount(storageHolding("{nope")).status).toBe("signed-out");
});

it("comes back with the name the player was called", () => {
  expect(loadAccount(storageHolding('{"status":"signed-in","displayName":"Admiral Yi"}')).displayName).toBe(
    "Admiral Yi",
  );
});

it("comes back with no name for one that is not a name, or that is too long", () => {
  expect(loadAccount(storageHolding('{"status":"signed-in","displayName":7}')).displayName).toBeUndefined();
  expect(
    loadAccount(storageHolding('{"status":"signed-in","displayName":"' + "a".repeat(99) + '"}')).displayName,
  ).toBeUndefined();
});

it("comes back with no name for a device that is signed out, whatever was kept", () => {
  expect(loadAccount(storageHolding('{"status":"signed-out","displayName":"Admiral Yi"}')).displayName).toBeUndefined();
});
