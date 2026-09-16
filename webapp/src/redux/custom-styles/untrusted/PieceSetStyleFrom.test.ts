import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import {expect, it} from "vitest";
import {pieceSetStyleFrom} from "@src/redux/custom-styles/untrusted/PieceSetStyleFrom";

const piece: PieceStyle = {
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

const set: PieceSetStyle = {
  name: "Mine",
  sides: {han: piece, cho: piece},
  pieces: {"han-general": {...piece, size: 0.94}},
};

const DRAWING = "M10 10 L90 90 Z";

it("accepts a piece set exactly as it was written", () => {
  expect(pieceSetStyleFrom(set)).toEqual({kind: "accepted", value: set});
});

it("accepts drawn pieces as well as written ones", () => {
  const drawn: PieceStyle = {
    ...piece,
    glyph: {
      kind: "pictograph",
      pictographs: {
        general: DRAWING,
        guard: DRAWING,
        horse: DRAWING,
        elephant: DRAWING,
        chariot: DRAWING,
        cannon: DRAWING,
        soldier: DRAWING,
      },
      colour: "#ffffff",
      scale: 0.72,
    },
  };

  expect(pieceSetStyleFrom({name: "Drawn", sides: {han: drawn, cho: drawn}})).toEqual({
    kind: "accepted",
    value: {name: "Drawn", sides: {han: drawn, cho: drawn}},
  });
});

it("refuses a drawing that is anything but path data", () => {
  const glyph = {kind: "pictograph", colour: "#fff", scale: 0.7, pictographs: {general: 'M0 0" onload="alert(1)'}};

  expect(pieceSetStyleFrom({...set, sides: {han: {...piece, glyph}, cho: piece}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.sides.han.glyph.pictographs.general"),
  });
});

it("refuses a piece that does not exist", () => {
  for (const key of ["han-king", "han-general-extra"]) {
    expect(pieceSetStyleFrom({...set, pieces: {[key]: piece}})).toEqual({
      kind: "refused",
      reason: expect.stringContaining(`style.pieces.${key}`),
    });
  }
});

it("refuses a body of a shape a piece cannot be drawn in", () => {
  expect(
    pieceSetStyleFrom({...set, sides: {han: piece, cho: {...piece, body: {...piece.body, shape: "star"}}}}),
  ).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.sides.cho.body.shape"),
  });
});

it("refuses a font stack that would load from elsewhere", () => {
  const glyph = {...piece.glyph, fontFamily: "url(https://example.com/font.woff2)"};

  expect(pieceSetStyleFrom({...set, sides: {han: {...piece, glyph}, cho: piece}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.sides.han.glyph.fontFamily"),
  });
});

it("refuses writing too long to fit on a piece", () => {
  const glyph = {
    ...piece.glyph,
    characters: {...(piece.glyph.kind === "character" && piece.glyph.characters), guard: "a guard of the palace"},
  };

  expect(pieceSetStyleFrom({...set, sides: {han: {...piece, glyph}, cho: piece}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.sides.han.glyph.characters.guard"),
  });
});

it("refuses a piece too small to see", () => {
  expect(pieceSetStyleFrom({...set, sides: {han: {...piece, size: 0}, cho: piece}})).toEqual({
    kind: "refused",
    reason: expect.stringContaining("style.sides.han.size"),
  });
});
