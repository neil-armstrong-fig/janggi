import {boardTargetName} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/board-target/BoardTargetName";
import {expect, it} from "vitest";

it("says the default is every point", () => {
  expect(boardTargetName({kind: "default"})).toBe("Every point");
});

it("names a point by where it is", () => {
  expect(boardTargetName({kind: "point", position: {file: 5, rank: 2}})).toBe("Point f5r2");
});
