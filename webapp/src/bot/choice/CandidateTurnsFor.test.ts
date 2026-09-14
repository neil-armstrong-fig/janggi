import type {GameState} from "@src/game/types/GameState";
import {DEFAULT_SETUP} from "@src/game/setups/Setups";
import {candidateTurnsFor} from "@src/bot/choice/CandidateTurnsFor";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";

it("offers every one of the 31 opening moves and a rested turn besides", () => {
  const turns = candidateTurnsFor(newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"), undefined);

  expect(turns.filter(turn => turn.kind === "move")).toHaveLength(31);
  expect(turns.filter(turn => turn.kind === "pass")).toHaveLength(1);
});

it("offers no rested turn to an army in check", () => {
  const checked: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 4, rank: 1}},
      {piece: {side: "han", type: "chariot"}, position: {file: 5, rank: 5}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
    ],
  };

  expect(candidateTurnsFor(checked, undefined).some(turn => turn.kind === "pass")).toBe(false);
});

it("never offers the call itself, which is decided before the engine is asked", () => {
  const turns = candidateTurnsFor(newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"), undefined);

  expect(turns.some(turn => turn.kind === "callBikjang")).toBe(false);
});

it("leaves out a move that opens the file to a winning casual bot's opponent", () => {
  const screened: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 5, rank: 6}},
    ],
  };

  const turns = candidateTurnsFor(screened, 300);

  expect(turns).not.toContainEqual({kind: "move", move: {from: {file: 5, rank: 6}, to: {file: 4, rank: 6}}});
  expect(turns).toContainEqual({kind: "move", move: {from: {file: 5, rank: 6}, to: {file: 5, rank: 5}}});
});

it("keeps every turn when every one of them would hand the opponent the draw, since it must play something", () => {
  // The bikjang already stands. Cho's general is hemmed in by its own soldiers, so it can only step
  // up file 5, and neither soldier can reach the file — every move keeps the generals facing, and so
  // does resting.
  const cornered: GameState = {
    ...newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual"),
    pieces: [
      {piece: {side: "han", type: "general"}, position: {file: 5, rank: 1}},
      {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 10}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 4, rank: 10}},
      {piece: {side: "cho", type: "soldier"}, position: {file: 6, rank: 10}},
    ],
  };

  const turns = candidateTurnsFor(cornered, 300);

  expect(turns.length).toBeGreaterThan(0);
  expect(turns).toContainEqual({kind: "pass"});
});
