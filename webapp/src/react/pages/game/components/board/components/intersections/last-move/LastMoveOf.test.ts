import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {expect, it} from "vitest";
import {lastMoveOf} from "@src/react/pages/game/components/board/components/intersections/last-move/LastMoveOf";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {restTurn} from "@src/game/record/RestTurn";
import {undo} from "@src/game/record/Undo";

const CHO_STEP: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};
const HAN_STEP: Move = {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}};

it("has no last move on a game just dealt", () => {
  expect(lastMoveOf(opening())).toBeUndefined();
});

it("names the move just played", () => {
  expect(lastMoveOf(playMove(opening(), CHO_STEP))).toEqual(CHO_STEP);
});

it("names only the most recent of several moves", () => {
  expect(lastMoveOf(playMove(playMove(opening(), CHO_STEP), HAN_STEP))).toEqual(HAN_STEP);
});

it("has no last move once the last turn was rested", () => {
  expect(lastMoveOf(restTurn(playMove(opening(), CHO_STEP)))).toBeUndefined();
});

it("forgets a move once it is taken back", () => {
  expect(lastMoveOf(undo(playMove(opening(), CHO_STEP)))).toBeUndefined();
});

function opening(): PlayedGame {
  return playedGameFrom(newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual"));
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
