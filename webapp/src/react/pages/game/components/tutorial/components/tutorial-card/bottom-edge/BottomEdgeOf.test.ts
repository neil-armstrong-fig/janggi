import {expect, it} from "vitest";
import {bottomEdgeOf} from "@src/react/pages/game/components/tutorial/components/tutorial-card/bottom-edge/BottomEdgeOf";

it("stands above the row of controls, so Settings is never under it", () => {
  expect(bottomEdgeOf({controlsClearance: 60, viewportHeight: 844})).toBe(772);
});
