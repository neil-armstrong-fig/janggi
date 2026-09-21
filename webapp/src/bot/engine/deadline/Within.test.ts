import {afterEach, beforeEach, expect, it, vi} from "vitest";
import {within} from "@src/bot/engine/deadline/Within";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("gives the value of a promise that settles in time", async () => {
  const answer = within(Promise.resolve("bestmove"), 1_000, "too slow");

  await expect(answer).resolves.toBe("bestmove");
});

it("gives the rejection of a promise that fails in time", async () => {
  const answer = within(Promise.reject(new Error("no engine")), 1_000, "too slow");

  await expect(answer).rejects.toThrow("no engine");
});

it("rejects with the message once the time has passed without an answer", async () => {
  const answer = within(new Promise<string>(() => undefined), 1_000, "too slow");
  const outcome = expect(answer).rejects.toThrow("too slow");

  await vi.advanceTimersByTimeAsync(1_000);

  await outcome;
});

it("does not reject while there is still time left", async () => {
  let settled = false;
  const answer = within(new Promise<string>(() => undefined), 1_000, "too slow");
  answer.then(
    () => (settled = true),
    () => (settled = true),
  );

  await vi.advanceTimersByTimeAsync(999);

  expect(settled).toBe(false);
});

it("leaves no timer running once the promise has settled", async () => {
  await within(Promise.resolve("bestmove"), 1_000, "too slow");

  expect(vi.getTimerCount()).toBe(0);
});
