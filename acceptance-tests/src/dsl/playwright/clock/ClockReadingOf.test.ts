import type {Locator} from "@playwright/test";
import {expect, it, vi} from "vitest";
import {clockReadingOf} from "@src/dsl/playwright/clock/ClockReadingOf";

type ClockAttributes = Readonly<Record<string, string>>;

it("waits for a drawn clock and reads its numerical figures", async () => {
  const clock = clockWith({"data-seconds": "72", "data-periods": "3"});
  expect(await clockReadingOf(clock)).toEqual({seconds: 72, periods: 3});
  expect(clock.waitFor).toHaveBeenCalledWith({state: "visible"});
});

it("does not let missing figures masquerade as a clock that has reached zero", async () => {
  const clockReading = await clockReadingOf(clockWith({}));
  expect(clockReading.seconds).toBeNaN();
  expect(clockReading.periods).toBeNaN();
});

it("does not treat blank figures as numerical zero", async () => {
  const clockReading = await clockReadingOf(clockWith({"data-seconds": "", "data-periods": " "}));
  expect(clockReading.seconds).toBeNaN();
  expect(clockReading.periods).toBeNaN();
});

function clockWith(clockAttributes: ClockAttributes): Locator {
  return {
    waitFor: vi.fn().mockResolvedValue(undefined),
    getAttribute: async (name: string) => clockAttributes[name] ?? null,
  } as unknown as Locator;
}
