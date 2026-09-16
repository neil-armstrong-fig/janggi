import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import {callBikjangIn} from "@src/game/record/CallBikjangIn";
import {expect, it} from "vitest";
import {outcomeOf} from "@src/game/OutcomeOf";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {undo} from "@src/game/record/Undo";
import {placed} from "@src/testing/Placed";

/** 빅장 recorded — `callBikjang`'s counterpart to `playMove`. See `docs/rules.md` §6.2. */

it("calls the bikjang on the position the game stands at", () => {
  const played = callBikjangIn(playedGameFrom(bikjang()));

  expect(outcomeOf(played.present)).toEqual({kind: "bikjang"});
});

it("keeps the position the call was made from", () => {
  const state = bikjang();

  expect(callBikjangIn(playedGameFrom(state)).past).toEqual([state]);
});

it("leaves every piece where it stood, a call moving nothing", () => {
  const state = bikjang();

  expect(callBikjangIn(playedGameFrom(state)).present.pieces).toEqual(state.pieces);
});

/** The reason the call is recorded at all: undo is what a player reaches for once a game has ended. */
it("puts the game back to where it was when the call is taken back", () => {
  const state = bikjang();

  const back = undo(callBikjangIn(playedGameFrom(state)));

  expect(back.present).toEqual(state);
  expect(outcomeOf(back.present)).toEqual({kind: "undecided"});
});

it("throws exactly as callBikjang does, when there is no bikjang standing", () => {
  const apart = position(cho("general", 4, 9), han("general", 5, 2));

  expect(() => callBikjangIn(playedGameFrom(apart))).toThrow(/not facing each other/);
});

function bikjang(): GameState {
  return position(cho("general", 5, 9), han("general", 5, 2), han("chariot", 9, 3));
}

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

function cho(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "cho", type, file, rank});
}

function han(type: PieceType, file: File, rank: Rank): PlacedPiece {
  return placed({side: "han", type, file, rank});
}
