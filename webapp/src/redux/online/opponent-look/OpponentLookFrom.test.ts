import {expect, it} from "vitest";
import {DEFAULT_BOARD_MARKS} from "@src/styles/defaults/DefaultBoardMarks";
import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import type {BoardStyle} from "@src/styles/types/BoardStyle";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import {encodeKey} from "@janggi/shared/janggi/share-keys/EncodeKey";
import {opponentLookFrom} from "@src/redux/online/opponent-look/OpponentLookFrom";

const NEON: BoardStyle = {
  name: "Neon",
  ...DEFAULT_BOARD_MARKS,
  surface: "linear-gradient(160deg, #0b1220, #131c2e)",
  defaultCell: {stroke: "#2f6f8f", strokeWidth: 1, diagonalStroke: "#f472b6", diagonalStrokeWidth: 1.5},
  cells: {},
  lastMove: {wash: "rgba(56, 189, 248, 0.16)", brackets: "#38bdf8"},
};

const PIECE: PieceStyle = {
  body: {
    shape: "disc",
    fill: "#c0392b",
    stroke: "#8c261a",
    strokeWidth: 2,
    inlay: {inset: 0.14, stroke: "#e9b0a7", strokeWidth: 1.5},
  },
  glyph: {
    kind: "character",
    characters: {
      general: {han: "漢", cho: "楚"},
      guard: "士",
      horse: "馬",
      elephant: "象",
      chariot: "車",
      cannon: "包",
      soldier: {han: "兵", cho: "卒"},
    },
    colour: "#ffffff",
    scale: 0.52,
    fontFamily: "'Noto Sans KR', sans-serif",
    fontWeight: 700,
    slant: 10,
  },
  size: 0.86,
};

const HANJA: PieceSetStyle = {
  name: "Hanja",
  handling: DEFAULT_PIECE_HANDLING,
  sides: {han: PIECE, cho: PIECE},
  pieces: {},
};

it("has only a name where the friend sent no keys", () => {
  expect(opponentLookFrom({displayName: "Yi"})).toEqual({displayName: "Yi"});
});

it("reads the board and the piece set the friend wears, checked", () => {
  const look = opponentLookFrom({
    displayName: "Yi",
    boardKey: encodeKey("board", NEON),
    piecesKey: encodeKey("pieces", HANJA),
  });

  expect(look.boardStyle?.name).toBe("Neon");
  expect(look.pieceSet?.name).toBe("Hanja");
});

it("leaves a part of the look out where its key is not one, and keeps the rest", () => {
  const look = opponentLookFrom({
    displayName: "Yi",
    boardKey: "janggi-board:!!!",
    piecesKey: encodeKey("pieces", HANJA),
  });

  expect(look).not.toHaveProperty("boardStyle");
  expect(look.pieceSet?.name).toBe("Hanja");
});

it("leaves a part out where its key decodes to something that is not a style", () => {
  const look = opponentLookFrom({displayName: "Yi", boardKey: encodeKey("board", {name: "Evil", cells: "<script>"})});

  expect(look.boardStyle).toBeUndefined();
});

it("does not take a piece set's key for a board's", () => {
  expect(opponentLookFrom({displayName: "Yi", boardKey: encodeKey("pieces", HANJA)}).boardStyle).toBeUndefined();
});
