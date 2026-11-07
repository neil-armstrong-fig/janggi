import type {Locator} from "@playwright/test";
import {errors} from "@playwright/test";
import {expect, it, vi} from "vitest";
import {appearsWithin} from "@src/dsl/playwright/visibility/AppearsWithin";

it("returns false when the element does not appear before the timeout", async () => {
  const locator = {waitFor: vi.fn().mockRejectedValue(new errors.TimeoutError("not drawn"))} as unknown as Locator;
  await expect(appearsWithin(locator)).resolves.toBe(false);
});

it("preserves a page error instead of treating a broken page as an absent element", async () => {
  const error = new Error("The page was closed");
  const locator = {waitFor: vi.fn().mockRejectedValue(error)} as unknown as Locator;
  await expect(appearsWithin(locator)).rejects.toBe(error);
});

it("passes the observation window and attachment condition to Playwright", async () => {
  const waitFor = vi.fn().mockResolvedValue(undefined);
  const locator = {waitFor} as unknown as Locator;
  await expect(appearsWithin(locator, {state: "attached", timeout: 1500})).resolves.toBe(true);
  expect(waitFor).toHaveBeenCalledWith({state: "attached", timeout: 1500});
});
