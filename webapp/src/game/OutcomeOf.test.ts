import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";
import {placed} from "@src/testing/Placed";

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

/**
 * A bikjang is called rather than befalling anyone, so the position alone decides nothing — every
 * endgame in this file already stands two bare generals down file 5. See `docs/rules.md` §6.2.
 */
it("is undecided while a bikjang stands uncalled", () => {
  const state = restedTurns(0, cho("general", 5, 9), han("general", 5, 2));

  expect(outcomeOf(state)).toEqual({kind: "undecided"});
});

it("is a draw once a bikjang has been called in a casual game", () => {
  const state = called(restedTurns(0, cho("general", 5, 9), han("general", 5, 2)));

  expect(outcomeOf(state)).toEqual({kind: "bikjang"});
});

/** 대한장기연맹 abolished the draw outright in 2020, so the same call settles on points instead. */
it("is a points win once a bikjang has been called in a scored game", () => {
  const bare = restedTurns(0, cho("general", 5, 9), han("general", 5, 2));
  const state: GameState = {...called(bare), format: "Scored"};

  expect(outcomeOf(state)).toEqual({kind: "pointsWin", winner: "han", scores: {cho: 0, han: 1.5}});
});

/** 완승 is a complete win, and it is asked first so that nothing recorded after it can take it away. */
it("is a checkmate ahead of a call, whatever else the state carries", () => {
  expect(outcomeOf(called(matedGame()))).toEqual({kind: "checkmate", winner: "han"});
});

function called(state: GameState): GameState {
  return {...state, bikjangCalled: true};
}

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
  return {
    pieces,
    sideToMove: "cho",
    format: "Casual",
    consecutivePasses,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
