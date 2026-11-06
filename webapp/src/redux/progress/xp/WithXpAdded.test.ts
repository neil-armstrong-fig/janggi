import {expect, it} from "vitest";
import {withXpAdded} from "@src/redux/progress/xp/WithXpAdded";

it("adds what was earned", () => {
  expect(withXpAdded(640, 30)).toBe(670);
});

it("stops at the largest whole number that stays exact", () => {
  expect(withXpAdded(Number.MAX_SAFE_INTEGER - 1, 30)).toBe(Number.MAX_SAFE_INTEGER);
});
