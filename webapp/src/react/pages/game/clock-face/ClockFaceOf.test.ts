import {clockFaceOf} from "@src/react/pages/game/clock-face/ClockFaceOf";
import {expect, it} from "vitest";

it("writes seconds as minutes and seconds", () => {
  expect(clockFaceOf(272)).toBe("4:32");
});

it("pads the seconds to two figures", () => {
  expect(clockFaceOf(65)).toBe("1:05");
});

it("reads 0:00 for no time at all", () => {
  expect(clockFaceOf(0)).toBe("0:00");
});

it("keeps counting minutes past the hour", () => {
  expect(clockFaceOf(3600)).toBe("60:00");
});
