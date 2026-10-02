import {expect, it} from "vitest";
import {displayNameFrom} from "@src/redux/account/server/DisplayNameFrom";

it("reads the name the server gives", () => {
  expect(displayNameFrom({displayName: "Kim Yu-sin"})).toBe("Kim Yu-sin");
});

it("tidies it as a name is tidied", () => {
  expect(displayNameFrom({displayName: "  Kim   Yu-sin "})).toBe("Kim Yu-sin");
});

it("reads nothing from an answer with no name, or one that is not a name", () => {
  expect(displayNameFrom({})).toBeUndefined();
  expect(displayNameFrom({displayName: 7})).toBeUndefined();
  expect(displayNameFrom({displayName: "a\nb"})).toBeUndefined();
  expect(displayNameFrom(undefined)).toBeUndefined();
});
