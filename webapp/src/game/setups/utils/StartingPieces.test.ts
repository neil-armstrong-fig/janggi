import {SETUPS} from "@src/game/setups/Setups";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {startingPieces} from "@src/game/setups/utils/StartingPieces";

const inner = setup("Inner Elephant");
const outer = setup("Outer Elephant");
const left = setup("Left Elephant");
const right = setup("Right Elephant");

it("opens with sixteen pieces a side", () => {
  const pieces = startingPieces(inner, inner);

  expect(pieces.filter(({piece}) => piece.side === "han")).toHaveLength(16);
  expect(pieces.filter(({piece}) => piece.side === "cho")).toHaveLength(16);
});

it("stands each general on the centre of its own palace", () => {
  const pieces = startingPieces(inner, inner);

  expect(typeAt(pieces, 5, 2)).toBe("general");
  expect(typeAt(pieces, 5, 9)).toBe("general");
});

it("places the five soldiers on the odd files, three ranks ahead of the back rank", () => {
  const cho = startingPieces(inner, inner).filter(({piece}) => piece.side === "cho" && piece.type === "soldier");

  expect(cho.map(({position}) => position.file)).toEqual([1, 3, 5, 7, 9]);
  expect(cho.every(({position}) => position.rank === 7)).toBe(true);
});

it("stands the cannons on files 2 and 8, two ranks in", () => {
  const cho = startingPieces(inner, inner).filter(({piece}) => piece.side === "cho" && piece.type === "cannon");

  expect(cho.map(({position}) => position)).toEqual([
    {file: 2, rank: 8},
    {file: 8, rank: 8},
  ]);
});

it("puts the elephants beside the guards in the inner elephant setup", () => {
  const pieces = startingPieces(inner, inner);

  expect(typeAt(pieces, 3, 10)).toBe("elephant");
  expect(typeAt(pieces, 2, 10)).toBe("horse");
});

it("swaps each flank's pair over in the outer elephant setup", () => {
  const pieces = startingPieces(outer, outer);

  expect(typeAt(pieces, 3, 10)).toBe("horse");
  expect(typeAt(pieces, 2, 10)).toBe("elephant");
});

it("lets the two players choose differently", () => {
  const pieces = startingPieces(inner, outer);

  expect(typeAt(pieces, 2, 1)).toBe("horse");
  expect(typeAt(pieces, 2, 10)).toBe("elephant");
});

/**
 * A back rank is laid out by board file for both armies, so two players who chose the same
 * asymmetric setup get identical ranks file for file and their outer elephants stand on the same
 * wing. This is 엇상, the ordinary case.
 */
it("puts both outer elephants on one wing when the armies choose alike", () => {
  const pieces = startingPieces(left, left);

  expect(typeAt(pieces, 2, 10)).toBe("elephant");
  expect(typeAt(pieces, 2, 1)).toBe("elephant");
});

/**
 * The mirrored board is what opposite choices produce, not identical ones — the outer elephants end
 * up facing each other diagonally, which is 맞상.
 */
it("puts the outer elephants on opposite wings when the armies choose opposite setups", () => {
  const pieces = startingPieces(right, left);

  expect(typeAt(pieces, 2, 10)).toBe("elephant");
  expect(typeAt(pieces, 8, 1)).toBe("elephant");
});

it("leaves the chariots in the corners for every tournament setup", () => {
  for (const chosen of [inner, outer, left]) {
    const pieces = startingPieces(chosen, chosen);

    expect(typeAt(pieces, 1, 10)).toBe("chariot");
    expect(typeAt(pieces, 9, 1)).toBe("chariot");
  }
});

function typeAt(pieces: readonly PlacedPiece[], file: number, rank: number): PieceType | undefined {
  return pieces.find(({position}) => position.file === file && position.rank === rank)?.piece.type;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
