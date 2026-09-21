import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {agreeADraw} from "@src/game/drawing/AgreeADraw";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";
import {placed} from "@src/testing/Placed";

/**
 * The agreement itself. Who offered and who accepted is a conversation the page holds; this is only
 * the yes. See `docs/rules.md` §6.4.
 */

it("stops the game as a draw", () => {
  expect(outcomeOf(agreeADraw(bare("Casual")))).toEqual({kind: "agreement"});
});

it("moves nothing and takes nobody's turn", () => {
  const state = bare("Casual");
  const agreed = agreeADraw(state);

  expect(agreed.pieces).toEqual(state.pieces);
  expect(agreed.sideToMove).toBe(state.sideToMove);
});

it("refuses an agreement in a scored game, which has no draw", () => {
  expect(() => agreeADraw(bare("Scored"))).toThrow(/casual game/);
});

it("refuses an agreement once the game is already over", () => {
  const state: GameState = {...bare("Casual"), consecutivePasses: 2};

  expect(() => agreeADraw(state)).toThrow(/still being played/);
});

function bare(format: MatchFormat): GameState {
  return {
    pieces: [cho("general", 5, 9), han("general", 4, 2)],
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
