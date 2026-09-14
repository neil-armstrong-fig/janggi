import type {GameState} from "@src/game/types/GameState";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

import {fenOf} from "@src/bot/notation/FenOf";

it("writes the opening position the way Fairy-Stockfish writes its own janggi start", () => {
  const game = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

  expect(fenOf(game)).toBe("rnba1abnr/4k4/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/4K4/RNBA1ABNR w - - 0 1");
});

it("puts han at the top in lower case and cho at the bottom in upper case", () => {
  const game: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "soldier"}, position: {file: 9, rank: 4}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
    ],
  };

  expect(fenOf(game)).toBe("3k5/9/9/8p/9/9/9/9/4K4/R8 w - - 0 1");
});

it("names han to move as black", () => {
  const game: GameState = {...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"), sideToMove: "han"};

  expect(fenOf(game)).toMatch(/ b - - 0 1$/);
});

it("spells every kind of piece with the letter Fairy-Stockfish gives it", () => {
  const game: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "cho", type: "general"}, position: {file: 1, rank: 10}},
      {piece: {side: "cho", type: "guard"}, position: {file: 2, rank: 10}},
      {piece: {side: "cho", type: "horse"}, position: {file: 3, rank: 10}},
      {piece: {side: "cho", type: "elephant"}, position: {file: 4, rank: 10}},
      {piece: {side: "cho", type: "chariot"}, position: {file: 5, rank: 10}},
      {piece: {side: "cho", type: "cannon"}, position: {file: 6, rank: 10}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 7, rank: 10}},
    ],
  };

  expect(fenOf(game)).toBe("9/9/9/9/9/9/9/9/9/KANBRCP2 w - - 0 1");
});
