import {expect, it} from "vitest";
import {inDevelopmentFrom} from "@src/unreleased/address-flag/InDevelopmentFrom";

it("is off for a visitor to a deployed build with nothing in the address", () => {
  expect(inDevelopmentFrom("", false)).toBe(false);
});

it("is on at the development server with nothing in the address", () => {
  expect(inDevelopmentFrom("", true)).toBe(true);
});

it("is switched on by the address on a deployed build", () => {
  expect(inDevelopmentFrom("?IN_DEVELOPMENT=true", false)).toBe(true);
});

it("is switched off by the address at the development server", () => {
  expect(inDevelopmentFrom("?IN_DEVELOPMENT=false", true)).toBe(false);
});

it("finds the flag among other things in the address", () => {
  expect(inDevelopmentFrom("?join=ABCD&IN_DEVELOPMENT=true", false)).toBe(true);
});

it("takes anything else as saying nothing", () => {
  expect(inDevelopmentFrom("?IN_DEVELOPMENT=1", false)).toBe(false);
  expect(inDevelopmentFrom("?in_development=true", false)).toBe(false);
  expect(inDevelopmentFrom("?IN_DEVELOPMENT=1", true)).toBe(true);
});
