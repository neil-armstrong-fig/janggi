import {expect, it} from "vitest";
import {eloChange} from "@src/react/pages/game/components/status/components/board-overlay/components/result-banner/elo-change/EloChange";

it("shows a gain with a plus sign", () => {
  expect(eloChange(24)).toBe("+24");
});

it("shows a loss with a minus sign", () => {
  expect(eloChange(-24)).toBe("−24");
});

it("shows a zero change without a sign", () => {
  expect(eloChange(0)).toBe("0");
});
