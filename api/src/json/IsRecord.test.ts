import {expect, it} from "vitest";
import {isRecord} from "@src/json/IsRecord";

it("is an object with keys", () => {
  expect(isRecord({})).toBe(true);
  expect(isRecord({a: 1})).toBe(true);
});

it.each([null, undefined, [], [1], "text", 5, true])("is not %j", value => {
  expect(isRecord(value)).toBe(false);
});
