import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {MatchFormat} from "@janggi/shared/janggi/settings/MatchFormat";
import type {Move} from "@src/game/types/Move";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {canCallBikjangAfter} from "@src/game/bikjang/CanCallBikjangAfter";
import {expect, it} from "vitest";
import {placed} from "@src/testing/Placed";

/**
 * The question a board asks before a move is made, where `canCallBikjang` is asked after it. So it
 * is the format's answer over again, put to the position the move would leave — see
 * `CanCallBikjang.test.ts` for the two formats themselves.
 */

it("says the last piece between the generals stepping off the file leaves a bikjang to call", () => {
  const state = position("Casual", "cho", cho("soldier", 5, 5));

  expect(canCallBikjangAfter(state, move(5, 5, 4, 5))).toBe(true);
});

it("says a piece that stays on the file leaves nothing to call", () => {
  const state = position("Casual", "cho", cho("soldier", 5, 5));

  expect(canCallBikjangAfter(state, move(5, 5, 5, 4))).toBe(false);
});

it("says a piece leaving the file has nothing to call while another still stands between the generals", () => {
  const state = position("Casual", "cho", cho("soldier", 5, 5), han("soldier", 5, 4));

  expect(canCallBikjangAfter(state, move(5, 5, 4, 5))).toBe(false);
});

it("says a general stepping onto the file to face the other leaves a bikjang to call", () => {
  const state = position("Casual", "cho", cho("general", 4, 9));

  expect(canCallBikjangAfter(state, move(4, 9, 5, 9))).toBe(true);
});

it("says a chariot taking the blocker leaves nothing to call, since it stands where the blocker stood", () => {
  const state = position("Casual", "cho", cho("chariot", 1, 5), han("soldier", 5, 5));

  expect(canCallBikjangAfter(state, move(1, 5, 5, 5))).toBe(false);
});

it("says a scored move is a risk once both armies are under thirty", () => {
  const state = position("Scored", "cho", cho("soldier", 5, 5), cho("chariot", 1, 8));

  expect(canCallBikjangAfter(state, move(5, 5, 4, 5))).toBe(true);
});

it("says a scored move is no risk while either army is still on thirty or more", () => {
  const state = position(
    "Scored",
    "cho",
    cho("soldier", 5, 5),
    cho("chariot", 1, 8),
    cho("chariot", 2, 8),
    cho("cannon", 3, 8),
  );

  expect(canCallBikjangAfter(state, move(5, 5, 4, 5))).toBe(false);
});

/** "단, 궁으로 상대 기물 취하면서 빅장이 되는 경우는 예외로 한다." */
it("says a scored general taking its way onto the file is no risk, the exception being the format's", () => {
  const state = position("Scored", "cho", cho("general", 4, 9), han("soldier", 5, 9));

  expect(canCallBikjangAfter(state, move(4, 9, 5, 9))).toBe(false);
});

it("says a casual general taking its way onto the file is a risk all the same", () => {
  const state = position("Casual", "cho", cho("general", 4, 9), han("soldier", 5, 9));

  expect(canCallBikjangAfter(state, move(4, 9, 5, 9))).toBe(true);
});

it("leaves the position it was asked about alone", () => {
  const state = position("Casual", "cho", cho("soldier", 5, 5));
  const before = structuredClone(state);

  canCallBikjangAfter(state, move(5, 5, 4, 5));

  expect(state).toEqual(before);
});

/**
 * Han's general on the middle file with a chariot to keep the game going, cho's general on the same
 * file unless it is one of the pieces named, and whatever else is named.
 */
function position(format: MatchFormat, sideToMove: Side, ...rest: readonly PlacedPiece[]): GameState {
  const pieces = [han("general", 5, 2), han("chariot", 9, 3), ...rest];

  return {
    pieces: rest.some(({piece}) => piece.side === "cho" && piece.type === "general")
      ? pieces
      : [...pieces, cho("general", 5, 9)],
    sideToMove,
    format,
    consecutivePasses: 0,
    seen: [],
    reachedByAGeneralCapture: false,
    bikjangCalled: false,
  };
}

function move(fromFile: File, fromRank: Rank, toFile: File, toRank: Rank): Move {
  return {from: {file: fromFile, rank: fromRank}, to: {file: toFile, rank: toRank}};
}

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
