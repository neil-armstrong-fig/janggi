import {expect, it, vi} from "vitest";
import {isAllowed} from "@src/router/http/routes/rate-limit/IsAllowed";

function limiter(limit: () => Promise<{success: boolean}>): RateLimit {
  return {limit} as unknown as RateLimit;
}

it("allows a request the binding says is within the limit", async () => {
  expect(
    await isAllowed(
      limiter(() => Promise.resolve({success: true})),
      "key",
    ),
  ).toBe(true);
});

it("refuses one the binding says is over it", async () => {
  expect(
    await isAllowed(
      limiter(() => Promise.resolve({success: false})),
      "key",
    ),
  ).toBe(false);
});

it("asks about the key it was given", async () => {
  const limit = vi.fn(() => Promise.resolve({success: true}));

  await isAllowed(limiter(limit), "203.0.113.7");

  expect(limit).toHaveBeenCalledWith({key: "203.0.113.7"});
});

it("lets the request through when the binding fails", async () => {
  expect(
    await isAllowed(
      limiter(() => Promise.reject(new Error("down"))),
      "key",
    ),
  ).toBe(true);
});
