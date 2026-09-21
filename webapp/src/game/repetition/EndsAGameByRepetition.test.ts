import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {endsAGameByRepetition} from "@src/game/repetition/EndsAGameByRepetition";
import {expect, it} from "vitest";
import {placed} from "@src/testing/Placed";
import {stoodBefore} from "@src/testing/StoodBefore";

/**
 * The third standing of a position, in the one place nothing refuses it: under thirty points a side.
 * Above that `movesFrom` will not offer the move, so a game never stands there a third time and
 * there is nothing to end. See `docs/rules.md` §6.4.
 */

it("ends a game standing in a position for the third time under thirty points a side", () => {
  expect(endsAGameByRepetition(stoodBefore(bare(), 2))).toBe(true);
});

it("does not end it the second time the position stands", () => {
  expect(endsAGameByRepetition(stoodBefore(bare(), 1))).toBe(false);
});

it("does not end it while a position has not stood before", () => {
  expect(endsAGameByRepetition(stoodBefore(bare(), 0))).toBe(false);
});

it("does not end it while cho holds thirty points or more", () => {
  const state = bare(cho("chariot", 1, 8), cho("chariot", 2, 8), cho("cannon", 3, 8));

  expect(endsAGameByRepetition(stoodBefore(state, 2))).toBe(false);
});

it("does not end it while han holds thirty points or more", () => {
  const state = bare(han("chariot", 1, 3), han("chariot", 2, 3), han("cannon", 3, 3));

  expect(endsAGameByRepetition(stoodBefore(state, 2))).toBe(false);
});

it("ends a scored game as it does a casual one, the format deciding only what the ending settles", () => {
  expect(endsAGameByRepetition(stoodBefore({...bare(), format: "Scored"}, 2))).toBe(true);
});

function bare(...alsoStanding: readonly PlacedPiece[]): GameState {
  return {
    pieces: [cho("general", 5, 9), han("general", 4, 2), ...alsoStanding],
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
    drawAgreed: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
