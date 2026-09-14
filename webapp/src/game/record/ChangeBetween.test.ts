import type {Move} from "@src/game/types/Move";
import type {PlayedGame} from "@src/game/record/types/PlayedGame";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {changeBetween} from "@src/game/record/ChangeBetween";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {redo} from "@src/game/record/Redo";
import {restTurn} from "@src/game/record/RestTurn";
import {undo} from "@src/game/record/Undo";

/** Every record here is built by the engine, because identity is the whole of what is being read. */

const SOLDIER_STEP: Move = {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}};
const OTHER_SOLDIER_STEP: Move = {from: {file: 9, rank: 7}, to: {file: 9, rank: 6}};

const STEPPED = {
  kind: "moved",
  move: SOLDIER_STEP,
  mover: {side: "cho", type: "soldier"},
  taken: undefined,
};

it("reads a move played as the record advancing by that move", () => {
  const before = opening();

  expect(changeBetween(before, playMove(before, SOLDIER_STEP))).toEqual({direction: "advanced", transition: STEPPED});
});

it("reads a rested turn as the record advancing by it", () => {
  const before = opening();

  expect(changeBetween(before, restTurn(before))).toEqual({
    direction: "advanced",
    transition: {kind: "passed", side: "cho"},
  });
});

it("reads a move taken back as that same move, the direction saying it ran backwards", () => {
  const before = playMove(opening(), SOLDIER_STEP);

  expect(changeBetween(before, undo(before))).toEqual({direction: "takenBack", transition: STEPPED});
});

it("reads a move played again as replayed", () => {
  const before = undo(playMove(opening(), SOLDIER_STEP));

  expect(changeBetween(before, redo(before))).toEqual({direction: "replayed", transition: STEPPED});
});

/** Play going somewhere new after a take-back empties `future`, and must not pass for a replay. */
it("reads a different move played after a take-back as advancing, not as replaying", () => {
  const before = undo(playMove(opening(), SOLDIER_STEP));

  expect(changeBetween(before, playMove(before, OTHER_SOLDIER_STEP))).toMatchObject({
    direction: "advanced",
    transition: {move: OTHER_SOLDIER_STEP},
  });
});

it("reads a fresh deal as dealt, with no turn in it", () => {
  const before = playMove(opening(), SOLDIER_STEP);

  expect(changeBetween(before, opening())).toEqual({direction: "dealt", transition: undefined});
});

/** A new deal of the very same setups is still a new game, and shares no position with the old one. */
it("reads a fresh deal of an untouched game as dealt too", () => {
  expect(changeBetween(opening(), opening())).toMatchObject({direction: "dealt"});
});

function opening(): PlayedGame {
  return playedGameFrom(newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual"));
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
