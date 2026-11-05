import {expect, it} from "vitest";
import {formatWhenOnAfter} from "@src/redux/clock/time-controls/FormatWhenOnAfter";

it("becomes the format chosen", () => {
  expect(formatWhenOnAfter("10 min", "20 min")).toBe("20 min");
});

it("becomes Custom when a format is written out", () => {
  expect(formatWhenOnAfter("10 min", "Custom")).toBe("Custom");
});

it("stays as it was when the clock is turned off", () => {
  expect(formatWhenOnAfter("20 min", "Off")).toBe("20 min");
});
