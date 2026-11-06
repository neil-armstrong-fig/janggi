import {expect, it} from "vitest";
import {edgeOf} from "@src/react/pages/game/components/tutorial/edge/EdgeOf";

it("draws Han's side at the top and Cho's at the bottom", () => {
  expect(edgeOf("han")).toBe("top");
  expect(edgeOf("cho")).toBe("bottom");
});

it("names no edge for words about no side", () => {
  expect(edgeOf(undefined)).toBeUndefined();
});
