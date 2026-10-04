import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import type {GameState} from "@janggi/engine/types/GameState";
import {expect, it} from "vitest";
import {newGame} from "@janggi/engine/NewGame";
import {uciOfTurn} from "@src/bot/notation/UciOfTurn";

const opening: GameState = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

it("writes a move in the engine's squares", () => {
  expect(uciOfTurn(opening, {kind: "move", move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}}})).toBe("a4a5");
});

it("writes a rested turn as the engine's pass, the general staying where it stands", () => {
  expect(uciOfTurn(opening, {kind: "pass"})).toBe("e2e2");
});

it("refuses a bikjang call, which is decided before the engine is asked and never offered to it", () => {
  expect(() => uciOfTurn(opening, {kind: "callBikjang"})).toThrow();
});
