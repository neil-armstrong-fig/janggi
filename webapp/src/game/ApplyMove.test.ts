import type {GameState} from "@src/game/types/GameState";
import {applyMove} from "@src/game/ApplyMove";
import {expect, it} from "vitest";
import {pieceAt} from "@src/game/board/lookup/PieceAt";
import {piecesByPosition} from "@src/game/board/lookup/PiecesByPosition";
import {standingOf} from "@src/game/utils/StandingOf";

const chariotFacingASoldier: GameState = {
  pieces: [
    {piece: {side: "cho", type: "chariot"}, position: {file: 1, rank: 10}},
    {piece: {side: "han", type: "soldier"}, position: {file: 1, rank: 7}},
  ],
  sideToMove: "cho",
  format: "Casual",
  consecutivePasses: 0,
  seen: [],
  reachedByAGeneralCapture: false,
  bikjangCalled: false,
};

it("stands the piece on the point it moved to", () => {
  const after = applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 8}});

  expect(pieceAt(piecesByPosition(after.pieces), {file: 1, rank: 8})).toEqual({side: "cho", type: "chariot"});
});

it("leaves nothing behind on the point it came from", () => {
  const after = applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 8}});

  expect(pieceAt(piecesByPosition(after.pieces), {file: 1, rank: 10})).toBeUndefined();
});

it("takes the enemy piece that was standing where it landed", () => {
  const after = applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 7}});

  expect(after.pieces).toHaveLength(1);
  expect(pieceAt(piecesByPosition(after.pieces), {file: 1, rank: 7})).toEqual({side: "cho", type: "chariot"});
});

/** What `seen` is for: the history repetition is measured against. See `docs/rules.md` §6.4. */
it("remembers the position it was played from", () => {
  const after = applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 8}});

  expect(after.seen).toEqual([standingOf(chariotFacingASoldier)]);
});

/**
 * A capture cannot be undone by playing on, so no position from before one can ever come round
 * again and there is nothing left worth remembering. It is also what keeps the list short.
 */
it("forgets where the game has been once a piece is taken", () => {
  const played = applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 8}});
  const taken = applyMove({...played, sideToMove: "cho"}, {from: {file: 1, rank: 8}, to: {file: 1, rank: 7}});

  expect(played.seen).toHaveLength(1);
  expect(taken.seen).toEqual([]);
});

it("hands the turn to the other army", () => {
  const after = applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 8}});

  expect(after.sideToMove).toBe("han");
});

it("leaves the state it was given exactly as it found it", () => {
  applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 1, rank: 7}});

  expect(chariotFacingASoldier.pieces).toHaveLength(2);
  expect(chariotFacingASoldier.sideToMove).toBe("cho");
});

it("refuses a move the piece could not have made", () => {
  expect(() => applyMove(chariotFacingASoldier, {from: {file: 1, rank: 10}, to: {file: 2, rank: 9}})).toThrow(
    /cannot move/,
  );
});

it("refuses a move by the army whose turn it is not", () => {
  expect(() => applyMove(chariotFacingASoldier, {from: {file: 1, rank: 7}, to: {file: 1, rank: 6}})).toThrow(
    /cho to move/,
  );
});

/** Two rested turns stop a game whose position still has plenty to play. `docs/rules.md` §6.3. */
it("refuses a move once both armies have rested a turn and ended the game", () => {
  const stopped: GameState = {...chariotFacingASoldier, consecutivePasses: 2};

  expect(() => applyMove(stopped, {from: {file: 1, rank: 10}, to: {file: 1, rank: 8}})).toThrow("The game is over");
});

it("refuses a move from a point with no piece on it", () => {
  expect(() => applyMove(chariotFacingASoldier, {from: {file: 5, rank: 5}, to: {file: 5, rank: 4}})).toThrow(
    /No piece/,
  );
});
