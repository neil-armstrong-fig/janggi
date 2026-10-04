import {expect, it} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import {decodeKey} from "@janggi/shared/janggi/share-keys/DecodeKey";
import {introductionFrom} from "@src/react/pages/game/hooks/use-introduction/utils/IntroductionFrom";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";

const BOARD: BoardStyle = {
  name: "Mine",
  ...DEFAULT_BOARD_MARKS,
  surface: "#123456",
  defaultCell: {stroke: "#fff", strokeWidth: 1, diagonalStroke: "#fff", diagonalStrokeWidth: 1},
  cells: {},
  lastMove: {wash: "#000", brackets: "#fff"},
};
const CHO_SET = {name: "Cho's", handling: DEFAULT_PIECE_HANDLING, sides: {}, pieces: {}} as unknown as PieceSetStyle;
const HAN_SET = {...CHO_SET, name: "Han's"};
const worn = {armyBoardStyles: {cho: BOARD, han: BOARD}, armyPieceSets: {cho: CHO_SET, han: HAN_SET}};

it("introduces a player by their name, with the board they wear and the set their Cho army is in", () => {
  const introduction = introductionFrom({displayName: "Kim", worn, sharesLook: true});

  expect(introduction.displayName).toBe("Kim");
  expect(decodeKey("board", introduction.boardKey ?? "")).toEqual(BOARD);
  expect(decodeKey("pieces", introduction.piecesKey ?? "")).toEqual(CHO_SET);
});

it("sends no look where the player has turned showing the opponent's look off", () => {
  expect(introductionFrom({displayName: "Kim", worn, sharesLook: false})).toEqual({displayName: "Kim"});
});

it("has a name for a player who has none", () => {
  expect(introductionFrom({displayName: undefined, worn, sharesLook: false})).toEqual({displayName: "Player"});
});

it("leaves out a key the other end could not read, rather than send it", () => {
  const huge = {...BOARD, surface: "x".repeat(70_000)};
  const introduction = introductionFrom({
    displayName: "Kim",
    worn: {...worn, armyBoardStyles: {cho: huge, han: huge}},
    sharesLook: true,
  });

  expect(introduction.boardKey).toBeUndefined();
  expect(introduction.piecesKey).toBeDefined();
});
