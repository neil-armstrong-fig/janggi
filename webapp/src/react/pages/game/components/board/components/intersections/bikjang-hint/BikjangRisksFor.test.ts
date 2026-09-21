import type {GameState} from "@src/game/types/GameState";
import type {Position} from "@src/game/board/types/Position";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import {applyMove} from "@src/game/ApplyMove";
import {bikjangRisksFor} from "@src/react/pages/game/components/board/components/intersections/bikjang-hint/BikjangRisksFor";
import {expect, it} from "vitest";
import {movesFrom} from "@src/game/MovesFrom";
import {newGame} from "@src/game/NewGame";

/**
 * Cho's soldier has stepped off file 5, so han's is the one piece left between the generals: stepping
 * it sideways opens the file, stepping it forward keeps it closed. See `SeeingABikjangRisk.test.ts`
 * for the same position played by tapping.
 */

const HAN_BLOCKER: Position = {file: 5, rank: 4};
const BLOCKER_FORWARD: Position = {file: 5, rank: 5};
const BLOCKER_STEPS_LEFT: Position = {file: 4, rank: 4};
const BLOCKER_STEPS_RIGHT: Position = {file: 6, rank: 4};
const ANOTHER_HAN_SOLDIER: Position = {file: 1, rank: 4};

it("marks the two steps that would open the file, and not the one that keeps it closed", () => {
  const game = afterChoClearsFileFive();

  const risks = bikjangRisksFor(game, HAN_BLOCKER, movesFrom(game, HAN_BLOCKER));

  expect(risks).toEqual(new Set(["f4r4", "f6r4"]));
});

it("answers for each point it is handed on its own", () => {
  const game = afterChoClearsFileFive();

  expect(movesFrom(game, HAN_BLOCKER)).toContainEqual(BLOCKER_FORWARD);
  expect(bikjangRisksFor(game, HAN_BLOCKER, [BLOCKER_FORWARD])).toEqual(new Set());
  expect(bikjangRisksFor(game, HAN_BLOCKER, [BLOCKER_STEPS_LEFT])).toEqual(new Set(["f4r4"]));
  expect(bikjangRisksFor(game, HAN_BLOCKER, [BLOCKER_STEPS_RIGHT])).toEqual(new Set(["f6r4"]));
});

it("marks nothing for a piece with nothing to do with the file", () => {
  const game = afterChoClearsFileFive();

  const risks = bikjangRisksFor(game, ANOTHER_HAN_SOLDIER, movesFrom(game, ANOTHER_HAN_SOLDIER));

  expect(risks).toEqual(new Set());
});

it("marks nothing while no piece is in question", () => {
  expect(bikjangRisksFor(afterChoClearsFileFive(), undefined, [BLOCKER_STEPS_LEFT])).toEqual(new Set());
});

it("marks nothing in the opening, where every file has a piece on it", () => {
  const game = openingGame();
  const soldier: Position = {file: 5, rank: 7};

  expect(bikjangRisksFor(game, soldier, movesFrom(game, soldier))).toEqual(new Set());
});

function openingGame(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

/** The opening with cho's soldier stepped off file 5, so it is han's turn and the file has one piece on it. */
function afterChoClearsFileFive(): GameState {
  return applyMove(openingGame(), {from: {file: 5, rank: 7}, to: {file: 4, rank: 7}});
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
