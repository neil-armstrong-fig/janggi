import {expect, it} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {StampedStyle} from "@src/redux/account/data/types/StampedStyle";
import type {SyncedStyles} from "@src/redux/account/data/types/SyncedStyles";
import {mergedStyles} from "@src/redux/account/merging/merged-styles/MergedStyles";

function board(name: string, surface = "#ffffff"): BoardStyle {
  return {
    name,
    ...DEFAULT_BOARD_MARKS,
    surface,
    defaultCell: {stroke: "#000000", strokeWidth: 1},
    lastMove: {wash: "rgba(0, 0, 0, 0.2)", brackets: "#000000"},
  };
}

const stamped = (id: string, at: number, style: BoardStyle): StampedStyle<BoardStyle> => ({id, at, style});
const holding = (boards: StampedStyle<BoardStyle>[], deleted: SyncedStyles["deleted"] = []): SyncedStyles => ({
  boards,
  pieceSets: [],
  deleted,
});
const names = (styles: SyncedStyles): string[] => styles.boards.map(entry => entry.style.name);

it("keeps a style only one device has", () => {
  const merged = mergedStyles(holding([stamped("a", 1, board("Mine"))]), holding([stamped("b", 1, board("Theirs"))]));

  expect(names(merged)).toEqual(["Mine", "Theirs"]);
});

it("keeps the more recently changed version of a style both have", () => {
  const merged = mergedStyles(
    holding([stamped("a", 1, board("Mine", "#111111"))]),
    holding([stamped("a", 2, board("Mine", "#222222"))]),
  );

  expect(merged.boards).toEqual([stamped("a", 2, board("Mine", "#222222"))]);
});

it("drops a style the other device deleted after it was last changed", () => {
  const merged = mergedStyles(
    holding([stamped("a", 1, board("Mine"))]),
    holding([], [{kind: "Board", id: "a", at: 5}]),
  );

  expect(merged.boards).toEqual([]);
});

it("keeps a style that was changed after the other device deleted it", () => {
  const merged = mergedStyles(
    holding([stamped("a", 9, board("Mine"))]),
    holding([], [{kind: "Board", id: "a", at: 5}]),
  );

  expect(names(merged)).toEqual(["Mine"]);
});

it("keeps a style rather than lose it when its change and its deletion tie", () => {
  const merged = mergedStyles(
    holding([stamped("a", 5, board("Mine"))]),
    holding([], [{kind: "Board", id: "a", at: 5}]),
  );

  expect(names(merged)).toEqual(["Mine"]);
});

it("remembers every deletion, so a third device that still holds the style cannot bring it back", () => {
  const merged = mergedStyles(
    holding([], [{kind: "Board", id: "a", at: 5}]),
    holding([], [{kind: "Board", id: "b", at: 6}]),
  );

  expect(merged.deleted.map(deletion => deletion.id).sort()).toEqual(["a", "b"]);
});

it("keeps the latest deletion of one style where both devices deleted it", () => {
  const merged = mergedStyles(
    holding([], [{kind: "Board", id: "a", at: 5}]),
    holding([], [{kind: "Board", id: "a", at: 8}]),
  );

  expect(merged.deleted).toEqual([{kind: "Board", id: "a", at: 8}]);
});

it("does not let a deleted piece set take a board with the same id", () => {
  const merged = mergedStyles(
    holding([stamped("a", 1, board("Mine"))]),
    holding([], [{kind: "Pieces", id: "a", at: 5}]),
  );

  expect(names(merged)).toEqual(["Mine"]);
});

it("numbers the second of two different styles that were both called Mine", () => {
  const merged = mergedStyles(
    holding([stamped("a", 1, board("Mine", "#111111"))]),
    holding([stamped("b", 2, board("Mine", "#222222"))]),
  );

  expect(names(merged)).toEqual(["Mine", "Mine (2)"]);
  expect(merged.boards.map(entry => entry.id)).toEqual(["a", "b"]);
});

it("takes the same style under two ids as one, keeping the lower id", () => {
  const merged = mergedStyles(holding([stamped("b", 1, board("Mine"))]), holding([stamped("a", 3, board("Mine"))]));

  expect(merged.boards).toEqual([stamped("a", 3, board("Mine"))]);
});

it("does not take a built-in's name", () => {
  const merged = mergedStyles(holding([]), holding([stamped("a", 1, board("Classic"))]));

  expect(names(merged)).not.toContain("Classic");
});
