import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Standing} from "@src/game/types/Standing";
import {positionAfter} from "@src/game/utils/PositionAfter";
import {standingOf} from "@src/game/utils/StandingOf";
import {applyMove} from "@src/game/ApplyMove";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {repetitionHoldsBackAMove} from "@src/game/repetition/RepetitionHoldsBackAMove";

/**
 * Both generals step off their palace centres and back — the shortest circuit that changes nothing,
 * and the one `RepeatingAPosition.test.ts` taps out. Four plies bring the opening round a second time,
 * so after seven han's step home would stand it a third.
 */
const SHUFFLE: readonly Move[] = [
  {from: {file: 5, rank: 9}, to: {file: 5, rank: 10}},
  {from: {file: 5, rank: 2}, to: {file: 5, rank: 1}},
  {from: {file: 5, rank: 10}, to: {file: 5, rank: 9}},
  {from: {file: 5, rank: 1}, to: {file: 5, rank: 2}},
];

const ONE_STEP_SHORT: readonly Move[] = [...SHUFFLE, ...SHUFFLE.slice(0, 3)];

const HAN_SOLDIER_FORWARD: Move = {from: {file: 1, rank: 4}, to: {file: 1, rank: 5}};

it("holds nothing back in the opening", () => {
  expect(repetitionHoldsBackAMove(opening())).toBe(false);
});

it("holds nothing back a step before a second standing, a second being allowed", () => {
  expect(repetitionHoldsBackAMove(playedThrough(opening(), SHUFFLE.slice(0, 3)))).toBe(false);
});

it("holds back the step that would stand a position a third time", () => {
  expect(repetitionHoldsBackAMove(playedThrough(opening(), ONE_STEP_SHORT))).toBe(true);
});

it("holds nothing back once something else has been played instead", () => {
  expect(repetitionHoldsBackAMove(playedThrough(opening(), [...ONE_STEP_SHORT, HAN_SOLDIER_FORWARD]))).toBe(false);
});

it("holds nothing back below thirty points a side, where repeating is allowed", () => {
  const generalsAlone: GameState = {...opening(), pieces: GENERALS};

  expect(repetitionHoldsBackAMove(playedThrough(generalsAlone, ONE_STEP_SHORT))).toBe(false);
});

/**
 * Built rather than played to, because a circuit can never end on a move into check: the last lap would
 * have been refused the same way. `seen` is handed the standing a move would leave twice over, which is
 * all a third standing is.
 */
it("counts a move that would stand a position a third time, where nothing else refuses it", () => {
  expect(
    repetitionHoldsBackAMove(havingStoodTwiceAfter(SCREENED, {from: {file: 1, rank: 1}, to: {file: 1, rank: 2}})),
  ).toBe(true);
});

it("does not count a move into check, the rule of check having refused it before repetition could", () => {
  expect(
    repetitionHoldsBackAMove(havingStoodTwiceAfter(SCREENED, {from: {file: 5, rank: 3}, to: {file: 4, rank: 3}})),
  ).toBe(false);
});

const GENERALS: readonly PlacedPiece[] = [
  {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
  {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
];

/**
 * Han to move, its general screened from a cho chariot down file 5 by a guard, and forty-odd points a
 * side so the repetition rule applies. The guard stepping aside would open the file onto the general.
 */
const SCREENED_PIECES: readonly PlacedPiece[] = [
  {piece: {side: "han", type: "general"}, position: {file: 5, rank: 2}},
  {piece: {side: "han", type: "guard"}, position: {file: 5, rank: 3}},
  {piece: {side: "han", type: "chariot"}, position: {file: 1, rank: 1}},
  {piece: {side: "han", type: "chariot"}, position: {file: 9, rank: 1}},
  {piece: {side: "han", type: "cannon"}, position: {file: 2, rank: 3}},
  {piece: {side: "han", type: "cannon"}, position: {file: 8, rank: 3}},
  {piece: {side: "cho", type: "general"}, position: {file: 5, rank: 9}},
  {piece: {side: "cho", type: "chariot"}, position: {file: 5, rank: 6}},
  {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
  {piece: {side: "cho", type: "cannon"}, position: {file: 2, rank: 8}},
  {piece: {side: "cho", type: "cannon"}, position: {file: 8, rank: 8}},
];

const SCREENED: GameState = {...opening(), sideToMove: "han", pieces: SCREENED_PIECES};

function havingStoodTwiceAfter(state: GameState, move: Move): GameState {
  const standing = standingOf(positionAfter(state, move));
  const elsewhere = Array<Standing>(5).fill(standingOf(opening()));

  return {...state, seen: [...elsewhere, standing, standing]};
}

function opening(): GameState {
  const inner = setupNamed("Inner Elephant");

  return newGame(inner, inner, "Casual");
}

function playedThrough(state: GameState, moves: readonly Move[]): GameState {
  return moves.reduce(applyMove, state);
}

function setupNamed(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}
