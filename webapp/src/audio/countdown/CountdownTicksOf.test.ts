import {expect, it} from "vitest";
import {countdownTicksOf} from "@src/audio/countdown/CountdownTicksOf";

const ENDS_AT = 100_000;

it("ticks once a second for the last ten seconds, the first ten seconds out", () => {
  const ticks = countdownTicksOf(ENDS_AT);

  expect(ticks.map(({at}) => at)).toEqual([
    90_000, 91_000, 92_000, 93_000, 94_000, 95_000, 96_000, 97_000, 98_000, 99_000,
  ]);
});

it("leaves the deadline itself to the sound of its own", () => {
  expect(countdownTicksOf(ENDS_AT).at(-1)?.at).toBeLessThan(ENDS_AT);
});

it("strikes each tick harder than the last, the last at full weight", () => {
  const weights = countdownTicksOf(ENDS_AT).map(({weight}) => weight);

  weights.slice(1).forEach((weight, index) => {
    expect(weight).toBeGreaterThan(weights[index] ?? 1);
  });
  expect(weights.at(-1)).toBe(1);
});
