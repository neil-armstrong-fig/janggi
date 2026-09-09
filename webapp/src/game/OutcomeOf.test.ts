import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * Cho's general on its palace centre with three han chariots covering the palace is the mate these
 * tests reuse; two rested turns in a row is the other ending. See `docs/rules.md` §6.1 and §6.3.
 */

it("is undecided while there is still a turn to take", () => {
  const state = restedTurns(0, cho("general", 5, 9), han("general", 5, 2));

  expect(outcomeOf(state)).toEqual({kind: "undecided"});
});

it("is undecided after one rested turn, one player being nobody's agreement", () => {
  const state = restedTurns(1, cho("general", 5, 9), han("general", 5, 2));

  expect(outcomeOf(state)).toEqual({kind: "undecided"});
});

it("is a checkmate when the army to move is mated, won by the other", () => {
  expect(outcomeOf(matedGame())).toEqual({kind: "checkmate", winner: "han"});
});

it("is a points win once both armies have rested a turn in a row", () => {
  const state = restedTurns(2, cho("general", 5, 9), han("general", 5, 2));

  expect(outcomeOf(state).kind).toBe("pointsWin");
});

it("gives a points win to the army with more left on the board", () => {
  const state = restedTurns(
    2,
    cho("general", 5, 9),
    cho("chariot", 1, 10),
    cho("soldier", 1, 7),
    han("general", 5, 2),
    han("chariot", 1, 1),
  );

  expect(outcomeOf(state)).toEqual({kind: "pointsWin", winner: "cho", scores: {cho: 15, han: 14.5}});
});

/** The whole of what the half point is for. Level on the board, and still somebody has won. */
it("gives a points win to han on the 덤 alone when the boards are level", () => {
  const state = restedTurns(2, cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2), han("chariot", 1, 1));

  expect(outcomeOf(state)).toEqual({kind: "pointsWin", winner: "han", scores: {cho: 13, han: 14.5}});
});

function matedGame(): GameState {
  return restedTurns(
    0,
    cho("general", 5, 9),
    han("general", 5, 2),
    han("chariot", 4, 1),
    han("chariot", 6, 1),
    han("chariot", 5, 3),
  );
}

function restedTurns(consecutivePasses: number, ...pieces: readonly PlacedPiece[]): GameState {
  return {pieces, sideToMove: "cho", consecutivePasses};
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
