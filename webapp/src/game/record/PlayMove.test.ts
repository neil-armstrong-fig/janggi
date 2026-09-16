import type {File, Rank} from "@src/game/board/types/Position";
import type {Position} from "@src/game/board/types/Position";
import type {GameState} from "@src/game/types/GameState";
import type {Move} from "@src/game/types/Move";
import type {PieceType} from "@janggi/shared/janggi/pieces/PieceType";
import type {PlacedPiece} from "@src/game/board/types/PlacedPiece";
import type {Side} from "@janggi/shared/janggi/pieces/Side";
import {applyMove} from "@src/game/ApplyMove";
import {expect, it} from "vitest";
import {playMove} from "@src/game/record/PlayMove";
import {playedGameFrom} from "@src/game/record/PlayedGameFrom";
import {undo} from "@src/game/record/Undo";
import {placed} from "@src/testing/Placed";

it("plays the move onto the position the game stands at", () => {
  const state = board();

  expect(playMove(playedGameFrom(state), move({file: 1, rank: 10}, {file: 1, rank: 5})).present).toEqual(
    applyMove(state, move({file: 1, rank: 10}, {file: 1, rank: 5})),
  );
});

it("keeps the position the move was played from", () => {
  const state = board();

  expect(playMove(playedGameFrom(state), move({file: 1, rank: 10}, {file: 1, rank: 5})).past).toEqual([state]);
});

it("leaves nothing to play again, a move being the newest thing in the game", () => {
  const played = playMove(playedGameFrom(board()), move({file: 1, rank: 10}, {file: 1, rank: 5}));

  expect(played.future).toEqual([]);
});

/** The move that was taken back is not a branch kept beside the one played instead. */
it("forgets a move that had been taken back", () => {
  const played = undo(playMove(playedGameFrom(board()), move({file: 1, rank: 10}, {file: 1, rank: 5})));

  expect(playMove(played, move({file: 1, rank: 10}, {file: 1, rank: 8})).future).toEqual([]);
});

it("leaves the record it was handed untouched, so a game stays replayable", () => {
  const played = playedGameFrom(board());

  playMove(played, move({file: 1, rank: 10}, {file: 1, rank: 5}));

  expect(played.past).toEqual([]);
  expect(played.present).toEqual(board());
});

it("refuses a move the rules do not allow, in the engine's own words", () => {
  const played = playedGameFrom(board());

  expect(() => playMove(played, move({file: 1, rank: 10}, {file: 2, rank: 9}))).toThrow("cannot move");
});

it("refuses to move a piece belonging to the other army", () => {
  const played = playedGameFrom(board());

  expect(() => playMove(played, move({file: 5, rank: 2}, {file: 5, rank: 3}))).toThrow("cho to move");
});

it("refuses once the game is over", () => {
  const played = playedGameFrom(toMove("cho", 2, cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2)));

  expect(() => playMove(played, move({file: 1, rank: 10}, {file: 1, rank: 5}))).toThrow("The game is over");
});

function board(): GameState {
  return toMove("cho", 0, cho("general", 5, 9), cho("chariot", 1, 10), han("general", 5, 2));
}

/** Spelled out in `File` and `Rank`, so a coordinate off the edge of the board is a compile error. */
function move(from: Position, to: Position): Move {
  return {from, to};
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
