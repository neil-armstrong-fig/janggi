import {classicStyle} from "@src/react/pages/game/components/board/cell-styles/builtin/ClassicStyle";
import {expect, it} from "vitest";
import {isCellOverridden} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/board-style-editor/cell-style/IsCellOverridden";

const board = {...classicStyle, cells: {f5r5: {stroke: "#00ff00", strokeWidth: 2}}};

it("is true of a point with a style of its own", () => {
  expect(isCellOverridden(board, {kind: "point", position: {file: 5, rank: 5}})).toBe(true);
});

it("is false of a point without one, and of every point at once", () => {
  expect(isCellOverridden(board, {kind: "point", position: {file: 1, rank: 1}})).toBe(false);
  expect(isCellOverridden(board, {kind: "default"})).toBe(false);
});
