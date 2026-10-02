import {expect, it} from "vitest";
import {serverDataFrom} from "@src/redux/account/syncing/ServerDataFrom";

it("reads what the server sends for a player who has data", () => {
  expect(serverDataFrom({version: 3, blob: "janggi-save:abc"})).toEqual({version: 3, blob: "janggi-save:abc"});
});

it("reads a player who has none yet", () => {
  expect(serverDataFrom({version: 0, blob: null})).toEqual({version: 0, blob: null});
});

it("refuses anything else", () => {
  expect(serverDataFrom(undefined)).toBeUndefined();
  expect(serverDataFrom({version: "3", blob: null})).toBeUndefined();
  expect(serverDataFrom({version: 1, blob: 7})).toBeUndefined();
  expect(serverDataFrom({version: 1})).toBeUndefined();
});
