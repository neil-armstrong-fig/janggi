import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

const inner = setup("Inner Elephant");
const left = setup("Left Elephant");

it("gives cho the first move", () => {
  expect(newGame(inner, inner).sideToMove).toBe("cho");
});

it("opens with the thirty-two pieces the two setups arrange", () => {
  const {pieces} = newGame(inner, inner);

  expect(pieces).toHaveLength(32);
  expect(pieces.filter(({piece}) => piece.side === "han")).toHaveLength(16);
  expect(pieces.filter(({piece}) => piece.side === "cho")).toHaveLength(16);
});

it("lets each army be arranged separately", () => {
  const {pieces} = newGame(inner, left);

  expect(typeAt(pieces, 2, 1)).toBe("horse");
  expect(typeAt(pieces, 2, 10)).toBe("elephant");
});

function typeAt(pieces: ReturnType<typeof newGame>["pieces"], file: number, rank: number): string | undefined {
  return pieces.find(({position}) => position.file === file && position.rank === rank)?.piece.type;
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
