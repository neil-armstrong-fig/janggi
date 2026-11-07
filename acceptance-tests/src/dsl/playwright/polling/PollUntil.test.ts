import {expect, it, vi} from "vitest";
import {pollUntil} from "@src/dsl/playwright/polling/PollUntil";

it("lets a page error reach the DSL immediately without retrying the read", async () => {
  const error = new Error("The page has closed");
  const ask = vi.fn<() => Promise<boolean>>().mockRejectedValue(error);

  await expect(pollUntil(ask, 100)).rejects.toBe(error);
  expect(ask).toHaveBeenCalledTimes(1);
});

it("answers false when the observation window expires", async () => {
  await expect(pollUntil(async () => false, 1)).resolves.toBe(false);
});

it("answers true once the observed condition holds", async () => {
  await expect(pollUntil(async () => true, 100)).resolves.toBe(true);
});
