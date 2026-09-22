import type {PieceSetStyle} from "@src/styles/types/PieceSetStyle";
import type {PieceStyle} from "@src/styles/types/PieceStyle";
import {DEFAULT_PIECE_HANDLING} from "@src/styles/defaults/DefaultPieceHandling";
import {expect, it} from "vitest";
import {withArmyOf} from "@src/styles/piece-sets/WithArmyOf";

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

function set(name: string, size: number, pieceHandlingStyle = DEFAULT_PIECE_HANDLING): PieceSetStyle {
  return {
    name,
    handling: pieceHandlingStyle,
    sides: {han: piece(size), cho: piece(size)},
    pieces: {"han-general": piece(size + 0.05), "cho-general": piece(size + 0.05)},
  };
}

const targetPieceSetStyle = set("Target", 0.5, {shadow: "#111111", hoverOutline: 3});
const sourcePieceSetStyle = set("Source", 0.8);

it("draws the army as the source draws it", () => {
  expect(withArmyOf(targetPieceSetStyle, sourcePieceSetStyle, "han").sides.han).toBe(sourcePieceSetStyle.sides.han);
});

it("draws every piece of that army the source gives a style of its own as the source does — the general too", () => {
  expect(withArmyOf(targetPieceSetStyle, sourcePieceSetStyle, "han").pieces?.["han-general"]).toBe(
    sourcePieceSetStyle.pieces?.["han-general"],
  );
});

it("leaves the other army, its own pieces, the name and the handling as they were", () => {
  const changedPieceSetStyle = withArmyOf(targetPieceSetStyle, sourcePieceSetStyle, "han");

  expect(changedPieceSetStyle.sides.cho).toBe(targetPieceSetStyle.sides.cho);
  expect(changedPieceSetStyle.pieces?.["cho-general"]).toBe(targetPieceSetStyle.pieces?.["cho-general"]);
  expect(changedPieceSetStyle.name).toBe("Target");
  expect(changedPieceSetStyle.handling).toBe(targetPieceSetStyle.handling);
});

it("leaves no piece of the army's own behind where the source has none", () => {
  const bare = {...sourcePieceSetStyle, pieces: undefined};

  expect(withArmyOf(targetPieceSetStyle, bare, "han").pieces).toEqual({
    "cho-general": targetPieceSetStyle.pieces?.["cho-general"],
  });
});

it("leaves no list of overrides at all where neither has any", () => {
  const bare = {...targetPieceSetStyle, pieces: undefined};

  expect(withArmyOf(bare, {...sourcePieceSetStyle, pieces: undefined}, "han")).not.toHaveProperty("pieces");
});
