import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {callBikjang} from "@src/game/bikjang/CallBikjang";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";

/**
 * The call itself. What it settles is `outcomeOf`'s to say and differs by format, which is why the
 * two endings are asserted through it rather than read off the state. See `docs/rules.md` §6.2.
 */

it("stops the game", () => {
  expect(callBikjang(bikjang("Casual")).bikjangCalled).toBe(true);
});

it("draws a casual game", () => {
  expect(outcomeOf(callBikjang(bikjang("Casual")))).toEqual({kind: "bikjang"});
});

it("settles a scored game on points, there being no draw to reach", () => {
  const called = callBikjang(bikjang("Scored"));

  expect(outcomeOf(called)).toEqual({kind: "pointsWin", winner: "han", scores: {cho: 0, han: 14.5}});
});

it("moves nothing and takes nobody's turn", () => {
  const state = bikjang("Casual");
  const called = callBikjang(state);

  expect(called.pieces).toEqual(state.pieces);
  expect(called.sideToMove).toBe(state.sideToMove);
});

it("refuses a call where the generals are not facing each other", () => {
  const state = position("Casual", cho("general", 4, 9), han("general", 5, 2));

  expect(() => callBikjang(state)).toThrow(/not facing each other/);
});

it("refuses a scored call above thirty points a side", () => {
  const state = position(
    "Scored",
    cho("general", 5, 9),
    cho("chariot", 1, 8),
    cho("chariot", 2, 8),
    cho("cannon", 3, 8),
    han("general", 5, 2),
  );

  expect(() => callBikjang(state)).toThrow(/thirty points a side/);
});

it("refuses a call once the game is already over", () => {
  const state: GameState = {...bikjang("Casual"), consecutivePasses: 2};

  expect(() => callBikjang(state)).toThrow(/game is over/);
});

function bikjang(format: MatchFormat): GameState {
  return position(format, cho("general", 5, 9), han("general", 5, 2), han("chariot", 9, 3));
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
