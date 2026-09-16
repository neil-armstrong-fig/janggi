import type {File, Rank} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {expect, it} from "vitest";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {restTurn} from "@src/game/record/RestTurn";
import {undo} from "@src/game/record/Undo";
import {placed} from "@src/testing/Placed";

/** 한수쉼 recorded — `pass`'s counterpart to `playMove`. See `docs/rules.md` §6.3. */

it("rests the turn on the position the game stands at", () => {
  const played = restTurn(playedGameFrom(board()));

  expect(played.present.sideToMove).toBe("han");
  expect(played.present.consecutivePasses).toBe(1);
});

it("keeps the position the turn was rested from", () => {
  const state = board();

  expect(restTurn(playedGameFrom(state)).past).toEqual([state]);
});

it("leaves every piece where it stood, a rested turn moving nothing", () => {
  const state = board();

  expect(restTurn(playedGameFrom(state)).present.pieces).toEqual(state.pieces);
});

it("forgets a turn that had been taken back", () => {
  const played = undo(restTurn(playedGameFrom(board())));

  expect(restTurn(played).future).toEqual([]);
});

it("leaves the record it was handed untouched, so a game stays replayable", () => {
  const played = playedGameFrom(board());

  restTurn(played);

  expect(played.past).toEqual([]);
  expect(played.present.consecutivePasses).toBe(0);
});

it("refuses while the army to move is in check, resting being no answer to one", () => {
  const played = playedGameFrom(toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2), han("chariot", 5, 3)));

  expect(() => restTurn(played)).toThrow("cho is in check");
});

it("refuses once the game is over", () => {
  const played = playedGameFrom(toMove("cho", 2, cho("general", 5, 9), han("general", 5, 2)));

  expect(() => restTurn(played)).toThrow("The game is over");
});

function board(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), han("general", 5, 2));
}

function toMove(sideToMove: Side, consecutivePasses: number, ...pieces: readonly PlacedPiece[]): GameState {
  return {
    pieces,
    sideToMove,
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
