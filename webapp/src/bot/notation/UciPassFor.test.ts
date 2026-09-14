import type {GameState} from "@src/game/types/GameState";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {uciPassFor} from "@src/bot/notation/UciPassFor";

it("writes a rested turn as cho's general standing still, the way the engine lists it", () => {
  expect(uciPassFor(newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"))).toBe("e2e2");
});

it("names han's general when han is to move", () => {
  const game: GameState = {...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"), sideToMove: "han"};

  expect(uciPassFor(game)).toBe("e9e9");
});

it("follows the general wherever it has gone in its palace", () => {
  const opening = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");
  const game: GameState = {
    ...opening,
    pieces: opening.pieces.map(placed =>
      placed.piece.side === "cho" && placed.piece.type === "general"
        ? {...placed, position: {file: 4, rank: 8}}
        : placed,
    ),
  };

  expect(uciPassFor(game)).toBe("d3d3");
});
