import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";
import {placed} from "@src/testing/Placed";
import {stoodBefore} from "@src/testing/StoodBefore";

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

/**
 * Below thirty points a side a repeated position is allowed, so nothing refuses the third standing —
 * and with nothing to refuse it, nothing would ever end the game. So the third standing ends it. The
 * two armies are two bare generals here, which is as far under thirty as it gets. See
 * `docs/rules.md` §6.4.
 */
it("is a draw when a casual game stands in a position for the third time under thirty points a side", () => {
  const state = stoodBefore(restedTurns(0, cho("general", 5, 9), han("general", 5, 2)), 2);

  expect(outcomeOf(state)).toEqual({kind: "repetition"});
});

it("settles a scored game on points at that third standing, there being no draw to reach", () => {
  const state = stoodBefore({...restedTurns(0, cho("general", 5, 9), han("general", 5, 2)), format: "Scored"}, 2);

  expect(outcomeOf(state)).toEqual({kind: "pointsWin", winner: "han", scores: {cho: 0, han: 1.5}});
});

it("is undecided the second time a position stands, one repeat being no loop", () => {
  const state = stoodBefore(restedTurns(0, cho("general", 5, 9), han("general", 5, 2)), 1);

  expect(outcomeOf(state)).toEqual({kind: "undecided"});
});

/**
 * Above thirty points the third standing is not ended, it is refused: `movesFrom` does not offer the
 * move, so a game never arrives here — and were it handed one that had, this is not the rule that
 * ends it.
 */
it("is undecided at a third standing while either army holds thirty points or more", () => {
  const state = restedTurns(
    0,
    cho("general", 5, 9),
    cho("chariot", 1, 8),
    cho("chariot", 2, 8),
    cho("cannon", 3, 8),
    han("general", 5, 2),
  );

  expect(outcomeOf(stoodBefore(state, 2))).toEqual({kind: "undecided"});
});

/**
 * A mate with two chariots, twenty-six points against none, so that both armies are under thirty and
 * the third standing really does end a game here — a mate with three would be past it and prove nothing.
 * The chariot on rank 10 gives the check and the one on rank 9 covers the two points beside the general.
 */
it("is a checkmate ahead of a third standing, the complete win outranking a loop", () => {
  const mated = restedTurns(
    0,
    cho("general", 4, 10),
    han("general", 5, 2),
    han("chariot", 9, 10),
    han("chariot", 1, 9),
  );

  expect(outcomeOf(mated)).toEqual({kind: "checkmate", winner: "han"});
  expect(outcomeOf(stoodBefore(mated, 2))).toEqual({kind: "checkmate", winner: "han"});
});

/**
 * An agreed draw is a decision both players made, so it is not conditional on the position at all —
 * only on the game being a casual one, which `agreeADraw` is what checks.
 */
it("is a draw once one has been agreed", () => {
  const state: GameState = {...restedTurns(0, cho("general", 5, 9), han("general", 5, 2)), drawAgreed: true};

  expect(outcomeOf(state)).toEqual({kind: "agreement"});
});

it("is a checkmate ahead of an agreement, whatever else the state carries", () => {
  expect(outcomeOf({...matedGame(), drawAgreed: true})).toEqual({kind: "checkmate", winner: "han"});
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
    drawAgreed: false,
  };
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
