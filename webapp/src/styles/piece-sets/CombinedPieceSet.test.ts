import {combinedPieceSet} from "@src/styles/piece-sets/CombinedPieceSet";
import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import {expect, it} from "vitest";
import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";

function piece(size: number): PieceStyle {
  return {
    body: {shape: "disc", fill: "#ffffff", stroke: "#000000", strokeWidth: 1},
    glyph: {
      kind: "character",
      characters: {general: "G", guard: "A", horse: "H", elephant: "E", chariot: "C", cannon: "N", soldier: "S"},
      colour: "#000000",
      scale: 0.5,
      fontFamily: "sans-serif",
      fontWeight: 400,
    },
    size,
  };
}

function set(name: string, size: number, shadow: string): PieceSetStyle {
  return {
    name,
    handling: {...DEFAULT_PIECE_HANDLING, shadow},
    sides: {han: piece(size), cho: piece(size)},
    pieces: {"han-general": piece(size + 0.05), "cho-general": piece(size + 0.05)},
  };
}

const hanjaPieceSetStyle = set("Hanja", 0.5, "#111111");
const hangulPieceSetStyle = set("Hangul", 0.8, "#222222");

it("is the set itself where both armies wear the same one", () => {
  expect(combinedPieceSet({han: hangulPieceSetStyle, cho: hangulPieceSetStyle})).toBe(hangulPieceSetStyle);
});

it("draws each army as its own set does", () => {
  const combinedPieceSetStyle = combinedPieceSet({han: hanjaPieceSetStyle, cho: hangulPieceSetStyle});

  expect(combinedPieceSetStyle.sides.han).toBe(hanjaPieceSetStyle.sides.han);
  expect(combinedPieceSetStyle.sides.cho).toBe(hangulPieceSetStyle.sides.cho);
  expect(combinedPieceSetStyle.pieces?.["han-general"]).toBe(hanjaPieceSetStyle.pieces?.["han-general"]);
  expect(combinedPieceSetStyle.pieces?.["cho-general"]).toBe(hangulPieceSetStyle.pieces?.["cho-general"]);
});

it("is handled as Cho's set is, and named for both", () => {
  const combinedPieceSetStyle = combinedPieceSet({han: hanjaPieceSetStyle, cho: hangulPieceSetStyle});

  expect(combinedPieceSetStyle.handling).toBe(hangulPieceSetStyle.handling);
  expect(combinedPieceSetStyle.name).toBe("Hanja and Hangul");
});
