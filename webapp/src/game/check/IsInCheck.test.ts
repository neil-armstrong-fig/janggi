import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {isInCheck} from "@src/game/check/IsInCheck";

/**
 * Positions are built by hand rather than played into, because a check is a shape on the board and
 * spelling the shape out is what makes each case readable. Cho's general sits on (5,9), its own
 * palace centre; file 5 runs the length of the board between the two palaces.
 */

it("is in check from a chariot down an open file", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 1));

  expect(isInCheck(state, "cho")).toBe(true);
});

it("is not in check when something stands in the chariot's way", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 1), han("soldier", 5, 5));

  expect(isInCheck(state, "cho")).toBe(false);
});

it("is not in check when the piece in the way is its own", () => {
  const state = position(cho("general", 5, 9), han("chariot", 5, 1), cho("soldier", 5, 5));

  expect(isInCheck(state, "cho")).toBe(false);
});

/** A cannon cannot move at all without exactly one piece to jump, so it cannot give check either. */
it("is not in check from a cannon with nothing to jump", () => {
  const state = position(cho("general", 5, 9), han("cannon", 5, 1));

  expect(isInCheck(state, "cho")).toBe(false);
});

it("is in check from a cannon once it has a screen", () => {
  const state = position(cho("general", 5, 9), han("cannon", 5, 1), han("soldier", 5, 5));

  expect(isInCheck(state, "cho")).toBe(true);
});

it("answers for either army", () => {
  const state = position(han("general", 5, 2), cho("chariot", 5, 10));

  expect(isInCheck(state, "han")).toBe(true);
  expect(isInCheck(state, "cho")).toBe(false);
});

/**
 * A piece pinned against its own general still gives check, so the question has to be asked of what
 * a piece attacks rather than of what it may legally play.
 */
it("is in check from a piece that could not legally move, because it is pinned", () => {
  const state = position(
    cho("general", 5, 9),
    han("chariot", 5, 1),
    han("horse", 4, 7),
    han("general", 4, 2),
    cho("chariot", 4, 10),
  );

  expect(isInCheck(state, "cho")).toBe(true);
});

it("is not in check when nothing reaches the general", () => {
  const state = position(cho("general", 5, 9), han("chariot", 1, 1));

  expect(isInCheck(state, "cho")).toBe(false);
});

/** Nothing can be in check without a general, which is the position a captured one leaves behind. */
it("is not in check with no general on the board", () => {
  const state = position(han("chariot", 5, 1));

  expect(isInCheck(state, "cho")).toBe(false);
});

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
