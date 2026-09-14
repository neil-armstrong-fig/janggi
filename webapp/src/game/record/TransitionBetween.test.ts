import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {SETUPS} from "@src/game/setups/Setups";
import type {Setup} from "@src/game/setups/types/Setup";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {applyMove} from "@src/game/ApplyMove";
import {callBikjang} from "@src/game/bikjang/CallBikjang";
import {expect, it} from "vitest";
import {newGame} from "@src/game/NewGame";
import {pass} from "@src/game/passing/Pass";
import {positionAfter} from "@src/game/utils/PositionAfter";
import {transitionBetween} from "@src/game/record/TransitionBetween";

/**
 * Every transition here is made by the engine rather than written out, so what is being read back
 * is a turn the rules actually took — a hand-built "after" could agree with this function and with
 * nothing else.
 */

it("reads a quiet move back as the piece that made it, and where it went", () => {
  const before = opening();
  const after = applyMove(before, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});

  expect(transitionBetween(before, after)).toEqual({
    kind: "moved",
    move: {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}},
    mover: {side: "cho", type: "soldier"},
    taken: undefined,
  });
});

it("names what a move took", () => {
  const before = position(cho("general", 4, 9), cho("chariot", 1, 10), han("general", 5, 2), han("soldier", 1, 4));
  const after = applyMove(before, {from: {file: 1, rank: 10}, to: {file: 1, rank: 4}});

  expect(transitionBetween(before, after)).toEqual({
    kind: "moved",
    move: {from: {file: 1, rank: 10}, to: {file: 1, rank: 4}},
    mover: {side: "cho", type: "chariot"},
    taken: {side: "han", type: "soldier"},
  });
});

/** Two pieces of one kind tell apart only by where they stand, which is the case worth pinning. */
it("tells which of two identical pieces moved", () => {
  const before = opening();
  const after = applyMove(before, {from: {file: 3, rank: 7}, to: {file: 4, rank: 7}});

  expect(transitionBetween(before, after)).toMatchObject({move: {from: {file: 3, rank: 7}, to: {file: 4, rank: 7}}});
});

it("reads a rested turn as the army that rested it", () => {
  const before = opening();

  expect(transitionBetween(before, pass(before))).toEqual({kind: "passed", side: "cho"});
});

it("reads a called bikjang, which moves nothing and takes nobody's turn", () => {
  const before = position(cho("general", 5, 9), han("general", 5, 2), cho("chariot", 1, 10));

  expect(transitionBetween(before, callBikjang(before))).toEqual({kind: "bikjangCalled"});
});

it("has nothing to say about a position and itself", () => {
  const game = opening();

  expect(transitionBetween(game, game)).toBeUndefined();
});

/** Taking a turn back is not a turn, and a caller animating an undo reverses what it already has. */
it("does not read a move backwards", () => {
  const before = opening();
  const after = applyMove(before, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});

  expect(transitionBetween(after, before)).toBeUndefined();
});

/** Two of the moving army's pieces standing somewhere new is two turns, or a hand-built board — never one. */
it("has nothing to say where more than one of the moving army's pieces moved", () => {
  const before = opening();
  const once = applyMove(before, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}});
  const twice = positionAfter({...once, sideToMove: "cho"}, {from: {file: 9, rank: 7}, to: {file: 9, rank: 6}});

  expect(transitionBetween(before, twice)).toBeUndefined();
});

it("has nothing to say about two games dealt from different setups", () => {
  const one = newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
  const other = newGame(setup("Outer Elephant"), setup("Left Elephant"), "Casual");

  expect(transitionBetween(one, other)).toBeUndefined();
});

function opening(): GameState {
  return newGame(setup("Inner Elephant"), setup("Inner Elephant"), "Casual");
}

function setup(name: string): Setup {
  const found = SETUPS.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Setups.ts no longer exports a setup called "${name}"`);

  return found;
}

function position(...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}

function cho(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("cho", type, file, rank);
}

function han(type: PieceType, file: number, rank: number): PlacedPiece {
  return placed("han", type, file, rank);
}

function placed(side: Side, type: PieceType, file: number, rank: number): PlacedPiece {
  return {piece: {side, type}, position: {file, rank} as PlacedPiece["position"]};
}
