import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {canAgreeADraw} from "@src/game/drawing/CanAgreeADraw";
import {expect, it} from "vitest";
import {placed} from "@src/testing/Placed";

/**
 * A draw by agreement is friendly janggi's. A tournament abolished the draw, so the scored format has
 * nothing to agree to. See `docs/rules.md` §6.4.
 */

it("may be agreed in a casual game that is still being played", () => {
  expect(canAgreeADraw(bare("Casual"))).toBe(true);
});

it("may be agreed while the army to move is in check, an agreement stopping the game rather than resting it", () => {
  const state = position("Casual", cho("general", 5, 9), han("general", 4, 2), han("chariot", 5, 3));

  expect(canAgreeADraw(state)).toBe(true);
});

it("may not be agreed in a scored game, which has no draw", () => {
  expect(canAgreeADraw(bare("Scored"))).toBe(false);
});

it("may not be agreed once the game is over", () => {
  expect(canAgreeADraw({...bare("Casual"), consecutivePasses: 2})).toBe(false);
});

it("may not be agreed twice", () => {
  expect(canAgreeADraw({...bare("Casual"), drawAgreed: true})).toBe(false);
});

function bare(format: MatchFormat): GameState {
  return position(format, cho("general", 5, 9), han("general", 4, 2));
}

function position(format: MatchFormat, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove: "cho",
    format,
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
