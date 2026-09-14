import type {GameState} from "@src/game/types/GameState";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {bikjangLineIn} from "@src/react/pages/game/components/board/components/bikjang-line/utils/BikjangLineIn";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

it("draws nothing before a bikjang is called", () => {
  expect(bikjangLineIn(opening())).toBeUndefined();
});

it("draws the file from Han's general to Cho's once one is called", () => {
  expect(bikjangLineIn({...opening(), bikjangCalled: true})).toEqual({
    from: {file: 5, rank: 2},
    to: {file: 5, rank: 9},
  });
});

it("draws nothing where a general is not on the board to draw it to", () => {
  const game = opening();
  const withoutChoGeneral = game.pieces.filter(({piece}) => !(piece.side === "cho" && piece.type === "general"));

  expect(bikjangLineIn({...game, pieces: withoutChoGeneral, bikjangCalled: true})).toBeUndefined();
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
