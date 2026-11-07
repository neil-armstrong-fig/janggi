import {expect, it} from "vitest";
import {pointFromTestId} from "@src/dsl/playwright/board/PointFromTestId";

it("reads both single-digit and two-digit ranks", () => {
  expect(pointFromTestId("cell-f5r9")).toEqual({file: 5, rank: 9});
  expect(pointFromTestId("cell-f1r10")).toEqual({file: 1, rank: 10});
});

it.each([undefined, "piece", "cell-f5r9-extra", "cell-fxr9"])(
  "rejects %s instead of returning NaN coordinates",
  testId => {
    expect(() => pointFromTestId(testId)).toThrow("Expected a cell's test id");
  },
);
