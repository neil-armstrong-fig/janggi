import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import {JANGGI_PICTOGRAPHS} from "@src/react/pages/game/components/board/piece-styles/builtin/modern/marks/JanggiPictographs";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import {resolvePieceStyle} from "@src/react/pages/game/components/board/components/piece/utils/ResolvePieceStyle";
import {expect, it} from "vitest";

const anyPiece: PieceStyle = {
  body: {shape: "disc", fill: "white", stroke: "black", strokeWidth: 1},
  glyph: {kind: "pictograph", pictographs: JANGGI_PICTOGRAPHS, colour: "black", scale: 0.7},
  size: 0.8,
};

const style: PieceSetStyle = {
  name: "Test",
  handling: DEFAULT_PIECE_HANDLING,
  sides: {han: anyPiece, cho: {...anyPiece, size: 0.5}},
  pieces: {"han-general": {...anyPiece, size: 1}},
};

it("uses the side's own style where a piece has no override", () => {
  expect(resolvePieceStyle(style, {side: "han", type: "horse"})).toBe(style.sides.han);
});

it("prefers the override for a piece that has one", () => {
  expect(resolvePieceStyle(style, {side: "han", type: "general"})).toEqual({...anyPiece, size: 1});
});

it("does not let one side's override reach the other side's piece of the same type", () => {
  expect(resolvePieceStyle(style, {side: "cho", type: "general"})).toBe(style.sides.cho);
});

it("falls back to the side when a set declares no overrides at all", () => {
  const barePieceSetStyle: PieceSetStyle = {...style, name: "Bare", pieces: undefined};

  expect(resolvePieceStyle(barePieceSetStyle, {side: "han", type: "general"})).toBe(barePieceSetStyle.sides.han);
});
