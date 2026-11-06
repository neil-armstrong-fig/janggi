import {expect, it} from "vitest";
import {DEFAULT_SETUP} from "@janggi/engine/setups/Setups";
import {isPlayable} from "@src/react/pages/game/hooks/use-scripted-opponent/playable/IsPlayable";
import {newGame} from "@janggi/engine/NewGame";

const OPENING = newGame(DEFAULT_SETUP, DEFAULT_SETUP, "Casual");

it("is a move the rules allow from the position", () => {
  expect(isPlayable(OPENING, {from: {file: 3, rank: 7}, to: {file: 3, rank: 6}})).toBe(true);
});

it("is not a move the piece cannot make", () => {
  expect(isPlayable(OPENING, {from: {file: 3, rank: 7}, to: {file: 3, rank: 5}})).toBe(false);
});

it("is not a move by the army whose turn it is not", () => {
  expect(isPlayable(OPENING, {from: {file: 3, rank: 4}, to: {file: 3, rank: 5}})).toBe(false);
});
